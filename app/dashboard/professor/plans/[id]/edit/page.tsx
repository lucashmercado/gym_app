'use client'

import { useEffect, useState, use } from 'react'
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

export default function EditPlan({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [plan, setPlan] = useState<any>(null)
    const [exercises, setExercises] = useState<any[]>([])
    const [availableExercises, setAvailableExercises] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // Fetch plan
        fetch(`/api/plans/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error)
                    router.back()
                } else {
                    setPlan(data.plan)
                    // Map exercises to ensure exerciseId is set correctly
                    const mappedExercises = data.plan.exercises.map((ex: any) => ({
                        id: ex.id,
                        exerciseId: ex.exerciseId || ex.exercise?.id || '',
                        day: ex.day,
                        sets: ex.sets,
                        reps: ex.reps,
                        weight: ex.weight || 0,
                        rest: ex.rest || 60,
                        exercise: ex.exercise // Keep the nested exercise for display
                    }))
                    setExercises(mappedExercises)
                }
            })

        // Fetch available exercises
        fetch('/api/professor/exercises')
            .then((res) => res.json())
            .then((data) => setAvailableExercises(data.exercises || []))
    }, [id, router])

    const addExercise = () => {
        setExercises([...exercises, {
            id: `new-${Date.now()}`,
            exerciseId: '',
            day: 'Lunes',
            sets: 3,
            reps: '10',
            weight: 0,
            rest: 60,
            isNew: true
        }])
    }

    const removeExercise = (index: number) => {
        setExercises(exercises.filter((_, i) => i !== index))
    }

    const updateExercise = (index: number, field: string, value: any) => {
        const updated = [...exercises]
        updated[index] = { ...updated[index], [field]: value }
        setExercises(updated)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch(`/api/professor/plans/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ exercises })
            })

            if (res.ok) {
                alert('Plan actualizado exitosamente')
                router.push(`/dashboard/professor/plans/${id}`)
            } else {
                const contentType = res.headers.get('content-type')
                if (contentType && contentType.includes('application/json')) {
                    const data = await res.json()
                    alert(data.error || 'Error al actualizar plan')
                } else {
                    const text = await res.text()
                    alert(`Error al actualizar plan: ${text || res.statusText}`)
                }
            }
        } catch (error: any) {
            alert(`Error: ${error.message}`)
        }
        setLoading(false)
    }

    if (!plan) return (
        <div className="d-flex">
            <Sidebar items={professorNavItems} userRole="PROFESSOR" />
            <main className="flex-fill p-4">
                <div className="container-fluid">
                    <p>Cargando...</p>
                </div>
            </main>
        </div>
    )

    return (
        <div>
            <Sidebar items={professorNavItems} userRole="PROFESSOR" />

            <main className="container-fluid p-4">
                <div className="container-fluid">
                    <h1 className="h2 mb-4">Editar Plan: {plan.name}</h1>
                    <p className="text-muted mb-4">Estudiante: {plan.student.name}</p>

                    <form onSubmit={handleSubmit}>
                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="card-title mb-0">Ejercicios</h5>
                                    <button type="button" onClick={addExercise} className="btn btn-success btn-sm">
                                        + Agregar Ejercicio
                                    </button>
                                </div>

                                {exercises.length === 0 ? (
                                    <p className="text-muted">No hay ejercicios. Haz clic en "Agregar Ejercicio" para comenzar.</p>
                                ) : (
                                    <div className="row g-3">
                                        {exercises.map((ex, index) => (
                                            <div key={ex.id} className="col-12">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="row g-3">
                                                            <div className="col-md-4">
                                                                <label className="form-label">Ejercicio</label>
                                                                <select
                                                                    className="form-select"
                                                                    value={ex.exerciseId}
                                                                    onChange={(e) => updateExercise(index, 'exerciseId', e.target.value)}
                                                                    required
                                                                >
                                                                    <option value="">Seleccionar...</option>
                                                                    {availableExercises.map((exercise) => (
                                                                        <option key={exercise.id} value={exercise.id}>
                                                                            {exercise.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <label className="form-label">Día</label>
                                                                <select
                                                                    className="form-select"
                                                                    value={ex.day}
                                                                    onChange={(e) => updateExercise(index, 'day', e.target.value)}
                                                                >
                                                                    <option>Lunes</option>
                                                                    <option>Martes</option>
                                                                    <option>Miércoles</option>
                                                                    <option>Jueves</option>
                                                                    <option>Viernes</option>
                                                                    <option>Sábado</option>
                                                                    <option>Domingo</option>
                                                                </select>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <label className="form-label">Series</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    value={ex.sets}
                                                                    onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                                                                    min="1"
                                                                />
                                                            </div>
                                                            <div className="col-md-2">
                                                                <label className="form-label">Reps</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={ex.reps}
                                                                    onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                                                                    placeholder="10-12"
                                                                />
                                                            </div>
                                                            <div className="col-md-2">
                                                                <label className="form-label">Peso (kg)</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    value={ex.weight || 0}
                                                                    onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value))}
                                                                    step="0.5"
                                                                />
                                                            </div>
                                                            <div className="col-12">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeExercise(index)}
                                                                    className="btn btn-sm btn-outline-danger"
                                                                >
                                                                    Eliminar
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push(`/dashboard/professor/plans/${id}`)}
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
