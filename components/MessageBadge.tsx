'use client'

import { useEffect, useState, useRef } from 'react'

export default function MessageBadge() {
    const [unreadCount, setUnreadCount] = useState(0)
    const previousCountRef = useRef<number | null>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    const hasInteractedRef = useRef(false)

    // Initialize audio context on first user interaction
    useEffect(() => {
        const initAudio = () => {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
                hasInteractedRef.current = true
                console.log('✅ Audio context initialized')
            }
        }

        // Listen for any user interaction to enable audio
        document.addEventListener('click', initAudio, { once: true })
        document.addEventListener('keydown', initAudio, { once: true })

        return () => {
            document.removeEventListener('click', initAudio)
            document.removeEventListener('keydown', initAudio)
        }
    }, [])

    const playNotificationSound = () => {
        try {
            if (!audioContextRef.current || !hasInteractedRef.current) {
                console.log('⚠️ Audio context not ready or no user interaction yet')
                return
            }

            const audioContext = audioContextRef.current
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)

            // Two-tone notification (more noticeable)
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.15)
            oscillator.type = 'sine'

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + 0.3)

            console.log('🔔 Notification sound played!')
        } catch (error) {
            console.error('❌ Error playing notification sound:', error)
        }
    }

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const res = await fetch('/api/messages/unread')
                const data = await res.json()
                if (data.unreadCount !== undefined) {
                    const newCount = data.unreadCount

                    // Play sound if count increased (new message arrived)
                    // Skip first load (when previousCountRef is null)
                    if (previousCountRef.current !== null && newCount > previousCountRef.current) {
                        console.log(`📬 New message! Count: ${previousCountRef.current} → ${newCount}`)
                        playNotificationSound()
                    }

                    previousCountRef.current = newCount
                    setUnreadCount(newCount)
                }
            } catch (error) {
                console.error('Error fetching unread count:', error)
            }
        }

        fetchUnreadCount()

        // Refresh every 10 seconds
        const interval = setInterval(fetchUnreadCount, 10000)
        return () => clearInterval(interval)
    }, [])

    if (unreadCount === 0) return null

    return (
        <span className="badge bg-danger rounded-pill">
            {unreadCount}
        </span>
    )
}
