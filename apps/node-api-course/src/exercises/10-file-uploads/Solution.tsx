import { useState } from 'react'

// ============================================
// Task 10.1: Multer — Solution
// ============================================

export function Task10_1_Solution() {
  const [results, setResults] = useState<string[]>([])
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  const simulateSingleMultiple = () => {
    const log: string[] = []
    log.push('// === Multer: Single & Multiple File Upload ===')
    log.push("import multer from 'multer'")
    log.push('')
    log.push('// Memory storage (for small files / processing)')
    log.push('const upload = multer({')
    log.push('  storage: multer.memoryStorage(),')
    log.push('  limits: { fileSize: 5 * 1024 * 1024 } // 5MB')
    log.push('})')
    log.push('')
    log.push('// Single file upload')
    log.push("app.post('/avatar', upload.single('avatar'), (req, res) => {")
    log.push('  const file = req.file')
    log.push('  console.log({')
    log.push('    fieldname: file.fieldname,')
    log.push('    originalname: file.originalname,')
    log.push('    mimetype: file.mimetype,')
    log.push('    size: file.size,')
    log.push('    buffer: `<Buffer ${file.size} bytes>`')
    log.push('  })')
    log.push('})')
    log.push('')
    log.push('[UPLOAD] POST /avatar')
    log.push('[MULTER] single("avatar")')
    log.push('[FILE] { fieldname: "avatar", originalname: "photo.jpg", mimetype: "image/jpeg", size: 245760 }')
    log.push('[OK] 200 - Avatar uploaded')
    log.push('')
    log.push('// Multiple files (same field)')
    log.push("app.post('/gallery', upload.array('photos', 10), (req, res) => {")
    log.push('  console.log(`Received ${req.files.length} files`)')
    log.push('})')
    log.push('')
    log.push('[UPLOAD] POST /gallery (3 files)')
    log.push('[MULTER] array("photos", max: 10)')
    log.push('[FILE 1] photo1.jpg (320KB)')
    log.push('[FILE 2] photo2.png (1.2MB)')
    log.push('[FILE 3] photo3.webp (180KB)')
    log.push('[OK] 200 - 3 files uploaded')
    log.push('')
    log.push('// Multiple fields')
    log.push('app.post("/product", upload.fields([')
    log.push('  { name: "thumbnail", maxCount: 1 },')
    log.push('  { name: "images", maxCount: 5 }')
    log.push(']), (req, res) => {')
    log.push('  const thumb = req.files["thumbnail"][0]')
    log.push('  const images = req.files["images"]')
    log.push('})')
    setResults(log)
    setActiveDemo('single')
  }

  const simulateFiltersStorage = () => {
    const log: string[] = []
    log.push('// === File Filters & Disk Storage ===')
    log.push('')
    log.push('// Custom file filter')
    log.push('const imageFilter: multer.Options["fileFilter"] = (req, file, cb) => {')
    log.push('  const allowed = ["image/jpeg", "image/png", "image/webp"]')
    log.push('  if (allowed.includes(file.mimetype)) {')
    log.push('    cb(null, true)')
    log.push('  } else {')
    log.push('    cb(new MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname))')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push('// Disk storage with custom filename')
    log.push('const storage = multer.diskStorage({')
    log.push('  destination: (req, file, cb) => {')
    log.push('    const dir = `./uploads/${req.params.type}`')
    log.push('    mkdirSync(dir, { recursive: true })')
    log.push('    cb(null, dir)')
    log.push('  },')
    log.push('  filename: (req, file, cb) => {')
    log.push('    const uniqueSuffix = `${Date.now()}-${randomBytes(6).toString("hex")}`')
    log.push('    const ext = extname(file.originalname)')
    log.push('    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`)')
    log.push('  }')
    log.push('})')
    log.push('')
    log.push('const upload = multer({')
    log.push('  storage,')
    log.push('  fileFilter: imageFilter,')
    log.push('  limits: {')
    log.push('    fileSize: 10 * 1024 * 1024,  // 10MB')
    log.push('    files: 5,                     // Max 5 files')
    log.push('    fieldNameSize: 100,            // Field name length')
    log.push('    fieldSize: 1024               // Non-file field size')
    log.push('  }')
    log.push('})')
    log.push('')
    log.push('// Error handling middleware')
    log.push('app.use((err, req, res, next) => {')
    log.push('  if (err instanceof multer.MulterError) {')
    log.push('    switch (err.code) {')
    log.push('      case "LIMIT_FILE_SIZE":')
    log.push('        return res.status(413).json({ error: "File too large" })')
    log.push('      case "LIMIT_FILE_COUNT":')
    log.push('        return res.status(400).json({ error: "Too many files" })')
    log.push('      case "LIMIT_UNEXPECTED_FILE":')
    log.push('        return res.status(400).json({ error: "Invalid file type" })')
    log.push('    }')
    log.push('  }')
    log.push('  next(err)')
    log.push('})')
    log.push('')
    log.push('// Simulation:')
    log.push('[UPLOAD] POST /upload - file: report.pdf (mimetype: application/pdf)')
    log.push('[FILTER] Rejected: application/pdf not in allowed list')
    log.push('[ERROR] 400 - { error: "Invalid file type" }')
    log.push('')
    log.push('[UPLOAD] POST /upload - file: huge-photo.jpg (15MB)')
    log.push('[LIMIT] LIMIT_FILE_SIZE exceeded')
    log.push('[ERROR] 413 - { error: "File too large" }')
    log.push('')
    log.push('[UPLOAD] POST /upload - file: avatar.png (800KB)')
    log.push('[STORAGE] Saved to: ./uploads/images/avatar-1711612800000-a1b2c3.png')
    log.push('[OK] 200')
    setResults(log)
    setActiveDemo('filters')
  }

  const buttons = [
    { id: 'single', label: 'Single/Multiple Upload', handler: simulateSingleMultiple },
    { id: 'filters', label: 'Filters & Storage', handler: simulateFiltersStorage },
  ]

  return (
    <div className="exercise-container">
      <h2>Задание 10.1: Multer</h2>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {buttons.map(b => (
          <button
            key={b.id}
            onClick={b.handler}
            style={{
              padding: '0.5rem 1rem',
              background: activeDemo === b.id ? '#00796b' : '#e0f2f1',
              color: activeDemo === b.id ? 'white' : '#00796b',
              border: '1px solid #00796b',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {b.label}
          </button>
        ))}
      </div>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre', fontSize: '0.85rem' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 10.2: Streaming Uploads — Solution
// ============================================

export function Task10_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    log.push('// === Streaming Uploads ===')
    log.push("import { createWriteStream } from 'fs'")
    log.push("import { pipeline } from 'stream/promises'")
    log.push("import busboy from 'busboy'")
    log.push('')
    log.push("app.post('/upload/stream', async (req, res) => {")
    log.push('  const bb = busboy({')
    log.push('    headers: req.headers,')
    log.push('    limits: { fileSize: 100 * 1024 * 1024 }  // 100MB')
    log.push('  })')
    log.push('')
    log.push('  let totalBytes = 0')
    log.push('  const contentLength = parseInt(req.headers["content-length"] || "0")')
    log.push('')
    log.push("  bb.on('file', (name, stream, info) => {")
    log.push('    const { filename, mimeType } = info')
    log.push('    const savePath = `./uploads/${Date.now()}-${filename}`')
    log.push('    const writeStream = createWriteStream(savePath)')
    log.push('')
    log.push('    // Track progress')
    log.push("    stream.on('data', (chunk) => {")
    log.push('      totalBytes += chunk.length')
    log.push('      const percent = Math.round((totalBytes / contentLength) * 100)')
    log.push('      console.log(`[PROGRESS] ${percent}% (${totalBytes}/${contentLength})`)')
    log.push('    })')
    log.push('')
    log.push('    stream.pipe(writeStream)')
    log.push('')
    log.push("    stream.on('limit', () => {")
    log.push("      console.log('[LIMIT] File size limit reached')")
    log.push('      writeStream.destroy()')
    log.push('      unlinkSync(savePath)')
    log.push('    })')
    log.push('  })')
    log.push('')
    log.push("  bb.on('finish', () => {")
    log.push('    res.json({ uploaded: totalBytes })')
    log.push('  })')
    log.push('')
    log.push('  req.pipe(bb)')
    log.push('})')
    log.push('')
    log.push('// === Processing Pipeline ===')
    log.push("import sharp from 'sharp'")
    log.push('')
    log.push('async function processImage(inputPath: string) {')
    log.push('  const sizes = [')
    log.push('    { name: "thumb", width: 150, height: 150 },')
    log.push('    { name: "medium", width: 600, height: 400 },')
    log.push('    { name: "large", width: 1200, height: 800 }')
    log.push('  ]')
    log.push('')
    log.push('  for (const size of sizes) {')
    log.push('    await sharp(inputPath)')
    log.push('      .resize(size.width, size.height, { fit: "cover" })')
    log.push('      .webp({ quality: 80 })')
    log.push('      .toFile(`./uploads/${size.name}-${basename(inputPath)}.webp`)')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push('// Simulation:')
    log.push('[UPLOAD] POST /upload/stream - video.mp4 (50MB)')
    log.push('[STREAM] Receiving file via busboy...')
    log.push('[PROGRESS] 10% (5.0MB/50MB)')
    log.push('[PROGRESS] 25% (12.5MB/50MB)')
    log.push('[PROGRESS] 50% (25.0MB/50MB)')
    log.push('[PROGRESS] 75% (37.5MB/50MB)')
    log.push('[PROGRESS] 100% (50.0MB/50MB)')
    log.push('[SAVED] ./uploads/1711612800000-video.mp4')
    log.push('[OK] 200 - { uploaded: 52428800 }')
    log.push('')
    log.push('// Memory usage comparison:')
    log.push('// multer.memoryStorage(): 50MB in RAM for 50MB file')
    log.push('// busboy streaming:       ~64KB buffer (stream chunk size)')
    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 10.2: Streaming Uploads</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre', fontSize: '0.85rem' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
