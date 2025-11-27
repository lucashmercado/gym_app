'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

const professorNavItems = [
    { name: 'Dashboard', href: '/dashboard/professor' },
    { name: 'Estudiantes', href: '/dashboard/professor/students' },
    { name: 'Planes', href: '/dashboard/professor/plans' },
    { name: 'Ejercicios', href: '/dashboard/professor/exercises' },
    { name: 'Pagos', href: '/dashboard/professor/payments' },
]

export default function NewExercise() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        muscleGroup: '',
        videoUrl: '',
        imageUrl: '',
    })
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch('/api/exercises', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })

        if (res.ok) {
            router.push('/dashboard/professor/exercises')
        } else {
            alert('Error creating exercise')
        }
    }

    return (
        <div>
            <Sidebar items={professorNavItems} userRole="PROFESSOR" />

            <main className="container-fluid p-4">
                <div className="container-fluid">
                    <h1 className="h2 mb-4">Nuevo Ejercicio</h1>

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
                                            <option value="Chest">Pecho</option>
                                            <option value="Back">Espalda</option>
                                            <option value="Legs">Piernas</option>
                                            <option value="Shoulders">Hombros</option>
                                            <option value="Arms">Brazos</option>
                                            <option value="Core">Core</option>
                                            <option value="Cardio">Cardio</option>
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
                                        <label htmlFor="imageUrl" className="form-label">URL de la Imagen Ilustrativa</label>
                                        <input
                                            type="url"
                                            className="form-control"
                                            id="imageUrl"
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                            placeholder="https://ejemplo.com/imagen-ejercicio.png"
                                        />
                                        <small className="text-muted">Imagen ilustrativa del ejercicio (ej: ilustración vectorial de cómo realizar el ejercicio)</small>
                                    </div>
                                </div>

                                <div className="mt-4 d-flex gap-2">
                                    <button type="submit" className="btn btn-primary">
                                        Crear Ejercicio
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
