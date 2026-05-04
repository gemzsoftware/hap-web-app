import { z } from 'zod';
import mongoose from 'mongoose';
import { User } from '../../models/User.js';
import { Purchase } from '../../models/Purchase.js';
import { Payment } from '../../models/Payment.js';
import { Document } from '../../models/Document.js';
import { hashPassword, verifyPassword } from '../../utils/password.js';
import { serialize } from '../../utils/serialize.js';
import { signToken } from '../../utils/token.js';

const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().optional()
});

const forgotPasswordSchema = z.object({
  email: z.string().email()
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  email: z.string().email().optional(),
  password: z.string().min(8)
});

function authResponse(user) {
  return {
    user: serialize(user),
    token: signToken({ id: user.id || user._id.toString(), role: user.role, email: user.email })
  };
}

async function getProfileSummary(userId) {
  const objectId = new mongoose.Types.ObjectId(userId);
  const [activePurchases, completedPurchases, totalPaid, documentsAvailable] = await Promise.all([
    Purchase.countDocuments({ userId: objectId, status: { $in: ['deposit_pending', 'active'] } }),
    Purchase.countDocuments({ userId: objectId, status: 'completed' }),
    Payment.aggregate([
      { $match: { userId: objectId, status: 'successful' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Document.countDocuments({ userId: objectId, status: 'available' })
  ]);

  return {
    activePurchases,
    completedPurchases,
    totalPaid: totalPaid[0]?.total || 0,
    documentsAvailable
  };
}

export async function authRoutes(app) {
  app.post('/register', async (request, reply) => {
    const body = registerSchema.parse(request.body);
    const existing = await User.findOne({ email: body.email.toLowerCase() });
    if (existing) throw app.httpErrors.conflict('Email is already registered');

    const passwordFields = hashPassword(body.password);
    const user = await User.create({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      role: 'investor',
      status: 'active',
      emailVerifiedAt: new Date(),
      ...passwordFields
    });

    return reply.code(201).send(authResponse(user));
  });

  app.post('/login', async (request) => {
    const body = loginSchema.parse(request.body);
    const user = await User.findOne({ email: body.email.toLowerCase() });
    if (!user || !verifyPassword(body.password, user.passwordHash, user.passwordSalt)) {
      throw app.httpErrors.unauthorized('Invalid email or password');
    }
    if (user.status === 'suspended') throw app.httpErrors.unauthorized('User account is suspended');
    return authResponse(user);
  });

  app.get('/me', { preHandler: app.authenticate }, async (request) => ({
    user: request.user
  }));

  app.get('/profile', { preHandler: app.authenticate }, async (request) => ({
    user: request.user,
    summary: await getProfileSummary(request.user.id)
  }));

  app.put('/profile', { preHandler: app.authenticate }, async (request) => {
    const body = updateProfileSchema.parse(request.body);
    const user = await User.findByIdAndUpdate(request.user.id, body, { new: true });
    return {
      user: serialize(user),
      summary: await getProfileSummary(user._id)
    };
  });

  app.post('/logout', async () => ({
    message: 'Logged out successfully.'
  }));

  app.post('/forgot-password', async (request) => {
    forgotPasswordSchema.parse(request.body);
    return {
      message: 'If an account exists for this email, password reset instructions will be available.'
    };
  });

  app.post('/reset-password', async (request) => {
    resetPasswordSchema.parse(request.body);
    return {
      message: 'If the reset request is valid, the password will be updated.'
    };
  });
}
