'use client'

import { useState } from 'react'
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

export default function NewStudent() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        monthlyFee: '',
        age: '',
        details: '',
        pathologies: ''
    })
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        try {
            const res = await fetch('/api/professor/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (res.ok) {
                alert('Estudiante creado exitosamente')
                router.push('/dashboard/professor/students')
            } else {
                setError(data.error || 'Error al crear estudiante')
            }
        } catch (err) {
            setError('Error de conexión')
        }
    }

    return (
        <div>
            <Sidebar items={professorNavItems} userRole="PROFESSOR" />

            <main className="container-fluid p-4">
                <div className="container-fluid">
                    <h1 className="h2 mb-4">Registrar Nuevo Estudiante</h1>

                    <div className="card">
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
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
                                        <label htmlFor="email" className="form-label">Correo Electrónico</label>
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

                                    <div className="col-md-6">
                                        <label htmlFor="monthlyFee" className="form-label">Cuota Mensual ($)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="monthlyFee"
                                            value={formData.monthlyFee}
                                            onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="age" className="form-label">Edad</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="age"
                                            value={formData.age}
                                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                            placeholder="Edad del estudiante"
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="password" className="form-label">Contraseña Inicial</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="details" className="form-label">Detalles Personales</label>
                                        <textarea
                                            className="form-control"
                                            id="details"
                                            rows={3}
                                            value={formData.details}
                                            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                            placeholder="Información adicional (objetivos, preferencias, etc.)"
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="pathologies" className="form-label">Patologías / Condiciones Médicas</label>
                                        <textarea
                                            className="form-control"
                                            id="pathologies"
                                            rows={3}
                                            value={formData.pathologies}
                                            onChange={(e) => setFormData({ ...formData, pathologies: e.target.value })}
                                            placeholder="Lesiones, condiciones médicas, restricciones, etc."
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 d-flex gap-2">
                                    <button type="submit" className="btn btn-primary">
                                        Crear Estudiante
                                    </button>
                                    <button type="button" onClick={() => router.back()} className="btn btn-secondary">
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
