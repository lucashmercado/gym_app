import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// DELETE - Delete exercise
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession()
        if (!session || session.role !== 'PROFESSOR') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id: exerciseId } = await params

        // Check if exercise exists
        const exercise = await prisma.exercise.findUnique({
            where: { id: exerciseId }
        })

        if (!exercise) {
            return NextResponse.json({ error: 'Exercise not found' }, { status: 404 })
        }

        // Delete exercise (this will fail if it's used in plans/templates due to foreign key constraints)
        try {
            await prisma.exercise.delete({
                where: { id: exerciseId }
            })
            return NextResponse.json({ message: 'Exercise deleted successfully' })
        } catch (error: any) {
            if (error.code === 'P2003') {
                return NextResponse.json({
                    error: 'No se puede eliminar el ejercicio porque está siendo usado en planes o plantillas'
                }, { status: 400 })
            }
            throw error
        }
    } catch (error) {
        console.error('Error deleting exercise:', error)
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
