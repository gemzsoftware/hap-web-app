'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
    Search,
    RefreshCw,
    FileText,
    Clock,
    CheckCircle2,
    XCircle,
    Eye,
    ChevronLeft,
    ChevronRight,
    X,
    User,
    MapPin,
    CreditCard,
    CalendarDays,
    Phone,
    Mail,
    Users,
    ShieldCheck,
    MessageSquare,
    Save,
    AlertCircle,
    ExternalLink
} from 'lucide-react'

import { adminAPI } from '@/lib/api/client'
import { formatDate } from '@/lib/storage'

const APPLICATION_STATUSES = {
    pending_review: {
        label: 'Pending Review',
        color: 'amber'
    },
    under_review: {
        label: 'Under Review',
        color: 'blue'
    },
    approved: {
        label: 'Approved',
        color: 'emerald'
    },
    rejected: {
        label: 'Rejected',
        color: 'red'
    },
    withdrawn: {
        label: 'Withdrawn',
        color: 'slate'
    }
}

const STATUS_TRANSITIONS = {
    pending_review: [
        'under_review',
        'approved',
        'rejected',
        'withdrawn'
    ],
    under_review: [
        'approved',
        'rejected',
        'withdrawn'
    ],
    approved: [],
    rejected: [],
    withdrawn: []
}

