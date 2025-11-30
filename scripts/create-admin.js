const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdminUser() {
    try {
        // Check if admin user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: 'admin@gym.com' }
        })

        if (existingUser) {
            console.log('✅ Usuario admin ya existe:')
            console.log('Email: admin@gym.com')
            console.log('Contraseña: admin123')
            console.log('Rol:', existingUser.role)

            // Update to ADMIN if not already
            if (existingUser.role !== 'ADMIN') {
                await prisma.user.update({
                    where: { email: 'admin@gym.com' },
                    data: { role: 'ADMIN' }
                })
                console.log('✅ Rol actualizado a ADMIN')
            }
        } else {
            // Create new admin user
            const hashedPassword = await bcrypt.hash('admin123', 10)

            const user = await prisma.user.create({
                data: {
                    email: 'admin@gym.com',
                    name: 'Administrador',
                    password: hashedPassword,
                    role: 'ADMIN',
                    active: true
                }
            })

            console.log('✅ Usuario admin creado exitosamente:')
            console.log('Email: admin@gym.com')
            console.log('Contraseña: admin123')
            console.log('Rol:', user.role)
        }
    } catch (error) {
        console.error('❌ Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

createAdminUser()
