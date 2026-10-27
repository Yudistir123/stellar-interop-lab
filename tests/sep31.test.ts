import { describe, it, expect } from "vitest";
import { sep31TransactionStatus } from "../src/checks/sep31.ts";

describe("sep31TransactionStatus", () => {
  it("passes with completed status", () => {
    const r = sep31TransactionStatus.run({
      transactionStatus: {
        id: "tx-1",
        status: "completed",
        amount_in: "100",
        amount_out: "98.5",
        asset: "USDC:GA5...",
      },
    });
    expect(r.status).toBe("pass");
  });

  it("fails with invalid status", () => {
    const r = sep31TransactionStatus.run({
      transactionStatus: {
        id: "tx-1",
        status: "bogus",
        amount_in: "100",
        amount_out: "98.5",
        asset: "USDC",
      },
    });
    expect(r.status).toBe("fail");
    expect(r.message).toContain("Invalid status");
  });

  it("errors with no transactionStatus", () => {
    const r = sep31TransactionStatus.run({});
    expect(r.status).toBe("error");
  });
});
