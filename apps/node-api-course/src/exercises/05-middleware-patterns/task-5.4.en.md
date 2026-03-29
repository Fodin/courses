# Task 5.4: Compression & Caching

## 🎯 Goal

Implement HTTP compression (gzip/brotli) and caching (ETag, Cache-Control, conditional requests).

## Requirements

1. Show Accept-Encoding -> Content-Encoding: gzip/br
2. Compare sizes: original vs gzip vs brotli for JSON, HTML, CSS
3. Implement ETag and conditional requests: `If-None-Match` -> 304 Not Modified
4. Show Cache-Control strategies: private/public, max-age, no-cache, no-store, immutable
5. Show Cache-Control examples for different resource types (API, static, auth)

## Checklist

- [ ] Gzip/brotli: Accept-Encoding -> Content-Encoding + Vary: Accept-Encoding
- [ ] Size table: original/gzip/brotli with compression percentages
- [ ] ETag flow: first request -> ETag, repeat -> If-None-Match -> 304
- [ ] Cache-Control: private (API), public+immutable (hashed static), no-store (auth)
- [ ] 304 Not Modified doesn't send the response body

## How to Verify

Click "Run" and verify that: compression table shows savings, ETag flow demonstrates 304, and Cache-Control strategies are described for different resource types.
