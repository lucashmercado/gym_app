import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyPassword, createSession } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password } = body

        console.log('[LOGIN] Intento de login para:', email)

        if (!email || !password) {
            console.log('[LOGIN] Error: Email o password faltante')
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            )
        }

        console.log('[LOGIN] Buscando usuario en BD...')
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            console.log('[LOGIN] Error: Usuario no encontrado')
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        console.log('[LOGIN] Usuario encontrado:', user.email, 'Role:', user.role, 'Active:', user.active)

        if (!user.active) {
            console.log('[LOGIN] Error: Usuario inactivo')
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        console.log('[LOGIN] Verificando contraseña...')
        const isValid = await verifyPassword(password, user.password)
        console.log('[LOGIN] Resultado de verificación:', isValid)

        if (!isValid) {
            console.log('[LOGIN] Error: Contraseña incorrecta')
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        console.log('[LOGIN] Creando sesión...')
        await createSession({ userId: user.id, role: user.role })
        console.log('[LOGIN] Sesión creada exitosamente')

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        console.error('[LOGIN] Error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
