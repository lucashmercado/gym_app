'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'

const professorNavItems = [
    { name: 'Dashboard', href: '/dashboard/professor' },
    { name: 'Estudiantes', href: '/dashboard/professor/students' },
    { name: 'Planes', href: '/dashboard/professor/plans' },
    { name: 'Plantillas', href: '/dashboard/professor/templates' },
    { name: 'Ejercicios', href: '/dashboard/professor/exercises' },
    { name: 'Pagos', href: '/dashboard/professor/payments' },
]

export default function EditStudent() {
    const params = useParams()
    const studentId = params.id as string
    const [student, setStudent] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        membershipType: 'MENSUAL',
        membershipEndDate: '',
        active: true,
    })
    const router = useRouter()

    useEffect(() => {
        if (!studentId) return

        fetch(`/api/professor/students/${studentId}`)
            .then((res) => res.json())
            .then((data) => {
                setStudent(data.student)
                setFormData({
                    name: data.student.name || '',
                    email: data.student.email || '',
                    phone: data.student.phone || '',
                    membershipType: data.student.membershipType || 'MENSUAL',
                    membershipEndDate: data.student.membershipEndDate
                        ? new Date(data.student.membershipEndDate).toISOString().split('T')[0]
                        : '',
                    active: data.student.active ?? true,
                })
                setLoading(false)
            })
            .catch((err) => {
                console.error('Error loading student:', err)
                setLoading(false)
            })
    }, [studentId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const res = await fetch(`/api/professor/students/${studentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                alert('Estudiante actualizado exitosamente')
                router.push(`/dashboard/professor/students/${studentId}`)
            } else {
                const text = await res.text()
                console.error('Error response:', text)
                console.error('Status:', res.status)

                let errorMessage = 'No se pudo actualizar el estudiante'
                try {
                    const error = text ? JSON.parse(text) : {}
                    errorMessage = error.error || error.message || errorMessage
                } catch (e) {
                    errorMessage = text || errorMessage
                }

                alert(`Error (${res.status}): ${errorMessage}`)
            }
        } catch (error) {
            console.error('Fetch error:', error)
            alert('Error de conexión. Por favor verifica que el servidor esté corriendo.')
        }
    }

    if (loading) {
        return (
            <div>
                <Sidebar items={professorNavItems} userRole="PROFESSOR" />
                <main className="container-fluid p-4">
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    if (!student) {
        return (
            <div>
                <Sidebar items={professorNavItems} userRole="PROFESSOR" />
                <main className="container-fluid p-4">
                    <div className="alert alert-danger">
                        <h4>Estudiante no encontrado</h4>
                        <p>No se pudo cargar la información del estudiante.</p>
                        <Link href="/dashboard/professor/students" className="btn btn-primary">
                            Volver a Estudiantes
                        </Link>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div>
            <Sidebar items={professorNavItems} userRole="PROFESSOR" />

            <main className="container-fluid p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="h2">Editar Estudiante</h1>
                        <p className="text-muted">{student.name}</p>
                    </div>
                    <Link href={`/dashboard/professor/students/${studentId}`} className="btn btn-secondary">
                        Cancelar
                    </Link>
                </div>

                <div className="row">
                    <div className="col-lg-8">
                        <form onSubmit={handleSubmit}>
                            <div className="card mb-4">
                                <div className="card-body">
                                    <h5 className="card-title mb-3">Información Personal</h5>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label htmlFor="name" className="form-label">Nombre Completo</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="phone" className="form-label">Teléfono</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                id="phone"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card mb-4">
                                <div className="card-body">
                                    <h5 className="card-title mb-3">Membresía</h5>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label htmlFor="membershipType" className="form-label">Tipo de Membresía</label>
                                            <select
                                                className="form-select"
                                                id="membershipType"
                                                value={formData.membershipType}
                                                onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })}
                                            >
                                                <option value="MENSUAL">Mensual</option>
                                                <option value="TRIMESTRAL">Trimestral</option>
                                                <option value="SEMESTRAL">Semestral</option>
                                                <option value="ANUAL">Anual</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="membershipEndDate" className="form-label">
                                                Fecha de Vencimiento
                                                <span className="text-muted ms-2">(Fecha en que vence la membresía)</span>
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="membershipEndDate"
                                                value={formData.membershipEndDate}
                                                onChange={(e) => setFormData({ ...formData, membershipEndDate: e.target.value })}
                                            />
                                            <small className="text-muted">
                                                Deja vacío si no tiene membresía activa
                                            </small>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="active"
                                                    checked={formData.active}
                                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                                />
                                                <label className="form-check-label" htmlFor="active">
                                                    Estudiante activo
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg me-2" viewBox="0 0 16 16">
                                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                                    </svg>
                                    Guardar Cambios
                                </button>
                                <Link href={`/dashboard/professor/students/${studentId}`} className="btn btn-secondary">
                                    Cancelar
                                </Link>
                            </div>
                        </form>
                    </div>

                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Estado de Membresía</h5>
                                <div className="mt-3">
                                    {formData.membershipEndDate ? (
                                        <>
                                            <p className="mb-2">
                                                <strong>Vence:</strong> {new Date(formData.membershipEndDate).toLocaleDateString('es-ES', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                            <p className="mb-0">
                                                <strong>Días restantes:</strong>{' '}
                                                {Math.ceil((new Date(formData.membershipEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} días
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-muted">Sin fecha de vencimiento configurada</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="card mt-3">
                            <div className="card-body">
                                <h5 className="card-title">Acciones Rápidas</h5>
                                <div className="d-grid gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={() => {
                                            const today = new Date()
                                            const nextMonth = new Date(today.setMonth(today.getMonth() + 1))
                                            setFormData({
                                                ...formData,
                                                membershipEndDate: nextMonth.toISOString().split('T')[0]
                                            })
                                        }}
                                    >
                                        Renovar por 1 mes
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={() => {
                                            const today = new Date()
                                            const nextThreeMonths = new Date(today.setMonth(today.getMonth() + 3))
                                            setFormData({
                                                ...formData,
                                                membershipEndDate: nextThreeMonths.toISOString().split('T')[0]
                                            })
                                        }}
                                    >
                                        Renovar por 3 meses
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={() => {
                                            const today = new Date()
                                            const nextYear = new Date(today.setFullYear(today.getFullYear() + 1))
                                            setFormData({
                                                ...formData,
                                                membershipEndDate: nextYear.toISOString().split('T')[0]
                                            })
                                        }}
                                    >
                                        Renovar por 1 año
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
