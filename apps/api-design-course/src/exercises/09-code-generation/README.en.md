# Code and SDK Generation

## Why Generate Code from a Specification

An OpenAPI specification is not just documentation. It's a **machine-readable contract** from which you can automatically get:

- TypeScript types for all models and endpoints
- Ready-made HTTP clients with type-safe methods
- React Query / SWR hooks
- MSW mocks for testing without a real backend

Without generation, frontend developers have to manually keep types in sync with the API. If the backend changes a field — you'll find out in production.

## Main Tools for Frontend

| Tool | What it generates | Runtime dependency |
|---|---|---|
| **openapi-generator** | types + clients + hooks (50+ languages) | Java / Docker |
| **openapi-typescript** | TypeScript types only | Node.js |
| **orval** | types + React Query hooks + MSW mocks | Node.js |

## Contract-First Approach

**Contract-first** means the specification is written **before** implementation:

1. Product manager and developers agree on the API contract in `openapi.yaml`
2. Frontend generates types and starts development with MSW mocks
3. Backend implements the API according to the contract
4. Upon release — the real API already matches the frontend types

The alternative — **code-first**: code is written first, then a spec is generated from it (e.g., via annotations). It works, but gives less control over API design.

## Typical Workflow

```
openapi.yaml → npm run generate:api → src/api/schema.d.ts → component
```

The key rule: `schema.d.ts` is **never edited manually** — only regenerated.
