import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const session = await getSession()

        if (!session) {
            return NextResponse.json({ user: null })
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId as string },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                active: true,
                phone: true,
                studentProfile: {
                    select: {
                        monthlyFee: true,
                        membershipType: true,
                        membershipEndDate: true
                    }
                }
            }
        })

        return NextResponse.json({ user })
    } catch (error) {
        console.error('Error in /api/auth/me:', error)
        return NextResponse.json({
            user: null,
            error: 'Internal server error'
        }, { status: 500 })
    }
}
