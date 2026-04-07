# Task 12.2: Message Delivery Simulator

## Goal

Implement an interactive messenger simulator with two clients, delivery statuses (sent → delivered → read), offline mode, and an undelivered message queue.

## Requirements

1. **Two clients** (Alice and Bob) — each can send messages to the other
2. **Delivery statuses** — each message displays its current status:
   - ✓ SENT — server accepted the message
   - ✓✓ DELIVERED — message delivered to recipient's device
   - ✓✓ READ (blue) — recipient read the message
3. **Online/Offline button** for each client — toggles the mode
4. **Offline queue** — messages sent to an offline recipient accumulate in the queue
5. **Reconnect** — when switching to Online, all accumulated messages are delivered
6. **"Mark as Read" button** — sets READ status on all delivered messages in the chat

## Checklist

- [ ] Two clients can exchange messages
- [ ] SENT status appears instantly after sending
- [ ] DELIVERED status appears if the recipient is online
- [ ] Status remains SENT if the recipient is offline
- [ ] When recipient goes Online — all SENT messages become DELIVERED
- [ ] "Mark as Read" button transitions DELIVERED to READ
- [ ] Offline queue displays visually (count of pending messages)
- [ ] UI shows the current status of each client (Online/Offline)

## How to check yourself

1. Send a message from Alice to Bob (both online) — status should become DELIVERED
2. Switch Bob to Offline, send a message — status should be SENT
3. Switch Bob back to Online — status should become DELIVERED
4. Press "Mark as Read" on Bob's side — status should become READ (blue checkmarks)
5. Verify the offline queue shows the correct message count
