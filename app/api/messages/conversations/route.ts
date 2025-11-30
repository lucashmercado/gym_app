import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/messages/conversations - Get list of conversations for current user
export async function GET() {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const currentUserId = session.userId

        // Get all messages where user is sender or receiver
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: currentUserId },
                    { receiverId: currentUserId }
                ]
            },
            include: {
                sender: {
                    select: { id: true, name: true, email: true, role: true }
                },
                receiver: {
                    select: { id: true, name: true, email: true, role: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        // Group by conversation partner
        const conversationsMap = new Map()

        messages.forEach(message => {
            const otherUser = message.senderId === currentUserId ? message.receiver : message.sender
            const otherUserId = otherUser.id

            if (!conversationsMap.has(otherUserId)) {
                conversationsMap.set(otherUserId, {
                    user: otherUser,
                    lastMessage: message,
                    unreadCount: 0
                })
            }

            // Count unread messages (received by current user and not read)
            if (message.receiverId === currentUserId && !message.read) {
                const conv = conversationsMap.get(otherUserId)
                conv.unreadCount++
            }
        })

        const conversations = Array.from(conversationsMap.values())

        return NextResponse.json({ conversations })
    } catch (error) {
        console.error('Error fetching conversations:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
