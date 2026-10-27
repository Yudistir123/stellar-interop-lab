#!/usr/bin/env node
/**
 * CLI: interop-lab
 *
 * Usage:
 *   interop-lab --fixture fixtures/valid-anchor.toml
 *   interop-lab --filter sep1.toml_parseability
 *   interop-lab --fail-fast
 */

import { readFileSync } from "node:fs";
import { ALL_CHECKS, runChecks } from "./runner/index.ts";

function parseArgs(): {
  fixture?: string;
  filter: string[];
  failFast: boolean;
  json: boolean;
} {
  const args = process.argv.slice(2);
  const out: ReturnType<typeof parseArgs> = {
    filter: [],
    failFast: false,
    json: false,
  };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--fixture" && i + 1 < args.length) {
      out.fixture = args[i + 1] ?? "";
      i++;
    } else if (a === "--filter" && i + 1 < args.length) {
      out.filter = (args[i + 1] ?? "").split(",");
      i++;
    } else if (a === "--fail-fast") {
      out.failFast = true;
    } else if (a === "--json") {
      out.json = true;
    } else if (a === "--list") {
      for (const c of ALL_CHECKS) {
        process.stdout.write(`${c.id}\t${c.category}\t${c.description}\n`);
      }
      process.exit(0);
    }
  }
  return out;
}

async function main(): Promise<void> {
  const opts = parseArgs();
  let toml = "";
  if (opts.fixture !== undefined) {
    toml = readFileSync(opts.fixture, "utf-8");
  }
  const report = await runChecks(
    {
      toml,
      authResponse: {
        token: "fake-jwt-token",
        account: "GDMPBI2H6VYVUEZ62ZV7N6QB5N6KFCWW7FZOPCQ5B4XXGFUZHH7MFPNK",
        memo: "1234567890",
        memo_type: "id",
      },
      depositInfo: {
        how: "instructions",
        id: "deposit-123",
      },
      transactionStatus: {
        id: "tx-456",
        status: "completed",
        amount_in: "100.00",
        amount_out: "98.50",
        asset: "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
      },
      metadata: {
        quote: {
          id: "quote-789",
          expires_at: new Date(Date.now() + 3600_000).toISOString(),
          price: "1.0025",
          sell_asset: "native",
          buy_asset: "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
        },
      },
    },
    opts,
  );

  if (opts.json) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    process.stdout.write(
      `interop-lab report\n  passed=${report.passed} failed=${report.failed} skipped=${report.skipped} errors=${report.errors} duration=${report.durationMs.toFixed(1)}ms\n`,
    );
    for (const r of report.results) {
      const icon =
        r.status === "pass"
          ? "✓"
          : r.status === "fail"
            ? "✗"
            : r.status === "error"
              ? "!"
              : "~";
      process.stdout.write(`  ${icon} ${r.id}: ${r.message}\n`);
    }
  }
  process.exitCode = report.failed > 0 || report.errors > 0 ? 1 : 0;
}

main().catch((err) => {
  process.stderr.write(`fatal: ${err instanceof Error ? err.message : err}\n`);
  process.exit(1);
});
