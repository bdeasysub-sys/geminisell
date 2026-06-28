import { z } from "zod";

const nameSchema = z.string().trim().min(1).max(191);
const emailSchema = z.string().trim().email().max(191).transform((value) => value.toLowerCase());
const phoneSchema = z
  .string()
  .trim()
  .min(3)
  .max(64)
  .transform((value) => value.replace(/[\s().-]/g, ""))
  .refine((value) => /^\+?[0-9]{3,20}$/.test(value), {
    message: "Phone number must contain 3 to 20 digits and may start with +."
  });
const paymentIdSchema = z.string().trim().min(1).max(191);
const invoiceIdSchema = z.string().trim().min(1).max(191);
const linkSchema = z.string().trim().min(5).max(768);

export const adminLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(500)
});

export const addLinkSchema = z.object({
  link: linkSchema
});

export const bulkUploadSchema = z.object({
  csv: z.string().min(1).max(2_000_000)
});

export const linksQuerySchema = z.object({
  status: z.enum(["available", "sold", "all"]).optional().default("all"),
  q: z.string().trim().max(191).optional().default(""),
  page: z.coerce.number().int().min(1).max(10_000).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(25)
});

export const ordersQuerySchema = z.object({
  search: z.string().trim().max(191).optional().default(""),
  page: z.coerce.number().int().min(1).max(10_000).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(25)
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const checkoutSchema = z.object({
  customerName: nameSchema,
  email: emailSchema,
  phone: phoneSchema
});

export const ziniPayVerifySchema = z.object({
  invoiceId: invoiceIdSchema
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type PaymentWebhookInput = CheckoutInput & {
  paymentId: string;
};

export type ZiniPayVerifyInput = z.infer<typeof ziniPayVerifySchema>;

export function parsePaymentWebhookPayload(payload: unknown): PaymentWebhookInput {
  const record = asRecord(payload);
  const customer = asRecord(record.customer);
  const data = asRecord(record.data);
  const nestedCustomer = asRecord(data.customer);

  return checkoutSchema
    .extend({
      paymentId: paymentIdSchema
    })
    .parse({
      customerName:
        readString(record, "customer_name", "customerName", "name") ??
        readString(customer, "name", "customer_name", "customerName") ??
        readString(data, "customer_name", "customerName", "name") ??
        readString(nestedCustomer, "name", "customer_name", "customerName"),
      email:
        readString(record, "email", "customer_email", "customerEmail") ??
        readString(customer, "email") ??
        readString(data, "email", "customer_email", "customerEmail") ??
        readString(nestedCustomer, "email"),
      phone:
        readString(record, "phone", "customer_phone", "customerPhone", "mobile") ??
        readString(customer, "phone", "mobile") ??
        readString(data, "phone", "customer_phone", "customerPhone", "mobile") ??
        readString(nestedCustomer, "phone", "mobile"),
      paymentId:
        readString(record, "payment_id", "paymentId", "transaction_id", "transactionId") ??
        readString(data, "payment_id", "paymentId", "transaction_id", "transactionId")
    });
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

function readString(record: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }

    if (typeof value === "number") {
      return String(value);
    }
  }

  return undefined;
}
