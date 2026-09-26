import mongoose from 'mongoose';
import { connectDb } from '../src/config/db.js';
import { Purchase } from '../src/models/Purchase.js';

/*
 * Temporary read-only diagnostic.
 * Reports any property that is currently held by more than one active
 * purchase, which would block the unique_active_purchase_per_property index.
 */
await connectDb();

const duplicates = await Purchase.aggregate([
  {
    $match: {
      status: { $in: ['initiated', 'deposit_pending', 'active'] }
    }
  },
  {
    $group: {
      _id: '$propertyId',
      count: { $sum: 1 },
      purchases: { $push: { id: '$_id', status: '$status', userId: '$userId' } }
    }
  },
  { $match: { count: { $gt: 1 } } }
]);

const totals = await Purchase.aggregate([
  { $group: { _id: '$status', count: { $sum: 1 } } }
]);

console.log('PURCHASES BY STATUS:', JSON.stringify(totals));
console.log('DUPLICATE ACTIVE PROPERTIES:', duplicates.length);
console.log(JSON.stringify(duplicates, null, 2));

const missingType = await Purchase.countDocuments({ paymentType: { $exists: false } });
console.log('PURCHASES MISSING paymentType:', missingType);

await mongoose.disconnect();
