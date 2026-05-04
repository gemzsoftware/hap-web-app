import mongoose from 'mongoose';

const installmentPlanSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  initialDeposit: { type: Number, required: true },
  monthlyAmount: { type: Number, required: true },
  totalMonths: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
});

export const InstallmentPlan = mongoose.model('InstallmentPlan', installmentPlanSchema);
