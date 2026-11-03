# Contributing to Stellar Interop Lab

Thank you for contributing to Stellar Interop Lab. This project is a
deterministic, offline conformance runner for Stellar Ecosystem Proposal
(SEP) response shapes. Contributions are welcome in code, tests, fixtures,
and documentation.

This project uses Apache-2.0. See `LICENSE`. No Contributor License
Agreement (CLA) or Developer Certificate of Origin (DCO) is required.

Please also read `CODE_OF_CONDUCT.md` and `SECURITY.md` before contributing.
Security vulnerabilities must be reported privately, as described in
`SECURITY.md`, not in a public issue.

## Before you start

- Read `README.md` for the purpose, scope, and non-goals of the project.
- Read `SPEC.md` for the architecture and module boundaries.
- You need Node.js >= 22 and npm.
- Check the open issues first. If you want to work on an issue, comment on
  it so work is not duplicated. For a new SEP check, discuss the scope
  first, especially if the check touches a project non-goal (for example,
  cryptographic verification) — scope decisions must be agreed with the
  maintainer before implementation, not decided silently in code.

## Contribution workflow

1. Fork the repository and create a focused branch, for example:
   - `feat/sep-12-customer-status`
   - `fix/sep-10-empty-token`
   - `docs/readme-quick-start`
2. Set up locally:

   ```sh
   git clone https://github.com/Yudistir123/stellar-interop-lab.git
   cd stellar-interop-lab
   npm ci
   npm run verify
   ```

3. Make one focused change for one issue. Do not bundle unrelated
   refactors, new checks, or formatting changes into the same pull request.
4. Run the full verification chain (see below) and update docs if behaviour
   changes.
5. Open a pull request using `.github/PULL_REQUEST_TEMPLATE.md`, with a
   clear description and a link to the issue it closes.

## Adding a new check

A new check follows the existing pattern. Do not invent a new architecture
for a single check.

1. Extend `CheckContext` in `src/types/index.ts` if the check needs a new
   input shape. Keep existing inputs and their behaviour unchanged.
2. Create a file in `src/checks/`, for example `src/checks/sep12.ts`,
   exporting a `CheckDefinition` with an `id`, a `category`, a
   `description`, and a `run(ctx)` function that returns a `CheckResult`.
3. Register the check in `ALL_CHECKS` in `src/runner/index.ts`. The CLI
   then picks it up automatically in `node dist/cli.js --list` and
   `--filter`.
4. Add deterministic fixtures in `fixtures/` and unit tests in `tests/`,
   for example `tests/sep12.test.ts`.
5. Update the checks table in `README.md` and the scope section in
   `SPEC.md`. If the check changes what the CLI does, update the usage
   section in `README.md` as well. Do not claim the CLI imports real
   responses unless that is actually implemented: see the note about the
   CLI demo context in `README.md`.

Module boundaries from `SPEC.md` apply:

- `src/types/` has no dependencies.
- `src/checks/` depends only on `src/types/`. Each check is a pure
  function of its `CheckContext`.
- `src/runner/` depends on `src/types/` and `src/checks/` and only
  orchestrates checks.
- `src/cli.ts` is the only module that performs file I/O.

## Tests and fixtures

Testing principles for this project:

- No network calls in tests.
- No randomness in tests.
- No wall-clock dependence in tests, except duration measurement as
  already allowed.
- Fixtures in `fixtures/` are deterministic. Prefer one valid and one
  invalid fixture per new check, plus unit tests for the edge cases the
  issue lists.
- Unit tests per check, plus the integration test covering the full
  runner, as described in `README.md`.

Run tests with:

```sh
npm run test        # vitest, single run
npm run test:watch  # vitest, watch mode
npm run test -- tests/sep12.test.ts  # one test file
```

Never put real credentials, tokens, private keys, seed phrases, or real
customer personal data in code, fixtures, tests, or docs. Use demo values
from `fixtures/` or published test vectors only. If a secret is ever
posted by mistake, rotate it immediately.

## Code style and verification

This project enforces its style with tools, not by convention alone:

```sh
npm run verify
```

That runs, in order: clean, format check, lint, typecheck, tests, build.

Individual steps:

```sh
npm run format       # write formatting
npm run format:check # verify formatting
npm run lint         # eslint, zero warnings
npm run typecheck    # tsc strict, no emit
npm run test         # vitest
npm run build        # tsc, build output
```

A pull request must pass `npm run verify` with no warnings and no
formatting changes left unapplied. Run Prettier with `npm run format`
before opening a pull request if you are unsure.

## Documentation changes

- Keep `README.md` sample output real: run the CLI and paste its actual
  output. Do not invent output, counts, or timings.
- Keep `SPEC.md` in sync with scope changes. If a change revises a
  non-goal, say so explicitly in the pull request and in the docs.
- Keep changes focused: a code change that changes behaviour needs a
  docs change in the same pull request, and a docs-only change should not
  bundle unrelated code changes.

## Reporting bugs and proposing checks

- Bug reports: use `.github/ISSUE_TEMPLATE/bug_report.md`. Include the
  check ID, steps to reproduce, expected behaviour, actual output, and a
  minimal fixture. Use demo values only.
- New checks: use `.github/ISSUE_TEMPLATE/new-check.md`. Include the SEP,
  what should pass, what should fail, example valid and invalid inputs,
  and a link to the relevant SEP specification.
- Questions about an issue: comment on that issue rather than opening a
  duplicate.

## Pull requests

Follow `.github/PULL_REQUEST_TEMPLATE.md`. In particular:

- Link the issue with `Closes #<number>` when the pull request fixes it.
- Include proof of completion: full `npm run verify` output, the new or
  changed test output, `node dist/cli.js --list` output if a check was
  added, and a short CLI or library demo showing a valid case passing and
  an invalid case failing.
- Keep the pull request in English, like the rest of the repository.
- Expect review. Address review feedback on the same branch and re-run
  `npm run verify` after changes. The maintainer may ask for tests,
  fixtures, or docs to be added before merging.

## Getting help

If you are stuck, comment on the relevant issue with what you tried and
what output you got. For a new idea that does not fit an existing issue,
open a new issue using the appropriate template instead of opening a
pull request without discussion.
