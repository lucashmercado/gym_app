'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface TopExercisesChartProps {
    data: Array<{ name: string; count: number }>
}

export default function TopExercisesChart({ data }: TopExercisesChartProps) {
    return (
        <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
                <h5 className="card-title mb-4">Ejercicios Más Populares</h5>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                            type="number"
                            stroke="#6c757d"
                            style={{ fontSize: '0.875rem' }}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            stroke="#6c757d"
                            style={{ fontSize: '0.875rem' }}
                            width={120}
                        />
                        <Tooltip
                            formatter={(value: number) => [`${value} planes`, 'Usado en']}
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #dee2e6',
                                borderRadius: '0.375rem',
                                boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.075)'
                            }}
                        />
                        <Bar
                            dataKey="count"
                            fill="#ffc107"
                            radius={[0, 8, 8, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
