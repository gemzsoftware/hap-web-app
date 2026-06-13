'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export function useAuth(requiredRole = 'user') {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const verifySession = async () => {
            const token = localStorage.getItem('token')
            const apiUrl = process.env.NEXT_PUBLIC_API_URL

            if (!token) {
                setUser(null)
                setLoading(false)
                // Boot to login if trying to access any internal routes
                if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
                    router.push('/login')
                }
                return
            }

            try {
                // Live sync with backend profile node
                const res = await fetch(`${apiUrl}/auth/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })

                if (res.ok) {
                    const data = await res.json()
                    const profile = data.user || data.data || data
                    setUser(profile)

                    // Security Logic: Role-Based Access Control (RBAC)
                    if (requiredRole === 'admin' && profile.role !== 'admin') {
                        router.push('/dashboard') // Bounce non-admins to user area
                    }
                } else {
                    // Token dead or user record deleted
                    localStorage.clear()
                    router.push('/login')
                }
            } catch (err) {
                console.error("Security handshake interrupted:", err)
                // Fallback to local storage if API is momentarily unreachable
                const localUser = JSON.parse(localStorage.getItem('user'))
                if (localUser) setUser(localUser)
            } finally {
                setLoading(false)
            }
        }

        verifySession()
    }, [router, requiredRole, pathname])

    return { user, loading, isAuthenticated: !!user }
}