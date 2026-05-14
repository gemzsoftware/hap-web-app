'use client'

import React, { useState } from 'react'
import {
    Bell,
    CreditCard,
    UserPlus,
    AlertTriangle,
    CheckCircle,
    Clock,
    Trash2
} from 'lucide-react'

export default function Notifications() {
    const [activeTab, setActiveTab] = useState('All')
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'payment',
            title: 'Payment Received',
            message: 'Amina Yusuf paid ₦3,200,000 for Heritage Extension (PUR-24048)',
            time: 'Just now',
            read: false,
            icon: <CreditCard className="w-5 h-5" />
        },
        {
            id: 2,
            type: 'system',
            title: 'System Backup Completed',
            message: 'Daily database backup was successful at 02:00 AM',
            time: '1 hour ago',
            read: true,
            icon: <CheckCircle className="w-5 h-5" />
        },
        {
            id: 3,
            type: 'user',
            title: 'New Investor Registered',
            message: 'Chidi Okoro just completed registration and verification',
            time: '3 hours ago',
            read: false,
            icon: <UserPlus className="w-5 h-5" />
        },
        {
            id: 4,
            type: 'payment',
            title: 'Overdue Installment',
            message: 'Sarah Williams has an overdue installment of ₦2.1M on PUR-24039',
            time: 'Yesterday',
            read: true,
            icon: <AlertTriangle className="w-5 h-5 text-orange-500" />
        },
    ])

    const filteredNotifications = notifications.filter(notif => {
        if (activeTab === 'All') return true
        if (activeTab === 'Payments') return notif.type === 'payment'
        if (activeTab === 'System') return notif.type === 'system'
        if (activeTab === 'Users') return notif.type === 'user'
        return true
    })

    const markAsRead = (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ))
    }

    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <div className="space-y-12 pb-40 text-left animate-in fade-in duration-700">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
                <div className="space-y-3">
                    <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">Communication Hub</p>
                    <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                        SIGNAL <span className="text-emerald-900 text-8xl">CENTER</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4 bg-white/[0.02] px-6 py-3 rounded-full border border-white/5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{unreadCount} Unread Signals</span>
                </div>
            </div>

            {/* --- TABS --- */}
            <div className="flex bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-1.5 gap-2 w-fit">
                {['All', 'Payments', 'System', 'Users'].map((tab) => (
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

            {/* --- NOTIFICATIONS LIST --- */}
            <div className="space-y-4">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notif) => (
                        <div
                            key={notif.id}
                            onClick={() => markAsRead(notif.id)}
                            className={`group bg-white/[0.01] border border-white/5 rounded-[3.5rem] p-10 flex gap-8 hover:border-emerald-500/30 transition-all cursor-pointer relative overflow-hidden ${!notif.read ? 'bg-emerald-500/[0.02]' : ''}`}
                        >
                            {/* Unread Glow */}
                            {!notif.read && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600 shadow-[4px_0_15px_rgba(16,185,129,0.5)]" />
                            )}

                            <div className={`p-4 h-fit rounded-[1.5rem] border transition-all ${!notif.read ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-white/5 border-white/5 text-slate-700'}`}>
                                {notif.icon}
                            </div>

                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className={`text-xl font-black italic uppercase tracking-tight transition-colors ${!notif.read ? 'text-white' : 'text-slate-500'}`}>
                                        {notif.title}
                                    </h3>
                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{notif.time}</span>
                                </div>
                                <p className={`text-sm font-bold leading-relaxed max-w-3xl transition-colors ${!notif.read ? 'text-slate-300' : 'text-slate-600'}`}>
                                    {notif.message}
                                </p>
                            </div>

                            <div className="flex items-center">
                                {!notif.read ? (
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
                                ) : (
                                    <CheckCircle className="w-5 h-5 text-slate-800" />
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-40">
                        <p className="text-xl font-black italic text-slate-800 uppercase tracking-tighter">No signals found in this frequency</p>
                    </div>
                )}
            </div>

            {/* --- BULK ACTIONS --- */}
            {unreadCount > 0 && (
                <div className="flex pt-8">
                    <button
                        onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                        className="px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-all active:scale-[0.98]"
                    >
                        Synchronize All as Read
                    </button>
                </div>
            )}
        </div>
    )
}