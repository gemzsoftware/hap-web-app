import fp from 'fastify-plugin';
import { User } from '../models/User.js';
import { serialize } from '../utils/serialize.js';
import { verifyToken } from '../utils/token.js';

async function authPlugin(app) {
  app.decorate('authenticate', async (request) => {
    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw app.httpErrors.unauthorized('Bearer token required');
    }

    const payload = verifyToken(header.slice(7));
    const user = await User.findById(payload.sub);
    if (!user || user.status === 'suspended') {
      throw app.httpErrors.unauthorized('Invalid or suspended user');
    }

    request.user = serialize(user);
  });

  app.decorate('requireRole', (roles) => async (request) => {
    await app.authenticate(request);
    if (!roles.includes(request.user.role)) {
      throw app.httpErrors.forbidden('You do not have permission to perform this action');
    }
  });
}

export default fp(authPlugin);
