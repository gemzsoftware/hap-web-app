'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, CheckCircle2, XCircle, FileText, Clock, CheckCheck, Trash2 } from 'lucide-react'
import { getUserNotifications, markAsRead, markAllAsRead, getUnreadCount } from '@/lib/notifications'
import { formatCurrency } from '@/lib/utils'

export default function NotificationsPanel() {
    const [notifications, setNotifications] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (userData) {
            const parsed = JSON.parse(userData)
            setUser(parsed)
            loadNotifications(parsed)
        }
    }, [])

    const loadNotifications = (currentUser) => {
        const notifs = getUserNotifications(currentUser?.email)
        setNotifications(notifs.slice(0, 20))
        setUnreadCount(getUnreadCount(currentUser?.email))
    }

    const handleMarkRead = (id) => {
        markAsRead(id)
        const userData = localStorage.getItem('user')
        if (userData) {
            loadNotifications(JSON.parse(userData))
        }
    }

    const handleMarkAllRead = () => {
        if (user) {
            markAllAsRead(user.email)
            loadNotifications(user)
        }
        setIsOpen(false)
    }

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'payment_verified': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            case 'payment_declined': return <XCircle className="w-4 h-4 text-red-400" />
            case 'document_added': return <FileText className="w-4 h-4 text-blue-400" />
            case 'payment_pending': return <Clock className="w-4 h-4 text-amber-400" />
            default: return <Bell className="w-4 h-4 text-slate-400" />
        }
    }

    const getTimeAgo = (date) => {
        const now = new Date()
        const past = new Date(date)
        const diffMs = now - past
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays < 7) return `${diffDays}d ago`
        return past.toLocaleDateString()
    }

    return (
        <div className="relative">
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-white/10 rounded-xl transition-all"
            >
                <Bell className="w-5 h-5 text-slate-400" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-12 z-50 w-80 md:w-96 bg-[#0B1220] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                                <div>
                                    <h3 className="text-sm font-bold text-white">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <p className="text-[10px] text-slate-500">{unreadCount} unread</p>
                                    )}
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-wider flex items-center gap-1"
                                    >
                                        <CheckCheck className="w-3 h-3" />
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            {/* Notification List */}
                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <Bell className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                                        <p className="text-xs text-slate-500">No notifications yet</p>
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <button
                                            key={notif.id}
                                            onClick={() => handleMarkRead(notif.id)}
                                            className={`w-full text-left px-6 py-4 border-b border-white/5 hover:bg-white/5 transition-all flex gap-3 ${
                                                !notif.read ? 'bg-emerald-500/5' : ''
                                            }`}
                                        >
                                            <div className="mt-0.5 flex-shrink-0">
                                                {getNotificationIcon(notif.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className={`text-xs font-bold ${!notif.read ? 'text-white' : 'text-slate-400'}`}>
                                                        {notif.title}
                                                    </p>
                                                    {!notif.read && (
                                                        <span className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                                                    {notif.message}
                                                </p>
                                                {notif.amount && (
                                                    <p className="text-[10px] font-bold text-emerald-400 mt-1">
                                                        {formatCurrency(notif.amount)}
                                                    </p>
                                                )}
                                                <p className="text-[9px] text-slate-600 mt-1">
                                                    {getTimeAgo(notif.createdAt)}
                                                </p>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}