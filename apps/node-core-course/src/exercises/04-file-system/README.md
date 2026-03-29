# 🔥 Уровень 4: Файловая система

## 🎯 Зачем понимать fs

Модуль `fs` -- один из самых используемых в Node.js. Чтение конфигов, запись логов, обработка загруженных файлов, сборка проектов -- всё это работа с файловой системой.

## 📌 Три стиля API

```js
// 1. Callback (legacy)
const fs = require('fs')
fs.readFile('file.txt', 'utf8', (err, data) => { })

// 2. Synchronous (блокирует Event Loop!)
const data = fs.readFileSync('file.txt', 'utf8')

// 3. Promise (рекомендуется)
const fs = require('fs/promises')
const data = await fs.readFile('file.txt', 'utf8')
```

## 🔥 Чтение и запись файлов

### readFile / writeFile / appendFile

```js
// Чтение
const text = await fs.readFile('config.json', 'utf8')
const binary = await fs.readFile('image.png') // Buffer

// Запись (заменяет содержимое)
await fs.writeFile('output.txt', 'Hello World')

// Дозапись
await fs.appendFile('log.txt', `[${new Date()}] Event\n`)
```

### File Handles

```js
const fh = await fs.open('data.bin', 'r')
try {
  const stat = await fh.stat()
  const buf = Buffer.alloc(stat.size)
  await fh.read(buf, 0, stat.size, 0)
} finally {
  await fh.close()
}
```

## 📌 Модуль path

```js
const path = require('path')

path.join('src', 'utils', 'index.ts')   // "src/utils/index.ts"
path.resolve('src', 'file.ts')          // "/absolute/path/src/file.ts"
path.dirname('/a/b/file.ts')            // "/a/b"
path.basename('/a/b/file.ts')           // "file.ts"
path.basename('/a/b/file.ts', '.ts')    // "file"
path.extname('file.ts')                 // ".ts"
path.relative('/a/b', '/a/c/d')         // "../c/d"

path.parse('/home/user/file.ts')
// { root: '/', dir: '/home/user', base: 'file.ts', name: 'file', ext: '.ts' }
```

## 🔥 Операции с директориями

```js
// Чтение
const files = await fs.readdir('./src')
const entries = await fs.readdir('./src', { withFileTypes: true })
const all = await fs.readdir('./src', { recursive: true }) // Node 18.17+

// Создание
await fs.mkdir('./dist/assets', { recursive: true })

// Удаление
await fs.rm('./dist', { recursive: true, force: true })

// Рекурсивный обход
async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}
```

## 📌 Наблюдение за файлами

```js
// fs.watch — уведомления ОС (эффективно)
const watcher = fs.watch('./src', { recursive: true })
for await (const { eventType, filename } of watcher) {
  console.log(eventType, filename)
}

// fs.watchFile — polling (надёжно)
fs.watchFile('config.json', { interval: 1000 }, (curr, prev) => {
  console.log('Modified:', curr.mtime)
})
```

## ⚠️ Частые ошибки начинающих

### Ошибка 1: readFileSync в сервере

```js
// ❌ Блокирует весь сервер!
app.get('/data', (req, res) => {
  const data = fs.readFileSync('big-file.json', 'utf8')
  res.json(JSON.parse(data))
})
```

```js
// ✅ Асинхронное чтение
app.get('/data', async (req, res) => {
  const data = await fs.promises.readFile('big-file.json', 'utf8')
  res.json(JSON.parse(data))
})
```

### Ошибка 2: Конкатенация путей строками

```js
// ❌ Сломается на Windows
const filePath = dir + '/' + filename
```

```js
// ✅ Кроссплатформенно
const filePath = path.join(dir, filename)
```

### Ошибка 3: Не проверять существование перед записью

```js
// ❌ Ошибка если директория не существует
await fs.writeFile('./dist/output/result.json', data)
```

```js
// ✅ Создать директорию перед записью
await fs.mkdir(path.dirname(filePath), { recursive: true })
await fs.writeFile(filePath, data)
```

### Ошибка 4: Не закрывать file handles

```js
// ❌ Утечка дескрипторов
const fh = await fs.open('file.txt', 'r')
const data = await fh.readFile('utf8')
// fh.close() забыли!
```

```js
// ✅ try/finally
const fh = await fs.open('file.txt', 'r')
try {
  const data = await fh.readFile('utf8')
} finally {
  await fh.close()
}
```

## 💡 Best Practices

1. **Используйте `fs/promises`** вместо callback API
2. **Никогда не используйте Sync** в серверном коде (только в CLI/скриптах)
3. **Используйте `path.join()`** для конкатенации путей
4. **Всегда закрывайте file handles** через try/finally
5. **mkdir({ recursive: true })** перед записью
6. **Используйте chokidar** для production file watching
