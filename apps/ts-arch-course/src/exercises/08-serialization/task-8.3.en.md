# Task 8.3: Data Migrations

## 🎯 Goal

Create a type-safe data migration pipeline with versioned schemas, where each migration has typed input and output.

## Requirements

1. Create a `Migration<TFrom, TTo>` interface with `fromVersion`, `toVersion`, `migrate` fields
2. Create a `VersionedData<T>` interface with `version` and `data` fields
3. Define at least 4 schema versions (V1 -> V2 -> V3 -> V4) with realistic evolution:
   - V1->V2: splitting a field into multiple
   - V2->V3: structure change (primitive -> object)
   - V3->V4: adding new fields with default values
4. Implement `MigrationPipeline` with `register(migration)` and `migrate(data, targetVersion)` methods
5. Pipeline should automatically apply intermediate migrations

## Checklist

- [ ] `Migration<TFrom, TTo>` types the function `migrate: (data: TFrom) => TTo`
- [ ] `VersionedData<T>` stores version and typed data
- [ ] Each migration creates a new object (immutability)
- [ ] Pipeline applies V1->V2->V3->V4 when V1->V4 migration is requested
- [ ] Pipeline works correctly when data is already at an intermediate version
- [ ] All intermediate transformations are checked by the compiler

## How to Verify

Create V1 data and migrate to V4. Verify all fields are correctly transformed. Try migrating V3 data to V4 — only one migration should be applied.
