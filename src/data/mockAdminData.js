export const mockAdminData = {
    stats: {
        totalUsers: 245,
        activeUsers: 180,
        totalLands: 32,
        availableLands: 12,
        soldLands: 20,
        totalRevenue: 157500000,
        monthlyRevenue: 8500000,
        pendingPayments: 15,
        totalTransactions: 890,
    },
    users: [
        { id: 'user-001', name: 'John Doe', email: 'john@email.com', phone: '+2348000000001', properties: 2, totalPaid: 8500000, joinDate: '2025-01-15', status: 'active' },
        { id: 'user-002', name: 'Jane Smith', email: 'jane@email.com', phone: '+2348000000002', properties: 1, totalPaid: 3200000, joinDate: '2025-02-10', status: 'active' },
        { id: 'user-003', name: 'Mike Johnson', email: 'mike@email.com', phone: '+2348000000003', properties: 3, totalPaid: 15000000, joinDate: '2025-03-05', status: 'active' },
        { id: 'user-004', name: 'Sarah Williams', email: 'sarah@email.com', phone: '+2348000000004', properties: 1, totalPaid: 500000, joinDate: '2025-04-20', status: 'pending' },
        { id: 'user-005', name: 'David Brown', email: 'david@email.com', phone: '+2348000000005', properties: 2, totalPaid: 6200000, joinDate: '2025-01-30', status: 'active' },
    ],
    lands: [
        { id: 'land-001', title: 'Prime Lekki Phase 1', location: 'Lekki, Lagos', price: 15000000, status: 'sold', buyer: 'John Doe', soldDate: '2025-01-20' },
        { id: 'land-002', title: 'Ibeju-Lekki Investment', location: 'Ibeju-Lekki, Lagos', price: 8000000, status: 'sold', buyer: 'Jane Smith', soldDate: '2025-02-15' },
        { id: 'land-003', title: 'Ajah Waterfront', location: 'Ajah, Lagos', price: 25000000, status: 'available', buyer: null, soldDate: null },
        { id: 'land-004', title: 'Abeokuta Farm Land', location: 'Abeokuta, Ogun', price: 3000000, status: 'available', buyer: null, soldDate: null },
        { id: 'land-005', title: 'Lekki Phase 2 Plot', location: 'Lekki, Lagos', price: 20000000, status: 'available', buyer: null, soldDate: null },
    ],
    enquiries: [
        { id: 'enq-001', name: 'Alice Cooper', email: 'alice@email.com', phone: '+2348000000010', message: 'Interested in Lekki plots. Please send more details.', date: '2026-04-20', status: 'new' },
        { id: 'enq-002', name: 'Bob Marley', email: 'bob@email.com', phone: '+2348000000011', message: 'What payment plans are available?', date: '2026-04-18', status: 'replied' },
        { id: 'enq-003', name: 'Carol King', email: 'carol@email.com', phone: '+2348000000012', message: 'I want to inspect the Abeokuta land this weekend.', date: '2026-04-15', status: 'new' },
    ],
    revenueChart: [
        { month: 'Jan', amount: 12500000 },
        { month: 'Feb', amount: 9800000 },
        { month: 'Mar', amount: 14500000 },
        { month: 'Apr', amount: 8500000 },
    ],
}