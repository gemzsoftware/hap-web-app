import { z } from 'zod';
import { Inquiry } from '../../models/Inquiry.js';
import { serialize } from '../../utils/serialize.js';

const createInquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(3),
  source: z.enum(['contact', 'property_detail', 'general']).default('general'),
  propertyId: z.string().optional()
});

export async function inquiryRoutes(app) {
  app.post('/', async (request, reply) => {
    const body = createInquirySchema.parse(request.body);
    const inquiry = await Inquiry.create({ ...body, status: 'new' });
    return reply.code(201).send({
      message: 'Request transmitted.',
      inquiry: {
        id: inquiry._id.toString(),
        status: inquiry.status
      }
    });
  });

  app.get('/', { preHandler: app.requireRole(['admin', 'staff']) }, async () => {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return { inquiries: serialize(inquiries) };
  });
}
