import { describe, it, expect } from "vitest";
import { sep10AuthResponse } from "../src/checks/sep10.ts";

describe("sep10AuthResponse", () => {
  it("passes with all required fields", () => {
    const r = sep10AuthResponse.run({
      authResponse: {
        token: "jwt",
        account: "GD...",
        memo: "123",
        memo_type: "id",
      },
    });
    expect(r.status).toBe("pass");
  });

  it("fails with missing fields", () => {
    const r = sep10AuthResponse.run({ authResponse: { token: "jwt" } });
    expect(r.status).toBe("fail");
    expect(r.message).toContain("Missing");
  });

  it("errors with no authResponse", () => {
    const r = sep10AuthResponse.run({});
    expect(r.status).toBe("error");
  });
});
