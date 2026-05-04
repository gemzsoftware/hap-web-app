# Backend Documentation

## Project overview

Fastify + MongoDB backend for project codename `hap-web-app`, package name `hap-web-app-backend`. It supports public property discovery, inquiries, basic content pages, JWT auth, investor profile summaries, and simple admin/operational records for Heaven Ark Properties.


## Env variables

Only these variables are used:

```bash
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/hap-web-app
JWT_SECRET=replace-with-a-long-random-secret
```

`MONGODB_URI` and `JWT_SECRET` are required. Startup and seed fail clearly if either is missing.

## How to run backend

```bash
npm install
npm run dev
```

Production-style start:

```bash
npm start
```

Seed demo data:

```bash
npm run seed
```

## Seed users

```text
Admin: admin@heavenark.test / AdminPass123
Investor: investor@heavenark.test / InvestorPass123
```

The seed is idempotent and creates an admin user, investor user, four demo properties, active installment plans, testimonials, and company settings.

## API base URL

All routes use:

```text
/api
```

Local example:

```text
http://localhost:4000/api
```

## Auth behavior

Passwords are hashed with Node built-in crypto through `src/utils/password.js`. The database stores `passwordHash` and `passwordSalt`; API responses never return either field.

JWT tokens are signed with `JWT_SECRET`. Tokens do not expire. Refresh tokens are not implemented.

Protected routes require:

```http
Authorization: Bearer <token>
```

Roles: `investor`, `admin`, `staff`.

## Error response format

Validation error:

```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": []
  }
}
```

General error:

```json
{
  "error": {
    "message": "Property not found",
    "code": "REQUEST_ERROR"
  }
}
```

## Public routes

### GET /api/health

Response:

```json
{
  "status": "ok",
  "service": "hap-web-app",
  "name": "hap-web-app-backend"
}
```

### POST /api/auth/register

Creates an active investor user.

Request:

```json
{
  "fullName": "Ada Investor",
  "email": "ada@example.com",
  "phone": "+2348000000000",
  "password": "Password123"
}
```

Response:

```json
{
  "user": {
    "id": "mongo-id",
    "fullName": "Ada Investor",
    "email": "ada@example.com",
    "phone": "+2348000000000",
    "role": "investor",
    "status": "active"
  },
  "token": "jwt-token"
}
```

### POST /api/auth/login

Rejects invalid credentials and suspended users.

Request:

```json
{
  "email": "investor@heavenark.test",
  "password": "InvestorPass123"
}
```

Response:

```json
{
  "user": {
    "id": "mongo-id",
    "fullName": "Demo Investor",
    "email": "investor@heavenark.test",
    "role": "investor",
    "status": "active"
  },
  "token": "jwt-token"
}
```

### POST /api/auth/logout

No token invalidation is implemented yet. Frontend should remove the stored token.

Response:

```json
{
  "message": "Logged out successfully."
}
```

### POST /api/auth/forgot-password

Stub only.

Request:

```json
{
  "email": "ada@example.com"
}
```

Response:

```json
{
  "message": "If an account exists for this email, password reset instructions will be available."
}
```

### POST /api/auth/reset-password

Stub only.

Request:

```json
{
  "token": "reset-token-placeholder",
  "email": "ada@example.com",
  "password": "NewPassword123"
}
```

Response:

```json
{
  "message": "If the reset request is valid, the password will be updated."
}
```

### GET /api/properties

Supports `q`, `location`, `minPrice`, `maxPrice`, `status`, `featured`, `page`, `limit`, and `sort`.

Defaults: `page=1`, `limit=12`, `sort=newest`, hidden properties excluded unless `status=hidden`.

Sort values: `newest`, `oldest`, `price_asc`, `price_desc`, `title_asc`.

Example:

```text
GET /api/properties?q=port&location=rivers&minPrice=1000000&maxPrice=7000000&featured=true&page=1&limit=12&sort=price_asc
```

