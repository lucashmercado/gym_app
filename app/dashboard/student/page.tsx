'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import RestTimer from '@/components/RestTimer'
import ConfirmationModal from '@/components/ConfirmationModal'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

const studentNavItems = [
    { name: 'Mi Rutina', href: '/dashboard/student' },
    { name: 'Progreso', href: '/dashboard/student/progress' },
    { name: 'Mensajes', href: '/dashboard/student/messages' },
]

export default function StudentDashboard() {
    const [user, setUser] = useState<any>(null)
    const [plan, setPlan] = useState<any>(null)
    const [inputs, setInputs] = useState<{ [key: string]: { weight: string, reps: string } }>({})
    const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set())
    const [selectedExercise, setSelectedExercise] = useState<any>(null)
    const [showModal, setShowModal] = useState(false)
    const [activeTimer, setActiveTimer] = useState<{ exercise: any, rest: number } | null>(null)
    const [resetConfirmation, setResetConfirmation] = useState<{ show: boolean, day: string | null }>({ show: false, day: null })
    const router = useRouter()

    useEffect(() => {
        // Configure toastr
        toastr.options = {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right',
            timeOut: 3000,
            extendedTimeOut: 1000,
            showMethod: 'fadeIn',
            hideMethod: 'fadeOut',
            showDuration: 300,
            hideDuration: 300,
        }

        fetch('/api/auth/me')
            .then((res) => res.json())
            .then((data) => {
                if (!data.user || data.user.role !== 'STUDENT') {
                    router.push('/login')
                } else {
                    setUser(data.user)
                    fetch('/api/student/plan')
                        .then((res) => res.json())
                        .then((data) => setPlan(data.plan))

                    // Fetch today's completed exercises
                    fetch('/api/student/progress/today')
                        .then((res) => res.json())
                        .then((data) => {
                            if (data.completed) {
                                setCompletedExercises(new Set<string>(data.completed.map((p: any) => p.planExerciseId)))
                            }
                        })
                        .catch(() => { })
                }
            })
    }, [router])

    if (!user) return <div className="d-flex justify-content-center align-items-center min-vh-100"><div className="spinner-border" role="status"><span className="visually-hidden">Cargando...</span></div></div>

    // Check if student is active
    const isActive = user.active

    // Check if membership has expired
    const membershipExpiry = user.studentProfile?.membershipExpiry
    const isExpired = membershipExpiry ? new Date(membershipExpiry) < new Date() : false

    // Determine if student can access exercises
    const canAccessExercises = isActive && !isExpired

    const handleInputChange = (planExerciseId: string, field: 'weight' | 'reps', value: string) => {
        setInputs(prev => ({
            ...prev,
            [planExerciseId]: {
                ...prev[planExerciseId],
                [field]: value
            }
        }))
    }

    const handleCheck = async (planExerciseId: string, checked: boolean) => {
        if (!checked) return

        const exercise = plan.exercises.find((e: any) => e.id === planExerciseId)
        if (!exercise) return

        const input = inputs[planExerciseId] || {}
        const weightUsed = input.weight || exercise.weight
        const repsDone = input.reps || exercise.reps

        const res = await fetch('/api/student/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                planExerciseId,
                setsDone: exercise.sets,
                repsDone: repsDone,
                weightUsed: weightUsed,
            }),
        })

        if (res.ok) {
            setCompletedExercises(prev => new Set([...prev, planExerciseId]))
            toastr.success('¡Ejercicio marcado como completado!')
        } else {
            toastr.error('Error al marcar el ejercicio')
        }
    }

    const handleResetDay = (day: string) => {
        setResetConfirmation({ show: true, day })
    }

    const confirmResetDay = async () => {
        const day = resetConfirmation.day
        if (!day) return

        const res = await fetch(`/api/student/progress/today?day=${encodeURIComponent(day)}`, {
            method: 'DELETE'
        })

        if (res.ok) {
            const dayExercises = plan.exercises.filter((ex: any) => ex.day === day)
            const dayExerciseIds = dayExercises.map((ex: any) => ex.id)
            setCompletedExercises(prev => {
                const newSet = new Set(prev)
                dayExerciseIds.forEach((id: string) => newSet.delete(id))
                return newSet
            })
            toastr.success(`Día ${day} reiniciado exitosamente`)
        } else {
            toastr.error('El día ya ha sido reiniciado o hubo un error')
        }
        setResetConfirmation({ show: false, day: null })
    }

    const cancelResetDay = () => {
        setResetConfirmation({ show: false, day: null })
    }

    const handleShowExerciseMedia = (exercise: any) => {
        setSelectedExercise(exercise)
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setSelectedExercise(null)
    }

    const handleStartTimer = (exercise: any) => {
        const restTime = exercise.rest || 60 // Default 60 seconds if no rest time specified
        setActiveTimer({ exercise, rest: restTime })
    }

    const handleCloseTimer = () => {
        setActiveTimer(null)
    }

    return (
        <div>
            <Sidebar items={studentNavItems} userRole="STUDENT" userName={user.name} />

            <main className="container-fluid p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="h2">Mi Rutina de Entrenamiento</h1>
                        <p className="text-muted">Bienvenido, <strong>{user.name}</strong></p>
                    </div>
                </div>

                {!canAccessExercises ? (
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
                                ? 'Tu cuenta está inactiva. No puedes acceder a tus rutinas de entrenamiento en este momento.'
                                : `Tu membresía venció el ${new Date(membershipExpiry).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}. No puedes acceder a tus rutinas hasta que renueves tu membresía.`
                            }
                        </p>
                        <hr />
                        <p className="mb-0">
                            <strong>Por favor contacta a tu profesor para renovar tu membresía o activar tu cuenta.</strong>
                        </p>
                    </div>
                ) : plan ? (
                    <>
                        <div className="card mb-4">
                            <div className="card-body">
                                <h5 className="card-title">{plan.name}</h5>
                                <p className="card-text text-muted">
                                    {new Date(plan.startDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    {plan.endDate && ` - ${new Date(plan.endDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                                </p>
                            </div>
                        </div>

                        <h3 className="mb-3">Tu Cronograma</h3>

                        <div className="row g-3">
                            {Object.entries(
                                plan.exercises.reduce((acc: any, ex: any) => {
                                    if (!acc[ex.day]) acc[ex.day] = []
                                    acc[ex.day].push(ex)
                                    return acc
                                }, {})
                            ).map(([day, exercises]: [string, any]) => (
                                <div key={day} className="col-12">
                                    <div className="card">
                                        <div className="card-header bg-primary text-white">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h5 className="mb-0">{day}</h5>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-light"
                                                    onClick={() => handleResetDay(day)}
                                                    title="Reiniciar día"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise me-1" viewBox="0 0 16 16">
                                                        <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
                                                        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                                                    </svg>
                                                    Reiniciar
                                                </button>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <ul className="list-group list-group-flush">
                                                {exercises.map((ex: any) => (
                                                    <li key={ex.id} className="list-group-item">
                                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                                            <div className="d-flex gap-3 flex-grow-1">
                                                                {/* Exercise Image */}
                                                                {ex.exercise.imageUrl ? (
                                                                    <img
                                                                        src={ex.exercise.imageUrl}
                                                                        alt={ex.exercise.name}
                                                                        className="rounded"
                                                                        style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer' }}
                                                                        onClick={() => handleShowExerciseMedia(ex.exercise)}
                                                                        onError={(e) => {
                                                                            e.currentTarget.style.display = 'none';
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <div
                                                                        style={{ width: '80px', height: '80px', backgroundColor: '#e9ecef', borderRadius: '0.375rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: ex.exercise.videoUrl ? 'pointer' : 'default' }}
                                                                        onClick={() => ex.exercise.videoUrl && handleShowExerciseMedia(ex.exercise)}
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="text-muted" viewBox="0 0 16 16">
                                                                            <path d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9V5.5" />
                                                                            <path d="M6.5 0A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0zm3 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z" />
                                                                            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1A2.5 2.5 0 0 1 9.5 5h-3A2.5 2.5 0 0 1 4 2.5zm6.854 7.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708" />
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                                <div className="flex-grow-1">
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        <h6 className="mb-1">{ex.exercise.name}</h6>
                                                                        {ex.rest && (
                                                                            <button
                                                                                className="btn btn-sm btn-outline-primary"
                                                                                onClick={() => handleStartTimer(ex)}
                                                                                title="Iniciar temporizador de descanso"
                                                                            >
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-stopwatch" viewBox="0 0 16 16">
                                                                                    <path d="M8.5 5.6a.5.5 0 1 0-1 0v2.9h-3a.5.5 0 0 0 0 1H8a.5.5 0 0 0 .5-.5z" />
                                                                                    <path d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64l.012-.013.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354-.013.012A7 7 0 1 1 7 2.071V1.5a.5.5 0 0 1-.5-.5M8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3" />
                                                                                </svg>
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                    <small className="text-muted">
                                                                        {ex.sets} series x {ex.reps} reps @ {ex.weight ? `${ex.weight}kg` : 'Peso corporal'}
                                                                        {ex.rest && ` • Descanso: ${ex.rest}s`}
                                                                    </small>
                                                                </div>
                                                            </div>
                                                            {/* Toggle Switch */}
                                                            <div className="form-check form-switch">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id={`complete-${ex.id}`}
                                                                    checked={completedExercises.has(ex.id)}
                                                                    onChange={(e) => handleCheck(ex.id, e.target.checked)}
                                                                    disabled={completedExercises.has(ex.id)}
                                                                />
                                                                <label className="form-check-label" htmlFor={`complete-${ex.id}`}>
                                                                    {completedExercises.has(ex.id) ? 'Completado' : 'Pendiente'}
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="row g-2 mt-2">
                                                            <div className="col-md-6">
                                                                <label className="form-label small">Peso usado (kg)</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control form-control-sm"
                                                                    placeholder={ex.weight || "0"}
                                                                    onChange={(e) => handleInputChange(ex.id, 'weight', e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="col-md-6">
                                                                <label className="form-label small">Reps realizadas</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm"
                                                                    placeholder={ex.reps}
                                                                    onChange={(e) => handleInputChange(ex.id, 'reps', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="alert alert-info" role="alert">
                        <h4 className="alert-heading">Sin Plan Activo</h4>
                        <p>No tienes un plan asignado actualmente. Por favor contacta a tu profesor para que te asigne una rutina.</p>
                    </div>
                )}
            </main>

            {/* Exercise Media Modal */}
            {showModal && selectedExercise && (
                <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{selectedExercise.name}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                {selectedExercise.imageUrl && (
                                    <div className="mb-3">
                                        <img
                                            src={selectedExercise.imageUrl}
                                            alt={selectedExercise.name}
                                            className="img-fluid rounded"
                                            style={{ maxHeight: '400px', width: '100%', objectFit: 'contain' }}
                                        />
                                    </div>
                                )}
                                {selectedExercise.videoUrl && (
                                    <div className="mb-3">
                                        <h6 className="mb-2">Video Explicativo</h6>
                                        <p className="text-muted small">
                                            <a href={selectedExercise.videoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-play-circle me-2" viewBox="0 0 16 16">
                                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                    <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445" />
                                                </svg>
                                                Ver Video en YouTube
                                            </a>
                                        </p>
                                    </div>
                                )}
                                {selectedExercise.description && (
                                    <div>
                                        <h6 className="mb-2">Descripción</h6>
                                        <p className="text-muted">{selectedExercise.description}</p>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Rest Timer Modal */}
            {activeTimer && (
                <RestTimer
                    initialTime={activeTimer.rest}
                    exerciseName={activeTimer.exercise.exercise.name}
                    onClose={handleCloseTimer}
                />
            )}

            <ConfirmationModal
                show={resetConfirmation.show}
                title="Reiniciar Día"
                message={`¿Estás seguro de que quieres reiniciar todos los ejercicios de ${resetConfirmation.day}? Esta acción no se puede deshacer.`}
                onConfirm={confirmResetDay}
                onCancel={cancelResetDay}
                confirmText="Sí, reiniciar"
                confirmButtonVariant="danger"
            />
        </div>
    )
}
