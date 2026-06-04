'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    UserPlus,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Mail,
    User,
    Phone,
    Shield,
    Eye,
    EyeOff,
    Key
} from 'lucide-react'

import { authAPI } from '@/lib/api/client'

const DEFAULT_PASSWORD = 'HeavenArk123'

export default function CreateUserPage() {
    const router = useRouter()

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        role: 'investor'
    })

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [createdUser, setCreatedUser] = useState(null)
    const [showDefaultPassword, setShowDefaultPassword] =
        useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError('')

        if (
            !formData.fullName ||
            !formData.email ||
            !formData.phone
        ) {
            setError('All fields are required.')
            return
        }

        setLoading(true)

        try {
            await authAPI.register({
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                password: DEFAULT_PASSWORD
            })

            const storedUsers =
                localStorage.getItem('registeredUsers')

            const allUsers = storedUsers
                ? JSON.parse(storedUsers)
                : []

            const existingUser = allUsers.find(
                (u) =>
                    u.email.toLowerCase() ===
                    formData.email.toLowerCase()
            )

            if (existingUser) {
                setError(
                    'A user with this email already exists.'
                )
                setLoading(false)
                return
            }

            const generatedId = `user_${Date.now()}`

            const newUser = {
                _id: generatedId,
                id: generatedId,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                password: DEFAULT_PASSWORD,
                role: formData.role,
                status: 'active',
                source: 'backend',
                passwordChangeRequired: true,
                createdAt: new Date().toISOString()
            }

            allUsers.push(newUser)

            localStorage.setItem(
                'registeredUsers',
                JSON.stringify(allUsers)
            )

            setCreatedUser(newUser)
            setSuccess(true)
        } catch (err) {
            console.log(
                'Backend registration failed, saving locally'
            )

            const storedUsers =
                localStorage.getItem('registeredUsers')

            const allUsers = storedUsers
                ? JSON.parse(storedUsers)
                : []

            const existingUser = allUsers.find(
                (u) =>
                    u.email.toLowerCase() ===
                    formData.email.toLowerCase()
            )

            if (existingUser) {
                setError(
                    'A user with this email already exists.'
                )
                setLoading(false)
                return
            }

            const generatedId = `local_${Date.now()}`

            const newUser = {
                _id: generatedId,
                id: generatedId,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                password: DEFAULT_PASSWORD,
                role: formData.role,
                status: 'active',
                source: 'local',
                passwordChangeRequired: true,
                createdAt: new Date().toISOString()
            }

            allUsers.push(newUser)

            localStorage.setItem(
                'registeredUsers',
                JSON.stringify(allUsers)
            )

            setCreatedUser(newUser)
            setSuccess(true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-10 text-white">
            <button
                onClick={() => router.push('/admin/users')}
                className="flex items-center gap-2 mb-8"
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </button>

            <h1 className="text-4xl font-black mb-10">
                Create User
            </h1>

            {success ? (
                <div className="space-y-4">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />

                            <h2 className="text-xl font-bold">
                                User Created
                            </h2>
                        </div>

                        <div className="space-y-2">
                            <p>
                                Name:{' '}
                                {createdUser?.fullName}
                            </p>

                            <p>
                                Email:{' '}
                                {createdUser?.email}
                            </p>

                            <p>
                                Role:{' '}
                                {createdUser?.role}
                            </p>
                        </div>

                        <div className="mt-4">
                            <button
                                onClick={() =>
                                    setShowDefaultPassword(
                                        !showDefaultPassword
                                    )
                                }
                                className="flex items-center gap-2"
                            >
                                {showDefaultPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}

                                {showDefaultPassword
                                    ? DEFAULT_PASSWORD
                                    : 'Show Password'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 max-w-2xl"
                >
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                fullName: e.target.value
                            })
                        }
                        className="w-full p-5 rounded-2xl bg-white/5 border border-white/10"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                email: e.target.value
                            })
                        }
                        className="w-full p-5 rounded-2xl bg-white/5 border border-white/10"
                    />

                    <input
                        type="tel"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                phone: e.target.value
                            })
                        }
                        className="w-full p-5 rounded-2xl bg-white/5 border border-white/10"
                    />

                    <select
                        value={formData.role}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                role: e.target.value
                            })
                        }
                        className="w-full p-5 rounded-2xl bg-white/5 border border-white/10"
                    >
                        <option value="investor">
                            Investor
                        </option>

                        <option value="staff">
                            Staff
                        </option>
                    </select>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-5 rounded-2xl bg-emerald-600 font-black"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                        ) : (
                            'Create User'
                        )}
                    </button>
                </form>
            )}
        </div>
    )
}