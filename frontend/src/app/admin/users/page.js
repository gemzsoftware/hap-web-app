'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Users, ArrowRight, Search, Loader2, UserPlus, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatCurrency } from '@/lib/utils'

export default function AdminUsersDirectoryPage() {
    const router = useRouter()
    const [users, setUsers] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const [userStats, setUserStats] = useState({})
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: null, userName: '', userEmail: '' })

    useEffect(() => {
        fetchSystemUsers()
    }, [])

    const fetchSystemUsers = async () => {
        const token = localStorage.getItem('token')
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

        let backendUsers = []
        let mergedUsers = []

        try {
            const res = await fetch(`${apiUrl}/admin/users`, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            })
            if (res.ok) {
                const data = await res.json()
                backendUsers = data.users || data.data || (Array.isArray(data) ? data : [])
            }
        } catch (err) { console.log('Backend unavailable') }

        const storedUsers = localStorage.getItem('registeredUsers')
        const localUsers = storedUsers ? JSON.parse(storedUsers) : []

        mergedUsers.push(...backendUsers)
        localUsers.forEach((localUser) => {
            const exists = backendUsers.some((backendUser) => backendUser.email?.toLowerCase() === localUser.email?.toLowerCase())
            if (!exists) mergedUsers.push(localUser)
        })

        if (mergedUsers.length === 0) {
            mergedUsers.push({ _id: 'investor_001', fullName: 'Demo Investor', email: 'investor@heavenark.test', role: 'investor', status: 'active' })
        }

        mergedUsers = mergedUsers.filter((u) => u.role !== 'admin')

        const storedPayments = localStorage.getItem('payments')
        const allPayments = storedPayments ? JSON.parse(storedPayments) : []

        const storedPurchases = localStorage.getItem('purchases')
        const allPurchases = storedPurchases ? JSON.parse(storedPurchases) : []

        const stats = {}
        mergedUsers.forEach((user) => {
            const userEmail = user.email || user?.user?.email || user?.data?.email
            const userPayments = allPayments.filter((p) => p.buyerEmail === userEmail || p.userEmail === userEmail)
            const userPurchases = allPurchases.filter((p) => p.buyerEmail === userEmail || p.userEmail === userEmail)
            const verifiedTotal = userPayments.filter((p) => p.status === 'verified').reduce((sum, p) => sum + (Number(p.amountPaid) || Number(p.amount) || 0), 0)
            const pendingTotal = userPayments.filter((p) => p.status === 'pending').reduce((sum, p) => sum + (Number(p.amountPaid) || Number(p.amount) || 0), 0)
            stats[userEmail] = {
                totalPayments: userPayments.length,
                totalPurchases: userPurchases.length,
                verifiedAmount: verifiedTotal,
                pendingAmount: pendingTotal,
                activeContracts: userPurchases.filter((p) => Number(p.remainingBalance) > 0).length,
                completedContracts: userPurchases.filter((p) => Number(p.remainingBalance) <= 0).length
            }
        })

        setUserStats(stats)
        setUsers(mergedUsers)
        setLoading(false)
    }

    const handleDeleteUser = () => {
        // Only delete from localStorage
        const storedUsers = localStorage.getItem('registeredUsers')
        const allUsers = storedUsers ? JSON.parse(storedUsers) : []

        const updatedUsers = allUsers.filter((u) => {
            const idMatch = u._id === deleteModal.userId || u.id === deleteModal.userId
            const emailMatch = u.email?.toLowerCase() === deleteModal.userEmail?.toLowerCase()
            return !idMatch && !emailMatch
        })

        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers))

        // Remove their payments and purchases
        const email = deleteModal.userEmail
        if (email) {
            ['payments', 'purchases'].forEach(key => {
                const stored = localStorage.getItem(key)
                if (stored) {
                    const items = JSON.parse(stored)
                    const filtered = items.filter(p => p.buyerEmail?.toLowerCase() !== email.toLowerCase())
                    localStorage.setItem(key, JSON.stringify(filtered))
                }
            })
        }

        setDeleteModal({ isOpen: false, userId: null, userName: '', userEmail: '' })
        fetchSystemUsers()
    }

    const filteredUsers = users.filter((user) => {
        const userName = (user.fullName || user.name || user?.user?.fullName || user?.data?.fullName || '').toLowerCase()
        const userEmail = (user.email || user?.user?.email || user?.data?.email || '').toLowerCase()
        const query = searchQuery.toLowerCase()
        return userName.includes(query) || userEmail.includes(query)
    })

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            case 'suspended': return 'bg-red-500/10 text-red-400 border-red-500/20'
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
        }
    }

    if (loading) {
        return (
            <div className="bg-[#020617] min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-12 pb-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">User Management</p>
                    <h1 className="text-6xl font-black italic text-white">INVESTOR <span className="text-emerald-900">LEDGER</span></h1>
                </div>
                <Link href="/admin/users/create" className="flex items-center gap-2 px-8 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">
                    <UserPlus className="w-4 h-4" />Create User
                </Link>
            </div>

            <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="text" placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-xs text-white outline-none" />
            </div>

            <div className="bg-white/[0.01] border border-white/5 rounded-[3rem] overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                    <tr className="border-b border-white/5 text-slate-400 text-xs uppercase">
                        <th className="p-5">User</th>
                        <th className="p-5 hidden md:table-cell">Email</th>
                        <th className="p-5">Status</th>
                        <th className="p-5 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.map((user) => {
                        const userId = user._id || user.id || user.userId || user.uuid || user?.data?.id || user?.data?._id || user?.user?.id || user?.user?._id || user.email
                        const userName = user.fullName || user.name || user?.user?.fullName || user?.data?.fullName || 'Unknown User'
                        const userEmail = user.email || user?.user?.email || user?.data?.email || 'No Email'
                        const userStatus = user.status || 'active'

                        return (
                            <tr key={userId} className="border-b border-white/5 hover:bg-white/[0.02]">
                                <td className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black">{userName.charAt(0).toUpperCase()}</div>
                                        <div>
                                            <p className="font-bold text-white text-sm">{userName}</p>
                                            <p className="text-[10px] text-slate-500 font-mono">ID: {String(userId).substring(0, 8)}...</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-5 text-slate-300 hidden md:table-cell">{userEmail}</td>
                                <td className="p-5"><span className={`px-2 py-1 rounded-md text-[9px] border uppercase font-bold ${getStatusBadge(userStatus)}`}>{userStatus}</span></td>
                                <td className="p-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => router.push(`/admin/users/${userId}`)} className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500 hover:text-white px-3 py-2 rounded-xl transition-all">Manage<ArrowRight className="w-3.5 h-3.5" /></button>
                                        <button onClick={() => setDeleteModal({ isOpen: true, userId: userId, userName: userName, userEmail: userEmail })} className="p-2 bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white rounded-xl transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {deleteModal.isOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteModal({ isOpen: false, userId: null, userName: '', userEmail: '' })} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]" />
                        <div className="fixed inset-0 flex items-center justify-center p-4 z-[201] pointer-events-none">
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-[#0B1220] border border-red-500/20 max-w-md w-full rounded-[2.5rem] p-8 text-center space-y-6 shadow-2xl pointer-events-auto">
                                <div className="w-14 h-14 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full flex items-center justify-center mx-auto"><Trash2 className="w-6 h-6" /></div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black tracking-tight text-white">Delete User</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed px-4">Are you sure you want to delete &quot;{deleteModal.userName}&quot;? This also removes their payments and purchases.</p>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button onClick={() => setDeleteModal({ isOpen: false, userId: null, userName: '', userEmail: '' })} className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 font-bold uppercase tracking-widest text-[10px] py-4 rounded-xl border border-white/5 transition-all">Cancel</button>
                                    <button onClick={handleDeleteUser} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-xl transition-all">Delete</button>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}