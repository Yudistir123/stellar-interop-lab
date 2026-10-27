/**
 * Stellar Interop Lab
 *
 * Deterministic interoperability conformance fixtures and test runner for
 * Stellar Ecosystem Proposals (SEP-1, SEP-10, SEP-24, SEP-31, SEP-38).
 *
 * No network. No randomness. Fully reproducible.
 */

export { ALL_CHECKS, runChecks } from "./runner/index.ts";
export type {
  CheckCategory,
  CheckContext,
  CheckDefinition,
  CheckResult,
  CheckResultStatus,
  RunOptions,
  RunReport,
} from "./types/index.ts";
