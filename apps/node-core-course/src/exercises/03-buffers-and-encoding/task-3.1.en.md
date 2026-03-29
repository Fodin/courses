# Task 3.1: Buffer Basics

## Goal

Learn to create Buffers, convert between encodings, and understand the difference between string length and buffer byte size.

## Requirements

1. Demonstrate Buffer creation via from, alloc, allocUnsafe
2. Show conversion between UTF-8, hex, and base64
3. Show byte length vs string length difference for ASCII, Cyrillic, and emoji
4. List main Buffer API methods
5. Implement a button to run the demonstration

## Checklist

- [ ] All Buffer creation methods shown
- [ ] UTF-8 ↔ hex ↔ base64 conversion
- [ ] Byte vs string length difference for different alphabets
- [ ] Main API methods listed
- [ ] Component uses useState

## How to verify

1. Click "Run" and study buffer sizes
2. Verify Cyrillic takes 2 bytes per character
3. Confirm emoji takes 4 bytes
