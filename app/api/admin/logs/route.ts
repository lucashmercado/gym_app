import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'

export async function GET(request: Request) {
    try {
        const session = await getSession()

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Only ADMIN can view logs
        if (!hasPermission(session.role, 'canViewLogs')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '50')
        const action = searchParams.get('action')
        const userId = searchParams.get('userId')
        const entityType = searchParams.get('entityType')

        const skip = (page - 1) * limit

        // Build where clause
        const where: any = {}
        if (action) where.action = action
        if (userId) where.userId = userId
        if (entityType) where.entityType = entityType

        // Get logs with pagination
        const [logs, total] = await Promise.all([
            prisma.activityLog.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.activityLog.count({ where })
        ])

        return NextResponse.json({
            logs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Error fetching activity logs:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
