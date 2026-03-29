# Task 5.3: Transform Streams

## Goal

Learn to create Transform Streams for on-the-fly data transformation, including objectMode and transformation chains.

## Requirements

1. Show creating a Transform Stream with the `transform()` method
2. Demonstrate the `flush()` method for finalization
3. Show `objectMode` for working with JS objects instead of buffers
4. Demonstrate a transformation chain (pipe chain)
5. Simulate a chain: Trim → UpperCase → AddPrefix
6. Simulate objectMode: Parse JSON → Filter → Output

## Checklist

- [ ] Creating Transform via new Transform() shown
- [ ] flush() for finalization demonstrated
- [ ] objectMode explained and shown in example
- [ ] Transformation chain works
- [ ] String transformation simulation is correct
- [ ] objectMode simulation with filtering works

## How to verify

1. Click "Run" and trace the transformation chain
2. Verify each transformation step is shown separately
3. Check that objectMode filters objects by condition
4. Verify callback() is called in each transform
