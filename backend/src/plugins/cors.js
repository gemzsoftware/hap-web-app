import cors from '@fastify/cors';
import fp from 'fastify-plugin';

async function corsPlugin(app) {
  await app.register(cors, {
    origin: true,
    credentials: true
  });
}

export default fp(corsPlugin);
