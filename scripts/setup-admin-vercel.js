const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdminIfNotExists() {
    try {
        await prisma.$connect()
        console.log('✅ Conectado a la base de datos')

        // Verificar si ya existe el usuario admin
        const existingAdmin = await prisma.user.findUnique({
            where: { email: 'admin@gym.com' }
        })

        if (existingAdmin) {
            console.log('✅ Usuario admin ya existe')
            await prisma.$disconnect()
            process.exit(0)
        }

        // Crear usuario admin
        const hashedPassword = await bcrypt.hash('admin123', 12)

        await prisma.user.create({
            data: {
                email: 'admin@gym.com',
                name: 'Administrador',
                password: hashedPassword,
                role: 'ADMIN',
                active: true
            }
        })

        console.log('✅ Usuario admin creado exitosamente')
        console.log('   Email: admin@gym.com')
        console.log('   Contraseña: admin123')

        await prisma.$disconnect()
        process.exit(0)
    } catch (error) {
        console.error('❌ Error:', error)
        // No fallar el build si hay error
        process.exit(0)
    }
}

createAdminIfNotExists()
