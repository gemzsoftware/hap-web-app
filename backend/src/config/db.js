import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDb() {
  mongoose.set('strictQuery', true);
  const connection = await mongoose.connect(env.mongodbUri);
  return connection.connection.host;
}

export async function disconnectDb() {
  await mongoose.disconnect();
}
