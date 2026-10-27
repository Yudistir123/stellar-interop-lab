/**
 * Check: SEP-24 deposit/withdraw info response shape.
 */

import type { CheckContext, CheckResult, CheckDefinition } from "../types/index.ts";

const REQUIRED_INFO_FIELDS = ["how", "id"];

export const sep24DepositWithdrawInfo: CheckDefinition = {
  id: "sep24.deposit_withdraw_info",
  category: "sep24",
  description: "SEP-24 deposit/withdraw info response shape",
  run(ctx: CheckContext): CheckResult {
    const t0 = performance.now();
    const info = ctx.depositInfo as Record<string, unknown> | undefined;
    if (!info) {
      return {
        id: sep24DepositWithdrawInfo.id,
        category: "sep24",
        status: "error",
        message: "No depositInfo provided in context",
        durationMs: performance.now() - t0,
      };
    }
    const missing = REQUIRED_INFO_FIELDS.filter((k) => !(k in info));
    if (missing.length > 0) {
      return {
        id: sep24DepositWithdrawInfo.id,
        category: "sep24",
        status: "fail",
        message: `Missing required info fields: ${missing.join(", ")}`,
        details: { present: Object.keys(info), missing },
        durationMs: performance.now() - t0,
      };
    }
    return {
      id: sep24DepositWithdrawInfo.id,
      category: "sep24",
      status: "pass",
      message: "SEP-24 info response shape valid",
      details: { fields: Object.keys(info) },
      durationMs: performance.now() - t0,
    };
  },
};
