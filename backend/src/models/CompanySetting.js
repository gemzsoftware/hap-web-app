import mongoose from 'mongoose';

const companySettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed }
});

export const CompanySetting = mongoose.model('CompanySetting', companySettingSchema);
