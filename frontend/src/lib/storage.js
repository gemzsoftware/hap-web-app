'use client'

const DEFAULT_LOCK_TTL = 5000

export function readStorage(key, fallback = null) {
    if (typeof window === 'undefined') return fallback

    try {
        const raw = window.localStorage.getItem(key)
        if (raw === null) return fallback
        return JSON.parse(raw)
    } catch (error) {
        console.warn(`[storage] Invalid data for "${key}". Using fallback.`, error)
        return fallback
    }
}

export function writeStorage(key, value) {
    if (typeof window === 'undefined') return false

    try {
        window.localStorage.setItem(key, JSON.stringify(value))
        return true
    } catch (error) {
        console.error(`[storage] Failed to write "${key}".`, error)
        return false
    }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function acquireFallbackLock(key, ttl = DEFAULT_LOCK_TTL) {
    const lockKey = `__lock__:${key}`
    const owner = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const startedAt = Date.now()

    while (Date.now() - startedAt < ttl) {
        const now = Date.now()
        const current = readStorage(lockKey, null)

        if (!current || current.expiresAt <= now) {
            writeStorage(lockKey, { owner, expiresAt: now + ttl })
            const confirmed = readStorage(lockKey, null)
            if (confirmed?.owner === owner) {
                return () => {
                    const latest = readStorage(lockKey, null)
                    if (latest?.owner === owner) {
                        window.localStorage.removeItem(lockKey)
                    }
                }
            }
        }

        await sleep(25 + Math.floor(Math.random() * 40))
    }

    throw new Error(`Could not acquire storage lock for ${key}`)
}

export async function withStorageLock(key, callback) {
    if (typeof window === 'undefined') return callback()

    if (navigator.locks?.request) {
        return navigator.locks.request(`hap-storage:${key}`, { mode: 'exclusive' }, callback)
    }

    const release = await acquireFallbackLock(key)
    try {
        return await callback()
    } finally {
        release()
    }
}

export async function updateStorage(key, updater, fallback = []) {
    return withStorageLock(key, async () => {
        const current = readStorage(key, fallback)
        const next = await updater(current)
        writeStorage(key, next)
        return next
    })
}

export function createUniqueId(prefix = 'ID') {
    const uuid = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`

    return `${prefix}-${uuid}`
}

export function getUserId(user) {
    if (!user) return null
    return user._id ?? user.id ?? user.userId ?? user.uuid ?? user?.data?.id ?? user?.data?._id ?? user?.user?.id ?? user?.user?._id ?? null
}

export function formatDate(value) {
    if (!value) return 'N/A'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'N/A'

    return new Intl.DateTimeFormat('en-NG', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(date)
}
