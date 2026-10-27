import { describe, it, expect } from "vitest";
import { sep38Quote } from "../src/checks/sep38.ts";

describe("sep38Quote", () => {
  it("passes with valid quote", () => {
    const r = sep38Quote.run({
      metadata: {
        quote: {
          id: "q-1",
          expires_at: new Date(Date.now() + 3600_000).toISOString(),
          price: "1.0",
          sell_asset: "native",
          buy_asset: "USDC:GA5...",
        },
      },
    });
    expect(r.status).toBe("pass");
  });

  it("fails with missing fields", () => {
    const r = sep38Quote.run({ metadata: { quote: { id: "q-1" } } });
    expect(r.status).toBe("fail");
  });

  it("errors with no quote", () => {
    const r = sep38Quote.run({});
    expect(r.status).toBe("error");
  });
});
