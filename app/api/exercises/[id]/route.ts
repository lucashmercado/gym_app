import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession()
    if (!session || session.role !== 'PROFESSOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    try {
        const exercise = await prisma.exercise.findUnique({
            where: { id },
        })

        if (!exercise) {
            return NextResponse.json({ error: 'Exercise not found' }, { status: 404 })
        }

        return NextResponse.json({ exercise })
    } catch (error: any) {
        console.error('Error fetching exercise:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession()
    if (!session || session.role !== 'PROFESSOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    try {
        const body = await request.json()
        const { name, description, muscleGroup, videoUrl, imageUrl } = body

        const exercise = await prisma.exercise.update({
            where: { id },
            data: {
                name,
                description: description || null,
                muscleGroup: muscleGroup || null,
                videoUrl: videoUrl || null,
                imageUrl: imageUrl || null,
            },
        })

        return NextResponse.json({ exercise })
    } catch (error: any) {
        console.error('Error updating exercise:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession()
    if (!session || session.role !== 'PROFESSOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    try {
        await prisma.exercise.delete({
            where: { id },
        })

        return NextResponse.json({ message: 'Exercise deleted successfully' })
    } catch (error: any) {
        console.error('Error deleting exercise:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
