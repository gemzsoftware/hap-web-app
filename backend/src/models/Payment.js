import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    purchaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['deposit', 'installment', 'full_payment'], required: true },
    status: { type: String, enum: ['pending', 'successful', 'failed', 'refunded'], default: 'pending' },
    provider: { type: String, default: 'manual' },
    providerReference: { type: String, trim: true },
    paidAt: { type: Date }
  },
  { timestamps: true }
);

export const Payment = mongoose.model('Payment', paymentSchema);