Response:

```json
{
  "data": [
    {
      "id": "mongo-id",
      "slug": "heaven-ark-port-harcourt-phase-1",
      "title": "Heaven Ark Port Harcourt Phase 1",
      "location": "Prime estate corridor",
      "price": 4500000,
      "size": "500 sqm",
      "status": "available",
      "image": "/Port-1.jpg",
      "imageUrl": "/Port-1.jpg",
      "features": ["Dry land", "Flexible installment"],
      "installmentPlan": {
        "id": "mongo-id",
        "initialDeposit": 1350000,
        "monthlyAmount": 262500,
        "totalMonths": 12,
        "isActive": true
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 4,
    "totalPages": 1
  },
  "filters": {
    "q": "port",
    "location": "rivers",
    "minPrice": 1000000,
    "maxPrice": 7000000,
    "status": null,
    "featured": true,
    "sort": "price_asc"
  }
}
```

### GET /api/properties/featured

Returns featured available properties. Default limit is `3`.

Example:

```text
GET /api/properties/featured?limit=3
```

Response:

```json
{
  "data": [
    {
      "id": "mongo-id",
      "slug": "heaven-ark-port-harcourt-phase-1",
      "title": "Heaven Ark Port Harcourt Phase 1",
      "status": "available",
      "image": "/Port-1.jpg",
      "imageUrl": "/Port-1.jpg",
      "installmentPlan": {
        "id": "mongo-id",
        "initialDeposit": 1350000,
        "monthlyAmount": 262500,
        "totalMonths": 12
      }
    }
  ]
}
```

### GET /api/properties/:id

Finds by Mongo ObjectId or slug. Hidden properties return 404.

Response:

```json
{
  "property": {
    "id": "mongo-id",
    "slug": "heaven-ark-port-harcourt-phase-1",
    "title": "Heaven Ark Port Harcourt Phase 1",
    "location": "Prime estate corridor",
    "city": "Port Harcourt",
    "state": "Rivers",
    "price": 4500000,
    "size": "500 sqm",
    "status": "available",
    "image": "/Port-1.jpg",
    "imageUrl": "/Port-1.jpg",
    "galleryUrls": ["/Port-1.jpg", "/port-2.jpg"],
    "features": ["Dry land", "Flexible installment"],
    "overview": "Property overview text",
    "legalStatus": "Verified",
    "installmentPlan": {
      "id": "mongo-id",
      "initialDeposit": 1350000,
      "monthlyAmount": 262500,
      "totalMonths": 12,
      "isActive": true
    }
  }
}
```

### GET /api/properties/:id/availability

Finds by Mongo ObjectId or slug.

Response:

```json
{
  "id": "mongo-id",
  "status": "available",
  "available": true
}
```

### POST /api/inquiries

Creates an inquiry with status `new`.

Request:

```json
{
  "name": "Ada Investor",
  "email": "ada@example.com",
  "phone": "+2348000000000",
  "message": "I want to inspect this property.",
  "propertyId": "mongo-id",
  "source": "property_detail"
}
```

Response:

```json
{
  "message": "Request transmitted.",
  "inquiry": {
    "id": "mongo-id",
    "status": "new"
  }
}
```

### GET /api/company

Returns company profile from DB setting `company`, or fallback Heaven Ark content.

Response:

```json
{
  "company": {
    "name": "Heaven Ark Properties",
    "tagline": "Land banking and real estate investment made clear.",
    "description": "Heaven Ark Properties helps investors and home buyers discover verified land opportunities with flexible payment options.",
    "email": "support@heavenark.test",
    "phone": "+2348000000000",
    "address": "Nigeria"
  }
}
```

### GET /api/testimonials

Returns active testimonials.

Response:

