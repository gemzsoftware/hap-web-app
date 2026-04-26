'use client'

import { motion } from 'framer-motion'

const testimonials = [
    {
        name: 'Mr. Adebayo O.',
        location: 'Lagos',
        text: 'I was skeptical at first, but Heaven Ark made the process seamless. Their dashboard lets me track everything with total clarity. I now own two plots of land with peace of mind.',
        rating: 5,
        tag: 'Verified Owner'
    },
    {
        name: 'Mrs. Chioma E.',
        location: 'Abuja',
        text: 'The auto-receipt feature gives me absolute confidence. Every payment is documented instantly. The customer support is professional and highly responsive.',
        rating: 5,
        tag: 'Investor'
    },
    {
        name: 'Mr. Ibrahim M.',
        location: 'Kano',
        text: 'The flexible payment plan made it possible for me to diversify my portfolio. All legal documents were delivered exactly as promised upon completion.',
        rating: 5,
        tag: 'Verified Owner'
    },
]

export default function Testimonials() {
    return (
        <section className="py-24 bg-[#FAFAFA] relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

            <div className="container-custom relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-[10px] uppercase tracking-[0.4em] font-black text-emerald-600 mb-4 block"
                    >
                        Voices of Trust
                    </motion.span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-950 font-heading tracking-tighter mb-6">
                        Client Success Stories
                    </h2>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-[1px] w-12 bg-slate-200" />
                        <p className="text-slate-500 font-medium">Real stories from real land owners</p>
                        <div className="h-[1px] w-12 bg-slate-200" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-100 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] hover:border-emerald-500/20"
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-8 right-10 text-slate-50 opacity-0 group-hover:opacity-100 group-hover:text-emerald-50 transition-all duration-500">
                                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H11.017V21H14.017ZM5.017 21L5.017 18C5.017 16.8954 5.91243 16 7.017 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H6.017C5.46472 8 5.017 8.44772 5.017 9V12C5.017 12.5523 4.5693 13 4.017 13H2.017V21H5.017Z" />
                                </svg>
                            </div>

                            {/* Ratings */}
                            <div className="flex gap-1 mb-8">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <svg key={i} className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <p className="text-lg text-slate-700 font-medium leading-relaxed mb-10 relative z-10">
                                &ldquo;{testimonial.text}&rdquo;
                            </p>

                            {/* Author Info */}
                            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                <div>
                                    <p className="font-black text-slate-950 uppercase tracking-tight">{testimonial.name}</p>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{testimonial.location}</p>
                                </div>
                                <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                    {testimonial.tag}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Stats Hint */}
                <div className="mt-20 text-center">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        Join <span className="text-emerald-500">2,500+</span> Satisfied Land Owners
                    </p>
                </div>
            </div>
        </section>
    )
}