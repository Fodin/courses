# Task 10.1: Multer

## 🎯 Goal

Master file uploads with Multer: single/multiple upload, file filters for type validation, storage engines (memory/disk), limits, and error handling.

## Requirements

1. Configure `upload.single('avatar')` with memory storage for single file upload
2. Configure `upload.array('photos', 10)` and `upload.fields()` for multiple files
3. Implement file filter: mimetype checking, rejecting unsupported types
4. Configure disk storage: custom destination and filename with unique suffix
5. Set limits (fileSize, files) and handle MulterError by err.code

## Checklist

- [ ] Single upload saves file and returns metadata (size, mimetype)
- [ ] Multiple upload accepts up to N files
- [ ] File filter rejects unsupported file types
- [ ] Disk storage generates unique filenames
- [ ] MulterError errors handled with correct HTTP status codes (413, 400)

## How to Verify

Click "Run" and verify that: files upload via single and array, filter rejects PDF, storage saves with unique names, limit errors are handled.
