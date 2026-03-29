# Task 3.2: TypedArray Interop

## Goal

Understand the relationship between Buffer, ArrayBuffer, TypedArray, and DataView, and learn to work with endianness.

## Requirements

1. Show the hierarchy: ArrayBuffer → TypedArray → Buffer
2. Demonstrate different views of the same ArrayBuffer
3. Show DataView with big-endian and little-endian
4. Explain endianness and its significance for network protocols
5. Show Buffer ↔ ArrayBuffer conversion

## Checklist

- [ ] Type hierarchy shown
- [ ] Same ArrayBuffer through different TypedArrays
- [ ] DataView with BE and LE
- [ ] Endianness explained
- [ ] Buffer ↔ ArrayBuffer conversion

## How to verify

1. Run the demo
2. Verify same bytes produce different numbers through different TypedArrays
3. Confirm BE and LE produce different byte orders
