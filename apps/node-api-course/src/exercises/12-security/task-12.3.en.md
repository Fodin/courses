# Task 12.3: CSRF & Advanced Security

## 🎯 Goal

Master advanced security techniques: CSRF tokens, HTTP parameter pollution, ReDoS prevention.

## Requirements

1. Implement CSRF protection: csurf middleware, token endpoint, POST request verification
2. Show double-submit cookie pattern for SPAs
3. Add hpp (HTTP Parameter Pollution) with whitelist
4. Show ReDoS vulnerability and defense via RE2
5. Demonstrate SameSite cookies as a modern CSRF token alternative

## Checklist

- [ ] CSRF token generated and verified
- [ ] POST without CSRF token returns 403
- [ ] HPP deduplicates query parameters
- [ ] ReDoS-vulnerable regex shown and replaced with RE2
- [ ] SameSite cookies configured as additional protection

## How to Verify

Click "Run" and verify that: CSRF token works, requests without token are blocked, HPP protects against parameter duplication, RE2 runs in linear time.
