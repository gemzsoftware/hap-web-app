import { z } from 'zod';
import mongoose from 'mongoose';
import { User } from '../../models/User.js';
import { Property } from '../../models/Property.js';
import { InstallmentPlan } from '../../models/InstallmentPlan.js';
import { Purchase } from '../../models/Purchase.js';
import { Payment } from '../../models/Payment.js';
import { Inquiry } from '../../models/Inquiry.js';
import { Document } from '../../models/Document.js';
import { Testimonial } from '../../models/Testimonial.js';
import { CompanySetting } from '../../models/CompanySetting.js';
import { AuditLog } from '../../models/AuditLog.js';
import { serialize } from '../../utils/serialize.js';
import { toSlug } from '../../utils/slug.js';

const objectIdSchema = z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), 'Invalid ObjectId');
const paramsSchema = z.object({ id: objectIdSchema });

const pageQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20)
});

const propertySchema = z.object({
  title: z.string().min(2),
  location: z.string().min(2),
  city: z.string().optional(),
  state: z.string().optional(),
  price: z.number().nonnegative(),
  size: z.string().optional(),
  status: z.enum(['available', 'reserved', 'sold', 'hidden']).default('available'),
  imageUrl: z.string().optional(),
  galleryUrls: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  overview: z.string().optional(),
  legalStatus: z.string().optional(),
  titleDeedStatus: z.string().optional(),
  certificateOfOccupancyStatus: z.string().optional(),
  governorConsentStatus: z.string().optional(),
  isFeatured: z.boolean().optional(),
  installmentPlan: z
    .object({
      initialDeposit: z.number().nonnegative(),
      monthlyAmount: z.number().nonnegative(),
      totalMonths: z.number().int().positive(),
      isActive: z.boolean().default(true)
    })
    .optional()
});

const updatePropertySchema = propertySchema.partial();
const imagesSchema = z.object({
  imageUrl: z.string().optional(),
  galleryUrls: z.array(z.string()).optional()
});

const companySchema = z.record(z.any());
const testimonialSchema = z.object({
  name: z.string().min(2),
  role: z.string().optional(),
  message: z.string().min(2),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true)
});

function pagination(query) {
  const { page, limit } = pageQuerySchema.parse(query);
  return { page, limit, skip: (page - 1) * limit };
}

