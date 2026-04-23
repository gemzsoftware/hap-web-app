import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { properties } from '@/data/properties';
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

export default function PropertyDetailPage({ params }) {
    const property = properties.find(p => p.slug === params.slug);

    if (!property) {
        notFound();
    }

    return (
        <div className="bg-white text-gray-800">
            <Header />
            <main className="relative z-10 container mx-auto px-6 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900">{property.title}</h1>
                    <p className="text-lg text-gray-500 mt-2">{property.location}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-lg mb-4">
                            <Image src={property.image} alt={property.title} layout="fill" objectFit="cover" />
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {property.gallery.map((img, index) => (
                                <div key={index} className="relative h-24 rounded-md overflow-hidden">
                                    <Image src={img} alt={`${property.title} gallery image ${index + 1}`} layout="fill" objectFit="cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-28 bg-gray-50 p-6 rounded-lg shadow-md border">
                            <p className="text-4xl font-extrabold text-[#800000] mb-6">₦{new Intl.NumberFormat().format(property.price)}</p>
                            <div className="space-y-4 text-gray-700">
                                <div className="flex justify-between">
                                    <span className="font-semibold">Location:</span>
                                    <span>{property.location}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Plot Size:</span>
                                    <span>{property.size} sqm</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Title:</span>
                                    <span>{property.landTitle}</span>
                                </div>
                                 <div className="flex justify-between">
                                    <span className="font-semibold">Status:</span>
                                    <span className="text-green-600 font-bold">Available</span>
                                </div>
                            </div>
                            <Link href="/register" className="block w-full mt-8 bg-[#800000] text-white text-center py-3 rounded-full font-bold text-lg hover:bg-[#660000] transition-colors">
                                Purchase
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <h2 className="text-3xl font-bold border-b pb-4 mb-4">Property Description</h2>
                    <p className="text-gray-600 leading-relaxed">
                        {property.description}
                    </p>
                </div>

                 <div className="mt-12">
                    <h2 className="text-3xl font-bold border-b pb-4 mb-4">Location Map</h2>
                     <div className="bg-gray-200 h-80 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Map Placeholder</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}