'use client'

interface ConversationListProps {
    conversations: Array<{
        user: {
            id: string
            name: string
            email: string
        }
        lastMessage: {
            content: string
            createdAt: string
        }
        unreadCount: number
    }>
    selectedUserId: string | null
    onSelectConversation: (userId: string) => void
}

export default function ConversationList({ conversations, selectedUserId, onSelectConversation }: ConversationListProps) {
    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)

        if (diffMins < 1) return 'Ahora'
        if (diffMins < 60) return `${diffMins}m`

        const diffHours = Math.floor(diffMins / 60)
        if (diffHours < 24) return `${diffHours}h`

        return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
    }

    return (
        <div className="list-group list-group-flush">
            {conversations.length === 0 ? (
                <div className="text-center text-muted p-4">
                    <p className="mb-0">No hay conversaciones</p>
                </div>
            ) : (
                conversations.map((conversation) => (
                    <button
                        key={conversation.user.id}
                        className={`list-group-item list-group-item-action ${selectedUserId === conversation.user.id ? 'active' : ''
                            }`}
                        onClick={() => onSelectConversation(conversation.user.id)}
                    >
                        <div className="d-flex w-100 justify-content-between align-items-start">
                            <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <h6 className="mb-0 text-truncate">{conversation.user.name}</h6>
                                    <small className={selectedUserId === conversation.user.id ? 'text-white-50' : 'text-muted'}>
                                        {formatTime(conversation.lastMessage.createdAt)}
                                    </small>
                                </div>
                                <p
                                    className={`mb-0 small text-truncate ${selectedUserId === conversation.user.id ? 'text-white-50' : 'text-muted'
                                        }`}
                                    style={{ maxWidth: '200px' }}
                                >
                                    {conversation.lastMessage.content}
                                </p>
                            </div>
                            {conversation.unreadCount > 0 && (
                                <span className="badge bg-danger rounded-pill ms-2">
                                    {conversation.unreadCount}
                                </span>
                            )}
                        </div>
                    </button>
                ))
            )}
        </div>
    )
}
