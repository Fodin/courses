# Task 7.2: RPC via RabbitMQ

## Goal

Implement an interactive RPC pattern simulator over RabbitMQ with sequence diagram visualization. The client sends a request with `reply-to` and `correlation-id` headers, the server publishes the response to the `reply-to` queue, and the client matches the response by `correlationId`.

## Requirements

1. Implement an `RpcCall` type with fields:
   - `correlationId: string` — unique call identifier
   - `requestBody: string` — request body
   - `replyTo: string` — name of the temporary response queue
   - `status: 'pending' | 'processing' | 'completed' | 'timeout'`
   - `response: string | null` — server response
   - `startedAt: number`, `completedAt: number | null`

2. Implement an `RpcStep` type — union type of sequence diagram steps:
   - `client-send`, `server-recv`, `server-process`, `server-reply`, `client-recv`, `timeout`
   - Each step contains `correlationId`; steps `client-send`, `server-reply`, `client-recv` also contain message data

3. Implement a `sendRpc()` function:
   - Generate a unique `correlationId` (format `corr-XXXXXX`)
   - Generate a temporary queue name `amq.gen-XXXXXXXX` for `reply-to`
   - Sequentially add steps to the sequence diagram with delays: `client-send` → `server-recv` (500 ms) → `server-process` (600 ms) → `server-reply` (800 ms) → `client-recv` (500 ms)
   - With the `simulateTimeout` flag enabled — after 4,000 ms add a `timeout` step instead of a normal response

4. Provide 3 operations to choose from: "Get USD Rate", "Confirm Order", "Calculate Discount".

5. Display a list of active calls with fields `correlationId`, `reply-to`, status, response, RTT in ms.

6. Display a sequence diagram — a sequence of steps with icons and colors for CLIENT, SERVER, rpc.queue.

7. Implement a "Clear" button to reset the state.

## Checklist

- [ ] `generateCorrelationId()` returns a string like `corr-XXXXXX`
- [ ] `sendRpc()` creates an `RpcCall` and adds it to the call list
- [ ] Sequence diagram steps appear with correct delays
- [ ] With `simulateTimeout` enabled, a `timeout` step appears after 4 seconds
- [ ] Active calls list shows `correlationId`, `reply-to` and status
- [ ] After call completion, the response and RTT are displayed
- [ ] "Clear" button resets both calls and sequence diagram

## How to test yourself

1. Select the "Confirm Order" operation and click "Send RPC".
2. The sequence diagram should show 5 steps in order: `client-send` → `server-recv` → `server-process` → `server-reply` → `client-recv`.
3. In the active calls list, the call status should change from `PENDING` to `PROCESSING`, then to `COMPLETED`.
4. The call card should display: `correlationId`, `reply-to` queue name, response `{ "status": "confirmed", "eta": "2h" }` and the RTT value.
5. Enable the "Simulate timeout" flag and send another call — after 4 seconds a `TIMEOUT` step should appear instead of a response.
