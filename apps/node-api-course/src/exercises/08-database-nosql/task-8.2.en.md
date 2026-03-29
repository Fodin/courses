# Task 8.2: Mongoose

## 🎯 Goal

Master Mongoose ODM: schema definition with validation, virtual fields, middleware (hooks), and population for loading relations.

## Requirements

1. Define a Schema with types, validation (required, min, max, enum, match), defaults, and timestamps
2. Create virtual fields (computed) and virtual relations (ref)
3. Implement middleware: pre('save') for password hashing, post('save') for side effects, pre(/^find/) for soft-delete
4. Show population: simple, selective (select), deep (nested), with filtering (match + options)
5. Add instance methods and static methods to the schema

## Checklist

- [ ] Schema defined with validation and types
- [ ] Virtual fields computed from existing data
- [ ] Pre/post middleware registered for save and find
- [ ] Population loads related documents with filtering
- [ ] Instance and static methods added to schema

## How to Verify

Click "Run" and verify that: schema has validation, virtuals are computed, middleware executes in correct order, population loads relations with filtering.
