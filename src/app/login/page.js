'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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


const FormInput = ({ id, label, type, placeholder, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <input
            type={type}
            id={id}
            name={id}
            placeholder={placeholder}
            className="w-full px-4 py-2 bg-gray-100 border-transparent rounded-md focus:ring-2 focus:ring-[#800000] focus:border-transparent transition text-gray-900 placeholder:text-gray-400"
            required
            value={value}
            onChange={onChange}
        />
    </div>
);

const GoogleIcon = () => (
    <svg className="w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512S0 403.3 0 261.8S106.5 11.8 244 11.8C381.5 11.8 488 120.8 488 261.8zM150 261.8c0 53.3 43.2 96.5 96.5 96.5s96.5-43.2 96.5-96.5S300.2 165.3 246.5 165.3S150 208.5 150 261.8z"></path>
    </svg>
);

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        if (searchParams.get('registered') === 'true') {
            setSuccess('Registration successful! Please sign in.');
        }
    }, [searchParams]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.email || !formData.password) {
            setError('Email and password are required.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed.');
            }
            
            router.push('/dashboard');

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="bg-white">
            <Header />
            <main className="container mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                            Welcome Back
                        </h1>
                        <p className="mt-4 text-lg text-gray-600">
                            Sign in to access your dashboard, manage your property portfolio, and discover new investment opportunities with Heaven Ark.
                        </p>
                         <button className="w-full md:w-auto mt-8 inline-flex items-center justify-center py-3 px-6 border border-gray-300 rounded-lg shadow-sm bg-white text-base font-medium text-gray-700 hover:bg-gray-50 transition">
                            <GoogleIcon />
                            <span className="ml-3">Continue with Google</span>
                        </button>
                    </div>
                    <div className="w-full max-w-lg mx-auto">
                         <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {error && <p className="text-red-500 bg-red-100 p-3 rounded-md text-sm">{error}</p>}
                                {success && <p className="text-green-600 bg-green-100 p-3 rounded-md text-sm">{success}</p>}
                                <FormInput id="email" label="Email Address" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange}/>
                                <FormInput id="password" label="Password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange}/>
                                <div className="text-right text-sm">
                                    <a href="#" className="font-medium text-[#800000] hover:underline">
                                        Forgot password?
                                    </a>
                                </div>
                                <div>
                                    <button type="submit" disabled={isLoading} className="w-full block text-center mt-4 bg-[#800000] text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-[#660000] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] disabled:bg-gray-400">
                                        {isLoading ? 'Signing In...' : 'Sign In'}
                                    </button>
                                </div>
                            </form>
                            <p className="text-center text-sm text-gray-600 mt-8">
                                Don&apos;t have an account?{' '}
                                <Link href="/register" className="font-medium text-[#800000] hover:underline">
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}