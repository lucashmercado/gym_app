import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET - Get template details
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session || session.role !== 'PROFESSOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const template = await prisma.planTemplate.findUnique({
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

    if (!template || template.professorId !== session.userId) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    return NextResponse.json({ template })
}

// PUT - Update template
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session || session.role !== 'PROFESSOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, description, exercises } = body

    // Verify template belongs to professor
    const existingTemplate = await prisma.planTemplate.findUnique({
        where: { id }
    })

    if (!existingTemplate || existingTemplate.professorId !== session.userId) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Delete existing exercises and create new ones
    await prisma.templateExercise.deleteMany({
        where: { templateId: id }
    })

    const template = await prisma.planTemplate.update({
        where: { id },
        data: {
            name,
            description,
            exercises: {
                create: exercises.map((ex: any, index: number) => ({
                    exerciseId: ex.exerciseId,
                    day: ex.day,
                    sets: ex.sets,
                    reps: ex.reps,
                    weight: ex.weight,
                    rest: ex.rest,
                    order: index
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

    return NextResponse.json({ template })
}

// DELETE - Delete template
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session || session.role !== 'PROFESSOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const template = await prisma.planTemplate.findUnique({
        where: { id }
    })

    if (!template || template.professorId !== session.userId) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    await prisma.planTemplate.delete({
        where: { id }
    })

    return NextResponse.json({ message: 'Template deleted successfully' })
}
