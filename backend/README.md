# hap-web-app backend

Fastify, MongoDB, and Mongoose backend for the `hap-web-app` project.

## Setup

1. Create `.env` using `.env.example` as a guide. Required variables:

```bash
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/hap-web-app
JWT_SECRET=replace-with-a-long-random-secret
```

2. Install dependencies:

```bash
npm install
```

3. Seed demo data:

```bash
npm run seed
```

4. Start the development server:

```bash
npm run dev
```

5. Start without nodemon:

```bash
npm start
```

API base path: `/api`.

Frontend integration details live in `BACKEND_DOCUMENTATION.md`.

## Seed test credentials

```text
Admin: admin@heavenark.test / AdminPass123
Investor: investor@heavenark.test / InvestorPass123
```

## Quick smoke tests

Set this once:

```bash
BASE_URL=http://localhost:4000
```

Health:

```bash
curl "$BASE_URL/api/health"
```

Register:

```bash
curl -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Smoke Investor","email":"smoke@example.com","phone":"+2348000000099","password":"Password123"}'
```

Login and save token:

```bash
TOKEN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"investor@heavenark.test","password":"InvestorPass123"}' | node -pe "JSON.parse(require('fs').readFileSync(0, 'utf8')).token")
```

Properties:

```bash
curl "$BASE_URL/api/properties"
```

Inquiry:

```bash
curl -X POST "$BASE_URL/api/inquiries" \
  -H "Content-Type: application/json" \
  -d '{"name":"Smoke User","email":"smoke-inquiry@example.com","phone":"+2348000000098","message":"I want to inspect a property.","source":"general"}'
```

Create purchase:

```bash
PROPERTY_ID=replace-with-property-id
curl -X POST "$BASE_URL/api/purchases" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"propertyId\":\"$PROPERTY_ID\",\"paymentMode\":\"installment\"}"
```

Initialize stub payment:

```bash
PURCHASE_ID=replace-with-purchase-id
curl -X POST "$BASE_URL/api/purchases/$PURCHASE_ID/payments/initialize" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"amount":1350000,"type":"deposit"}'
```

Trigger stub webhook:

```bash
REFERENCE=replace-with-provider-reference
curl -X POST "$BASE_URL/api/payments/webhook" \
  -H "Content-Type: application/json" \
  -d "{\"providerReference\":\"$REFERENCE\",\"status\":\"successful\"}"
```
