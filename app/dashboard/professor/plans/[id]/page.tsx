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

export default function PlanDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [plan, setPlan] = useState<any>(null)
    const router = useRouter()

    useEffect(() => {
        fetch(`/api/plans/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error)
                    router.back()
                } else {
                    setPlan(data.plan)
                }
            })
    }, [id, router])

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

    // Group exercises by day
    const exercisesByDay = plan.exercises.reduce((acc: any, ex: any) => {
        if (!acc[ex.day]) acc[ex.day] = []
        acc[ex.day].push(ex)
        return acc
    }, {})

    return (
        <div>
            <Sidebar items={professorNavItems} userRole="PROFESSOR" />

            <main className="container-fluid p-4">
                <div className="container-fluid">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div>
                            <h1 className="h2 mb-2">{plan.name}</h1>
                            <p className="text-muted mb-1">
                                Estudiante: <span className="text-body">{plan.student.name}</span>
                            </p>
                            <p className="text-muted">
                                Fechas: {new Date(plan.startDate).toLocaleDateString()}
                                {plan.endDate && ` - ${new Date(plan.endDate).toLocaleDateString()}`}
                            </p>
                        </div>
                        <div className="d-flex gap-2">
                            <button
                                onClick={() => router.push(`/dashboard/professor/plans/${id}/edit`)}
                                className="btn btn-primary"
                            >
                                Editar Plan
                            </button>
                            <button
                                onClick={() => router.back()}
                                className="btn btn-secondary"
                            >
                                Volver
                            </button>
                        </div>
                    </div>

                    <div className="row g-3">
                        {Object.entries(exercisesByDay).map(([day, exercises]: [string, any]) => (
                            <div key={day} className="col-md-6 col-lg-4">
                                <div className="card h-100">
                                    <div className="card-header bg-primary text-white">
                                        <h3 className="h5 mb-0">{day}</h3>
                                    </div>
                                    <div className="card-body">
                                        {exercises.map((ex: any, index: number) => (
                                            <div key={ex.id} className={index < exercises.length - 1 ? 'border-bottom pb-3 mb-3' : ''}>
                                                <p className="fw-bold text-primary mb-1">{ex.exercise.name}</p>
                                                <div className="small text-muted d-flex gap-3">
                                                    <span>{ex.sets} series</span>
                                                    <span>{ex.reps} reps</span>
                                                    {ex.weight && <span>{ex.weight}kg</span>}
                                                </div>
                                                {ex.exercise.videoUrl && (
                                                    <a
                                                        href={ex.exercise.videoUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="small text-decoration-none mt-1 d-block"
                                                    >
                                                        Ver Video
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
