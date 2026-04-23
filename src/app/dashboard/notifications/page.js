import React from 'react';
import BackButton from '@/app/dashboard/components/BackButton';

const NotificationItem = ({ icon, title, message, time, isRead }) => (
    <div className={`flex items-start gap-4 p-4 border-b border-gray-200 ${!isRead ? 'bg-red-50' : 'bg-white'} hover:bg-gray-50`}>
        <div className="text-blue-500 mt-1">{icon}</div>
        <div className="flex-1">
            <p className="font-semibold text-gray-800">{title}</p>
            <p className="text-sm text-gray-600">{message}</p>
        </div>
        <p className="text-xs text-gray-400 whitespace-nowrap">{time}</p>
    </div>
);

const DocumentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const PaymentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H4a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;

export default function NotificationsPage() {
    return (
        <div>
            <BackButton href="/dashboard" text="Back to Dashboard" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Notifications</h1>
            <p className="text-gray-600 mb-8">Stay updated with important alerts and messages.</p>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <NotificationItem
                    icon={<PaymentIcon />}
                    title="Payment Received"
                    message="Your payment of ₦2,550,000 for the Ibeju-Lekki property has been successfully processed."
                    time="2 days ago"
                    isRead={false}
                />
                 <NotificationItem
                    icon={<DocumentIcon />}
                    title="Document Uploaded"
                    message="Your Deed of Assignment for the Epe property is now available for download."
                    time="1 week ago"
                    isRead={true}
                />
                 <NotificationItem
                    icon={<PaymentIcon />}
                    title="Payment Reminder"
                    message="Your next installment for the Ibeju-Lekki property is due on September 15, 2025."
                    time="2 weeks ago"
                    isRead={true}
                />
            </div>
        </div>
    );
}