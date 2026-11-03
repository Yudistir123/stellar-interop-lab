---
name: Bug report
about: Report a wrong pass, wrong fail, crash, or other incorrect behaviour
title: "[bug] "
labels: ["bug"]
assignees: []
---

## Describe the bug

A clear description of what went wrong.

## Check ID

Which check is affected, if any? For example: `sep1.toml_parseability`.

## Steps to reproduce

1.
2.
3.

Command run, for example:

```sh
node dist/cli.js --fixture fixtures/valid-anchor.toml
```

## Expected behaviour

What should have happened?

## Actual output

Paste the relevant output. If the output is long, paste only the failing
check and the summary line.

```text

```

## Input

If the bug depends on a specific input, paste a minimal fixture or response
that reproduces it. Use demo values only.

```toml

```

```json

```

## Environment

- Node.js version:
- npm version:
- OS:

## Additional context

Anything else that helps reproduce or fix the bug.

> Do not paste real credentials, tokens, private keys, or other secrets in
> issues. Use the demo values from `fixtures/` instead.
