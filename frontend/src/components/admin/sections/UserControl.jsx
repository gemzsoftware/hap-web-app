'use client'
import { Search, ShieldAlert, ShieldCheck, MoreVertical } from 'lucide-react'

export default function UserControl() {
    return (
        <div className="space-y-8">
            <h2 className="text-5xl font-black italic tracking-tighter">User <span className="text-slate-800 text-6xl">Intelligence</span></h2>

            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
                <div className="p-8 border-b border-white/5 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                        <input type="text" placeholder="Search by name, email, or role..." className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 outline-none focus:border-red-500 transition-all" />
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    <tr>
                        <th className="p-8">Account Name</th>
                        <th className="p-8">Verification</th>
                        <th className="p-8">Status</th>
                        <th className="p-8 text-right">Access Control</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                    <tr className="hover:bg-white/[0.01]">
                        <td className="p-8">
                            <p className="font-bold">Emeka Nwosu</p>
                            <p className="text-xs text-slate-500">emeka@gmail.com</p>
                        </td>
                        <td className="p-8"><span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full font-black uppercase tracking-widest">Verified</span></td>
                        <td className="p-8"><span className="text-[10px] bg-white/10 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest">Active</span></td>
                        <td className="p-8 text-right">
                            <button className="text-[10px] font-black uppercase text-red-500 hover:underline">Suspend Account</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}