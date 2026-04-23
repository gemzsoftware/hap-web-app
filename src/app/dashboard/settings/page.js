import React from 'react';
import BackButton from '@/app/dashboard/components/BackButton';

const FormInput = ({ id, label, type, value, isReadOnly = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <input
            type={type}
            id={id}
            name={id}
            defaultValue={value}
            readOnly={isReadOnly}
            className={`w-full px-4 py-2 border rounded-md transition text-gray-900 placeholder:text-gray-400 ${isReadOnly ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white border-gray-300 focus:ring-2 focus:ring-[#800000] focus:border-transparent'}`}
        />
    </div>
);

export default function SettingsPage() {
    return (
        <div>
            <BackButton href="/dashboard" text="Back to Dashboard" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
            <p className="text-gray-600 mb-8">Manage your account details and security preferences.</p>

            <div className="space-y-10">
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Personal Information</h2>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput id="fullName" label="Full Name" type="text" value="Adekunle Jacobs" />
                        <FormInput id="email" label="Email Address" type="email" value="adekunle.j@example.com" isReadOnly />
                        <FormInput id="phone" label="Phone Number" type="tel" value="+234 801 234 5678" />
                         <div className="md:col-span-2 text-right">
                            <button type="submit" className="bg-[#800000] text-white py-2 px-6 rounded-lg font-semibold hover:bg-[#660000] transition-colors">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>

                 <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Change Password</h2>
                    <form className="space-y-6">
                        <FormInput id="currentPassword" label="Current Password" type="password" />
                        <FormInput id="newPassword" label="New Password" type="password" />
                        <FormInput id="confirmPassword" label="Confirm New Password" type="password" />
                         <div className="text-right">
                            <button type="submit" className="bg-[#800000] text-white py-2 px-6 rounded-lg font-semibold hover:bg-[#660000] transition-colors">
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}