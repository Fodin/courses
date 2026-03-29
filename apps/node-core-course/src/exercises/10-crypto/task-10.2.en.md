# Task 10.2: Symmetric Encryption

## Goal

Master symmetric encryption via `createCipheriv`/`createDecipheriv`, understand the difference between AES-256-GCM and AES-256-CBC, and learn proper IV management.

## Requirements

1. Implement simulation of encrypting and decrypting text via AES-256-GCM
2. Show IV generation (12 bytes for GCM) and authTag
3. Demonstrate packing iv + authTag + encrypted into a single format
4. Show GCM vs CBC comparison: security, IV size, authentication
5. Demonstrate key derivation from password via scrypt

## Checklist

- [ ] AES-256-GCM encryption/decryption demonstrated
- [ ] IV is randomly generated for each encryption
- [ ] authTag is extracted and used during decryption
- [ ] Data packing for storage/transmission shown
- [ ] GCM vs CBC comparison present
- [ ] Key derivation via scrypt demonstrated

## How to verify

1. Click "Run" — encryption and decryption process should be displayed
2. Verify IV is unique for each call
3. Check authTag presence when using GCM
4. Verify the danger of IV reuse is explained
