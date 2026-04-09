# Task 11.3: Rate Limiting Design

## Goal

Implement an interactive self-check for designing rate limiting for three real scenarios. The student studies the scenario, writes their own solution, then compares it to the reference.

## Requirements

1. Three scenario cards (clickable): public API with tiers, internal microservice API, BFF for a mobile app
2. When a scenario is selected — show a textarea for the student's answer with a placeholder hint on what to describe
3. "Show reference solution" button opens a panel with four blocks:
   - **Algorithm** (highlighted header with color)
   - **Limits** (list with bullet points)
   - **HTTP Headers** (in a dark block with monospace font)
   - **Identification Key** + **Additional Mechanisms**
4. Active card highlighted with border (#6366f1), inactive cards — #e2e8f0
5. Student answers are preserved when switching between scenarios

## Checklist

- [ ] Three scenario cards with icon, name, description
- [ ] Clicking a card reveals a textarea for the answer
- [ ] Textarea preserves text when switching scenarios
- [ ] "Show reference solution" button opens a panel
- [ ] Reference panel: algorithm, limits, headers (monospace), key, additional
- [ ] Revealed state is saved separately for each scenario

## Scenario Data

### Scenario 1: Public API for Developers
Three tiers: Free (100/hr), Pro (10k/hr), Enterprise (100k/hr).
Algorithm: Token Bucket. Key: API Key from Authorization: Bearer.

### Scenario 2: Internal API Between Microservices
8 services, 3 heavy consumers. Protection against cascading failures.
Algorithm: Sliding Window Counter. Key: Service ID from X-Service-ID.

### Scenario 3: BFF for a Mobile App
2 million users. Different limits for /auth and the general API.
Algorithm: Sliding Window Log for /auth + Token Bucket for the main API. Key: User ID / IP.

## How to Check Yourself

1. For each scenario — write your own solution (at least 3-5 points)
2. Click "Show reference" and compare
3. Note: the algorithm depends on the API type, the key depends on the authorization model
