import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import DashboardClientLayout from './components/DashboardClientLayout';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }) {
    const session = await getSession();

    if (!session) {
        redirect('/login');
    }

    return (
        <DashboardClientLayout user={session}>
            {children}
        </DashboardClientLayout>
    );
}