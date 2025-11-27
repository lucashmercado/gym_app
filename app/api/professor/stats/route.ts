import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    const session = await getSession()
    if (!session || session.role !== 'PROFESSOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const professorId = session.userId as string

    // Active students
    const activeStudents = await prisma.user.count({
        where: {
            role: 'STUDENT',
            active: true,
            studentProfile: {
                professorId
            },
        },
    })

    // Plans expiring soon (next 7 days)
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)

    const expiringPlans = await prisma.plan.count({
        where: {
            professorId,
            active: true,
            endDate: {
                lte: nextWeek,
                gte: new Date(),
            },
        },
    })

    // Expired plans
    const expiredPlans = await prisma.plan.count({
        where: {
            professorId,
            active: true,
            endDate: {
                lt: new Date(),
            },
        },
    })

    // Monthly revenue (sum of payments in current month)
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const payments = await prisma.payment.aggregate({
        where: {
            student: {
                studentProfile: {
                    professorId
                }
            },
            date: { gte: startOfMonth },
        },
        _sum: { amount: true },
    })

    return NextResponse.json({
        activeStudents,
        expiringPlans,
        expiredPlans,
        monthlyRevenue: payments._sum.amount || 0,
    })
}
