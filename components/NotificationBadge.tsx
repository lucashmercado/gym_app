'use client'

import { useEffect, useState } from 'react'

export default function NotificationBadge() {
    const [notifications, setNotifications] = useState<any[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [showDropdown, setShowDropdown] = useState(false)

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications')
            const data = await res.json()
            setNotifications(data.notifications || [])
            setUnreadCount(data.unreadCount || 0)
        } catch (error) {
            console.error('Error fetching notifications:', error)
        }
    }

    useEffect(() => {
        fetchNotifications()
        // Poll every 60 seconds
        const interval = setInterval(fetchNotifications, 60000)
        return () => clearInterval(interval)
    }, [])

    const markAsRead = async (notificationId?: string) => {
        try {
            await fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationId })
            })
            fetchNotifications()
        } catch (error) {
            console.error('Error marking notification as read:', error)
        }
    }

    const markAllAsRead = () => {
        markAsRead()
        setShowDropdown(false)
    }

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'MEMBERSHIP_EXPIRING':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-triangle text-warning" viewBox="0 0 16 16">
                        <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" />
                        <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                    </svg>
                )
            case 'NEW_PLAN_ASSIGNED':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard-check text-success" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z" />
                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z" />
                    </svg>
                )
            default:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle text-info" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533z" />
                        <path d="M9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                    </svg>
                )
        }
    }

    return (
        <div className="dropdown">
            <button
                className="btn btn-outline-light btn-sm position-relative"
                onClick={() => setShowDropdown(!showDropdown)}
                title="Notificaciones"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16">
                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
                </svg>
                {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="dropdown-menu dropdown-menu-end show" style={{ minWidth: '350px', maxHeight: '400px', overflowY: 'auto' }}>
                    <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
                        <h6 className="mb-0">Notificaciones</h6>
                        {unreadCount > 0 && (
                            <button
                                className="btn btn-link btn-sm text-decoration-none p-0"
                                onClick={markAllAsRead}
                            >
                                Marcar todas como leídas
                            </button>
                        )}
                    </div>

                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`dropdown-item ${!notif.read ? 'bg-light' : ''}`}
                                onClick={() => !notif.read && markAsRead(notif.id)}
                                style={{ cursor: 'pointer', whiteSpace: 'normal' }}
                            >
                                <div className="d-flex align-items-start">
                                    <div className="me-2 mt-1">
                                        {getNotificationIcon(notif.type)}
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="fw-bold">{notif.title}</div>
                                        <div className="small text-muted">{notif.message}</div>
                                        <div className="small text-muted mt-1">
                                            {new Date(notif.createdAt).toLocaleDateString('es-ES', {
                                                day: 'numeric',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                    {!notif.read && (
                                        <span className="badge bg-primary rounded-circle" style={{ width: '8px', height: '8px', padding: 0 }}></span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="dropdown-item text-center text-muted py-4">
                            No tienes notificaciones
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
