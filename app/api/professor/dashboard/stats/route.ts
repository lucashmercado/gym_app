import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    try {
        console.log('Dashboard stats API called')

        const session = await getSession()
        console.log('Session:', session)

        if (!session || session.role !== 'PROFESSOR') {
            console.log('Unauthorized access attempt')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const professorId = session.userId
        console.log('Professor ID:', professorId)

        // Get current date info
        const now = new Date()
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

        console.log('Fetching student statistics...')
        // 1. Student statistics - Get students through StudentProfile
        const studentProfiles = await prisma.studentProfile.findMany({
            where: { professorId },
            include: { user: true }
        })

        const totalStudents = studentProfiles.length
        const activeStudents = studentProfiles.filter(profile =>
            profile.membershipEndDate && new Date(profile.membershipEndDate) >= now
        ).length

        console.log('Students:', { total: totalStudents, active: activeStudents })

        console.log('Fetching plan statistics...')
        // 2. Plans statistics
        const activePlans = await prisma.plan.count({
            where: {
                professorId,
                active: true,
                OR: [
                    { endDate: null },
                    { endDate: { gte: now } }
                ]
            }
        })

        const expiredPlans = await prisma.plan.count({
            where: {
                professorId,
                endDate: {
                    lt: now
                }
            }
        })
        console.log('Plans:', { active: activePlans, expired: expiredPlans })

        console.log('Fetching payment statistics...')
        // 3. Payments this month - Get payments from professor's students
        const studentIds = studentProfiles.map(profile => profile.userId)

        const paymentsThisMonth = await prisma.payment.findMany({
            where: {
                studentId: { in: studentIds },
                date: {
                    gte: firstDayOfMonth,
                    lte: lastDayOfMonth
                }
            }
        })

        const totalAmountThisMonth = paymentsThisMonth.reduce((sum, payment) => sum + payment.amount, 0)
        console.log('Payments this month:', { count: paymentsThisMonth.length, total: totalAmountThisMonth })

        console.log('Fetching monthly income...')
        // 4. Monthly income for last 6 months
        const monthlyIncome = []
        for (let i = 5; i >= 0; i--) {
            const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)

            const payments = await prisma.payment.findMany({
                where: {
                    studentId: { in: studentIds },
                    date: {
                        gte: monthDate,
                        lt: nextMonthDate
                    }
                }
            })

            const amount = payments.reduce((sum, payment) => sum + payment.amount, 0)

            monthlyIncome.push({
                month: monthDate.toLocaleDateString('es-AR', { month: 'short' }).replace('.', ''),
                amount
            })
        }
        console.log('Monthly income calculated:', monthlyIncome.length, 'months')

        console.log('Fetching top exercises...')
        // 5. Top exercises (most used in plans)
        let topExercises: Array<{ name: string; count: number }> = []
        try {
            const exerciseUsage = await prisma.planExercise.groupBy({
                by: ['exerciseId'],
                _count: {
                    exerciseId: true
                },
                orderBy: {
                    _count: {
                        exerciseId: 'desc'
                    }
                },
                take: 5
            })

            topExercises = await Promise.all(
                exerciseUsage.map(async (item) => {
                    const exercise = await prisma.exercise.findUnique({
                        where: { id: item.exerciseId }
                    })
                    return {
                        name: exercise?.name || 'Desconocido',
                        count: item._count.exerciseId
                    }
                })
            )
            console.log('Top exercises:', topExercises)
        } catch (error) {
            console.error('Error fetching top exercises:', error)
            topExercises = []
        }

        const response = {
            students: {
                total: totalStudents,
                active: activeStudents,
                inactive: totalStudents - activeStudents
            },
            plans: {
                active: activePlans,
                expired: expiredPlans
            },
            payments: {
                thisMonth: paymentsThisMonth.length,
                totalAmount: totalAmountThisMonth
            },
            monthlyIncome,
            topExercises
        }

        console.log('Dashboard stats response ready:', response)
        return NextResponse.json(response)
    } catch (error) {
        console.error('ERROR in dashboard stats API:', error)
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        })
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown' },
            { status: 500 }
        )
    }
}
