import { buildApp } from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';

async function start() {
  const mongoHost = await connectDb();
  console.log(`MongoDB Connected: ${mongoHost}`);

  const app = await buildApp();

  await app.listen({
    port: env.port,
    host: '0.0.0.0'
  });

  console.log(`Server is running on port ${env.port}`);
}

start().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
