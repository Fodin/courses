# Task 12.1: Typed Mocks

## Goal

Create a type-safe mock factory that automatically preserves interface contracts, tracks calls, and allows setting return values.

## Requirements

1. Create a `MockFunction<TArgs, TReturn>` type with methods: `calls`, `mockReturnValue`, `mockImplementation`, `calledWith`, `calledTimes`, `reset`
2. Implement `createMockFn(defaultReturn)` that creates a mock function with a given default return value
3. Create a `MockOf<T>` type that transforms each interface method into a `MockFunction`
4. Implement `createMock<T>(defaults)` that creates a mock of an entire interface
5. Demonstrate mocks for `UserRepository`, `EmailService`, `Logger`
6. Show: call tracking, `mockReturnValue`, `mockImplementation`, `calledWith`, `reset`

## Checklist

- [ ] `MockFunction` preserves argument and return value types
- [ ] `calls` contains an array of all calls with arguments
- [ ] `mockReturnValue` only accepts a value of the correct type
- [ ] `mockImplementation` accepts a function with the correct signature
- [ ] `calledWith` checks whether a call was made with specific arguments
- [ ] `reset` clears call history
- [ ] `MockOf<T>` transforms all interface methods into mocks

## How to Verify

1. Create a UserRepository mock and call `findById` -- check `calls`
2. Set `mockReturnValue` and verify the next call returns that value
3. Use `mockImplementation` with custom logic
4. Reset the mock via `reset` -- `calledTimes()` should become 0
