'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { transactions } from '@/data/mockPaymentsData';
import BackButton from '@/app/dashboard/components/BackButton';

const statusClasses = {
    'Completed': 'bg-green-100 text-green-700',
    'In Progress': 'bg-yellow-100 text-yellow-700',
    'Failed': 'bg-red-100 text-red-700'
};

const CheckCircleIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const PendingCircleIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const TransactionRow = ({ transaction, onToggle, isExpanded }) => {
    return (
        <>
            <tr className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer" onClick={() => onToggle(transaction.id)}>
                <td className="py-4 px-6 text-sm text-gray-700">{transaction.date}</td>
                <td className="py-4 px-6 text-sm text-gray-700">{transaction.description}</td>
                <td className="py-4 px-6 text-sm font-medium text-gray-800">{transaction.amount}</td>
                <td className="py-4 px-6">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusClasses[transaction.status]}`}>{transaction.status}</span>
                </td>
                 <td className="py-4 px-6 text-right">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </td>
            </tr>
            {isExpanded && (
                 <tr>
                    <td colSpan="5" className="p-0">
                        <div className="bg-gray-50 p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Transaction Details</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between"><span className="text-gray-500">Property:</span> <span className="font-medium text-gray-800 text-right">{transaction.details.property}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Reference #:</span> <span className="font-medium text-gray-800">{transaction.details.reference}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Payment Method:</span> <span className="font-medium text-gray-800">{transaction.details.paymentMethod}</span></div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Purchase Workflow</h3>
                                <div className="relative">
                                    {transaction.workflow.map((step, index) => (
                                        <div key={index} className="flex items-start gap-4 pb-6">
                                            {index !== transaction.workflow.length - 1 && (
                                                <div className="absolute left-[11px] top-6 h-full w-0.5 bg-gray-200"></div>
                                            )}
                                            <div className="relative z-10">
                                                {step.status === 'completed' ? (
                                                    <CheckCircleIcon className="w-6 h-6 text-green-500 bg-white rounded-full" />
                                                ) : (
                                                    <PendingCircleIcon className="w-6 h-6 text-gray-400" />
                                                )}
                                            </div>
                                            <div>
                                                <p className={`font-semibold ${step.status === 'completed' ? 'text-gray-800' : 'text-gray-500'}`}>{step.name}</p>
                                                {step.completed_at && <p className="text-xs text-gray-500">Completed: {step.completed_at}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

export default function PaymentsPage() {
    const [expandedRow, setExpandedRow] = useState(transactions[0].id);

    const handleToggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    return (
        <div>
            <BackButton href="/dashboard" text="Back to Dashboard" />
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Payments</h1>
                    <p className="text-gray-600">Review your transaction history and manage payment methods.</p>
                </div>
                <Link href="/dashboard/invoice" className="bg-[#800000] text-white py-2 px-6 rounded-lg font-semibold hover:bg-[#660000] transition-colors whitespace-nowrap">
                    Make a Payment
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                 <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
                </div>
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-6">Date</th>
                            <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-6">Description</th>
                            <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-6">Amount</th>
                            <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-6">Status</th>
                            <th className="w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(transaction => (
                            <TransactionRow
                                key={transaction.id}
                                transaction={transaction}
                                onToggle={handleToggleRow}
                                isExpanded={expandedRow === transaction.id}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}