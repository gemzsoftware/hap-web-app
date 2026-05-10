'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function CountdownTimer({ targetDate }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 })

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date()
            const target = new Date(targetDate)
            const difference = target - now

            if (difference <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0 })
                return
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / (1000 * 60)) % 60),
            })
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 60000)

        return () => clearInterval(timer)
    }, [targetDate])

    return (
        <div className="relative bg-slate-950 rounded-[2.5rem] p-8 border border-white/5 shadow-2xl overflow-hidden group">
            {/* --- TECHNICAL BACKGROUND --- */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[80px] -mr-16 -mt-16" />

            <div className="relative z-10">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-8 px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[10px] font-black text-white uppercase tracking-[0.5em]">
                            Capital Obligation Clock
                        </p>
                    </div>
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                {/* --- TIME SEGMENTS --- */}
                <div className="grid grid-cols-3 gap-4">
                    <TimeSegment label="Days" value={timeLeft.days} />
                    <TimeSegment label="Hours" value={timeLeft.hours} />
                    <TimeSegment label="Minutes" value={timeLeft.minutes} />
                </div>

                {/* Status Bar */}
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                        Status: Pending Transfer
                    </span>
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                        Next Cycle: {new Date(targetDate).toLocaleDateString('en-GB')}
                    </span>
                </div>
            </div>
        </div>
    )
}

function TimeSegment({ label, value }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center group-hover:border-emerald-500/30 transition-colors duration-500">
            <motion.p
                key={value}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-black text-white tracking-tighter"
            >
                {String(value).padStart(2, '0')}
            </motion.p>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">
                {label}
            </p>
        </div>
    )
}