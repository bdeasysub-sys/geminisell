# EasySub

Production-ready link pool management system for selling digital subscriptions.

## Stack

- Next.js 15 App Router
- TypeScript
- Prisma
- MySQL
- Tailwind CSS
- Resend Email
- JWT admin authentication
- REST API
- Docker

## Folder Structure

```text
app/
  page.tsx
  globals.css
  admin/
    login/page.tsx
    dashboard/page.tsx
    dashboard/AdminDashboard.tsx
  api/
    admin/
      login/route.ts
      logout/route.ts
      me/route.ts
      summary/route.ts
      links/route.ts
      links/bulk/route.ts
      links/[id]/route.ts
      orders/route.ts
      orders/export/route.ts
      orders/[id]/resend-email/route.ts
    demo-checkout/route.ts
    webhooks/payment/route.ts
lib/
  api-errors.ts
  auth.ts
  csv.ts
  email.ts
  env.ts
  link-assignment.ts
  prisma.ts
  rate-limit.ts
  request.ts
  validation.ts
prisma/
  schema.prisma
  seed.ts
  migrations/20260625000000_init/migration.sql
public/assets/
  easysub-gemini-hero.png
```

## Setup

1. Copy `.env.example` to `.env`.
2. Fill in `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `JWT_SECRET`. Resend and `PAYMENT_WEBHOOK_SECRET` are optional for local demo testing.
3. Install dependencies:

```bash
npm install
```

4. Run MySQL locally, or start the included database:

```bash
docker compose up -d mysql
```

5. Apply migrations and seed:

```bash
npm run prisma:dev
npm run prisma:seed
```

6. Start the app:

```bash
npm run dev
```

## ZiniPay Checkout

Order buttons open:

```text
/demo-checkout
```

The checkout creates a hosted ZiniPay payment invoice:

```text
POST /api/zinipay/create
```

Supported JSON fields:

```json
{
  "customerName": "Customer Name",
  "email": "customer@example.com",
  "phone": "01700000000"
}
```

The endpoint creates a ZiniPay invoice and returns `paymentUrl`. The customer is redirected to ZiniPay. After payment, ZiniPay redirects to `/payment/zinipay/return`, where the app verifies the invoice before reserving a link and creating the order. A new order is blocked when the same email or phone number already exists.

Set these environment variables:

```text
ZINIPAY_API_KEY="your-zinipay-brand-api-key"
ZINIPAY_AMOUNT="790"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

ZiniPay webhooks should call:

```text
POST /api/zinipay/webhook
```

## Webhook

Payment providers should call:

```text
POST /api/webhooks/payment
```

Include the webhook secret as one of:

```text
x-webhook-secret: your-secret
x-easysub-webhook-secret: your-secret
?secret=your-secret
```

Supported JSON fields:

```json
{
  "customer_name": "Customer Name",
  "email": "customer@example.com",
  "phone": "01700000000",
  "payment_id": "PAYMENT-123"
}
```

The webhook runs a database transaction, blocks repeated email or phone orders, locks the first available link with `FOR UPDATE`, marks it sold, inserts the order, commits, and sends the subscription email.

If stock is unavailable, the response message is:

```text
Sorry, currently stock unavailable.
```

## Admin

```text
/admin/login
/admin/dashboard
```

The dashboard supports:

- Add link
- Delete available link
- Bulk upload CSV
- View available links
- View sold links
- Search customers/orders
- Export orders CSV
- Resend email

## CSV Upload

CSV may be a single-column file:

```csv
link
https://example.com/subscription-1
https://example.com/subscription-2
```

Duplicate links are skipped by the database unique constraint.

## Docker

```bash
docker compose up --build
```

The app container runs migrations before starting.
