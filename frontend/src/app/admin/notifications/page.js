'use client'

import React, { useState, useEffect } from 'react'
import {
    Bell, CreditCard, UserPlus, AlertTriangle, CheckCircle,
    Clock, Trash2, FileText, XCircle, Loader2
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function Notifications() {
    const [activeTab, setActiveTab] = useState('All')
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadNotifications()

        const interval = setInterval(loadNotifications, 10000)
        return () => clearInterval(interval)
    }, [])

    const loadNotifications = () => {
        const stored = localStorage.getItem('notifications')
        const allNotifs = stored ? JSON.parse(stored) : []

        // Format notifications with icons
        const formatted = allNotifs.map(n => ({
            ...n,
            icon: getNotificationIcon(n.type),
            displayTitle: n.title || getNotificationTitle(n.type)
        }))

        setNotifications(formatted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
        setLoading(false)
    }

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'payment_verified': return <CheckCircle className="w-5 h-5 text-emerald-500" />
            case 'payment_declined': return <XCircle className="w-5 h-5 text-red-500" />
            case 'payment_pending': return <CreditCard className="w-5 h-5 text-amber-500" />
            case 'document_added': return <FileText className="w-5 h-5 text-blue-500" />
            case 'user_registered': return <UserPlus className="w-5 h-5 text-purple-500" />
            default: return <Bell className="w-5 h-5 text-slate-500" />
        }
    }

    const getNotificationTitle = (type) => {
        switch (type) {
            case 'payment_verified': return 'Payment Verified'
            case 'payment_declined': return 'Payment Declined'
            case 'payment_pending': return 'Payment Submitted'
            case 'document_added': return 'Document Added'
            default: return 'Notification'
        }
    }

    const getNotificationTypeCategory = (type) => {
        if (type?.includes('payment')) return 'Payments'
        if (type?.includes('document')) return 'Documents'
        if (type?.includes('user')) return 'Users'
        return 'System'
    }

    const filteredNotifications = notifications.filter(notif => {
        if (activeTab === 'All') return true
        if (activeTab === 'Payments') return getNotificationTypeCategory(notif.type) === 'Payments'
        if (activeTab === 'Documents') return getNotificationTypeCategory(notif.type) === 'Documents'
        if (activeTab === 'Users') return getNotificationTypeCategory(notif.type) === 'Users'
        return true
    })

    const markAsRead = (id) => {
        const stored = localStorage.getItem('notifications')
        const allNotifs = stored ? JSON.parse(stored) : []
        const updated = allNotifs.map(n =>
            n.id === id ? { ...n, read: true } : n
        )
        localStorage.setItem('notifications', JSON.stringify(updated))
        loadNotifications()
    }

    const markAllAsRead = () => {
        const stored = localStorage.getItem('notifications')
        const allNotifs = stored ? JSON.parse(stored) : []
        const updated = allNotifs.map(n => ({ ...n, read: true }))
        localStorage.setItem('notifications', JSON.stringify(updated))
        loadNotifications()
    }

    const deleteNotification = (id) => {
        const stored = localStorage.getItem('notifications')
        const allNotifs = stored ? JSON.parse(stored) : []
        const updated = allNotifs.filter(n => n.id !== id)
        localStorage.setItem('notifications', JSON.stringify(updated))
        loadNotifications()
    }

    const deleteAllRead = () => {
        const stored = localStorage.getItem('notifications')
        const allNotifs = stored ? JSON.parse(stored) : []
        const updated = allNotifs.filter(n => !n.read)
        localStorage.setItem('notifications', JSON.stringify(updated))
        loadNotifications()
    }

    const getTimeAgo = (date) => {
        const now = new Date()
        const past = new Date(date)
        const diffMins = Math.floor((now - past) / 60000)
        const diffHours = Math.floor((now - past) / 3600000)
        const diffDays = Math.floor((now - past) / 86400000)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays < 7) return `${diffDays}d ago`
        return past.toLocaleDateString()
    }

    const unreadCount = notifications.filter(n => !n.read).length

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-12 pb-40 text-left animate-in fade-in duration-700">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
                <div className="space-y-3">
                    <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">Communication Hub</p>
                    <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                        SIGNAL <span className="text-emerald-900 text-8xl">CENTER</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-bold italic">{notifications.length} Total Signals</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4 bg-white/[0.02] px-6 py-3 rounded-full border border-white/5">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{unreadCount} Unread</span>
                    </div>
                    {notifications.length > 0 && (
                        <button
                            onClick={deleteAllRead}
                            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-4 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest text-red-400 transition-all"
                        >
                            <Trash2 className="w-3 h-3" /> Clear Read
                        </button>
                    )}
                </div>
            </div>

            {/* TABS */}
            <div className="flex bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-1.5 gap-2 w-fit flex-wrap">
                {['All', 'Payments', 'Documents', 'Users'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                            activeTab === tab
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                                : 'text-slate-600 hover:text-white'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* NOTIFICATIONS LIST */}
            {filteredNotifications.length === 0 ? (
                <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-[3.5rem]">
                    <Bell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-xl font-black italic text-slate-500 uppercase tracking-tighter">No signals found</p>
                    <p className="text-slate-600 text-xs mt-2">Notifications will appear when users make payments or documents are uploaded.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredNotifications.map((notif) => (
                        <div
                            key={notif.id}
                            onClick={() => markAsRead(notif.id)}
                            className={`group bg-white/[0.01] border border-white/5 rounded-[3.5rem] p-10 flex gap-8 hover:border-emerald-500/30 transition-all cursor-pointer relative overflow-hidden ${!notif.read ? 'bg-emerald-500/[0.02]' : ''}`}
                        >
                            {/* Unread indicator */}
                            {!notif.read && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600 shadow-[4px_0_15px_rgba(16,185,129,0.5)]" />
                            )}

                            <div className={`p-4 h-fit rounded-[1.5rem] border transition-all ${!notif.read ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/5'}`}>
                                {notif.icon || <Bell className="w-5 h-5" />}
                            </div>

                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <h3 className={`text-xl font-black italic uppercase tracking-tight transition-colors ${!notif.read ? 'text-white' : 'text-slate-500'}`}>
                                            {notif.displayTitle || notif.title}
                                        </h3>
                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                            notif.type?.includes('verified') ? 'bg-emerald-500/10 text-emerald-400' :
                                                notif.type?.includes('declined') ? 'bg-red-500/10 text-red-400' :
                                                    notif.type?.includes('pending') ? 'bg-amber-500/10 text-amber-400' :
                                                        'bg-blue-500/10 text-blue-400'
                                        }`}>
                                            {notif.type?.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{getTimeAgo(notif.createdAt)}</span>
                                </div>
                                <p className={`text-sm font-bold leading-relaxed max-w-3xl transition-colors ${!notif.read ? 'text-slate-300' : 'text-slate-600'}`}>
                                    {notif.message}
                                </p>
                                {notif.userEmail && (
                                    <p className="text-[10px] text-slate-500 font-mono">User: {notif.userEmail}</p>
                                )}
                                {notif.amount && (
                                    <p className="text-xs font-bold text-emerald-400">{formatCurrency(notif.amount)}</p>
                                )}
                                {notif.receiptNumber && (
                                    <p className="text-[10px] text-slate-500 font-mono">Receipt: {notif.receiptNumber}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                                    className="p-2 hover:bg-red-500/10 rounded-xl text-slate-600 hover:text-red-400 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                {!notif.read ? (
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
                                ) : (
                                    <CheckCircle className="w-5 h-5 text-slate-800" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* BULK ACTIONS */}
            {unreadCount > 0 && (
                <div className="flex pt-8 gap-4">
                    <button
                        onClick={markAllAsRead}
                        className="px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-all active:scale-[0.98]"
                    >
                        Synchronize All as Read
                    </button>
                </div>
            )}
        </div>
    )
}