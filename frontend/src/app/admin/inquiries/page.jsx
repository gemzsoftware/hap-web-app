'use client'

import React, { useCallback, useEffect, useState } from 'react'
import {
  Search,
  RefreshCw,
  MessageSquare,
  X,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  User,
  Clock,
  CheckCircle2,
  CircleDot,
  Loader2,
  Save
} from 'lucide-react'
import { adminAPI } from '@/lib/api/client'
import { formatDate } from '@/lib/storage'

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' }
]

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [savingStatus, setSavingStatus] = useState(false)
  const [savingNotes, setSavingNotes] = useState(false)
  const [notes, setNotes] = useState('')
  const [actionMessage, setActionMessage] = useState('')

  const loadInquiries = useCallback(async () => {
    try {
      setError('')

      const response = await adminAPI.getInquiries({
        page,
        limit: 20,
        ...(search.trim() ? { q: search.trim() } : {}),
        ...(status ? { status } : {})
      })

      const data = response?.data || []
      const meta = response?.meta || null

      setInquiries(Array.isArray(data) ? data : [])
      setPagination(meta)
    } catch (err) {
      console.error('Failed to load inquiries:', err)
      setInquiries([])
      setPagination(null)
      setError(
        err?.message ||
        'Failed to load enquiries. Please try again.'
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [page, search, status])

  useEffect(() => {
    loadInquiries()
  }, [loadInquiries])

  useEffect(() => {
    setPage(1)
  }, [search, status])

  const handleRefresh = () => {
    if (refreshing) return

    setRefreshing(true)
    loadInquiries()
  }

  const openInquiry = async (inquiry) => {
    const inquiryId = inquiry?.id || inquiry?._id

    if (!inquiryId) return

    setSelectedInquiry(inquiry)
    setNotes(inquiry.adminNotes || '')
    setActionMessage('')
    setDetailLoading(true)

    try {
      const response = await adminAPI.getInquiryById(inquiryId)
      const data = response?.data || response?.inquiry

      if (data) {
        setSelectedInquiry(data)
        setNotes(data.adminNotes || '')
      }
    } catch (err) {
      console.error('Failed to load inquiry:', err)
      setActionMessage(
        err?.message || 'Failed to load enquiry details.'
      )
    } finally {
      setDetailLoading(false)
    }
  }

  const closeInquiry = () => {
    setSelectedInquiry(null)
    setNotes('')
    setActionMessage('')
  }

  const handleStatusChange = async (newStatus) => {
    const inquiryId =
      selectedInquiry?.id || selectedInquiry?._id

    if (!inquiryId || savingStatus) return

    setSavingStatus(true)
    setActionMessage('')

    try {
      const response = await adminAPI.updateInquiryStatus(
        inquiryId,
        newStatus
      )

      const updated = response?.data || response?.inquiry

      if (updated) {
        setSelectedInquiry(updated)
        setNotes(updated.adminNotes || '')

        setInquiries((current) =>
          current.map((item) =>
            (item.id || item._id) === inquiryId
              ? updated
              : item
          )
        )
      } else {
        setSelectedInquiry((current) =>
          current
            ? {
              ...current,
              status: newStatus
            }
            : current
        )

        setInquiries((current) =>
          current.map((item) =>
            (item.id || item._id) === inquiryId
              ? {
                ...item,
                status: newStatus
              }
              : item
          )
        )
      }

      setActionMessage('Status updated successfully.')
    } catch (err) {
      console.error('Failed to update inquiry status:', err)
      setActionMessage(
        err?.message || 'Failed to update status.'
      )
    } finally {
      setSavingStatus(false)
    }
  }

  const handleSaveNotes = async () => {
    const inquiryId =
      selectedInquiry?.id || selectedInquiry?._id

    if (!inquiryId || savingNotes) return

    setSavingNotes(true)
    setActionMessage('')

    try {
      const response = await adminAPI.updateInquiryNotes(
        inquiryId,
        notes
      )

      const updated = response?.data || response?.inquiry

      if (updated) {
        setSelectedInquiry(updated)
        setNotes(updated.adminNotes || '')

        setInquiries((current) =>
          current.map((item) =>
            (item.id || item._id) === inquiryId
              ? updated
              : item
          )
        )
      } else {
        setSelectedInquiry((current) =>
          current
            ? {
              ...current,
              adminNotes: notes
            }
            : current
        )
      }

      setActionMessage('Notes saved successfully.')
    } catch (err) {
      console.error('Failed to save inquiry notes:', err)
      setActionMessage(
        err?.message || 'Failed to save notes.'
      )
    } finally {
      setSavingNotes(false)
    }
  }

  const totalPages = pagination?.totalPages || 1

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-10">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div>
            <p className="text-emerald-500 text-xs font-bold uppercase tracking-[3px] mb-3">
              CUSTOMER COMMUNICATION
            </p>

            <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
              INQUIRIES
            </h1>

            <p className="text-slate-400 mt-3 text-base">
              Review and manage customer enquiries.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 transition-all text-sm font-bold"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''
                }`}
            />

            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search name, email, phone or message..."
              className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-emerald-500/50 transition-all"
            />
          </div>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            className="bg-[#0f172a] border border-white/10 rounded-2xl px-4 py-4 text-white outline-none focus:border-emerald-500/50"
          >
            <option value="">All Statuses</option>

            {STATUS_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 p-5 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-400">
            {error}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto mb-4" />

              <p className="text-slate-500 text-sm">
                Loading enquiries...
              </p>
            </div>
          </div>
        ) : inquiries.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <InquiryRow
                key={inquiry.id || inquiry._id}
                inquiry={inquiry}
                onClick={() => openInquiry(inquiry)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && inquiries.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
            <p className="text-sm text-slate-500">
              Page {pagination?.page || page} of {totalPages}
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setPage((current) =>
                    Math.max(1, current - 1)
                  )
                }
                disabled={page <= 1}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 hover:bg-white/10 transition-all text-sm"
              >
                Previous
              </button>

              <button
                onClick={() =>
                  setPage((current) =>
                    Math.min(totalPages, current + 1)
                  )
                }
                disabled={page >= totalPages}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 hover:bg-white/10 transition-all text-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      {selectedInquiry && (
        <InquiryDrawer
          inquiry={selectedInquiry}
          notes={notes}
          setNotes={setNotes}
          detailLoading={detailLoading}
          savingStatus={savingStatus}
          savingNotes={savingNotes}
          actionMessage={actionMessage}
          onClose={closeInquiry}
          onStatusChange={handleStatusChange}
          onSaveNotes={handleSaveNotes}
        />
      )}
    </div>
  )
}

/* =========================
   INQUIRY ROW
========================= */

function InquiryRow({ inquiry, onClick }) {
  const status = getStatusConfig(inquiry.status)

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-6 md:p-7 rounded-3xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] hover:border-emerald-500/20 transition-all duration-300 group"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

        <div className="flex items-start gap-5 min-w-0">
          <div className="w-12 h-12 shrink-0 rounded-2xl bg-emerald-500/10 border border-emerald-500/10 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-emerald-500" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-bold text-white">
                {inquiry.name || 'Unknown'}
              </h3>

              <StatusBadge status={inquiry.status} />
            </div>

            <p className="text-sm text-slate-500 mt-1">
              {inquiry.email || 'No email'}
            </p>

            <p className="text-sm text-slate-400 mt-3 line-clamp-2">
              {inquiry.message || 'No message'}
            </p>
          </div>
        </div>

        <div className="lg:text-right shrink-0 space-y-2">
          {inquiry.propertyId?.title && (
            <p className="text-xs text-emerald-500 font-bold">
              {inquiry.propertyId.title}
            </p>
          )}

          <p className="text-xs text-slate-600">
            {inquiry.createdAt
              ? formatDate(inquiry.createdAt)
              : 'Recent'}
          </p>

          <p className="text-xs text-slate-500 group-hover:text-emerald-500 transition-colors">
            Review enquiry →
          </p>
        </div>
      </div>
    </button>
  )
}

/* =========================
   DETAIL DRAWER
========================= */

function InquiryDrawer({
  inquiry,
  notes,
  setNotes,
  detailLoading,
  savingStatus,
  savingNotes,
  actionMessage,
  onClose,
  onStatusChange,
  onSaveNotes
}) {
  const property = inquiry.propertyId

  return (
    <div className="fixed inset-0 z-50">
      <button
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-default"
        aria-label="Close enquiry"
      />

      <aside className="absolute right-0 top-0 h-full w-full max-w-2xl bg-[#07111f] border-l border-white/10 shadow-2xl overflow-y-auto">

        {/* Drawer Header */}
        <div className="sticky top-0 z-10 bg-[#07111f]/95 backdrop-blur-xl border-b border-white/10 p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[2px] text-emerald-500">
              ENQUIRY REVIEW
            </p>

            <h2 className="text-2xl font-black text-white mt-1">
              {inquiry.name || 'Unknown'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {detailLoading ? (
          <div className="flex items-center justify-center min-h-[500px]">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        ) : (
          <div className="p-6 space-y-8">

            {/* Status */}
            <section>
              <SectionLabel>Current Status</SectionLabel>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {STATUS_OPTIONS.map((option) => {
                  const active =
                    inquiry.status === option.value

                  return (
                    <button
                      key={option.value}
                      onClick={() =>
                        onStatusChange(option.value)
                      }
                      disabled={savingStatus}
                      className={`p-4 rounded-2xl border text-left transition-all ${active
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                          : 'bg-white/[0.03] border-white/10 text-slate-400 hover:bg-white/[0.06]'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        {active ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <CircleDot className="w-4 h-4" />
                        )}

                        <span className="text-xs font-bold">
                          {option.label}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>

              {savingStatus && (
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-3">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Updating status...
                </div>
              )}
            </section>

            {/* Customer */}
            <section>
              <SectionLabel>Customer Information</SectionLabel>

              <div className="rounded-3xl bg-white/[0.03] border border-white/10 divide-y divide-white/10">
                <InfoRow
                  icon={<User />}
                  label="Name"
                  value={inquiry.name}
                />

                <InfoRow
                  icon={<Mail />}
                  label="Email"
                  value={inquiry.email}
                />

                {inquiry.phone && (
                  <InfoRow
                    icon={<Phone />}
                    label="Phone"
                    value={inquiry.phone}
                  />
                )}

                <InfoRow
                  icon={<CalendarDays />}
                  label="Submitted"
                  value={
                    inquiry.createdAt
                      ? formatDate(inquiry.createdAt)
                      : 'Unknown'
                  }
                />

                {inquiry.reviewedAt && (
                  <InfoRow
                    icon={<Clock />}
                    label="Last Reviewed"
                    value={formatDate(inquiry.reviewedAt)}
                  />
                )}
              </div>
            </section>

            {/* Property */}
            {property && (
              <section>
                <SectionLabel>Property</SectionLabel>

                <div className="p-6 rounded-3xl bg-emerald-500/[0.03] border border-emerald-500/10">
                  <h3 className="font-bold text-white text-lg">
                    {property.title || 'Property'}
                  </h3>

                  {property.location && (
                    <div className="flex items-center gap-2 text-sm text-slate-400 mt-3">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      {property.location}
                    </div>
                  )}

                  {property.price !== undefined && (
                    <p className="text-emerald-500 font-bold mt-3">
                      ₦
                      {Number(property.price).toLocaleString()}
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* Message */}
            <section>
              <SectionLabel>Customer Message</SectionLabel>

              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10">
                <p className="text-slate-300 leading-8 whitespace-pre-wrap">
                  {inquiry.message || 'No message provided.'}
                </p>
              </div>
            </section>

            {/* Admin Notes */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <SectionLabel>Internal Admin Notes</SectionLabel>

                <span className="text-[10px] uppercase tracking-wider text-slate-600">
                  Only admins can see this
                </span>
              </div>

              <textarea
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                maxLength={5000}
                rows={7}
                placeholder="Add notes about calls, follow-ups, customer preferences, or next steps..."
                className="w-full resize-none rounded-3xl bg-white/[0.03] border border-white/10 px-5 py-4 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-500/40 transition-all"
              />

              <div className="flex items-center justify-between gap-4 mt-3">
                <span className="text-xs text-slate-600">
                  {notes.length}/5000
                </span>

                <button
                  onClick={onSaveNotes}
                  disabled={savingNotes}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-all text-sm font-bold"
                >
                  {savingNotes ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}

                  {savingNotes ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </section>

            {/* Reviewer */}
            {inquiry.reviewedBy && (
              <section>
                <SectionLabel>Last Reviewed By</SectionLabel>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <p className="font-semibold text-white">
                    {inquiry.reviewedBy.fullName || 'Admin'}
                  </p>

                  {inquiry.reviewedBy.email && (
                    <p className="text-xs text-slate-500 mt-1">
                      {inquiry.reviewedBy.email}
                    </p>
                  )}
                </div>
              </section>
            )}

            {actionMessage && (
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-sm">
                {actionMessage}
              </div>
            )}
          </div>
        )}
      </aside>
    </div>
  )
}

/* =========================
   HELPERS
========================= */

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-black uppercase tracking-[2px] text-slate-500 mb-4">
      {children}
    </p>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="p-5 flex items-center gap-4">
      <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500 shrink-0">
        {React.cloneElement(icon, {
          className: 'w-4 h-4'
        })}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-slate-600">
          {label}
        </p>

        <p className="text-sm text-slate-300 mt-1 break-words">
          {value || 'Not provided'}
        </p>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const config = getStatusConfig(status)

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}

function getStatusConfig(status) {
  const configs = {
    new: {
      label: 'New',
      className:
        'bg-blue-500/10 border-blue-500/20 text-blue-400',
      dot: 'bg-blue-400'
    },
    contacted: {
      label: 'Contacted',
      className:
        'bg-amber-500/10 border-amber-500/20 text-amber-400',
      dot: 'bg-amber-400'
    },
    in_progress: {
      label: 'In Progress',
      className:
        'bg-purple-500/10 border-purple-500/20 text-purple-400',
      dot: 'bg-purple-400'
    },
    resolved: {
      label: 'Resolved',
      className:
        'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      dot: 'bg-emerald-400'
    },
    closed: {
      label: 'Closed',
      className:
        'bg-slate-500/10 border-slate-500/20 text-slate-400',
      dot: 'bg-slate-400'
    }
  }

  return (
    configs[status] || {
      label: status || 'Unknown',
      className:
        'bg-white/5 border-white/10 text-slate-400',
      dot: 'bg-slate-400'
    }
  )
}

function EmptyState() {
  return (
    <div className="min-h-[400px] flex items-center justify-center rounded-3xl bg-white/[0.02] border border-white/10">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/10 flex items-center justify-center mx-auto mb-5">
          <MessageSquare className="w-7 h-7 text-emerald-500" />
        </div>

        <h2 className="text-xl font-bold text-white">
          No enquiries found
        </h2>

        <p className="text-sm text-slate-500 mt-2">
          New customer enquiries will appear here when they are submitted.
        </p>
      </div>
    </div>
  )
}