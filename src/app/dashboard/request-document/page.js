'use client';
import React from 'react';
import { mockDashboardData } from '@/data/mockDashboardData';
import BackButton from '@/app/dashboard/components/BackButton';

const FormSelect = ({ id, label, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <select
            id={id}
            name={id}
            className="w-full px-4 py-2 border rounded-md bg-white border-gray-300 focus:ring-2 focus:ring-[#800000] focus:border-transparent transition text-gray-900"
            required
        >
            {children}
        </select>
    </div>
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
            className="w-full px-4 py-2 border rounded-md bg-white border-gray-300 focus:ring-2 focus:ring-[#800000] focus:border-transparent transition text-gray-900 placeholder:text-gray-400"
            required
        />
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
            className="w-full px-4 py-2 border rounded-md bg-white border-gray-300 focus:ring-2 focus:ring-[#800000] focus:border-transparent transition text-gray-900 placeholder:text-gray-400"
        ></textarea>
    </div>
);

export default function RequestDocumentPage() {
    const { properties } = mockDashboardData;
    return (
        <div>
            <BackButton href="/dashboard/documents" text="Back to Document Center" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Request a Document</h1>
            <p className="text-gray-600 mb-8">Fill out the form below to request a specific document for your property.</p>

             <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-3xl mx-auto">
                <form className="space-y-6">
                    <FormSelect id="property" label="Select Property">
                        <option value="">-- Choose a property --</option>
                        {properties.map(prop => (
                            <option key={prop.id} value={prop.title}>{prop.title} - {prop.location}</option>
                        ))}
                    </FormSelect>
                    
                    <FormInput id="documentType" label="Document Type" type="text" placeholder="e.g., Survey Plan, Deed of Assignment" />

                    <FormTextarea id="notes" label="Additional Notes (Optional)" placeholder="Please provide any specific details or instructions for your request." />

                    <div className="pt-4 text-right">
                        <button type="submit" className="bg-[#800000] text-white py-2 px-6 rounded-lg font-semibold hover:bg-[#660000] transition-colors">
                            Submit Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}