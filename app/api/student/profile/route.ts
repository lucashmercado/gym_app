import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    try {
        const session = await getSession()
        if (!session || session.role !== 'STUDENT') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const studentId = session.userId as string

        // Get student profile with professor information
        const profile = await prisma.studentProfile.findUnique({
            where: { userId: studentId },
            include: {
                professor: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
        }

        return NextResponse.json({ profile })
    } catch (error) {
        console.error('Error fetching student profile:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
