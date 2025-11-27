import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session || session.role !== 'PROFESSOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: studentId } = await params

    const student = await prisma.user.findUnique({
        where: { id: studentId },
        include: {
            studentProfile: true
        }
    })

    if (!student || student.role !== 'STUDENT') {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Verify this student belongs to the professor
    if (student.studentProfile?.professorId !== session.userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ student })
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session || session.role !== 'PROFESSOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: studentId } = await params
    const body = await request.json()
    const { name, email, phone, password, monthlyFee, active, age, details, pathologies } = body

    // Verify student exists and belongs to professor
    const student = await prisma.user.findUnique({
        where: { id: studentId },
        include: { studentProfile: true }
    })

    if (!student || student.role !== 'STUDENT') {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    if (student.studentProfile?.professorId !== session.userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Prepare update data
    const updateData: any = {}
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (phone !== undefined) updateData.phone = phone
    if (active !== undefined) updateData.active = active
    if (password) {
        updateData.password = await bcrypt.hash(password, 10)
    }

    // Update user
    const updatedStudent = await prisma.user.update({
        where: { id: studentId },
        data: updateData,
        include: { studentProfile: true }
    })

    // Update student profile with all fields
    if (student.studentProfile) {
        const profileUpdateData: any = {}
        if (monthlyFee !== undefined) profileUpdateData.monthlyFee = parseFloat(monthlyFee)
        if (age !== undefined) profileUpdateData.age = age ? parseInt(age) : null
        if (details !== undefined) profileUpdateData.details = details
        if (pathologies !== undefined) profileUpdateData.pathologies = pathologies

        await prisma.studentProfile.update({
            where: { id: student.studentProfile.id },
            data: profileUpdateData
        })
    }

    return NextResponse.json({
        message: 'Student updated successfully',
        student: updatedStudent
    })
}
