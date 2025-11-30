'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface GymSettings {
    id: string
    gymName: string
    logoUrl: string | null
    primaryColor: string
    secondaryColor: string
    accentColor: string
    termsAndConditions: string | null
}

interface GymSettingsContextType {
    settings: GymSettings | null
    loading: boolean
    updateSettings: (newSettings: Partial<GymSettings>) => Promise<void>
    refreshSettings: () => Promise<void>
}

const GymSettingsContext = createContext<GymSettingsContextType | undefined>(undefined)

export function GymSettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<GymSettings | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings')
            const data = await res.json()
            if (data.settings) {
                setSettings(data.settings)
                // Apply colors to CSS variables
                applyThemeColors(data.settings)
            }
        } catch (error) {
            console.error('Error fetching gym settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const applyThemeColors = (settings: GymSettings) => {
        if (typeof document !== 'undefined') {
            document.documentElement.style.setProperty('--bs-primary', settings.primaryColor)
            document.documentElement.style.setProperty('--bs-secondary', settings.secondaryColor)
            document.documentElement.style.setProperty('--bs-success', settings.accentColor)
        }
    }

    const updateSettings = async (newSettings: Partial<GymSettings>) => {
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSettings)
            })
            const data = await res.json()
            if (data.settings) {
                setSettings(data.settings)
                applyThemeColors(data.settings)
            }
        } catch (error) {
            console.error('Error updating gym settings:', error)
            throw error
        }
    }

    const refreshSettings = async () => {
        setLoading(true)
        await fetchSettings()
    }

    useEffect(() => {
        fetchSettings()
    }, [])

    return (
        <GymSettingsContext.Provider value={{ settings, loading, updateSettings, refreshSettings }}>
            {children}
        </GymSettingsContext.Provider>
    )
}

export function useGymSettings() {
    const context = useContext(GymSettingsContext)
    if (context === undefined) {
        throw new Error('useGymSettings must be used within a GymSettingsProvider')
    }
    return context
}
