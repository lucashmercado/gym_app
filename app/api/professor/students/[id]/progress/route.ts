import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session || session.role !== 'PROFESSOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: studentId } = await params

    const progress = await prisma.progress.findMany({
        where: { studentId },
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
