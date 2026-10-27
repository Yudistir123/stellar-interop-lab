/**
 * SEP-38 Asset Identification Format validation.
 *
 * Grammar verified against:
 * - SEP-38 v2.5.0 "Asset Identification Format": `<scheme>:<identifer>`,
 *   with accepted schemes `stellar` and `iso4217`.
 * - SEP-38 delegates the `stellar` identifier to the SEP-11 Asset format,
 *   which is `Code:IssuerAccountID` for issued assets, `native` (or any
 *   string up to 12 characters without an unescaped colon) for the native
 *   asset, or `LiquidityPoolID:lp` for pool shares.
 * - `iso4217` identifiers are three-character ISO 4217 currency codes.
 *
 * Note: SEP-38 does not define a `stellar:native` form. The native asset
 * identifier is the SEP-11 form, which also accepts any short colon-free
 * string as the native asset.
 */

/** Stellar account IDs (G...) are base32 strkeys of fixed length. */
const STELLAR_ACCOUNT_ID = /^G[A-Z2-7]{55}$/;
/** Liquidity pool IDs are 64 lowercase hex chars per SEP-11. */
const LIQUIDITY_POOL_ID = /^[0-9a-f]{64}$/;
/** Asset codes are 1-12 alphanumeric characters per Stellar's asset rules. */
const ASSET_CODE = /^[a-zA-Z0-9]{1,12}$/;

export type AssetIdentifierError =
  | "empty"
  | "missing_scheme"
  | "unsupported_scheme"
  | "invalid_stellar_identifier"
  | "invalid_iso4217_code";

/**
 * Validates a SEP-38 Asset Identification Format string.
 *
 * Returns null when valid, otherwise the reason the identifier is invalid.
 * Callers decide whether an absent optional field is acceptable.
 */
export function validateAssetIdentifier(value: unknown): AssetIdentifierError | null {
  if (typeof value !== "string" || value.length === 0) {
    return "empty";
  }

  const separator = value.indexOf(":");
  if (separator === -1) {
    return "missing_scheme";
  }

  const scheme = value.slice(0, separator);
  const identifier = value.slice(separator + 1);

  if (scheme === "iso4217") {
    // ISO 4217 codes are exactly three alphabetic characters.
    return /^[A-Za-z]{3}$/.test(identifier) ? null : "invalid_iso4217_code";
  }

  if (scheme !== "stellar") {
    return "unsupported_scheme";
  }

  // SEP-11 Asset format: `native` or any string up to 12 characters not
  // containing an unescaped colon for the native asset, `Code:IssuerAccountID`
  // for issued assets, or `LiquidityPoolID:lp` for pool shares.
  // The short-no-colon branch subsumes the explicit `native` case.
  if (identifier.length > 0 && identifier.length <= 12 && !identifier.includes(":")) {
    return null;
  }
  if (identifier.endsWith(":lp")) {
    const poolId = identifier.slice(0, -":lp".length);
    return LIQUIDITY_POOL_ID.test(poolId) ? null : "invalid_stellar_identifier";
  }

  const colon = identifier.indexOf(":");
  if (colon === -1) {
    return "invalid_stellar_identifier";
  }
  const code = identifier.slice(0, colon);
  const issuer = identifier.slice(colon + 1);
  if (!ASSET_CODE.test(code) || !STELLAR_ACCOUNT_ID.test(issuer)) {
    return "invalid_stellar_identifier";
  }
  return null;
}
