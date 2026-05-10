# Heaven Ark Frontend Backend Plan

This plan is based on a scan of the current frontend-only Next.js app in `src/app`, `src/components`, `src/lib`, and `src/data`.

## Current Frontend Surface

Routes:

- `/` - marketing home with featured lands, trust stats, process steps, testimonials, and CTAs.
- `/properties` - property listing page with client-side search, location filter, and price filter.
- `/properties/[id]` - property detail page with acquisition CTA.
- `/login` - investor login screen, currently simulated.
- `/register` - investor application/registration screen, currently simulated.
- `/contact` - consultation/contact form, currently local state only.
- Referenced but missing frontend routes: `/purchase/[id]`, `/privacy`, `/terms`, dashboard/profile/payment/document pages.

Existing API client:

- Base URL: `NEXT_PUBLIC_API_URL || http://localhost:5000/api`
- Auth token source: `localStorage.getItem('token')`
- Sends JSON with `Authorization: Bearer <token>` when available.
- Declared auth calls:
  - `POST /auth/login`
  - `POST /auth/register`
  - `GET /auth/profile`
  - `PUT /auth/profile`

Current local property shape from `src/data/mockLands.js`:

```json
{
  "id": "land-001",
  "title": "Prime Residential Plot - Lekki Phase 1",
  "location": "Lekki Phase 1, Lagos",
  "price": 15000000,
  "size": "500 sqm",
  "status": "available",
  "image": "/Port-1.jpg",
  "features": ["Direct Road Access", "Electricity Nearby"],
  "installmentPlan": {
    "initialDeposit": 5000000,
    "monthlyAmount": 500000,
    "totalMonths": 20
  }
}
```

## Recommended Backend Stack

- Runtime: Node.js 20+
- Framework: Express.js or Fastify
- Database: PostgreSQL
- ORM: Prisma
- Auth: JWT access token plus refresh token, bcrypt/argon2 password hashing
- Validation: Zod or Joi
- Uploads/storage: S3-compatible storage, Cloudinary, or Vercel Blob for property images and documents
- Payments: Paystack or Flutterwave for Nigerian card/bank/transfer flows
- Email/SMS: Resend/Mailgun plus Termii/Twilio for verification and lead notifications

## Core Database Models

Users:

- `id`
- `fullName`
- `email` unique
- `phone`
- `passwordHash`
- `role`: `investor`, `admin`, `staff`
- `status`: `pending_verification`, `active`, `suspended`
- `emailVerifiedAt`
- `phoneVerifiedAt`
- `createdAt`
- `updatedAt`

Properties:

- `id`
- `slug`
- `title`
- `location`
- `city`
- `state`
- `price`
- `size`
- `status`: `available`, `reserved`, `sold`, `hidden`
- `imageUrl`
- `galleryUrls`
- `features`
- `overview`
- `legalStatus`
- `titleDeedStatus`
- `certificateOfOccupancyStatus`
- `governorConsentStatus`
- `isFeatured`
- `createdAt`
- `updatedAt`

InstallmentPlans:

- `id`
- `propertyId`
- `initialDeposit`
- `monthlyAmount`
- `totalMonths`
- `isActive`

Inquiries:

- `id`
- `name`
- `email`
- `phone`
- `message`
- `source`: `contact`, `property_detail`, `general`
- `propertyId` nullable
- `status`: `new`, `contacted`, `closed`
- `createdAt`

Purchases:

- `id`
- `userId`
- `propertyId`
- `installmentPlanId`
- `status`: `initiated`, `deposit_pending`, `active`, `completed`, `cancelled`, `defaulted`
- `agreedPrice`
- `initialDeposit`
- `monthlyAmount`
- `totalMonths`
- `amountPaid`
- `startedAt`
- `completedAt`

Payments:

- `id`
- `purchaseId`
- `userId`
- `amount`
- `type`: `deposit`, `installment`, `full_payment`
- `status`: `pending`, `successful`, `failed`, `refunded`
- `provider`
- `providerReference`
- `paidAt`
- `createdAt`

Receipts:

- `id`
- `paymentId`
- `receiptNumber`
- `pdfUrl`
- `issuedAt`

Documents:

- `id`
- `userId`
- `propertyId`
- `purchaseId`
- `type`: `survey_plan`, `deed_of_assignment`, `allocation_letter`, `receipt`, `contract`
- `title`
- `fileUrl`
- `status`: `pending`, `available`, `signed`
- `createdAt`

ContentSettings:

- company profile, homepage stats, testimonials, contact details, legal page content.

## Required Public API Endpoints

### Health

`GET /api/health`

Returns backend status for frontend/dev checks.

