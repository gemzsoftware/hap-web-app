'use client'

import { User, Phone, Users, ShieldCheck, Save } from 'lucide-react'

export default function SettingsTab() {
    return (
        <div className="max-w-5xl space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* ACCOUNT IDENTITY */}
                <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                            <User className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold italic">Identity Profile</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-2">Full Legal Name</label>
                            <input
                                type="text"
                                placeholder="As it appears on ID"
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700 font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-2">Phone (SMS Alerts)</label>
                            <input
                                type="text"
                                placeholder="+234..."
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700 font-medium"
                            />
                        </div>
                    </div>
                </section>

                {/* NEXT OF KIN */}
                <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10">
                    <div className="flex items-center gap-4 mb-10 text-blue-400">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold italic text-white">Next of Kin</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-2">Beneficiary Name</label>
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700 font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-2">Relationship</label>
                            <input
                                type="text"
                                placeholder="e.g. Spouse"
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700 font-medium"
                            />
                        </div>
                    </div>
                </section>
            </div>

            {/* SAVE ACTION BOX */}
            <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <ShieldCheck className="text-emerald-500 w-10 h-10" />
                    <div>
                        <p className="text-xl font-bold">Secure Update</p>
                        <p className="text-slate-400 text-sm">Update your node's metadata. This will be used for future deeds.</p>
                    </div>
                </div>
                <button className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-600/20 transition-all text-white">
                    Update Profile
                </button>
            </div>
        </div>
    )
}