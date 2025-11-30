import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import bcrypt from 'bcryptjs'
import { logActivity, ActivityActions, EntityTypes } from '@/lib/activityLogger'

// GET - List all users (except students)
export async function GET() {
    try {
        const session = await getSession()

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!hasPermission(session.role, 'canViewAllUsers')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const users = await prisma.user.findMany({
            where: {
                role: {
                    in: ['ADMIN', 'PROFESSOR', 'ASSISTANT']
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                active: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ users })
    } catch (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// POST - Create new user
export async function POST(request: Request) {
    try {
        const session = await getSession()

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!hasPermission(session.role, 'canManageUsers')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { name, email, password, role } = await request.json()

        // Validate input
        if (!name || !email || !password || !role) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                active: true
            }
        })

        // Log activity
        await logActivity({
            userId: session.userId as string,
            action: ActivityActions.CREATE_USER,
            entityType: EntityTypes.USER,
            entityId: user.id,
            details: { name, email, role }
        })

        return NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        console.error('Error creating user:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
