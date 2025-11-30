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

export default function NewTemplate() {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [exercises, setExercises] = useState<any[]>([])
    const [availableExercises, setAvailableExercises] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [exerciseSearch, setExerciseSearch] = useState('')
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('all')
    const [selectedDifficulty, setSelectedDifficulty] = useState('all')
    const [selectedEquipment, setSelectedEquipment] = useState('all')
    const router = useRouter()

    useEffect(() => {
        fetch('/api/professor/exercises')
            .then((res) => res.json())
            .then((data) => setAvailableExercises(data.exercises || []))
    }, [])

    const addExercise = () => {
        setExercises([...exercises, {
            exerciseId: '',
            day: 'Lunes',
            sets: 3,
            reps: '10',
            weight: 0,
            rest: 60
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

    // Filter exercises based on search and filters
    const filteredExercises = availableExercises.filter(exercise => {
        const matchesSearch = exercise.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
            exercise.description?.toLowerCase().includes(exerciseSearch.toLowerCase())
        const matchesMuscleGroup = selectedMuscleGroup === 'all' || exercise.muscleGroup === selectedMuscleGroup
        const matchesDifficulty = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty
        const matchesEquipment = selectedEquipment === 'all' || exercise.equipment === selectedEquipment
        return matchesSearch && matchesMuscleGroup && matchesDifficulty && matchesEquipment
    })

    // Get unique values for filters
    const muscleGroups = Array.from(new Set(availableExercises.map(e => e.muscleGroup).filter(Boolean)))
    const equipmentTypes = Array.from(new Set(availableExercises.map(e => e.equipment).filter(Boolean)))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const res = await fetch('/api/professor/templates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description, exercises })
        })

        if (res.ok) {
            alert('Plantilla creada exitosamente')
            router.push('/dashboard/professor/templates')
        } else {
            const data = await res.json()
            alert(data.error || 'Error al crear plantilla')
        }
        setLoading(false)
    }

    return (
        <div>
            <Sidebar items={professorNavItems} userRole="PROFESSOR" />

            <main className="container-fluid p-4">
                <div className="container-fluid">
                    <h1 className="h2 mb-4">Nueva Plantilla de Plan</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="card mb-4">
                            <div className="card-body">
                                <h5 className="card-title mb-3">Información Básica</h5>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="name" className="form-label">Nombre de la Plantilla</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            placeholder="ej: Plan Principiante"
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="description" className="form-label">Descripción (opcional)</label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            rows={3}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Descripción de la plantilla..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="card-title mb-0">Ejercicios</h5>
                                    <button type="button" onClick={addExercise} className="btn btn-success btn-sm">
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
                                            Mostrando {filteredExercises.length} de {availableExercises.length} ejercicios
                                        </div>
                                    </div>
                                </div>

                                {exercises.length === 0 ? (
                                    <p className="text-muted">No hay ejercicios agregados. Haz clic en "Agregar Ejercicio" para comenzar.</p>
                                ) : (
                                    <div className="row g-3">
                                        {exercises.map((ex, index) => (
                                            <div key={index} className="col-12">
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
                                                                    {filteredExercises.map((exercise) => (
                                                                        <option key={exercise.id} value={exercise.id}>
                                                                            {exercise.name} - {exercise.muscleGroup}
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
                                                                    value={ex.weight}
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
                                {loading ? 'Guardando...' : 'Guardar Plantilla'}
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

