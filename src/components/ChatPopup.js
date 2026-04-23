import React from 'react';
import Image from 'next/image';

const ChatMessage = ({ message, isSender, avatar }) => (
    <div className={`flex items-end gap-3 my-4 ${isSender ? 'justify-end' : ''}`}>
        {!isSender && (
            <Image src={avatar} alt="Support" width={40} height={40} className="rounded-full" />
        )}
        <div className={`max-w-xs p-3 rounded-2xl ${isSender ? 'bg-[#800000] text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
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

const CloseIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export default function ChatPopup({ onClose }) {
    const supportAvatar = '/support-avatar.png'; 
    return (
        <div className="fixed bottom-28 right-8 w-96 h-[60vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                    <Image src={supportAvatar} alt="Support Agent" width={40} height={40} className="rounded-full" />
                    <div>
                        <p className="font-semibold text-gray-800">Heaven Ark Support</p>
                        <p className="text-xs text-green-500 flex items-center gap-1.5">
                            <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                            Online
                        </p>
                    </div>
                </div>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                    <CloseIcon />
                </button>
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
                        className="w-full pl-4 pr-12 py-3 bg-white border border-gray-300 rounded-full focus:ring-2 focus:ring-[#800000] focus:border-transparent transition"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#800000] text-white p-2.5 rounded-full hover:bg-[#660000]">
                        <SendIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}