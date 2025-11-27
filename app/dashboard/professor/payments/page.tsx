'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'

const professorNavItems = [
    { name: 'Dashboard', href: '/dashboard/professor' },
    { name: 'Estudiantes', href: '/dashboard/professor/students' },
    { name: 'Planes', href: '/dashboard/professor/plans' },
    { name: 'Ejercicios', href: '/dashboard/professor/exercises' },
    { name: 'Pagos', href: '/dashboard/professor/payments' },
]

export default function PaymentList() {
    const [payments, setPayments] = useState<any[]>([])

    useEffect(() => {
        fetch('/api/payments')
            .then((res) => res.json())
            .then((data) => setPayments(data.payments || []))
    }, [])

    return (
        <div>
            <Sidebar items={professorNavItems} userRole="PROFESSOR" />

            <main className="container-fluid p-4">
                <div className="container-fluid">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="h2">Pagos</h1>
                        <Link href="/dashboard/professor/payments/new" className="btn btn-primary">
                            + Registrar Pago
                        </Link>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Estudiante</th>
                                            <th>Monto</th>
                                            <th>Método</th>
                                            <th>Observaciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map((payment) => (
                                            <tr key={payment.id}>
                                                <td>{new Date(payment.date).toLocaleDateString('es-ES')}</td>
                                                <td>{payment.student.name}</td>
                                                <td className="fw-bold text-success">${payment.amount}</td>
                                                <td><span className="badge bg-secondary">{payment.method || 'N/A'}</span></td>
                                                <td className="text-muted">{payment.observations || '-'}</td>
                                            </tr>
                                        ))}
                                        {payments.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="text-center text-muted py-4">
                                                    No se encontraron pagos.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
