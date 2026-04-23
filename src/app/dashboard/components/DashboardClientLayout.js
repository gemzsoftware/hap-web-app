'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, FileTextIcon, WalletIcon, BellIcon, SettingsIcon, LogOutIcon, ChevronDownIcon, ChevronLeftIcon, SupportIcon } from '../icons';
import ChatBubble from '@/components/ChatBubble';

const UserAvatar = ({ fullName }) => {
    const initials = fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();

    return (
        <div className="w-10 h-10 rounded-full bg-[#800000] flex items-center justify-center text-white font-bold text-sm">
            {initials}
        </div>
    );
};

const Sidebar = ({ isCollapsed, onToggle, pathname }) => (
    <aside className={`bg-white border-r border-gray-200 flex-col relative transition-all duration-300 ease-in-out hidden lg:flex ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="flex-grow">
            <div className="flex items-center justify-center h-[69px] px-6 py-5">
                <Link href="/" className={`font-bold text-[#800000] transition-all duration-300 ${isCollapsed ? 'text-xl' : 'text-2xl'}`}>
                   {isCollapsed ? 'HA' : 'Heaven Ark'}
                </Link>
            </div>
            <nav className="p-4">
                <SidebarLink href="/dashboard" icon={<HomeIcon />} active={pathname === '/dashboard'} isCollapsed={isCollapsed}>Dashboard</SidebarLink>
                <SidebarLink href="/dashboard/properties" icon={<FileTextIcon />} active={pathname === '/dashboard/properties'} isCollapsed={isCollapsed}>My Properties</SidebarLink>
                <SidebarLink href="/dashboard/payments" icon={<WalletIcon />} active={pathname.startsWith('/dashboard/payments') || pathname.startsWith('/dashboard/invoice')} isCollapsed={isCollapsed}>Payments</SidebarLink>
                <SidebarLink href="/dashboard/notifications" icon={<BellIcon />} active={pathname === '/dashboard/notifications'} isCollapsed={isCollapsed}>Notifications</SidebarLink>
                <SidebarLink href="/dashboard/support" icon={<SupportIcon />} active={pathname.startsWith('/dashboard/support')} isCollapsed={isCollapsed}>Support</SidebarLink>
                <SidebarLink href="/dashboard/settings" icon={<SettingsIcon />} active={pathname === '/dashboard/settings'} isCollapsed={isCollapsed}>Settings</SidebarLink>
            </nav>
        </div>

        <div className="p-4 border-t border-gray-200">
             <button
                onClick={onToggle}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 mb-2 ${isCollapsed ? 'justify-center' : 'gap-3'}`}
             >
                <ChevronLeftIcon className={`transition-transform duration-300 flex-shrink-0 ${isCollapsed ? 'rotate-180' : ''}`} />
                <span className={`font-medium whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                    {isCollapsed ? 'Expand' : 'Collapse'}
                </span>
            </button>
            <SidebarLink href="/api/auth/logout" icon={<LogOutIcon />} isCollapsed={isCollapsed}>Logout</SidebarLink>
        </div>
    </aside>
);

const SidebarLink = ({ href, icon, children, active = false, isCollapsed }) => {
    const iconWithClass = React.cloneElement(icon, {
        className: 'flex-shrink-0',
    });

    const activeClasses = isCollapsed
        ? 'text-[#800000]'
        : 'bg-[#800000] text-white';

    const inactiveClasses = 'text-gray-600 hover:bg-gray-100 hover:text-gray-900';

    return (
        <Link href={href} className={`flex items-center px-4 py-3 rounded-lg transition-colors relative group ${isCollapsed ? 'justify-center' : 'gap-3'} ${active ? activeClasses : inactiveClasses}`}>
            {iconWithClass}
            <span className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-200 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                {children}
            </span>
            {isCollapsed && (
                <span className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {children}
                </span>
            )}
        </Link>
    );
};


const DashboardHeader = ({ user }) => (
    <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
             <div className="lg:hidden">
                <Link href="/" className="text-2xl font-bold text-[#800000]">Heaven Ark</Link>
            </div>
            <div className="flex-1 max-w-xs hidden md:block">
            </div>
            <div className="flex items-center gap-4">
                <button className="relative text-gray-500 hover:text-gray-800">
                    <BellIcon />
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center gap-3">
                    <UserAvatar fullName={user.fullName} />
                    <div>
                        <p className="font-semibold text-gray-800 text-sm">{user.fullName}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                     <button className="text-gray-500 hover:text-gray-800">
                        <ChevronDownIcon />
                    </button>
                </div>
            </div>
        </div>
    </header>
);

export default function DashboardClientLayout({ user, children }) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar
                pathname={pathname}
                isCollapsed={isCollapsed}
                onToggle={toggleSidebar}
            />
            <div className="flex-1 flex flex-col">
                <DashboardHeader user={user} />
                <main className="flex-1 p-6 lg:p-10">
                    {children}
                </main>
            </div>
            <ChatBubble />
        </div>
    );
}