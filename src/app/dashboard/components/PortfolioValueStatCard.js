'use client';

import React, { useState } from 'react';
import { WalletIcon, EyeIcon, EyeOffIcon } from '../icons';

export function PortfolioValueStatCard({ value, change }) {
    const [isValueVisible, setIsValueVisible] = useState(false);
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-start justify-between">
            <div>
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-500">Portfolio Value</p>
                    <button onClick={() => setIsValueVisible(!isValueVisible)} className="text-gray-400 hover:text-gray-600">
                        {isValueVisible ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                </div>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                    {isValueVisible ? `₦${value}` : '₦******'}
                </p>
                <p className="text-xs mt-2 text-green-500">{change}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-full text-[#800000]">
                <WalletIcon />
            </div>
        </div>
    );
};