/**
 * Format number to Nigerian Naira currency string
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

/**
 * Format date to readable string
 * @param {Date|string} date
 * @returns {string}
 */
export function formatDate(date) {
    return new Intl.DateTimeFormat('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date))
}

/**
 * Calculate payment progress percentage
 * @param {number} paid
 * @param {number} total
 * @returns {number}
 */
export function calculateProgress(paid, total) {
    if (total === 0) return 0
    return Math.round((paid / total) * 100)
}

/**
 * Generate receipt number
 * @returns {string}
 */
export function generateReceiptNumber() {
    const date = new Date()
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `HAP-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${random}`
}

/**
 * Get status color class
 * @param {string} status
 * @returns {string}
 */
export function getStatusColor(status) {
    const colors = {
        available: 'bg-green-100 text-green-700',
        sold: 'bg-red-100 text-red-700',
        reserved: 'bg-yellow-100 text-yellow-700',
        active: 'bg-blue-100 text-blue-700',
        completed: 'bg-green-100 text-green-700',
        defaulted: 'bg-red-100 text-red-700',
        pending: 'bg-yellow-100 text-yellow-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
}

/**
 * Truncate text with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
}