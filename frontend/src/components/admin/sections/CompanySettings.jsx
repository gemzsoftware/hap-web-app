'use client'
import { Save, Building2, MapPin, Phone, Mail, FileText } from 'lucide-react'

export default function CompanySettings() {
    return (
        <div className="max-w-4xl space-y-12">
            <h2 className="text-5xl font-black italic tracking-tighter">Branding <span className="text-slate-800 text-6xl">& Identity</span></h2>

            <div className="grid grid-cols-1 gap-8">
                <section className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                        <InputGroup label="Company Name" placeholder="Heaven Ark Real Estate" icon={Building2} />
                        <InputGroup label="Tagline" placeholder="Secure Land Acquisition" icon={FileText} />
                    </div>
                    <InputGroup label="Description" placeholder="Company mission and overview..." multiline />
                    <div className="grid grid-cols-2 gap-8">
                        <InputGroup label="Official Email" placeholder="admin@heavenark.com" icon={Mail} />
                        <InputGroup label="Support Phone" placeholder="+234..." icon={Phone} />
                    </div>
                    <InputGroup label="Office Address" placeholder="123 Estate Drive, Lagos" icon={MapPin} />

                    <button className="w-full bg-gradient-to-r from-red-600 to-orange-500 py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                        <Save className="w-4 h-4" /> Sync Company Metadata
                    </button>
                </section>
            </div>
        </div>
    )
}

function InputGroup({ label, placeholder, icon: Icon, multiline }) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">{label}</label>
            <div className="relative">
                {Icon && <Icon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />}
                {multiline ? (
                    <textarea rows="4" placeholder={placeholder} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-red-500 outline-none transition-all placeholder:text-slate-700 font-medium" />
                ) : (
                    <input type="text" placeholder={placeholder} className={`w-full bg-white/5 border border-white/10 rounded-2xl ${Icon ? 'pl-14' : 'px-6'} py-4 focus:border-red-500 outline-none transition-all placeholder:text-slate-700 font-medium`} />
                )}
            </div>
        </div>
    )
}