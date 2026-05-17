const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

/**
 * API Client for making requests to backend
 */
export async function apiClient(endpoint, options = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        ...options,
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
        const data = await response.json()

        if (!response.ok) {
            throw new Error(data?.error?.message || data?.message || 'Something went wrong')
        }

        return data
    } catch (error) {
        console.error('API Error:', error.message)
        throw error
    }
}

// Auth API
export const authAPI = {
    login: (credentials) => apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),
    register: (userData) => apiClient('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),
    getProfile: () => apiClient('/auth/profile'),
    updateProfile: (data) => apiClient('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
}

// Properties API (Public)
export const propertiesAPI = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return apiClient(`/properties?${query}`)
    },
    getFeatured: (limit = 3) => apiClient(`/properties/featured?limit=${limit}`),
    getById: (id) => apiClient(`/properties/${id}`),
}

// Purchases API (Protected)
export const purchasesAPI = {
    create: (propertyId, paymentMode = 'installment') => apiClient('/purchases', {
        method: 'POST',
        body: JSON.stringify({ propertyId, paymentMode }),
    }),
    getMyPurchases: () => apiClient('/purchases/me'),
    getById: (id) => apiClient(`/purchases/${id}`),
    initializePayment: (purchaseId, amount, type) => apiClient(`/purchases/${purchaseId}/payments/initialize`, {
        method: 'POST',
        body: JSON.stringify({ amount, type }),
    }),
}

// Dashboard API (Protected)
export const dashboardAPI = {
    getSummary: () => apiClient('/dashboard/summary'),
}

// Documents API (Protected)
export const documentsAPI = {
    getMyDocuments: () => apiClient('/documents/me'),
}

// Receipts API (Protected)
export const receiptsAPI = {
    getById: (id) => apiClient(`/receipts/${id}`),
}

// Inquiries API (Public)
export const inquiriesAPI = {
    create: (data) => apiClient('/inquiries', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
}

// Admin API (Protected)
export const adminAPI = {
    // Overview
    getOverview: () => apiClient('/admin/overview'),

    // Users
    getUsers: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return apiClient(`/admin/users?${query}`)
    },
    getUserById: (id) => apiClient(`/admin/users/${id}`),
    updateUserStatus: (id, status) => apiClient(`/admin/users/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    }),

    // Properties
    createProperty: (data) => apiClient('/admin/properties', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateProperty: (id, data) => apiClient(`/admin/properties/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    updatePropertyStatus: (id, status) => apiClient(`/admin/properties/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    }),
    deleteProperty: (id) => apiClient(`/admin/properties/${id}`, {
        method: 'DELETE',
    }),

    // Purchases
    getPurchases: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return apiClient(`/admin/purchases?${query}`)
    },
    updatePurchaseStatus: (id, status) => apiClient(`/admin/purchases/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    }),
    addDocument: (purchaseId, data) => apiClient(`/admin/purchases/${purchaseId}/documents`, {
        method: 'POST',
        body: JSON.stringify(data),
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
    updateInquiryStatus: (id, status) => apiClient(`/admin/inquiries/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    }),

    // Inside adminAPI, add:
    verifyPayment: (id) => apiClient(`/admin/payments/${id}/verify`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'verified' }),
    }),


}