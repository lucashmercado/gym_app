import { hash, compare } from 'bcryptjs'
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key-change-me'
const key = new TextEncoder().encode(SECRET_KEY)

export async function hashPassword(password: string) {
    return await hash(password, 12)
}

export async function verifyPassword(password: string, hash: string) {
    return await compare(password, hash)
}

export async function createSession(payload: any) {
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key)

    const cookieStore = await cookies()
    cookieStore.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    })
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')?.value
    if (!session) return null

    try {
        const { payload } = await jwtVerify(session, key, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        return null
    }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.set('session', '', { expires: new Date(0) })
}
