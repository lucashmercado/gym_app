import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await hash('admin123', 12)

    const professor = await prisma.user.upsert({
        where: { email: 'profesor@gym.com' },
        update: {},
        create: {
            email: 'profesor@gym.com',
            name: 'Profesor Admin',
            password,
            role: 'PROFESSOR',
        },
    })

    console.log({ professor })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
