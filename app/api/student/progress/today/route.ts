import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    const session = await getSession()
    if (!session || session.role !== 'STUDENT') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const completed = await prisma.progress.findMany({
            where: {
                studentId: session.userId,
                date: {
                    gte: today,
                    lt: tomorrow
                }
            },
            select: {
                planExerciseId: true,
                setsDone: true,
                repsDone: true,
                weightUsed: true,
                date: true
            }
        })

        return NextResponse.json({ completed })
    } catch (error: any) {
        console.error('Error fetching today progress:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// DELETE - Reset today's progress for a specific day
export async function DELETE(request: Request) {
    const session = await getSession()
    if (!session || session.role !== 'STUDENT') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(request.url)
        const day = searchParams.get('day')

        if (!day) {
            return NextResponse.json({ error: 'Day parameter required' }, { status: 400 })
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        // Get plan exercises for this day
        const plan = await prisma.plan.findFirst({
            where: {
                studentId: session.userId,
                active: true
            },
            include: {
                exercises: {
                    where: { day: day }
                }
            }
        })

        if (!plan) {
            return NextResponse.json({ error: 'No active plan found' }, { status: 404 })
        }

        const exerciseIds = plan.exercises.map((ex: any) => ex.id)

        // Delete progress for these exercises from today
        await prisma.progress.deleteMany({
            where: {
                studentId: session.userId,
                planExerciseId: { in: exerciseIds },
                date: {
                    gte: today,
                    lt: tomorrow
                }
            }
        })

        return NextResponse.json({ message: 'Day reset successfully' })
    } catch (error: any) {
        console.error('Error resetting day:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
