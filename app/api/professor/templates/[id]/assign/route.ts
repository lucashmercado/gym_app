import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// POST - Assign template to a student (create plan from template)
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session || session.role !== 'PROFESSOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: templateId } = await params
    const body = await request.json()
    const { studentId, startDate, endDate, customExercises } = body

    if (!studentId || !startDate) {
        return NextResponse.json(
            { error: 'Student ID and start date are required' },
            { status: 400 }
        )
    }

    // Verify template belongs to professor
    const template = await prisma.planTemplate.findUnique({
        where: { id: templateId },
        include: {
            exercises: {
                include: {
                    exercise: true
                },
                orderBy: { order: 'asc' }
            }
        }
    })

    if (!template || template.professorId !== session.userId) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Verify student belongs to professor
    const student = await prisma.user.findUnique({
        where: { id: studentId },
        include: { studentProfile: true }
    })

    if (!student || student.studentProfile?.professorId !== session.userId) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Create plan from template with customizations
    const plan = await prisma.plan.create({
        data: {
            studentId,
            professorId: session.userId as string,
            templateId,
            name: template.name,
            description: template.description,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : null,
            exercises: {
                create: template.exercises.map((templateEx, index) => {
                    // Check if there's a custom version for this exercise
                    const custom = customExercises?.find((c: any) => c.templateExerciseId === templateEx.id)

                    return {
                        exerciseId: templateEx.exerciseId,
                        day: templateEx.day,
                        sets: custom?.sets ?? templateEx.sets,
                        reps: custom?.reps ?? templateEx.reps,
                        weight: custom?.weight ?? templateEx.weight,
                        rest: custom?.rest ?? templateEx.rest,
                        order: index
                    }
                })
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

    return NextResponse.json({ plan }, { status: 201 })
}
