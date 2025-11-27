'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'

const professorNavItems = [
    { name: 'Dashboard', href: '/dashboard/professor' },
    { name: 'Estudiantes', href: '/dashboard/professor/students' },
    { name: 'Planes', href: '/dashboard/professor/plans' },
    { name: 'Ejercicios', href: '/dashboard/professor/exercises' },
    { name: 'Pagos', href: '/dashboard/professor/payments' },
]

export default function ExerciseList() {
    const [exercises, setExercises] = useState<any[]>([])

    useEffect(() => {
        fetch('/api/exercises')
            .then((res) => res.json())
            .then((data) => setExercises(data.exercises || []))
    }, [])

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

                    <div className="row g-4">
                        {exercises.map((exercise) => (
                            <div key={exercise.id} className="col-md-6 col-lg-4">
                                <div className="card h-100">
                                    {exercise.imageUrl && (
                                        <img
                                            src={exercise.imageUrl}
                                            alt={exercise.name}
                                            className="card-img-top"
                                            style={{ height: '200px', objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    )}
                                    <div className="card-body">
                                        <h5 className="card-title">{exercise.name}</h5>
                                        {exercise.muscleGroup && (
                                            <span className="badge bg-primary mb-2">{exercise.muscleGroup}</span>
                                        )}
                                        {exercise.description && (
                                            <p className="card-text text-muted small">{exercise.description.substring(0, 100)}{exercise.description.length > 100 ? '...' : ''}</p>
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
                        ))}
                        {exercises.length === 0 && (
                            <div className="col-12">
                                <div className="alert alert-info text-center" role="alert">
                                    No se encontraron ejercicios. Agrega uno para comenzar.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
