import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import bcrypt from 'bcryptjs'

// PATCH - Update user status (activate/deactivate)
export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params
    console.log('=== PATCH REQUEST STARTED ===')
    console.log('User ID:', params.id)

    try {
        const session = await getSession()

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!hasPermission(session.role, 'canManageUsers')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { active } = await request.json()
        const userId = params.id

        const user = await prisma.user.update({
            where: { id: userId },
            data: { active: active }
        })

        console.log('User updated successfully!')

        return NextResponse.json({ user })
    } catch (error) {
        console.error('Error in PATCH:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// PUT - Update user details
export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params

    try {
        const session = await getSession()

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!hasPermission(session.role, 'canManageUsers')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { name, email, role, password } = await request.json()
        const userId = params.id

        const updateData: any = {
            name,
            email,
            role
        }

        if (password) {
            updateData.password = await bcrypt.hash(password, 10)
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData
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
        console.error('Error updating user:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// DELETE - Delete user
export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params

    try {
        const session = await getSession()

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!hasPermission(session.role, 'canManageUsers')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const userId = params.id

        const userToDelete = await prisma.user.findUnique({
            where: { id: userId },
            select: { name: true, email: true, role: true }
        })

        if (!userToDelete) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        await prisma.user.delete({
            where: { id: userId }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting user:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
