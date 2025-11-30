import prisma from './lib/prisma'

async function updateUserRole() {
    try {
        const user = await prisma.user.update({
            where: { email: 'profesor@gym.com' },
            data: { role: 'ADMIN' }
        })

        console.log('✅ Usuario actualizado exitosamente:')
        console.log('Email:', user.email)
        console.log('Nombre:', user.name)
        console.log('Rol:', user.role)
    } catch (error) {
        console.error('❌ Error al actualizar usuario:', error)
    } finally {
        await prisma.$disconnect()
    }
}

updateUserRole()
