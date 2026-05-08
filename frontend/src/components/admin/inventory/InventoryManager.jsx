'use client'
import { Plus, MapPin, Trash2 } from 'lucide-react'

export default function InventoryManager() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold italic">Property Assets</h2>
                <button className="bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all">
                    <Plus className="w-4 h-4" /> Add New Land
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Mock Card - Repeat this with a .map() later */}
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 group">
                    <div className="h-40 bg-slate-800 rounded-2xl mb-4 overflow-hidden">
                        <div className="w-full h-full bg-emerald-500/10 flex items-center justify-center">
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Asset Image Preview</span>
                        </div>
                    </div>
                    <h3 className="font-bold text-xl mb-1">Heaven Ark Phase 1</h3>
                    <div className="flex items-center gap-2 text-slate-500 mb-6">
                        <MapPin className="w-3 h-3" />
                        <span className="text-[9px] uppercase font-black tracking-widest">Epe, Lagos</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                        <p className="font-bold text-emerald-500">₦2,500,000</p>
                        <button className="p-2 text-slate-600 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>
        </div>
    )
}