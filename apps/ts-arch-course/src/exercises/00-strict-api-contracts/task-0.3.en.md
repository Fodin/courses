# Task 0.3: API Versioning

## 🎯 Goal

Create a type-safe API versioning system where each version has its own set of endpoints and response types, and migrations between versions are typed.

## Requirements

1. Define at least 3 API versions (v1, v2, v3) with evolving data types
2. Create an `ApiVersions` interface describing all versions and their endpoints
3. Implement `createVersionedClient()` — a factory that creates a client for a specific version
4. The client should only allow endpoints that exist in the given version
5. Create typed migrations `MigrationFn<TFrom, TTo>` between versions
6. Demonstrate a migration chain v1 -> v2 -> v3

## Checklist

- [ ] `ApiVersions` describes at least 3 versions with different endpoints
- [ ] `v1Client.get('/users/by-role')` causes an error (endpoint added in v2)
- [ ] `v3Client.get('/users/permissions')` works (added in v3)
- [ ] Migration v1 -> v2 -> v3 transforms data with full typing
- [ ] Each version adds new fields/endpoints

## How to Verify

Try accessing an endpoint that doesn't exist in the selected version. Verify that migration correctly transforms data structure across all versions.
