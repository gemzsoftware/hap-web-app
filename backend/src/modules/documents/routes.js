import { z } from 'zod';
import { Document } from '../../models/Document.js';
import { serialize } from '../../utils/serialize.js';
import { assertOwnerOrStaff } from '../../utils/ownership.js';

const documentSchema = z.object({
  userId: z.string(),
  propertyId: z.string().optional(),
  purchaseId: z.string().optional(),
  type: z.enum(['survey_plan', 'deed_of_assignment', 'allocation_letter', 'receipt', 'contract']),
  title: z.string().min(2),
  fileUrl: z.string().optional(),
  status: z.enum(['pending', 'available', 'signed']).default('pending')
});

export async function documentRoutes(app) {
  app.get('/', { preHandler: app.authenticate }, async (request) => {
    const filter = ['admin', 'staff'].includes(request.user.role) ? {} : { userId: request.user.id };
    const documents = await Document.find(filter).sort({ createdAt: -1 });
    return { documents: serialize(documents) };
  });

  app.post('/', { preHandler: app.requireRole(['admin', 'staff']) }, async (request, reply) => {
    const body = documentSchema.parse(request.body);
    const document = await Document.create(body);
    return reply.code(201).send({ document: serialize(document) });
  });

  app.get('/me', { preHandler: app.authenticate }, async (request) => {
    const documents = await Document.find({ userId: request.user.id }).sort({ createdAt: -1 });
    return { data: serialize(documents) };
  });

  app.get('/:id/download', { preHandler: app.authenticate }, async (request) => {
    const { id } = z.object({ id: z.string() }).parse(request.params);
    const document = await Document.findById(id);
    if (!document) throw app.httpErrors.notFound('Document not found');
    assertOwnerOrStaff(request, document.userId);

    // TODO: Replace placeholder URL when uploads/object storage are introduced.
    return {
      document: serialize(document),
      downloadUrl: document.fileUrl || `/api/documents/${document._id}/download-placeholder`
    };
  });
}
