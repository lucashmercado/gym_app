import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    const session = await getSession()
    if (!session || session.role !== 'PROFESSOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const plans = await prisma.plan.findMany({
        where: { professorId: session.userId as string },
        include: { student: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ plans })
}

export async function POST(request: Request) {
    const session = await getSession()
    if (!session || session.role !== 'PROFESSOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { studentId, name, description, startDate, endDate, exercises } = body

        // exercises is an array of { exerciseId, day, sets, reps, weight, rest, order }

        const plan = await prisma.plan.create({
            data: {
                professorId: session.userId as string,
                studentId,
                name,
                description,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                exercises: {
                    create: exercises.map((ex: any) => ({
                        exerciseId: ex.exerciseId,
                        day: ex.day,
                        sets: parseInt(ex.sets),
                        reps: ex.reps,
                        weight: ex.weight ? parseFloat(ex.weight) : null,
                        rest: ex.rest ? parseInt(ex.rest) : null,
                        order: ex.order || 0,
                    })),
                },
            },
        })

        return NextResponse.json({ plan })
    } catch (error) {
        console.error('Error creating plan:', error)
        return NextResponse.json({ error: 'Error creating plan' }, { status: 500 })
    }
}
