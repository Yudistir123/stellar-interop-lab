/**
 * Core types for the Stellar Interop Lab test runner.
 */

export type CheckCategory = "sep1" | "sep10" | "sep24" | "sep31" | "sep38";

export interface CheckContext {
  /** Raw stellar.toml content (SEP-1) */
  toml?: string;
  /** Parsed TOML fields relevant to interop */
  tomlFields?: Record<string, unknown>;
  /** SEP-10 auth response body */
  authResponse?: unknown;
  /** SEP-24 deposit/withdraw info response */
  depositInfo?: unknown;
  /** SEP-24 transaction status response */
  transactionStatus?: unknown;
  /** Arbitrary fixture metadata */
  metadata?: Record<string, unknown>;
}

export type CheckResultStatus = "pass" | "fail" | "skip" | "error";

export interface CheckResult {
  id: string;
  category: CheckCategory;
  status: CheckResultStatus;
  message: string;
  details?: Record<string, unknown>;
  durationMs: number;
}

export interface CheckDefinition {
  id: string;
  category: CheckCategory;
  description: string;
  run(ctx: CheckContext): CheckResult;
}

export interface RunOptions {
  /** Only run these check IDs */
  filter?: string[];
  /** Stop on first failure */
  failFast?: boolean;
}

export interface RunReport {
  results: CheckResult[];
  passed: number;
  failed: number;
  skipped: number;
  errors: number;
  durationMs: number;
}
