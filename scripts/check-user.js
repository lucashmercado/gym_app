const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkUser() {
    try {
        const user = await prisma.user.findUnique({
            where: { email: 'julieta@gym.com' }
        })

        if (user) {
            console.log('✅ Usuario encontrado:')
            console.log('ID:', user.id)
            console.log('Nombre:', user.name)
            console.log('Email:', user.email)
            console.log('Rol:', user.role)
            console.log('Activo:', user.active)
            console.log('Fecha creación:', user.createdAt)
        } else {
            console.log('❌ Usuario NO encontrado con email: julieta@gym.com')
        }
    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

checkUser()
