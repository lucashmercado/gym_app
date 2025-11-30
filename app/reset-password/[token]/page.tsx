'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ResetPassword({ params }: { params: { token: string } }) {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const token = params.token

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            setLoading(false)
            return
        }

        // Validate password length
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            setLoading(false)
            return
        }

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            })

            const data = await res.json()

            if (res.ok) {
                setSuccess(true)
                setTimeout(() => {
                    router.push('/login')
                }, 3000)
            } else {
                setError(data.error || 'An error occurred')
            }
        } catch (error) {
            setError('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="card shadow-sm">
                            <div className="card-body p-5">
                                <div className="text-center mb-4">
                                    <h1 className="h3 mb-3">Restablecer Contraseña</h1>
                                    <p className="text-muted">
                                        Ingresa tu nueva contraseña
                                    </p>
                                </div>

                                {success ? (
                                    <div className="alert alert-success" role="alert">
                                        <h4 className="alert-heading">¡Contraseña actualizada!</h4>
                                        <p>Tu contraseña ha sido restablecida exitosamente.</p>
                                        <hr />
                                        <p className="mb-0">Serás redirigido al inicio de sesión en unos segundos...</p>
                                    </div>
                                ) : (
                                    <>
                                        {error && (
                                            <div className="alert alert-danger" role="alert">
                                                {error}
                                            </div>
                                        )}

                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3">
                                                <label htmlFor="password" className="form-label">
                                                    Nueva Contraseña
                                                </label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                    disabled={loading}
                                                    placeholder="Mínimo 6 caracteres"
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="confirmPassword" className="form-label">
                                                    Confirmar Contraseña
                                                </label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="confirmPassword"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                    disabled={loading}
                                                    placeholder="Repite tu contraseña"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                className="btn btn-primary w-100 mb-3"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        Restableciendo...
                                                    </>
                                                ) : (
                                                    'Restablecer Contraseña'
                                                )}
                                            </button>

                                            <div className="text-center">
                                                <Link href="/login" className="text-decoration-none">
                                                    ← Volver al inicio de sesión
                                                </Link>
                                            </div>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
