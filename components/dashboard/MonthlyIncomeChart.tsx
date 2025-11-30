'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface MonthlyIncomeChartProps {
    data: Array<{ month: string; amount: number }>
}

export default function MonthlyIncomeChart({ data }: MonthlyIncomeChartProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(value)
    }

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-body">
                <h5 className="card-title mb-4">Ingresos Mensuales</h5>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                            dataKey="month"
                            stroke="#6c757d"
                            style={{ fontSize: '0.875rem' }}
                        />
                        <YAxis
                            stroke="#6c757d"
                            style={{ fontSize: '0.875rem' }}
                            tickFormatter={formatCurrency}
                        />
                        <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #dee2e6',
                                borderRadius: '0.375rem',
                                boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.075)'
                            }}
                        />
                        <Bar
                            dataKey="amount"
                            fill="#0d6efd"
                            radius={[8, 8, 0, 0]}
                            name="Ingresos"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
