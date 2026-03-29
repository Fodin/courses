# 🔥 Level 6: Networking

## 🎯 Why Understand Network Programming

Node.js was built for networked applications. Understanding TCP, HTTP, and DNS at a low level is key to writing performant servers, debugging network issues, and understanding frameworks (Express, Fastify, Koa).

## 📌 Node.js Network Stack

The stack goes from the OS level (TCP/IP, DNS) through libuv, to the `net` module (raw TCP), then `tls` (encryption), then `http`/`https` (HTTP protocol), and finally application frameworks.

## 🔥 TCP with the net Module

`net.createServer()` creates a TCP server. Each connection is a Duplex Stream (socket) with events: `connect`, `data`, `end`, `close`, `error`, `timeout`, `drain`.

## 🔥 HTTP with the http Module

`http.createServer()` builds on top of `net`. `req` (IncomingMessage) is a Readable Stream, `res` (ServerResponse) is a Writable Stream. Read body with `for await...of`, always limit body size.

## 🔥 URL and DNS

Use the WHATWG `URL` API and `URLSearchParams` for URL manipulation. For DNS, prefer `dns.resolve()` over `dns.lookup()` in high-load scenarios (lookup uses the thread pool).

## 🔥 HTTPS and TLS

Use `https.createServer()` with key/cert files. Minimum TLS 1.2. Never disable certificate verification in production. Use Let's Encrypt for free certificates.

## 💡 Best Practices

1. Use `pipeline()` for stream connections in HTTP
2. Limit request body size for DoS protection
3. Minimum TLS 1.2 for production servers
4. Never disable certificate verification
5. Use `dns.resolve()` over `dns.lookup()` in high-load
6. Implement framing for TCP protocols
7. Always call `res.end()` in HTTP handlers
8. Use `fetch()` (Node.js 18+) for client requests
9. Configure keep-alive for connection reuse
10. Use Let's Encrypt for free TLS certificates
