/**
 * Check: SEP-31 transaction status validation.
 *
 * Field and status values verified against SEP-31 v3.1.0 `transaction` Object
 * Schema. `amount_in`, `amount_out`, and all `*_asset` fields are optional per
 * spec, so only `id` and `status` are required. The transaction object has no
 * `asset` field; assets are expressed as `amount_in_asset`, `amount_out_asset`,
 * and `amount_fee_asset` in SEP-38 Asset Identification Format.
 */

import type { CheckContext, CheckResult, CheckDefinition } from "../types/index.ts";

const REQUIRED_TX_FIELDS = ["id", "status"];

const VALID_STATUSES: readonly string[] = [
  "pending_sender",
  "pending_stellar",
  "pending_customer_info_update",
  "pending_transaction_info_update",
  "pending_receiver",
  "pending_external",
  "completed",
  "refunded",
  "expired",
  "error",
];

export const sep31TransactionStatus: CheckDefinition = {
  id: "sep31.transaction_status",
  category: "sep31",
  description: "SEP-31 transaction status validation",
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
    if (!VALID_STATUSES.includes(String(tx.status))) {
      return {
        id: sep31TransactionStatus.id,
        category: "sep31",
        status: "fail",
        message: `Invalid status value: ${String(tx.status)}`,
        details: { status: tx.status, valid: VALID_STATUSES },
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
