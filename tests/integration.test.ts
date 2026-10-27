import { describe, it, expect } from "vitest";
import { runChecks } from "../src/runner/index.ts";
import { readFileSync } from "node:fs";

describe("integration: valid anchor", () => {
  it("all checks pass against valid-anchor.toml", async () => {
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
    expect(report.passed).toBe(5);
    expect(report.failed).toBe(0);
    expect(report.errors).toBe(0);
    expect(report.results).toHaveLength(5);
  });

  it("SEP-31 transaction without asset field is not rejected", async () => {
    // SEP-31 v3.1.0 transaction object has no `asset` field; assets are
    // expressed via amount_in_asset / amount_out_asset (SEP-38 format).
    const report = await runChecks(
      {
        transactionStatus: {
          id: "tx-1",
          status: "completed",
          amount_in: "100",
          amount_out: "98.5",
        },
      },
      { filter: ["sep31.transaction_status"] },
    );
    const r = report.results[0];
    expect(r?.status).toBe("pass");
    expect(report.failed).toBe(0);
    expect(report.errors).toBe(0);
  });

  it("SEP-31 transaction with only id and status passes", async () => {
    const report = await runChecks(
      { transactionStatus: { id: "tx-1", status: "pending_stellar" } },
      { filter: ["sep31.transaction_status"] },
    );
    expect(report.results[0]?.status).toBe("pass");
  });

  it("SEP-31 transaction with valid SEP-38 asset identifiers passes", async () => {
    const report = await runChecks(
      {
        transactionStatus: {
          id: "tx-1",
          status: "completed",
          amount_in: "100",
          amount_in_asset:
            "stellar:USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
          amount_out: "500",
          amount_out_asset: "iso4217:BRL",
        },
      },
      { filter: ["sep31.transaction_status"] },
    );
    expect(report.results[0]?.status).toBe("pass");
  });

  it("SEP-31 transaction with invalid asset identifier fails", async () => {
    const report = await runChecks(
      {
        transactionStatus: {
          id: "tx-1",
          status: "completed",
          amount_in_asset:
            "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
        },
      },
      { filter: ["sep31.transaction_status"] },
    );
    expect(report.results[0]?.status).toBe("fail");
    expect(report.results[0]?.message).toContain("amount_in_asset");
  });
});