```json
{
  "data": [
    {
      "id": "mongo-id",
      "name": "Amaka Okoro",
      "role": "Investor",
      "message": "The Heaven Ark team made the land purchase process clear and organized.",
      "image": "/land-1.jpg",
      "imageUrl": "/land-1.jpg",
      "isActive": true
    }
  ]
}
```

### GET /api/legal/privacy

Response:

```json
{
  "privacy": {
    "title": "Privacy Policy",
    "content": "Heaven Ark Properties collects contact and account information only to respond to inquiries, manage property interests, and support customer relationships. Payment gateway, email, SMS, upload, and document generation integrations are not implemented in this backend."
  }
}
```

### GET /api/legal/terms

Response:

```json
{
  "terms": {
    "title": "Terms and Conditions",
    "content": "Property information is provided for frontend integration and customer inquiry workflows. Availability, pricing, legal status, and payment terms should be confirmed directly with Heaven Ark Properties before any transaction."
  }
}
```

## Protected auth routes

### GET /api/auth/profile

Requires auth.

Response:

```json
{
  "user": {
    "id": "mongo-id",
    "fullName": "Demo Investor",
    "email": "investor@heavenark.test",
    "phone": "+2348000000002",
    "role": "investor",
    "status": "active"
  },
  "summary": {
    "activePurchases": 1,
    "completedPurchases": 0,
    "totalPaid": 1350000,
    "documentsAvailable": 2
  }
}
```

### PUT /api/auth/profile

Requires auth. Only `fullName` and `phone` are accepted.

Request:

```json
{
  "fullName": "Ada Updated",
  "phone": "+2348111111111"
}
```

Response:

```json
{
  "user": {
    "id": "mongo-id",
    "fullName": "Ada Updated",
    "phone": "+2348111111111",
    "email": "ada@example.com",
    "role": "investor",
    "status": "active"
  },
  "summary": {
    "activePurchases": 0,
    "completedPurchases": 0,
    "totalPaid": 0,
    "documentsAvailable": 0
  }
}
```

### GET /api/auth/me

Legacy alias for current authenticated user.

Response:

```json
{
  "user": {
    "id": "mongo-id",
    "fullName": "Demo Investor",
    "email": "investor@heavenark.test",
    "role": "investor",
    "status": "active"
  }
}
```

## Purchase routes

All purchase routes require auth. Investors can access only their own records. `admin` and `staff` can access any purchase.

### POST /api/purchases

Creates a purchase with status `deposit_pending`. The backend reads `property.price` and the active installment plan from MongoDB. Frontend prices are not trusted.

Request:

```json
{
  "propertyId": "mongo-id",
  "paymentMode": "installment"
}
```

`paymentMode` values: `installment`, `full_payment`.

Response:

```json
{
  "purchase": {
    "id": "mongo-id",
    "userId": "user-id",
    "propertyId": "property-id",
    "installmentPlanId": "plan-id",
    "status": "deposit_pending",
    "agreedPrice": 4500000,
    "initialDeposit": 1350000,
    "monthlyAmount": 262500,
    "totalMonths": 12,
    "amountPaid": 0
  }
}
```

### GET /api/purchases/me

Returns the current user's purchases with property, payment progress, receipts count, and documents count.

Response:

```json
{
  "data": [
    {
      "id": "purchase-id",
      "status": "active",
      "agreedPrice": 4500000,
      "amountPaid": 1350000,
      "propertyId": {
        "id": "property-id",
        "title": "Heaven Ark Port Harcourt Phase 1",
        "image": "/Port-1.jpg",
        "imageUrl": "/Port-1.jpg"
      },
      "paymentProgress": {
        "amountPaid": 1350000,
        "agreedPrice": 4500000,
        "outstandingBalance": 3150000,
        "percentPaid": 30
      },
      "payments": [],
      "receiptsCount": 1,
      "documentsCount": 2
    }
  ]
}
```

### GET /api/purchases/:id

Returns purchase details with property, installment plan, payments, receipts, and documents.

Response:

