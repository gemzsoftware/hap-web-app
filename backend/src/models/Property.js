import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    price: { type: Number, required: true },
    size: { type: String, trim: true },
    status: { type: String, enum: ['available', 'reserved', 'sold', 'hidden'], default: 'available' },
    imageUrl: { type: String, trim: true },
    galleryUrls: [{ type: String, trim: true }],
    features: [{ type: String, trim: true }],
    overview: { type: String, trim: true },
    legalStatus: { type: String, trim: true },
    titleDeedStatus: { type: String, trim: true },
    certificateOfOccupancyStatus: { type: String, trim: true },
    governorConsentStatus: { type: String, trim: true },
    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Property = mongoose.model('Property', propertySchema);
