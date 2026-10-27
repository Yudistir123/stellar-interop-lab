import { describe, it, expect } from "vitest";
import { sep10AuthResponse } from "../src/checks/sep10.ts";

describe("sep10AuthResponse", () => {
  it("passes with only token field per SEP-10 response schema", () => {
    const r = sep10AuthResponse.run({ authResponse: { token: "eyJhbG...t0z0" } });
    expect(r.status).toBe("pass");
  });

  it("passes with token and extra non-spec fields", () => {
    const r = sep10AuthResponse.run({
      authResponse: {
        token: "eyJhbG...t0z0",
        account: "GD...",
        memo: "123",
        memo_type: "id",
      },
    });
    expect(r.status).toBe("pass");
  });

  it("fails when token is missing", () => {
    const r = sep10AuthResponse.run({ authResponse: { account: "GD..." } });
    expect(r.status).toBe("fail");
    expect(r.message).toContain("token");
  });

  it("errors with no authResponse", () => {
    const r = sep10AuthResponse.run({});
    expect(r.status).toBe("error");
  });
});
