// ============================================
// FILE: backend/src/modules/admin/realtime-routes.js
// ============================================

import {
  authenticateAdminSocket,
  addAdminSocket,
  removeAdminSocket,
  sendAdminUnreadCount
} from './realtime.js';

export async function adminRealtimeRoutes(app) {
  app.get(
    '/notifications',
    {
      websocket: true
    },
    (socket, request) => {
      let authenticated = false;
      let closed = false;

      // Give the browser a clear signal that authentication
      // is expected immediately after connection.
      try {
        socket.send(
          JSON.stringify({
            event: 'admin:auth_required'
          })
        );
      } catch {
        socket.close();
        return;
      }

      const authenticationTimeout = setTimeout(() => {
        if (!authenticated && !closed) {
          try {
            socket.send(
              JSON.stringify({
                event: 'admin:auth_error',
                message: 'Authentication timeout'
              })
            );
          } catch {
            // Ignore socket errors during shutdown.
          }

          try {
            socket.close();
          } catch {
            // Ignore already-closed sockets.
          }
        }
      }, 10000);

      socket.on('message', async rawMessage => {
        if (closed) return;

        let message;

        try {
          message = JSON.parse(rawMessage.toString());
        } catch {
          try {
            socket.send(
              JSON.stringify({
                event: 'admin:auth_error',
                message: 'Invalid message format'
              })
            );
          } catch {
            // Ignore socket errors.
          }

          return;
        }

        // ============================================
        // AUTHENTICATION
        // ============================================

        if (!authenticated) {
          if (message?.type !== 'auth') {
            try {
              socket.send(
                JSON.stringify({
                  event: 'admin:auth_error',
                  message: 'Authentication required'
                })
              );
            } catch {
              // Ignore socket errors.
            }

            return;
          }

          try {
            const user = await authenticateAdminSocket(
              socket,
              message.token
            );

            if (closed) return;

            authenticated = true;

            clearTimeout(authenticationTimeout);

            addAdminSocket(socket);

            // Confirm successful authentication.
            try {
              socket.send(
                JSON.stringify({
                  event: 'admin:authenticated',
                  user: {
                    id: user._id.toString(),
                    role: user.role,
                    fullName: user.fullName,
                    email: user.email
                  }
                })
              );
            } catch {
              removeAdminSocket(socket);
              return;
            }

            // Send the current unread count immediately after
            // authentication.
            //
            // This makes MongoDB the source of truth when the
            // admin first connects or reconnects.
            await sendAdminUnreadCount(socket);
          } catch (error) {
            clearTimeout(authenticationTimeout);

            try {
              socket.send(
                JSON.stringify({
                  event: 'admin:auth_error',
                  message:
                    error?.message ||
                    'WebSocket authentication failed'
                })
              );
            } catch {
              // Ignore socket errors.
            }

            try {
              socket.close();
            } catch {
              // Ignore already-closed sockets.
            }
          }

          return;
        }

        // ============================================
        // PING / HEARTBEAT
        // ============================================

        if (message?.type === 'ping') {
          try {
            socket.send(
              JSON.stringify({
                event: 'admin:pong'
              })
            );
          } catch {
            removeAdminSocket(socket);
          }
        }
      });

      socket.on('close', () => {
        closed = true;
        clearTimeout(authenticationTimeout);
        removeAdminSocket(socket);
      });

      socket.on('error', () => {
        closed = true;
        clearTimeout(authenticationTimeout);
        removeAdminSocket(socket);
      });
    }
  );
}