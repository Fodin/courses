# Task 2.3: Hooks Lifecycle

## 🎯 Goal

Understand the Fastify request lifecycle: hooks onRequest, preParsing, preValidation, preHandler, preSerialization, onSend, onResponse, and onError.

## Requirements

1. Visualize the complete request lifecycle in Fastify (from Incoming Request to onResponse)
2. Demonstrate a request passing through all hooks with timing measurements
3. Explain the purpose of each hook and typical use-cases (logging, auth, authorization, metrics)
4. Show the `onError` hook -- a side-effect on errors (logging), not a replacement for `setErrorHandler`

## Checklist

- [ ] Lifecycle diagram shows all hooks in correct order
- [ ] Each hook described with a typical use-case
- [ ] Simulation passes a request through: onRequest -> preHandler [auth, rbac] -> Handler -> preSerialization -> onSend -> onResponse
- [ ] `onError` explained as a side-effect hook (not an error handler replacement)
- [ ] Total request execution time shown

## How to Verify

Click "Run" and trace GET /api/users/42 passing through all lifecycle hooks. Each step should show the action and execution time.
