interface MessageBubbleProps {
    message: {
        id: string
        content: string
        createdAt: Date | string
        senderId: string
        read: boolean
    }
    currentUserId: string
}

export default function MessageBubble({ message, currentUserId }: MessageBubbleProps) {
    const isSent = message.senderId === currentUserId
    const messageDate = new Date(message.createdAt)

    // Format time
    const formatTime = (date: Date) => {
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)

        if (diffMins < 1) return 'Ahora'
        if (diffMins < 60) return `Hace ${diffMins} min`

        const diffHours = Math.floor(diffMins / 60)
        if (diffHours < 24) return `Hace ${diffHours}h`

        const diffDays = Math.floor(diffHours / 24)
        if (diffDays === 1) return 'Ayer'
        if (diffDays < 7) return `Hace ${diffDays} días`

        return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
    }

    return (
        <div className={`d-flex mb-3 ${isSent ? 'justify-content-end' : 'justify-content-start'}`}>
            <div
                className={`rounded-3 px-3 py-2 ${isSent
                        ? 'bg-primary text-white'
                        : 'bg-light text-dark'
                    }`}
                style={{ maxWidth: '70%' }}
            >
                <p className="mb-1" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {message.content}
                </p>
                <div className={`d-flex align-items-center gap-1 ${isSent ? 'justify-content-end' : ''}`}>
                    <small className={`${isSent ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.75rem' }}>
                        {formatTime(messageDate)}
                    </small>
                    {isSent && (
                        <small className="text-white-50" style={{ fontSize: '0.75rem' }}>
                            {message.read ? '✓✓' : '✓'}
                        </small>
                    )}
                </div>
            </div>
        </div>
    )
}
