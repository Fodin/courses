# Task 0.3: Static File Serving

## 🎯 Goal

Implement a static file server with Content-Type detection, file streaming, and path traversal protection.

## Requirements

1. Create a mapping of file extensions to MIME types (`.html`, `.css`, `.js`, `.json`, `.png`, `.jpg`, etc.)
2. Handle requests for static files with Content-Type detection based on extension
3. Return 404 for non-existent files
4. Implement path traversal protection (`../../etc/passwd`) -- verify the path stays within `publicDir`
5. Show the difference between `fs.readFileSync` (bad) and `fs.createReadStream().pipe(res)` (good)

## Checklist

- [ ] Extension-to-Content-Type mapping covers major file types
- [ ] `application/octet-stream` used for unknown extensions
- [ ] Files served with correct Content-Type and Content-Length headers
- [ ] Returns 404 Not Found for missing files
- [ ] Returns 403 Forbidden on path traversal attempts
- [ ] Files streamed via `stream.pipe(res)`, not loaded entirely into memory

## How to Verify

Click "Run" and verify that: files are served with correct Content-Type, path traversal attempts are blocked with 403, missing files return 404, and streaming via pipe is demonstrated.
