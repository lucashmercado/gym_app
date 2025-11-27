import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET - List all exercises
export async function GET() {
    const session = await getSession()
    if (!session || session.role !== 'PROFESSOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const exercises = await prisma.exercise.findMany({
        orderBy: { name: 'asc' }
    })

    return NextResponse.json({ exercises })
}
