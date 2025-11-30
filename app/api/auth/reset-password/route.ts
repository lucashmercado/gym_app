import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { logActivity, ActivityActions, EntityTypes } from '@/lib/activityLogger'

export async function POST(request: Request) {
    try {
        const { token, password } = await request.json()

        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token and password are required' },
                { status: 400 }
            )
        }

        // Validate password strength
        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters long' },
                { status: 400 }
            )
        }

        // Find password reset record
        const resetRecord = await prisma.passwordReset.findUnique({
            where: { token },
            include: { user: true }
        })

        if (!resetRecord) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            )
        }

        // Check if token has expired
        if (resetRecord.expiresAt < new Date()) {
            return NextResponse.json(
                { error: 'Reset token has expired' },
                { status: 400 }
            )
        }

        // Check if token has already been used
        if (resetRecord.used) {
            return NextResponse.json(
                { error: 'Reset token has already been used' },
                { status: 400 }
            )
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Update user password
        await prisma.user.update({
            where: { id: resetRecord.userId },
            data: { password: hashedPassword }
        })

        // Mark token as used
        await prisma.passwordReset.update({
            where: { id: resetRecord.id },
            data: { used: true }
        })

        // Log activity
        await logActivity({
            userId: resetRecord.userId,
            action: ActivityActions.PASSWORD_RESET_COMPLETE,
            entityType: EntityTypes.USER,
            entityId: resetRecord.userId
        })

        return NextResponse.json({
            message: 'Password has been reset successfully'
        })
    } catch (error) {
        console.error('Error in reset password:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
