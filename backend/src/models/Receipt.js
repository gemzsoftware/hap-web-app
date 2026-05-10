import mongoose from 'mongoose';

const receiptSchema = new mongoose.Schema({
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
  receiptNumber: { type: String, required: true, unique: true },
  pdfUrl: { type: String, trim: true },
  issuedAt: { type: Date, default: Date.now }
});

export const Receipt = mongoose.model('Receipt', receiptSchema);
