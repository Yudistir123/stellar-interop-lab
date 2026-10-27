/**
 * Check: SEP-10 authentication response contains required fields.
 */

import type { CheckContext, CheckResult, CheckDefinition } from "../types/index.ts";

const REQUIRED_AUTH_FIELDS = ["token", "account", "memo", "memo_type"];

export const sep10AuthResponse: CheckDefinition = {
  id: "sep10.auth_response",
  category: "sep10",
  description: "SEP-10 auth response includes required fields",
  run(ctx: CheckContext): CheckResult {
    const t0 = performance.now();
    const body = ctx.authResponse as Record<string, unknown> | undefined;
    if (!body) {
      return {
        id: sep10AuthResponse.id,
        category: "sep10",
        status: "error",
        message: "No authResponse provided in context",
        durationMs: performance.now() - t0,
      };
    }
    const missing = REQUIRED_AUTH_FIELDS.filter((k) => !(k in body));
    if (missing.length > 0) {
      return {
        id: sep10AuthResponse.id,
        category: "sep10",
        status: "fail",
        message: `Missing required auth fields: ${missing.join(", ")}`,
        details: { present: Object.keys(body), missing },
        durationMs: performance.now() - t0,
      };
    }
    return {
      id: sep10AuthResponse.id,
      category: "sep10",
      status: "pass",
      message: "All required SEP-10 auth fields present",
      details: { fields: Object.keys(body) },
      durationMs: performance.now() - t0,
    };
  },
};
