import { runChecks } from "../src/index.ts";
import { readFileSync } from "node:fs";

const toml = readFileSync("fixtures/valid-anchor.toml", "utf-8");

const report = await runChecks({
  toml,
  authResponse: {
    token: "jwt",
    account: "GDMPBI2H6VYVUEZ62ZV7N6QB5N6KFCWW7FZOPCQ5B4XXGFUZHH7MFPNK",
    memo: "1234567890",
    memo_type: "id",
  },
  depositInfo: { how: "instructions", id: "dep-1" },
  transactionStatus: {
    id: "tx-1",
    status: "completed",
    amount_in: "100",
    amount_out: "98.5",
  },
  metadata: {
    quote: {
      id: "q-1",
      expires_at: new Date(Date.now() + 3600_000).toISOString(),
      price: "1.0",
      sell_asset: "native",
      buy_asset: "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
    },
  },
});

for (const r of report.results) {
  const icon = r.status === "pass" ? "✓" : r.status === "fail" ? "✗" : "!";
  console.log(`${icon} ${r.id}: ${r.message}`);
}
console.log(
  `summary: passed=${report.passed} failed=${report.failed} errors=${report.errors} duration=${report.durationMs.toFixed(1)}ms`,
);
process.exitCode = report.failed > 0 || report.errors > 0 ? 1 : 0;
