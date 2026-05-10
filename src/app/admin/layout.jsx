import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata = {
    title: 'Admin Dashboard - HAP Properties',
}

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                {children}
            </main>
        </div>
    )
}