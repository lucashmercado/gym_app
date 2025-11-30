const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createJulieta() {
    try {
        const hashedPassword = await bcrypt.hash('123', 10)

        const user = await prisma.user.create({
            data: {
                email: 'julieta@gym.com',
                name: 'Julieta',
                password: hashedPassword,
                role: 'PROFESSOR',
                active: true
            }
        })

        console.log('✅ Usuario creado exitosamente:')
        console.log('Email: julieta@gym.com')
        console.log('Contraseña: 123')
        console.log('Rol:', user.role)
    } catch (error) {
        console.error('❌ Error:', error.message)
    } finally {
        await prisma.$disconnect()
    }
}

createJulieta()