```json
{
  "purchase": {
    "id": "purchase-id",
    "status": "active",
    "propertyId": {
      "id": "property-id",
      "title": "Heaven Ark Port Harcourt Phase 1"
    },
    "installmentPlanId": {
      "id": "plan-id",
      "initialDeposit": 1350000,
      "monthlyAmount": 262500,
      "totalMonths": 12
    },
    "payments": [],
    "receipts": [],
    "documents": []
  }
}
```

### POST /api/purchases/:id/payments/initialize

Requires auth. Creates a pending stub payment. The backend validates the requested amount against purchase terms from MongoDB.

Request:

```json
{
  "amount": 1350000,
  "type": "deposit"
}
```

`type` values: `deposit`, `installment`, `full_payment`.

Response:

```json
{
  "authorizationUrl": "/api/payments/stub-checkout/payment-id",
  "reference": "HAP-20260504-AB12CD34"
}
```

## Payment routes

Payment status requires auth. The stub checkout and webhook are public for local/manual testing. No real payment provider logic is implemented.

### GET /api/payments/:id

Requires auth and ownership, `admin`, or `staff`.

Response:

```json
{
  "payment": {
    "id": "payment-id",
    "purchaseId": "purchase-id",
    "userId": "user-id",
    "amount": 1350000,
    "type": "deposit",
    "status": "pending",
    "provider": "stub",
    "providerReference": "HAP-20260504-AB12CD34",
    "purchase": {
      "id": "purchase-id",
      "status": "deposit_pending"
    }
  }
}
```

### GET /api/payments/stub-checkout/:paymentId

Public route for manual testing.

Response:

```json
{
  "checkout": {
    "paymentId": "payment-id",
    "amount": 1350000,
    "type": "deposit",
    "status": "pending",
    "provider": "stub",
    "reference": "HAP-20260504-AB12CD34",
    "webhookUrl": "/api/payments/webhook"
  }
}
```

### POST /api/payments/webhook

Public stub webhook.

Request:

```json
{
  "providerReference": "HAP-20260504-AB12CD34",
  "status": "successful"
}
```

`status` values: `successful`, `failed`.

Successful payment behavior:

- marks payment successful and sets `paidAt`
- increments `purchase.amountPaid`
- marks purchase completed and property sold if fully paid
- marks deposit purchase active and property reserved
- generates a receipt if none exists
- creates a notification

Failed payment behavior:

- marks payment failed

Response:

```json
{
  "received": true,
  "payment": {
    "id": "payment-id",
    "status": "successful",
    "paidAt": "2026-05-04T00:00:00.000Z"
  }
}
```

## Receipt routes

Receipt routes require auth. Users can access only receipts tied to their own payments unless role is `admin` or `staff`.

### GET /api/receipts/:id

Response:

```json
{
  "receipt": {
    "id": "receipt-id",
    "paymentId": "payment-id",
    "receiptNumber": "HAP-RCPT-1777920000000",
    "pdfUrl": "/receipts/payment-id.pdf",
    "issuedAt": "2026-05-04T00:00:00.000Z"
  },
  "payment": {
    "id": "payment-id",
    "amount": 1350000,
    "status": "successful"
  },
  "purchase": {
    "id": "purchase-id",
    "status": "active"
  }
}
```

### GET /api/receipts/:id/download

No PDF generation is implemented. This returns metadata and a placeholder download URL.

Response:

```json
{
  "receipt": {
    "id": "receipt-id",
    "receiptNumber": "HAP-RCPT-1777920000000"
  },
  "payment": {
    "id": "payment-id",
    "status": "successful"
  },
  "downloadUrl": "/receipts/payment-id.pdf"
}
```

## Document routes

Document routes require auth. Users can access only their own documents unless role is `admin` or `staff`.

### GET /api/documents/me

Response:

