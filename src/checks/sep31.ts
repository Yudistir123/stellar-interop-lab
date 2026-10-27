/**
 * Check: SEP-31 transaction status response shape.
 */

import type { CheckContext, CheckResult, CheckDefinition } from "../types/index.ts";

const REQUIRED_TX_FIELDS = ["id", "status", "amount_in", "amount_out", "asset"];

export const sep31TransactionStatus: CheckDefinition = {
  id: "sep31.transaction_status",
  category: "sep31",
  description: "SEP-31 transaction status response shape",
  run(ctx: CheckContext): CheckResult {
    const t0 = performance.now();
    const tx = ctx.transactionStatus as Record<string, unknown> | undefined;
    if (!tx) {
      return {
        id: sep31TransactionStatus.id,
        category: "sep31",
        status: "error",
        message: "No transactionStatus provided in context",
        durationMs: performance.now() - t0,
      };
    }
    const missing = REQUIRED_TX_FIELDS.filter((k) => !(k in tx));
    if (missing.length > 0) {
      return {
        id: sep31TransactionStatus.id,
        category: "sep31",
        status: "fail",
        message: `Missing required transaction fields: ${missing.join(", ")}`,
        details: { present: Object.keys(tx), missing },
        durationMs: performance.now() - t0,
      };
    }
    const validStatuses = new Set([
      "pending_sender",
      "pending_receiver",
      "pending_transaction_info_request",
      "pending_customer_info_update",
      "pending_receiver",
      "completed",
      "failed",
    ]);
    if (!validStatuses.has(String(tx.status))) {
      return {
        id: sep31TransactionStatus.id,
        category: "sep31",
        status: "fail",
        message: `Invalid status value: ${String(tx.status)}`,
        details: { status: tx.status, valid: [...validStatuses] },
        durationMs: performance.now() - t0,
      };
    }
    return {
      id: sep31TransactionStatus.id,
      category: "sep31",
      status: "pass",
      message: "SEP-31 transaction status valid",
      details: { status: tx.status, fields: Object.keys(tx) },
      durationMs: performance.now() - t0,
    };
  },
};
