import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    installmentPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'InstallmentPlan' },
    status: {
      type: String,
      enum: ['initiated', 'deposit_pending', 'active', 'completed', 'cancelled', 'defaulted'],
      default: 'initiated'
    },
    agreedPrice: { type: Number, required: true },
    initialDeposit: { type: Number, default: 0 },
    monthlyAmount: { type: Number, default: 0 },
    totalMonths: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    startedAt: { type: Date },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

export const Purchase = mongoose.model('Purchase', purchaseSchema);
