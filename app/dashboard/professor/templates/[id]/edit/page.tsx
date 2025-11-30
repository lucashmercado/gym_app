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

export default function EditTemplate() {
    const params = useParams()
    const templateId = params.id as string
    const [template, setTemplate] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    })
    const [exercises, setExercises] = useState<any[]>([])
    const [availableExercises, setAvailableExercises] = useState<any[]>([])
    const [newExercise, setNewExercise] = useState({
        exerciseId: '',
        day: 'Lunes',
        sets: 3,
        reps: '10',
        weight: null as number | null,
        restTime: 60
    })
    const [exerciseSearch, setExerciseSearch] = useState('')
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('all')
    const [selectedDifficulty, setSelectedDifficulty] = useState('all')
    const [selectedEquipment, setSelectedEquipment] = useState('all')
    const [showSuggestions, setShowSuggestions] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (!templateId) return

        // Load template
        fetch(`/api/professor/templates/${templateId}`)
            .then((res) => res.json())
            .then((data) => {
                setTemplate(data.template)
                setFormData({
                    name: data.template.name || '',
                    description: data.template.description || ''
                })
                setExercises(data.template.exercises || [])
                setLoading(false)
            })
            .catch((err) => {
                console.error('Error loading template:', err)
                setLoading(false)
            })

        // Load available exercises
        fetch('/api/professor/exercises')
            .then((res) => res.json())
            .then((data) => {
                setAvailableExercises(data.exercises || [])
            })
            .catch((err) => {
                console.error('Error loading exercises:', err)
            })
    }, [templateId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const res = await fetch(`/api/professor/templates/${templateId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: formData.name,
                description: formData.description,
                exercises: exercises.map(ex => ({
                    id: ex.id,
                    exerciseId: ex.exerciseId,
                    day: ex.day,
                    sets: ex.sets,
                    reps: ex.reps,
                    weight: ex.weight,
                    restTime: ex.restTime
                }))
            })
        })

        if (res.ok) {
            alert('Plantilla actualizada exitosamente')
            router.push(`/dashboard/professor/templates/${templateId}`)
        } else {
            alert('Error al actualizar la plantilla')
        }
    }

    const handleExerciseChange = (index: number, field: string, value: any) => {
        const newExercises = [...exercises]
        newExercises[index] = { ...newExercises[index], [field]: value }
        setExercises(newExercises)
    }

    const handleRemoveExercise = (index: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar este ejercicio?')) {
            setExercises(exercises.filter((_, i) => i !== index))
        }
    }

    const handleAddExercise = () => {
        if (!newExercise.exerciseId) {
            alert('Por favor selecciona un ejercicio')
            return
        }

        const selectedExercise = availableExercises.find(ex => ex.id === newExercise.exerciseId)
        if (!selectedExercise) return

        const exerciseToAdd = {
            id: `temp-${Date.now()}`,
            exerciseId: newExercise.exerciseId,
            exercise: selectedExercise,
            day: newExercise.day,
            sets: newExercise.sets,
            reps: newExercise.reps,
            weight: newExercise.weight,
            restTime: newExercise.restTime
        }

        setExercises([...exercises, exerciseToAdd])

        // Reset form
        setNewExercise({
            exerciseId: '',
            day: 'Lunes',
            sets: 3,
            reps: '10',
            weight: null,
            restTime: 60
        })
        setExerciseSearch('')
        setShowSuggestions(false)
    }

    const handleSelectExercise = (exercise: any) => {
        setNewExercise({ ...newExercise, exerciseId: exercise.id })
        setExerciseSearch(exercise.name)
        setShowSuggestions(false)
    }

    // Filter exercises based on search and filters
    const filteredExercises = availableExercises.filter(exercise => {
        const matchesSearch = exerciseSearch === '' ||
            exercise.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
            exercise.description?.toLowerCase().includes(exerciseSearch.toLowerCase())
        const matchesMuscleGroup = selectedMuscleGroup === 'all' || exercise.muscleGroup === selectedMuscleGroup
        const matchesDifficulty = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty
        const matchesEquipment = selectedEquipment === 'all' || exercise.equipment === selectedEquipment
        return matchesSearch && matchesMuscleGroup && matchesDifficulty && matchesEquipment
    })

    // Get unique values for filters
    const muscleGroups = Array.from(new Set(availableExercises.map(e => e.muscleGroup).filter(Boolean)))
    const equipmentTypes = Array.from(new Set(availableExercises.map(e => e.equipment).filter(Boolean)))

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

    if (!template) {
        return (
            <div>
                <Sidebar items={professorNavItems} userRole="PROFESSOR" />
                <main className="container-fluid p-4">
                    <div className="alert alert-danger">
                        <h4>Plantilla no encontrada</h4>
                        <p>No se pudo cargar la información de la plantilla.</p>
                        <Link href="/dashboard/professor/templates" className="btn btn-primary">
                            Volver a Plantillas
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
                        <h1 className="h2">Editar Plantilla</h1>
                        <p className="text-muted">{template.name}</p>
                    </div>
                    <Link href={`/dashboard/professor/templates/${templateId}`} className="btn btn-secondary">
                        Cancelar
                    </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Basic Info */}
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
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-12">
                                    <label htmlFor="description" className="form-label">Descripción</label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Exercises */}
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Ejercicios</h5>

                            {exercises.length > 0 ? (
                                <div className="row g-3">
                                    {Object.entries(
                                        exercises.reduce((acc: any, ex: any, idx: number) => {
                                            if (!acc[ex.day]) acc[ex.day] = []
                                            acc[ex.day].push({ ...ex, originalIndex: idx })
                                            return acc
                                        }, {})
                                    ).map(([day, dayExercises]: [string, any]) => (
                                        <div key={day} className="col-12">
                                            <div className="card">
                                                <div className="card-header bg-primary text-white">
                                                    <h6 className="mb-0">{day}</h6>
                                                </div>
                                                <div className="card-body">
                                                    {dayExercises.map((ex: any) => (
                                                        <div key={ex.originalIndex} className="border rounded p-3 mb-3">
                                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                                <h6 className="mb-0">{ex.exercise.name}</h6>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-danger"
                                                                    onClick={() => handleRemoveExercise(ex.originalIndex)}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                            <div className="row g-2">
                                                                <div className="col-md-3">
                                                                    <label className="form-label small">Series</label>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control form-control-sm"
                                                                        value={ex.sets}
                                                                        onChange={(e) => handleExerciseChange(ex.originalIndex, 'sets', parseInt(e.target.value))}
                                                                        min="1"
                                                                    />
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <label className="form-label small">Reps</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control form-control-sm"
                                                                        value={ex.reps}
                                                                        onChange={(e) => handleExerciseChange(ex.originalIndex, 'reps', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <label className="form-label small">Peso (kg)</label>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control form-control-sm"
                                                                        value={ex.weight || ''}
                                                                        onChange={(e) => handleExerciseChange(ex.originalIndex, 'weight', e.target.value ? parseFloat(e.target.value) : null)}
                                                                        placeholder="Opcional"
                                                                    />
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <label className="form-label small">Descanso (seg)</label>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control form-control-sm"
                                                                        value={ex.restTime || ''}
                                                                        onChange={(e) => handleExerciseChange(ex.originalIndex, 'restTime', e.target.value ? parseInt(e.target.value) : null)}
                                                                        placeholder="60"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="alert alert-info">
                                    <p className="mb-0">Esta plantilla no tiene ejercicios asignados.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Add Exercise Form */}
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Agregar Ejercicio</h5>
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label">Ejercicio</label>
                                    <div className="position-relative">
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                                                </svg>
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Buscar ejercicio..."
                                                value={exerciseSearch}
                                                onChange={(e) => {
                                                    setExerciseSearch(e.target.value)
                                                    setShowSuggestions(true)
                                                    setNewExercise({ ...newExercise, exerciseId: '' })
                                                }}
                                                onFocus={() => setShowSuggestions(true)}
                                            />
                                        </div>
                                        {showSuggestions && filteredExercises.length > 0 && (
                                            <div className="position-absolute w-100 mt-1" style={{ zIndex: 1000 }}>
                                                <div className="list-group shadow-sm" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                    {filteredExercises.slice(0, 10).map((ex) => (
                                                        <button
                                                            key={ex.id}
                                                            type="button"
                                                            className="list-group-item list-group-item-action"
                                                            onClick={() => handleSelectExercise(ex)}
                                                        >
                                                            {ex.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">Día</label>
                                    <select
                                        className="form-select"
                                        value={newExercise.day}
                                        onChange={(e) => setNewExercise({ ...newExercise, day: e.target.value })}
                                    >
                                        <option value="Lunes">Lunes</option>
                                        <option value="Martes">Martes</option>
                                        <option value="Miércoles">Miércoles</option>
                                        <option value="Jueves">Jueves</option>
                                        <option value="Viernes">Viernes</option>
                                        <option value="Sábado">Sábado</option>
                                        <option value="Domingo">Domingo</option>
                                    </select>
                                </div>
                                <div className="col-md-1">
                                    <label className="form-label">Series</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={newExercise.sets}
                                        onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) })}
                                        min="1"
                                    />
                                </div>
                                <div className="col-md-1">
                                    <label className="form-label">Reps</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newExercise.reps}
                                        onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">Peso (kg)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={newExercise.weight || ''}
                                        onChange={(e) => setNewExercise({ ...newExercise, weight: e.target.value ? parseFloat(e.target.value) : null })}
                                        placeholder="Opcional"
                                    />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">Descanso (seg)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={newExercise.restTime}
                                        onChange={(e) => setNewExercise({ ...newExercise, restTime: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="mt-3">
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={handleAddExercise}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg me-2" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                                    </svg>
                                    Agregar Ejercicio
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg me-2" viewBox="0 0 16 16">
                                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                            </svg>
                            Guardar Cambios
                        </button>
                        <Link href={`/dashboard/professor/templates/${templateId}`} className="btn btn-secondary">
                            Cancelar
                        </Link>
                    </div>
                </form>
            </main>
        </div>
    )
}
