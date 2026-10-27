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

  it("errors with no transactionStatus", () => {
    const r = sep31TransactionStatus.run({});
    expect(r.status).toBe("error");
  });
});
