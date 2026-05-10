import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import MobileSidebar from '@/components/dashboard/MobileSidebar'
import { mockDashboardData } from '@/data/mockDashboardData'

export const metadata = {
    title: 'Dashboard - HAP Properties',
}

export default function DashboardLayout({ children }) {
    // TODO: Replace with real auth check when backend is ready
    const user = mockDashboardData.user

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <DashboardSidebar user={user} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Mobile Header */}
                <MobileSidebar />

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}