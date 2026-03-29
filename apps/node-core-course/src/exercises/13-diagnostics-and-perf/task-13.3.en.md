# Task 13.3: Zlib Compression

## Goal

Master the `zlib` module for data compression: gzip/gunzip, deflate/inflate, brotli, streaming compression via pipeline, and HTTP response compression.

## Requirements

1. Demonstrate synchronous compression/decompression via gzipSync/gunzipSync
2. Show deflate and brotli as alternative algorithms
3. Provide algorithm comparison by compression ratio and speed
4. Implement streaming file compression via pipeline
5. Show HTTP response compression with Accept-Encoding detection
6. Demonstrate compression parameters (level, BROTLI_PARAM_QUALITY)

## Checklist

- [ ] gzip/gunzip synchronous compression with ratio display
- [ ] deflate and brotli as alternatives
- [ ] Algorithm comparison table
- [ ] Streaming compression via pipeline
- [ ] HTTP compression with Content-Encoding
- [ ] Compression quality parameters

## How to verify

1. Click "Run" — all compression algorithms should be displayed
2. Verify compression ratio is shown
3. Check streaming compression uses pipeline
4. Verify HTTP compression checks Accept-Encoding
