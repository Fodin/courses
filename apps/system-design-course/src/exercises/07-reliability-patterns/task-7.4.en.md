# Task 7.4: Reliability Strategy for a Payment Service

## Objective

Design a complete reliability strategy for a payment service that depends on three external providers: Stripe, PayPal, and an internal processing system.

## Requirements

1. **Three payment providers:**
   - **Stripe** — primary, fast (p99 = 200ms), uptime 99.99%
   - **PayPal** — backup, slower (p99 = 500ms), uptime 99.95%
   - **Internal Processing** — internal, for small amounts (p99 = 50ms), uptime 99.9%
2. **For each provider, define:**
   - **Retry policy** — number of attempts, backoff strategy, which errors to retry
   - **Circuit breaker config** — failure threshold, recovery timeout
   - **Timeout** — maximum wait time
   - **Fallback strategy** — what to do when this provider fails
3. **Overall degradation strategy:**
   - Failover order between providers
   - When to queue a payment instead of rejecting
   - When to refuse the client and with what message
4. **Monitoring:**
   - Which SLIs to track
   - Which SLOs to set
   - Alerts (at which burn rate to notify)
5. **Interactive table:** fill in the configuration for each provider

## Checklist

- [ ] Retry policy for each provider (retries, backoff, retryable errors)
- [ ] Circuit breaker config (threshold, timeout) for each provider
- [ ] Timeout for each provider
- [ ] Fallback: Stripe → PayPal → Internal → Queue → Reject
- [ ] Defined situations for queue vs reject
- [ ] SLI: success rate, latency p50/p99, error rate by provider
- [ ] SLO: overall success rate > 99.95%, latency p99 < 1s
- [ ] Alerts: burn rate > 2 → warning, > 5 → critical

## How to Check Yourself

1. Stripe is down → fallback to PayPal → payments go through
2. Stripe and PayPal are down → Internal Processing for small amounts, queue for large
3. All providers are down → payment queued (if not critical) or rejected with a message
4. Circuit breaker threshold for Stripe = 5 (fast service, can tolerate more attempts)
5. Timeout for Internal Processing is shorter than for Stripe (it's faster)
6. Retry only idempotent errors (timeout, 503), not retry on 400/401
