'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

const professorNavItems = [
    { name: 'Dashboard', href: '/dashboard/professor' },
    { name: 'Estudiantes', href: '/dashboard/professor/students' },
    { name: 'Planes', href: '/dashboard/professor/plans' },
    { name: 'Plantillas', href: '/dashboard/professor/templates' },
    { name: 'Ejercicios', href: '/dashboard/professor/exercises' },
    { name: 'Pagos', href: '/dashboard/professor/payments' },
]

export default function ProfessorDashboard() {
    const [user, setUser] = useState<any>(null)
    const [stats, setStats] = useState({
        activeStudents: 0,
        expiringPlans: 0,
        expiredPlans: 0,
        monthlyRevenue: 0,
    })
    const router = useRouter()

    useEffect(() => {
        fetch('/api/auth/me')
            .then((res) => res.json())
            .then((data) => {
                if (!data.user || data.user.role !== 'PROFESSOR') {
                    router.push('/login')
                } else {
                    setUser(data.user)
                    fetch('/api/professor/stats')
                        .then((res) => res.json())
                        .then((data) => setStats(data))
                }
            })
    }, [router])

    if (!user) return <div>Cargando...</div>

    return (
        <div>
            <Sidebar items={professorNavItems} userRole="PROFESSOR" userName={user.name} />

            <main className="container-fluid p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="h2">Panel del Profesor</h1>
                        <p className="text-muted">Bienvenido de nuevo, <strong>{user.name}</strong></p>
                    </div>
                </div>

                <div className="row g-3 mb-4">
                    <div className="col-md-3">
                        <div className="card text-center">
                            <div className="card-body">
                                <h5 className="card-title text-muted">Estudiantes Activos</h5>
                                <p className="display-6 fw-bold text-success">{stats.activeStudents}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-center">
                            <div className="card-body">
                                <h5 className="card-title text-muted">Por Vencer</h5>
                                <p className="display-6 fw-bold text-warning">{stats.expiringPlans}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-center">
                            <div className="card-body">
                                <h5 className="card-title text-muted">Vencidos</h5>
                                <p className="display-6 fw-bold text-danger">{stats.expiredPlans}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-center">
                            <div className="card-body">
                                <h5 className="card-title text-muted">Ingresos</h5>
                                <p className="display-6 fw-bold text-primary">${stats.monthlyRevenue}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Acciones Rápidas</h5>
                        <div className="d-grid gap-2 d-md-flex">
                            <button onClick={() => router.push('/dashboard/professor/students/new')} className="btn btn-primary">
                                Nuevo Estudiante
                            </button>
                            <button onClick={() => router.push('/dashboard/professor/plans/new')} className="btn btn-success">
                                Crear Plan
                            </button>
                            <button onClick={() => router.push('/dashboard/professor/payments')} className="btn btn-info">
                                Ver Pagos
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
