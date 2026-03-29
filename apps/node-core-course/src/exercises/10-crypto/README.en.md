# 🔥 Level 10: Cryptography (crypto)

## 🎯 Introduction

The `crypto` module provides cryptographic functions: hashing, encryption, digital signatures, and random data generation. Built on OpenSSL for high performance.

## 🔥 Hashing (createHash)

```javascript
const hash = crypto.createHash('sha256').update('data').digest('hex')
```

Use SHA-256 minimum. MD5/SHA-1 are broken for security purposes.

## 🔥 HMAC

Hash with a secret key for message authentication:

```javascript
const hmac = crypto.createHmac('sha256', secret).update(data).digest('hex')
// Always use timingSafeEqual for comparison!
```

## 🔥 Random Data

```javascript
crypto.randomBytes(32)     // cryptographically secure bytes
crypto.randomUUID()        // UUID v4
crypto.randomInt(1, 100)   // random integer
```

## 🔥 Symmetric Encryption (AES-256-GCM)

```javascript
const iv = crypto.randomBytes(12)
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
// encrypt + getAuthTag for authentication
```

Prefer GCM over CBC — it provides encryption AND authentication.

## 🔥 Asymmetric Crypto (RSA/EC)

```javascript
// Generate key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 })

// Sign with private key, verify with public key
const signature = crypto.sign('sha256', data, privateKey)
const isValid = crypto.verify('sha256', data, publicKey, signature)

// Encrypt with public, decrypt with private
const encrypted = crypto.publicEncrypt(publicKey, data)
```

RSA can only encrypt small data (~214 bytes). Use hybrid encryption for large data.

## ⚠️ Common Beginner Mistakes

1. **MD5/SHA1 for security** — use SHA-256+ or scrypt for passwords
2. **Reusing IV** — generate new IV for every encryption
3. **Regular comparison for HMAC** — use timingSafeEqual
4. **Math.random() for tokens** — use crypto.randomBytes

## 💡 Best Practices

1. SHA-256 minimum for hashing, scrypt/bcrypt for passwords
2. AES-256-GCM for symmetric encryption
3. New IV for every encryption
4. timingSafeEqual for hash/HMAC comparison
5. Hybrid encryption (RSA + AES) for large data
