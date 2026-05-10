import { connectDb, disconnectDb } from '../config/db.js';
import { User } from '../models/User.js';
import { Property } from '../models/Property.js';
import { InstallmentPlan } from '../models/InstallmentPlan.js';
import { Testimonial } from '../models/Testimonial.js';
import { CompanySetting } from '../models/CompanySetting.js';
import { hashPassword } from '../utils/password.js';
import { toSlug } from '../utils/slug.js';

const users = [
  {
    fullName: 'Heaven Ark Admin',
    email: 'admin@heavenark.test',
    phone: '+2348000000001',
    password: 'AdminPass123',
    role: 'admin'
  },
  {
    fullName: 'Demo Investor',
    email: 'investor@heavenark.test',
    phone: '+2348000000002',
    password: 'InvestorPass123',
    role: 'investor'
  }
];

const properties = [
  {
    title: 'Heaven Ark Port Harcourt Phase 1',
    location: 'Prime estate corridor',
    city: 'Port Harcourt',
    state: 'Rivers',
    price: 4500000,
    size: '500 sqm',
    imageUrl: '/Port-1.jpg',
    galleryUrls: ['/Port-1.jpg', '/port-2.jpg'],
    isFeatured: true
  },
  {
    title: 'Heaven Ark Port Harcourt Phase 2',
    location: 'Residential growth axis',
    city: 'Port Harcourt',
    state: 'Rivers',
    price: 5200000,
    size: '600 sqm',
    imageUrl: '/port-2.jpg',
    galleryUrls: ['/port-2.jpg', '/port-3.jpg'],
    isFeatured: true
  },
  {
    title: 'Heaven Ark Garden Estate',
    location: 'Emerging investment district',
    city: 'Owerri',
    state: 'Imo',
    price: 3800000,
    size: '464 sqm',
    imageUrl: '/land-1.jpg',
    galleryUrls: ['/land-1.jpg', '/land-2.jpg']
  },
  {
    title: 'Heaven Ark Properties Smart Layout',
    location: 'Accessible family-friendly neighborhood',
    city: 'Enugu',
    state: 'Enugu',
    price: 6100000,
    size: '700 sqm',
    imageUrl: '/port-3.jpg',
    galleryUrls: ['/port-3.jpg', '/land-2.jpg']
  }
];

async function upsertUser(user) {
  const existing = await User.findOne({ email: user.email });
  if (existing) return existing;
  return User.create({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: 'active',
    emailVerifiedAt: new Date(),
    ...hashPassword(user.password)
  });
}

async function seed() {
  await connectDb();

  await Promise.all(users.map(upsertUser));

  for (const propertyData of properties) {
    const slug = toSlug(propertyData.title);
    const property = await Property.findOneAndUpdate(
      { slug },
      {
        ...propertyData,
        slug,
        status: 'available',
        features: ['Dry land', 'Flexible installment', 'Estate layout', 'Good road access'],
        overview: `${propertyData.title} is a demo Heaven Ark Properties listing for frontend integration.`,
        legalStatus: 'Verified',
        titleDeedStatus: 'Available',
        certificateOfOccupancyStatus: 'In progress',
        governorConsentStatus: 'Pending'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await InstallmentPlan.findOneAndUpdate(
      { propertyId: property._id },
      {
        propertyId: property._id,
        initialDeposit: Math.round(property.price * 0.3),
        monthlyAmount: Math.round((property.price * 0.7) / 12),
        totalMonths: 12,
        isActive: true
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  await Testimonial.findOneAndUpdate(
    { name: 'Amaka Okoro' },
    {
      name: 'Amaka Okoro',
      role: 'Investor',
      message: 'The Heaven Ark team made the land purchase process clear and organized.',
      imageUrl: '/land-1.jpg',
      isActive: true
    },
    { upsert: true, new: true }
  );

  await Testimonial.findOneAndUpdate(
    { name: 'David Eze' },
    {
      name: 'David Eze',
      role: 'Home buyer',
      message: 'I appreciated the flexible payment structure and regular updates.',
      imageUrl: '/port-2.jpg',
      isActive: true
    },
    { upsert: true, new: true }
  );

  await CompanySetting.findOneAndUpdate(
    { key: 'company' },
    {
      key: 'company',
      value: {
        name: 'Heaven Ark Properties',
        supportEmail: 'support@heavenark.test',
        supportPhone: '+2348000000000'
      }
    },
    { upsert: true, new: true }
  );

  console.log('Seed completed');
  console.log('Admin: admin@heavenark.test / AdminPass123');
  console.log('Investor: investor@heavenark.test / InvestorPass123');
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDb();
  });
