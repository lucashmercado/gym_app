import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// PUT - Update plan exercises
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session || session.role !== 'PROFESSOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id } = await params
        const body = await request.json()
        const { exercises } = body

        // Verify plan belongs to professor
        const plan = await prisma.plan.findUnique({
            where: { id }
        })

        if (!plan || plan.professorId !== session.userId) {
            return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
        }

        // Filter out exercises without exerciseId (invalid ones)
        const validExercises = exercises.filter((ex: any) => ex.exerciseId && ex.exerciseId.trim() !== '')

        if (validExercises.length === 0) {
            return NextResponse.json({ error: 'No valid exercises provided' }, { status: 400 })
        }

        // Delete all existing exercises
        await prisma.planExercise.deleteMany({
            where: { planId: id }
        })

        // Create new exercises
        await prisma.planExercise.createMany({
            data: validExercises.map((ex: any, index: number) => ({
                planId: id,
                exerciseId: ex.exerciseId,
                day: ex.day,
                sets: parseInt(ex.sets) || 3,
                reps: ex.reps?.toString() || '10',
                weight: parseFloat(ex.weight) || 0,
                rest: parseInt(ex.rest) || 60,
                order: index
            }))
        })

        const updatedPlan = await prisma.plan.findUnique({
            where: { id },
            include: {
                exercises: {
                    include: {
                        exercise: true
                    },
                    orderBy: { order: 'asc' }
                }
            }
        })

        return NextResponse.json({ plan: updatedPlan })
    } catch (error: any) {
        console.error('Error updating plan:', error)
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
}
