'use client'

import { useEffect, useState, useRef } from 'react'

interface RestTimerProps {
    initialTime: number // tiempo en segundos
    exerciseName: string
    onClose: () => void
}

export default function RestTimer({ initialTime, exerciseName, onClose }: RestTimerProps) {
    const [timeLeft, setTimeLeft] = useState(initialTime)
    const [isRunning, setIsRunning] = useState(false)
    const [isFinished, setIsFinished] = useState(false)
    const [customTime, setCustomTime] = useState(initialTime)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsRunning(false)
                        setIsFinished(true)
                        playNotificationSound()
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isRunning, timeLeft])

    const playNotificationSound = () => {
        // Crear un beep usando Web Audio API
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.value = 800
        oscillator.type = 'sine'

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.5)
    }

    const handleStart = () => {
        setIsRunning(true)
        setIsFinished(false)
    }

    const handlePause = () => {
        setIsRunning(false)
    }

    const handleReset = () => {
        setIsRunning(false)
        setIsFinished(false)
        setTimeLeft(customTime)
    }

    const handleCustomTimeChange = (seconds: number) => {
        setCustomTime(seconds)
        setTimeLeft(seconds)
        setIsRunning(false)
        setIsFinished(false)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const progress = ((customTime - timeLeft) / customTime) * 100

    return (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-stopwatch me-2" viewBox="0 0 16 16">
                                <path d="M8.5 5.6a.5.5 0 1 0-1 0v2.9h-3a.5.5 0 0 0 0 1H8a.5.5 0 0 0 .5-.5z"/>
                                <path d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64l.012-.013.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354-.013.012A7 7 0 1 1 7 2.071V1.5a.5.5 0 0 1-.5-.5M8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3"/>
                            </svg>
                            Temporizador de Descanso
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body text-center">
                        <h6 className="text-muted mb-4">{exerciseName}</h6>
                        
                        {/* Circular Progress */}
                        <div className="position-relative d-inline-block mb-4">
                            <svg width="200" height="200" className="position-relative" style={{ transform: 'rotate(-90deg)' }}>
                                {/* Background circle */}
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="90"
                                    fill="none"
                                    stroke="#e9ecef"
                                    strokeWidth="10"
                                />
                                {/* Progress circle */}
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="90"
                                    fill="none"
                                    stroke={isFinished ? '#198754' : '#0d6efd'}
                                    strokeWidth="10"
                                    strokeDasharray={`${2 * Math.PI * 90}`}
                                    strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                                    strokeLinecap="round"
                                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                                />
                            </svg>
                            <div className="position-absolute top-50 start-50 translate-middle">
                                <h1 className={`display-3 mb-0 ${isFinished ? 'text-success' : ''}`}>
                                    {formatTime(timeLeft)}
                                </h1>
                            </div>
                        </div>

                        {isFinished && (
                            <div className="alert alert-success mb-3" role="alert">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle me-2" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                    <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                                </svg>
                                ¡Descanso completado! Listo para la siguiente serie.
                            </div>
                        )}

                        {/* Control Buttons */}
                        <div className="d-flex gap-2 justify-content-center mb-3">
                            {!isRunning ? (
                                <button 
                                    className="btn btn-primary btn-lg"
                                    onClick={handleStart}
                                    disabled={timeLeft === 0}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-play-fill me-2" viewBox="0 0 16 16">
                                        <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
                                    </svg>
                                    {timeLeft === customTime ? 'Iniciar' : 'Reanudar'}
                                </button>
                            ) : (
                                <button 
                                    className="btn btn-warning btn-lg"
                                    onClick={handlePause}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pause-fill me-2" viewBox="0 0 16 16">
                                        <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"/>
                                    </svg>
                                    Pausar
                                </button>
                            )}
                            <button 
                                className="btn btn-secondary btn-lg"
                                onClick={handleReset}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-clockwise me-2" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                                </svg>
                                Reiniciar
                            </button>
                        </div>

                        {/* Quick Time Adjustments */}
                        <div className="border-top pt-3">
                            <p className="text-muted small mb-2">Ajustar tiempo:</p>
                            <div className="btn-group" role="group">
                                <button 
                                    className={`btn btn-sm ${customTime === 30 ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => handleCustomTimeChange(30)}
                                >
                                    30s
                                </button>
                                <button 
                                    className={`btn btn-sm ${customTime === 60 ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => handleCustomTimeChange(60)}
                                >
                                    1m
                                </button>
                                <button 
                                    className={`btn btn-sm ${customTime === 90 ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => handleCustomTimeChange(90)}
                                >
                                    1.5m
                                </button>
                                <button 
                                    className={`btn btn-sm ${customTime === 120 ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => handleCustomTimeChange(120)}
                                >
                                    2m
                                </button>
                                <button 
                                    className={`btn btn-sm ${customTime === 180 ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => handleCustomTimeChange(180)}
                                >
                                    3m
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
