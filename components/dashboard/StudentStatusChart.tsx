'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface StudentStatusChartProps {
    active: number
    inactive: number
}

export default function StudentStatusChart({ active, inactive }: StudentStatusChartProps) {
    const data = [
        { name: 'Activos', value: active, color: '#198754' },
        { name: 'Inactivos', value: inactive, color: '#6c757d' }
    ]

    const total = active + inactive

    return (
        <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
                <h5 className="card-title mb-4">Estado de Estudiantes</h5>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => `${value} (${((value / total) * 100).toFixed(1)}%)`}
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #dee2e6',
                                borderRadius: '0.375rem',
                                boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.075)'
                            }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value, entry: any) => (
                                `${value}: ${entry.payload.value} (${((entry.payload.value / total) * 100).toFixed(1)}%)`
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
