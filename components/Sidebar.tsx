'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface NavItem {
    name: string
    href: string
}

interface NavbarProps {
    items: NavItem[]
    userRole: 'PROFESSOR' | 'STUDENT'
    userName?: string
}

export default function Sidebar({ items, userRole, userName }: NavbarProps) {
    const router = useRouter()

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/login')
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <div className="container-fluid">
                <Link href={userRole === 'PROFESSOR' ? '/dashboard/professor' : '/dashboard/student'} className="navbar-brand fw-bold">
                    Gym Manager
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        {items.map((item) => (
                            <li key={item.href} className="nav-item">
                                <Link href={item.href} className="nav-link">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="d-flex align-items-center gap-3">
                        <span className="text-white-50 small">
                            {userRole === 'PROFESSOR' ? 'Profesor' : 'Estudiante'}
                            {userName && `: ${userName}`}
                        </span>
                        <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
