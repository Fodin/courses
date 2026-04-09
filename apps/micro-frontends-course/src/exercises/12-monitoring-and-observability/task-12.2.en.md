# Task 12.2: Monitoring Configuration Builder

## Goal

Create an interactive table for configuring monitoring parameters for each MFE (SLO, alerts, Circuit Breaker) with generated JSON manifest and built-in validation.

## Requirements

1. Table with three MFE rows (Catalog MFE, Cart MFE, Profile MFE) and editable columns:
   - MFE Name (read-only)
   - Team Owner (text field)
   - SLO % (numeric field, step 0.01, allowed range 99–99.999)
   - Error Budget (calculated automatically: 100 − SLO, shows % and minutes/month)
   - Alert Channel (select: Slack / PagerDuty / Email)
   - Health-Check URL (text field)
   - CB Threshold (numeric field, errors before Open)
   - CB Open (numeric field, seconds in Open before Half-Open)
   - CB Reset (numeric field, seconds in Half-Open before reset)
2. Validation (highlights fields with red border):
   - Team Owner not empty
   - SLO >= 99%
   - Health-Check URL starts with `http`
   - CB Threshold > 0
3. "Generate Manifest" button — active only when all validation passes
4. Generated JSON shown in block with header `monitoring-manifest.json` and "Copy" button
5. JSON includes: version, generatedAt, MFE array with ownership, slo (availability + errorBudgetPercent + errorBudgetMinPerMonth), alerting, healthCheck, circuitBreaker
6. Dark style (#0f172a background), all styles inline

## Checklist

- [ ] Table with 9 columns displays 3 MFEs
- [ ] Error Budget recalculates automatically on SLO change
- [ ] Shows as percentage and as minutes per month
- [ ] Alert Channel — dropdown with three options
- [ ] Validation highlights invalid fields with red border
- [ ] Validation error text displayed below table
- [ ] "Generate Manifest" button disabled when errors exist
- [ ] Generated JSON contains all required fields
- [ ] "Copy" button changes text to "Copied!" for 2 seconds
- [ ] "Hide/Show Manifest" toggle works correctly

## How to Check Yourself

1. Clear "Team Owner" field for any MFE — field highlights red, generation button disables
2. Enter SLO = 98 — field highlights red with message "SLO must be >= 99%"
3. Fix all errors — "Generate Manifest" button becomes active
4. Change Cart MFE SLO from 99.95 to 99.5 — Error Budget should update from 0.05% to 0.5% (21.9 min → 219 min per month)
5. Generate manifest — verify `errorBudgetMinPerMonth` calculated as `(100 - SLO) / 100 * 43800`
6. Click "Copy" — button text changes to "Copied!"
