# Task 12.3: Contract Tests

## Goal

Implement the contract testing pattern to verify that different implementations of an interface behave identically.

## Requirements

1. Define a `StorageContract<T>` interface with methods: `get`, `set`, `has`, `delete`, `clear`, `size`
2. Create `ContractTest<T>` and `ContractSuite<T>` types for describing and running tests
3. Implement `createContractSuite(name, tests)` with a `run(impl)` method
4. Write a set of contract tests `storageContractTests<T>(sample, another)` for StorageContract
5. Create two implementations: `MapStorage<T>` and `ObjectStorage<T>`
6. Demonstrate: both implementations pass the same tests

## Checklist

- [ ] `ContractTest` contains name and a test function returning `{ passed, message }`
- [ ] `ContractSuite.run()` runs all tests and returns results
- [ ] At least 8 contract tests cover all StorageContract methods
- [ ] Each test starts with `clear()` -- isolation from other tests
- [ ] `MapStorage` and `ObjectStorage` both pass all tests
- [ ] Tests are parameterized: work for any type T

## How to Verify

1. Run suite for MapStorage -- all tests should pass
2. Run suite for ObjectStorage -- all tests should also pass
3. Intentionally break one implementation -- contract test should catch it
4. Create suite for a different type (string instead of number) -- tests work
