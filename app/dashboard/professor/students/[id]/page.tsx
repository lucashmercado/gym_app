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

export default function StudentDetail() {
    const params = useParams()
    const studentId = params.id as string
    const [student, setStudent] = useState<any>(null)
    const [progress, setProgress] = useState<any[]>([])
    const [payments, setPayments] = useState<any[]>([])
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        phone: '',
        monthlyFee: '',
        active: true,
        password: '',
        age: '',
        details: '',
        pathologies: ''
    })
    const router = useRouter()

    const fetchStudentData = () => {
        if (!studentId) return

        // Fetch student details
        fetch(`/api/professor/students/${studentId}`)
            .then((res) => res.json())
            .then((data) => {
                setStudent(data.student)
                setEditForm({
                    name: data.student.name || '',
                    email: data.student.email || '',
                    phone: data.student.phone || '',
                    monthlyFee: data.student.studentProfile?.monthlyFee || '',
                    active: data.student.active,
                    password: '',
                    age: data.student.studentProfile?.age || '',
                    details: data.student.studentProfile?.details || '',
                    pathologies: data.student.studentProfile?.pathologies || ''
                })
            })

        // Fetch student progress
        fetch(`/api/professor/students/${studentId}/progress`)
            .then((res) => res.json())
            .then((data) => setProgress(data.progress || []))

        // Fetch student payments
        fetch(`/api/professor/students/${studentId}/payments`)
            .then((res) => res.json())
            .then((data) => setPayments(data.payments || []))
    }

    useEffect(() => {
        fetchStudentData()
    }, [studentId])

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const updateData: any = {
            name: editForm.name,
            email: editForm.email,
            phone: editForm.phone,
            monthlyFee: editForm.monthlyFee,
            active: editForm.active,
            age: editForm.age,
            details: editForm.details,
            pathologies: editForm.pathologies
        }

        if (editForm.password) {
            updateData.password = editForm.password
        }

        const res = await fetch(`/api/professor/students/${studentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        })

        if (res.ok) {
            alert('Estudiante actualizado exitosamente')
            setEditForm({ ...editForm, password: '' })
            fetchStudentData()
        } else {
            try {
                const data = await res.json()
                alert(data.error || 'Error al actualizar estudiante')
            } catch (e) {
                alert('Error al actualizar estudiante. Por favor, reinicia el servidor.')
            }
        }
    }

    if (!student) return <div className="d-flex justify-content-center align-items-center min-vh-100"><div className="spinner-border" role="status"><span className="visually-hidden">Cargando...</span></div></div>

    return (
        <div>
            <Sidebar items={professorNavItems} userRole="PROFESSOR" />

            <main className="container-fluid p-4">
                <div className="container-fluid">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h1 className="h2">{student.name}</h1>
                            <p className="text-muted">{student.email}</p>
                        </div>
                        <div className="d-flex gap-2">
                            <Link href={`/dashboard/professor/students/${studentId}/edit`} className="btn btn-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil me-2" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                                </svg>
                                Editar
                            </Link>
                            <Link href="/dashboard/professor/students" className="btn btn-secondary">
                                ← Volver
                            </Link>
                        </div>
                    </div>

                    {/* Student Info Card */}
                    <div className="row g-3 mb-4">
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-subtitle mb-2 text-muted">Estado</h6>
                                    <span className={`badge ${student.active ? 'bg-success' : 'bg-danger'}`}>
                                        {student.active ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-subtitle mb-2 text-muted">Cuota Mensual</h6>
                                    <p className="h5 mb-0">${student.studentProfile?.monthlyFee || 0}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-subtitle mb-2 text-muted">Vencimiento</h6>
                                    <p className="mb-0">
                                        {student.studentProfile?.membershipEndDate
                                            ? new Date(student.studentProfile.membershipEndDate).toLocaleDateString('es-ES')
                                            : 'No definido'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <ul className="nav nav-tabs mb-3" id="studentTabs" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="progress-tab" data-bs-toggle="tab" data-bs-target="#progress" type="button" role="tab">
                                Progreso
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="payments-tab" data-bs-toggle="tab" data-bs-target="#payments" type="button" role="tab">
                                Pagos
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="edit-tab" data-bs-toggle="tab" data-bs-target="#edit" type="button" role="tab">
                                Editar
                            </button>
                        </li>
                    </ul>

                    <div className="tab-content" id="studentTabsContent">
                        {/* Progress Tab */}
                        <div className="tab-pane fade show active" id="progress" role="tabpanel">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Historial de Entrenamientos</h5>
                                    {progress.length > 0 ? (
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Fecha</th>
                                                        <th>Ejercicio</th>
                                                        <th>Series</th>
                                                        <th>Reps</th>
                                                        <th>Peso</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {progress.map((p) => (
                                                        <tr key={p.id}>
                                                            <td>{new Date(p.date).toLocaleDateString('es-ES')}</td>
                                                            <td className="fw-bold">{p.planExercise.exercise.name}</td>
                                                            <td><span className="badge bg-primary">{p.setsDone}</span></td>
                                                            <td>{p.repsDone}</td>
                                                            <td>{p.weightUsed ? `${p.weightUsed} kg` : 'Peso corporal'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-muted">No hay progreso registrado aún.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Payments Tab */}
                        <div className="tab-pane fade" id="payments" role="tabpanel">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Historial de Pagos</h5>
                                    {payments.length > 0 ? (
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Fecha</th>
                                                        <th>Monto</th>
                                                        <th>Método</th>
                                                        <th>Observaciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {payments.map((payment) => (
                                                        <tr key={payment.id}>
                                                            <td>{new Date(payment.date).toLocaleDateString('es-ES')}</td>
                                                            <td className="fw-bold text-success">${payment.amount}</td>
                                                            <td><span className="badge bg-secondary">{payment.method || 'N/A'}</span></td>
                                                            <td className="text-muted">{payment.observations || '-'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-muted">No hay pagos registrados aún.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Edit Tab */}
                        <div className="tab-pane fade" id="edit" role="tabpanel">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title mb-4">Editar Información del Estudiante</h5>
                                    <form onSubmit={handleEditSubmit}>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label htmlFor="editName" className="form-label">Nombre Completo</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="editName"
                                                    value={editForm.name}
                                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="editEmail" className="form-label">Correo Electrónico</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="editEmail"
                                                    value={editForm.email}
                                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="editPhone" className="form-label">Teléfono</label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    id="editPhone"
                                                    value={editForm.phone}
                                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="editMonthlyFee" className="form-label">Cuota Mensual ($)</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="editMonthlyFee"
                                                    value={editForm.monthlyFee}
                                                    onChange={(e) => setEditForm({ ...editForm, monthlyFee: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="editPassword" className="form-label">Nueva Contraseña (opcional)</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="editPassword"
                                                    value={editForm.password}
                                                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                                    placeholder="Dejar en blanco para no cambiar"
                                                />
                                                <small className="text-muted">Solo completa este campo si deseas cambiar la contraseña</small>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Estado</label>
                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="editActive"
                                                        checked={editForm.active}
                                                        onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
                                                    />
                                                    <label className="form-check-label" htmlFor="editActive">
                                                        {editForm.active ? 'Activo' : 'Inactivo'}
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="editAge" className="form-label">Edad</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="editAge"
                                                    value={editForm.age}
                                                    onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                                                    placeholder="Edad del estudiante"
                                                />
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="editDetails" className="form-label">Detalles Personales</label>
                                                <textarea
                                                    className="form-control"
                                                    id="editDetails"
                                                    rows={3}
                                                    value={editForm.details}
                                                    onChange={(e) => setEditForm({ ...editForm, details: e.target.value })}
                                                    placeholder="Información adicional sobre el estudiante (objetivos, preferencias, etc.)"
                                                />
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="editPathologies" className="form-label">Patologías / Condiciones Médicas</label>
                                                <textarea
                                                    className="form-control"
                                                    id="editPathologies"
                                                    rows={3}
                                                    value={editForm.pathologies}
                                                    onChange={(e) => setEditForm({ ...editForm, pathologies: e.target.value })}
                                                    placeholder="Lesiones, condiciones médicas, restricciones, etc."
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4 d-flex gap-2">
                                            <button type="submit" className="btn btn-primary">
                                                Guardar Cambios
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => {
                                                    setEditForm({
                                                        name: student.name || '',
                                                        email: student.email || '',
                                                        phone: student.phone || '',
                                                        monthlyFee: student.studentProfile?.monthlyFee || '',
                                                        active: student.active,
                                                        password: '',
                                                        age: student.studentProfile?.age || '',
                                                        details: student.studentProfile?.details || '',
                                                        pathologies: student.studentProfile?.pathologies || ''
                                                    })
                                                }}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
