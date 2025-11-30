import * as XLSX from 'xlsx'

/**
 * Generate Excel file for students data
 */
export function generateStudentsExcel(students: any[]): Buffer {
    // Prepare data for Excel
    const data = students.map(student => ({
        'Nombre': student.name,
        'Email': student.email,
        'Teléfono': student.phone || '',
        'Estado': student.active ? 'Activo' : 'Inactivo',
        'Tipo Membresía': student.studentProfile?.membershipType || '',
        'Fecha Inicio': student.studentProfile?.startDate ?
            new Date(student.studentProfile.startDate).toLocaleDateString('es-ES') : '',
        'Fecha Fin': student.studentProfile?.membershipEndDate ?
            new Date(student.studentProfile.membershipEndDate).toLocaleDateString('es-ES') : '',
        'Profesor': student.studentProfile?.professor?.name || '',
        'Fecha Registro': new Date(student.createdAt).toLocaleDateString('es-ES')
    }))

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(data)

    // Set column widths
    ws['!cols'] = [
        { wch: 20 }, // Nombre
        { wch: 25 }, // Email
        { wch: 15 }, // Teléfono
        { wch: 10 }, // Estado
        { wch: 15 }, // Tipo Membresía
        { wch: 12 }, // Fecha Inicio
        { wch: 12 }, // Fecha Fin
        { wch: 20 }, // Profesor
        { wch: 12 }  // Fecha Registro
    ]

    XLSX.utils.book_append_sheet(wb, ws, 'Estudiantes')

    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
    return buffer
}

/**
 * Generate Excel file for payments data
 */
export function generatePaymentsExcel(payments: any[]): Buffer {
    // Prepare data for Excel
    const data = payments.map(payment => ({
        'Fecha': new Date(payment.date).toLocaleDateString('es-ES'),
        'Estudiante': payment.student?.name || '',
        'Email': payment.student?.email || '',
        'Monto': payment.amount,
        'Método': payment.paymentMethod || '',
        'Concepto': payment.concept || '',
        'Estado': payment.status || 'Pagado',
        'Notas': payment.notes || ''
    }))

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(data)

    // Set column widths
    ws['!cols'] = [
        { wch: 12 }, // Fecha
        { wch: 20 }, // Estudiante
        { wch: 25 }, // Email
        { wch: 10 }, // Monto
        { wch: 15 }, // Método
        { wch: 20 }, // Concepto
        { wch: 10 }, // Estado
        { wch: 30 }  // Notas
    ]

    XLSX.utils.book_append_sheet(wb, ws, 'Pagos')

    // Add summary sheet
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)
    const summary = [
        { 'Métrica': 'Total de Pagos', 'Valor': payments.length },
        { 'Métrica': 'Monto Total', 'Valor': `$${totalAmount.toFixed(2)}` },
        { 'Métrica': 'Promedio por Pago', 'Valor': `$${(totalAmount / payments.length).toFixed(2)}` }
    ]
    const wsSummary = XLSX.utils.json_to_sheet(summary)
    wsSummary['!cols'] = [{ wch: 20 }, { wch: 15 }]
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumen')

    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
    return buffer
}

/**
 * Generate Excel file for activity logs
 */
export function generateLogsExcel(logs: any[]): Buffer {
    const data = logs.map(log => ({
        'Fecha/Hora': new Date(log.createdAt).toLocaleString('es-ES'),
        'Usuario': log.user.name,
        'Email': log.user.email,
        'Rol': log.user.role,
        'Acción': log.action,
        'Tipo Entidad': log.entityType,
        'ID Entidad': log.entityId || '',
        'IP': log.ipAddress || '',
        'Detalles': log.details || ''
    }))

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(data)

    ws['!cols'] = [
        { wch: 18 }, // Fecha/Hora
        { wch: 20 }, // Usuario
        { wch: 25 }, // Email
        { wch: 12 }, // Rol
        { wch: 20 }, // Acción
        { wch: 15 }, // Tipo Entidad
        { wch: 15 }, // ID Entidad
        { wch: 15 }, // IP
        { wch: 40 }  // Detalles
    ]

    XLSX.utils.book_append_sheet(wb, ws, 'Logs de Actividad')

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
    return buffer
}
