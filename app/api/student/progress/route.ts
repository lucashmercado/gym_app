import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    const session = await getSession()
    if (!session || session.role !== 'STUDENT') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const progress = await prisma.progress.findMany({
        where: { studentId: session.userId as string },
        include: {
            planExercise: {
                include: {
                    exercise: true
                }
            }
        },
        orderBy: { date: 'desc' },
    })

    return NextResponse.json({ progress })
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
