const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// URLs de GIFs de ejercicios (usando GIPHY y otros recursos públicos)
const exerciseImages = {
    // Pecho
    'Press de Banca': 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmVuY2hwcmVzcw/giphy.gif',
    'Flexiones': 'https://media.giphy.com/media/3o7TKMeCOV3oXSb5bq/giphy.gif',
    'Press Inclinado': 'https://thumbs.gfycat.com/AdorableGlitteringBluebottle-size_restricted.gif',

    // Espalda
    'Dominadas': 'https://media.giphy.com/media/3oKIPlifLxdigaD2Y8/giphy.gif',
    'Remo con Barra': 'https://thumbs.gfycat.com/FarflungGloomyBluebottle-size_restricted.gif',
    'Peso Muerto': 'https://media.giphy.com/media/ZXlK7hhJAHsBW/giphy.gif',

    // Piernas
    'Sentadillas': 'https://media.giphy.com/media/3oKIPnbKgN3bXeVpvy/giphy.gif',
    'Sentadilla': 'https://media.giphy.com/media/3oKIPnbKgN3bXeVpvy/giphy.gif',
    'Prensa de Piernas': 'https://thumbs.gfycat.com/FluidGloomyArmednylonshrimp-size_restricted.gif',
    'Zancadas': 'https://media.giphy.com/media/l0HlFPNndZgxEHV6w/giphy.gif',
    'Extensiones de Cuádriceps': 'https://thumbs.gfycat.com/FarflungGlitteringBluebottle-size_restricted.gif',

    // Hombros
    'Press Militar': 'https://media.giphy.com/media/3o7TKPATxjC9zZBIuQ/giphy.gif',
    'Elevaciones Laterales': 'https://thumbs.gfycat.com/AdorableGlitteringBluebottle-size_restricted.gif',

    // Brazos
    'Curl de Bíceps': 'https://media.giphy.com/media/3oKIPlifLxdigaD2Y8/giphy.gif',
    'Tríceps en Polea': 'https://thumbs.gfycat.com/FluidGloomyArmednylonshrimp-size_restricted.gif',
    'Curl con Mancuernas': 'https://media.giphy.com/media/3oKIPnbKgN3bXeVpvy/giphy.gif',

    // Core
    'Plancha': 'https://media.giphy.com/media/3oKIPlifLxdigaD2Y8/giphy.gif',
    'Abdominales': 'https://media.giphy.com/media/l0HlFPNndZgxEHV6w/giphy.gif',
    'Elevación de Piernas': 'https://thumbs.gfycat.com/AdorableGlitteringBluebottle-size_restricted.gif',
}

// URLs de imágenes estáticas de alta calidad como alternativa
const exerciseStaticImages = {
    'Press de Banca': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/10/barbell-bench-press.gif',
    'Flexiones': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/02/push-up.gif',
    'Dominadas': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/11/pull-up.gif',
    'Sentadillas': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/02/barbell-squat.gif',
    'Sentadilla': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/02/barbell-squat.gif',
    'Peso Muerto': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/11/barbell-deadlift.gif',
    'Remo con Barra': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/02/barbell-row.gif',
    'Press Militar': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/10/barbell-shoulder-press.gif',
    'Curl de Bíceps': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/02/barbell-curl.gif',
    'Zancadas': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/10/dumbbell-lunge.gif',
    'Plancha': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/02/plank.gif',
    'Abdominales': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/02/crunch.gif',
}

async function updateExerciseImages() {
    try {
        console.log('🏋️ Actualizando imágenes de ejercicios...\n')

        // Obtener todos los ejercicios
        const exercises = await prisma.exercise.findMany()

        let updated = 0
        let notFound = 0

        for (const exercise of exercises) {
            // Buscar imagen para este ejercicio
            const imageUrl = exerciseStaticImages[exercise.name]

            if (imageUrl && !exercise.imageUrl) {
                await prisma.exercise.update({
                    where: { id: exercise.id },
                    data: { imageUrl }
                })
                console.log(`✅ ${exercise.name} - Imagen agregada`)
                updated++
            } else if (imageUrl && exercise.imageUrl) {
                console.log(`⏭️  ${exercise.name} - Ya tiene imagen`)
            } else {
                console.log(`❌ ${exercise.name} - No se encontró imagen`)
                notFound++
            }
        }

        console.log(`\n📊 Resumen:`)
        console.log(`   - Ejercicios actualizados: ${updated}`)
        console.log(`   - Sin imagen disponible: ${notFound}`)
        console.log(`   - Total de ejercicios: ${exercises.length}`)

    } catch (error) {
        console.error('Error actualizando imágenes:', error)
    } finally {
        await prisma.$disconnect()
    }
}

updateExerciseImages()
