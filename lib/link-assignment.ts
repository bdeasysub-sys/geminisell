import { Prisma } from "@prisma/client";
import { ApiError, StockUnavailableError } from "@/lib/api-errors";
import { prisma } from "@/lib/prisma";
import type { PaymentWebhookInput } from "@/lib/validation";

type LockedLinkRow = {
  id: number;
  link: string;
};

export async function assignFirstAvailableLink(input: PaymentWebhookInput) {
  return prisma.$transaction(
    async (tx) => {
      const existingOrder = await tx.order.findUnique({
        where: { paymentId: input.paymentId }
      });

      if (existingOrder) {
        return {
          order: existingOrder,
          assignedLink: existingOrder.assignedLink,
          alreadyAssigned: true
        };
      }

      const existingCustomerOrder = await tx.order.findFirst({
        where: {
          OR: [{ email: input.email }, { phone: input.phone }]
        },
        orderBy: { createdAt: "desc" }
      });

      if (existingCustomerOrder) {
        const repeatedFields = [
          existingCustomerOrder.email === input.email ? "email" : undefined,
          existingCustomerOrder.phone === input.phone ? "phone number" : undefined
        ].filter(Boolean);

        throw new ApiError(
          409,
          "conflict",
          `An order already exists with this ${repeatedFields.join(" and ")}.`
        );
      }

      const availableLinks = await tx.$queryRaw<LockedLinkRow[]>`
        SELECT id, link
        FROM links
        WHERE status = 'available'
        ORDER BY id ASC
        LIMIT 1
        FOR UPDATE
      `;
      const selected = availableLinks[0];

      if (!selected) {
        throw new StockUnavailableError();
      }

      const updateResult = await tx.link.updateMany({
        where: {
          id: selected.id,
          status: "available"
        },
        data: {
          status: "sold",
          assignedTo: input.email,
          paymentId: input.paymentId,
          assignedAt: new Date()
        }
      });

      if (updateResult.count !== 1) {
        throw new ApiError(
          409,
          "conflict",
          "Selected link was no longer available. Please retry the webhook."
        );
      }

      const order = await tx.order.create({
        data: {
          customerName: input.customerName,
          email: input.email,
          phone: input.phone,
          paymentId: input.paymentId,
          linkId: selected.id,
          assignedLink: selected.link
        }
      });

      return {
        order,
        assignedLink: selected.link,
        alreadyAssigned: false
      };
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      maxWait: 5000,
      timeout: 10000
    }
  );
}
