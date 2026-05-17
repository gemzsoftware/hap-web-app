import { ObjectId } from 'mongodb'

export async function paymentRoutes(fastify, options) {

    // 1. CLIENT ENDPOINT: Records an incoming statement verification proof
    fastify.post('/', async (request, reply) => {
        const { propertyId, amount, senderName, bankName, transactionReference } = request.body
        const userId = request.user.id // Pulled out of your auth token headers

        const db = fastify.mongo.db

        try {
            // FIXED: Using pure driver import with "new" constructor keyword to eliminate 500 runtime execution drops
            const paymentRecord = {
                userId: new ObjectId(userId),
                propertyId: new ObjectId(propertyId),
                amount: Number(amount),
                senderName,
                bankName,
                transactionReference,
                status: 'pending', // Awaits admin manual authorization hook triggers
                createdAt: new Date()
            }

            const result = await db.collection('payments').insertOne(paymentRecord)
            return reply.code(201).send({ success: true, paymentId: result.insertedId })
        } catch (err) {
            fastify.log.error(err)
            return reply.code(500).send({ error: 'Internal Server Error', message: 'Failed to serialize or store payment record identifiers' })
        }
    })

    // 2. ADMIN ENDPOINT: Fetches full pending roster sets
    fastify.get('/admin/pending', async (request, reply) => {
        // Basic verification guard checking if role equals admin
        if (request.user.role !== 'admin') return reply.code(403).send({ error: 'Unauthorized Access Prohibited' })

        const db = fastify.mongo.db
        const pendingTransactions = await db.collection('payments').find({ status: 'pending' }).toArray()

        return reply.send(pendingTransactions)
    })

    // 3. ADMIN CAPTURE ACTION: Signs off on ledger allocations, sets status to approved, and triggers receipt emission parameters
    fastify.patch('/admin/approve/:id', async (request, reply) => {
        if (request.user.role !== 'admin') return reply.code(403).send({ error: 'Unauthorized Access Prohibited' })

        const db = fastify.mongo.db
        const paymentId = request.params.id

        try {
            // FIXED: Instantiating standard BSON hex string parser cleanly using unified driver objects
            const targetObjectId = new ObjectId(paymentId)

            // Pull the transaction entry to locate which plot context it targets
            const txn = await db.collection('payments').findOne({ _id: targetObjectId })
            if (!txn) return reply.code(404).send({ error: 'Target record parameter missing from system logs' })

            // A. Update transaction tracking state parameter keys
            await db.collection('payments').updateOne(
                { _id: targetObjectId },
                { $set: { status: 'approved', approvedAt: new Date() } }
            )

            // B. Transform the parent target land parcel status parameters to Reserved automatically!
            // FIXED: Ensuring contextual query parses structural object IDs to avoid schema mismatches
            await db.collection('properties').updateOne(
                { _id: new ObjectId(txn.propertyId) },
                { $set: { status: 'reserved' } }
            )

            // C. Construct the secure digital official system Receipt item profile instance
            const receiptRecord = {
                paymentId: txn._id,
                userId: txn.userId,
                propertyId: txn.propertyId,
                amount: txn.amount,
                serialNumber: `ARK-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
                issuedAt: new Date()
            }

            await db.collection('receipts').insertOne(receiptRecord)

            return reply.send({ success: true, message: 'Allocation signed off successfully. Receipt generated.' })
        } catch (err) {
            fastify.log.error(err)
            return reply.code(500).send({ error: 'Internal Server Error', message: 'Audit settlement automation pipeline failed execution' })
        }
    })
}