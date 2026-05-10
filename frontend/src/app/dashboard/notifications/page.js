'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Bell,
    CheckCircle2,
    FileText,
    Clock,
    AlertCircle,
    Check,
    MoreHorizontal,
    Trash2,
    ShieldCheck
} from 'lucide-react'
import Link from 'next/link'

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'payment',
            title: 'Payment Confirmed',
            message: 'Your installment of ₦1,250,000 for Heaven Ark Phase 1 has been verified.',
            time: '2 mins ago',
            status: 'unread',
            icon: <CheckCircle2 className="w-5 h-5" />,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        },
        {
            id: 2,
            type: 'document',
            title: 'Document Ready',
            message: 'Your Provisional Allocation Letter is now available in the Documents folder.',
            time: '1 hour ago',
            status: 'unread',
            icon: <FileText className="w-5 h-5" />,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10'
        },
        {
            id: 3,
            type: 'process',
            title: 'Allocation Processed',
            message: 'Plot 24 has been successfully mapped to your portfolio identity.',
            time: '5 hours ago',
            status: 'read',
            icon: <ShieldCheck className="w-5 h-5" />,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/5'
        },
        {
            id: 4,
            type: 'reminder',
            title: 'Payment Reminder',
            message: 'Next installment for Heaven Ark Phase 1 is due in 5 days (May 13, 2026).',
            time: '1 day ago',
            status: 'read',
            icon: <Clock className="w-5 h-5" />,
            color: 'text-slate-400',
            bg: 'bg-white/5'
        }
    ])

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, status: 'read' })))
    }

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id))
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 space-y-10 text-left min-h-screen bg-[#020617]">

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
                </div>

                <button
                    onClick={markAllRead}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:bg-emerald-500/10 transition-all"
                >
                    <Check className="w-3 h-3" /> Mark All As Read
                </button>
            </header>

            {/* LIST */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {notifications.map((notif) => (
                        <motion.div
                            key={notif.id}
                            layout
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={`group relative p-6 md:p-8 rounded-[2.5rem] border transition-all flex items-start gap-6 ${
                                notif.status === 'unread'
                                    ? 'bg-emerald-500/[0.03] border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.02)]'
                                    : 'bg-white/[0.02] border-white/5 opacity-70'
                            }`}
                        >
                            {/* Icon Box */}
                            <div className={`p-4 rounded-2xl shrink-0 ${notif.bg} ${notif.color}`}>
                                {notif.icon}
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <h3 className={`text-sm font-black uppercase tracking-tight ${notif.status === 'unread' ? 'text-white' : 'text-slate-400'}`}>
                                        {notif.title}
                                    </h3>
                                    <span className="text-[10px] font-bold text-slate-600 uppercase">{notif.time}</span>
                                </div>
                                <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-xl">
                                    {notif.message}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {notif.type === 'document' && (
                                    <Link href="/dashboard/documents">
                                        <button className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-all">
                                            <FileText className="w-4 h-4" />
                                        </button>
                                    </Link>
                                )}
                                <button
                                    onClick={() => deleteNotification(notif.id)}
                                    className="p-2.5 bg-white/5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Unread Dot */}
                            {notif.status === 'unread' && (
                                <div className="absolute top-8 left-4 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {notifications.length === 0 && (
                    <div className="py-20 text-center space-y-4 bg-white/[0.02] border border-white/5 rounded-[3rem]">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                            <Bell className="w-6 h-6 text-slate-700" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">No new notifications</p>
                    </div>
                )}
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