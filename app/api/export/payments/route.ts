import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { generatePaymentsExcel } from '@/lib/excelExport'
import { logActivity, ActivityActions, EntityTypes } from '@/lib/activityLogger'

export async function GET(request: Request) {
    try {
        const session = await getSession()

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check permission
        if (!hasPermission(session.role as string, 'canExportData')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')

        // Build where clause
        const where: any = {}
        if (startDate) {
            where.date = { ...where.date, gte: new Date(startDate) }
        }
        if (endDate) {
            where.date = { ...where.date, lte: new Date(endDate) }
        }

        // Fetch payments with student data
        const payments = await prisma.payment.findMany({
            where,
            include: {
                student: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { date: 'desc' }
        })

        // Generate Excel file
        const buffer = generatePaymentsExcel(payments)

        // Log activity
        await logActivity({
            userId: session.userId as string,
            action: ActivityActions.EXPORT_DATA,
            entityType: EntityTypes.PAYMENT,
            details: {
                count: payments.length,
                startDate,
                endDate
            }
        })

        // Return file
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename=pagos_${new Date().toISOString().split('T')[0]}.xlsx`
            }
        })
    } catch (error) {
        console.error('Error exporting payments:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
