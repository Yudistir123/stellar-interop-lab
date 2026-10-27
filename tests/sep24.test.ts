import { describe, it, expect } from "vitest";
import { sep24DepositWithdrawInfo } from "../src/checks/sep24.ts";

describe("sep24DepositWithdrawInfo", () => {
  it("passes with valid info", () => {
    const r = sep24DepositWithdrawInfo.run({
      depositInfo: { how: "instructions", id: "dep-1" },
    });
    expect(r.status).toBe("pass");
  });

  it("fails with missing fields", () => {
    const r = sep24DepositWithdrawInfo.run({ depositInfo: { how: "instructions" } });
    expect(r.status).toBe("fail");
  });

  it("errors with no depositInfo", () => {
    const r = sep24DepositWithdrawInfo.run({});
    expect(r.status).toBe("error");
  });
});
