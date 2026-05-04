import { Notification } from '../../models/Notification.js';
import { serialize } from '../../utils/serialize.js';

export async function notificationRoutes(app) {
  app.get('/me', { preHandler: app.authenticate }, async (request) => {
    const notifications = await Notification.find({ userId: request.user.id }).sort({ createdAt: -1 });
    return { data: serialize(notifications) };
  });
}
