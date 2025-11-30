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
    { name: 'Mensajes', href: '/dashboard/professor/messages' },
    { name: 'Pagos', href: '/dashboard/professor/payments' },
]

export default function NewPayment() {
    const [students, setStudents] = useState<any[]>([])
    const [formData, setFormData] = useState({
        studentId: '',
        amount: '',
        method: 'Efectivo',
        observations: '',
    })
    const router = useRouter()

    useEffect(() => {
        fetch('/api/professor/students').then(res => res.json()).then(data => setStudents(data.students || []))
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch('/api/payments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })

        if (res.ok) {
            alert('Pago registrado exitosamente')
            router.push('/dashboard/professor/payments')
        } else {
            alert('Error al registrar el pago')
        }
    }

    return (
        <div>
            <Sidebar items={professorNavItems} userRole="PROFESSOR" />

            <main className="container-fluid p-4">
                <div className="container-fluid">
                    <h1 className="h2 mb-4">Registrar Pago</h1>

                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="student" className="form-label">Estudiante</label>
                                        <select
                                            id="student"
                                            className="form-select"
                                            value={formData.studentId}
                                            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                            required
                                        >
                                            <option value="">Seleccionar estudiante...</option>
                                            {students.map(s => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="amount" className="form-label">Monto ($)</label>
                                        <input
                                            type="number"
                                            id="amount"
                                            className="form-control"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="method" className="form-label">Método de Pago</label>
                                        <select
                                            id="method"
                                            className="form-select"
                                            value={formData.method}
                                            onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                                        >
                                            <option value="Efectivo">Efectivo</option>
                                            <option value="Transferencia">Transferencia</option>
                                            <option value="Tarjeta">Tarjeta</option>
                                            <option value="Otro">Otro</option>
                                        </select>
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="observations" className="form-label">Observaciones</label>
                                        <textarea
                                            id="observations"
                                            className="form-control"
                                            rows={3}
                                            value={formData.observations}
                                            onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 d-flex gap-2">
                                    <button type="submit" className="btn btn-primary">
                                        Registrar Pago
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