```json
{
  "data": [
    {
      "id": "document-id",
      "userId": "user-id",
      "propertyId": "property-id",
      "purchaseId": "purchase-id",
      "type": "allocation_letter",
      "title": "Allocation Letter",
      "fileUrl": "/documents/allocation-letter-placeholder.pdf",
      "status": "available"
    }
  ]
}
```

### GET /api/documents/:id/download

No upload/object storage integration is implemented. This returns metadata and a placeholder download URL.

Response:

```json
{
  "document": {
    "id": "document-id",
    "title": "Allocation Letter",
    "type": "allocation_letter",
    "status": "available"
  },
  "downloadUrl": "/documents/allocation-letter-placeholder.pdf"
}
```

## Dashboard routes

### GET /api/dashboard/summary

Requires auth. Investors receive their own summary. `admin` and `staff` receive a global summary.

Response:

```json
{
  "summary": {
    "activePurchases": 1,
    "completedPurchases": 0,
    "totalPaid": 1350000,
    "outstandingBalance": 3150000,
    "nextPaymentDue": {
      "purchaseId": "purchase-id",
      "amount": 262500,
      "dueAt": "2026-05-04T00:00:00.000Z"
    },
    "documentsAvailable": 2
  }
}
```

## Notification routes

### GET /api/notifications/me

Requires auth. Returns current user notifications.

Response:

```json
{
  "data": [
    {
      "id": "notification-id",
      "userId": "user-id",
      "title": "Payment confirmed",
      "message": "Your deposit payment has been confirmed.",
      "type": "payment",
      "readAt": null
    }
  ]
}
```

## Admin routes

All `/api/admin` routes require bearer auth and role `admin` or `staff`, except `PATCH /api/admin/users/:id/role`, which requires `admin`. Admin responses use `{ "message": "...", "data": ... }` for single actions and `{ "data": [...], "meta": ... }` for paginated lists. Password hashes and salts are never returned.

Admin/staff actions create `AuditLog` records when changing properties, user status, user role, purchase status, documents, and content.

### GET /api/admin/overview

Auth: `admin` or `staff`.

Response:

```json
{
  "message": "Admin overview loaded.",
  "data": {
    "users": 24,
    "properties": 8,
    "purchases": 12,
    "inquiries": 31
  }
}
```

### POST /api/admin/properties

Auth: `admin` or `staff`.

Creates a property and optional active installment plan.

Request:

```json
{
  "title": "Heaven Ark New Layout",
  "location": "Growth corridor",
  "city": "Port Harcourt",
  "state": "Rivers",
  "price": 5000000,
  "size": "500 sqm",
  "status": "available",
  "imageUrl": "/land-1.jpg",
  "galleryUrls": ["/land-1.jpg", "/land-2.jpg"],
  "features": ["Dry land", "Good road access"],
  "overview": "Verified land opportunity.",
  "legalStatus": "Verified",
  "isFeatured": true,
  "installmentPlan": {
    "initialDeposit": 1500000,
    "monthlyAmount": 291667,
    "totalMonths": 12,
    "isActive": true
  }
}
```

Response:

```json
{
  "message": "Property created.",
  "data": {
    "id": "property-id",
    "slug": "heaven-ark-new-layout",
    "title": "Heaven Ark New Layout",
    "price": 5000000,
    "status": "available",
    "image": "/land-1.jpg",
    "imageUrl": "/land-1.jpg"
  }
}
```

### PUT /api/admin/properties/:id

Auth: `admin` or `staff`. `:id` must be a Mongo ObjectId.

Updates property fields. If `installmentPlan` is provided, the active plan for the property is upserted.

Request:

```json
{
  "title": "Heaven Ark Updated Layout",
  "price": 5500000,
  "isFeatured": false,
  "installmentPlan": {
    "initialDeposit": 1650000,
    "monthlyAmount": 320834,
    "totalMonths": 12,
    "isActive": true
  }
}
```

Response:

