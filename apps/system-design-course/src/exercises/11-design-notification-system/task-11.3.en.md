# Task 11.3: Full Notification System Design

## Objective

Design a notification system end-to-end — like a real System Design interview. Go through all stages: requirements, delivery channels, pipeline, data model, retry strategies, scaling.

## Requirements

1. **Requirements** — formulate functional and non-functional requirements
2. **Channels** — describe delivery channels (Push, Email, SMS, In-App) and their specifics
3. **Pipeline** — design the notification pipeline from trigger to delivery
4. **Data Model** — design tables: templates, preferences, delivery_log, device_tokens
5. **Priority System** — describe the priority system and queue organization
6. **Retry Strategy** — for each channel: retry count, backoff, permanent failures
7. **Architecture** — draw system components and their connections

## Checklist

### Requirements
- [ ] 4+ functional requirements listed (multi-channel, preferences, templates, priorities)
- [ ] 3+ non-functional requirements (scale, latency, exactly-once)
- [ ] Notification types defined (transactional, promotional, security)

### Channels
- [ ] Push: APNs (iOS) + FCM (Android/Web), device token management
- [ ] Email: delivery service (SendGrid/SES), bounce handling, SPF/DKIM
- [ ] SMS: gateway (Twilio), E.164 format, cost, only critical
- [ ] In-App: WebSocket/polling, DB storage, badge count

### Pipeline
- [ ] Order: trigger → dedup → preference → template → priority queue → router → deliver
- [ ] Deduplication via idempotency key + Redis
- [ ] Preference check before enqueue (resource savings)
- [ ] Template render before queue (finished message in queue)

### Data Model
- [ ] notification_templates table (eventType, channel, locale, body, version)
- [ ] user_preferences table (channels, quietHours, timezone, unsubscribed)
- [ ] delivery_log table (status, attempts, failReason, providerMessageId)
- [ ] device_tokens table (userId, token, platform, isValid)

### Priority & Retry
- [ ] 4 priority levels: critical, high, normal, low
- [ ] Physically separate queues (not one with priority)
- [ ] Per-channel retry: push (3x), email (5x), SMS (2x + fallback)
- [ ] Permanent failure handling (InvalidToken → delete, HardBounce → disable email)

### Architecture
- [ ] Kafka for event ingestion from other services
- [ ] Redis for deduplication and priority queues
- [ ] PostgreSQL for templates, preferences, delivery log
- [ ] Workers with auto-scaling by queue length
- [ ] Webhook endpoints for status updates from providers

## How to Check Yourself

1. Go through each checklist section — all items should be covered
2. "Walk through" 3 scenarios: OTP code, order confirmation, promo mailing
3. Check: what happens if SendGrid is unavailable? (fallback, retry)
4. Check: what happens if the user is in quiet hours? (delay or skip)
5. Check: what happens if 10 million promos are sent at once? (will it block critical?)
6. Compare your design with the reference solution (Solution)
