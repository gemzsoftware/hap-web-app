import { z } from 'zod';
import mongoose from 'mongoose';
import { Property } from '../../models/Property.js';
import { InstallmentPlan } from '../../models/InstallmentPlan.js';
import { serialize } from '../../utils/serialize.js';
import { toSlug } from '../../utils/slug.js';

const propertySchema = z.object({
  title: z.string().min(2),
  location: z.string().min(2),
  city: z.string().optional(),
  state: z.string().optional(),
  price: z.number().nonnegative(),
  size: z.string().optional(),
  status: z.enum(['available', 'reserved', 'sold', 'hidden']).optional(),
  imageUrl: z.string().optional(),
  galleryUrls: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  overview: z.string().optional(),
  legalStatus: z.string().optional(),
  titleDeedStatus: z.string().optional(),
  certificateOfOccupancyStatus: z.string().optional(),
  governorConsentStatus: z.string().optional(),
  isFeatured: z.boolean().optional()
});

async function withPlan(property) {
  const plan = await InstallmentPlan.findOne({ propertyId: property._id, isActive: true });
  return { ...serialize(property), installmentPlan: serialize(plan) };
}

async function attachPlans(properties) {
  const plans = await InstallmentPlan.find({
    propertyId: { $in: properties.map((property) => property._id) },
    isActive: true
  });
  const plansByPropertyId = new Map(plans.map((plan) => [plan.propertyId.toString(), serialize(plan)]));

  return properties.map((property) => ({
    ...serialize(property),
    installmentPlan: plansByPropertyId.get(property._id.toString()) || null
  }));
}

function buildSort(sort) {
  const options = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    title_asc: { title: 1 }
  };
  return options[sort] || options.newest;
}

export async function propertyRoutes(app) {
  app.get('/', async (request) => {
    const query = z
      .object({
        q: z.string().optional(),
        location: z.string().optional(),
        minPrice: z.coerce.number().nonnegative().optional(),
        maxPrice: z.coerce.number().nonnegative().optional(),
        featured: z.string().optional(),
        status: z.enum(['available', 'reserved', 'sold', 'hidden']).optional(),
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().max(50).default(12),
        sort: z.enum(['newest', 'oldest', 'price_asc', 'price_desc', 'title_asc']).default('newest')
      })
      .parse(request.query);

    const filter = {};
    if (query.featured === 'true') filter.isFeatured = true;
    if (query.status) filter.status = query.status;
    else filter.status = { $ne: 'hidden' };
    if (query.q) {
      const regex = new RegExp(query.q, 'i');
      filter.$or = [{ title: regex }, { location: regex }, { city: regex }, { state: regex }, { overview: regex }];
    }
    if (query.location) {
      const regex = new RegExp(query.location, 'i');
      filter.$and = [{ $or: [{ location: regex }, { city: regex }, { state: regex }] }];
    }
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter.price = {};
      if (query.minPrice !== undefined) filter.price.$gte = query.minPrice;
      if (query.maxPrice !== undefined) filter.price.$lte = query.maxPrice;
    }

    const skip = (query.page - 1) * query.limit;
    const [properties, total] = await Promise.all([
      Property.find(filter).sort(buildSort(query.sort)).skip(skip).limit(query.limit),
      Property.countDocuments(filter)
    ]);

    return {
      data: await attachPlans(properties),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit)
      },
      filters: {
        q: query.q || null,
        location: query.location || null,
        minPrice: query.minPrice ?? null,
        maxPrice: query.maxPrice ?? null,
        status: query.status || null,
        featured: query.featured === 'true',
        sort: query.sort
      }
    };
  });

  app.get('/featured', async (request) => {
    const query = z.object({ limit: z.coerce.number().int().positive().max(24).default(3) }).parse(request.query);
    const properties = await Property.find({ isFeatured: true, status: 'available' })
      .sort({ createdAt: -1 })
      .limit(query.limit);
    return { data: await attachPlans(properties) };
  });

  app.get('/:id/availability', async (request) => {
    const { id } = z.object({ id: z.string() }).parse(request.params);
    const filter = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };
    const property = await Property.findOne(filter).select('_id status');
    if (!property || property.status === 'hidden') throw app.httpErrors.notFound('Property not found');
    return {
      id: property._id.toString(),
      status: property.status,
      available: property.status === 'available'
    };
  });

  app.get('/:id', async (request) => {
    const { id } = z.object({ id: z.string() }).parse(request.params);
    const filter = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };
    const property = await Property.findOne(filter);
    if (!property || property.status === 'hidden') throw app.httpErrors.notFound('Property not found');
    return { property: await withPlan(property) };
  });

  app.post('/', { preHandler: app.requireRole(['admin', 'staff']) }, async (request, reply) => {
    const body = propertySchema.parse(request.body);
    const property = await Property.create({ ...body, slug: toSlug(body.title) });
    return reply.code(201).send({ property: serialize(property) });
  });
}
