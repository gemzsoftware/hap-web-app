import React from 'react';
import Link from 'next/link';
import { mockDashboardData } from '@/data/mockDashboardData';
import BackButton from '@/app/dashboard/components/BackButton';

const FileTextIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
);

const DownloadIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
);

const DocumentRow = ({ name, size }) => (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50">
        <div className="flex items-center gap-4">
            <FileTextIcon className="w-6 h-6 text-gray-500" />
            <div>
                <p className="font-medium text-gray-800">{name}</p>
                <p className="text-sm text-gray-500">{size}</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                <DownloadIcon className="w-5 h-5" />
            </button>
        </div>
    </div>
);


export default function DocumentsPage() {
    const { documents } = mockDashboardData;

    return (
        <div>
            <BackButton href="/dashboard" text="Back to Dashboard" />
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Document Center</h1>
                    <p className="text-gray-600">Access and download all your property-related documents provided by Heaven Ark.</p>
                </div>
                <Link href="/dashboard/request-document" className="bg-[#800000] text-white py-2 px-6 rounded-lg font-semibold hover:bg-[#660000] transition-colors whitespace-nowrap">
                    Request a Document
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">My Documents ({documents.length})</h2>
                </div>
                <div>
                    {documents.map(doc => (
                        <DocumentRow key={doc.id} name={doc.name} size={doc.size} />
                    ))}
                </div>
            </div>
        </div>
    );
}