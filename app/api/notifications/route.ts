import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const notifications = await prisma.notification.findMany({
            where: { userId: session.userId as string },
            orderBy: { createdAt: 'desc' },
            take: 20 // Limit to last 20 notifications
        })

        const unreadCount = await prisma.notification.count({
            where: {
                userId: session.userId as string,
                read: false
            }
        })

        return NextResponse.json({
            notifications,
            unreadCount
        })
    } catch (error) {
        console.error('Error fetching notifications:', error)
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { notificationId } = body

        if (notificationId) {
            // Mark single notification as read
            await prisma.notification.update({
                where: {
                    id: notificationId,
                    userId: session.userId as string
                },
                data: { read: true }
            })
        } else {
            // Mark all as read
            await prisma.notification.updateMany({
                where: {
                    userId: session.userId as string,
                    read: false
                },
                data: { read: true }
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error updating notifications:', error)
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