```json
{
  "message": "Property updated.",
  "data": {
    "id": "property-id",
    "slug": "heaven-ark-updated-layout",
    "title": "Heaven Ark Updated Layout",
    "price": 5500000
  }
}
```

### PATCH /api/admin/properties/:id/status

Auth: `admin` or `staff`.

Request:

```json
{
  "status": "reserved"
}
```

Status values: `available`, `reserved`, `sold`, `hidden`.

Response:

```json
{
  "message": "Property status updated.",
  "data": {
    "id": "property-id",
    "status": "reserved"
  }
}
```

### DELETE /api/admin/properties/:id

Auth: `admin` or `staff`.

By default, soft deletes by setting status to `hidden`. Use `?hardDelete=true` to permanently remove.

Response:

```json
{
  "message": "Property hidden.",
  "data": {
    "id": "property-id",
    "status": "hidden"
  }
}
```

### POST /api/admin/properties/:id/images

Auth: `admin` or `staff`.

Accepts JSON image paths only. No upload integration exists.

Request:

```json
{
  "imageUrl": "/Port-1.jpg",
  "galleryUrls": ["/Port-1.jpg", "/port-2.jpg"]
}
```

Response:

```json
{
  "message": "Property images updated.",
  "data": {
    "id": "property-id",
    "image": "/Port-1.jpg",
    "imageUrl": "/Port-1.jpg",
    "galleryUrls": ["/Port-1.jpg", "/port-2.jpg"]
  }
}
```

### GET /api/admin/inquiries

Auth: `admin` or `staff`.

Supports `status`, `source`, `propertyId`, `page`, and `limit`.

Example:

```text
GET /api/admin/inquiries?status=new&source=property_detail&page=1&limit=20
```

Response:

