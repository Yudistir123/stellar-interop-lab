import { describe, it, expect } from "vitest";
import { sep31TransactionStatus } from "../src/checks/sep31.ts";

describe("sep31TransactionStatus", () => {
  it("passes with completed status and no asset field", () => {
    const r = sep31TransactionStatus.run({
      transactionStatus: {
        id: "tx-1",
        status: "completed",
        amount_in: "100",
        amount_out: "98.5",
      },
    });
    expect(r.status).toBe("pass");
  });

  it("passes with only required fields id and status", () => {
    const r = sep31TransactionStatus.run({
      transactionStatus: { id: "tx-1", status: "pending_sender" },
    });
    expect(r.status).toBe("pass");
  });

  it("accepts every official SEP-31 v3.1.0 status value", () => {
    const statuses = [
      "pending_sender",
      "pending_stellar",
      "pending_customer_info_update",
      "pending_transaction_info_update",
      "pending_receiver",
      "pending_external",
      "completed",
      "refunded",
      "expired",
      "error",
    ];
    for (const status of statuses) {
      const r = sep31TransactionStatus.run({
        transactionStatus: { id: "tx-1", status },
      });
      expect(r.status).toBe("pass");
    }
  });

  it("fails with invalid status", () => {
    const r = sep31TransactionStatus.run({
      transactionStatus: {
        id: "tx-1",
        status: "bogus",
        amount_in: "100",
        amount_out: "98.5",
      },
    });
    expect(r.status).toBe("fail");
    expect(r.message).toContain("Invalid status");
  });

  it("rejects removed non-spec status value 'failed'", () => {
    const r = sep31TransactionStatus.run({
      transactionStatus: { id: "tx-1", status: "failed" },
    });
    expect(r.status).toBe("fail");
  });

  it("fails when required id is missing", () => {
    const r = sep31TransactionStatus.run({
      transactionStatus: { status: "completed" },
    });
    expect(r.status).toBe("fail");
    expect(r.message).toContain("id");
  });

  it("passes with valid SEP-38 asset identifiers", () => {
    const r = sep31TransactionStatus.run({
      transactionStatus: {
        id: "tx-1",
        status: "completed",
        amount_in: "100",
        amount_in_asset:
          "stellar:USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
        amount_out: "500",
        amount_out_asset: "iso4217:BRL",
      },
    });
    expect(r.status).toBe("pass");
  });

  it("passes when optional asset fields are absent", () => {
    const r = sep31TransactionStatus.run({
      transactionStatus: { id: "tx-1", status: "completed" },
    });
    expect(r.status).toBe("pass");
  });

  it("fails on classic CODE:ISSUER without scheme prefix", () => {
    const r = sep31TransactionStatus.run({
      transactionStatus: {
        id: "tx-1",
        status: "completed",
        amount_in_asset:
          "USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
      },
    });
    expect(r.status).toBe("fail");
    expect(r.message).toContain("amount_in_asset");
  });

  it("fails on unsupported scheme", () => {
    const r = sep31TransactionStatus.run({
      transactionStatus: {
        id: "tx-1",
        status: "completed",
        amount_out_asset: "crypto:btc",
      },
    });
    expect(r.status).toBe("fail");
    expect(r.message).toContain("amount_out_asset");
  });

  it("fails on malformed iso4217 code", () => {
    const r = sep31TransactionStatus.run({
      transactionStatus: {
        id: "tx-1",
        status: "completed",
        amount_out_asset: "iso4217:US",
      },
    });
    expect(r.status).toBe("fail");
  });

  it("fails on deprecated amount_fee_asset with invalid format", () => {
    const r = sep31TransactionStatus.run({
      transactionStatus: {
        id: "tx-1",
        status: "completed",
        amount_fee_asset: "stellar:USDC:GA5",
      },
    });
    expect(r.status).toBe("fail");
    expect(r.message).toContain("amount_fee_asset");
  });

  it("reports all invalid asset fields together", () => {
    const r = sep31TransactionStatus.run({
      transactionStatus: {
        id: "tx-1",
        status: "completed",
        amount_in_asset: "bad",
        amount_out_asset: "iso4217:TOOLONG",
      },
    });
    expect(r.status).toBe("fail");
    expect(r.message).toContain("amount_in_asset");
    expect(r.message).toContain("amount_out_asset");
  });

  it("errors with no transactionStatus", () => {
    const r = sep31TransactionStatus.run({});
    expect(r.status).toBe("error");
  });
});
