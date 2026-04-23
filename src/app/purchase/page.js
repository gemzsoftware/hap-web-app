import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

const Footer = () => (
    <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-4">Heaven Ark Properties</h3>
                    <p className="text-gray-400">Your gateway to exceptional land investments.</p>
                </div>
                <div>
                    <h4 className="font-semibold mb-4">Contact Us</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li className="flex items-center gap-2">
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                           <span>Lekki, Lagos, Nigeria</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            <a href="mailto:info@heavenark.com" className="hover:text-white">info@heavenark.com</a>
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            <a href="tel:+2348012345678" className="hover:text-white">+234 801 234 5678</a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-4">Quick Links</h4>
                     <ul className="space-y-2">
                        <li><a href="#" className="text-gray-400 hover:text-white">Properties</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold mb-4">Newsletter</h4>
                    <p className="text-gray-400 mb-4">Get the latest listings and news.</p>
                    <div className="flex">
                        <input type="email" placeholder="Your email" className="bg-gray-700 text-white px-4 py-2 rounded-l-md focus:outline-none w-full" />
                        <button className="bg-[#800000] px-4 py-2 rounded-r-md hover:bg-[#660000]">Go</button>
                    </div>
                </div>
            </div>
            <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-500">
                <p>&copy; 2025 Heaven Ark Properties. All Rights Reserved.</p>
            </div>
        </div>
    </footer>
);


const FormInput = ({ id, label, type, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <input
            type={type}
            id={id}
            name={id}
            placeholder={placeholder}
            className="w-full px-4 py-2 bg-gray-100 border-transparent rounded-md focus:ring-2 focus:ring-[#800000] focus:border-transparent transition"
            required
        />
    </div>
);

const FormSelect = ({ id, label, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <select
            id={id}
            name={id}
            className="w-full px-4 py-2 bg-gray-100 border-transparent rounded-md focus:ring-2 focus:ring-[#800000] focus:border-transparent transition"
            required
        >
            {children}
        </select>
    </div>
);

const FormTextarea = ({ id, label, placeholder, rows = 4 }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <textarea
            id={id}
            name={id}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-4 py-2 bg-gray-100 border-transparent rounded-md focus:ring-2 focus:ring-[#800000] focus:border-transparent transition"
            required
        ></textarea>
    </div>
);

export default function PurchasePage() {
    return (
        <div className="bg-white">
            <Header />
            <main className="container mx-auto px-6 py-16">
                 <div className="w-full max-w-3xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                            Property Purchase Application
                        </h1>
                        <p className="mt-4 text-lg text-gray-600">
                            Complete the form below to begin the process of acquiring your selected property.
                        </p>
                    </div>
                     <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 mt-10">
                        <form className="space-y-8">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Personal Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    <FormInput id="fullName" label="Full Name" type="text" placeholder="As it appears on your ID" />
                                    <FormInput id="email" label="Email Address" type="email" placeholder="you@example.com" />
                                    <FormInput id="phone" label="Phone Number" type="tel" placeholder="+234 800 000 0000" />
                                    <FormInput id="dob" label="Date of Birth" type="date" placeholder="" />
                                    <div className="md:col-span-2">
                                        <FormTextarea id="address" label="Residential Address" placeholder="123, Main Street, Lekki, Lagos" />
                                    </div>
                                </div>
                            </div>

                             <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Next of Kin Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    <FormInput id="kinName" label="Full Name" type="text" placeholder="Next of Kin's full name" />
                                    <FormInput id="kinRelationship" label="Relationship" type="text" placeholder="e.g., Spouse, Sibling" />
                                    <FormInput id="kinPhone" label="Phone Number" type="tel" placeholder="+234 800 000 0000" />
                                </div>
                            </div>
                            
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Property & Payment Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                   <div className="md:col-span-2">
                                     <FormSelect id="property" label="Select Property">
                                        <option value="">-- Choose a property --</option>
                                        <option value="epe">Prime Residential Plot - Epe, Lagos (₦15,000,000)</option>
                                        <option value="ibeju">Fenced Commercial Land - Ibeju-Lekki, Lagos (₦25,500,000)</option>
                                        <option value="mowe">Affordable Estate Plot - Mowe, Ogun (₦8,750,000)</option>
                                    </FormSelect>
                                   </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Plan</label>
                                        <div className="flex flex-col gap-3">
                                           <label className="flex items-center p-3 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200">
                                               <input type="radio" name="paymentPlan" className="h-4 w-4 text-[#800000] border-gray-300 focus:ring-[#800000]" />
                                               <span className="ml-3 text-sm text-gray-800">Outright Payment</span>
                                           </label>
                                            <label className="flex items-center p-3 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200">
                                               <input type="radio" name="paymentPlan" className="h-4 w-4 text-[#800000] border-gray-300 focus:ring-[#800000]" />
                                               <span className="ml-3 text-sm text-gray-800">Installment Plan (12 months)</span>
                                           </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                             <div className="border-t pt-6">
                                <div className="flex items-start">
                                    <input id="terms" name="terms" type="checkbox" className="h-4 w-4 mt-1 text-[#800000] border-gray-300 rounded focus:ring-[#800000]" />
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="terms" className="font-medium text-gray-700">
                                            I acknowledge that I have read and agree to the <a href="#" className="text-[#800000] hover:underline">Terms and Conditions</a> of this purchase.
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Link href="/dashboard/payments" className="w-full block text-center mt-4 bg-[#800000] text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-[#660000] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]">
                                    Submit Application
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}