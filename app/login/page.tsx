'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Error al iniciar sesión')
            }

            // Validate that user object exists
            if (!data.user) {
                throw new Error('Error al obtener datos del usuario')
            }

            // Redirect based on role
            if (data.user.role === 'ADMIN') {
                router.push('/dashboard/admin')
            } else if (data.user.role === 'PROFESSOR') {
                router.push('/dashboard/professor')
            } else {
                router.push('/dashboard/student')
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="card shadow">
                            <div className="card-body p-5">
                                <div className="text-center mb-4">
                                    <Link href="/" className="text-decoration-none">
                                        <h2 className="fw-bold text-primary">Gym Manager</h2>
                                    </Link>
                                    <h4 className="mt-3">Bienvenido</h4>
                                    <p className="text-muted">Ingresa a tu cuenta</p>
                                </div>

                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            placeholder="tu@email.com"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Contraseña</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <div className="mb-3 text-end">
                                        <Link href="/forgot-password" className="text-decoration-none small">
                                            ¿Olvidaste tu contraseña?
                                        </Link>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Cargando...
                                            </>
                                        ) : (
                                            'Iniciar Sesión'
                                        )}
                                    </button>
                                </form>

                                <div className="text-center mt-4">
                                    <Link href="/" className="text-decoration-none text-muted">
                                        ← Volver al inicio
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