```json
{
  "data": [
    {
      "id": "inquiry-id",
      "name": "Ada Investor",
      "email": "ada@example.com",
      "status": "new",
      "source": "property_detail"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

### GET /api/admin/inquiries/:id

Auth: `admin` or `staff`.

Response:

```json
{
  "message": "Inquiry loaded.",
  "data": {
    "id": "inquiry-id",
    "name": "Ada Investor",
    "message": "I want to inspect this property.",
    "propertyId": {
      "id": "property-id",
      "title": "Heaven Ark Port Harcourt Phase 1"
    }
  }
}
```

### PATCH /api/admin/inquiries/:id/status

Auth: `admin` or `staff`.

Request:

```json
{
  "status": "contacted"
}
```

Response:

```json
{
  "message": "Inquiry status updated.",
  "data": {
    "id": "inquiry-id",
    "status": "contacted"
  }
}
```

### GET /api/admin/users

Auth: `admin` or `staff`.

Supports `role`, `status`, `q`, `page`, and `limit`.

Example:

```text
GET /api/admin/users?role=investor&status=active&q=ada&page=1&limit=20
```

Response:

```json
{
  "data": [
    {
      "id": "user-id",
      "fullName": "Ada Investor",
      "email": "ada@example.com",
      "role": "investor",
      "status": "active"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

### GET /api/admin/users/:id

Auth: `admin` or `staff`.

Response:

```json
{
  "message": "User loaded.",
  "data": {
    "id": "user-id",
    "fullName": "Ada Investor",
    "email": "ada@example.com",
    "phone": "+2348000000000",
    "role": "investor",
    "status": "active"
  }
}
```

### PATCH /api/admin/users/:id/status

Auth: `admin` or `staff`.

Request:

```json
{
  "status": "suspended"
}
```

Status values: `pending_verification`, `active`, `suspended`.

Response:

```json
{
  "message": "User status updated.",
  "data": {
    "id": "user-id",
    "status": "suspended"
  }
}
```

### PATCH /api/admin/users/:id/role

Auth: `admin` only.

Request:

```json
{
  "role": "staff"
}
```

Role values: `investor`, `admin`, `staff`.

Response:

```json
{
  "message": "User role updated.",
  "data": {
    "id": "user-id",
    "role": "staff"
  }
}
```

### GET /api/admin/purchases

Auth: `admin` or `staff`.

Supports `status`, `userId`, `propertyId`, `page`, and `limit`.

Example:

```text
GET /api/admin/purchases?status=active&userId=user-id&page=1&limit=20
```

Response:

```json
{
  "data": [
    {
      "id": "purchase-id",
      "status": "active",
      "userId": {
        "id": "user-id",
        "fullName": "Ada Investor"
      },
      "propertyId": {
        "id": "property-id",
        "title": "Heaven Ark Port Harcourt Phase 1"
      },
      "agreedPrice": 4500000,
      "amountPaid": 1350000
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

### GET /api/admin/payments

Auth: `admin` or `staff`.

Supports `status`, `type`, `userId`, `purchaseId`, `page`, and `limit`.

Example:

```text
GET /api/admin/payments?status=successful&type=deposit&page=1&limit=20
```

Response:

```json
{
  "data": [
    {
      "id": "payment-id",
      "amount": 1350000,
      "type": "deposit",
      "status": "successful",
      "provider": "stub",
      "providerReference": "HAP-20260504-AB12CD34"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

### PATCH /api/admin/purchases/:id/status

Auth: `admin` or `staff`.

Request:

```json
{
  "status": "completed"
}
```

Purchase status values: `initiated`, `deposit_pending`, `active`, `completed`, `cancelled`, `defaulted`.

Response:

```json
{
  "message": "Purchase status updated.",
  "data": {
    "id": "purchase-id",
    "status": "completed"
  }
}
```

### POST /api/admin/purchases/:id/documents

Auth: `admin` or `staff`.

Creates a document for the purchase user and property. Accepts metadata only; no upload integration exists.

Request:

```json
{
  "type": "allocation_letter",
  "title": "Allocation Letter",
  "fileUrl": "/documents/allocation-letter-placeholder.pdf",
  "status": "available"
}
```

Response:

```json
{
  "message": "Document added.",
  "data": {
    "id": "document-id",
    "userId": "user-id",
    "propertyId": "property-id",
    "purchaseId": "purchase-id",
    "type": "allocation_letter",
    "title": "Allocation Letter",
    "status": "available"
  }
}
```

### PUT /api/admin/company

Auth: `admin` or `staff`.

Stores company profile JSON under the `company` setting.

Request:

```json
{
  "name": "Heaven Ark Properties",
  "tagline": "Land banking and real estate investment made clear.",
  "email": "support@heavenark.test",
  "phone": "+2348000000000",
  "address": "Nigeria"
}
```

Response:

```json
{
  "message": "Company content updated.",
  "data": {
    "id": "setting-id",
    "key": "company",
    "value": {
      "name": "Heaven Ark Properties",
      "tagline": "Land banking and real estate investment made clear."
    }
  }
}
```

### POST /api/admin/testimonials

Auth: `admin` or `staff`.

Request:

```json
{
  "name": "Amaka Okoro",
  "role": "Investor",
  "message": "The Heaven Ark team made the land purchase process clear.",
  "imageUrl": "/land-1.jpg",
  "isActive": true
}
```

Response:

```json
{
  "message": "Testimonial created.",
  "data": {
    "id": "testimonial-id",
    "name": "Amaka Okoro",
    "isActive": true
  }
}
```

### PUT /api/admin/testimonials/:id

Auth: `admin` or `staff`.

Request:

```json
{
  "message": "Updated testimonial text.",
  "isActive": true
}
```

Response:

```json
{
  "message": "Testimonial updated.",
  "data": {
    "id": "testimonial-id",
    "message": "Updated testimonial text."
  }
}
```

### DELETE /api/admin/testimonials/:id

Auth: `admin` or `staff`.

Deactivates testimonial instead of hard deleting.

Response:

```json
{
  "message": "Testimonial deactivated.",
  "data": {
    "id": "testimonial-id",
    "isActive": false
  }
}
```

## Notes for frontend integration

Mongo `_id` is serialized as `id`.

Property responses include both `image` and `imageUrl`.

CORS is open for development and does not depend on a frontend URL environment variable.

Store the JWT client-side and send it as a bearer token for protected routes.

Business-facing names remain Heaven Ark / Heaven Ark Properties.

## Curl smoke tests

Set a local base URL:

```bash
BASE_URL=http://localhost:4000
```

### GET /api/health

```bash
curl "$BASE_URL/api/health"
```

Expected response:

```json
{
  "status": "ok",
  "service": "hap-web-app",
  "name": "hap-web-app-backend"
}
```

### POST /api/auth/register

```bash
curl -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Smoke Investor","email":"smoke@example.com","phone":"+2348000000099","password":"Password123"}'
```

Expected response includes:

```json
{
  "user": {
    "id": "user-id",
    "email": "smoke@example.com",
    "role": "investor",
    "status": "active"
  },
  "token": "jwt-token"
}
```

### POST /api/auth/login

```bash
TOKEN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"investor@heavenark.test","password":"InvestorPass123"}' | node -pe "JSON.parse(require('fs').readFileSync(0, 'utf8')).token")
```

Expected response includes a JWT token with no expiry configured by the backend.

### GET /api/properties

```bash
curl "$BASE_URL/api/properties"
```

Expected response:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 0,
    "totalPages": 0
  },
  "filters": {
    "q": null,
    "location": null,
    "minPrice": null,
    "maxPrice": null,
    "status": null,
    "featured": false,
    "sort": "newest"
  }
}
```

### POST /api/inquiries

```bash
curl -X POST "$BASE_URL/api/inquiries" \
  -H "Content-Type: application/json" \
  -d '{"name":"Smoke User","email":"smoke-inquiry@example.com","phone":"+2348000000098","message":"I want to inspect a property.","source":"general"}'
```

Expected response:

```json
{
  "message": "Request transmitted.",
  "inquiry": {
    "id": "inquiry-id",
    "status": "new"
  }
}
```

### POST /api/purchases

Use a property id returned from `GET /api/properties`.

```bash
PROPERTY_ID=replace-with-property-id
curl -X POST "$BASE_URL/api/purchases" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"propertyId\":\"$PROPERTY_ID\",\"paymentMode\":\"installment\"}"
```

Expected response includes a `deposit_pending` purchase. The backend reads price and installment values from MongoDB.

### POST /api/purchases/:id/payments/initialize

Use the purchase id from the previous response. `amount` must match backend purchase terms.

```bash
PURCHASE_ID=replace-with-purchase-id
curl -X POST "$BASE_URL/api/purchases/$PURCHASE_ID/payments/initialize" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"amount":1350000,"type":"deposit"}'
```

Expected response:

```json
{
  "authorizationUrl": "/api/payments/stub-checkout/payment-id",
  "reference": "HAP-20260504-AB12CD34"
}
```

### POST /api/payments/webhook

Use the `reference` from payment initialization.

```bash
REFERENCE=replace-with-provider-reference
curl -X POST "$BASE_URL/api/payments/webhook" \
  -H "Content-Type: application/json" \
  -d "{\"providerReference\":\"$REFERENCE\",\"status\":\"successful\"}"
```

Expected response:

```json
{
  "received": true,
  "payment": {
    "id": "payment-id",
    "status": "successful"
  }
}
```

## Stubbed features/TODOs

Forgot/reset password routes are validation-only stubs.

Payments are stub/manual records only. Real Paystack/Flutterwave integration is a future TODO.

Receipts store `pdfUrl` only. Receipt PDF generation is a future TODO.

Documents store `fileUrl` only. Uploads and object storage are future TODOs.

Email/SMS notifications, refresh tokens, password reset delivery, and account verification delivery are future TODOs.
