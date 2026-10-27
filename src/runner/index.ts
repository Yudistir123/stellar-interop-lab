/**
 * Deterministic check runner.
 *
 * Runs registered checks against a CheckContext and produces a structured
 * RunReport. No network, no randomness, no wall-clock dependence beyond
 * per-check duration measurement.
 */

import type {
  CheckContext,
  CheckDefinition,
  CheckResult,
  RunOptions,
  RunReport,
} from "../types/index.ts";
import { sep1TomlParseability } from "../checks/sep1.ts";
import { sep10AuthResponse } from "../checks/sep10.ts";
import { sep24DepositWithdrawInfo } from "../checks/sep24.ts";
import { sep31TransactionStatus } from "../checks/sep31.ts";
import { sep38Quote } from "../checks/sep38.ts";

export const ALL_CHECKS: readonly CheckDefinition[] = [
  sep1TomlParseability,
  sep10AuthResponse,
  sep24DepositWithdrawInfo,
  sep31TransactionStatus,
  sep38Quote,
];

export async function runChecks(
  ctx: CheckContext,
  options: RunOptions = {},
): Promise<RunReport> {
  // ponytail: sync loop; async signature kept for future async checks
  await Promise.resolve();
  const t0 = performance.now();
  const selected =
    options.filter && options.filter.length > 0
      ? ALL_CHECKS.filter((c) => options.filter!.includes(c.id))
      : ALL_CHECKS;

  const results: CheckResult[] = [];
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  let errors = 0;

  for (const check of selected) {
    let result: CheckResult;
    try {
      result = check.run(ctx);
    } catch (err) {
      result = {
        id: check.id,
        category: check.category,
        status: "error",
        message: err instanceof Error ? err.message : String(err),
        durationMs: 0,
      };
    }
    results.push(result);
    switch (result.status) {
      case "pass":
        passed++;
        break;
      case "fail":
        failed++;
        break;
      case "skip":
        skipped++;
        break;
      case "error":
        errors++;
        break;
    }
    if (options.failFast && (failed > 0 || errors > 0)) break;
  }

  return {
    results,
    passed,
    failed,
    skipped,
    errors,
    durationMs: performance.now() - t0,
  };
}
