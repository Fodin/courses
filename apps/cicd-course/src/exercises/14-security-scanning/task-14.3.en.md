# Task 14.3: DAST and Secret Detection

## Goal

Implement an interactive component demonstrating DAST (running application scanning) and Secret Detection (finding secret leaks in code). Show the consequences of found secrets and generate a full security pipeline.

## Requirements

1. Implement a **Secret Detection simulator**: code input field — on real-time change, highlight found secrets (check for patterns: `sk_live_`, `AKIA`, `-----BEGIN RSA PRIVATE KEY-----`, `password=`)
2. Show a **DAST settings panel**: TARGET_URL field, mode toggle (baseline / full-scan) with a warning for full-scan, DAST_PATHS field
3. Display **DAST request visualization**: "Run Scan" button — animate 3-4 sequential requests to different endpoints with results (OK / WARNING / CRITICAL)
4. Implement a **full security pipeline builder**: 5 toggles (SAST / Dependency Scanning / Container Scanning / Secret Detection / DAST) — YAML updates showing include templates for enabled tools
5. Show a **final matrix**: which tool finds what — 5 tool rows × 4 threat type columns

## Checklist

- [ ] Code input field with real-time secret highlighting
- [ ] At least 4 secret detection patterns
- [ ] TARGET_URL field for DAST
- [ ] Baseline / full-scan toggle with warning
- [ ] "Run Scan" button with sequential request animation
- [ ] 5 tool toggles for the pipeline builder
- [ ] YAML updates on tool enable/disable
- [ ] 5×4 matrix with checkmarks for coverage

## How to Verify

1. Enter text `AWS_KEY=AKIAIOSFODNN7EXAMPLE` in the field — highlighting or warning should appear
2. Enter `password=mysecret123` — should also trigger
3. Select full-scan mode — a warning about active attacks should appear
4. Press "Run Scan" — requests with results should appear
5. Enable all 5 tools in the builder — YAML should contain 5 include templates

## Hints

- Check secret patterns via `string.includes()` or simple regular expressions
- For request "animation" use `setTimeout` + `useState` for a result array
- Pipeline builder YAML: each enabled tool adds a line to the `include:` section
- Draw the matrix as a table: `['Code injection', 'Dependency CVE', 'Container CVE', 'Leaked secrets']` × tools
- For secret highlighting in textarea use `<span>` with `background: #ffeb3b` over text (or simply show a warning below the field)
