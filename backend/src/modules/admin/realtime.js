// ============================================
// FILE: backend/src/modules/admin/realtime.js
// ============================================

import { User } from '../../models/User.js';
import { AdminNotification } from '../../models/AdminNotification.js';
import { ADMIN_ROLES } from '../../utils/roles.js';
import { verifyToken } from '../../utils/token.js';

const adminSockets = new Set();

/**
 * Send a JSON payload to a WebSocket client.
 */
function send(socket, payload) {
  try {
    if (socket.readyState === 1) {
      socket.send(JSON.stringify(payload));
      return true;
    }
  } catch {
    // Socket may have disconnected between the readyState
    // check and the send operation.
  }

  return false;
}

/**
 * Remove a socket from the active admin connection registry.
 */
function removeSocket(socket) {
  adminSockets.delete(socket);
}

/**
 * Get the current unread admin notification count directly
 * from MongoDB.
 *
 * MongoDB is the source of truth.
 */
export async function getAdminUnreadCount() {
  return AdminNotification.countDocuments({
    read: false
  });
}

/**
 * Broadcast a newly-created AdminNotification to all currently
 * authenticated admin/staff WebSocket clients.
 *
 * The unread count is queried from MongoDB rather than being
 * calculated locally so the frontend always receives the
 * authoritative count.
 *
 * MongoDB remains the source of truth.
 * WebSocket is only the real-time delivery mechanism.
 */
export async function emitAdminNotification(notification) {
  if (!notification) return;

  try {
    const unreadCount = await getAdminUnreadCount();

    const payload = {
      event: 'admin:notification',
      notification,
      unreadCount
    };

    for (const socket of adminSockets) {
      if (!send(socket, payload)) {
        removeSocket(socket);
      }
    }
  } catch (error) {
    // A realtime notification failure must never break the
    // business operation that created the notification.
    console.error(
      'Failed to broadcast admin notification:',
      error.message
    );
  }
}

/**
 * Send the current unread notification count to one
 * authenticated admin/staff client.
 */
export async function sendAdminUnreadCount(socket) {
  try {
    const unreadCount = await getAdminUnreadCount();

    return send(socket, {
      event: 'admin:notifications:count',
      unreadCount
    });
  } catch (error) {
    console.error(
      'Failed to send admin unread notification count:',
      error.message
    );

    return false;
  }
}

/**
 * Broadcast the current unread notification count to every
 * connected admin/staff client.
 *
 * Useful when a notification is marked as read or when all
 * notifications are marked as read.
 */
export async function broadcastAdminUnreadCount() {
  try {
    const unreadCount = await getAdminUnreadCount();

    const payload = {
      event: 'admin:notifications:count',
      unreadCount
    };

    for (const socket of adminSockets) {
      if (!send(socket, payload)) {
        removeSocket(socket);
      }
    }

    return unreadCount;
  } catch (error) {
    console.error(
      'Failed to broadcast admin unread notification count:',
      error.message
    );

    return null;
  }
}

/**
 * Authenticate an admin/staff WebSocket connection.
 *
 * The browser cannot reliably send a normal Authorization header
 * when creating a WebSocket, so the client sends:
 *
 * {
 *   type: 'auth',
 *   token: 'JWT...'
 * }
 */
export async function authenticateAdminSocket(socket, token) {
  if (!token || typeof token !== 'string') {
    throw new Error('Authentication token is required');
  }

  const payload = verifyToken(token);

  if (!ADMIN_ROLES.includes(payload.role)) {
    throw new Error('Admin access required');
  }

  const user = await User.findById(payload.sub);

  if (!user) {
    throw new Error('Account not found');
  }

  if (user.status === 'deleted') {
    throw new Error('Account not found');
  }

  if (user.status === 'suspended') {
    throw new Error('Account suspended');
  }

  if (user.status === 'pending_verification') {
    throw new Error('Account is not verified');
  }

  if (
    Number(payload.tv || 0) !==
    Number(user.tokenVersion || 0)
  ) {
    throw new Error('Session is no longer valid');
  }

  return user;
}

/**
 * Add an authenticated admin/staff WebSocket client.
 */
export function addAdminSocket(socket) {
  adminSockets.add(socket);
}

/**
 * Remove an admin/staff WebSocket client.
 */
export function removeAdminSocket(socket) {
  adminSockets.delete(socket);
}

/**
 * Return the number of currently connected admin/staff
 * WebSocket clients.
 */
export function getAdminSocketCount() {
  return adminSockets.size;
}