import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: Request) {
    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            )
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        })

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({
                message: 'If an account exists with this email, you will receive a password reset link.'
            })
        }

        // Generate reset token
        const token = crypto.randomBytes(32).toString('hex')
        const expiresAt = new Date(Date.now() + 3600000) // 1 hour from now

        // Create password reset record
        await prisma.passwordReset.create({
            data: {
                userId: user.id,
                token,
                expiresAt
            }
        })

        // TODO: Send email with reset link
        // For now, we'll just log it to console
        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password/${token}`
        console.log('Password reset link:', resetLink)
        console.log('User:', user.email)

        return NextResponse.json({
            message: 'If an account exists with this email, you will receive a password reset link.',
            // In development, include the link
            ...(process.env.NODE_ENV === 'development' && { resetLink })
        })
    } catch (error) {
        console.error('Error in forgot password:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
