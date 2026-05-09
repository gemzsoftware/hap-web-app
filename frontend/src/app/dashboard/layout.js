import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function RootDashboardLayout({ children }) {
    return (
        <DashboardLayout>
            {children}
        </DashboardLayout>
    );
}