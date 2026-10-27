# Stellar Interop Lab

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

## Prerequisites

- Node.js >= 22
- npm

## Installation

```
git clone <repo-url>
cd stellar-interop-lab
npm ci
```

## Usage

Run all checks against a fixture TOML:

```
npm run build
node dist/cli.js --fixture fixtures/valid-anchor.toml
```

List available checks:

```
node dist/cli.js --list
```

Run a subset:

```
node dist/cli.js --filter sep1.toml_parseability,sep10.auth_response
```

JSON output:

```
node dist/cli.js --fixture fixtures/valid-anchor.toml --json
```

## Development

```
npm run verify
```

Runs: clean, format check, lint, typecheck, tests, build.

Individual steps:

```
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

```
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

## License

Apache-2.0. See `LICENSE`.
