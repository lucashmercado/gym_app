'use client'

import { useEffect, useState, useRef } from 'react'
import MessageBubble from './MessageBubble'

interface ChatWindowProps {
    otherUser: {
        id: string
        name: string
        email: string
    }
    currentUserId: string
}

interface Message {
    id: string
    content: string
    senderId: string
    receiverId: string
    read: boolean
    createdAt: string
    sender: { id: string; name: string; email: string }
    receiver: { id: string; name: string; email: string }
}

export default function ChatWindow({ otherUser, currentUserId }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/messages?otherUserId=${otherUser.id}`)
            const data = await res.json()
            if (data.messages) {
                setMessages(data.messages)
            }
        } catch (error) {
            console.error('Error fetching messages:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMessages()

        // Auto-refresh every 5 seconds
        const interval = setInterval(fetchMessages, 5000)
        return () => clearInterval(interval)
    }, [otherUser.id])

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || sending) return

        setSending(true)
        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    receiverId: otherUser.id,
                    content: newMessage.trim()
                })
            })

            if (res.ok) {
                setNewMessage('')
                await fetchMessages()
            }
        } catch (error) {
            console.error('Error sending message:', error)
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="d-flex flex-column h-100">
            {/* Header */}
            <div className="border-bottom p-3 bg-light">
                <h5 className="mb-0">{otherUser.name}</h5>
                <small className="text-muted">{otherUser.email}</small>
            </div>

            {/* Messages Area */}
            <div className="flex-grow-1 p-3 overflow-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="text-center text-muted">
                            <p className="mb-0">No hay mensajes aún</p>
                            <small>Envía el primer mensaje para comenzar la conversación</small>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((message) => (
                            <MessageBubble
                                key={message.id}
                                message={message}
                                currentUserId={currentUserId}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Area */}
            <div className="border-top p-3 bg-light">
                <form onSubmit={handleSend}>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Escribe un mensaje..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            disabled={sending}
                        />
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!newMessage.trim() || sending}
                        >
                            {sending ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                                '📤 Enviar'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
