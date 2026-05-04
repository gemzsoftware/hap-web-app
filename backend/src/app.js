import Fastify from 'fastify';
import sensible from '@fastify/sensible';
import authPlugin from './plugins/auth.js';
import corsPlugin from './plugins/cors.js';
import errorHandlerPlugin from './plugins/error-handler.js';
import { healthRoutes } from './modules/health/routes.js';
import { authRoutes } from './modules/auth/routes.js';
import { propertyRoutes } from './modules/properties/routes.js';
import { inquiryRoutes } from './modules/inquiries/routes.js';
import { purchaseRoutes } from './modules/purchases/routes.js';
import { paymentRoutes } from './modules/payments/routes.js';
import { receiptRoutes } from './modules/receipts/routes.js';
import { documentRoutes } from './modules/documents/routes.js';
import { dashboardRoutes } from './modules/dashboard/routes.js';
import { contentRoutes } from './modules/content/routes.js';
import { adminRoutes } from './modules/admin/routes.js';
import { notificationRoutes } from './modules/notifications/routes.js';

export async function buildApp() {
  const app = Fastify({ logger: false });

  await app.register(sensible);
  await app.register(corsPlugin);
  await app.register(authPlugin);
  await app.register(errorHandlerPlugin);

  await app.register(healthRoutes, { prefix: '/api/health' });
  await app.register(authRoutes, { prefix: '/api/auth' });
  await app.register(propertyRoutes, { prefix: '/api/properties' });
  await app.register(inquiryRoutes, { prefix: '/api/inquiries' });
  await app.register(purchaseRoutes, { prefix: '/api/purchases' });
  await app.register(paymentRoutes, { prefix: '/api/payments' });
  await app.register(receiptRoutes, { prefix: '/api/receipts' });
  await app.register(documentRoutes, { prefix: '/api/documents' });
  await app.register(dashboardRoutes, { prefix: '/api/dashboard' });
  await app.register(notificationRoutes, { prefix: '/api/notifications' });
  await app.register(contentRoutes, { prefix: '/api' });
  await app.register(adminRoutes, { prefix: '/api/admin' });

  return app;
}
