# Task 2.2: Plugins & Decorators

## 🎯 Goal

Understand Fastify's plugin system: encapsulation, `fastify-plugin` for scope breaking, decorators for extending instance, request, and reply.

## Requirements

1. Create a plugin with `async (fastify, opts) => { ... }` function
2. Show encapsulation: plugin A doesn't see plugin B by default
3. Demonstrate `fastify-plugin` (fp) for breaking encapsulation (global scope)
4. Show three decorator types: `decorate` (instance), `decorateRequest`, `decorateReply`
5. Demonstrate plugin loading: CORS, DB, auth, routes

## Checklist

- [ ] Plugin defined as async function with `(fastify, opts)`
- [ ] Encapsulation: plugins are isolated from each other
- [ ] `fastify-plugin` wraps plugin for global access (db, auth)
- [ ] Decorators: `decorate`, `decorateRequest`, `decorateReply` shown with examples
- [ ] Load order: utility plugins (fp) first, then route plugins

## How to Verify

Click "Run" and verify that: plugin structure, difference between encapsulated and global plugins, three decorator types, and load order are shown.
