import prisma from './prisma'

export interface LogActivityParams {
    userId: string
    action: string
    entityType: string
    entityId?: string
    details?: any
    ipAddress?: string
}

/**
 * Log an activity to the database
 */
export async function logActivity({
    userId,
    action,
    entityType,
    entityId,
    details,
    ipAddress
}: LogActivityParams): Promise<void> {
    try {
        await prisma.activityLog.create({
            data: {
                userId,
                action,
                entityType,
                entityId,
                details: details ? JSON.stringify(details) : null,
                ipAddress
            }
        })
    } catch (error) {
        console.error('Error logging activity:', error)
        // Don't throw - logging should not break the main flow
    }
}

// Common action types
export const ActivityActions = {
    // Students
    CREATE_STUDENT: 'CREATE_STUDENT',
    UPDATE_STUDENT: 'UPDATE_STUDENT',
    DELETE_STUDENT: 'DELETE_STUDENT',
    ACTIVATE_STUDENT: 'ACTIVATE_STUDENT',
    DEACTIVATE_STUDENT: 'DEACTIVATE_STUDENT',

    // Plans
    CREATE_PLAN: 'CREATE_PLAN',
    UPDATE_PLAN: 'UPDATE_PLAN',
    DELETE_PLAN: 'DELETE_PLAN',
    ASSIGN_PLAN: 'ASSIGN_PLAN',
    DUPLICATE_PLAN: 'DUPLICATE_PLAN',

    // Templates
    CREATE_TEMPLATE: 'CREATE_TEMPLATE',
    UPDATE_TEMPLATE: 'UPDATE_TEMPLATE',
    DELETE_TEMPLATE: 'DELETE_TEMPLATE',
    DUPLICATE_TEMPLATE: 'DUPLICATE_TEMPLATE',

    // Exercises
    CREATE_EXERCISE: 'CREATE_EXERCISE',
    UPDATE_EXERCISE: 'UPDATE_EXERCISE',
    DELETE_EXERCISE: 'DELETE_EXERCISE',

    // Payments
    CREATE_PAYMENT: 'CREATE_PAYMENT',
    UPDATE_PAYMENT: 'UPDATE_PAYMENT',
    DELETE_PAYMENT: 'DELETE_PAYMENT',

    // Users
    CREATE_USER: 'CREATE_USER',
    UPDATE_USER: 'UPDATE_USER',
    DELETE_USER: 'DELETE_USER',
    CHANGE_USER_ROLE: 'CHANGE_USER_ROLE',

    // Settings
    UPDATE_GYM_SETTINGS: 'UPDATE_GYM_SETTINGS',
    UPLOAD_LOGO: 'UPLOAD_LOGO',

    // Auth
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    PASSWORD_RESET_REQUEST: 'PASSWORD_RESET_REQUEST',
    PASSWORD_RESET_COMPLETE: 'PASSWORD_RESET_COMPLETE',

    // Data
    EXPORT_DATA: 'EXPORT_DATA',
    CREATE_BACKUP: 'CREATE_BACKUP',
} as const

// Entity types
export const EntityTypes = {
    STUDENT: 'Student',
    PLAN: 'Plan',
    TEMPLATE: 'Template',
    EXERCISE: 'Exercise',
    PAYMENT: 'Payment',
    USER: 'User',
    SETTINGS: 'Settings',
    MESSAGE: 'Message',
} as const
