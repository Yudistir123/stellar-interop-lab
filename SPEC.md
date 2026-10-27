# Stellar Interop Lab — Project Specification (v0.1)

## Purpose

Deterministic interoperability conformance fixtures and a test runner for
Stellar Ecosystem Proposals (SEP-1, SEP-10, SEP-24, SEP-31, SEP-38).

## Target users

Stellar anchor, wallet, and service developers who need to verify that their
protocol responses conform to the specification. Also useful for CI pipelines
that need a fast, offline conformance gate.

## Core problem

The Stellar ecosystem has strong tooling, but a specific gap remains:

- `stellar/stellar-anchor-tests` tests a **live** anchor end-to-end against a
  running server. Requires credentials, network, and a full server stack.
- `stellar/anchor-platform` is a **server implementation**, not a conformance
  checker.
- `stellar/stellar-demo-wallet` is a **manual testing UI** for humans.
- `UprarLabs/stellar-upgrade-radar` targets **protocol upgrade compatibility**,
  not SEP response shapes.
- `bomniop/sorob-inspect` inspects **Soroban WASM artifacts**, a different layer.

Nothing in the ecosystem provides a deterministic, offline, response-shape
conformance checker for the transport-layer SEPs that runs without a network,
without credentials, and in milliseconds.

## Proposed solution

A TypeScript library and CLI that:

1. Accepts a `CheckContext` of protocol response fixtures (TOML, auth response,
   deposit info, transaction status, quote).
2. Runs registered checks that validate required fields and enum values.
3. Produces a structured `RunReport` with per-check results and aggregate counts.

## Scope (v0.1)

In scope:

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
- Paid services or AI APIs

## Differentiation

| Tool                  | What it does             | Gap this project fills             |
| --------------------- | ------------------------ | ---------------------------------- |
| stellar-anchor-tests  | Live E2E anchor testing  | Offline response-shape conformance |
| anchor-platform       | Anchor server SDK        | No conformance checking            |
| stellar-demo-wallet   | Manual UI testing        | Automated, CI-friendly             |
| stellar-upgrade-radar | Protocol upgrade compat  | SEP response shapes                |
| sorob-inspect         | WASM artifact inspection | Different layer entirely           |

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

Module boundaries:

- `types/` has no dependencies. Pure type declarations.
- `checks/` depends only on `types/`. Each check is a pure function of its
  `CheckContext`. No network, no I/O.
- `runner/` depends on `types/` and `checks/`. Orchestration only.
- `cli.ts` depends on `runner/`. The only module that performs file I/O.

## Testing and reproducibility principles

- No network calls in tests
- No wall-clock dependence (except duration measurement)
- No randomness
- Deterministic fixtures in `fixtures/`
- Unit tests per check; one integration test covering the full runner
- Full verification chain: format check, lint, typecheck, tests, build

## Future extension points

- Additional SEPs (SEP-12 KYC, SEP-45, SEP-53)
- Async checks that call a local mock server
- Configurable required-field sets per check
- Machine-readable output formats (JUnit XML, TAP)

## License

Apache-2.0.
