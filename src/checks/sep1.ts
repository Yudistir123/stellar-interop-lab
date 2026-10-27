/**
 * Check: SEP-1 TOML parseability and required interop fields.
 */

import type { CheckContext, CheckResult, CheckDefinition } from "../types/index.ts";

const REQUIRED_FIELDS = [
  "ACCOUNTS",
  "TRANSFER_SERVER",
  "TRANSFER_SERVER_SEP0024",
  "WEB_AUTH_ENDPOINT",
  "SIGNING_KEY",
  "NETWORK_PASSPHRASE",
  "KYC_SERVER",
  "DIRECT_PAYMENT_SERVER",
  "QUOTE_SERVER",
];

function parseToml(toml: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of toml.split(/\r?\n/)) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*"?([^"\r\n]*)"?/);
    const key = m?.[1];
    const val = m?.[2];
    if (key !== undefined && val !== undefined) out[key] = val.trim();
  }
  return out;
}

export const sep1TomlParseability: CheckDefinition = {
  id: "sep1.toml_parseability",
  category: "sep1",
  description: "TOML is parseable and contains required interop fields",
  run(ctx: CheckContext): CheckResult {
    const t0 = performance.now();
    if (!ctx.toml) {
      return {
        id: sep1TomlParseability.id,
        category: "sep1",
        status: "error",
        message: "No TOML content provided in context",
        durationMs: performance.now() - t0,
      };
    }
    const fields = parseToml(ctx.toml);
    const missing = REQUIRED_FIELDS.filter((k) => !fields[k]);
    if (missing.length > 0) {
      return {
        id: sep1TomlParseability.id,
        category: "sep1",
        status: "fail",
        message: `Missing required fields: ${missing.join(", ")}`,
        details: { found: Object.keys(fields), missing },
        durationMs: performance.now() - t0,
      };
    }
    return {
      id: sep1TomlParseability.id,
      category: "sep1",
      status: "pass",
      message: `All ${REQUIRED_FIELDS.length} required fields present`,
      details: { fields: Object.keys(fields) },
      durationMs: performance.now() - t0,
    };
  },
};
