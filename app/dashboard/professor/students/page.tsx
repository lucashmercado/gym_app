'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'

const professorNavItems = [
    { name: 'Dashboard', href: '/dashboard/professor' },
    { name: 'Estudiantes', href: '/dashboard/professor/students' },
    { name: 'Planes', href: '/dashboard/professor/plans' },
    { name: 'Ejercicios', href: '/dashboard/professor/exercises' },
    { name: 'Pagos', href: '/dashboard/professor/payments' },
]

export default function StudentList() {
    const [students, setStudents] = useState<any[]>([])

    useEffect(() => {
        fetch('/api/professor/students')
            .then((res) => res.json())
            .then((data) => setStudents(data.students || []))
    }, [])

    return (
        <div>
            <Sidebar items={professorNavItems} userRole="PROFESSOR" />

            <main className="container-fluid p-4">
                <div className="container-fluid">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="h2">Estudiantes</h1>
                        <div className="d-flex gap-2">
                            <a
                                href="/api/export/students"
                                className="btn btn-success"
                                download
                            >
                                📊 Exportar a Excel
                            </a>
                            <Link href="/dashboard/professor/students/new" className="btn btn-primary">
                                + Nuevo Estudiante
                            </Link>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Email</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student) => (
                                            <tr key={student.id}>
                                                <td>{student.name}</td>
                                                <td>{student.email}</td>
                                                <td>
                                                    <span className={`badge ${student.active ? 'bg-success' : 'bg-danger'}`}>
                                                        {student.active ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <Link href={`/dashboard/professor/students/${student.id}`} className="btn btn-sm btn-outline-primary me-2">
                                                        Ver
                                                    </Link>
                                                    <Link href={`/dashboard/professor/plans/new?studentId=${student.id}`} className="btn btn-sm btn-outline-success">
                                                        Asignar Plan
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                        {students.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="text-center text-muted py-4">
                                                    No se encontraron estudiantes.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
