'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import NotificationBadge from './NotificationBadge'
import MessageBadge from './MessageBadge'

interface NavItem {
    name: string
    href: string
}

interface NavbarProps {
    items: NavItem[]
    userRole: 'PROFESSOR' | 'STUDENT' | 'ADMIN'
    userName?: string
}

export default function Sidebar({ items, userRole, userName }: NavbarProps) {
    const router = useRouter()
    const { theme, toggleTheme } = useTheme()

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
                                <Link href={item.href} className="nav-link d-flex align-items-center gap-2">
                                    {item.name}
                                    {item.name === 'Mensajes' && <MessageBadge />}
                                </Link>
                            </li>
                        ))}\r
                        {/* Admin Menu - Only show if user is ADMIN */}
                        {userRole === 'ADMIN' && (
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    ⚙️ Admin
                                </a>
                                <ul className="dropdown-menu dropdown-menu-dark">
                                    <li><Link className="dropdown-item" href="/dashboard/admin">Dashboard Admin</Link></li>
                                    <li><Link className="dropdown-item" href="/dashboard/admin/settings">Configuración del Gym</Link></li>
                                    <li><Link className="dropdown-item" href="/dashboard/admin/logs">Logs de Actividad</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><Link className="dropdown-item" href="/dashboard/professor">Dashboard Profesor</Link></li>
                                </ul>
                            </li>
                        )}
                    </ul>
                    <div className="d-flex align-items-center gap-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="btn btn-outline-light btn-sm"
                            title={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
                        >
                            {theme === 'light' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-moon-stars" viewBox="0 0 16 16">
                                    <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286" />
                                    <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.73 1.73 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.73 1.73 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.73 1.73 0 0 0 1.097-1.097zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sun" viewBox="0 0 16 16">
                                    <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708" />
                                </svg>
                            )}
                        </button>

                        {/* Notifications */}
                        <NotificationBadge />

                        <span className="text-white-50 small">
                            {userRole === 'ADMIN' ? 'Administrador' : userRole === 'PROFESSOR' ? 'Profesor' : 'Estudiante'}
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
