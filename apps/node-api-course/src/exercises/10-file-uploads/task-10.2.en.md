# Task 10.2: Streaming Uploads

## 🎯 Goal

Master streaming uploads for large files via busboy: stream pipe to file, progress tracking, limit handling, and image post-processing with sharp.

## Requirements

1. Configure busboy with headers and limits for multipart request processing
2. Implement streaming write: `stream.pipe(createWriteStream(path))` without RAM buffering
3. Track upload progress via `data` events and Content-Length
4. Handle limit exceeded: `limit` event, delete partially uploaded file
5. Show post-processing with sharp: resize to multiple sizes, convert to WebP

## Checklist

- [ ] Busboy processes multipart via pipe (req.pipe(bb))
- [ ] File written via streaming without RAM buffering
- [ ] Progress tracked as percentage
- [ ] Limit exceeded deletes partial file
- [ ] Sharp generates thumb/medium/large versions

## How to Verify

Click "Run" and verify that: file uploads via streaming with minimal RAM usage, progress is displayed, limits work, images are processed by sharp.