### Auth

`POST /api/auth/register`

Current frontend fields:

```json
{
  "fullName": "John Doe",
  "email": "investor@example.com",
  "phone": "+2348000000000",
  "password": "password"
}
```

Recommended response:

```json
{
  "message": "Registration request queued for verification.",
  "user": {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "investor@example.com",
    "phone": "+2348000000000",
    "status": "pending_verification"
  },
  "token": "jwt"
}
```

Notes:

- Validate email, phone, password length, and unique email.
- Do not accept `confirmPassword`; the frontend should compare locally.
- Decide whether registration creates `pending_verification` or immediately `active`.

`POST /api/auth/login`

Request:

```json
{
  "email": "investor@example.com",
  "password": "password"
}
```

Response:

```json
{
  "message": "Login successful.",
  "token": "jwt",
  "user": {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "investor@example.com",
    "phone": "+2348000000000",
    "role": "investor",
    "status": "active"
  }
}
```

`GET /api/auth/profile`

Requires auth. Returns the logged-in user's profile plus account summary.

`PUT /api/auth/profile`

Requires auth. Accepts editable fields:

```json
{
  "fullName": "John Doe",
  "phone": "+2348000000000"
}
```

`POST /api/auth/logout`

Use if refresh tokens/sessions are stored server-side.

`POST /api/auth/forgot-password`

Needed because `/login` has a Recovery link.

`POST /api/auth/reset-password`

Completes password recovery.

### Properties

`GET /api/properties`

Powers `/properties` and home featured cards.

Query params:

- `q` - search title/location
- `location`
- `minPrice`
- `maxPrice`
- `status`
- `featured`
- `page`
- `limit`
- `sort`

Response:

```json
{
  "data": [
    {
      "id": "land-001",
      "slug": "prime-residential-plot-lekki-phase-1",
      "title": "Prime Residential Plot - Lekki Phase 1",
      "location": "Lekki Phase 1, Lagos",
      "price": 15000000,
      "size": "500 sqm",
      "status": "available",
      "image": "/Port-1.jpg",
      "features": ["Direct Road Access"],
      "installmentPlan": {
        "initialDeposit": 5000000,
        "monthlyAmount": 500000,
        "totalMonths": 20
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 4
  },
  "filters": {
    "locations": ["Lekki", "Ibeju-Lekki", "Ajah", "Abeokuta"],
    "priceRange": {
      "min": 3000000,
      "max": 25000000
    }
  }
}
```

`GET /api/properties/featured`

Alternative to `GET /api/properties?featured=true&limit=3` for home page.

`GET /api/properties/:id`

Powers `/properties/[id]`. Return all detail fields, legal status fields, gallery, and active installment plan.

`GET /api/properties/:id/availability`

Useful before acquisition, to ensure an asset is still `available`.

### Contact And Leads

`POST /api/inquiries`

Powers `/contact` and property-detail consultation requests.

Current contact form visually asks for name, email, and message. State includes phone, so backend should support phone too.

