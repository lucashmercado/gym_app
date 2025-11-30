'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

const adminNavItems = [
    { name: 'Dashboard', href: '/dashboard/admin' },
    { name: 'Usuarios', href: '/dashboard/admin/users' },
    { name: 'Logs', href: '/dashboard/admin/logs' },
    { name: 'Configuración', href: '/dashboard/admin/settings' },
]

export default function AdminSettings() {
    const [user, setUser] = useState<any>(null)
    const [settings, setSettings] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')
    const router = useRouter()

    // Form state
    const [gymName, setGymName] = useState('')
    const [logoUrl, setLogoUrl] = useState('')
    const [primaryColor, setPrimaryColor] = useState('#0d6efd')
    const [secondaryColor, setSecondaryColor] = useState('#6c757d')
    const [accentColor, setAccentColor] = useState('#198754')
    const [termsAndConditions, setTermsAndConditions] = useState('')

    useEffect(() => {
        fetch('/api/auth/me')
            .then((res) => res.json())
            .then((data) => {
                if (!data.user || data.user.role !== 'ADMIN') {
                    router.push('/login')
                } else {
                    setUser(data.user)
                    fetchSettings()
                }
            })
    }, [router])

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings')
            const data = await res.json()
            if (data.settings) {
                setSettings(data.settings)
                setGymName(data.settings.gymName)
                setLogoUrl(data.settings.logoUrl || '')
                setPrimaryColor(data.settings.primaryColor)
                setSecondaryColor(data.settings.secondaryColor)
                setAccentColor(data.settings.accentColor)
                setTermsAndConditions(data.settings.termsAndConditions || '')
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage('')

        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gymName,
                    logoUrl: logoUrl || null,
                    primaryColor,
                    secondaryColor,
                    accentColor,
                    termsAndConditions: termsAndConditions || null
                })
            })

            if (res.ok) {
                setMessage('Configuración guardada exitosamente')
                setTimeout(() => setMessage(''), 3000)
                fetchSettings()
            } else {
                setMessage('Error al guardar la configuración')
            }
        } catch (error) {
            setMessage('Error al guardar la configuración')
        } finally {
            setSaving(false)
        }
    }

    if (!user) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Sidebar items={adminNavItems} userRole="ADMIN" userName={user.name} />

            <main className="container-fluid p-4">
                <div className="container-fluid">
                    <h1 className="h2 mb-4">Configuración del Gym</h1>

                    {message && (
                        <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`} role="alert">
                            {message}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSave}>
                            <div className="row g-4">
                                {/* General Settings */}
                                <div className="col-md-6">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5 className="mb-0">Información General</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="mb-3">
                                                <label htmlFor="gymName" className="form-label">
                                                    Nombre del Gym
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="gymName"
                                                    value={gymName}
                                                    onChange={(e) => setGymName(e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="logoUrl" className="form-label">
                                                    URL del Logo
                                                </label>
                                                <input
                                                    type="url"
                                                    className="form-control"
                                                    id="logoUrl"
                                                    value={logoUrl}
                                                    onChange={(e) => setLogoUrl(e.target.value)}
                                                    placeholder="https://ejemplo.com/logo.png"
                                                />
                                                <small className="text-muted">
                                                    Ingresa la URL de tu logo (opcional)
                                                </small>
                                            </div>

                                            {logoUrl && (
                                                <div className="mb-3">
                                                    <label className="form-label">Vista Previa del Logo</label>
                                                    <div className="border rounded p-3 bg-light text-center">
                                                        <img
                                                            src={logoUrl}
                                                            alt="Logo preview"
                                                            style={{ maxHeight: '100px', maxWidth: '100%' }}
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none'
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Theme Colors */}
                                <div className="col-md-6">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5 className="mb-0">Colores del Tema</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="mb-3">
                                                <label htmlFor="primaryColor" className="form-label">
                                                    Color Primario
                                                </label>
                                                <div className="input-group">
                                                    <input
                                                        type="color"
                                                        className="form-control form-control-color"
                                                        id="primaryColor"
                                                        value={primaryColor}
                                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                                    />
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={primaryColor}
                                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="secondaryColor" className="form-label">
                                                    Color Secundario
                                                </label>
                                                <div className="input-group">
                                                    <input
                                                        type="color"
                                                        className="form-control form-control-color"
                                                        id="secondaryColor"
                                                        value={secondaryColor}
                                                        onChange={(e) => setSecondaryColor(e.target.value)}
                                                    />
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={secondaryColor}
                                                        onChange={(e) => setSecondaryColor(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="accentColor" className="form-label">
                                                    Color de Acento
                                                </label>
                                                <div className="input-group">
                                                    <input
                                                        type="color"
                                                        className="form-control form-control-color"
                                                        id="accentColor"
                                                        value={accentColor}
                                                        onChange={(e) => setAccentColor(e.target.value)}
                                                    />
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={accentColor}
                                                        onChange={(e) => setAccentColor(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Color Preview */}
                                            <div className="border rounded p-3 bg-light">
                                                <small className="text-muted d-block mb-2">Vista Previa:</small>
                                                <div className="d-flex gap-2">
                                                    <button type="button" className="btn btn-sm" style={{ backgroundColor: primaryColor, color: 'white' }}>
                                                        Primario
                                                    </button>
                                                    <button type="button" className="btn btn-sm" style={{ backgroundColor: secondaryColor, color: 'white' }}>
                                                        Secundario
                                                    </button>
                                                    <button type="button" className="btn btn-sm" style={{ backgroundColor: accentColor, color: 'white' }}>
                                                        Acento
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Terms and Conditions */}
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5 className="mb-0">Términos y Condiciones</h5>
                                        </div>
                                        <div className="card-body">
                                            <textarea
                                                className="form-control"
                                                rows={10}
                                                value={termsAndConditions}
                                                onChange={(e) => setTermsAndConditions(e.target.value)}
                                                placeholder="Ingresa los términos y condiciones de tu gym..."
                                            />
                                            <small className="text-muted">
                                                Estos términos se mostrarán a los usuarios al registrarse
                                            </small>
                                        </div>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="col-12">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Guardando...
                                            </>
                                        ) : (
                                            'Guardar Configuración'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    )
}
