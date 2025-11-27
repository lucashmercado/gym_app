import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const exercises = await prisma.exercise.findMany({
        orderBy: { name: 'asc' },
    })

    return NextResponse.json({ exercises })
}

export async function POST(request: Request) {
    const session = await getSession()
    if (!session || session.role !== 'PROFESSOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { name, description, muscleGroup, videoUrl } = body

        const exercise = await prisma.exercise.create({
            data: {
                name,
                description,
                muscleGroup,
                videoUrl,
            },
        })

        return NextResponse.json({ exercise })
    } catch (error) {
        console.error('Error creating exercise:', error)
        return NextResponse.json({ error: 'Error creating exercise' }, { status: 500 })
    }
}
