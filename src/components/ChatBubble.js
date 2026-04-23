'use client';

import React, { useState } from 'react';
import { MessageIcon, CloseIcon } from '@/app/dashboard/icons';
import ChatPopup from './ChatPopup';

export default function ChatBubble() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button
                onClick={toggleChat}
                className="fixed bottom-8 right-8 w-16 h-16 bg-[#800000] rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer z-50 transition-transform hover:scale-110"
            >
                {isOpen ? <CloseIcon /> : <MessageIcon />}
            </button>
            {isOpen && <ChatPopup onClose={toggleChat} />}
        </>
    );
}