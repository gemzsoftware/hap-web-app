import Link from 'next/link';
import { getSession } from '@/lib/session';
import { mockDashboardData } from '@/data/mockDashboardData';
import { HomeIcon, FileTextIcon, WalletIcon, BellIcon, ChevronRightIcon } from './icons';
import { PortfolioValueStatCard } from './components/PortfolioValueStatCard';

const StatCard = ({ title, value, change, icon, isWarning = false }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-start justify-between">
        <div>
            <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-500">{title}</p>
            </div>
            <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
            <p className={`text-xs mt-2 ${isWarning ? 'text-red-500' : 'text-green-500'}`}>{change}</p>
        </div>
        <div className="bg-red-50 p-3 rounded-full text-[#800000]">
            {icon}
        </div>
    </div>
);

const PropertyListItem = ({ image, title, location, status }) => {
    const statusClasses = {
        'Fully Paid': 'bg-green-100 text-green-700',
        'Payment Plan': 'bg-yellow-100 text-yellow-700'
    };
    return (
        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <img src={image} alt={title} width={80} height={60} className="rounded-md object-cover"/>
            <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-500">{location}</p>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusClasses[status]}`}>{status}</span>
            <button className="text-gray-400 hover:text-gray-700">
                <ChevronRightIcon/>
            </button>
        </div>
    );
};

export default async function DashboardPage() {
    const session = await getSession();
    const { stats, properties, documents } = mockDashboardData;
    const firstName = session.fullName.split(' ')[0];

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome, {firstName}!</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Properties" value={stats.totalProperties} change={stats.propertyChange} icon={<HomeIcon />} />
                <PortfolioValueStatCard value={stats.portfolioValue} change={stats.valueChange} />
                <StatCard title="Documents" value={stats.documents} change={stats.docsChange} icon={<FileTextIcon />} />
                <StatCard title="Overdue Payments" value={stats.overduePayments} change={stats.paymentChange} icon={<BellIcon />} isWarning />
            </div>
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                   <h2 className="text-xl font-bold text-gray-800 mb-4">My Properties</h2>
                    <div className="space-y-4">
                        {properties.map(prop => <PropertyListItem key={prop.id} {...prop} />)}
                    </div>
                    <Link href="/dashboard/properties" className="w-full mt-4 text-[#800000] font-semibold hover:underline block text-center">
                        View All Properties
                    </Link>
                </div>
                <div className="lg:col-span-1">
                     <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Document Center</h2>
                        <div className="space-y-3">
                            {documents.map(doc => (
                                <a href="#" key={doc.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                                    <FileTextIcon />
                                    <span className="text-sm font-medium text-gray-700 flex-1">{doc.name}</span>
                                    <span className="text-xs text-gray-400">{doc.size}</span>
                                </a>
                            ))}
                        </div>
                         <Link href="/dashboard/documents" className="w-full mt-4 text-[#800000] font-semibold hover:underline block text-center">
                            Manage Documents
                         </Link>
                    </div>
                    <div className="mt-8">
                         <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                         <div className="grid grid-cols-2 gap-4">
                            <Link href="/dashboard/invoice" className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                                <div className="bg-red-50 p-3 rounded-full mb-2 text-[#800000]"><WalletIcon /></div>
                                <p className="text-sm font-semibold text-gray-700">Make a Payment</p>
                            </Link>
                            <Link href="/dashboard/request-document" className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                                <div className="bg-red-50 p-3 rounded-full mb-2 text-[#800000]"><FileTextIcon /></div>
                                <p className="text-sm font-semibold text-gray-700">Request Document</p>
                            </Link>
                         </div>
                    </div>
                </div>
            </div>
        </>
    );
}