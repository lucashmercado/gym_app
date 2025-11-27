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

export default function TemplateDetail() {
    const params = useParams()
    const templateId = params.id as string
    const [template, setTemplate] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (!templateId) return

        fetch(`/api/professor/templates/${templateId}`)
            .then((res) => res.json())
            .then((data) => {
                setTemplate(data.template)
                setLoading(false)
            })
            .catch((err) => {
                console.error('Error loading template:', err)
                setLoading(false)
            })
    }, [templateId])

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
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="h2">{template.name}</h1>
                        <p className="text-muted">Detalles de la plantilla</p>
                    </div>
                    <div className="d-flex gap-2">
                        <Link href={`/dashboard/professor/templates/${templateId}/edit`} className="btn btn-warning">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil me-2" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                            </svg>
                            Editar
                        </Link>
                        <Link href={`/dashboard/professor/templates/${templateId}/assign`} className="btn btn-success">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-plus me-2" viewBox="0 0 16 16">
                                <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5" />
                            </svg>
                            Asignar a Estudiante
                        </Link>
                        <Link href="/dashboard/professor/templates" className="btn btn-secondary">
                            Volver
                        </Link>
                    </div>
                </div>

                {/* Template Info */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Información de la Plantilla</h5>
                        {template.description && (
                            <p className="card-text">{template.description}</p>
                        )}
                        <div className="row">
                            <div className="col-md-6">
                                <p className="mb-1"><strong>Nombre:</strong> {template.name}</p>
                            </div>
                            <div className="col-md-6">
                                <p className="mb-1"><strong>Total de Ejercicios:</strong> {template.exercises?.length || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Exercises by Day */}
                <h3 className="mb-3">Ejercicios por Día</h3>

                {template.exercises && template.exercises.length > 0 ? (
                    <div className="row g-3">
                        {Object.entries(
                            template.exercises.reduce((acc: any, ex: any) => {
                                if (!acc[ex.day]) acc[ex.day] = []
                                acc[ex.day].push(ex)
                                return acc
                            }, {})
                        ).map(([day, exercises]: [string, any]) => (
                            <div key={day} className="col-12">
                                <div className="card">
                                    <div className="card-header bg-primary text-white">
                                        <h5 className="mb-0">{day}</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Ejercicio</th>
                                                        <th>Series</th>
                                                        <th>Reps</th>
                                                        <th>Peso</th>
                                                        <th>Imagen</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {exercises.map((ex: any) => (
                                                        <tr key={ex.id}>
                                                            <td>
                                                                <strong>{ex.exercise.name}</strong>
                                                                {ex.exercise.description && (
                                                                    <div className="text-muted small">{ex.exercise.description}</div>
                                                                )}
                                                            </td>
                                                            <td>{ex.sets}</td>
                                                            <td>{ex.reps}</td>
                                                            <td>{ex.weight ? `${ex.weight}kg` : 'Peso corporal'}</td>
                                                            <td>
                                                                {ex.exercise.imageUrl ? (
                                                                    <img
                                                                        src={ex.exercise.imageUrl}
                                                                        alt={ex.exercise.name}
                                                                        className="rounded"
                                                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                                    />
                                                                ) : (
                                                                    <span className="text-muted">Sin imagen</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
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
            </main>
        </div>
    )
}
