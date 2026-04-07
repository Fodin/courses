# Task 7.2: Circuit Breaker Simulator

## Objective

Build an interactive Circuit Breaker simulator: visualize state transitions between Closed → Open → Half-Open at different service error levels.

## Requirements

1. **Service with configurable error rate:**
   - Slider or buttons to select error probability (0%, 25%, 50%, 75%, 100%)
   - Each "request" — random success/failure based on the configured error rate
2. **Circuit Breaker state visualization:**
   - Current state: Closed (green), Open (red), Half-Open (yellow)
   - Consecutive error / success counter
   - Visual indicator of state transitions
3. **Configurable parameters:**
   - **Failure threshold** — after how many consecutive errors to transition to Open (e.g., 3 or 5)
   - **Recovery timeout** — after how many seconds to go from Open → Half-Open (e.g., 5s or 10s)
4. **"Send Request" button** — one request through the circuit breaker
5. **Event log** — chronology of requests and state transitions
6. **Counters:** total requests, successful, failed, blocked (circuit open)
7. **Reset** — reset to initial state

## Checklist

- [ ] Error rate slider/buttons (0%, 25%, 50%, 75%, 100%)
- [ ] State visualization (Closed=green, Open=red, Half-Open=yellow)
- [ ] Failure threshold setting (3, 5, 10)
- [ ] Recovery timeout setting (5s, 10s, 30s)
- [ ] "Send Request" button — single request
- [ ] Correct transitions: Closed→Open at threshold, Open→Half-Open at timeout
- [ ] Half-Open→Closed on success, Half-Open→Open on failure
- [ ] Event log with state transition markers
- [ ] Counters: total, success, failure, blocked
- [ ] Reset

## How to Check Yourself

1. Error rate 0%: all requests pass, state always Closed
2. Error rate 100%, threshold 3: after 3 requests → Open, subsequent requests blocked
3. Error rate 100% → Open → wait for timeout → Half-Open → send request → Open (failure)
4. Error rate 100% → Open → switch error rate to 0% → wait for timeout → Half-Open → request → Closed
5. Reset clears everything to initial state
