# 🔥 Level 7: Child Processes (child_process)

## 🎯 Introduction

Node.js is a single-threaded runtime. But that doesn't mean you're limited to a single process. The `child_process` module lets you create child processes to execute system commands, run external programs, and parallelize data processing.

Working with child processes is critical for:
- Running CLI tools from Node.js applications
- Parallelizing CPU-intensive tasks
- Isolating unstable code in separate processes
- Building microservice architectures

## 🔥 Module Overview

The module provides 4 primary methods:

| Method | Shell | Buffered | IPC | When to Use |
|--------|-------|----------|-----|-------------|
| `exec` | Yes | Yes (stdout/stderr) | No | Short commands with small output |
| `execFile` | No | Yes | No | Running specific binaries |
| `spawn` | No* | No (streams) | Optional | Long processes, large output |
| `fork` | No | No (streams) | Yes (auto) | Node.js worker processes |

*`spawn` can use shell via `{ shell: true }` option

## 🔥 exec and execFile

### exec — Running Through Shell

```javascript
const { exec } = require('child_process')

exec('ls -la | grep .js', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`)
    console.error(`Exit code: ${error.code}`)
    return
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`)
  }
  console.log(`stdout: ${stdout}`)
})
```

`exec` runs commands **inside a shell** (`/bin/sh` on Unix, `cmd.exe` on Windows). This means:
- You can use pipes (`|`), variables (`$HOME`), globbing (`*.js`)
- All stdout and stderr are **buffered entirely in memory**
- Results arrive all at once in the callback

### exec Options

```javascript
exec('npm run build', {
  cwd: '/path/to/project',
  env: { ...process.env, CI: '1' },
  timeout: 30000,
  maxBuffer: 10 * 1024 * 1024,   // 10 MB (default 1 MB)
  encoding: 'utf8',
  shell: '/bin/bash',
  killSignal: 'SIGTERM',
}, callback)
```

### execFile — Without Shell

```javascript
const { execFile } = require('child_process')

execFile('/usr/bin/git', ['log', '--oneline', '-10'], (error, stdout) => {
  if (error) throw error
  console.log(stdout)
})
```

📌 **Key difference:** `execFile` launches the binary directly, without creating a shell process.

Benefits:
- **Security**: no shell injection
- **Performance**: one less process
- **Predictability**: arguments passed as array

### ⚠️ Shell Injection

```javascript
// ❌ DANGEROUS — user input in exec
const filename = req.query.file // ";rm -rf /"
exec(`cat ${filename}`)
// Executes: cat ;rm -rf /

// ✅ SAFE — execFile with argument array
execFile('cat', [filename])
// Tries to read file named ";rm -rf /"
```

### maxBuffer — Common Pitfall

```javascript
// ❌ Fails on large files
exec('cat /var/log/huge.log', (error, stdout) => {
  // Error: stdout maxBuffer length exceeded
})

// ✅ Increase buffer
exec('cat /var/log/huge.log', { maxBuffer: 50 * 1024 * 1024 }, callback)

// ✅✅ Better — use spawn (streaming)
const child = spawn('cat', ['/var/log/huge.log'])
child.stdout.pipe(process.stdout)
```

## 🔥 spawn — Streaming Processes

`spawn` is the most low-level and flexible method:

```javascript
const { spawn } = require('child_process')

const child = spawn('find', ['/var/log', '-name', '*.log', '-size', '+1M'])

child.stdout.on('data', (chunk) => {
  console.log(`stdout: ${chunk}`)
})

child.stderr.on('data', (chunk) => {
  console.error(`stderr: ${chunk}`)
})

child.on('close', (code, signal) => {
  console.log(`Process exited: code=${code}, signal=${signal}`)
})

child.on('error', (err) => {
  console.error('Failed to start process:', err)
})
```

### stdio — Stream Control

```javascript
// pipe (default)
spawn('cmd', [], { stdio: 'pipe' })

// inherit — child inherits parent's streams
spawn('npm', ['test'], { stdio: 'inherit' })

// ignore — streams disabled
spawn('daemon', [], { stdio: 'ignore' })

// Mix: stdin from parent, stdout to pipe, stderr to file
const logFile = fs.openSync('error.log', 'a')
spawn('cmd', [], { stdio: ['inherit', 'pipe', logFile] })
```

### Signals

```javascript
const child = spawn('long-running-task', [])

child.kill('SIGTERM')  // graceful
child.kill('SIGKILL')  // forced (cannot be caught)

setTimeout(() => {
  if (child.exitCode === null) {
    child.kill('SIGKILL')
  }
}, 10000)
```

### Detached Processes

```javascript
const child = spawn('node', ['server.js'], {
  detached: true,
  stdio: 'ignore',
})
child.unref()  // allow parent to exit
```

## 🔥 fork — Node.js Worker Processes

`fork` is a specialized `spawn` for Node.js scripts:

```javascript
const { fork } = require('child_process')

const child = fork('./worker.js', ['arg1'], {
  execArgv: ['--max-old-space-size=512'],
})

// Parent sends message
child.send({ type: 'task', data: [1, 2, 3] })

// Parent receives message
child.on('message', (msg) => {
  console.log('Result:', msg.result)
})
```

### IPC Communication

```javascript
// worker.js
process.on('message', (msg) => {
  if (msg.type === 'task') {
    const result = msg.data.reduce((a, b) => a + b, 0)
    process.send({ type: 'result', result })
  }
})
```

📌 IPC uses JSON serialization. Functions, native objects, and circular references cannot be transmitted.

## ⚠️ Common Beginner Mistakes

### Mistake 1: exec for Large Output

```javascript
// ❌ Bad — buffers everything
exec('mysqldump mydb', (error, stdout) => {
  fs.writeFileSync('backup.sql', stdout)
})

// ✅ Good — streaming
const child = spawn('mysqldump', ['mydb'])
child.stdout.pipe(fs.createWriteStream('backup.sql'))
```

### Mistake 2: Ignoring stderr

```javascript
// ❌ Bad
const child = spawn('npm', ['install'])
child.stdout.on('data', (d) => console.log(d.toString()))

// ✅ Good
child.stderr.on('data', (d) => console.error(d.toString()))
child.on('close', (code) => {
  if (code !== 0) console.error(`npm install failed with code ${code}`)
})
```

### Mistake 3: Process Leaks

```javascript
// ❌ Bad — zombie process on crash
const child = spawn('server', [])

// ✅ Good — cleanup on exit
process.on('exit', () => child.kill())
process.on('SIGTERM', () => {
  child.kill()
  process.exit(0)
})
```

## 💡 Best Practices

1. **Use `execFile` over `exec`** when shell features aren't needed
2. **Always handle the `error` event** on spawn/fork
3. **Use `spawn` for large output** — streams don't consume memory
4. **Kill child processes on exit** — prevent zombie processes
5. **Limit parallel processes** — each fork uses ~30 MB RAM
6. **Validate user input** before passing to exec/spawn
7. **Use AbortController** (Node.js 16+) for cancellation
