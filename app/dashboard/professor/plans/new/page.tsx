'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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

function NewPlanContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const preselectedStudentId = searchParams.get('studentId')

    const [students, setStudents] = useState<any[]>([])
    const [exercises, setExercises] = useState<any[]>([])

    const [formData, setFormData] = useState({
        studentId: preselectedStudentId || '',
        name: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
    })

    const [planExercises, setPlanExercises] = useState<any[]>([])
    const [exerciseSearch, setExerciseSearch] = useState('')
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('all')
    const [selectedDifficulty, setSelectedDifficulty] = useState('all')
    const [selectedEquipment, setSelectedEquipment] = useState('all')

    useEffect(() => {
        fetch('/api/professor/students').then(res => res.json()).then(data => setStudents(data.students || []))
        fetch('/api/exercises').then(res => res.json()).then(data => setExercises(data.exercises || []))
    }, [])

    useEffect(() => {
        if (preselectedStudentId) {
            setFormData(prev => ({ ...prev, studentId: preselectedStudentId }))
        }
    }, [preselectedStudentId])

    const addExercise = () => {
        setPlanExercises([...planExercises, {
            exerciseId: '',
            day: 'Día 1',
            sets: 3,
            reps: '10',
            weight: '',
            rest: 60,
            order: planExercises.length
        }])
    }

    const updateExercise = (index: number, field: string, value: any) => {
        const newExercises = [...planExercises]
        newExercises[index] = { ...newExercises[index], [field]: value }
        setPlanExercises(newExercises)
    }

    const removeExercise = (index: number) => {
        setPlanExercises(planExercises.filter((_, i) => i !== index))
    }

    // Filter exercises based on search and filters
    const filteredExercises = exercises.filter(exercise => {
        const matchesSearch = exercise.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
            exercise.description?.toLowerCase().includes(exerciseSearch.toLowerCase())
        const matchesMuscleGroup = selectedMuscleGroup === 'all' || exercise.muscleGroup === selectedMuscleGroup
        const matchesDifficulty = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty
        const matchesEquipment = selectedEquipment === 'all' || exercise.equipment === selectedEquipment
        return matchesSearch && matchesMuscleGroup && matchesDifficulty && matchesEquipment
    })

    // Get unique values for filters
    const muscleGroups = Array.from(new Set(exercises.map(e => e.muscleGroup).filter(Boolean)))
    const equipmentTypes = Array.from(new Set(exercises.map(e => e.equipment).filter(Boolean)))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.studentId) return alert('Por favor selecciona un estudiante')

        const res = await fetch('/api/plans', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, exercises: planExercises }),
        })

        if (res.ok) {
            router.push('/dashboard/professor/plans')
        } else {
            alert('Error al crear el plan')
        }
    }

    return (
        <div>
            <Sidebar items={professorNavItems} userRole="PROFESSOR" />

            <main className="container-fluid p-4">
                <div className="container-fluid">
                    <h1 className="h2 mb-4">Crear Plan de Entrenamiento</h1>

                    <form onSubmit={handleSubmit}>
                        {/* Basic Info */}
                        <div className="card mb-4">
                            <div className="card-body">
                                <h2 className="h5 mb-3">Detalles del Plan</h2>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="studentId" className="form-label">Estudiante</label>
                                        <select
                                            id="studentId"
                                            className="form-select"
                                            value={formData.studentId}
                                            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                            required
                                        >
                                            <option value="">Seleccionar Estudiante...</option>
                                            {students.map(s => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="planName" className="form-label">Nombre del Plan</label>
                                        <input
                                            type="text"
                                            id="planName"
                                            className="form-control"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            placeholder="ej. Hipertrofia Fase 1"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="startDate" className="form-label">Fecha de Inicio</label>
                                        <input
                                            type="date"
                                            id="startDate"
                                            className="form-control"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="endDate" className="form-label">Fecha de Fin (Opcional)</label>
                                        <input
                                            type="date"
                                            id="endDate"
                                            className="form-control"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Exercises */}
                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h2 className="h5 mb-0">Ejercicios</h2>
                                    <button
                                        type="button"
                                        onClick={addExercise}
                                        className="btn btn-success btn-sm"
                                    >
                                        + Agregar Ejercicio
                                    </button>
                                </div>

                                {/* Exercise Filters */}
                                <div className="card bg-light border-0 mb-3">
                                    <div className="card-body">
                                        <h6 className="mb-3">Buscar Ejercicios</h6>
                                        <div className="row g-2">
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    placeholder="Buscar por nombre..."
                                                    value={exerciseSearch}
                                                    onChange={(e) => setExerciseSearch(e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={selectedMuscleGroup}
                                                    onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                                                >
                                                    <option value="all">Todos los grupos</option>
                                                    {muscleGroups.map(group => (
                                                        <option key={group} value={group}>{group}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-md-2">
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={selectedDifficulty}
                                                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                                                >
                                                    <option value="all">Dificultad</option>
                                                    <option value="Principiante">Principiante</option>
                                                    <option value="Intermedio">Intermedio</option>
                                                    <option value="Avanzado">Avanzado</option>
                                                </select>
                                            </div>
                                            <div className="col-md-3">
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={selectedEquipment}
                                                    onChange={(e) => setSelectedEquipment(e.target.value)}
                                                >
                                                    <option value="all">Todo el equipo</option>
                                                    {equipmentTypes.map(equipment => (
                                                        <option key={equipment} value={equipment}>{equipment}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="small text-muted mt-2">
                                            Mostrando {filteredExercises.length} de {exercises.length} ejercicios
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex flex-column gap-3">
                                    {planExercises.map((ex, index) => (
                                        <div key={index} className="border rounded p-3 bg-light">
                                            <div className="row g-2 align-items-end">
                                                <div className="col-md-4">
                                                    <label className="form-label small text-muted">Ejercicio</label>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={ex.exerciseId}
                                                        onChange={(e) => updateExercise(index, 'exerciseId', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Seleccionar...</option>
                                                        {filteredExercises.map(e => (
                                                            <option key={e.id} value={e.id}>
                                                                {e.name} - {e.muscleGroup}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="form-label small text-muted">Día</label>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        value={ex.day}
                                                        onChange={(e) => updateExercise(index, 'day', e.target.value)}
                                                        placeholder="ej. Día 1"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-6 col-md-1">
                                                    <label className="form-label small text-muted">Series</label>
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm"
                                                        value={ex.sets}
                                                        onChange={(e) => updateExercise(index, 'sets', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-6 col-md-2">
                                                    <label className="form-label small text-muted">Reps</label>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        value={ex.reps}
                                                        onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-6 col-md-2">
                                                    <label className="form-label small text-muted">Peso (kg)</label>
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm"
                                                        value={ex.weight}
                                                        onChange={(e) => updateExercise(index, 'weight', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-6 col-md-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExercise(index)}
                                                        className="btn btn-danger btn-sm w-100"
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {planExercises.length === 0 && (
                                        <div className="text-center py-5 border border-2 border-dashed rounded">
                                            <p className="text-muted mb-1">No hay ejercicios agregados aún.</p>
                                            <p className="small text-muted">Haz clic en "+ Agregar Ejercicio" para comenzar.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="btn btn-secondary"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Guardar Plan
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default function NewPlan() {
    return (
        <Suspense fallback={
            <div className="d-flex">
                <Sidebar items={professorNavItems} userRole="PROFESSOR" />
                <main className="flex-fill p-4">
                    <div className="container-fluid">
                        <p>Cargando...</p>
                    </div>
                </main>
            </div>
        }>
            <NewPlanContent />
        </Suspense>
    )
}