Request:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+2348000000000",
  "message": "I want details on Lekki plots.",
  "propertyId": "land-001",
  "source": "contact"
}
```

Response:

```json
{
  "message": "Request transmitted.",
  "inquiry": {
    "id": "uuid",
    "status": "new"
  }
}
```

## Acquisition, Payments, Receipts, And Documents

These are not fully built as frontend pages yet, but the current UI promises them through CTAs and marketing copy: `/purchase/[id]`, secure payments, automated receipts, ownership progress, dashboard tracking, and document downloads.

`POST /api/purchases`

Requires auth. Starts acquisition for a property.

Request:

```json
{
  "propertyId": "land-001",
  "paymentMode": "installment"
}
```

Response:

```json
{
  "purchase": {
    "id": "uuid",
    "propertyId": "land-001",
    "status": "deposit_pending",
    "initialDeposit": 5000000,
    "monthlyAmount": 500000,
    "totalMonths": 20
  }
}
```

`GET /api/purchases/me`

Requires auth. Lists the investor's active/completed acquisitions.

`GET /api/purchases/:id`

Requires auth and ownership/admin access. Returns purchase details, payment progress, receipts, and documents.

`POST /api/purchases/:id/payments/initialize`

Requires auth. Starts deposit/installment/full payment with Paystack/Flutterwave.

Request:

```json
{
  "amount": 5000000,
  "type": "deposit"
}
```

Response:

```json
{
  "authorizationUrl": "https://payment-provider/checkout/...",
  "reference": "HAP-20260501-0001"
}
```

`POST /api/payments/webhook`

Public provider webhook. Must verify provider signature, mark payment successful/failed, update `Purchases.amountPaid`, generate receipt, and notify user.

`GET /api/payments/:id`

Requires auth. Returns payment status.

`GET /api/receipts/:id`

Requires auth. Returns receipt metadata.

`GET /api/receipts/:id/download`

Requires auth. Streams receipt PDF or redirects to signed file URL.

`GET /api/documents/me`

Requires auth. Lists all user documents.

`GET /api/documents/:id/download`

Requires auth. Downloads signed/generated legal documents.

## Dashboard-Supporting Endpoints

No dashboard route exists yet, but the copy says investors can track payments, download documents, and monitor ownership progress.

`GET /api/dashboard/summary`

Requires auth. Recommended response:

```json
{
  "activePurchases": 1,
  "completedPurchases": 0,
  "totalPaid": 5000000,
  "outstandingBalance": 10000000,
  "nextPaymentDue": "2026-06-01",
  "documentsAvailable": 2
}
```

`GET /api/notifications/me`

Requires auth. For document/payment/status alerts.

## Content Endpoints

The app currently hardcodes company data, stats, and testimonials. These can stay static for launch, but backend-driven content will prevent code deploys for simple edits.

`GET /api/company`

Returns company name, RC number, phone, email, address, and stats.

`GET /api/testimonials`

Returns testimonial cards for the home page.

`GET /api/legal/privacy`

Supports `/privacy`.

`GET /api/legal/terms`

Supports `/terms`.

## Admin API Endpoints

Needed for staff to manage the business data behind the frontend. Protect with `admin` or `staff` role.

Properties:

- `POST /api/admin/properties`
- `PUT /api/admin/properties/:id`
- `PATCH /api/admin/properties/:id/status`
- `DELETE /api/admin/properties/:id`
- `POST /api/admin/properties/:id/images`

Inquiries:

- `GET /api/admin/inquiries`
- `GET /api/admin/inquiries/:id`
- `PATCH /api/admin/inquiries/:id/status`

Users:

- `GET /api/admin/users`
- `GET /api/admin/users/:id`
- `PATCH /api/admin/users/:id/status`
- `PATCH /api/admin/users/:id/role`

Purchases/payments:

- `GET /api/admin/purchases`
- `GET /api/admin/payments`
- `POST /api/admin/purchases/:id/documents`
- `PATCH /api/admin/purchases/:id/status`

Content:

- `PUT /api/admin/company`
- `POST /api/admin/testimonials`
- `PUT /api/admin/testimonials/:id`
- `DELETE /api/admin/testimonials/:id`

## Frontend Integration Changes Needed

Auth pages:

- Import `authAPI` in `/login` and `/register`.
- Bind login inputs to `formData`; currently the login inputs are not connected to state.
- On login/register success, store `token` in `localStorage` and redirect to dashboard or `/properties`.
- Show backend `message` errors in the existing error UI.

Properties:

- Replace `mockLands` usage with `GET /api/properties` and `GET /api/properties/:id`.
- Move filtering/searching to backend query params once data grows.
- Keep frontend filters as UI state.

Contact:

- Bind contact inputs to `formData`; currently inputs are visually present but not connected.
- Submit to `POST /api/inquiries`.
- Include `propertyId` when inquiry originates from a property detail page.

Purchase flow:

- Create frontend route `/purchase/[id]`.
- Require auth; if no token, redirect to `/login?redirect=/purchase/:id`.
- Call `POST /api/purchases`, then `POST /api/purchases/:id/payments/initialize`.

Missing legal routes:

- Add `/privacy` and `/terms`, either static pages or content fetched from backend.

## Suggested Build Order

1. Backend foundation: Express/Fastify app, PostgreSQL, Prisma, validation, error handling, CORS, request logging.
2. Auth: register, login, profile, JWT middleware, roles.
3. Properties: seed current `mockLands`, list/detail/filter endpoints.
4. Contact inquiries: create inquiry endpoint plus email notification.
5. Frontend integration for auth, properties, and contact.
6. Purchase flow: purchase creation, provider payment initialization, webhook verification.
7. Receipts/documents: receipt generation, document storage, authenticated downloads.
8. Dashboard endpoints and frontend dashboard.
9. Admin APIs and admin UI.

## Security And Operational Notes

- Configure CORS for the frontend domain and local dev origin.
- Never trust frontend prices during purchase creation; always read property and installment values from the database.
- Use server-generated payment references and receipt numbers.
- Verify payment webhooks with provider signatures.
- Use role and ownership checks for purchases, receipts, and documents.
- Rate-limit auth and inquiry endpoints.
- Store secrets only in backend env vars.
- Log audit events for property changes, purchase status changes, and document uploads.
