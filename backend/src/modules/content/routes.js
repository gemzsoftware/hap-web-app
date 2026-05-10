import { Testimonial } from '../../models/Testimonial.js';
import { CompanySetting } from '../../models/CompanySetting.js';
import { serialize } from '../../utils/serialize.js';

const fallbackCompany = {
  name: 'Heaven Ark Properties',
  tagline: 'Land banking and real estate investment made clear.',
  description:
    'Heaven Ark Properties helps investors and home buyers discover verified land opportunities with flexible payment options.',
  email: 'support@heavenark.test',
  phone: '+2348000000000',
  address: 'Nigeria'
};

export async function contentRoutes(app) {
  app.get('/company', async () => {
    const setting = await CompanySetting.findOne({ key: 'company' });
    return { company: setting?.value || fallbackCompany };
  });

  app.get('/testimonials', async () => {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });
    return { data: serialize(testimonials) };
  });

  app.get('/legal/privacy', async () => ({
    privacy: {
      title: 'Privacy Policy',
      content:
        'Heaven Ark Properties collects contact and account information only to respond to inquiries, manage property interests, and support customer relationships. Payment gateway, email, SMS, upload, and document generation integrations are not implemented in this backend.'
    }
  }));

  app.get('/legal/terms', async () => ({
    terms: {
      title: 'Terms and Conditions',
      content:
        'Property information is provided for frontend integration and customer inquiry workflows. Availability, pricing, legal status, and payment terms should be confirmed directly with Heaven Ark Properties before any transaction.'
    }
  }));

  app.get('/content/settings', async () => {
    const settings = await CompanySetting.find();
    return {
      settings: settings.reduce((result, setting) => {
        result[setting.key] = setting.value;
        return result;
      }, {})
    };
  });
}
