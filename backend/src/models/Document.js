import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    purchaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase' },
    type: {
      type: String,
      enum: ['survey_plan', 'deed_of_assignment', 'allocation_letter', 'receipt', 'contract'],
      required: true
    },
    title: { type: String, required: true, trim: true },
    fileUrl: { type: String, trim: true },
    status: { type: String, enum: ['pending', 'available', 'signed'], default: 'pending' }
  },
  { timestamps: true }
);

export const Document = mongoose.model('Document', documentSchema);
