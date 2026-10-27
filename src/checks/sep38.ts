/**
 * Check: SEP-38 quote response shape.
 */

import type { CheckContext, CheckResult, CheckDefinition } from "../types/index.ts";

const REQUIRED_QUOTE_FIELDS = ["id", "expires_at", "price", "sell_asset", "buy_asset"];

export const sep38Quote: CheckDefinition = {
  id: "sep38.quote",
  category: "sep38",
  description: "SEP-38 quote response shape",
  run(ctx: CheckContext): CheckResult {
    const t0 = performance.now();
    const quote = ctx.metadata?.quote as Record<string, unknown> | undefined;
    if (!quote) {
      return {
        id: sep38Quote.id,
        category: "sep38",
        status: "error",
        message: "No quote provided in context.metadata",
        durationMs: performance.now() - t0,
      };
    }
    const missing = REQUIRED_QUOTE_FIELDS.filter((k) => !(k in quote));
    if (missing.length > 0) {
      return {
        id: sep38Quote.id,
        category: "sep38",
        status: "fail",
        message: `Missing required quote fields: ${missing.join(", ")}`,
        details: { present: Object.keys(quote), missing },
        durationMs: performance.now() - t0,
      };
    }
    return {
      id: sep38Quote.id,
      category: "sep38",
      status: "pass",
      message: "SEP-38 quote response shape valid",
      details: { fields: Object.keys(quote) },
      durationMs: performance.now() - t0,
    };
  },
};
