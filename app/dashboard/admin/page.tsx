'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'

const adminNavItems = [
    { name: 'Dashboard', href: '/dashboard/admin' },
    { name: 'Usuarios', href: '/dashboard/admin/users' },
    { name: 'Logs', href: '/dashboard/admin/logs' },
    { name: 'Configuración', href: '/dashboard/admin/settings' },
]

export default function AdminDashboard() {
    const [user, setUser] = useState<any>(null)
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetch('/api/auth/me')
            .then((res) => res.json())
            .then((data) => {
                if (!data.user || data.user.role !== 'ADMIN') {
                    router.push('/login')
                } else {
                    setUser(data.user)
                    fetchStats()
                }
            })
    }, [router])

    const fetchStats = async () => {
        try {
            // Fetch basic stats
            const [usersRes, studentsRes, logsRes] = await Promise.all([
                fetch('/api/admin/users'),
                fetch('/api/professor/students'),
                fetch('/api/admin/logs?limit=5')
            ])

            const users = await usersRes.json()
            const students = await studentsRes.json()
            const logs = await logsRes.json()

            setStats({
                totalUsers: users.users?.length || 0,
                totalStudents: students.students?.length || 0,
                recentLogs: logs.logs || []
            })
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setLoading(false)
        }
    }

    if (!user) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Sidebar items={adminNavItems} userRole="ADMIN" userName={user.name} />

            <main className="container-fluid p-4">
                <div className="container-fluid">
                    <h1 className="h2 mb-4">Panel de Administración</h1>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Stats Cards */}
                            <div className="row g-4 mb-4">
                                <div className="col-md-4">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title text-muted">Total Usuarios</h5>
                                            <h2 className="mb-0">{stats?.totalUsers || 0}</h2>
                                            <small className="text-muted">Profesores y Asistentes</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title text-muted">Total Estudiantes</h5>
                                            <h2 className="mb-0">{stats?.totalStudents || 0}</h2>
                                            <small className="text-muted">Clientes registrados</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title text-muted">Sistema</h5>
                                            <h2 className="mb-0 text-success">Activo</h2>
                                            <small className="text-muted">Funcionando correctamente</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="row g-4 mb-4">
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5 className="mb-0">Accesos Rápidos</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="row g-3">
                                                <div className="col-md-3">
                                                    <Link href="/dashboard/admin/users" className="btn btn-outline-primary w-100">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-people mb-2" viewBox="0 0 16 16">
                                                            <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                                                        </svg>
                                                        <div>Gestionar Usuarios</div>
                                                    </Link>
                                                </div>
                                                <div className="col-md-3">
                                                    <Link href="/dashboard/admin/settings" className="btn btn-outline-primary w-100">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-gear mb-2" viewBox="0 0 16 16">
                                                            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
                                                            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
                                                        </svg>
                                                        <div>Configuración</div>
                                                    </Link>
                                                </div>
                                                <div className="col-md-3">
                                                    <Link href="/dashboard/admin/logs" className="btn btn-outline-primary w-100">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-file-text mb-2" viewBox="0 0 16 16">
                                                            <path d="M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5M5 8a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z" />
                                                            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1" />
                                                        </svg>
                                                        <div>Ver Logs</div>
                                                    </Link>
                                                </div>
                                                <div className="col-md-3">
                                                    <Link href="/dashboard/professor" className="btn btn-outline-secondary w-100">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-house mb-2" viewBox="0 0 16 16">
                                                            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
                                                        </svg>
                                                        <div>Dashboard Profesor</div>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">Actividad Reciente</h5>
                                    <Link href="/dashboard/admin/logs" className="btn btn-sm btn-outline-primary">
                                        Ver todos
                                    </Link>
                                </div>
                                <div className="card-body">
                                    {stats?.recentLogs?.length > 0 ? (
                                        <div className="table-responsive">
                                            <table className="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>Usuario</th>
                                                        <th>Acción</th>
                                                        <th>Tipo</th>
                                                        <th>Fecha</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {stats.recentLogs.map((log: any) => (
                                                        <tr key={log.id}>
                                                            <td>{log.user.name}</td>
                                                            <td><code className="small">{log.action}</code></td>
                                                            <td><span className="badge bg-secondary">{log.entityType}</span></td>
                                                            <td className="text-muted small">
                                                                {new Date(log.createdAt).toLocaleString('es-ES')}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-muted text-center mb-0">No hay actividad reciente</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}