export default function ApplicationsPage() {
    const [applications, setApplications] = useState([])
    const [stats, setStats] = useState({
        total: 0,
        pending_review: 0,
        under_review: 0,
        approved: 0,
        rejected: 0,
        withdrawn: 0
    })

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 1
    })

    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')

    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState(null)

    const [selectedApplication, setSelectedApplication] = useState(null)
    const [loadingDetails, setLoadingDetails] = useState(false)

    const [savingStatus, setSavingStatus] = useState(false)
    const [savingNotes, setSavingNotes] = useState(false)

    const [selectedStatus, setSelectedStatus] = useState('')
    const [notes, setNotes] = useState('')

    const [detailsError, setDetailsError] = useState(null)

    const fetchApplications = useCallback(async () => {
        try {
            setError(null)

            const response = await adminAPI.getApplications({
                page: pagination.page,
                limit: pagination.limit,
                q: search.trim(),
                status: statusFilter
            })

            const data = response?.data || {}

            setApplications(data.items || [])

            if (data.pagination) {
                setPagination((previous) => ({
                    ...previous,
                    ...data.pagination
                }))
            }
        } catch (err) {
            console.error(
                'Failed to load applications:',
                err
            )

            setApplications([])

            setError(
                err?.message ||
                'Failed to load applications. Please try again.'
            )
        }
    }, [
        pagination.page,
        pagination.limit,
        search,
        statusFilter
    ])

    const fetchApplicationStats = useCallback(async () => {
        try {
            const response =
                await adminAPI.getApplicationsStats()

            const data = response?.data || {}

            setStats({
                total: data.total ?? 0,
                pending_review:
                    data.pending_review ?? 0,
                under_review:
                    data.under_review ?? 0,
                approved:
                    data.approved ?? 0,
                rejected:
                    data.rejected ?? 0,
                withdrawn:
                    data.withdrawn ?? 0
            })
        } catch (err) {
            console.error(
                'Failed to load application statistics:',
                err
            )
        }
    }, [])

    const loadPage = useCallback(async () => {
        setLoading(true)

        await Promise.all([
            fetchApplications(),
            fetchApplicationStats()
        ])

        setLoading(false)
    }, [
        fetchApplications,
        fetchApplicationStats
    ])

    useEffect(() => {
        loadPage()
    }, [loadPage])

    const handleRefresh = async () => {
        if (refreshing) return

        setRefreshing(true)

        await Promise.all([
            fetchApplications(),
            fetchApplicationStats()
        ])

        setRefreshing(false)
    }

    const handleSearchChange = (event) => {
        setSearch(event.target.value)

        setPagination((previous) => ({
            ...previous,
            page: 1
        }))
    }

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value)

        setPagination((previous) => ({
            ...previous,
            page: 1
        }))
    }

    const openApplication = async (id) => {
        if (!id) {
            setDetailsError(
                'Application ID is missing.'
            )
            return
        }

        setLoadingDetails(true)
        setDetailsError(null)
        setSelectedApplication(null)

        try {
            const response =
                await adminAPI.getApplicationById(id)

            /*
             * Backend response:
             *
             * {
             *     message: 'Application loaded.',
             *     data: application
             * }
             *
             * Therefore response.data is the
             * application object.
             */
            const application =
                response?.data ||
                response?.application ||
                null

            if (!application) {
                throw new Error(
                    'Application details were not returned.'
                )
            }

            setSelectedApplication(application)

            setSelectedStatus(
                application.status || ''
            )

            setNotes(
                application.adminNotes || ''
            )
        } catch (err) {
            console.error(
                'Failed to load application details:',
                err
            )

            setDetailsError(
                err?.message ||
                'Failed to load application details.'
            )
        } finally {
            setLoadingDetails(false)
        }
    }

    const closeApplication = () => {
        if (
            savingStatus ||
            savingNotes
        ) {
            return
        }

        setSelectedApplication(null)
        setSelectedStatus('')
        setNotes('')
        setDetailsError(null)
    }

    const handleStatusUpdate = async () => {
        if (
            !selectedApplication ||
            !selectedStatus
        ) {
            return
        }

        if (
            selectedStatus ===
            selectedApplication.status
        ) {
            return
        }

        setSavingStatus(true)
        setDetailsError(null)

        try {
            const response =
                await adminAPI.updateApplicationStatus(
                    selectedApplication.id ||
                    selectedApplication._id,
                    selectedStatus
                )

            /*
             * Backend response:
             *
             * {
             *     message: 'Application status updated.',
             *     data: application
             * }
             */
            const updatedApplication =
                response?.data ||
                response?.application ||
                null

            if (updatedApplication) {
                setSelectedApplication(
                    updatedApplication
                )

                setSelectedStatus(
                    updatedApplication.status ||
                    ''
                )

                setNotes(
                    updatedApplication.adminNotes ||
                    ''
                )
            } else {
                setSelectedApplication(
                    (previous) => ({
                        ...previous,
                        status: selectedStatus
                    })
                )
            }

            await Promise.all([
                fetchApplications(),
                fetchApplicationStats()
            ])
        } catch (err) {
            console.error(
                'Failed to update application status:',
                err
            )

            setDetailsError(
                err?.message ||
                'Failed to update application status.'
            )
        } finally {
            setSavingStatus(false)
        }
    }

    const handleSaveNotes = async () => {
        if (!selectedApplication) {
            return
        }

        setSavingNotes(true)
        setDetailsError(null)

        try {
            const response =
                await adminAPI.updateApplicationNotes(
                    selectedApplication.id ||
                    selectedApplication._id,
                    notes
                )

            /*
             * Backend response:
             *
             * {
             *     message: 'Application notes updated.',
             *     data: application
             * }
             */
            const updatedApplication =
                response?.data ||
                response?.application ||
                null

            if (updatedApplication) {
                setSelectedApplication(
                    updatedApplication
                )

                setNotes(
                    updatedApplication.adminNotes ||
                    ''
                )
            } else {
                setSelectedApplication(
                    (previous) => ({
                        ...previous,
                        adminNotes: notes
                    })
                )
            }
        } catch (err) {
            console.error(
                'Failed to save application notes:',
                err
            )

            setDetailsError(
                err?.message ||
                'Failed to save application notes.'
            )
        } finally {
            setSavingNotes(false)
        }
    }

    const goToPage = (page) => {
        if (
            page < 1 ||
            page > pagination.pages ||
            page === pagination.page
        ) {
            return
        }

        setPagination((previous) => ({
            ...previous,
            page
        }))
    }

    return (
        <div className="min-h-screen bg-[#020617] pb-20 text-white">
            <div className="max-w-7xl mx-auto px-6 pt-10 space-y-10">

                {/* HEADER */}

                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
                    <div className="space-y-3">
                        <p className="text-emerald-500 text-xs font-bold uppercase tracking-[3px]">
                            APPLICATION MANAGEMENT
                        </p>

                        <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter">
                            APPLICATION{' '}
                            <span className="text-emerald-600">
                                ROOT
                            </span>
                        </h1>

                        <p className="text-slate-400 text-lg">
                            Review and manage property applications
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin"
                            className="hidden sm:flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all"
                        >
                            Dashboard
                        </Link>

                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all"
                        >
                            <RefreshCw
                                className={`w-4 h-4 ${
                                    refreshing
                                        ? 'animate-spin'
                                        : ''
                                }`}
                            />

                            {refreshing
                                ? 'Refreshing...'
                                : 'Refresh Data'}
                        </button>
                    </div>
                </div>

                {/* ERROR */}

                {error && (
                    <div className="flex items-start gap-4 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl">
                        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />

                        <div>
                            <p className="text-sm font-bold text-red-400">
                                Failed to load applications
                            </p>

                            <p className="text-sm text-red-300/70 mt-1">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {/* STAT CARDS */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                    <StatCard
                        label="Total"
                        value={stats.total}
                        icon={<FileText />}
                        accent="emerald"
                    />

                    <StatCard
                        label="Pending"
                        value={stats.pending_review}
                        icon={<Clock />}
                        accent="amber"
                    />

                    <StatCard
                        label="Under Review"
                        value={stats.under_review}
                        icon={<Eye />}
                        accent="blue"
                    />

                    <StatCard
                        label="Approved"
                        value={stats.approved}
                        icon={<CheckCircle2 />}
                        accent="emerald"
                    />

                    <StatCard
                        label="Rejected"
                        value={stats.rejected}
                        icon={<XCircle />}
                        accent="red"
                    />
                </div>

                {/* SEARCH / FILTERS */}

                <div className="p-5 bg-white/[0.03] border border-white/10 rounded-3xl">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />

                            <input
                                type="text"
                                value={search}
                                onChange={
                                    handleSearchChange
                                }
                                placeholder="Search applicant, email, phone, property..."
                                className="w-full pl-12 pr-4 py-4 bg-[#020617] border border-white/10 rounded-2xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={
                                handleStatusFilterChange
                            }
                            className="lg:w-56 px-4 py-4 bg-[#020617] border border-white/10 rounded-2xl text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50"
                        >
                            <option value="">
                                All Statuses
                            </option>

                            {Object.entries(
                                APPLICATION_STATUSES
                            ).map(
                                ([value, config]) => (
                                    <option
                                        key={value}
                                        value={value}
                                    >
                                        {config.label}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                </div>

                {/* APPLICATION TABLE */}

                <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] overflow-hidden">
                    <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
                        <div>
                            <h2 className="font-black text-white">
                                Applications
                            </h2>

                            <p className="text-xs text-slate-500 mt-1">
                                {pagination.total}{' '}
                                total application
                                {pagination.total === 1
                                    ? ''
                                    : 's'}
                            </p>
                        </div>

                        <FileText className="w-5 h-5 text-slate-600" />
                    </div>

                    {loading ? (
                        <LoadingTable />
                    ) : applications.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px]">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-slate-600">
                                                Applicant
                                            </th>

                                            <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-slate-600">
                                                Property
                                            </th>

                                            <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-slate-600">
                                                Payment
                                            </th>

                                            <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-slate-600">
                                                Submitted
                                            </th>

                                            <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-slate-600">
                                                Status
                                            </th>

                                            <th className="text-right px-6 py-4 text-[10px] font-black uppercase tracking-[2px] text-slate-600">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {applications.map(
                                            (
                                                application
                                            ) => (
                                                <ApplicationRow
                                                    key={
                                                        application.id ||
                                                        application._id
                                                    }
                                                    application={
                                                        application
                                                    }
                                                    onOpen={
                                                        openApplication
                                                    }
                                                />
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* PAGINATION */}

                            <div className="px-6 py-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-xs text-slate-500">
                                    Page{' '}
                                    {pagination.page}{' '}
                                    of{' '}
                                    {pagination.pages}
                                </p>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() =>
                                            goToPage(
                                                pagination.page -
                                                    1
                                            )
                                        }
                                        disabled={
                                            pagination.page <=
                                            1
                                        }
                                        className="p-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 rounded-xl transition-all"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>

                                    <div className="px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-400">
                                        {
                                            pagination.page
                                        }
                                    </div>

                                    <button
                                        onClick={() =>
                                            goToPage(
                                                pagination.page +
                                                    1
                                            )
                                        }
                                        disabled={
                                            pagination.page >=
                                            pagination.pages
                                        }
                                        className="p-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 rounded-xl transition-all"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* DETAIL MODAL */}

            {(selectedApplication ||
                loadingDetails ||
                detailsError) && (
                <ApplicationModal
                    application={
                        selectedApplication
                    }
                    loading={
                        loadingDetails
                    }
                    error={detailsError}
                    selectedStatus={
                        selectedStatus
                    }
                    setSelectedStatus={
                        setSelectedStatus
                    }
                    notes={notes}
                    setNotes={setNotes}
                    savingStatus={
                        savingStatus
                    }
                    savingNotes={
                        savingNotes
                    }
                    onStatusUpdate={
                        handleStatusUpdate
                    }
                    onSaveNotes={
                        handleSaveNotes
                    }
                    onClose={
                        closeApplication
                    }
                />
            )}
        </div>
    )
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
    label,
    value,
    icon,
    accent = 'emerald'
}) {
    const accentClasses = {
        emerald:
            'bg-emerald-500/10 text-emerald-500',
        amber:
            'bg-amber-500/10 text-amber-500',
        blue:
            'bg-blue-500/10 text-blue-500',
        red:
            'bg-red-500/10 text-red-500',
        slate:
            'bg-slate-500/10 text-slate-400'
    }

    return (
        <div className="p-6 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-3xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/20">
            <div
                className={`p-3 rounded-xl w-fit mb-5 ${
                    accentClasses[accent] ||
                    accentClasses.emerald
                }`}
            >
                {React.cloneElement(
                    icon,
                    {
                        className:
                            'w-5 h-5'
                    }
                )}
            </div>

            <p className="text-[10px] font-black uppercase tracking-[2px] text-slate-500">
                {label}
            </p>

            <h3 className="text-3xl font-black tracking-tighter text-white mt-2">
                {value}
            </h3>
        </div>
    )
}

/* ============================================================
   APPLICATION ROW
============================================================ */

function ApplicationRow({
    application,
    onOpen
}) {
    const id =
        application.id ||
        application._id

    const applicantName =
        application.fullName ||
        application.user?.fullName ||
        'Unknown Applicant'

    const applicantEmail =
        application.email ||
        application.user?.email ||
        'No email'

    const propertyName =
        application.propertyTitle ||
        application.property?.title ||
        application.property?.name ||
        'Unknown Property'

    const paymentMode =
        application.paymentMode ===
        'installment'
            ? 'Installment'
            : 'Full Payment'

    return (
        <tr className="border-b border-white/[0.06] hover:bg-white/[0.025] transition-colors">
            <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/10 flex items-center justify-center text-emerald-500 font-black text-xs">
                        {getInitials(
                            applicantName
                        )}
                    </div>

                    <div>
                        <p className="text-sm font-bold text-white">
                            {applicantName}
                        </p>

                        <p className="text-xs text-slate-600 mt-1">
                            {applicantEmail}
                        </p>
                    </div>
                </div>
            </td>

            <td className="px-6 py-5">
                <p className="text-sm text-slate-300 font-medium">
                    {propertyName}
                </p>

                {application.property
                    ?.location && (
                    <p className="flex items-center gap-1 text-xs text-slate-600 mt-1">
                        <MapPin className="w-3 h-3" />

                        {
                            application
                                .property
                                .location
                        }
                    </p>
                )}
            </td>

            <td className="px-6 py-5">
                <p className="text-sm text-slate-300">
                    {paymentMode}
                </p>

                {application.installmentMonths && (
                    <p className="text-xs text-slate-600 mt-1">
                        {
                            application.installmentMonths
                        }{' '}
                        months
                    </p>
                )}
            </td>

            <td className="px-6 py-5">
                <p className="text-xs text-slate-400">
                    {application.createdAt
                        ? formatDate(
                            application.createdAt
                        )
                        : '—'}
                </p>
            </td>

            <td className="px-6 py-5">
                <StatusBadge
                    status={
                        application.status
                    }
                />
            </td>

            <td className="px-6 py-5 text-right">
                <button
                    onClick={() =>
                        onOpen(id)
                    }
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/20 rounded-xl text-xs font-bold text-slate-400 hover:text-emerald-400 transition-all"
                >
                    <Eye className="w-4 h-4" />
                    Review
                </button>
            </td>
        </tr>
    )
}

/* ============================================================
   STATUS BADGE
============================================================ */

function StatusBadge({
    status
}) {
    const config =
        APPLICATION_STATUSES[status] ||
        APPLICATION_STATUSES.pending_review

    const classes = {
        emerald:
            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        amber:
            'bg-amber-500/10 text-amber-400 border-amber-500/20',
        blue:
            'bg-blue-500/10 text-blue-400 border-blue-500/20',
        red:
            'bg-red-500/10 text-red-400 border-red-500/20',
        slate:
            'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }

    return (
        <span
            className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider ${
                classes[config.color]
            }`}
        >
            {config.label}
        </span>
    )
}

/* ============================================================
   APPLICATION MODAL
============================================================ */

function ApplicationModal({
    application,
    loading,
    error,
    selectedStatus,
    setSelectedStatus,
    notes,
    setNotes,
    savingStatus,
    savingNotes,
    onStatusUpdate,
    onSaveNotes,
    onClose
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden bg-[#07111f] border border-white/10 rounded-[2rem] shadow-2xl">

                {/* MODAL HEADER */}

                <div className="px-6 md:px-8 py-5 border-b border-white/10 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[2px] text-emerald-500">
                            APPLICATION REVIEW
                        </p>

                        <h2 className="text-xl md:text-2xl font-black text-white mt-1">
                            {application?.fullName ||
                                application?.user?.fullName ||
                                'Application Details'}
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(92vh-90px)]">
                    {loading ? (
                        <div className="py-32 flex flex-col items-center justify-center">
                            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-5" />

                            <p className="text-xs font-mono text-emerald-500">
                                LOADING APPLICATION...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="p-10 text-center">
                            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />

                            <p className="text-white font-bold">
                                Unable to load application
                            </p>

                            <p className="text-sm text-slate-500 mt-2">
                                {error}
                            </p>
                        </div>
                    ) : application ? (
                        <div className="p-6 md:p-8 space-y-8">

                            {/* TOP SUMMARY */}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <SummaryCard
                                    icon={<User />}
                                    label="Applicant"
                                    value={
                                        application.fullName ||
                                        application.user?.fullName ||
                                        'Unknown'
                                    }
                                />

                                <SummaryCard
                                    icon={<MapPin />}
                                    label="Property"
                                    value={
                                        application.propertyTitle ||
                                        application.property?.title ||
                                        'Unknown Property'
                                    }
                                />

                                <SummaryCard
                                    icon={<CalendarDays />}
                                    label="Submitted"
                                    value={
                                        application.createdAt
                                            ? formatDate(
                                                application.createdAt
                                            )
                                            : '—'
                                    }
                                />
                            </div>

                            {/* DETAILS ERROR */}

                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-sm text-red-300">
                                    {error}
                                </div>
                            )}

                            {/* APPLICANT INFORMATION */}

                            <DetailSection
                                title="Applicant Information"
                                icon={<User />}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <DetailItem
                                        label="Full Name"
                                        value={
                                            application.fullName
                                        }
                                    />

                                    <DetailItem
                                        label="Email"
                                        value={
                                            application.email
                                        }
                                        icon={
                                            <Mail />
                                        }
                                    />

                                    <DetailItem
                                        label="Phone"
                                        value={
                                            application.phoneNormalized ||
                                            application.phone
                                        }
                                        icon={
                                            <Phone />
                                        }
                                    />

                                    <DetailItem
                                        label="Occupation"
                                        value={
                                            application.occupation
                                        }
                                    />

                                    <DetailItem
                                        label="Address"
                                        value={
                                            application.address
                                        }
                                    />

                                    <DetailItem
                                        label="ID Number"
                                        value={
                                            application.idNumber
                                        }
                                    />
                                </div>
                            </DetailSection>

                            {/* PROPERTY INFORMATION */}

                            <DetailSection
                                title="Property Information"
                                icon={
                                    <MapPin />
                                }
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <DetailItem
                                        label="Property"
                                        value={
                                            application.propertyTitle ||
                                            application.property?.title
                                        }
                                    />

                                    <DetailItem
                                        label="Location"
                                        value={
                                            application.property?.location
                                        }
                                    />

                                    <DetailItem
                                        label="Payment Mode"
                                        value={
                                            application.paymentMode ===
                                            'installment'
                                                ? 'Installment'
                                                : 'Full Payment'
                                        }
                                        icon={
                                            <CreditCard />
                                        }
                                    />

                                    <DetailItem
                                        label="Installment Duration"
                                        value={
                                            application.installmentMonths
                                                ? `${application.installmentMonths} months`
                                                : 'Not applicable'
                                        }
                                    />
                                </div>
                            </DetailSection>

                            {/* NEXT OF KIN */}

                            {(application.nextOfKinName ||
                                application.nextOfKinPhone ||
                                application.nextOfKinRelationship) && (
                                <DetailSection
                                    title="Next of Kin"
                                    icon={
                                        <Users />
                                    }
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        <DetailItem
                                            label="Name"
                                            value={
                                                application.nextOfKinName
                                            }
                                        />

                                        <DetailItem
                                            label="Phone"
                                            value={
                                                application.nextOfKinPhone
                                            }
                                            icon={
                                                <Phone />
                                            }
                                        />

                                        <DetailItem
                                            label="Relationship"
                                            value={
                                                application.nextOfKinRelationship
                                            }
                                        />
                                    </div>
                                </DetailSection>
                            )}

                            {/* REALTOR / REFERRAL */}

                            {(application.realtor ||
                                application.realtorName ||
                                application.referralSource) && (
                                <DetailSection
                                    title="Realtor / Referral"
                                    icon={
                                        <Users />
                                    }
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                        <DetailItem
                                            label="Realtor"
                                            value={
                                                application.realtorName ||
                                                application.realtor?.name ||
                                                application.realtor?.fullName
                                            }
                                        />

                                        <DetailItem
                                            label="Realtor Phone"
                                            value={
                                                application.realtor?.phone
                                            }
                                            icon={
                                                <Phone />
                                            }
                                        />

                                        <DetailItem
                                            label="Realtor Email"
                                            value={
                                                application.realtor?.email
                                            }
                                            icon={
                                                <Mail />
                                            }
                                        />

                                        <DetailItem
                                            label="Referral Source"
                                            value={
                                                application.referralSource
                                            }
                                        />
                                    </div>
                                </DetailSection>
                            )}

                            {/* DOCUMENTS */}

                            {Array.isArray(
                                application.documents
                            ) &&
                                application.documents.length >
                                    0 && (
                                    <DetailSection
                                        title="Documents"
                                        icon={
                                            <FileText />
                                        }
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {application.documents.map(
                                                (
                                                    document,
                                                    index
                                                ) => (
                                                    <DocumentItem
                                                        key={
                                                            document.id ||
                                                            document._id ||
                                                            index
                                                        }
                                                        document={
                                                            document
                                                        }
                                                    />
                                                )
                                            )}
                                        </div>
                                    </DetailSection>
                                )}

                            {/* REVIEW CONTROLS */}

                            <DetailSection
                                title="Application Review"
                                icon={
                                    <ShieldCheck />
                                }
                            >
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[2px] text-slate-600 mb-3">
                                            Current Status
                                        </label>

                                        <StatusBadge
                                            status={
                                                application.status
                                            }
                                        />
                                    </div>

                                    {STATUS_TRANSITIONS[
                                        application.status
                                    ]?.length > 0 ? (
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-[2px] text-slate-600 mb-3">
                                                Change Status
                                            </label>

                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <select
                                                    value={
                                                        selectedStatus
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        setSelectedStatus(
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    className="flex-1 px-4 py-3.5 bg-[#020617] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50"
                                                >
                                                    <option
                                                        value={
                                                            application.status
                                                        }
                                                    >
                                                        Keep Current Status
                                                    </option>

                                                    {STATUS_TRANSITIONS[
                                                        application.status
                                                    ].map(
                                                        (
                                                            status
                                                        ) => (
                                                            <option
                                                                key={
                                                                    status
                                                                }
                                                                value={
                                                                    status
                                                                }
                                                            >
                                                                {
                                                                    APPLICATION_STATUSES[
                                                                        status
                                                                    ]
                                                                        ?.label
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                                </select>

                                                <button
                                                    onClick={
                                                        onStatusUpdate
                                                    }
                                                    disabled={
                                                        savingStatus ||
                                                        selectedStatus ===
                                                            application.status
                                                    }
                                                    className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-bold text-white transition-all"
                                                >
                                                    {savingStatus ? (
                                                        <>
                                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                                            Updating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            Update Status
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl">
                                            <p className="text-xs text-slate-500">
                                                This application is in a
                                                final status and cannot
                                                be changed.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </DetailSection>

                            {/* ADMIN NOTES */}

                            <DetailSection
                                title="Admin Notes"
                                icon={
                                    <MessageSquare />
                                }
                            >
                                <textarea
                                    value={notes}
                                    onChange={(
                                        event
                                    ) =>
                                        setNotes(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    rows={6}
                                    maxLength={10000}
                                    placeholder="Add internal notes about this application..."
                                    className="w-full px-4 py-4 bg-[#020617] border border-white/10 rounded-2xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 resize-none"
                                />

                                <div className="flex items-center justify-between mt-3">
                                    <p className="text-[10px] text-slate-600">
                                        {notes.length.toLocaleString()}
                                        /10,000 characters
                                    </p>

                                    <button
                                        onClick={
                                            onSaveNotes
                                        }
                                        disabled={
                                            savingNotes
                                        }
                                        className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white disabled:opacity-40 transition-all"
                                    >
                                        {savingNotes ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                Save Notes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </DetailSection>

                            {/* REVIEW METADATA */}

                            {(application.reviewedAt ||
                                application.reviewedBy) && (
                                <div className="pt-2 border-t border-white/10">
                                    <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-slate-600">
                                        {application.reviewedAt && (
                                            <span>
                                                Reviewed:{' '}
                                                {formatDate(
                                                    application.reviewedAt
                                                )}
                                            </span>
                                        )}

                                        {application.reviewedBy && (
                                            <span>
                                                Reviewed by:{' '}
                                                {application
                                                    .reviewedBy
                                                    ?.fullName ||
                                                    application
                                                        .reviewedBy
                                                        ?.email ||
                                                    'Admin'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}

/* ============================================================
   DETAIL SECTION
============================================================ */

function DetailSection({
    title,
    icon,
    children
}) {
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="text-emerald-500">
                    {React.cloneElement(
                        icon,
                        {
                            className:
                                'w-4 h-4'
                        }
                    )}
                </div>

                <h3 className="text-xs font-black uppercase tracking-[2px] text-slate-500">
                    {title}
                </h3>
            </div>

            <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl">
                {children}
            </div>
        </section>
    )
}

/* ============================================================
   DETAIL ITEM
============================================================ */

function DetailItem({
    label,
    value,
    icon
}) {
    const getDisplayValue = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === ''
        ) {
            return 'Not provided'
        }

        if (
            typeof value === 'string' ||
            typeof value === 'number'
        ) {
            return String(value)
        }

        if (typeof value === 'boolean') {
            return value
                ? 'Yes'
                : 'No'
        }

        if (Array.isArray(value)) {
            if (value.length === 0) {
                return 'Not provided'
            }

            return value
                .map((item) => {
                    if (
                        item === null ||
                        item === undefined
                    ) {
                        return ''
                    }

                    if (
                        typeof item ===
                            'string' ||
                        typeof item ===
                            'number'
                    ) {
                        return String(
                            item
                        )
                    }

                    if (
                        typeof item ===
                        'object'
                    ) {
                        return (
                            item.name ||
                            item.fullName ||
                            item.title ||
                            item.email ||
                            item.phone ||
                            item.location ||
                            'Information provided'
                        )
                    }

                    return String(
                        item
                    )
                })
                .filter(Boolean)
                .join(', ')
        }

        if (
            typeof value ===
            'object'
        ) {
            return (
                value.name ||
                value.fullName ||
                value.title ||
                value.email ||
                value.phone ||
                value.location ||
                'Information provided'
            )
        }

        return String(value)
    }

    return (
        <div>
            <p className="text-[10px] font-black uppercase tracking-[1.5px] text-slate-600 mb-1.5">
                {label}
            </p>

            <div className="flex items-start gap-2">
                {icon && (
                    <span className="text-slate-600 mt-0.5">
                        {React.cloneElement(
                            icon,
                            {
                                className:
                                    'w-3.5 h-3.5'
                            }
                        )}
                    </span>
                )}

                <p className="text-sm text-slate-300 break-words">
                    {getDisplayValue(
                        value
                    )}
                </p>
            </div>
        </div>
    )
}

/* ============================================================
   SUMMARY CARD
============================================================ */

function SummaryCard({
    icon,
    label,
    value
}) {
    return (
        <div className="p-5 bg-white/[0.03] border border-white/10 rounded-2xl">
            <div className="flex items-center gap-2 text-emerald-500 mb-3">
                {React.cloneElement(
                    icon,
                    {
                        className:
                            'w-4 h-4'
                    }
                )}

                <span className="text-[10px] font-black uppercase tracking-[1.5px] text-slate-600">
                    {label}
                </span>
            </div>

            <p className="text-sm font-bold text-white truncate">
                {value || '—'}
            </p>
        </div>
    )
}

/* ============================================================
   DOCUMENT ITEM
============================================================ */

function DocumentItem({
    document
}) {
    const url =
        document.url ||
        document.fileUrl ||
        document.downloadUrl

    return (
        <div className="flex items-center justify-between gap-4 p-4 bg-[#020617] border border-white/10 rounded-xl">
            <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 shrink-0 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-emerald-500" />
                </div>

                <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-300 truncate">
                        {document.name ||
                            document.filename ||
                            document.type ||
                            'Document'}
                    </p>

                    {document.type && (
                        <p className="text-[10px] text-slate-600 mt-0.5">
                            {document.type}
                        </p>
                    )}
                </div>
            </div>

            {url && (
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-500 hover:text-emerald-400 transition-all"
                >
                    <ExternalLink className="w-4 h-4" />
                </a>
            )}
        </div>
    )
}

/* ============================================================
   LOADING TABLE
============================================================ */

function LoadingTable() {
    return (
        <div className="p-10">
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(
                    (item) => (
                        <div
                            key={item}
                            className="h-16 bg-white/[0.03] rounded-2xl animate-pulse"
                        />
                    )
                )}
            </div>
        </div>
    )
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState() {
    return (
        <div className="py-20 text-center">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <FileText className="w-7 h-7 text-slate-600" />
            </div>

            <h3 className="text-lg font-bold text-white">
                No Applications Found
            </h3>

            <p className="text-sm text-slate-600 mt-2">
                Try changing your search or status filter.
            </p>
        </div>
    )
}

/* ============================================================
   HELPERS
============================================================ */

function getInitials(name) {
    if (!name) {
        return '??'
    }

    return name
        .split(' ')
        .filter(Boolean)
        .map(
            (part) => part[0]
        )
        .join('')
        .substring(0, 2)
        .toUpperCase()
}