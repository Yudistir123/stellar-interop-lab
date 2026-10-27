import { describe, it, expect } from "vitest";
import { sep1TomlParseability } from "../src/checks/sep1.ts";
import type { CheckContext } from "../src/types/index.ts";

const valid: CheckContext = {
  toml: `ACCOUNTS=["GD..."]
TRANSFER_SERVER="https://x"
TRANSFER_SERVER_SEP0024="https://x"
WEB_AUTH_ENDPOINT="https://x"
SIGNING_KEY="GB...X"
NETWORK_PASSPHRASE="Public"
KYC_SERVER="https://x"
DIRECT_PAYMENT_SERVER="https://x"
QUOTE_SERVER="https://x"`,
};

describe("sep1TomlParseability", () => {
  it("passes with all required fields", () => {
    const r = sep1TomlParseability.run(valid);
    expect(r.status).toBe("pass");
    expect(r.message).toContain("9");
  });

  it("fails with missing fields", () => {
    const r = sep1TomlParseability.run({ toml: "ACCOUNTS=[]" });
    expect(r.status).toBe("fail");
    expect(r.message).toContain("Missing");
  });

  it("errors with no toml", () => {
    const r = sep1TomlParseability.run({});
    expect(r.status).toBe("error");
  });
});
