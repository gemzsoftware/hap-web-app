import React from 'react';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-[#800000]">
                    Heaven Ark
                </Link>
                <nav className="hidden md:flex items-center space-x-8">
                    <Link href="/" className="text-gray-600 hover:text-[#800000] transition-colors">Home</Link>
                    <a href="#" className="text-gray-600 hover:text-[#800000] transition-colors">Properties</a>
                    <a href="#" className="text-gray-600 hover:text-[#800000] transition-colors">About Us</a>
                    <a href="#" className="text-gray-600 hover:text-[#800000] transition-colors">Contact</a>
                </nav>
                <div className="relative hidden md:block group">
                    <button className="bg-[#800000] text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-md group-hover:shadow-lg flex items-center gap-2">
                        Get Started
                        <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-20 transition-all duration-200 ease-out transform scale-95 opacity-0 invisible group-hover:scale-100 group-hover:opacity-100 group-hover:visible">
                        <div className="py-2">
                            <Link href="/login" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                <span className="font-semibold">Log into your account</span>
                                <span className="block text-xs text-gray-500">Access your dashboard and properties.</span>
                            </Link>
                            <Link href="/register" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                <span className="font-semibold">Create a new account</span>
                                <span className="block text-xs text-gray-500">Join our community of investors.</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <button className="md:hidden text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>
        </header>
    );
}