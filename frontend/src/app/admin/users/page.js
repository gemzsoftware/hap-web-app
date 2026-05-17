'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users, ArrowRight, Search, Loader2, ShieldCheck, CreditCard, Map, Wallet } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function AdminUsersDirectoryPage() {
    const router = useRouter()
    const [users, setUsers] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const [userStats, setUserStats] = useState({})

    useEffect(() => {
        fetchSystemUsers()
    }, [])

    const fetchSystemUsers = async () => {
        // First try backend
        const token = localStorage.getItem('token')
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

        let allUsers = []

        try {
            const res = await fetch(`${apiUrl}/admin/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (res.ok) {
                const data = await res.json()
                const extractedUsers = data.users || data.data || (Array.isArray(data) ? data : [])
                if (extractedUsers.length > 0) {
                    allUsers = extractedUsers
                }
            }
        } catch (err) {
            console.log('Backend users not available, using local data')
        }

        // If backend returned nothing, use localStorage
        if (allUsers.length === 0) {
            // Get registered users from localStorage
            const storedUsers = localStorage.getItem('registeredUsers')
            const localUsers = storedUsers ? JSON.parse(storedUsers) : []

            // Default demo users if nothing exists
            if (localUsers.length === 0) {
                localUsers.push(
                    {
                        _id: 'admin_001',
                        id: 'admin_001',
                        fullName: 'Admin User',
                        email: 'admin@heavenark.test',
                        role: 'admin',
                        status: 'active'
                    },
                    {
                        _id: 'investor_001',
                        id: 'investor_001',
                        fullName: 'Demo Investor',
                        email: 'investor@heavenark.test',
                        role: 'investor',
                        status: 'active'
                    }
                )
            }

            allUsers = localUsers
        }

        // Calculate stats for each user
        const stats = {}
        const storedPayments = localStorage.getItem('payments')
        const storedPurchases = localStorage.getItem('purchases')
        const allPayments = storedPayments ? JSON.parse(storedPayments) : []
        const allPurchases = storedPurchases ? JSON.parse(storedPurchases) : []

        allUsers.forEach(user => {
            const userEmail = user.email
            const userPayments = allPayments.filter(p => p.buyerEmail === userEmail)
            const userPurchases = allPurchases.filter(p => p.buyerEmail === userEmail)
            const verifiedTotal = userPayments
                .filter(p => p.status === 'verified')
                .reduce((sum, p) => sum + (Number(p.amountPaid) || Number(p.amount) || 0), 0)
            const pendingTotal = userPayments
                .filter(p => p.status === 'pending')
                .reduce((sum, p) => sum + (Number(p.amountPaid) || Number(p.amount) || 0), 0)

            stats[userEmail] = {
                totalPayments: userPayments.length,
                totalPurchases: userPurchases.length,
                verifiedAmount: verifiedTotal,
                pendingAmount: pendingTotal,
                activeContracts: userPurchases.filter(p => Number(p.remainingBalance) > 0 && p.status !== 'declined').length,
                completedContracts: userPurchases.filter(p => Number(p.remainingBalance) <= 0 || p.status === 'completed').length
            }
        })

        setUserStats(stats)
        setUsers(allUsers)
        setLoading(false)
    }

    const filteredUsers = users.filter(user => {
        const name = (user.fullName || user.name || '').toLowerCase()
        const email = (user.email || '').toLowerCase()
        const query = searchQuery.toLowerCase()
        return name.includes(query) || email.includes(query)
    })

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-red-500/10 text-red-400 border-red-500/20'
            case 'staff':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            case 'investor':
            case 'user':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            default:
                return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
        }
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            case 'suspended':
                return 'bg-red-500/10 text-red-400 border-red-500/20'
            case 'pending_verification':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            default:
                return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
        }
    }

    if (loading) {
        return (
            <div className="bg-[#020617] min-h-screen flex flex-col items-center justify-center text-white">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-2" />
                <p className="text-[10px] font-black tracking-widest uppercase text-slate-500">Reading Investor Directory...</p>
            </div>
        )
    }

    return (
        <div className="space-y-12 pb-24 text-left animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">User Management</p>
                    <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter text-white uppercase leading-none">
                        INVESTOR <span className="text-emerald-900 text-8xl">LEDGER</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-bold italic">{users.length} Registered Users</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-2">Total Users</p>
                    <p className="text-2xl font-black text-white">{users.length}</p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-2">Active Investors</p>
                    <p className="text-2xl font-black text-emerald-400">
                        {users.filter(u => u.status === 'active' && (u.role === 'investor' || u.role === 'user')).length}
                    </p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-2">Total Revenue</p>
                    <p className="text-2xl font-black text-emerald-400">
                        {formatCurrency(Object.values(userStats).reduce((sum, s) => sum + (s.verifiedAmount || 0), 0))}
                    </p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-2">Active Contracts</p>
                    <p className="text-2xl font-black text-blue-400">
                        {Object.values(userStats).reduce((sum, s) => sum + (s.activeContracts || 0), 0)}
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="relative flex items-center w-full md:w-96">
                <Search className="absolute left-4 w-4 h-4 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-xs font-bold text-white outline-none focus:border-emerald-500 placeholder-slate-500 transition-colors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Users Table */}
            <div className="bg-white/[0.01] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
                <table className="w-full text-left text-xs border-collapse font-medium">
                    <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-slate-400 uppercase font-bold tracking-wider">
                        <th className="p-5">User Profile</th>
                        <th className="p-5 hidden md:table-cell">Email</th>
                        <th className="p-5 hidden lg:table-cell">Role</th>
                        <th className="p-5">Status</th>
                        <th className="p-5 hidden lg:table-cell">Payments</th>
                        <th className="p-5 hidden lg:table-cell">Contracts</th>
                        <th className="p-5 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="p-10 text-center text-slate-500">
                                No users found matching your search.
                            </td>
                        </tr>
                    ) : (
                        filteredUsers.map((user) => {
                            const stats = userStats[user.email] || {}
                            return (
                                <tr
                                    key={user._id || user.id}
                                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                                >
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black">
                                                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                                                    {user.fullName || user.name || 'Unknown'}
                                                </p>
                                                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                                                    ID: {(user._id || user.id || '').substring(0, 8)}...
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5 text-slate-300 font-mono text-xs hidden md:table-cell">
                                        {user.email}
                                    </td>
                                    <td className="p-5 hidden lg:table-cell">
                                        <span className={`px-2.5 py-1 rounded-md uppercase font-black text-[9px] tracking-wider border ${getRoleBadge(user.role)}`}>
                                            {user.role || 'user'}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <span className={`px-2.5 py-1 rounded-md font-bold uppercase tracking-wider text-[9px] border ${getStatusBadge(user.status)}`}>
                                            {user.status || 'active'}
                                        </span>
                                    </td>
                                    <td className="p-5 hidden lg:table-cell">
                                        <div>
                                            <p className="text-sm font-bold text-white">
                                                {formatCurrency(stats.verifiedAmount || 0)}
                                            </p>
                                            {stats.pendingAmount > 0 && (
                                                <p className="text-[9px] text-amber-400 mt-0.5">
                                                    {formatCurrency(stats.pendingAmount)} pending
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-5 hidden lg:table-cell">
                                        <p className="text-sm text-white">
                                            {stats.activeContracts || 0} active
                                            {stats.completedContracts > 0 && (
                                                <span className="text-emerald-400"> • {stats.completedContracts} completed</span>
                                            )}
                                        </p>
                                    </td>
                                    <td className="p-5 text-right">
                                        <button
                                            onClick={() => router.push(`/admin/users/${user._id || user.id}`)}
                                            className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-400 tracking-widest bg-emerald-500/5 hover:bg-emerald-500 hover:text-white border border-emerald-500/10 px-3 py-2 rounded-xl transition-all"
                                        >
                                            Manage <ArrowRight className="w-3.5 h-3.5" />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}