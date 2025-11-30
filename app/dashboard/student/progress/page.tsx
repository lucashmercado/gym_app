'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ProgressChart from '@/components/ProgressChart'

const studentNavItems = [
    { name: 'Mi Rutina', href: '/dashboard/student' },
    { name: 'Progreso', href: '/dashboard/student/progress' },
    { name: 'Mensajes', href: '/dashboard/student/messages' },
]

export default function StudentProgress() {
    const [user, setUser] = useState<any>(null)
    const [progress, setProgress] = useState<any[]>([])
    const [plan, setPlan] = useState<any>(null)
    const router = useRouter()

    useEffect(() => {
        fetch('/api/auth/me')
            .then((res) => res.json())
            .then((data) => {
                if (!data.user || data.user.role !== 'STUDENT') {
                    router.push('/login')
                } else {
                    setUser(data.user)
                    // Fetch progress
                    fetch('/api/student/progress')
                        .then((res) => res.json())
                        .then((data) => setProgress(data.progress || []))
                    // Fetch current plan
                    fetch('/api/student/plan')
                        .then((res) => res.json())
                        .then((data) => setPlan(data.plan))
                }
            })
    }, [router])

    if (!user) return <div className="d-flex justify-content-center align-items-center min-vh-100"><div className="spinner-border" role="status"><span className="visually-hidden">Cargando...</span></div></div>

    // Check if student is active
    const isActive = user.active

    // Check if membership has expired
    const membershipEndDate = user.studentProfile?.membershipEndDate
    const isExpired = membershipEndDate ? new Date(membershipEndDate) < new Date() : false

    // Determine if student can access progress
    const canAccessProgress = isActive && !isExpired

    return (
        <div>
            <Sidebar items={studentNavItems} userRole="STUDENT" userName={user.name} />

            <main className="container-fluid p-4">
                <div className="container-fluid">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h1 className="h2">Mi Progreso</h1>
                            <p className="text-muted">Historial de entrenamientos completados</p>
                        </div>
                    </div>

                    {!canAccessProgress ? (
                        <div className="alert alert-warning" role="alert">
                            <h4 className="alert-heading">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle me-2" viewBox="0 0 16 16">
                                    <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" />
                                    <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                                </svg>
                                {!isActive ? 'Cuenta Inactiva' : 'Membresía Vencida'}
                            </h4>
                            <p className="mb-3">
                                {!isActive
                                    ? 'Tu cuenta está inactiva. No puedes acceder a tu historial de progreso en este momento.'
                                    : `Tu membresía venció el ${new Date(membershipEndDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}. No puedes acceder a tu historial de progreso hasta que renueves tu membresía.`
                                }
                            </p>
                            <hr />
                            <p className="mb-0">
                                <strong>Por favor contacta a tu profesor para renovar tu membresía o activar tu cuenta.</strong>
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Progress Chart */}
                            {plan && <ProgressChart plan={plan} progress={progress} />}

                            {/* Progress History Table */}
                            {progress.length > 0 ? (
                                <div className="card mt-4">
                                    <div className="card-header">
                                        <h5 className="mb-0">Historial de Entrenamientos</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Fecha</th>
                                                        <th>Ejercicio</th>
                                                        <th>Series</th>
                                                        <th>Reps</th>
                                                        <th>Peso</th>
                                                        <th>Comentarios</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {progress.map((p) => (
                                                        <tr key={p.id}>
                                                            <td>{new Date(p.date).toLocaleDateString('es-ES')}</td>
                                                            <td className="fw-bold">{p.planExercise.exercise.name}</td>
                                                            <td><span className="badge bg-primary">{p.setsDone}</span></td>
                                                            <td>{p.repsDone}</td>
                                                            <td>{p.weightUsed ? `${p.weightUsed} kg` : 'Peso corporal'}</td>
                                                            <td className="text-muted">{p.comments || '-'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="alert alert-info" role="alert">
                                    <h4 className="alert-heading">Sin Progreso Registrado</h4>
                                    <p>Aún no has completado ningún ejercicio. Marca los ejercicios como completados en tu rutina para ver tu progreso aquí.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}
