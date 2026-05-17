'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Bell, CheckCircle2, FileText, Clock, Check, Trash2, ShieldCheck,
    Loader2, XCircle, Receipt
} from 'lucide-react'
import Link from 'next/link'
import { getUserNotifications, markAsRead, markAllAsRead } from '@/lib/notifications'
import { formatCurrency } from '@/lib/utils'

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (userData) {
            const parsed = JSON.parse(userData)
            setUser(parsed)
            loadNotifications(parsed)
        }

        const interval = setInterval(() => {
            const userData = localStorage.getItem('user')
            if (userData) loadNotifications(JSON.parse(userData))
        }, 10000)
        return () => clearInterval(interval)
    }, [])

    const loadNotifications = (currentUser) => {
        const notifs = getUserNotifications(currentUser?.email)
        setNotifications(notifs)
        setLoading(false)
    }

    const getNotificationConfig = (type) => {
        switch (type) {
            case 'payment_verified':
                return { icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' }
            case 'payment_declined':
                return { icon: <XCircle className="w-5 h-5" />, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' }
            case 'payment_pending':
                return { icon: <Clock className="w-5 h-5" />, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' }
            case 'document_added':
                return { icon: <FileText className="w-5 h-5" />, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' }
            default:
                return { icon: <Bell className="w-5 h-5" />, color: 'text-slate-400', bg: 'bg-white/5', border: 'border-white/10' }
        }
    }

    const handleMarkAllRead = () => {
        if (user) {
            markAllAsRead(user.email)
            loadNotifications(user)
        }
    }

    const handleMarkOneRead = (id) => {
        markAsRead(id)
        if (user) loadNotifications(user)
    }

    const handleDeleteNotification = (id) => {
        const stored = localStorage.getItem('notifications')
        const allNotifs = stored ? JSON.parse(stored) : []
        const updated = allNotifs.filter(n => n.id !== id)
        localStorage.setItem('notifications', JSON.stringify(updated))
        if (user) loadNotifications(user)
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

    if (loading) {
        return (
            <div className="bg-[#020617] min-h-screen flex flex-col items-center justify-center text-white">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-2" />
                <p className="text-[10px] font-black tracking-widest uppercase text-slate-500">Syncing Alert Streams...</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 space-y-10 text-left min-h-screen bg-[#020617] selection:bg-emerald-500/20">

            {/* HEADER */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Bell className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/60">Updates & Alerts</span>
                    </div>
                    <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase">
                        Notification <span className="text-emerald-900 text-5xl">Center</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        {notifications.filter(n => !n.read).length} unread • {notifications.length} total
                    </p>
                </div>

                <button
                    onClick={handleMarkAllRead}
                    disabled={notifications.filter(n => !n.read).length === 0}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:bg-emerald-500/10 transition-all disabled:opacity-40"
                >
                    <Check className="w-3 h-3" /> Mark All As Read
                </button>
            </header>

            {/* LIST */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {notifications.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-20 text-center space-y-4 bg-white/[0.02] border border-white/5 rounded-[3rem]"
                        >
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                <Bell className="w-6 h-6 text-slate-700" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">No notifications yet</p>
                            <p className="text-[9px] text-slate-700">Notifications will appear when payments are verified or documents are uploaded.</p>
                        </motion.div>
                    ) : (
                        notifications.map((notif) => {
                            const config = getNotificationConfig(notif.type)

                            return (
                                <motion.div
                                    key={notif.id}
                                    layout
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onClick={() => handleMarkOneRead(notif.id)}
                                    className={`group relative p-6 md:p-8 rounded-[2.5rem] border transition-all flex items-start gap-6 cursor-pointer ${
                                        !notif.read
                                            ? `bg-emerald-500/[0.03] border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.02)]`
                                            : 'bg-white/[0.02] border-white/5 opacity-70'
                                    }`}
                                >
                                    {/* Icon Box */}
                                    <div className={`p-4 rounded-2xl shrink-0 ${config.bg} ${config.color}`}>
                                        {config.icon}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 space-y-1 min-w-0 pl-2">
                                        <div className="flex justify-between items-center">
                                            <h3 className={`text-sm font-black uppercase tracking-tight ${!notif.read ? 'text-white' : 'text-slate-400'}`}>
                                                {notif.title}
                                            </h3>
                                            <span className="text-[10px] font-bold text-slate-600 uppercase font-mono">
                                                {getTimeAgo(notif.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-xl">
                                            {notif.message}
                                        </p>
                                        {notif.amount && (
                                            <p className="text-[10px] font-bold text-emerald-400 mt-1">
                                                {formatCurrency(notif.amount)}
                                            </p>
                                        )}
                                        {notif.receiptNumber && (
                                            <p className="text-[9px] font-mono text-slate-500 mt-1">
                                                Receipt: {notif.receiptNumber}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {(notif.type === 'payment_verified' || notif.type === 'document_added') && (
                                            <Link href="/dashboard/documents">
                                                <button className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-all">
                                                    <FileText className="w-4 h-4" />
                                                </button>
                                            </Link>
                                        )}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteNotification(notif.id); }}
                                            className="p-2.5 bg-white/5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Unread Dot */}
                                    {!notif.read && (
                                        <div className="absolute top-8 left-4 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    )}
                                </motion.div>
                            )
                        })
                    )}
                </AnimatePresence>
            </div>

            {/* QUICK ACTIONS FOOTER */}
            <footer className="pt-10 border-t border-white/5 flex justify-center">
                <p className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.3em]">
                    End of secure update stream
                </p>
            </footer>
        </div>
    )
}