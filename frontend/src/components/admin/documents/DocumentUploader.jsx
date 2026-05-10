'use client'
import { useState } from 'react'
import { UploadCloud, FileText, CheckCircle } from 'lucide-react'

export default function DocumentUploader() {
    const [file, setFile] = useState(null)

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10">
                <h3 className="text-2xl font-bold mb-8">Document Issuance Terminal</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Select Investor</label>
                        <select className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-emerald-500 transition-all">
                            <option className="bg-[#020617]">Search Purchase ID / Name...</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Document Type</label>
                        <select className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-emerald-500 transition-all text-white">
                            <option className="bg-[#020617]">Deed of Assignment</option>
                            <option className="bg-[#020617]">Contract of Sale</option>
                            <option className="bg-[#020617]">Allocation Letter</option>
                        </select>
                    </div>
                </div>

                {/* DROPZONE */}
                <div className="border-2 border-dashed border-white/10 rounded-[2rem] p-20 flex flex-col items-center justify-center bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer">
                    <UploadCloud className="w-12 h-12 text-slate-600 mb-4" />
                    <p className="text-slate-400 font-medium">Drag legal PDF here or click to browse</p>
                </div>

                <button className="w-full mt-8 bg-emerald-600 hover:bg-emerald-500 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-emerald-600/20">
                    Encrypt & Push to User Vault
                </button>
            </div>
        </div>
    )
}