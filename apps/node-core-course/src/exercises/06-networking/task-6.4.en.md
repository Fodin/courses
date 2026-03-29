# Task 6.4: HTTPS/TLS

## Goal

Understand TLS/SSL encryption in Node.js: creating HTTPS servers, TLS sockets, the handshake process, and security best practices.

## Requirements

1. Show self-signed certificate generation via OpenSSL
2. Demonstrate HTTPS server creation with `key` and `cert`
3. Show TLS server via `tls.createServer()` with connection info
4. Demonstrate TLS client via `tls.connect()`
5. Simulate TLS Handshake step by step
6. Show security best practices and common mistakes

## Checklist

- [ ] Certificate generation via OpenSSL shown
- [ ] HTTPS server with key/cert created
- [ ] TLS server with getProtocol/getCipher shown
- [ ] TLS client demonstrated
- [ ] TLS Handshake simulated step by step
- [ ] Security best practices listed

## How to verify

1. Click "Run" and study the TLS Handshake
2. Verify all 7 handshake steps are shown
3. Check that connection info (protocol, cipher, certificate) is present
4. Verify these are mentioned: minVersion TLS 1.2, never disable rejectUnauthorized, Let's Encrypt
