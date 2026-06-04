import { ObjectId } from 'mongodb'
import { ADMIN_ROLES } from '../../utils/roles.js'

export async function applicationRoutes(fastify, options) {

    // 1. CLIENT ROUTE: Receives incoming digital form dossier packages
    fastify.post('/', async (request, reply) => {
        const db = fastify.mongo.db
        const userId = request.user?.id

        try {
            const applicationData = {
                ...request.body,
                // Direct BSON structural identifier transformations
                userId: userId ? new ObjectId(userId) : null,
                propertyId: new ObjectId(request.body.propertyId),
                status: 'pending_review',
                submittedAt: new Date()
            }

            const result = await db.collection('applications').insertOne(applicationData)
            return reply.code(201).send({ success: true, applicationId: result.insertedId })
        } catch (err) {
            fastify.log.error(err)
            return reply.code(500).send({ error: 'Internal Server Error', message: 'Dossier storage execution block dropped' })
        }
    })

    // 2. ADMIN ROUTE: Pulls the full matching dashboard array stack
    fastify.get('/admin/all', async (request, reply) => {
        if (!ADMIN_ROLES.includes(request.user?.role)) return reply.code(403).send({ error: 'Unauthorized Access Prohibited' })

        const db = fastify.mongo.db
        try {
            // Pull files sorted descending by latest submissions
            const roster = await db.collection('applications').find().sort({ submittedAt: -1 }).toArray()
            return reply.send(roster)
        } catch (err) {
            fastify.log.error(err)
            return reply.code(500).send({ error: 'Internal Server Error' })
        }
    })
}
