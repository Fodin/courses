# Task 12.1: Quiz — Chat System (WhatsApp-like)

## Goal

Verify understanding of key decisions when designing a messenger: WebSocket vs polling, message delivery statuses, fan-out strategies, presence service, offline sync.

## Requirements

1. Read the level 12 theory (README)
2. Complete the 5-question quiz on key concepts
3. For each question, select the correct answer (some questions have multiple correct answers)
4. Try to answer without peeking at the theory

## Checklist

- [ ] Read the Chat System design theory
- [ ] Understand the difference between WebSocket, Long Polling, and SSE for real-time communication
- [ ] Understand how to route messages between WebSocket Gateway servers via Redis
- [ ] Understand the delivery status protocol: SENT → DELIVERED → READ
- [ ] Understand the difference between fan-out on write and fan-out on read for group chats
- [ ] Understand the heartbeat mechanism of the presence service and subscription model for fan-out
- [ ] Passed the quiz with at least 80%

## How to check yourself

1. Open the quiz and answer all questions
2. Check explanations for incorrect answers
3. If the result is below 80% — reread the relevant theory sections
