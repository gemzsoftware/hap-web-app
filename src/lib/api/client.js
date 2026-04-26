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
            throw new Error(data.message || 'Something went wrong')
        }

        return data
    } catch (error) {
        console.error('API Error:', error.message)
        throw error
    }
}

// Auth API calls
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