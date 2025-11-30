'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ChatWindow from '@/components/messages/ChatWindow'

const studentNavItems = [
    { name: 'Mi Rutina', href: '/dashboard/student' },
    { name: 'Progreso', href: '/dashboard/student/progress' },
    { name: 'Mensajes', href: '/dashboard/student/messages' },
]

export default function StudentMessages() {
    const [user, setUser] = useState<any>(null)
    const [professor, setProfessor] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetch('/api/auth/me')
            .then((res) => res.json())
            .then((data) => {
                if (!data.user || data.user.role !== 'STUDENT') {
                    router.push('/login')
                } else {
                    setUser(data.user)
                    fetchProfessor(data.user.id)
                }
            })
    }, [router])

    const fetchProfessor = async (studentId: string) => {
        try {
            // Get student profile to find professor
            const res = await fetch(`/api/student/profile`)
            const data = await res.json()
            if (data.profile && data.profile.professor) {
                setProfessor(data.profile.professor)
            }
        } catch (error) {
            console.error('Error fetching professor:', error)
        } finally {
            setLoading(false)
        }
    }

    if (!user) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Sidebar items={studentNavItems} userRole="STUDENT" userName={user.name} />

            <main className="container-fluid p-4">
                <h1 className="h2 mb-4">Mensajes con mi Profesor</h1>

                <div className="card border-0 shadow-sm" style={{ height: 'calc(100vh - 200px)' }}>
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center h-100">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    ) : professor ? (
                        <ChatWindow
                            otherUser={professor}
                            currentUserId={user.id}
                        />
                    ) : (
                        <div className="d-flex justify-content-center align-items-center h-100">
                            <div className="text-center text-muted">
                                <h5>No tienes un profesor asignado</h5>
                                <p>Contacta al administrador para más información</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
