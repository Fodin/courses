# Task 10.1: Hashing & HMAC

## Goal

Learn to use the `crypto` module for data hashing (createHash), HMAC signatures (createHmac), and generating cryptographically secure random values (randomBytes, randomUUID).

## Requirements

1. Implement simulation of hashing a string with different algorithms (MD5, SHA-256, SHA-512) displaying results
2. Show multiple `update()` calls for incremental hashing
3. Demonstrate HMAC creation with a secret key
4. Show secure comparison via `timingSafeEqual`
5. Demonstrate random data generation: `randomBytes`, `randomUUID`, `randomInt`
6. Display a list of available hashing algorithms

## Checklist

- [ ] Hashing with three algorithms shown with hex results
- [ ] Streaming hashing via multiple update calls shown
- [ ] HMAC created with signature verification demonstration
- [ ] Importance of timingSafeEqual explained
- [ ] randomBytes, randomUUID, randomInt demonstrated
- [ ] Component uses `useState` and a run button

## How to verify

1. Click "Run" — hashes for different algorithms should be displayed
2. Verify HMAC is created with a secret key
3. Check that it explains why you cannot compare hashes with `===`
4. Verify random data generation is shown
