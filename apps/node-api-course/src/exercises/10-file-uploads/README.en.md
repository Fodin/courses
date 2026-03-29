# 🔥 Level 10: File Uploads

## 🎯 Two Approaches

1. **Multer** -- buffered uploads with Express middleware (memory/disk storage)
2. **Streaming** -- stream-based uploads for large files via busboy (minimal RAM)

## 🔥 Multer

```typescript
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })
app.post('/avatar', upload.single('avatar'), handler)
```

File filters, disk storage, error handling (LIMIT_FILE_SIZE, etc.).

## 🔥 Streaming with Busboy

```typescript
const bb = busboy({ headers: req.headers, limits: { fileSize: 100 * 1024 * 1024 } })
bb.on('file', (name, stream, info) => { stream.pipe(createWriteStream(path)) })
req.pipe(bb)
```

Memory: ~64KB buffer vs 100MB for memory storage.

## 🔥 Security

- Validate magic bytes, not file extensions
- Generate UUIDs for filenames (prevent path traversal)
- Always set size limits at Multer, Express, and Nginx levels

## ⚠️ Common Beginner Mistakes

- Memory storage for large files (OOM)
- Trusting originalname (path traversal)
- No file size limits (DoS)
- Checking only file extension (easily spoofed)

## 💡 Best Practices

1. Memory storage only for small files (<5MB)
2. Streaming for files >10MB
3. Always set limits at every layer
4. Validate with magic bytes
5. Generate UUID filenames
