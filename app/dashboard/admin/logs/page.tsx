'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

const adminNavItems = [
    { name: 'Dashboard', href: '/dashboard/admin' },
    { name: 'Usuarios', href: '/dashboard/admin/users' },
    { name: 'Logs', href: '/dashboard/admin/logs' },
    { name: 'Configuración', href: '/dashboard/admin/settings' },
]

export default function AdminLogs() {
    const [user, setUser] = useState<any>(null)
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [filterAction, setFilterAction] = useState('')
    const [filterEntityType, setFilterEntityType] = useState('')
    const router = useRouter()

    useEffect(() => {
        fetch('/api/auth/me')
            .then((res) => res.json())
            .then((data) => {
                if (!data.user || data.user.role !== 'ADMIN') {
                    router.push('/login')
                } else {
                    setUser(data.user)
                }
            })
    }, [router])

    useEffect(() => {
        if (user) {
            fetchLogs()
        }
    }, [user, page, filterAction, filterEntityType])

    const fetchLogs = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '20',
                ...(filterAction && { action: filterAction }),
                ...(filterEntityType && { entityType: filterEntityType })
            })

            const res = await fetch(`/api/admin/logs?${params}`)
            const data = await res.json()

            if (data.logs) {
                setLogs(data.logs)
                setTotalPages(data.pagination.totalPages)
            }
        } catch (error) {
            console.error('Error fetching logs:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleClearFilters = () => {
        setFilterAction('')
        setFilterEntityType('')
        setPage(1)
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
                    <h1 className="h2 mb-4">Logs de Actividad</h1>

                    {/* Filters */}
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label">Filtrar por Acción</label>
                                    <select
                                        className="form-select"
                                        value={filterAction}
                                        onChange={(e) => {
                                            setFilterAction(e.target.value)
                                            setPage(1)
                                        }}
                                    >
                                        <option value="">Todas las acciones</option>
                                        <option value="CREATE_STUDENT">Crear Estudiante</option>
                                        <option value="UPDATE_STUDENT">Actualizar Estudiante</option>
                                        <option value="DELETE_STUDENT">Eliminar Estudiante</option>
                                        <option value="CREATE_PLAN">Crear Plan</option>
                                        <option value="UPDATE_PLAN">Actualizar Plan</option>
                                        <option value="DELETE_PLAN">Eliminar Plan</option>
                                        <option value="CREATE_EXERCISE">Crear Ejercicio</option>
                                        <option value="UPDATE_EXERCISE">Actualizar Ejercicio</option>
                                        <option value="DELETE_EXERCISE">Eliminar Ejercicio</option>
                                        <option value="LOGIN">Inicio de Sesión</option>
                                        <option value="LOGOUT">Cierre de Sesión</option>
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Filtrar por Tipo</label>
                                    <select
                                        className="form-select"
                                        value={filterEntityType}
                                        onChange={(e) => {
                                            setFilterEntityType(e.target.value)
                                            setPage(1)
                                        }}
                                    >
                                        <option value="">Todos los tipos</option>
                                        <option value="Student">Estudiante</option>
                                        <option value="Plan">Plan</option>
                                        <option value="Exercise">Ejercicio</option>
                                        <option value="Payment">Pago</option>
                                        <option value="User">Usuario</option>
                                        <option value="Settings">Configuración</option>
                                    </select>
                                </div>
                                <div className="col-md-4 d-flex align-items-end">
                                    <button
                                        className="btn btn-outline-secondary w-100"
                                        onClick={handleClearFilters}
                                    >
                                        Limpiar Filtros
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Logs Table */}
                    <div className="card">
                        <div className="card-body">
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Cargando...</span>
                                    </div>
                                </div>
                            ) : logs.length > 0 ? (
                                <>
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Fecha/Hora</th>
                                                    <th>Usuario</th>
                                                    <th>Rol</th>
                                                    <th>Acción</th>
                                                    <th>Tipo</th>
                                                    <th>IP</th>
                                                    <th>Detalles</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {logs.map((log) => (
                                                    <tr key={log.id}>
                                                        <td className="text-nowrap small">
                                                            {new Date(log.createdAt).toLocaleString('es-ES')}
                                                        </td>
                                                        <td>{log.user.name}</td>
                                                        <td>
                                                            <span className={`badge ${log.user.role === 'ADMIN' ? 'bg-danger' :
                                                                    log.user.role === 'PROFESSOR' ? 'bg-primary' :
                                                                        'bg-secondary'
                                                                }`}>
                                                                {log.user.role}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <code className="small">{log.action}</code>
                                                        </td>
                                                        <td>
                                                            <span className="badge bg-info">{log.entityType}</span>
                                                        </td>
                                                        <td className="text-muted small">{log.ipAddress || '-'}</td>
                                                        <td>
                                                            {log.details ? (
                                                                <button
                                                                    className="btn btn-sm btn-outline-secondary"
                                                                    onClick={() => alert(log.details)}
                                                                >
                                                                    Ver
                                                                </button>
                                                            ) : (
                                                                '-'
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <nav className="mt-3">
                                            <ul className="pagination justify-content-center">
                                                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                                    <button
                                                        className="page-link"
                                                        onClick={() => setPage(page - 1)}
                                                        disabled={page === 1}
                                                    >
                                                        Anterior
                                                    </button>
                                                </li>
                                                {[...Array(totalPages)].map((_, i) => (
                                                    <li key={i + 1} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                                                        <button
                                                            className="page-link"
                                                            onClick={() => setPage(i + 1)}
                                                        >
                                                            {i + 1}
                                                        </button>
                                                    </li>
                                                ))}
                                                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                                    <button
                                                        className="page-link"
                                                        onClick={() => setPage(page + 1)}
                                                        disabled={page === totalPages}
                                                    >
                                                        Siguiente
                                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-5 text-muted">
                                    <p>No se encontraron logs con los filtros seleccionados</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
