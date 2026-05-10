'use client'

import React, { useState } from 'react'
import {
    Search,
    Filter,
    MoreVertical,
    UserCheck,
    UserX,
    ArrowUpRight,
    Mail,
    Phone,
    ShieldCheck,
    Clock
} from 'lucide-react'
import Link from 'next/link'

export default function UserDirectory() {
    const [searchTerm, setSearchTerm] = useState('')
    const [activeMenu, setActiveMenu] = useState(null)
    const [users, setUsers] = useState([
        { id: 'ARK-001', name: 'Chidi Okoro', email: 'chidi@ark.com', phone: '+234 803 000 1111', role: 'Premium Investor', status: 'Active', joined: '12 May 2026' },
        { id: 'ARK-002', name: 'Amina Yusuf', email: 'amina@ark.com', phone: '+234 805 222 3333', role: 'Standard Investor', status: 'Suspended', joined: '05 May 2026' },
        { id: 'ARK-003', name: 'Sarah Williams', email: 'sarah@ark.com', phone: '+234 701 444 5555', role: 'Premium Investor', status: 'Active', joined: '01 May 2026' },
    ])

    const toggleUserStatus = (id) => {
        setUsers(users.map(u =>
            u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u
        ))
        setActiveMenu(null)
    }

    return (
        <div className="space-y-12 pb-20 text-left">

            {/* HEADER */}
            <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-[3px] text-emerald-500">Identity Management</p>
                <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter text-white uppercase">
                    INVESTOR <span className="text-emerald-600">REGISTRY</span>
                </h1>
                <p className="text-slate-400">Manage and monitor all platform investors</p>
            </div>

            {/* SEARCH & FILTERS */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        placeholder="Search by name, email or Ark-ID..."
                        className="w-full bg-white/[0.03] border border-white/10 rounded-3xl py-5 pl-16 pr-8 text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="px-8 py-5 bg-white/[0.03] border border-white/10 rounded-3xl text-sm font-semibold uppercase tracking-widest text-slate-400 hover:text-white hover:border-white/30 transition-all flex items-center gap-3 whitespace-nowrap">
                    <Filter className="w-4 h-4" /> Filter
                </button>
            </div>

            {/* USERS TABLE */}
            <div className="bg-white/[0.02] border border-white/10 rounded-[2.75rem] shadow-2xl overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="border-b border-white/10">
                        <th className="px-10 py-8 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Investor</th>
                        <th className="px-8 py-8 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Contact</th>
                        <th className="px-8 py-8 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Tier & Status</th>
                        <th className="px-10 py-8 text-right text-xs font-bold uppercase tracking-widest text-slate-500">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                    {users.map((user) => (
                        <tr key={user.id} className="group hover:bg-white/[0.03] transition-all duration-300">
                            <td className="px-10 py-8">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-900 to-emerald-950 border border-emerald-500/30 flex items-center justify-center font-black text-2xl text-emerald-400 shadow-inner">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-white tracking-tight">{user.name}</h4>
                                        <p className="text-xs font-mono text-slate-500 mt-1">{user.id}</p>
                                    </div>
                                </div>
                            </td>

                            <td className="px-8 py-8">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <Mail className="w-4 h-4 text-emerald-500" />
                                        <span className="text-sm">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <Phone className="w-4 h-4" />
                                        <span className="text-sm">{user.phone}</span>
                                    </div>
                                </div>
                            </td>

                            <td className="px-8 py-8">
                                <p className="text-sm font-semibold text-white mb-2">{user.role}</p>
                                <span className={`inline-block px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest border ${
                                    user.status === 'Active'
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                        : 'bg-red-500/10 text-red-400 border-red-500/30'
                                }`}>
                                        {user.status}
                                    </span>
                            </td>

                            <td className="px-10 py-8 text-right">
                                <div className="flex items-center justify-end gap-3">
                                    <Link href={`/admin/users/${user.id}`}>
                                        <button className="p-4 bg-white/5 hover:bg-emerald-600 rounded-2xl text-slate-400 hover:text-white transition-all">
                                            <ArrowUpRight className="w-5 h-5" />
                                        </button>
                                    </Link>

                                    <button
                                        onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                                        className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"
                                    >
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Action Menu */}
                                {activeMenu === user.id && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />
                                        <div className="absolute right-8 top-20 z-50 w-72 bg-[#0A0F1C] border border-white/10 rounded-3xl shadow-2xl py-5 backdrop-blur-3xl">
                                            <div className="px-8 py-3 text-xs font-bold uppercase tracking-widest text-slate-500">Account Control</div>

                                            <button
                                                onClick={() => toggleUserStatus(user.id)}
                                                className="w-full flex items-center gap-4 px-8 py-4 text-sm hover:bg-white/5 transition-all text-slate-300 hover:text-white"
                                            >
                                                {user.status === 'Active' ? (
                                                    <><UserX className="w-4 h-4 text-red-500" /> Suspend Account</>
                                                ) : (
                                                    <><UserCheck className="w-4 h-4 text-emerald-500" /> Activate Account</>
                                                )}
                                            </button>

                                            <div className="h-px bg-white/10 mx-6 my-2" />

                                            <button className="w-full flex items-center gap-4 px-8 py-4 text-sm hover:bg-white/5 transition-all text-slate-300 hover:text-white">
                                                <Clock className="w-4 h-4" /> Reset Password
                                            </button>
                                        </div>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}