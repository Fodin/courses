# Task 3.1: Strategy (Sorting Strategy)

## Objective

Implement the Strategy pattern to switch between sorting algorithms without modifying client code.

## Requirements

1. Create a `SortStrategy<T>` interface with fields:
   - `name: string` — algorithm name
   - `sort(data: T[], compare: (a: T, b: T) => number): T[]` — sort the array
2. Implement three strategies: `BubbleSort<T>`, `QuickSort<T>`, `MergeSort<T>`
3. Each strategy must return a **new array** without mutating the original
4. Create a `Sorter<T>` class with methods:
   - `constructor(strategy: SortStrategy<T>)`
   - `setStrategy(strategy: SortStrategy<T>): void`
   - `sort(data: T[], compare): T[]`
   - `getStrategyName(): string`
5. Demonstrate sorting of numbers and strings with different strategies

## Checklist

- [ ] Interface `SortStrategy<T>` is defined with a generic
- [ ] Three strategies implement the interface
- [ ] The original array is not mutated (a copy is created)
- [ ] `Sorter` allows changing the strategy via `setStrategy`
- [ ] All strategies produce the same sort result
- [ ] Demonstration works with both numbers and strings

## How to verify

1. Click the run button
2. Verify that all three strategies produce the same sorted array
3. Verify that sorting strings also works
