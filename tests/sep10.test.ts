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

  it("fails when token is an empty string", () => {
    const r = sep10AuthResponse.run({ authResponse: { token: "" } });
    expect(r.status).toBe("fail");
    expect(r.message).toBe("Field 'token' must be a non-empty string");
  });

  it("fails when token is whitespace only", () => {
    const cases = [" ", "   ", "\t", "\n", "\t\n"];
    for (const value of cases) {
      const r = sep10AuthResponse.run({ authResponse: { token: value } });
      expect(r.status).toBe("fail");
      expect(r.message).toBe("Field 'token' must be a non-empty string");
    }
  });

  it("passes when token has surrounding whitespace", () => {
    const r = sep10AuthResponse.run({ authResponse: { token: "  eyJhbG...t0z0  " } });
    expect(r.status).toBe("pass");
  });

  it("fails when token is not a string", () => {
    const cases = [null, 42, { a: 1 }, ["x"], true];
    for (const value of cases) {
      const r = sep10AuthResponse.run({ authResponse: { token: value } });
      expect(r.status).toBe("fail");
      expect(r.message).toBe("Field 'token' must be a non-empty string");
    }
  });

  it("errors with no authResponse", () => {
    const r = sep10AuthResponse.run({});
    expect(r.status).toBe("error");
  });
});
