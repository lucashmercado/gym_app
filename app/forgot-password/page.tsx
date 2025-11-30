'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [resetLink, setResetLink] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setMessage('')
        setResetLink('')

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            const data = await res.json()

            if (res.ok) {
                setMessage(data.message)
                if (data.resetLink) {
                    setResetLink(data.resetLink)
                }
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
                                    <h1 className="h3 mb-3">¿Olvidaste tu contraseña?</h1>
                                    <p className="text-muted">
                                        Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
                                    </p>
                                </div>

                                {message && (
                                    <div className="alert alert-success" role="alert">
                                        {message}
                                        {resetLink && (
                                            <div className="mt-3">
                                                <small className="text-muted d-block mb-2">
                                                    (Modo desarrollo - Link de reset:)
                                                </small>
                                                <Link href={resetLink.replace(window.location.origin, '')} className="btn btn-sm btn-outline-success">
                                                    Ir al link de reset
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={loading}
                                            placeholder="tu@email.com"
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
                                                Enviando...
                                            </>
                                        ) : (
                                            'Enviar enlace de recuperación'
                                        )}
                                    </button>

                                    <div className="text-center">
                                        <Link href="/login" className="text-decoration-none">
                                            ← Volver al inicio de sesión
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
