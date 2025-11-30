import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { generateStudentsExcel } from '@/lib/excelExport'
import { logActivity, ActivityActions, EntityTypes } from '@/lib/activityLogger'

export async function GET() {
    try {
        const session = await getSession()

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check permission
        if (!hasPermission(session.role, 'canExportData')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Fetch all students with related data
        const students = await prisma.user.findMany({
            where: { role: 'STUDENT' },
            include: {
                studentProfile: {
                    include: {
                        professor: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        // Generate Excel file
        const buffer = generateStudentsExcel(students)

        // Log activity
        await logActivity({
            userId: session.userId as string,
            action: ActivityActions.EXPORT_DATA,
            entityType: EntityTypes.STUDENT,
            details: { count: students.length }
        })

        // Return file
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename=estudiantes_${new Date().toISOString().split('T')[0]}.xlsx`
            }
        })
    } catch (error) {
        console.error('Error exporting students:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
