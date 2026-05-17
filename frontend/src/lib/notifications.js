/**
 * Add a notification for a user
 * @param {string} userEmail - Email of the user
 * @param {Object} notification - Notification data
 */
export function addNotification(userEmail, notification) {
    const stored = localStorage.getItem('notifications')
    const allNotifications = stored ? JSON.parse(stored) : []

    const newNotification = {
        id: `NOTIF-${Date.now()}`,
        userEmail: userEmail,
        title: notification.title,
        message: notification.message,
        type: notification.type, // payment_verified | payment_declined | document_added | payment_pending
        propertyTitle: notification.propertyTitle || '',
        amount: notification.amount || null,
        receiptNumber: notification.receiptNumber || null,
        documentType: notification.documentType || null,
        read: false,
        createdAt: new Date().toISOString()
    }

    allNotifications.push(newNotification)
    localStorage.setItem('notifications', JSON.stringify(allNotifications))
}

/**
 * Get notifications for a user
 * @param {string} userEmail
 * @returns {Array}
 */
export function getUserNotifications(userEmail) {
    const stored = localStorage.getItem('notifications')
    const allNotifications = stored ? JSON.parse(stored) : []

    return allNotifications
        .filter(n => n.userEmail === userEmail)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

/**
 * Get unread count
 * @param {string} userEmail
 * @returns {number}
 */
export function getUnreadCount(userEmail) {
    const stored = localStorage.getItem('notifications')
    const allNotifications = stored ? JSON.parse(stored) : []

    return allNotifications.filter(n => n.userEmail === userEmail && !n.read).length
}

/**
 * Mark notification as read
 * @param {string} notificationId
 */
export function markAsRead(notificationId) {
    const stored = localStorage.getItem('notifications')
    const allNotifications = stored ? JSON.parse(stored) : []
    const updated = allNotifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
    )
    localStorage.setItem('notifications', JSON.stringify(updated))
}

/**
 * Mark all notifications as read for a user
 * @param {string} userEmail
 */
export function markAllAsRead(userEmail) {
    const stored = localStorage.getItem('notifications')
    const allNotifications = stored ? JSON.parse(stored) : []
    const updated = allNotifications.map(n =>
        n.userEmail === userEmail ? { ...n, read: true } : n
    )
    localStorage.setItem('notifications', JSON.stringify(updated))
}