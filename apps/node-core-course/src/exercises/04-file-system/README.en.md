# 🔥 Level 4: File System

## 🎯 Why Understanding fs Matters

The `fs` module is one of the most used in Node.js. Config reading, log writing, file uploads, build tools -- all involve the file system.

## 📌 Three API Styles

Callback (legacy), Synchronous (blocks Event Loop!), Promise (recommended via `fs/promises`).

## 🔥 Reading and Writing

```js
const data = await fs.readFile('file.txt', 'utf8')
await fs.writeFile('output.txt', 'content')
await fs.appendFile('log.txt', 'entry\n')
```

## 📌 Path Module

`path.join()`, `path.resolve()`, `path.dirname()`, `path.basename()`, `path.extname()`, `path.parse()`.

## 🔥 Directory Operations

`readdir()` with `{ withFileTypes: true, recursive: true }`, `mkdir()`, `rm()`.

## 📌 File Watching

`fs.watch()` (OS notifications, efficient) vs `fs.watchFile()` (polling, reliable). Use chokidar for production.

## ⚠️ Common Mistakes

1. readFileSync in server code
2. String path concatenation (use path.join)
3. Not creating directories before write
4. Not closing file handles

## 💡 Best Practices

1. Use `fs/promises`
2. Never Sync in server code
3. Use `path.join()` for paths
4. Always close file handles
5. `mkdir({ recursive: true })` before write
