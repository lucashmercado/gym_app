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
    { name: 'Pagos', href: '/dashboard/professor/payments' },
]

export default function TemplatesList() {
    const [templates, setTemplates] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/professor/templates')
            .then((res) => res.json())
            .then((data) => {
                setTemplates(data.templates || [])
                setLoading(false)
            })
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta plantilla?')) return

        const res = await fetch(`/api/professor/templates/${id}`, {
            method: 'DELETE'
        })

        if (res.ok) {
            setTemplates(templates.filter(t => t.id !== id))
            alert('Plantilla eliminada exitosamente')
        } else {
            alert('Error al eliminar plantilla')
        }
    }

    return (
        <div>
            <Sidebar items={professorNavItems} userRole="PROFESSOR" />

            <main className="container-fluid p-4">
                <div className="container-fluid">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="h2">Plantillas de Planes</h1>
                        <Link href="/dashboard/professor/templates/new" className="btn btn-primary">
                            + Nueva Plantilla
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    ) : templates.length > 0 ? (
                        <div className="row g-3">
                            {templates.map((template) => (
                                <div key={template.id} className="col-md-6 col-lg-4">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h5 className="card-title">{template.name}</h5>
                                            <p className="card-text text-muted">
                                                {template.description || 'Sin descripción'}
                                            </p>
                                            <p className="small text-muted">
                                                {template.exercises.length} ejercicios
                                            </p>
                                        </div>
                                        <div className="card-footer bg-transparent">
                                            <div className="d-flex gap-2">
                                                <Link
                                                    href={`/dashboard/professor/templates/${template.id}`}
                                                    className="btn btn-sm btn-outline-primary flex-fill"
                                                >
                                                    Ver
                                                </Link>
                                                <Link
                                                    href={`/dashboard/professor/templates/${template.id}/assign`}
                                                    className="btn btn-sm btn-success flex-fill"
                                                >
                                                    Asignar
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(template.id)}
                                                    className="btn btn-sm btn-outline-danger"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="alert alert-info" role="alert">
                            <h4 className="alert-heading">Sin Plantillas</h4>
                            <p>No has creado ninguna plantilla aún. Las plantillas te permiten crear planes reutilizables que puedes asignar a múltiples estudiantes.</p>
                            <hr />
                            <Link href="/dashboard/professor/templates/new" className="btn btn-primary">
                                Crear Primera Plantilla
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
