import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession()
        if (!session || session.role !== 'PROFESSOR') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id: templateId } = await params

        // Get original template with exercises
        const originalTemplate = await prisma.planTemplate.findUnique({
            where: { id: templateId },
            include: {
                exercises: {
                    include: {
                        exercise: true
                    }
                }
            }
        })

        if (!originalTemplate) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 })
        }

        // Verify ownership
        if (originalTemplate.professorId !== session.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Create duplicate template
        const duplicatedTemplate = await prisma.planTemplate.create({
            data: {
                name: `${originalTemplate.name} (Copia)`,
                description: originalTemplate.description,
                professorId: originalTemplate.professorId,
                exercises: {
                    create: originalTemplate.exercises.map(ex => ({
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
            message: 'Template duplicated successfully',
            template: duplicatedTemplate
        })
    } catch (error) {
        console.error('Error duplicating template:', error)
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
