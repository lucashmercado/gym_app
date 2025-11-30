import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { logActivity, ActivityActions, EntityTypes } from '@/lib/activityLogger'

// GET - Get gym settings
export async function GET() {
    try {
        // Get or create gym settings
        let settings = await prisma.gymSettings.findFirst()

        if (!settings) {
            // Create default settings if none exist
            settings = await prisma.gymSettings.create({
                data: {
                    gymName: 'Gym Manager',
                    primaryColor: '#0d6efd',
                    secondaryColor: '#6c757d',
                    accentColor: '#198754'
                }
            })
        }

        return NextResponse.json({ settings })
    } catch (error) {
        console.error('Error fetching gym settings:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// PUT - Update gym settings
export async function PUT(request: Request) {
    try {
        const session = await getSession()

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check if user has permission to manage settings
        if (!hasPermission(session.role, 'canManageSettings')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const data = await request.json()
        const { gymName, logoUrl, primaryColor, secondaryColor, accentColor, termsAndConditions } = data

        // Get existing settings
        let settings = await prisma.gymSettings.findFirst()

        if (!settings) {
            // Create if doesn't exist
            settings = await prisma.gymSettings.create({
                data: {
                    gymName: gymName || 'Gym Manager',
                    logoUrl,
                    primaryColor: primaryColor || '#0d6efd',
                    secondaryColor: secondaryColor || '#6c757d',
                    accentColor: accentColor || '#198754',
                    termsAndConditions
                }
            })
        } else {
            // Update existing
            settings = await prisma.gymSettings.update({
                where: { id: settings.id },
                data: {
                    ...(gymName && { gymName }),
                    ...(logoUrl !== undefined && { logoUrl }),
                    ...(primaryColor && { primaryColor }),
                    ...(secondaryColor && { secondaryColor }),
                    ...(accentColor && { accentColor }),
                    ...(termsAndConditions !== undefined && { termsAndConditions })
                }
            })
        }

        // Log activity
        await logActivity({
            userId: session.userId as string,
            action: ActivityActions.UPDATE_GYM_SETTINGS,
            entityType: EntityTypes.SETTINGS,
            entityId: settings.id,
            details: { updatedFields: Object.keys(data) }
        })

        return NextResponse.json({ settings })
    } catch (error) {
        console.error('Error updating gym settings:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
