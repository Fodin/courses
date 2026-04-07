# Assignment 0.3: Protocol Selection

## Goal

Learn to select the appropriate network protocol for a specific scenario, considering latency, reliability, bidirectionality, and scalability requirements.

## Requirements

1. For each of the 5 scenarios, select the most suitable protocol
2. Justify your choice: why this protocol and not alternatives

### Scenarios

| # | Scenario | Key Requirements |
|---|----------|-------------------|
| 1 | Real-time messenger (chat) | Instant delivery, server push, thousands of simultaneous users |
| 2 | Video streaming (YouTube-like service) | Large data volume, frame losses acceptable, minimal latency |
| 3 | REST API for a mobile shopping app | CRUD operations, caching, compatibility with mobile clients |
| 4 | IoT sensor data collection (temperature, humidity) | Thousands of devices, small packets, unstable network, minimal overhead |
| 5 | Microservice interaction within a data center | High speed, strong typing, streaming, minimal latency |

## Checklist

- [ ] A protocol is selected for each scenario (from: HTTP/1.1, HTTP/2, HTTP/3, WebSocket, gRPC, MQTT, UDP)
- [ ] Each choice includes justification (1-2 sentences)
- [ ] Explained why alternative protocols are less suitable
- [ ] Considered each scenario's requirements: latency, throughput, reliability, scalability
- [ ] Answers match the solution or are reasonably justified

## How to Check Yourself

1. Open the assignment and select a protocol for each scenario
2. Compare your answers with the solution
3. Pay attention to justifications — even if you chose the same protocol, check if the reasoning matches
4. If your choice differs — it's not necessarily wrong: in real architecture, there can be multiple valid solutions
