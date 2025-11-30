// Permission system for role-based access control

export const permissions = {
    // User Management
    canManageUsers: ['ADMIN'],
    canViewAllUsers: ['ADMIN'],

    // Settings
    canManageSettings: ['ADMIN'],
    canViewSettings: ['ADMIN'],

    // Students
    canViewAllStudents: ['ADMIN', 'PROFESSOR', 'ASSISTANT'],
    canCreateStudents: ['ADMIN', 'PROFESSOR'],
    canEditStudents: ['ADMIN', 'PROFESSOR'],
    canDeleteStudents: ['ADMIN', 'PROFESSOR'],

    // Plans
    canViewPlans: ['ADMIN', 'PROFESSOR', 'ASSISTANT'],
    canManagePlans: ['ADMIN', 'PROFESSOR', 'ASSISTANT'],

    // Exercises
    canViewExercises: ['ADMIN', 'PROFESSOR', 'ASSISTANT'],
    canManageExercises: ['ADMIN', 'PROFESSOR', 'ASSISTANT'],

    // Templates
    canViewTemplates: ['ADMIN', 'PROFESSOR', 'ASSISTANT'],
    canManageTemplates: ['ADMIN', 'PROFESSOR', 'ASSISTANT'],

    // Payments
    canViewPayments: ['ADMIN', 'PROFESSOR'],
    canManagePayments: ['ADMIN', 'PROFESSOR'],

    // Messages
    canViewMessages: ['ADMIN', 'PROFESSOR', 'ASSISTANT', 'STUDENT'],
    canSendMessages: ['ADMIN', 'PROFESSOR', 'ASSISTANT', 'STUDENT'],

    // Logs
    canViewLogs: ['ADMIN'],

    // Export
    canExportData: ['ADMIN', 'PROFESSOR'],

    // Backup
    canManageBackup: ['ADMIN'],
} as const

export type Permission = keyof typeof permissions

/**
 * Check if a user role has a specific permission
 */
export function hasPermission(userRole: string, permission: Permission): boolean {
    const allowedRoles = permissions[permission]
    return allowedRoles.includes(userRole as any)
}

/**
 * Check if a user role has any of the specified permissions
 */
export function hasAnyPermission(userRole: string, ...permissionList: Permission[]): boolean {
    return permissionList.some(permission => hasPermission(userRole, permission))
}

/**
 * Check if a user role has all of the specified permissions
 */
export function hasAllPermissions(userRole: string, ...permissionList: Permission[]): boolean {
    return permissionList.every(permission => hasPermission(userRole, permission))
}

/**
 * Get all permissions for a specific role
 */
export function getRolePermissions(userRole: string): Permission[] {
    return Object.entries(permissions)
        .filter(([_, roles]) => roles.includes(userRole as any))
        .map(([permission]) => permission as Permission)
}
