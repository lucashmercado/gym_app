import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const plan = await prisma.plan.findUnique({
        where: { id },
        include: {
            student: { select: { name: true } },
            exercises: {
                include: { exercise: true },
                orderBy: [{ day: 'asc' }, { order: 'asc' }],
            },
        },
    })

    if (!plan) {
        return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // Security check: Professor can see their plans, Student can see their own plans
    if (session.role === 'PROFESSOR' && plan.professorId !== session.userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.role === 'STUDENT' && plan.studentId !== session.userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ plan })
}
