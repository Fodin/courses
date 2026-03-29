# Task 12.1: Helmet & Security Headers

## 🎯 Goal

Master API protection via HTTP headers: Helmet configuration, Content Security Policy, HSTS, X-Frame-Options.

## Requirements

1. Add Helmet with default settings (11 headers)
2. Configure CSP: allowed sources for scripts, styles, images, connections
3. Configure HSTS: maxAge 1 year, includeSubDomains, preload
4. Show CSP report-only mode for testing without blocking
5. Create an endpoint for collecting CSP violation reports

## Checklist

- [ ] Helmet installed and returns security headers
- [ ] CSP configured with source whitelist for each resource type
- [ ] HSTS forces HTTPS
- [ ] Report-only mode logs CSP violations
- [ ] Violation reports collected at a dedicated endpoint

## How to Verify

Click "Run" and verify that: Helmet sets headers, CSP blocks unauthorized resources, report-only logs violations.
