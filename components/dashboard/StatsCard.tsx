interface StatsCardProps {
    title: string
    value: string | number
    subtitle?: string
    icon: string
    color: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'secondary'
    trend?: {
        value: number
        isPositive: boolean
    }
}

export default function StatsCard({ title, value, subtitle, icon, color, trend }: StatsCardProps) {
    return (
        <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <p className="text-muted small mb-1">{title}</p>
                        <h2 className="mb-0 fw-bold">{value}</h2>
                        {subtitle && (
                            <p className="text-muted small mb-0 mt-1">{subtitle}</p>
                        )}
                    </div>
                    <div className={`bg-${color} bg-opacity-10 rounded-3 p-3`}>
                        <span style={{ fontSize: '2rem' }}>{icon}</span>
                    </div>
                </div>
                {trend && (
                    <div className="d-flex align-items-center">
                        <span className={`badge bg-${trend.isPositive ? 'success' : 'danger'} bg-opacity-10 text-${trend.isPositive ? 'success' : 'danger'}`}>
                            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                        </span>
                        <span className="text-muted small ms-2">vs mes anterior</span>
                    </div>
                )}
            </div>
        </div>
    )
}