function paginated(data, total, page, limit) {
  return {
    data: serialize(data),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

async function audit(actorId, action, entityType, entityId, metadata = {}) {
  await AuditLog.create({ actorId, action, entityType, entityId, metadata });
}

async function adminOrStaff(request) {
  await request.server.authenticate(request);
  if (!['admin', 'staff'].includes(request.user.role)) {
    throw request.server.httpErrors.forbidden('Admin or staff access required');
  }
}

async function adminOnly(request) {
  await request.server.authenticate(request);
  if (request.user.role !== 'admin') {
    throw request.server.httpErrors.forbidden('Admin access required');
  }
}

export async function adminRoutes(app) {
  app.addHook('preHandler', adminOrStaff);

  app.get('/overview', async () => {
    const [users, properties, purchases, inquiries] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Purchase.countDocuments(),
      Inquiry.countDocuments()
    ]);
    return { message: 'Admin overview loaded.', data: { users, properties, purchases, inquiries } };
  });

  app.post('/properties', async (request, reply) => {
    const body = propertySchema.parse(request.body);
    const { installmentPlan, ...propertyData } = body;
    const property = await Property.create({ ...propertyData, slug: toSlug(propertyData.title) });

    if (installmentPlan) {
      await InstallmentPlan.create({ ...installmentPlan, propertyId: property._id });
    }

    await audit(request.user.id, 'property.created', 'Property', property._id, { title: property.title });
    return reply.code(201).send({ message: 'Property created.', data: serialize(property) });
  });

  app.put('/properties/:id', async (request) => {
    const { id } = paramsSchema.parse(request.params);
    const body = updatePropertySchema.parse(request.body);
    const { installmentPlan, ...propertyData } = body;
    if (propertyData.title) propertyData.slug = toSlug(propertyData.title);

    const property = await Property.findByIdAndUpdate(id, propertyData, { new: true });
    if (!property) throw app.httpErrors.notFound('Property not found');

    if (installmentPlan) {
      await InstallmentPlan.findOneAndUpdate({ propertyId: property._id }, { ...installmentPlan, propertyId: property._id }, { upsert: true, new: true });
    }

    await audit(request.user.id, 'property.updated', 'Property', property._id, { fields: Object.keys(body) });
    return { message: 'Property updated.', data: serialize(property) };
  });

  app.patch('/properties/:id/status', async (request) => {
    const { id } = paramsSchema.parse(request.params);
    const body = z.object({ status: z.enum(['available', 'reserved', 'sold', 'hidden']) }).parse(request.body);
    const property = await Property.findByIdAndUpdate(id, { status: body.status }, { new: true });
    if (!property) throw app.httpErrors.notFound('Property not found');
    await audit(request.user.id, 'property.status_changed', 'Property', property._id, { status: body.status });
    return { message: 'Property status updated.', data: serialize(property) };
  });

  app.delete('/properties/:id', async (request) => {
    const { id } = paramsSchema.parse(request.params);
    const query = z
      .object({
        hardDelete: z
          .enum(['true', 'false'])
          .optional()
          .transform((value) => value === 'true')
      })
      .parse(request.query);
    const property = query.hardDelete
      ? await Property.findByIdAndDelete(id)
      : await Property.findByIdAndUpdate(id, { status: 'hidden' }, { new: true });
    if (!property) throw app.httpErrors.notFound('Property not found');
    await audit(request.user.id, query.hardDelete ? 'property.deleted' : 'property.hidden', 'Property', property._id);
    return { message: query.hardDelete ? 'Property deleted.' : 'Property hidden.', data: serialize(property) };
  });

  app.post('/properties/:id/images', async (request) => {
    const { id } = paramsSchema.parse(request.params);
    const body = imagesSchema.parse(request.body);
    // TODO: Replace JSON-only image fields if upload storage is introduced later.
    const property = await Property.findByIdAndUpdate(id, body, { new: true });
    if (!property) throw app.httpErrors.notFound('Property not found');
    await audit(request.user.id, 'property.images_updated', 'Property', property._id, body);
    return { message: 'Property images updated.', data: serialize(property) };
  });

  app.get('/inquiries', async (request) => {
    const query = z
      .object({
        status: z.enum(['new', 'contacted', 'closed']).optional(),
        source: z.enum(['contact', 'property_detail', 'general']).optional(),
        propertyId: objectIdSchema.optional()
      })
      .merge(pageQuerySchema)
      .parse(request.query);
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.source) filter.source = query.source;
    if (query.propertyId) filter.propertyId = query.propertyId;
    const [data, total] = await Promise.all([
      Inquiry.find(filter).sort({ createdAt: -1 }).skip((query.page - 1) * query.limit).limit(query.limit),
      Inquiry.countDocuments(filter)
    ]);
    return paginated(data, total, query.page, query.limit);
  });

  app.get('/inquiries/:id', async (request) => {
    const { id } = paramsSchema.parse(request.params);
    const inquiry = await Inquiry.findById(id).populate('propertyId');
    if (!inquiry) throw app.httpErrors.notFound('Inquiry not found');
    return { message: 'Inquiry loaded.', data: serialize(inquiry) };
  });

  app.patch('/inquiries/:id/status', async (request) => {
    const { id } = paramsSchema.parse(request.params);
    const body = z.object({ status: z.enum(['new', 'contacted', 'closed']) }).parse(request.body);
    const inquiry = await Inquiry.findByIdAndUpdate(id, { status: body.status }, { new: true });
    if (!inquiry) throw app.httpErrors.notFound('Inquiry not found');
    return { message: 'Inquiry status updated.', data: serialize(inquiry) };
  });

  app.get('/users', async (request) => {
    const query = z
      .object({
        role: z.enum(['investor', 'admin', 'staff']).optional(),
        status: z.enum(['pending_verification', 'active', 'suspended']).optional(),
        q: z.string().optional()
      })
      .merge(pageQuerySchema)
      .parse(request.query);
    const filter = {};
    if (query.role) filter.role = query.role;
    if (query.status) filter.status = query.status;
    if (query.q) {
      const regex = new RegExp(query.q, 'i');
      filter.$or = [{ fullName: regex }, { email: regex }, { phone: regex }];
    }
    const [data, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip((query.page - 1) * query.limit).limit(query.limit),
      User.countDocuments(filter)
    ]);
    return paginated(data, total, query.page, query.limit);
  });

  app.get('/users/:id', async (request) => {
    const { id } = paramsSchema.parse(request.params);
    const user = await User.findById(id);
    if (!user) throw app.httpErrors.notFound('User not found');
    return { message: 'User loaded.', data: serialize(user) };
  });

  app.patch('/users/:id/status', async (request) => {
    const { id } = paramsSchema.parse(request.params);
    const body = z.object({ status: z.enum(['pending_verification', 'active', 'suspended']) }).parse(request.body);
    const user = await User.findByIdAndUpdate(id, { status: body.status }, { new: true });
    if (!user) throw app.httpErrors.notFound('User not found');
    await audit(request.user.id, 'user.status_changed', 'User', user._id, { status: body.status });
    return { message: 'User status updated.', data: serialize(user) };
  });

  app.patch('/users/:id/role', { preHandler: adminOnly }, async (request) => {
    const { id } = paramsSchema.parse(request.params);
    const body = z.object({ role: z.enum(['investor', 'admin', 'staff']) }).parse(request.body);
    const user = await User.findByIdAndUpdate(id, { role: body.role }, { new: true });
    if (!user) throw app.httpErrors.notFound('User not found');
    await audit(request.user.id, 'user.role_changed', 'User', user._id, { role: body.role });
    return { message: 'User role updated.', data: serialize(user) };
  });

  app.get('/purchases', async (request) => {
    const query = z
      .object({
        status: z.enum(['initiated', 'deposit_pending', 'active', 'completed', 'cancelled', 'defaulted']).optional(),
        userId: objectIdSchema.optional(),
        propertyId: objectIdSchema.optional()
      })
      .merge(pageQuerySchema)
      .parse(request.query);
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.userId) filter.userId = query.userId;
    if (query.propertyId) filter.propertyId = query.propertyId;
    const [data, total] = await Promise.all([
      Purchase.find(filter).populate('userId propertyId installmentPlanId').sort({ createdAt: -1 }).skip((query.page - 1) * query.limit).limit(query.limit),
      Purchase.countDocuments(filter)
    ]);
    return paginated(data, total, query.page, query.limit);
  });

  app.get('/payments', async (request) => {
    const query = z
      .object({
        status: z.enum(['pending', 'successful', 'failed', 'refunded']).optional(),
        type: z.enum(['deposit', 'installment', 'full_payment']).optional(),
        userId: objectIdSchema.optional(),
        purchaseId: objectIdSchema.optional()
      })
      .merge(pageQuerySchema)
      .parse(request.query);
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.type) filter.type = query.type;
    if (query.userId) filter.userId = query.userId;
    if (query.purchaseId) filter.purchaseId = query.purchaseId;
    const [data, total] = await Promise.all([
      Payment.find(filter).populate('userId purchaseId').sort({ createdAt: -1 }).skip((query.page - 1) * query.limit).limit(query.limit),
      Payment.countDocuments(filter)
    ]);
    return paginated(data, total, query.page, query.limit);
  });

  app.patch('/purchases/:id/status', async (request) => {
    const { id } = paramsSchema.parse(request.params);
    const body = z.object({ status: z.enum(['initiated', 'deposit_pending', 'active', 'completed', 'cancelled', 'defaulted']) }).parse(request.body);
    const purchase = await Purchase.findByIdAndUpdate(id, { status: body.status }, { new: true });
    if (!purchase) throw app.httpErrors.notFound('Purchase not found');
    await audit(request.user.id, 'purchase.status_changed', 'Purchase', purchase._id, { status: body.status });
    return { message: 'Purchase status updated.', data: serialize(purchase) };
  });

  app.post('/purchases/:id/documents', async (request, reply) => {
    const { id } = paramsSchema.parse(request.params);
    const body = z
      .object({
        type: z.enum(['survey_plan', 'deed_of_assignment', 'allocation_letter', 'receipt', 'contract']),
        title: z.string().min(2),
        fileUrl: z.string().optional(),
        status: z.enum(['pending', 'available', 'signed']).default('pending')
      })
      .parse(request.body);
    const purchase = await Purchase.findById(id);
    if (!purchase) throw app.httpErrors.notFound('Purchase not found');
    // TODO: Replace fileUrl metadata with upload storage if uploads are introduced later.
    const document = await Document.create({
      ...body,
      userId: purchase.userId,
      propertyId: purchase.propertyId,
      purchaseId: purchase._id
    });
    await audit(request.user.id, 'document.created', 'Document', document._id, { purchaseId: purchase._id });
    return reply.code(201).send({ message: 'Document added.', data: serialize(document) });
  });

  app.put('/company', async (request) => {
    const body = companySchema.parse(request.body);
    const setting = await CompanySetting.findOneAndUpdate({ key: 'company' }, { key: 'company', value: body }, { upsert: true, new: true });
    await audit(request.user.id, 'content.company_updated', 'CompanySetting', setting._id);
    return { message: 'Company content updated.', data: serialize(setting) };
  });

  app.post('/testimonials', async (request, reply) => {
    const body = testimonialSchema.parse(request.body);
    const testimonial = await Testimonial.create(body);
    await audit(request.user.id, 'content.testimonial_created', 'Testimonial', testimonial._id);
    return reply.code(201).send({ message: 'Testimonial created.', data: serialize(testimonial) });
  });

  app.put('/testimonials/:id', async (request) => {
    const { id } = paramsSchema.parse(request.params);
    const body = testimonialSchema.partial().parse(request.body);
    const testimonial = await Testimonial.findByIdAndUpdate(id, body, { new: true });
    if (!testimonial) throw app.httpErrors.notFound('Testimonial not found');
    await audit(request.user.id, 'content.testimonial_updated', 'Testimonial', testimonial._id);
    return { message: 'Testimonial updated.', data: serialize(testimonial) };
  });

  app.delete('/testimonials/:id', async (request) => {
    const { id } = paramsSchema.parse(request.params);
    const testimonial = await Testimonial.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!testimonial) throw app.httpErrors.notFound('Testimonial not found');
    await audit(request.user.id, 'content.testimonial_deactivated', 'Testimonial', testimonial._id);
    return { message: 'Testimonial deactivated.', data: serialize(testimonial) };
  });
}
