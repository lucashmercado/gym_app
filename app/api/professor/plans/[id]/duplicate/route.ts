import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession()
        if (!session || session.role !== 'PROFESSOR') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id: planId } = await params

        // Get original plan with exercises
        const originalPlan = await prisma.plan.findUnique({
            where: { id: planId },
            include: {
                exercises: {
                    include: {
                        exercise: true
                    }
                }
            }
        })

        if (!originalPlan) {
            return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
        }

        // Verify ownership
        if (originalPlan.professorId !== session.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Create duplicate plan
        const duplicatedPlan = await prisma.plan.create({
            data: {
                name: `${originalPlan.name} (Copia)`,
                description: originalPlan.description,
                studentId: originalPlan.studentId,
                professorId: originalPlan.professorId,
                templateId: originalPlan.templateId,
                startDate: new Date(),
                endDate: originalPlan.endDate ? new Date(new Date().getTime() + (new Date(originalPlan.endDate).getTime() - new Date(originalPlan.startDate).getTime())) : null,
                active: false, // Start as inactive
                exercises: {
                    create: originalPlan.exercises.map(ex => ({
                        exerciseId: ex.exerciseId,
                        sets: ex.sets,
                        reps: ex.reps,
                        weight: ex.weight,
                        rest: ex.rest,
                        day: ex.day,
                        order: ex.order
                    }))
                }
            },
            include: {
                exercises: {
                    include: {
                        exercise: true
                    }
                }
            }
        })

        return NextResponse.json({
            message: 'Plan duplicated successfully',
            plan: duplicatedPlan
        })
    } catch (error) {
        console.error('Error duplicating plan:', error)
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
