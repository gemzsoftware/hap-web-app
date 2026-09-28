/*
 * Route smoke check.
 *
 * Boots the Fastify app without opening a MongoDB connection and prints every
 * registered route so a missing or mis-registered endpoint is obvious.
 */
import { buildApp } from '../src/app.js';

const app = await buildApp();

await app.ready();

const routes = [];

app.addHook;

for (const line of app.printRoutes({ commonPrefix: false }).split('\n')) {
  const trimmed = line.trim();

  if (trimmed) routes.push(trimmed);
}

const interesting = routes.filter((line) =>
  /(complete|cancel|refund|documents|payments|purchases)/.test(line)
);

console.log(interesting.join('\n'));
console.log(`\ntotal route lines: ${routes.length}`);

await app.close();

process.exit(0);
