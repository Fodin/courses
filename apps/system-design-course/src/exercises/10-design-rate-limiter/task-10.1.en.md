# Task 10.1: Quiz — Rate Limiter

## Objective

Test understanding of key decisions when designing a Distributed Rate Limiter: algorithms (fixed window, sliding window, token bucket), race conditions in Redis, Lua scripts, multi-tier rate limiting.

## Requirements

1. Read the Level 10 theory (README)
2. Complete the quiz of 4 questions on key concepts
3. For each question, select the correct answer
4. Try to answer without looking at the theory

## Checklist

- [ ] Read the rate limiting algorithm theory
- [ ] Understand the boundary burst problem in Fixed Window
- [ ] Understand why GET → check → INCR creates a race condition
- [ ] Understand why Lua scripts are preferred over MULTI/EXEC for rate limiting
- [ ] Understand the multi-tier rate limit check order (from broad to narrow)
- [ ] Quiz completed with a score of at least 75%

## How to Check Yourself

1. Open the quiz and answer all questions
2. Check the explanations for incorrect answers
3. If the score is below 75% — reread the relevant theory sections
