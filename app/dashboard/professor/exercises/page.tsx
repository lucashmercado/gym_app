'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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

const muscleGroupIcons: { [key: string]: string } = {
    'Pecho': '🫁',
    'Espalda': '🔙',
    'Piernas': '🦵',
    'Hombros': '🤷',
    'Brazos': '💪',
    'Bíceps': '💪',
    'Tríceps': '🔱',
    'Abdomen': '🔥',
    'Glúteos': '🍑',
    'Cardio': '❤️',
    'Core': '⚡',
    'Pantorrillas': '🦿',
    'Antebrazos': '🤜',
    'Cuádriceps': '🦵',
    'Isquiotibiales': '🦵',
    'Trapecio': '🔺',
    'Lumbares': '🔙',
    'Sin Grupo': '📋'
}

export default function ExerciseList() {
    const [exercises, setExercises] = useState<any[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filterMuscleGroup, setFilterMuscleGroup] = useState('')
    const [filterDifficulty, setFilterDifficulty] = useState('')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    useEffect(() => {
        fetch('/api/exercises')
            .then((res) => res.json())
            .then((data) => setExercises(data.exercises || []))
    }, [])

    // Filter exercises
    const filteredExercises = exercises.filter((exercise) => {
        const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (exercise.description && exercise.description.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesMuscleGroup = !filterMuscleGroup || exercise.muscleGroup === filterMuscleGroup
        const matchesDifficulty = !filterDifficulty || exercise.difficulty === filterDifficulty
        return matchesSearch && matchesMuscleGroup && matchesDifficulty
    })

    // Group exercises by muscle group
    const groupedExercises = filteredExercises.reduce((acc: any, exercise) => {
        const group = exercise.muscleGroup || 'Sin Grupo'
        if (!acc[group]) {
            acc[group] = []
        }
        acc[group].push(exercise)
        return acc
    }, {})

    // Sort muscle groups alphabetically
    const sortedGroups = Object.keys(groupedExercises).sort()

    // Get unique muscle groups and difficulties for filters
    const muscleGroups = Array.from(new Set(exercises.map(e => e.muscleGroup).filter(Boolean)))
    const difficulties = Array.from(new Set(exercises.map(e => e.difficulty).filter(Boolean)))

    const renderExerciseCard = (exercise: any) => (
        <div key={exercise.id} className={viewMode === 'grid' ? 'col-md-6 col-lg-4' : 'col-12'}>
            <div className={`card h-100 ${viewMode === 'list' ? 'mb-3' : ''}`}>
                <div className={viewMode === 'list' ? 'row g-0' : ''}>
                    {exercise.imageUrl && (
                        <div className={viewMode === 'list' ? 'col-md-3' : ''}>
                            <img
                                src={exercise.imageUrl}
                                alt={exercise.name}
                                className={viewMode === 'list' ? 'img-fluid rounded-start h-100' : 'card-img-top'}
                                style={viewMode === 'grid' ? { height: '200px', objectFit: 'cover' } : { objectFit: 'cover', maxHeight: '200px' }}
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        </div>
                    )}
                    <div className={viewMode === 'list' ? 'col-md-9' : ''}>
                        <div className="card-body">
                            <h5 className="card-title">{exercise.name}</h5>
                            <div className="mb-2">
                                {exercise.muscleGroup && (
                                    <span className="badge bg-primary me-2">
                                        {muscleGroupIcons[exercise.muscleGroup] || '💪'} {exercise.muscleGroup}
                                    </span>
                                )}
                                {exercise.difficulty && (
                                    <span className={`badge ${exercise.difficulty === 'Principiante' ? 'bg-success' :
                                        exercise.difficulty === 'Intermedio' ? 'bg-warning' :
                                            'bg-danger'
                                        }`}>
                                        {exercise.difficulty}
                                    </span>
                                )}
                            </div>
                            {exercise.description && (
                                <p className="card-text text-muted small">
                                    {viewMode === 'list' ? exercise.description :
                                        `${exercise.description.substring(0, 100)}${exercise.description.length > 100 ? '...' : ''}`
                                    }
                                </p>
                            )}
                        </div>
                        <div className="card-footer bg-transparent border-top-0">
                            <div className="d-flex gap-2">
                                <Link
                                    href={`/dashboard/professor/exercises/${exercise.id}`}
                                    className="btn btn-sm btn-outline-primary flex-fill"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil me-1" viewBox="0 0 16 16">
                                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                                    </svg>
                                    Editar
                                </Link>
                                {exercise.videoUrl && (
                                    <a
                                        href={exercise.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-sm btn-outline-secondary"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-play-circle" viewBox="0 0 16 16">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                            <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445" />
                                        </svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div>
            <Sidebar items={professorNavItems} userRole="PROFESSOR" />

            <main className="container-fluid p-4">
                <div className="container-fluid">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="h2">Ejercicios</h1>
                        <Link href="/dashboard/professor/exercises/new" className="btn btn-primary">
                            + Agregar Ejercicio
                        </Link>
                    </div>

                    {/* Filters and Search */}
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label">Buscar</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Buscar por nombre o descripción..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Grupo Muscular</label>
                                    <select
                                        className="form-select"
                                        value={filterMuscleGroup}
                                        onChange={(e) => setFilterMuscleGroup(e.target.value)}
                                    >
                                        <option value="">Todos</option>
                                        {muscleGroups.map((group) => (
                                            <option key={group} value={group}>
                                                {muscleGroupIcons[group] || '💪'} {group}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Dificultad</label>
                                    <select
                                        className="form-select"
                                        value={filterDifficulty}
                                        onChange={(e) => setFilterDifficulty(e.target.value)}
                                    >
                                        <option value="">Todas</option>
                                        {difficulties.map((diff) => (
                                            <option key={diff} value={diff}>{diff}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">Vista</label>
                                    <div className="btn-group w-100" role="group">
                                        <button
                                            type="button"
                                            className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => setViewMode('grid')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-grid-3x3-gap" viewBox="0 0 16 16">
                                                <path d="M4 2v2H2V2zm1 12v-2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m5 10v-2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V7a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1M9 2v2H7V2zm5 0v2h-2V2zM4 7v2H2V7zm5 0v2H7V7zm5 0h-2v2h2zM4 12v2H2v-2zm5 0v2H7v-2zm5 0v2h-2v-2zM12 1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm-1 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm1 4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1z" />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => setViewMode('list')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list-ul" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {filteredExercises.length === 0 ? (
                        <div className="alert alert-info text-center" role="alert">
                            {exercises.length === 0
                                ? 'No se encontraron ejercicios. Agrega uno para comenzar.'
                                : 'No se encontraron ejercicios con los filtros seleccionados.'
                            }
                        </div>
                    ) : (
                        <div className="accordion" id="exerciseAccordion">
                            {sortedGroups.map((muscleGroup, index) => (
                                <div key={muscleGroup} className="accordion-item mb-3">
                                    <h2 className="accordion-header">
                                        <button
                                            className="accordion-button collapsed"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapse${index}`}
                                            aria-expanded="false"
                                        >
                                            <span className="fs-5 me-2">{muscleGroupIcons[muscleGroup] || '💪'}</span>
                                            <strong>{muscleGroup}</strong>
                                            <span className="badge bg-primary ms-2">
                                                {groupedExercises[muscleGroup].length}
                                            </span>
                                        </button>
                                    </h2>
                                    <div
                                        id={`collapse${index}`}
                                        className="accordion-collapse collapse"
                                        data-bs-parent="#exerciseAccordion"
                                    >
                                        <div className="accordion-body">
                                            <div className="row g-4">
                                                {groupedExercises[muscleGroup].map((exercise: any) =>
                                                    renderExerciseCard(exercise)
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
