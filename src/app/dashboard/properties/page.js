import React from 'react';
import Image from 'next/image';
import { mockDashboardData } from '@/data/mockDashboardData';
import BackButton from '@/app/dashboard/components/BackButton';

const PropertyCard = ({ image, title, location, status, value }) => {
    const statusClasses = {
        'Fully Paid': 'bg-green-100 text-green-700',
        'Payment Plan': 'bg-yellow-100 text-yellow-700'
    };
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="relative w-full h-48">
                <Image src={image} alt={title} layout="fill" objectFit="cover" />
            </div>
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-800">{title}</h3>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusClasses[status]}`}>{status}</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">{location}</p>
                <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-500">Current Value</p>
                    <p className="text-2xl font-bold text-gray-800">₦{value}</p>
                </div>
                 <button className="w-full mt-4 bg-[#800000] text-white py-2 rounded-lg font-semibold hover:bg-[#660000] transition-colors">
                    Manage Property
                </button>
            </div>
        </div>
    );
};

export default function MyPropertiesPage() {
    const { properties } = mockDashboardData;
    const propertyValues = {
        1: "17,500,000",
        2: "28,000,000",
        3: "9,750,000"
    };

    return (
        <div>
            <BackButton href="/dashboard" text="Back to Dashboard" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Properties</h1>
            <p className="text-gray-600 mb-8">Here is a complete overview of your real estate portfolio.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map(prop => (
                    <PropertyCard
                        key={prop.id}
                        {...prop}
                        value={propertyValues[prop.id]}
                    />
                ))}
            </div>
        </div>
    );
}