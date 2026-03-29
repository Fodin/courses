# 🔥 Level 9: Cluster, Process and OS

## 🎯 Introduction

The `process` object is the heart of a Node.js application. Through it you manage environment, arguments, memory, and process lifecycle. The `os` module provides system information, and `cluster` allows scaling HTTP servers across all CPU cores.

## 🔥 The process Object

### process.env

```javascript
const port = Number(process.env.PORT) || 3000
// All values are strings!
```

### process.argv

```javascript
// $ node app.js --port 3000
process.argv // ['/usr/bin/node', '/app/app.js', '--port', '3000']
```

### process.memoryUsage()

Returns rss, heapTotal, heapUsed, external, arrayBuffers in bytes.

### process.exit vs exitCode

```javascript
process.exit(1)     // Hard exit — async ops may not complete
process.exitCode = 1 // Soft — Node.js exits after event loop drains
```

## 🔥 Signals and Graceful Shutdown

| Signal | Description | Catchable |
|--------|-------------|-----------|
| SIGINT | Ctrl+C | Yes |
| SIGTERM | Termination request | Yes |
| SIGKILL | Force kill | No |

```javascript
async function gracefulShutdown(signal) {
  const timeout = setTimeout(() => process.exit(1), 30000)
  timeout.unref()
  await server.close()
  await db.end()
  process.exit(0)
}
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
```

## 🔥 OS Module

```javascript
os.cpus().length       // CPU core count
os.totalmem()          // total RAM bytes
os.freemem()           // free RAM bytes
os.platform()          // 'linux', 'darwin', 'win32'
os.networkInterfaces() // network interfaces with IPs
os.loadavg()           // load average [1m, 5m, 15m]
```

## 🔥 Cluster Module

```javascript
if (cluster.isPrimary) {
  for (let i = 0; i < os.cpus().length; i++) cluster.fork()
  cluster.on('exit', (worker) => cluster.fork()) // auto-restart
} else {
  http.createServer(handler).listen(3000) // shared port
}
```

### Zero-Downtime Restart

Fork new worker, wait for it to listen, disconnect old worker, wait for exit. Repeat for each worker sequentially.

## ⚠️ Common Beginner Mistakes

1. **process.exit() instead of exitCode** — hard exit may drop async ops
2. **No timeout in graceful shutdown** — process may hang forever
3. **cluster.isMaster** — deprecated since Node.js 16, use isPrimary
4. **Storing state in workers** — use Redis/DB instead, workers don't share memory

## 💡 Best Practices

1. Always handle SIGTERM and SIGINT with graceful shutdown
2. Add force-exit timeout to shutdown handlers
3. Use os.availableParallelism() in containers
4. Use external state (Redis) with cluster
5. Monitor process.memoryUsage() for leak detection
