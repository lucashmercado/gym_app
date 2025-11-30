'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ChatWindow from '@/components/messages/ChatWindow'

const professorNavItems = [
    { name: 'Dashboard', href: '/dashboard/professor' },
    { name: 'Estudiantes', href: '/dashboard/professor/students' },
    { name: 'Planes', href: '/dashboard/professor/plans' },
    { name: 'Plantillas', href: '/dashboard/professor/templates' },
    { name: 'Ejercicios', href: '/dashboard/professor/exercises' },
    { name: 'Mensajes', href: '/dashboard/professor/messages' },
    { name: 'Pagos', href: '/dashboard/professor/payments' },
]

export default function ProfessorMessages() {
    const [user, setUser] = useState<any>(null)
    const [students, setStudents] = useState<any[]>([])
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetch('/api/auth/me')
            .then((res) => res.json())
            .then((data) => {
                if (!data.user || data.user.role !== 'PROFESSOR') {
                    router.push('/login')
                } else {
                    setUser(data.user)
                    fetchStudents()
                }
            })
    }, [router])

    const fetchStudents = async () => {
        try {
            const res = await fetch('/api/professor/students')
            const data = await res.json()
            if (data.students) {
                setStudents(data.students)
                // Auto-select first student if none selected
                if (!selectedUserId && data.students.length > 0) {
                    setSelectedUserId(data.students[0].id)
                }
            }
        } catch (error) {
            console.error('Error fetching students:', error)
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

    const selectedStudent = students.find(s => s.id === selectedUserId)

    return (
        <div>
            <Sidebar items={professorNavItems} userRole="PROFESSOR" userName={user.name} />

            <main className="container-fluid p-4">
                <h1 className="h2 mb-4">Mensajes</h1>

                <div className="row g-0 border rounded overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
                    {/* Students List */}
                    <div className="col-md-4 border-end bg-light">
                        <div className="p-3 border-bottom bg-white">
                            <h5 className="mb-0">Estudiantes</h5>
                        </div>
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center p-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        ) : students.length === 0 ? (
                            <div className="text-center text-muted p-4">
                                <p className="mb-0">No tienes estudiantes aún</p>
                                <small>Crea estudiantes desde el menú "Estudiantes"</small>
                            </div>
                        ) : (
                            <div className="list-group list-group-flush">
                                {students.map((student) => (
                                    <button
                                        key={student.id}
                                        className={`list-group-item list-group-item-action ${selectedUserId === student.id ? 'active' : ''
                                            }`}
                                        onClick={() => setSelectedUserId(student.id)}
                                    >
                                        <div className="d-flex w-100 justify-content-between align-items-center">
                                            <div>
                                                <h6 className="mb-0">{student.name}</h6>
                                                <small className={selectedUserId === student.id ? 'text-white-50' : 'text-muted'}>
                                                    {student.email}
                                                </small>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Chat Window */}
                    <div className="col-md-8 bg-white">
                        {selectedStudent ? (
                            <ChatWindow
                                otherUser={selectedStudent}
                                currentUserId={user.id}
                            />
                        ) : (
                            <div className="d-flex justify-content-center align-items-center h-100">
                                <div className="text-center text-muted">
                                    <h5>Selecciona un estudiante</h5>
                                    <p>Elige un estudiante para comenzar a chatear</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
