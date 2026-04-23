import React from 'react';
import Image from 'next/image';
import BackButton from '@/app/dashboard/components/BackButton';

const ChatMessage = ({ message, time, isSender, avatar }) => (
    <div className={`flex items-end gap-3 my-4 ${isSender ? 'justify-end' : ''}`}>
        {!isSender && (
            <Image src={avatar} alt="Support" width={40} height={40} className="rounded-full" />
        )}
        <div className={`max-w-md p-3 rounded-2xl ${isSender ? 'bg-[#800000] text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
            <p className="text-sm">{message}</p>
        </div>
    </div>
);


const SendIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

export default function SupportPage() {
    const supportAvatar = '/support-avatar.png';
    return (
        <div className="flex flex-col h-[calc(100vh-160px)]">
            <BackButton href="/dashboard" text="Back to Dashboard" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Support</h1>
            <p className="text-gray-600 mb-8">Have a question? Chat with our support team.</p>
            
            <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                     <Image src={supportAvatar} alt="Support Agent" width={40} height={40} className="rounded-full" />
                     <div>
                        <p className="font-semibold text-gray-800">Heaven Ark Support</p>
                        <p className="text-xs text-green-500 flex items-center gap-1.5">
                            <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                            Online
                        </p>
                     </div>
                </div>
                
                <div className="flex-1 p-6 overflow-y-auto">
                    <ChatMessage 
                        message="Hello Adekunle, how can we help you today?" 
                        isSender={false} 
                        avatar={supportAvatar} 
                    />
                    <ChatMessage 
                        message="Hi, I have a question about the payment schedule for my property in Ibeju-Lekki." 
                        isSender={true} 
                    />
                     <ChatMessage 
                        message="Of course! I can help with that. Please give me a moment to pull up your details." 
                        isSender={false} 
                        avatar={supportAvatar} 
                    />
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Type your message..."
                            className="w-full pl-4 pr-12 py-3 bg-white border border-gray-300 rounded-full focus:ring-2 focus:ring-[#800000] focus:border-transparent transition text-gray-900 placeholder:text-gray-400"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#800000] text-white p-2.5 rounded-full hover:bg-[#660000]">
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}