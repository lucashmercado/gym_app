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

export default function PlanList() {
    const [plans, setPlans] = useState<any[]>([])

    useEffect(() => {
        fetch('/api/plans')
            .then((res) => res.json())
            .then((data) => setPlans(data.plans || []))
    }, [])

    return (
        <div>
            <Sidebar items={professorNavItems} userRole="PROFESSOR" />

            <main className="container-fluid p-4">
                <div className="container-fluid">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="h2">Planes de Entrenamiento</h1>
                        <Link href="/dashboard/professor/plans/new" className="btn btn-primary">
                            + Crear Plan
                        </Link>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Nombre del Plan</th>
                                            <th>Estudiante</th>
                                            <th>Fecha de Inicio</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {plans.map((plan) => (
                                            <tr key={plan.id}>
                                                <td className="fw-bold">{plan.name}</td>
                                                <td>{plan.student.name}</td>
                                                <td>{new Date(plan.startDate).toLocaleDateString('es-ES')}</td>
                                                <td>
                                                    <span className={`badge ${plan.active ? 'bg-success' : 'bg-secondary'}`}>
                                                        {plan.active ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <Link href={`/dashboard/professor/plans/${plan.id}`} className="btn btn-sm btn-outline-primary">
                                                        Ver Detalles
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                        {plans.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="text-center text-muted py-4">
                                                    No se encontraron planes.
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
