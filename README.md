# Stellar Interop Lab

[![CI](https://github.com/Yudistir123/stellar-interop-lab/actions/workflows/verify.yml/badge.svg)](https://github.com/Yudistir123/stellar-interop-lab/actions/workflows/verify.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

Deterministic interoperability conformance fixtures and test runner for Stellar
Ecosystem Proposals (SEP-1, SEP-10, SEP-24, SEP-31, SEP-38).

Built for developers building Stellar anchors, wallets, and services who need to
verify their responses conform to the specification without spinning up a live
network, real credentials, or paid services.

## Purpose

The Stellar ecosystem already has strong tooling. This project targets a narrow
gap: deterministic, offline, response-shape conformance checking for the
transport-layer SEPs. Existing tools either test a live anchor end-to-end or
inspect binary artifacts; this runner validates protocol response shapes against
static fixtures.

See [SPEC.md](SPEC.md) for the full v0.1 specification, including how this
project differs from live anchor tests, anchor server SDKs, and Soroban
artifact inspectors.

## Quick start

```sh
git clone https://github.com/Yudistir123/stellar-interop-lab.git
cd stellar-interop-lab
npm ci
npm run build
node dist/cli.js --fixture fixtures/valid-anchor.toml
```

Expected output (durations vary):

```text
interop-lab report
  passed=5 failed=0 skipped=0 errors=0 duration=0.8ms
  ✓ sep1.toml_parseability: All 9 required fields present
  ✓ sep10.auth_response: All required SEP-10 auth fields present
  ✓ sep24.deposit_withdraw_info: SEP-24 info response shape valid
  ✓ sep31.transaction_status: SEP-31 transaction status valid
  ✓ sep38.quote: SEP-38 quote response shape valid
```

A failing run exits non-zero and names what is missing:

```sh
node dist/cli.js --fixture fixtures/invalid-anchor.toml
```

```text
interop-lab report
  passed=4 failed=1 skipped=0 errors=0 duration=0.8ms
  ✗ sep1.toml_parseability: Missing required fields: TRANSFER_SERVER_SEP0024, WEB_AUTH_ENDPOINT, SIGNING_KEY, NETWORK_PASSPHRASE, KYC_SERVER, DIRECT_PAYMENT_SERVER, QUOTE_SERVER
  ✓ sep10.auth_response: All required SEP-10 auth fields present
  ✓ sep24.deposit_withdraw_info: SEP-24 info response shape valid
  ✓ sep31.transaction_status: SEP-31 transaction status valid
  ✓ sep38.quote: SEP-38 quote response shape valid
```

## Checks in v0.1

| Check ID                      | SEP    | What it validates                                                    |
| ----------------------------- | ------ | -------------------------------------------------------------------- |
| `sep1.toml_parseability`      | SEP-1  | stellar.toml is parseable and contains all 9 required interop fields |
| `sep10.auth_response`         | SEP-10 | Auth response includes required fields                               |
| `sep24.deposit_withdraw_info` | SEP-24 | Deposit/withdraw info response shape                                 |
| `sep31.transaction_status`    | SEP-31 | Transaction status shape and status value validation                 |
| `sep38.quote`                 | SEP-38 | Quote response shape                                                 |

List them from the CLI:

```sh
node dist/cli.js --list
```

## Scope

In scope (v0.1):

- SEP-1 stellar.toml required field presence
- SEP-10 auth response shape
- SEP-24 deposit/withdraw info response shape
- SEP-31 transaction status shape and status value validation
- SEP-38 quote response shape

Explicit non-goals:

- Live network calls, real anchors, or real credentials
- Signature verification or cryptographic validation
- End-to-end transaction flows
- Soroban contract or WASM inspection

## Usage

Run a subset:

```sh
node dist/cli.js --filter sep1.toml_parseability,sep10.auth_response
```

JSON output:

```sh
node dist/cli.js --fixture fixtures/valid-anchor.toml --json
```

Stop on the first failure:

```sh
node dist/cli.js --fail-fast
```

### What the CLI checks today

In v0.1, `--fixture` supplies the stellar.toml used by the SEP-1 check. The
other CLI checks run against a built-in demo context in `src/cli.ts`, so the
CLI is a demo runner, not yet a general-purpose response importer.

To check your own responses, use the library API instead of the CLI. Pass a
full `CheckContext` to `runChecks()` — see `examples/run-basic.ts`, or run it
directly:

```sh
npm run example
```

## Prerequisites

- Node.js >= 22
- npm

## Development

```sh
npm run verify
```

Runs: clean, format check, lint, typecheck, tests, build.

Individual steps:

```sh
npm run format       # write formatting
npm run format:check # verify formatting
npm run lint         # eslint, zero warnings
npm run typecheck    # tsc strict, no emit
npm run test         # vitest
npm run test:watch   # vitest watch mode
```

## Testing Principles

- No network calls in tests
- No wall-clock dependence (except duration measurement)
- No randomness
- Deterministic fixtures in `fixtures/`
- Unit tests per check; one integration test covering the full runner

## Architecture

```text
src/
  types/    shared types (CheckContext, CheckResult, RunReport)
  checks/   one file per SEP family, each exporting a CheckDefinition
  runner/   orchestrates checks, aggregates RunReport
  cli.ts    command-line interface
tests/      unit tests per check + integration test
fixtures/   deterministic TOML and JSON inputs
```

## Extending

Add a new check by creating a file under `src/checks/`, exporting a
`CheckDefinition`, and appending it to `ALL_CHECKS` in `src/runner/index.ts`.
The CLI picks it up automatically via `--list` and `--filter`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). In short: fork and branch, run
`npm run verify`, and open a PR with a clear description. No CLA or DCO is
required. Issues and ideas are welcome on the
[issues page](https://github.com/Yudistir123/stellar-interop-lab/issues).

## License

Apache-2.0. See `LICENSE`.
