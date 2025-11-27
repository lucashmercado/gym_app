'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

const professorNavItems = [
    { name: 'Dashboard', href: '/dashboard/professor' },
    { name: 'Estudiantes', href: '/dashboard/professor/students' },
    { name: 'Planes', href: '/dashboard/professor/plans' },
    { name: 'Plantillas', href: '/dashboard/professor/templates' },
    { name: 'Ejercicios', href: '/dashboard/professor/exercises' },
    { name: 'Pagos', href: '/dashboard/professor/payments' },
]

export default function AssignTemplate() {
    const params = useParams()
    const templateId = params.id as string
    const [template, setTemplate] = useState<any>(null)
    const [students, setStudents] = useState<any[]>([])
    const [selectedStudent, setSelectedStudent] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [customExercises, setCustomExercises] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // Fetch template
        fetch(`/api/professor/templates/${templateId}`)
            .then((res) => res.json())
            .then((data) => {
                setTemplate(data.template)
                // Initialize custom exercises with template defaults
                setCustomExercises(data.template.exercises.map((ex: any) => ({
                    templateExerciseId: ex.id,
                    sets: ex.sets,
                    reps: ex.reps,
                    weight: ex.weight,
                    rest: ex.rest
                })))
            })

        // Fetch students
        fetch('/api/professor/students')
            .then((res) => res.json())
            .then((data) => setStudents(data.students || []))
    }, [templateId])

    const updateCustomExercise = (templateExerciseId: string, field: string, value: any) => {
        setCustomExercises(customExercises.map(ex =>
            ex.templateExerciseId === templateExerciseId
                ? { ...ex, [field]: value }
                : ex
        ))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const res = await fetch(`/api/professor/templates/${templateId}/assign`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentId: selectedStudent,
                startDate,
                endDate: endDate || null,
                customExercises
            })
        })

        if (res.ok) {
            alert('Plantilla asignada exitosamente')
            router.push('/dashboard/professor/plans')
        } else {
            const data = await res.json()
            alert(data.error || 'Error al asignar plantilla')
        }
        setLoading(false)
    }

    if (!template) {
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
            <Sidebar items={professorNavItems} userRole="PROFESSOR" />

            <main className="container-fluid p-4">
                <div className="container-fluid">
                    <h1 className="h2 mb-4">Asignar Plantilla: {template.name}</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="card mb-4">
                            <div className="card-body">
                                <h5 className="card-title mb-3">Información del Plan</h5>
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label htmlFor="student" className="form-label">Estudiante</label>
                                        <select
                                            className="form-select"
                                            id="student"
                                            value={selectedStudent}
                                            onChange={(e) => setSelectedStudent(e.target.value)}
                                            required
                                        >
                                            <option value="">Seleccionar estudiante...</option>
                                            {students.map((student) => (
                                                <option key={student.id} value={student.id}>
                                                    {student.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="startDate" className="form-label">Fecha de Inicio</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="startDate"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="endDate" className="form-label">Fecha de Fin (opcional)</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="endDate"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card mb-4">
                            <div className="card-body">
                                <h5 className="card-title mb-3">Personalizar Ejercicios</h5>
                                <p className="text-muted small">Ajusta los pesos y repeticiones para este estudiante específico</p>

                                <div className="row g-3">
                                    {template.exercises.map((ex: any) => {
                                        const custom = customExercises.find(c => c.templateExerciseId === ex.id)
                                        return (
                                            <div key={ex.id} className="col-12">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <h6 className="mb-3">{ex.exercise.name} - {ex.day}</h6>
                                                        <div className="row g-2">
                                                            <div className="col-md-3">
                                                                <label className="form-label small">Series</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control form-control-sm"
                                                                    value={custom?.sets || ex.sets}
                                                                    onChange={(e) => updateCustomExercise(ex.id, 'sets', parseInt(e.target.value))}
                                                                    min="1"
                                                                />
                                                            </div>
                                                            <div className="col-md-3">
                                                                <label className="form-label small">Reps</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm"
                                                                    value={custom?.reps || ex.reps}
                                                                    onChange={(e) => updateCustomExercise(ex.id, 'reps', e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="col-md-3">
                                                                <label className="form-label small">Peso (kg)</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control form-control-sm"
                                                                    value={custom?.weight || ex.weight}
                                                                    onChange={(e) => updateCustomExercise(ex.id, 'weight', parseFloat(e.target.value))}
                                                                    step="0.5"
                                                                />
                                                            </div>
                                                            <div className="col-md-3">
                                                                <label className="form-label small">Descanso (seg)</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control form-control-sm"
                                                                    value={custom?.rest || ex.rest}
                                                                    onChange={(e) => updateCustomExercise(ex.id, 'rest', parseInt(e.target.value))}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Asignando...' : 'Asignar Plan'}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/dashboard/professor/templates')}
                                className="btn btn-secondary"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}
