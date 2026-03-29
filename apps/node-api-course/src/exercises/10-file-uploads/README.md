# 🔥 Уровень 10: Загрузка файлов

## 🎯 Два подхода

1. **Multer** -- буферизованная загрузка с middleware для Express (memory/disk storage)
2. **Streaming** -- потоковая загрузка больших файлов через busboy (минимальное потребление RAM)

## 🔥 Как работает multipart/form-data

Когда браузер отправляет форму с файлом, Content-Type: `multipart/form-data; boundary=----WebKitFormBoundary...`

```
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="avatar"
Content-Type: image/jpeg

<бинарные данные файла>
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="name"

Alice
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

Express не парсит multipart по умолчанию -- нужен Multer или busboy.

## 🔥 Multer: Буферизованная загрузка

### Memory Storage

```typescript
import multer from 'multer'

const upload = multer({
  storage: multer.memoryStorage(),  // Файл в RAM (req.file.buffer)
  limits: { fileSize: 5 * 1024 * 1024 }  // 5 МБ
})

// Один файл
app.post('/avatar', upload.single('avatar'), (req, res) => {
  const file = req.file
  // file.fieldname, file.originalname, file.mimetype
  // file.size, file.buffer (Buffer)
  res.json({ size: file.size })
})
```

### Disk Storage

```typescript
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `./uploads/${req.params.type}`
    mkdirSync(dir, { recursive: true })
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${randomBytes(6).toString('hex')}`
    const ext = extname(file.originalname)
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`)
  }
})
```

### Несколько файлов

```typescript
// Одно поле, несколько файлов
app.post('/gallery', upload.array('photos', 10), handler)

// Несколько полей
app.post('/product', upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'images', maxCount: 5 }
]), handler)
```

### File Filter (валидация типа)

```typescript
const imageFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname))
  }
}

const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,  // 10 МБ
    files: 5,                     // Макс. файлов
    fieldNameSize: 100,
    fieldSize: 1024
  }
})
```

### Обработка ошибок Multer

```typescript
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(413).json({ error: 'File too large' })
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({ error: 'Too many files' })
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({ error: 'Invalid file type' })
    }
  }
  next(err)
})
```

## 🔥 Streaming: Большие файлы

### Зачем стриминг

| Подход | RAM при 100 МБ файле |
|---|---|
| multer.memoryStorage() | 100 МБ |
| multer.diskStorage() | ~100 МБ (буферизация) |
| busboy streaming | ~64 КБ (размер chunk) |

### Busboy

```typescript
import busboy from 'busboy'
import { createWriteStream } from 'fs'

app.post('/upload/stream', (req, res) => {
  const bb = busboy({
    headers: req.headers,
    limits: { fileSize: 100 * 1024 * 1024 }
  })

  let totalBytes = 0
  const contentLength = parseInt(req.headers['content-length'] || '0')

  bb.on('file', (name, stream, info) => {
    const { filename, mimeType } = info
    const savePath = `./uploads/${Date.now()}-${filename}`
    const writeStream = createWriteStream(savePath)

    // Отслеживание прогресса
    stream.on('data', (chunk) => {
      totalBytes += chunk.length
      const percent = Math.round((totalBytes / contentLength) * 100)
      console.log(`[PROGRESS] ${percent}%`)
    })

    stream.pipe(writeStream)

    // Лимит превышен
    stream.on('limit', () => {
      writeStream.destroy()
      unlinkSync(savePath)
    })
  })

  bb.on('finish', () => {
    res.json({ uploaded: totalBytes })
  })

  req.pipe(bb)
})
```

### Обработка изображений через stream

```typescript
import sharp from 'sharp'

async function processImage(inputPath: string) {
  const sizes = [
    { name: 'thumb', width: 150, height: 150 },
    { name: 'medium', width: 600, height: 400 },
    { name: 'large', width: 1200, height: 800 }
  ]

  for (const size of sizes) {
    await sharp(inputPath)
      .resize(size.width, size.height, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(`./uploads/${size.name}-${basename(inputPath)}.webp`)
  }
}
```

## 🔥 Безопасность загрузки файлов

### Валидация типа файла

```typescript
// ❌ Проверка только по расширению -- можно подделать!
if (file.originalname.endsWith('.jpg')) { /* ... */ }

// ✅ Проверка magic bytes (сигнатуры файла)
import { fileTypeFromBuffer } from 'file-type'

const type = await fileTypeFromBuffer(file.buffer)
if (!type || !['image/jpeg', 'image/png'].includes(type.mime)) {
  throw new Error('Invalid file type')
}
```

### Ограничения размера

```typescript
// На уровне Multer
limits: { fileSize: 10 * 1024 * 1024 }

// На уровне Nginx
client_max_body_size 20m;

// На уровне Express
app.use(express.json({ limit: '1mb' }))
```

### Безопасное хранение

```typescript
// ❌ Оригинальное имя файла -- может содержать path traversal
const savePath = `./uploads/${file.originalname}` // ../../../etc/passwd

// ✅ Сгенерированное имя
const safeName = `${randomUUID()}${extname(file.originalname)}`
const savePath = `./uploads/${safeName}`
```

## ⚠️ Частые ошибки новичков

### Ошибка 1: Memory storage для больших файлов

```typescript
// ❌ 500 МБ видео в RAM -- OOM!
const upload = multer({ storage: multer.memoryStorage() })
app.post('/video', upload.single('video'), handler)

// ✅ Streaming для больших файлов
// busboy + pipe -> createWriteStream
```

### Ошибка 2: Доверие originalname

```typescript
// ❌ Path traversal атака
const name = req.file.originalname  // "../../etc/passwd"
fs.writeFileSync(`./uploads/${name}`, data)

// ✅ Всегда генерируйте имя
const name = `${randomUUID()}.${ext}`
```

### Ошибка 3: Нет лимитов

```typescript
// ❌ Без лимитов -- DoS через огромные файлы
const upload = multer({ storage: multer.memoryStorage() })

// ✅ Всегда устанавливайте лимиты
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 5 }
})
```

### Ошибка 4: Проверка только расширения

```typescript
// ❌ Проверка расширения -- легко подделать
if (file.originalname.endsWith('.jpg')) { accept() }

// ✅ Проверка magic bytes
const type = await fileTypeFromBuffer(buffer)
```

## 💡 Best Practices

1. **Memory storage** только для маленьких файлов (<5 МБ) и обработки в памяти
2. **Streaming** для файлов >10 МБ -- busboy + pipe
3. **Лимиты** -- всегда: fileSize, files, на уровне Multer, Express и Nginx
4. **Валидация** -- magic bytes, не расширение файла
5. **Имена файлов** -- генерируйте UUID, никогда не используйте originalname как путь
6. **Обработка изображений** -- sharp для resize/convert в фоне
7. **Антивирус** -- сканируйте загруженные файлы в production
