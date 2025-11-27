import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword, getSession } from '@/lib/auth'

export async function GET() {
    const session = await getSession()
    if (!session || session.role !== 'PROFESSOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const students = await prisma.user.findMany({
        where: {
            role: 'STUDENT',
            studentProfile: {
                professorId: session.userId as string
            }
        },
        include: { studentProfile: true },
    })

    return NextResponse.json({ students })
}

export async function POST(request: Request) {
    const session = await getSession()
    if (!session || session.role !== 'PROFESSOR') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { name, email, phone, password, monthlyFee, age, details, pathologies } = body

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 })
        }

        const hashedPassword = await hashPassword(password)
        const fee = parseFloat(monthlyFee)
        const studentAge = age ? parseInt(age) : null

        const student = await prisma.user.create({
            data: {
                name,
                email,
                phone: phone || null,
                password: hashedPassword,
                role: 'STUDENT',
                studentProfile: {
                    create: {
                        professorId: session.userId as string,
                        monthlyFee: isNaN(fee) ? 0 : fee,
                        membershipExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
                        age: studentAge,
                        details: details || null,
                        pathologies: pathologies || null
                    },
                },
            },
        })

        return NextResponse.json({ student })
    } catch (error: any) {
        console.error('Error creating student:', error)
        return NextResponse.json({ error: error.message || 'Error creating student' }, { status: 500 })
    }
}
