import { Receipt } from '../../models/Receipt.js';
import { ReceiptSequence } from '../../models/ReceiptSequence.js';
import { User } from '../../models/User.js';
import { Property } from '../../models/Property.js';
import { Purchase } from '../../models/Purchase.js';
import { generateReceiptPdf } from './generator.js';

// ─────────────────────────────────────────────
// PAYMENT METHOD
// ─────────────────────────────────────────────

function getPaymentMethod(payment) {
    if (payment?.provider) {
        const provider = String(payment.provider)
            .replaceAll('_', ' ')
            .replace(/\b\w/g, (letter) => letter.toUpperCase());

        if (provider.toLowerCase() === 'manual') {
            return 'Manual Payment';
        }

        return provider;
    }

    switch (payment?.type) {
        case 'full_payment':
            return 'Full Payment';

        case 'installment':
            return 'Installment Payment';

        case 'deposit':
            return 'Initial Deposit';

        default:
            return 'Payment';
    }
}

// ─────────────────────────────────────────────
// RECEIPT NUMBER
// ─────────────────────────────────────────────

async function createReceiptNumber() {
    const year = new Date().getFullYear();

    const sequence = await ReceiptSequence.findOneAndUpdate(
        { year },
        {
            $inc: {
                sequence: 1
            },

            $setOnInsert: {
                year
            }
        },
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        }
    );

    const number = String(sequence.sequence).padStart(5, '0');

    return `HAP-${year}-${number}`;
}

// ─────────────────────────────────────────────
// CREATE RECEIPT
// ─────────────────────────────────────────────

/**
 * Create the official receipt for a successful payment.
 *
 * This function is intentionally idempotent.
 *
 * If the payment already has a receipt, the existing
 * receipt is returned instead of creating another one.
 *
 * The receipt stores snapshots of the customer,
 * property, payment and purchase information so
 * the historical receipt does not change when the
 * underlying records change later.
 */
export async function createReceiptForPayment(payment) {
    if (!payment) {
        throw new Error('Payment is required to create a receipt');
    }

    // ─────────────────────────────────────────────
    // PAYMENT VALIDATION
    // ─────────────────────────────────────────────

    if (payment.status !== 'successful') {
        throw new Error(
            'A receipt can only be created for a successful payment'
        );
    }

    // ─────────────────────────────────────────────
    // IDEMPOTENCY CHECK
    // ─────────────────────────────────────────────

    const existingReceipt = await Receipt.findOne({
        paymentId: payment._id
    });

    if (existingReceipt) {
        return existingReceipt;
    }

    // ─────────────────────────────────────────────
    // LOAD PURCHASE
    // ─────────────────────────────────────────────

    const purchase = await Purchase.findById(
        payment.purchaseId
    );

    if (!purchase) {
        throw new Error('Purchase not found');
    }

    // ─────────────────────────────────────────────
    // LOAD CUSTOMER
    // ─────────────────────────────────────────────

    const userId = payment.userId || purchase.userId;

    const user = await User.findById(userId);

    if (!user) {
        throw new Error('Customer account not found');
    }

    // ─────────────────────────────────────────────
    // LOAD PROPERTY
    // ─────────────────────────────────────────────

    const property = await Property.findById(
        purchase.propertyId
    );

    if (!property) {
        throw new Error('Property not found');
    }

    // ─────────────────────────────────────────────
    // RECEIPT NUMBER
    // ─────────────────────────────────────────────

    const receiptNumber = await createReceiptNumber();

    // ─────────────────────────────────────────────
    // FINANCIAL SNAPSHOT
    // ─────────────────────────────────────────────

    const amount = Number(payment.amount || 0);

    const amountPaid = Number(
        purchase.amountPaid || 0
    );

    const agreedPrice = Number(
        purchase.agreedPrice || 0
    );

    const outstandingBalance = Math.max(
        agreedPrice - amountPaid,
        0
    );

    // ─────────────────────────────────────────────
    // PAYMENT DATE
    // ─────────────────────────────────────────────

    const paymentDate =
        payment.paidAt ||
        payment.approvedAt ||
        payment.updatedAt ||
        new Date();

    // ─────────────────────────────────────────────
    // CREATE RECEIPT SNAPSHOT
    // ─────────────────────────────────────────────

    let receipt;

    try {
        receipt = await Receipt.create({
            paymentId: payment._id,

            purchaseId: purchase._id,

            userId: user._id,

            propertyId: property._id,

            receiptNumber,

            customer: {
                fullName: user.fullName || '',
                email: user.email || '',
                phone: user.phone || ''
            },

            property: {
                title: property.title || '',
                location: property.location || '',
                city: property.city || '',
                state: property.state || ''
            },

            payment: {
                amount,

                currency:
                    payment.currency ||
                    'NGN',

                type: payment.type || '',

                method: getPaymentMethod(payment),

                reference:
                    payment.providerReference ||
                    '',

                paidAt: paymentDate
            },

            purchase: {
                agreedPrice,

                amountPaid,

                outstandingBalance
            },

            status: 'issued',

            issuedAt: new Date()
        });
    } catch (error) {
        /*
         * Because paymentId is unique, another request may
         * have created the receipt between our initial
         * idempotency check and Receipt.create().
         *
         * If that happened, return the existing receipt.
         */
        if (error?.code === 11000) {
            const existingReceipt = await Receipt.findOne({
                paymentId: payment._id
            });

            if (existingReceipt) {
                return existingReceipt;
            }
        }

        throw error;
    }

    // ─────────────────────────────────────────────
    // GENERATE PDF
    // ─────────────────────────────────────────────

    try {
        const pdfPath = await generateReceiptPdf({
            receipt
        });

        receipt.pdfUrl = pdfPath;

        await receipt.save();

        return receipt;
    } catch (error) {
        /*
         * If PDF generation fails, remove the receipt
         * record so we don't leave behind an official
         * receipt without its PDF.
         */
        await Receipt.findByIdAndDelete(
            receipt._id
        );

        throw error;
    }
}