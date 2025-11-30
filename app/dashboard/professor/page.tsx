'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import StatsCard from '@/components/dashboard/StatsCard'
import MonthlyIncomeChart from '@/components/dashboard/MonthlyIncomeChart'
import StudentStatusChart from '@/components/dashboard/StudentStatusChart'
import TopExercisesChart from '@/components/dashboard/TopExercisesChart'

const professorNavItems = [
    { name: 'Dashboard', href: '/dashboard/professor' },
    { name: 'Estudiantes', href: '/dashboard/professor/students' },
    { name: 'Planes', href: '/dashboard/professor/plans' },
    { name: 'Plantillas', href: '/dashboard/professor/templates' },
    { name: 'Ejercicios', href: '/dashboard/professor/exercises' },
    { name: 'Mensajes', href: '/dashboard/professor/messages' },
    { name: 'Pagos', href: '/dashboard/professor/payments' },
]

interface DashboardStats {
    students: {
        total: number
        active: number
        inactive: number
    }
    plans: {
        active: number
        expired: number
    }
    payments: {
        thisMonth: number
        totalAmount: number
    }
    monthlyIncome: Array<{ month: string; amount: number }>
    topExercises: Array<{ name: string; count: number }>
}

export default function ProfessorDashboard() {
    const [user, setUser] = useState<any>(null)
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetch('/api/auth/me')
            .then((res) => res.json())
            .then((data) => {
                if (!data.user || data.user.role !== 'PROFESSOR') {
                    router.push('/login')
                } else {
                    setUser(data.user)
                    // Fetch dashboard stats
                    fetch('/api/professor/dashboard/stats')
                        .then(async (res) => {
                            if (!res.ok) {
                                const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
                                console.error('Stats API error:', res.status, errorData)
                                throw new Error(`HTTP ${res.status}: ${errorData.error || 'Failed to fetch stats'}`)
                            }
                            return res.json()
                        })
                        .then((statsData) => {
                            console.log('Stats loaded successfully:', statsData)
                            setStats(statsData)
                            setLoading(false)
                        })
                        .catch((error) => {
                            console.error('Error fetching stats:', error)
                            setLoading(false)
                        })
                }
            })
            .catch((error) => {
                console.error('Error fetching user:', error)
                router.push('/login')
            })
    }, [router])

    if (!user) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        )
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(value)
    }

    return (
        <div>
            <Sidebar items={professorNavItems} userRole="PROFESSOR" userName={user.name} />

            <main className="container-fluid p-4">
                <div className="mb-4">
                    <h1 className="h2 mb-1">Panel del Profesor</h1>
                    <p className="text-muted">Bienvenido, {user.name}</p>
                </div>

                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando estadísticas...</span>
                        </div>
                    </div>
                ) : stats && stats.students && stats.plans && stats.payments ? (
                    <>
                        {/* Stats Cards Row */}
                        <div className="row g-4 mb-4">
                            <div className="col-md-6 col-lg-3">
                                <StatsCard
                                    title="Total Estudiantes"
                                    value={stats.students.total}
                                    subtitle={`${stats.students.active} activos`}
                                    icon="👥"
                                    color="primary"
                                />
                            </div>
                            <div className="col-md-6 col-lg-3">
                                <StatsCard
                                    title="Estudiantes Activos"
                                    value={stats.students.active}
                                    subtitle={`${((stats.students.active / stats.students.total) * 100).toFixed(1)}% del total`}
                                    icon="✅"
                                    color="success"
                                />
                            </div>
                            <div className="col-md-6 col-lg-3">
                                <StatsCard
                                    title="Planes Activos"
                                    value={stats.plans.active}
                                    subtitle={`${stats.plans.expired} vencidos`}
                                    icon="📋"
                                    color="info"
                                />
                            </div>
                            <div className="col-md-6 col-lg-3">
                                <StatsCard
                                    title="Ingresos del Mes"
                                    value={formatCurrency(stats.payments.totalAmount)}
                                    subtitle={`${stats.payments.thisMonth} pagos`}
                                    icon="💰"
                                    color="warning"
                                />
                            </div>
                        </div>

                        {/* Monthly Income Chart - Full Width */}
                        <div className="row g-4 mb-4">
                            <div className="col-12">
                                <MonthlyIncomeChart data={stats.monthlyIncome} />
                            </div>
                        </div>

                        {/* Student Status & Top Exercises - Side by Side */}
                        <div className="row g-4">
                            <div className="col-md-6">
                                <StudentStatusChart
                                    active={stats.students.active}
                                    inactive={stats.students.inactive}
                                />
                            </div>
                            <div className="col-md-6">
                                <TopExercisesChart data={stats.topExercises} />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="alert alert-warning">
                        No se pudieron cargar las estadísticas. Por favor, intenta recargar la página.
                    </div>
                )}
            </main>
        </div>
    )
}

