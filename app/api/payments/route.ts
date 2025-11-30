import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    const session = await getSession()
    if (!session || session.role !== 'PROFESSOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payments = await prisma.payment.findMany({
        where: {
            student: {
                studentProfile: {
                    professorId: session.userId as string
                }
            }
        },
        include: { student: { select: { name: true } } },
        orderBy: { date: 'desc' },
    })

    return NextResponse.json({ payments })
}

export async function POST(request: Request) {
    const session = await getSession()
    if (!session || session.role !== 'PROFESSOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { studentId, amount, method, observations } = body

        // Create payment record
        const payment = await prisma.payment.create({
            data: {
                studentId,
                amount: parseFloat(amount),
                method,
                observations,
            },
        })

        // Update student membership expiry (add 30 days)
        const studentProfile = await prisma.studentProfile.findUnique({ where: { userId: studentId } })
        if (studentProfile) {
            const currentExpiry = studentProfile.membershipEndDate && new Date(studentProfile.membershipEndDate) > new Date()
                ? new Date(studentProfile.membershipEndDate)
                : new Date()

            const newExpiry = new Date(currentExpiry.getTime() + 30 * 24 * 60 * 60 * 1000)

            await prisma.studentProfile.update({
                where: { userId: studentId },
                data: { membershipEndDate: newExpiry },
            })
        }

        return NextResponse.json({ payment })
    } catch (error) {
        console.error('Error creating payment:', error)
        return NextResponse.json({ error: 'Error creating payment' }, { status: 500 })
    }
}
