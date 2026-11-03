# Security Policy

## Supported versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

Only the latest 0.1.x release line is supported. There are no older supported
releases yet.

## Reporting a vulnerability

Do **not** open a public issue for a security vulnerability.

Use GitHub private vulnerability reporting for this repository:

<https://github.com/Yudistir123/stellar-interop-lab/security/advisories/new>

In the private report, please include:

- The affected version or commit
- Steps to reproduce, with a minimal fixture if possible
- The impact you expect, if known

The maintainer will acknowledge the report and keep you updated while a fix
is prepared. Please do not disclose the issue publicly until a fix is
available.

## Scope notes

This tool is designed to run offline: it makes no network calls, verifies no
signatures or cryptographic material, and performs no end-to-end transactions
(see `README.md` and `SPEC.md`). Reports are still welcome for issues such as
unsafe fixture or file handling, crashes on untrusted input, or dependency
problems that affect the published tool.

## Secrets in reports

Never include real credentials, tokens, private keys, or other secrets in a
report, issue, pull request, or fixture. Use the demo values from
`fixtures/` instead. If a secret is ever posted by mistake, rotate it
immediately and mention that it was rotated in the private report.
