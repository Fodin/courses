# Task 13.1: Quiz — News Feed System

## Goal

Verify understanding of key decisions when designing a news feed: fan-out on write vs read, hybrid approach for celebrities, feed ranking pipeline, social graph storage, feed caching.

## Requirements

1. Read the level 13 theory (README)
2. Complete the 5-question quiz on key concepts
3. For each question, select the correct answer (some questions have multiple correct answers)
4. Try to answer without peeking at the theory

## Checklist

- [ ] Read the News Feed System design theory
- [ ] Understand the difference between fan-out on write (push) and fan-out on read (pull)
- [ ] Understand the celebrity problem and why a hybrid approach is needed
- [ ] Understand how the feed ranking pipeline works (retrieval → scoring → filtering → diversification)
- [ ] Understand why the feed stores only postIds, not full objects
- [ ] Understand the DB choice for the social graph (Graph DB + Redis cache)
- [ ] Passed the quiz with at least 80%

## How to check yourself

1. Open the quiz and answer all questions
2. Check explanations for incorrect answers
3. If the result is below 80% — reread the relevant theory sections
