import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/messages?otherUserId=xxx - Get messages between current user and another user
export async function GET(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const otherUserId = searchParams.get('otherUserId')

        if (!otherUserId) {
            return NextResponse.json({ error: 'otherUserId is required' }, { status: 400 })
        }

        const currentUserId = session.userId

        // Get all messages between these two users
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: currentUserId as string, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: currentUserId as string }
                ]
            },
            include: {
                sender: {
                    select: { id: true, name: true, email: true }
                },
                receiver: {
                    select: { id: true, name: true, email: true }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        // Mark received messages as read
        await prisma.message.updateMany({
            where: {
                senderId: otherUserId,
                receiverId: currentUserId as string,
                read: false
            },
            data: {
                read: true
            }
        })

        return NextResponse.json({ messages })
    } catch (error) {
        console.error('Error fetching messages:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// POST /api/messages - Send a new message
export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { receiverId, content } = body

        if (!receiverId || !content) {
            return NextResponse.json(
                { error: 'receiverId and content are required' },
                { status: 400 }
            )
        }

        const message = await prisma.message.create({
            data: {
                senderId: session.userId as string,
                receiverId,
                content
            },
            include: {
                sender: {
                    select: { id: true, name: true, email: true }
                },
                receiver: {
                    select: { id: true, name: true, email: true }
                }
            }
        })

        return NextResponse.json({ message })
    } catch (error) {
        console.error('Error sending message:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
