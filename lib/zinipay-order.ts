import { PaymentIntentStatus } from "@prisma/client";
import { ApiError, assertFound } from "@/lib/api-errors";
import { sendSubscriptionEmail } from "@/lib/email";
import { assignFirstAvailableLink } from "@/lib/link-assignment";
import { prisma } from "@/lib/prisma";
import { verifyZiniPayPayment } from "@/lib/zinipay";

export async function finalizeZiniPayInvoice(invoiceId: string) {
  const intent = assertFound(
    await prisma.paymentIntent.findUnique({ where: { invoiceId } }),
    "Payment invoice was not found."
  );

  const existingOrder = await prisma.order.findUnique({
    where: { paymentId: intent.invoiceId }
  });

  if (intent.status === PaymentIntentStatus.completed && existingOrder) {
    return {
      message: "Payment was already completed.",
      order: existingOrder,
      email: {
        sent: false,
        skipped: true,
        reason: "Payment was already completed."
      }
    };
  }

  const verification = await verifyZiniPayPayment(invoiceId);
  const status = verification.status;

  if (status !== "completed") {
    await prisma.paymentIntent.update({
      where: { invoiceId: intent.invoiceId },
      data: {
        status: toPaymentIntentStatus(status),
        transactionId: verification.transactionId,
        paymentMethod: verification.paymentMethod
      }
    });

    throw new ApiError(
      402,
      "payment_gateway_error",
      status === "pending"
        ? "Payment is not completed yet."
        : "Payment was not successful."
    );
  }

  if (verification.amount !== undefined && verification.amount !== intent.amount) {
    throw new ApiError(
      409,
      "payment_gateway_error",
      "Verified payment amount does not match this order."
    );
  }

  if (
    verification.customerEmail &&
    verification.customerEmail.toLowerCase() !== intent.email.toLowerCase()
  ) {
    throw new ApiError(
      409,
      "payment_gateway_error",
      "Verified payment customer does not match this order."
    );
  }

  const assignment = await assignFirstAvailableLink({
    customerName: intent.customerName,
    email: intent.email,
    phone: intent.phone,
    paymentId: intent.invoiceId
  });

  await prisma.paymentIntent.update({
    where: { invoiceId: intent.invoiceId },
    data: {
      status: PaymentIntentStatus.completed,
      transactionId: verification.transactionId,
      paymentMethod: verification.paymentMethod
    }
  });

  const email = assignment.alreadyAssigned
    ? {
        sent: false,
        skipped: true,
        reason: "Payment was already assigned."
      }
    : await sendSubscriptionEmail({
        customerName: intent.customerName,
        email: intent.email,
        assignedLink: assignment.assignedLink
      });

  return {
    message: assignment.alreadyAssigned
      ? "Payment was already assigned."
      : "Payment verified and link assigned successfully.",
    order: assignment.order,
    email
  };
}

function toPaymentIntentStatus(status: "pending" | "completed" | "failed" | "canceled") {
  if (status === "completed") return PaymentIntentStatus.completed;
  if (status === "failed") return PaymentIntentStatus.failed;
  if (status === "canceled") return PaymentIntentStatus.canceled;
  return PaymentIntentStatus.pending;
}
