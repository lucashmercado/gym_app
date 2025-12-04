import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        // Verificar variables de entorno
        const hasDbUrl = !!process.env.DATABASE_URL
        const hasJwtSecret = !!process.env.JWT_SECRET

        console.log('[HEALTH] DATABASE_URL exists:', hasDbUrl)
        console.log('[HEALTH] JWT_SECRET exists:', hasJwtSecret)

        // Intentar conectar a la base de datos
        await prisma.$connect()
        console.log('[HEALTH] Database connection successful')

        // Contar usuarios
        const userCount = await prisma.user.count()
        console.log('[HEALTH] User count:', userCount)

        await prisma.$disconnect()

        return NextResponse.json({
            status: 'ok',
            environment: process.env.NODE_ENV,
            database: {
                connected: true,
                userCount: userCount
            },
            config: {
                hasDatabaseUrl: hasDbUrl,
                hasJwtSecret: hasJwtSecret
            }
        })
    } catch (error: any) {
        console.error('[HEALTH] Error:', error)
        return NextResponse.json({
            status: 'error',
            error: error.message,
            code: error.code,
            environment: process.env.NODE_ENV,
            config: {
                hasDatabaseUrl: !!process.env.DATABASE_URL,
                hasJwtSecret: !!process.env.JWT_SECRET
            }
        }, { status: 500 })
    }
}
