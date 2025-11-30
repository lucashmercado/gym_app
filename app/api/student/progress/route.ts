import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
    const session = await getSession()
    if (!session || session.role !== 'STUDENT') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(request.url)
        const exerciseId = searchParams.get('exerciseId')
        const days = parseInt(searchParams.get('days') || '30')

        // Build where clause
        const where: any = { studentId: session.userId as string }

        // Filter by date
        if (days) {
            where.date = {
                gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
            }
        }

        // Filter by exercise if specified
        if (exerciseId) {
            where.planExercise = {
                exerciseId
            }
        }

        const progress = await prisma.progress.findMany({
            where,
            include: {
                planExercise: {
                    include: {
                        exercise: true
                    }
                }
            },
            orderBy: { date: 'asc' },
        })

        // Get available exercises for the student
        const activePlan = await prisma.plan.findFirst({
            where: {
                studentId: session.userId as string,
                active: true
            },
            include: {
                exercises: {
                    include: {
                        exercise: true
                    }
                }
            }
        })

        const exercises = activePlan?.exercises.map(ex => ({
            id: ex.exerciseId,
            name: ex.exercise.name,
            muscleGroup: ex.exercise.muscleGroup
        })) || []

        return NextResponse.json({
            progress,
            exercises
        })
    } catch (error) {
        console.error('Error fetching progress:', error)
        return NextResponse.json({
            error: 'Error fetching progress',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}


export async function POST(request: Request) {
    const session = await getSession()
    if (!session || session.role !== 'STUDENT') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { planExerciseId, setsDone, repsDone, weightUsed, comments } = body

        const progress = await prisma.progress.create({
            data: {
                studentId: session.userId as string,
                planExerciseId,
                setsDone,
                repsDone,
                weightUsed: weightUsed ? parseFloat(weightUsed) : null,
                comments,
            },
        })

        return NextResponse.json({ progress })
    } catch (error) {
        console.error('Error tracking progress:', error)
        return NextResponse.json({ error: 'Error tracking progress' }, { status: 500 })
    }
}
