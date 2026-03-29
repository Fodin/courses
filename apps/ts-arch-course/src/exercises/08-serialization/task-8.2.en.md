# Task 8.2: Codec Pattern

## 🎯 Goal

Implement the codec pattern — bidirectional type-safe data transformers with composition via `pipe`.

## Requirements

1. Create a `Codec<TDecoded, TEncoded>` interface with `encode`, `decode`, and `pipe` methods
2. Implement a `createCodec(encode, decode)` factory with `pipe` support
3. The `pipe` method must check type compatibility: first codec's output = second's input
4. Create at least 4 basic codecs: dateCodec, numberCodec, base64Codec, jsonCodec
5. Demonstrate composition: `jsonCodec.pipe(base64Codec)`

## Checklist

- [ ] `Codec<TDecoded, TEncoded>` types encode and decode
- [ ] `pipe` creates a new codec with type `Codec<TDecoded, TFinal>`
- [ ] `dateCodec.encode(new Date())` returns `string`
- [ ] `dateCodec.decode("...")` returns `Date`
- [ ] `jsonCodec.pipe(base64Codec)` compiles (string -> string)
- [ ] `decode(encode(x))` returns an equivalent of `x` (roundtrip)

## How to Verify

Create a composite codec via `pipe` and check roundtrip: `decode(encode(obj))` should return an object equivalent to the original. Try composing incompatible codecs — TypeScript should show an error.
