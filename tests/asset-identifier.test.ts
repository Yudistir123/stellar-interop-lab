import { describe, it, expect } from "vitest";
import { validateAssetIdentifier } from "../src/checks/asset-identifier.ts";

const USDC_ISSUER = "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN";

describe("validateAssetIdentifier (SEP-38 format)", () => {
  describe("valid identifiers", () => {
    it("accepts stellar issued asset", () => {
      expect(validateAssetIdentifier(`stellar:USDC:${USDC_ISSUER}`)).toBeNull();
    });

    it("accepts stellar native asset per SEP-11 form", () => {
      expect(validateAssetIdentifier("stellar:native")).toBeNull();
    });

    it("accepts stellar liquidity pool share", () => {
      const poolId = "a".repeat(64);
      expect(validateAssetIdentifier(`stellar:${poolId}:lp`)).toBeNull();
    });

    it("accepts iso4217 fiat currency", () => {
      expect(validateAssetIdentifier("iso4217:USD")).toBeNull();
    });

    it("accepts 12-character asset code", () => {
      expect(validateAssetIdentifier(`stellar:ABCDEFGHIJKL:${USDC_ISSUER}`)).toBeNull();
    });

    it("accepts 1-character asset code", () => {
      expect(validateAssetIdentifier(`stellar:X:${USDC_ISSUER}`)).toBeNull();
    });

    it("accepts SEP-11 native asset as short colon-free string", () => {
      expect(validateAssetIdentifier("stellar:native")).toBeNull();
      expect(validateAssetIdentifier("stellar:foo")).toBeNull();
      expect(validateAssetIdentifier("stellar:X")).toBeNull();
      expect(validateAssetIdentifier("stellar:abcdefghijkl")).toBeNull();
    });
  });

  describe("invalid identifiers", () => {
    it("rejects empty string", () => {
      expect(validateAssetIdentifier("")).toBe("empty");
    });

    it("rejects non-string", () => {
      expect(validateAssetIdentifier(42)).toBe("empty");
      expect(validateAssetIdentifier(undefined)).toBe("empty");
    });

    it("rejects identifier without scheme separator", () => {
      expect(validateAssetIdentifier("USDC")).toBe("missing_scheme");
    });

    it("rejects unsupported scheme", () => {
      expect(validateAssetIdentifier("crypto:btc")).toBe("unsupported_scheme");
    });

    it("rejects classic Stellar CODE:ISSUER without scheme", () => {
      // SEP-38 requires the scheme prefix; `CODE:ISSUER` alone is not a
      // SEP-38 identifier.
      expect(validateAssetIdentifier(`USDC:${USDC_ISSUER}`)).toBe("unsupported_scheme");
    });

    it("rejects iso4217 code with wrong length", () => {
      expect(validateAssetIdentifier("iso4217:US")).toBe("invalid_iso4217_code");
      expect(validateAssetIdentifier("iso4217:USDD")).toBe("invalid_iso4217_code");
    });

    it("rejects iso4217 non-alphabetic code", () => {
      expect(validateAssetIdentifier("iso4217:U5D")).toBe("invalid_iso4217_code");
    });

    it("accepts stellar identifier without issuer as native asset per SEP-11", () => {
      // SEP-11 native form: any string up to 12 chars without an unescaped colon.
      expect(validateAssetIdentifier("stellar:USDC")).toBeNull();
    });

    it("rejects stellar identifier with too-short issuer", () => {
      expect(validateAssetIdentifier("stellar:USDC:GA5")).toBe(
        "invalid_stellar_identifier",
      );
    });

    it("rejects stellar identifier with 13-character asset code", () => {
      expect(validateAssetIdentifier(`stellar:ABCDEFGHIJKLM:${USDC_ISSUER}`)).toBe(
        "invalid_stellar_identifier",
      );
    });

    it("rejects stellar identifier with non-alphanumeric asset code", () => {
      expect(validateAssetIdentifier(`stellar:USD-C:${USDC_ISSUER}`)).toBe(
        "invalid_stellar_identifier",
      );
    });

    it("rejects liquidity pool id with wrong length", () => {
      expect(validateAssetIdentifier(`stellar:${"a".repeat(63)}:lp`)).toBe(
        "invalid_stellar_identifier",
      );
    });

    it("rejects liquidity pool id with uppercase hex", () => {
      expect(validateAssetIdentifier(`stellar:${"A".repeat(64)}:lp`)).toBe(
        "invalid_stellar_identifier",
      );
    });

    it("rejects stellar identifier with 13-character colon-free value", () => {
      // SEP-11 native form caps at 12 characters; longer values without a
      // colon are not valid native identifiers.
      expect(validateAssetIdentifier("stellar:abcdefghijklm")).toBe(
        "invalid_stellar_identifier",
      );
    });

    it("rejects empty identifier after scheme", () => {
      expect(validateAssetIdentifier("stellar:")).toBe("invalid_stellar_identifier");
    });

    it("rejects identifier with leading whitespace in scheme", () => {
      expect(validateAssetIdentifier(" stellar:USDC")).toBe("unsupported_scheme");
    });
  });
});
