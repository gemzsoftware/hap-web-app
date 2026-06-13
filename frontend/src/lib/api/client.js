const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * API Client
 */
export async function apiClient(endpoint, options = {}) {
    const token =
        typeof window !== 'undefined'
            ? localStorage.getItem('token')
            : null

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && {
                Authorization: `Bearer ${token}`
            })
        },
        ...options
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            config
        )

        const data = await response.json()

        if (!response.ok) {
            throw new Error(
                data?.error?.message ||
                data?.message ||
                'Something went wrong'
            )
        }

        return data
    } catch (error) {
        // Only log real errors, not expected fallbacks for local users
        const msg = error.message || ''
        if (
            token &&
            msg !== 'Failed to fetch' &&
            !msg.includes('Internal server error')
        ) {
            console.error('API Error:', msg)
        }
        throw error
    }
}

/* =========================
   AUTH API
========================= */

export const authAPI = {
    login: (credentials) =>
        apiClient('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        }),

    register: (userData) =>
        apiClient('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        }),

    getProfile: () =>
        apiClient('/auth/profile'),

    updateProfile: (data) =>
        apiClient('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(data)
        })
}

/* =========================
   PROPERTIES API (Public)
========================= */

export const propertiesAPI = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return apiClient(`/properties?${query}`)
    },

    getFeatured: (limit = 3) =>
        apiClient(`/properties/featured?limit=${limit}`),

    getById: (id) =>
        apiClient(`/properties/${id}`)
}

/* =========================
   PURCHASES API (Protected)
========================= */

export const purchasesAPI = {
    create: (propertyId, paymentMode = 'installment') =>
        apiClient('/purchases', {
            method: 'POST',
            body: JSON.stringify({ propertyId, paymentMode })
        }),

    getMyPurchases: () =>
        apiClient('/purchases/me'),

    getById: (id) =>
        apiClient(`/purchases/${id}`),

    initializePayment: (purchaseId, amount, type) =>
        apiClient(`/purchases/${purchaseId}/payments/initialize`, {
            method: 'POST',
            body: JSON.stringify({ amount, type })
        })
}

/* =========================
   DASHBOARD API (Protected)
========================= */

export const dashboardAPI = {
    getSummary: () =>
        apiClient('/dashboard/summary')
}

/* =========================
   DOCUMENTS API (Protected)
========================= */

export const documentsAPI = {
    getMyDocuments: () =>
        apiClient('/documents/me')
}

/* =========================
   RECEIPTS API (Protected)
========================= */

export const receiptsAPI = {
    getById: (id) =>
        apiClient(`/receipts/${id}`)
}

/* =========================
   INQUIRIES API (Public)
========================= */

export const inquiriesAPI = {
    create: (data) =>
        apiClient('/inquiries', {
            method: 'POST',
            body: JSON.stringify(data)
        })
}

/* =========================
   ADMIN API
========================= */

export const adminAPI = {
    // Overview
    getOverview: () =>
        apiClient('/admin/overview'),

    // Users
    getUsers: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return apiClient(`/admin/users?${query}`)
    },

    getUserById: (id) =>
        apiClient(`/admin/users/${id}`),

    updateUserStatus: (id, status) =>
        apiClient(`/admin/users/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        }),

    // Properties
    createProperty: (data) =>
        apiClient('/admin/properties', {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    updateProperty: (id, data) =>
        apiClient(`/admin/properties/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),

    updatePropertyStatus: (id, status) =>
        apiClient(`/admin/properties/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        }),

    deleteProperty: (id) =>
        apiClient(`/admin/properties/${id}`, {
            method: 'DELETE'
        }),

    // Purchases
    getPurchases: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return apiClient(`/admin/purchases?${query}`)
    },

    updatePurchaseStatus: (id, status) =>
        apiClient(`/admin/purchases/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        }),

    addDocument: (purchaseId, data) =>
        apiClient(`/admin/purchases/${purchaseId}/documents`, {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    // Payments
    getPayments: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return apiClient(`/admin/payments?${query}`)
    },

    // Inquiries
    getInquiries: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return apiClient(`/admin/inquiries?${query}`)
    },

    updateInquiryStatus: (id, status) =>
        apiClient(`/admin/inquiries/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        })
}