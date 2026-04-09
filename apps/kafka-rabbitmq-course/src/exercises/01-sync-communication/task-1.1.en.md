# Task 1.1: REST vs gRPC — Simulator

## Goal

Create an interactive simulator visually demonstrating the difference between REST and gRPC protocols:
message formats, overhead on headers and encoding, and data transfer latency.

## Requirements

1. Protocol switch: `REST` and `gRPC` buttons — only one active at a time
2. Interaction diagram: two blocks (`Order Service` and `User Service`) with an animated arrow between them, reflecting the current request phase
3. Request status display: indicator with phases `idle → requesting → processing → responding → done`
4. Protocol statistics: cards with fields Protocol, Transport, Encoding, Latency
5. Payload visualization: two progress bars — payload and overhead (headers, metadata)
6. Simulation launch button — shows actual request and response bodies in the output block
7. Request and response log: separate blocks with color-coded direction (request — yellow, response — green)
8. When switching protocol, the log and phase are reset

## Checklist

- [ ] REST / gRPC buttons switch the active protocol with visual highlighting
- [ ] Diagram with two services and an animated arrow displays correctly
- [ ] Arrow changes direction (`→→→` on request, `←←←` on response)
- [ ] Phase indicator changes color and text at each step
- [ ] Statistic cards show different values for REST and gRPC
- [ ] Progress bars display different payload sizes for each protocol
- [ ] Launch button simulates the full request → processing → response cycle
- [ ] Log shows the actual HTTP/gRPC message body in a `<pre>` block
- [ ] Component uses `useLanguage` and `t('task.1.1')` for the heading

## How to Check Yourself

1. Open the task in the browser
2. Press the `REST` button — make sure stats show JSON, HTTP/1.1, latency 45ms
3. Press `Send REST Request` — observe phase changes and the log appearing
4. Switch to `gRPC` — stats should change Transport to HTTP/2, Encoding to Protobuf
5. Launch gRPC simulation — make sure latency is 3-4x lower and payload is more compact
6. Progress bars for gRPC should be noticeably shorter (less overhead)
7. Re-launch clears the previous log