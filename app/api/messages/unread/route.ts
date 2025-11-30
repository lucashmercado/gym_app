import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const currentUserId = session.userId

        // Count unread messages (received by current user and not read)
        const unreadCount = await prisma.message.count({
            where: {
                receiverId: currentUserId,
                read: false
            }
        })

        return NextResponse.json({ unreadCount })
    } catch (error) {
        console.error('Error fetching unread count:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
