import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET - List all templates for the professor
export async function GET() {
    const session = await getSession()
    if (!session || session.role !== 'PROFESSOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const templates = await prisma.planTemplate.findMany({
        where: { professorId: session.userId as string },
        include: {
            exercises: {
                include: {
                    exercise: true
                },
                orderBy: { order: 'asc' }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ templates })
}

// POST - Create a new template
export async function POST(request: Request) {
    const session = await getSession()
    if (!session || session.role !== 'PROFESSOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, exercises } = body

    if (!name || !exercises || exercises.length === 0) {
        return NextResponse.json(
            { error: 'Name and exercises are required' },
            { status: 400 }
        )
    }

    const template = await prisma.planTemplate.create({
        data: {
            professorId: session.userId as string,
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

    return NextResponse.json({ template }, { status: 201 })
}
