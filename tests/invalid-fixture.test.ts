import { describe, it, expect } from "vitest";
import { runChecks } from "../src/runner/index.ts";
import { readFileSync } from "node:fs";
import type { CheckContext } from "../src/types/index.ts";

const invalidToml = readFileSync("fixtures/invalid-anchor.toml", "utf-8");

describe("integration: invalid anchor", () => {
  it("SEP-1 check fails on missing required fields", async () => {
    const ctx: CheckContext = { toml: invalidToml };
    const report = await runChecks(ctx, { filter: ["sep1.toml_parseability"] });
    expect(report.results).toHaveLength(1);
    const r = report.results[0];
    // validation failure, not execution error
    expect(r?.status).toBe("fail");
    expect(r?.message).toContain("Missing required fields");
    expect(r?.message).toContain("TRANSFER_SERVER_SEP0024");
  });

  it("empty context yields error status, not fail", async () => {
    const report = await runChecks({}, { filter: ["sep1.toml_parseability"] });
    const r = report.results[0];
    // execution error (missing input), distinct from validation failure
    expect(r?.status).toBe("error");
    expect(r?.message).toContain("No TOML content provided");
  });

  it("report aggregate distinguishes fail from error", async () => {
    const report = await runChecks(
      { toml: invalidToml },
      { filter: ["sep1.toml_parseability", "sep10.auth_response"] },
    );
    // sep1 = fail (validation), sep10 = error (missing input)
    expect(report.failed).toBe(1);
    expect(report.errors).toBe(1);
    expect(report.passed).toBe(0);
  });
});
