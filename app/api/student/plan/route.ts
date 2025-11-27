import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    const session = await getSession()
    if (!session || session.role !== 'STUDENT') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const plan = await prisma.plan.findFirst({
        where: {
            studentId: session.userId as string,
            active: true,
        },
        include: {
            exercises: {
                include: { exercise: true },
                orderBy: [{ day: 'asc' }, { order: 'asc' }],
            },
        },
        orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ plan })
}
