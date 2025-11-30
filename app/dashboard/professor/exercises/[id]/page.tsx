'use client'

import React, { useEffect, useState } from 'react'
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

export default function EditExercise({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        muscleGroup: '',
        videoUrl: '',
        imageUrl: '',
    })
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetch(`/api/exercises/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.exercise) {
                    setFormData({
                        name: data.exercise.name || '',
                        description: data.exercise.description || '',
                        muscleGroup: data.exercise.muscleGroup || '',
                        videoUrl: data.exercise.videoUrl || '',
                        imageUrl: data.exercise.imageUrl || '',
                    })
                }
                setLoading(false)
            })
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch(`/api/exercises/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })

        if (res.ok) {
            alert('Ejercicio actualizado exitosamente')
            router.push('/dashboard/professor/exercises')
        } else {
            alert('Error al actualizar ejercicio')
        }
    }

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

    return (
        <div>
            <Sidebar items={professorNavItems} userRole="PROFESSOR" />

            <main className="container-fluid p-4">
                <div className="container-fluid">
                    <h1 className="h2 mb-4">Editar Ejercicio</h1>

                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="name" className="form-label">Nombre</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="muscleGroup" className="form-label">Grupo Muscular</label>
                                        <select
                                            className="form-select"
                                            id="muscleGroup"
                                            value={formData.muscleGroup}
                                            onChange={(e) => setFormData({ ...formData, muscleGroup: e.target.value })}
                                            required
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="Pectorales">Pectorales</option>
                                            <option value="Espalda">Espalda</option>
                                            <option value="Hombros">Hombros</option>
                                            <option value="Bíceps">Bíceps</option>
                                            <option value="Tríceps">Tríceps</option>
                                            <option value="Abdominales">Abdominales</option>
                                            <option value="Piernas">Piernas</option>
                                            <option value="Gemelos">Gemelos</option>
                                        </select>
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="description" className="form-label">Descripción</label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            rows={4}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="videoUrl" className="form-label">URL del Video</label>
                                        <input
                                            type="url"
                                            className="form-control"
                                            id="videoUrl"
                                            value={formData.videoUrl}
                                            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                            placeholder="https://youtube.com/..."
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="imageUrl" className="form-label">URL de la Imagen/GIF Ilustrativo</label>
                                        <input
                                            type="url"
                                            className="form-control"
                                            id="imageUrl"
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                            placeholder="https://ejemplo.com/imagen-ejercicio.png o .gif"
                                        />
                                        <small className="text-muted">Imagen o GIF animado ilustrativo del ejercicio (ej: ilustración vectorial de cómo realizar el ejercicio)</small>

                                        {formData.imageUrl && (
                                            <div className="mt-3">
                                                <p className="mb-2"><strong>Vista previa:</strong></p>
                                                <img
                                                    src={formData.imageUrl}
                                                    alt="Vista previa"
                                                    className="rounded border"
                                                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }}
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 d-flex gap-2">
                                    <button type="submit" className="btn btn-primary">
                                        Guardar Cambios
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
