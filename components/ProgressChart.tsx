'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ProgressChartProps {
    studentId?: string
}

export default function ProgressChart({ studentId }: ProgressChartProps) {
    const [exercises, setExercises] = useState<any[]>([])
    const [selectedExercise, setSelectedExercise] = useState<string>('')
    const [period, setPeriod] = useState<string>('30')
    const [progressData, setProgressData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchProgress = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                days: period
            })
            if (selectedExercise) {
                params.append('exerciseId', selectedExercise)
            }

            const res = await fetch(`/api/student/progress?${params}`)
            const data = await res.json()

            setExercises(data.exercises || [])

            // Format data for chart
            const formattedData = data.progress.map((p: any) => ({
                date: new Date(p.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
                peso: p.weightUsed || 0,
                series: p.setsDone,
                ejercicio: p.planExercise.exercise.name
            }))

            setProgressData(formattedData)
        } catch (error) {
            console.error('Error fetching progress:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProgress()
    }, [selectedExercise, period])

    if (loading && progressData.length === 0) {
        return (
            <div className="card">
                <div className="card-body text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="card">
            <div className="card-header">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <h5 className="mb-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-graph-up me-2" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07" />
                            </svg>
                            Progreso de Entrenamiento
                        </h5>
                    </div>
                    <div className="col-md-6">
                        <div className="row g-2">
                            <div className="col-md-6">
                                <select
                                    className="form-select form-select-sm"
                                    value={selectedExercise}
                                    onChange={(e) => setSelectedExercise(e.target.value)}
                                >
                                    <option value="">Todos los ejercicios</option>
                                    {exercises.map(ex => (
                                        <option key={ex.id} value={ex.id}>
                                            {ex.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <select
                                    className="form-select form-select-sm"
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value)}
                                >
                                    <option value="7">Última semana</option>
                                    <option value="30">Último mes</option>
                                    <option value="90">Últimos 3 meses</option>
                                    <option value="180">Últimos 6 meses</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-body">
                {progressData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={progressData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                label={{ value: 'Peso (kg)', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--card-bg)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px'
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="peso"
                                stroke="#0d6efd"
                                strokeWidth={2}
                                dot={{ fill: '#0d6efd', r: 4 }}
                                activeDot={{ r: 6 }}
                                name="Peso (kg)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="alert alert-info mb-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-info-circle me-2" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533z" />
                            <path d="M9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                        </svg>
                        No hay datos de progreso para el período seleccionado. Completa tus entrenamientos para ver tu evolución aquí.
                    </div>
                )}
            </div>
        </div>
    )
}
