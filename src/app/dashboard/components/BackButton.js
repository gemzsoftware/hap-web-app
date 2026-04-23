import React from 'react';
import Link from 'next/link';

const ArrowLeftIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);

export default function BackButton({ href, text }) {
    return (
        <Link href={href} className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-8 transition-colors">
            <ArrowLeftIcon className="w-4 h-4" />
            {text}
        </Link>
    );
}