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

export default function AdminUsers() {
    const [user, setUser] = useState<any>(null)
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'PROFESSOR'
    })
    const [editingUser, setEditingUser] = useState<any>(null)
    const [message, setMessage] = useState('')
    const router = useRouter()

    useEffect(() => {
        fetch('/api/auth/me')
            .then((res) => res.json())
            .then((data) => {
                if (!data.user || data.user.role !== 'ADMIN') {
                    router.push('/login')
                } else {
                    setUser(data.user)
                    fetchUsers()
                }
            })
    }, [router])

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users')
            const data = await res.json()
            if (data.users) {
                setUsers(data.users.filter((u: any) => u.role !== 'STUDENT'))
            }
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (res.ok) {
                setShowCreateModal(false)
                setFormData({ name: '', email: '', password: '', role: 'PROFESSOR' })
                setMessage('Usuario creado exitosamente')
                fetchUsers()
                setTimeout(() => setMessage(''), 3000)
            } else {
                alert(data.error || 'Error al crear usuario')
            }
        } catch (error) {
            alert('Error al crear usuario')
        }
    }

    const handleEditUser = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingUser) return

        try {
            const updateData: any = {
                name: editingUser.name,
                email: editingUser.email,
                role: editingUser.role
            }

            if (editingUser.newPassword) {
                updateData.password = editingUser.newPassword
            }

            const res = await fetch(`/api/admin/users/${editingUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            })

            if (res.ok) {
                setShowEditModal(false)
                setEditingUser(null)
                setMessage('Usuario actualizado exitosamente')
                fetchUsers()
                setTimeout(() => setMessage(''), 3000)
            } else {
                const data = await res.json()
                alert(data.error || 'Error al actualizar usuario')
            }
        } catch (error) {
            alert('Error al actualizar usuario')
        }
    }

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
            return
        }

        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                setMessage('Usuario eliminado exitosamente')
                fetchUsers()
                setTimeout(() => setMessage(''), 3000)
            } else {
                const data = await res.json()
                alert(data.error || 'Error al eliminar usuario')
            }
        } catch (error) {
            alert('Error al eliminar usuario')
        }
    }

    const handleToggleActive = async (userId: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !currentStatus })
            })

            if (res.ok) {
                setMessage(`Usuario ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`)
                fetchUsers()
                setTimeout(() => setMessage(''), 3000)
            } else {
                const data = await res.json()
                alert(data.error || 'Error al actualizar usuario')
            }
        } catch (error) {
            console.error('Error updating user:', error)
            alert('Error al actualizar usuario')
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
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="h2">Gestión de Usuarios</h1>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowCreateModal(true)}
                        >
                            + Crear Usuario
                        </button>
                    </div>

                    {message && (
                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                            {message}
                            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="card">
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Email</th>
                                                <th>Rol</th>
                                                <th>Estado</th>
                                                <th>Fecha Registro</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((u) => (
                                                <tr key={u.id}>
                                                    <td>{u.name}</td>
                                                    <td>{u.email}</td>
                                                    <td>
                                                        <span className={`badge ${u.role === 'ADMIN' ? 'bg-danger' :
                                                                u.role === 'PROFESSOR' ? 'bg-primary' :
                                                                    'bg-secondary'
                                                            }`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${u.active ? 'bg-success' : 'bg-warning'}`}>
                                                            {u.active ? 'Activo' : 'Inactivo'}
                                                        </span>
                                                    </td>
                                                    <td className="text-muted small">
                                                        {new Date(u.createdAt).toLocaleDateString('es-ES')}
                                                    </td>
                                                    <td>
                                                        <div className="btn-group btn-group-sm" role="group">
                                                            <button
                                                                className="btn btn-outline-primary"
                                                                onClick={() => {
                                                                    setEditingUser({ ...u, newPassword: '' })
                                                                    setShowEditModal(true)
                                                                }}
                                                                title="Editar"
                                                            >
                                                                ✏️
                                                            </button>
                                                            <button
                                                                className={`btn ${u.active ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                                                onClick={() => handleToggleActive(u.id, u.active)}
                                                                title={u.active ? 'Desactivar' : 'Activar'}
                                                            >
                                                                {u.active ? '🔒' : '🔓'}
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-danger"
                                                                onClick={() => handleDeleteUser(u.id)}
                                                                title="Eliminar"
                                                            >
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Create User Modal */}
                    {showCreateModal && (
                        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Crear Nuevo Usuario</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => setShowCreateModal(false)}
                                        ></button>
                                    </div>
                                    <form onSubmit={handleCreateUser}>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label className="form-label">Nombre</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Contraseña</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Rol</label>
                                                <select
                                                    className="form-select"
                                                    value={formData.role}
                                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                >
                                                    <option value="PROFESSOR">Profesor</option>
                                                    <option value="ASSISTANT">Asistente</option>
                                                    <option value="ADMIN">Administrador</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => setShowCreateModal(false)}
                                            >
                                                Cancelar
                                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                Crear Usuario
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Edit User Modal */}
                    {showEditModal && editingUser && (
                        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Editar Usuario</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => {
                                                setShowEditModal(false)
                                                setEditingUser(null)
                                            }}
                                        ></button>
                                    </div>
                                    <form onSubmit={handleEditUser}>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label className="form-label">Nombre</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={editingUser.name}
                                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    value={editingUser.email}
                                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Nueva Contraseña (opcional)</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    value={editingUser.newPassword || ''}
                                                    onChange={(e) => setEditingUser({ ...editingUser, newPassword: e.target.value })}
                                                    placeholder="Dejar en blanco para no cambiar"
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Rol</label>
                                                <select
                                                    className="form-select"
                                                    value={editingUser.role}
                                                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                                >
                                                    <option value="PROFESSOR">Profesor</option>
                                                    <option value="ASSISTANT">Asistente</option>
                                                    <option value="ADMIN">Administrador</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => {
                                                    setShowEditModal(false)
                                                    setEditingUser(null)
                                                }}
                                            >
                                                Cancelar
                                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                Guardar Cambios
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
