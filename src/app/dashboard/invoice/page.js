import React from 'react';
import { mockInvoiceData } from '@/data/mockInvoiceData';
import BackButton from '@/app/dashboard/components/BackButton';

const WalletIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>
);

const InvoiceCard = ({ invoice }) => (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <p className="text-sm text-gray-500">{invoice.id} - {invoice.description}</p>
            <h3 className="font-bold text-lg text-gray-800 mt-1">{invoice.property}</h3>
            <p className="text-sm text-gray-500 mt-2">Due Date: <span className="font-medium text-red-600">{invoice.dueDate}</span></p>
        </div>
        <div className="w-full md:w-auto text-left md:text-right">
             <p className="text-2xl font-bold text-gray-800">₦{invoice.amountDue}</p>
             <button className="w-full md:w-auto mt-4 bg-[#800000] text-white py-2 px-6 rounded-lg font-semibold hover:bg-[#660000] transition-colors flex items-center justify-center gap-2">
                <WalletIcon className="w-5 h-5" />
                Pay Now
            </button>
        </div>
    </div>
);

export default function InvoicePage() {
    return (
        <div>
            <BackButton href="/dashboard/payments" text="Back to Payments" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Pending Invoices</h1>
            <p className="text-gray-600 mb-8">Please settle the following invoices to keep your account in good standing.</p>

            <div className="space-y-6">
                {mockInvoiceData.length > 0 ? (
                    mockInvoiceData.map(invoice => (
                        <InvoiceCard key={invoice.id} invoice={invoice} />
                    ))
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
                        <h3 className="text-xl font-semibold text-gray-800">No Pending Invoices</h3>
                        <p className="text-gray-500 mt-2">All your payments are up to date. Well done!</p>
                    </div>
                )}
            </div>
        </div>
    );
}