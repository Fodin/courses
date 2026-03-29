import { useState } from 'react'

// ============================================
// Задание 4.1: Read/Write — Решение
// ============================================

export function Task4_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== File System: Read/Write Operations ===')
    log.push('')
    log.push('Node.js fs module has 3 API styles:')
    log.push('  1. Callback (original) — fs.readFile(path, cb)')
    log.push('  2. Synchronous         — fs.readFileSync(path)')
    log.push('  3. Promise             — fs.promises.readFile(path)')
    log.push('')
    log.push('=== Reading Files ===')
    log.push('')
    log.push('// Callback style')
    log.push('const fs = require("fs")')
    log.push('fs.readFile("file.txt", "utf8", (err, data) => {')
    log.push('  if (err) throw err')
    log.push('  console.log(data)')
    log.push('})')
    log.push('')
    log.push('// Synchronous (blocks Event Loop!)')
    log.push('const data = fs.readFileSync("file.txt", "utf8")')
    log.push('')
    log.push('// Promise (recommended)')
    log.push('const fs = require("fs/promises")')
    log.push('const data = await fs.readFile("file.txt", "utf8")')
    log.push('')
    log.push('// Without encoding → returns Buffer')
    log.push('const buf = await fs.readFile("image.png")')
    log.push('// With encoding → returns string')
    log.push('const str = await fs.readFile("file.txt", "utf8")')

    log.push('')
    log.push('=== Writing Files ===')
    log.push('')
    log.push('// writeFile — replace entire content')
    log.push('await fs.writeFile("file.txt", "Hello World")')
    log.push('')
    log.push('// appendFile — add to end')
    log.push('await fs.appendFile("log.txt", "New line\\n")')
    log.push('')
    log.push('// writeFile with options')
    log.push('await fs.writeFile("file.txt", data, {')
    log.push('  encoding: "utf8",')
    log.push('  mode: 0o644,       // Unix permissions')
    log.push('  flag: "w"          // w=write, a=append, wx=exclusive')
    log.push('})')

    log.push('')
    log.push('=== File Flags ===')
    log.push('')
    log.push('  "r"  — read (error if not exists)')
    log.push('  "r+" — read + write')
    log.push('  "w"  — write (create/truncate)')
    log.push('  "w+" — write + read (create/truncate)')
    log.push('  "a"  — append (create if needed)')
    log.push('  "a+" — append + read')
    log.push('  "wx" — exclusive write (error if exists)')

    log.push('')
    log.push('=== File Handles (Low-level) ===')
    log.push('')
    log.push('const fh = await fs.open("file.txt", "r")')
    log.push('try {')
    log.push('  const { bytesRead, buffer } = await fh.read()')
    log.push('  const stat = await fh.stat()')
    log.push('  console.log("Size:", stat.size)')
    log.push('} finally {')
    log.push('  await fh.close() // Always close!')
    log.push('}')
    log.push('')
    log.push('// Or using Symbol.asyncDispose (Node.js 20+)')
    log.push('await using fh = await fs.open("file.txt", "r")')
    log.push('// Automatically closed when block exits')

    // Simulation
    log.push('')
    log.push('=== Simulation: File Operations ===')

    const virtualFS: Record<string, string> = {}

    // writeFile
    virtualFS['config.json'] = JSON.stringify({ port: 3000, host: 'localhost' }, null, 2)
    log.push('')
    log.push('writeFile("config.json", ...)')
    log.push(`  Written: ${virtualFS['config.json'].length} bytes`)

    // readFile
    const config = JSON.parse(virtualFS['config.json'])
    log.push(`  Read back: port=${config.port}, host=${config.host}`)

    // appendFile
    virtualFS['app.log'] = ''
    virtualFS['app.log'] += '[2024-01-01] Server started\n'
    virtualFS['app.log'] += '[2024-01-01] Request: GET /api\n'
    virtualFS['app.log'] += '[2024-01-01] Request: POST /data\n'
    log.push('')
    log.push('appendFile("app.log", ...)')
    log.push(`  Log lines: ${virtualFS['app.log'].split('\n').filter(Boolean).length}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.1: Read/Write</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 4.2: Path Module — Решение
// ============================================

export function Task4_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Path Module ===')
    log.push('')
    log.push('const path = require("path")')
    log.push('')

    // Simulate path operations
    const simulatePath = {
      join: (...parts: string[]) => parts.filter(Boolean).join('/').replace(/\/+/g, '/'),
      resolve: (...parts: string[]) => '/home/user/' + parts.filter(Boolean).join('/').replace(/\/+/g, '/'),
      dirname: (p: string) => p.split('/').slice(0, -1).join('/') || '.',
      basename: (p: string, ext?: string) => {
        const base = p.split('/').pop() || ''
        return ext && base.endsWith(ext) ? base.slice(0, -ext.length) : base
      },
      extname: (p: string) => {
        const base = p.split('/').pop() || ''
        const dot = base.lastIndexOf('.')
        return dot > 0 ? base.slice(dot) : ''
      },
      parse: (p: string) => ({
        root: p.startsWith('/') ? '/' : '',
        dir: p.split('/').slice(0, -1).join('/'),
        base: p.split('/').pop() || '',
        name: (p.split('/').pop() || '').replace(/\.[^.]+$/, ''),
        ext: (() => { const b = p.split('/').pop() || ''; const d = b.lastIndexOf('.'); return d > 0 ? b.slice(d) : '' })()
      })
    }

    log.push('=== path.join() — Safe concatenation ===')
    log.push(`  path.join("/users", "admin", "docs")`)
    log.push(`    → "${simulatePath.join('/users', 'admin', 'docs')}"`)
    log.push(`  path.join("/users", "../admin", "docs")`)
    log.push(`    → "/admin/docs" (resolves ..)`)
    log.push('')

    log.push('=== path.resolve() — Absolute path ===')
    log.push(`  path.resolve("src", "utils.js")`)
    log.push(`    → "${simulatePath.resolve('src', 'utils.js')}"`)
    log.push(`  path.resolve("/tmp", "file.txt")`)
    log.push(`    → "/tmp/file.txt" (absolute path wins)`)
    log.push('')

    const testPath = '/home/user/project/src/utils/helpers.ts'
    log.push(`=== Parsing: "${testPath}" ===`)
    log.push('')

    const parsed = simulatePath.parse(testPath)
    log.push(`  path.dirname()  → "${simulatePath.dirname(testPath)}"`)
    log.push(`  path.basename() → "${simulatePath.basename(testPath)}"`)
    log.push(`  path.basename(p, ".ts") → "${simulatePath.basename(testPath, '.ts')}"`)
    log.push(`  path.extname()  → "${simulatePath.extname(testPath)}"`)
    log.push('')
    log.push('  path.parse():')
    log.push(`    root: "${parsed.root}"`)
    log.push(`    dir:  "${parsed.dir}"`)
    log.push(`    base: "${parsed.base}"`)
    log.push(`    name: "${parsed.name}"`)
    log.push(`    ext:  "${parsed.ext}"`)

    log.push('')
    log.push('=== path.relative() ===')
    log.push('  path.relative("/data/users", "/data/files/docs")')
    log.push('    → "../files/docs"')
    log.push('')

    log.push('=== Cross-platform ===')
    log.push('  path.sep         → "/" (POSIX) or "\\\\" (Windows)')
    log.push('  path.delimiter   → ":" (POSIX) or ";" (Windows)')
    log.push('  path.posix.join  → always uses /')
    log.push('  path.win32.join  → always uses \\\\')
    log.push('')
    log.push('⚠️ Always use path.join() instead of string concatenation!')
    log.push('   "src" + "/" + "file.js" → path.join("src", "file.js")')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.2: Path Module</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 4.3: Directory Operations — Решение
// ============================================

export function Task4_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Directory Operations ===')
    log.push('')
    log.push('=== Reading Directories ===')
    log.push('')
    log.push('// Basic readdir')
    log.push('const files = await fs.readdir("./src")')
    log.push('// ["index.ts", "utils", "components"]')
    log.push('')
    log.push('// With file types (withFileTypes)')
    log.push('const entries = await fs.readdir("./src", { withFileTypes: true })')
    log.push('entries.forEach(e => {')
    log.push('  console.log(e.name, e.isDirectory() ? "DIR" : "FILE")')
    log.push('})')
    log.push('')
    log.push('// Recursive readdir (Node.js 18.17+)')
    log.push('const allFiles = await fs.readdir("./src", { recursive: true })')
    log.push('')

    // Simulate directory tree
    log.push('=== Simulation: Directory Tree ===')
    const tree = {
      'src': {
        'index.ts': 'file',
        'utils': {
          'helpers.ts': 'file',
          'format.ts': 'file',
        },
        'components': {
          'Button.tsx': 'file',
          'Input.tsx': 'file',
          'styles': {
            'button.css': 'file',
          }
        }
      }
    }

    function printTree(obj: Record<string, unknown>, prefix: string = '', isLast: boolean = true) {
      const entries = Object.entries(obj)
      entries.forEach(([name, value], i) => {
        const last = i === entries.length - 1
        const connector = last ? '└── ' : '├── '
        const isDir = typeof value === 'object'
        log.push(`${prefix}${connector}${name}${isDir ? '/' : ''}`)
        if (isDir) {
          const newPrefix = prefix + (last ? '    ' : '│   ')
          printTree(value as Record<string, unknown>, newPrefix, last)
        }
      })
    }

    printTree(tree)

    log.push('')
    log.push('=== Creating Directories ===')
    log.push('')
    log.push('// Create single directory')
    log.push('await fs.mkdir("./dist")')
    log.push('')
    log.push('// Create nested directories')
    log.push('await fs.mkdir("./dist/assets/images", { recursive: true })')
    log.push('')
    log.push('// mkdtemp — create temp directory')
    log.push('const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "app-"))')
    log.push('// → "/tmp/app-abc123"')

    log.push('')
    log.push('=== Removing ===')
    log.push('')
    log.push('// Remove file')
    log.push('await fs.unlink("./file.txt")')
    log.push('')
    log.push('// Remove directory (must be empty)')
    log.push('await fs.rmdir("./empty-dir")')
    log.push('')
    log.push('// Remove recursively (Node.js 14.14+)')
    log.push('await fs.rm("./dist", { recursive: true, force: true })')
    log.push('')
    log.push('// Glob (Node.js 22+)')
    log.push('const { glob } = require("fs/promises")')
    log.push('for await (const file of glob("**/*.ts")) {')
    log.push('  console.log(file)')
    log.push('}')

    log.push('')
    log.push('=== Recursive Traversal Pattern ===')
    log.push('')
    log.push('async function* walkDir(dir) {')
    log.push('  const entries = await fs.readdir(dir, { withFileTypes: true })')
    log.push('  for (const entry of entries) {')
    log.push('    const fullPath = path.join(dir, entry.name)')
    log.push('    if (entry.isDirectory()) {')
    log.push('      yield* walkDir(fullPath)')
    log.push('    } else {')
    log.push('      yield fullPath')
    log.push('    }')
    log.push('  }')
    log.push('}')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.3: Directory Operations</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 4.4: File Watching — Решение
// ============================================

export function Task4_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== File Watching ===')
    log.push('')
    log.push('=== fs.watch() (recommended) ===')
    log.push('')
    log.push('const watcher = fs.watch("./src", { recursive: true })')
    log.push('watcher.on("change", (eventType, filename) => {')
    log.push('  console.log(eventType, filename)')
    log.push('  // eventType: "rename" or "change"')
    log.push('})')
    log.push('watcher.close() // stop watching')
    log.push('')
    log.push('// Async iterator (Node.js 18.11+)')
    log.push('const watcher = fs.watch("./src")')
    log.push('for await (const event of watcher) {')
    log.push('  console.log(event.eventType, event.filename)')
    log.push('}')

    log.push('')
    log.push('=== fs.watchFile() (polling) ===')
    log.push('')
    log.push('fs.watchFile("config.json", { interval: 1000 }, (curr, prev) => {')
    log.push('  console.log("Modified:", curr.mtime)')
    log.push('  console.log("Previous:", prev.mtime)')
    log.push('  console.log("Size changed:", prev.size, "→", curr.size)')
    log.push('})')
    log.push('fs.unwatchFile("config.json") // stop watching')
    log.push('')
    log.push('⚠️ watchFile uses POLLING — less efficient than watch()')
    log.push('   Use only when watch() doesn\'t work (network drives)')

    log.push('')
    log.push('=== fs.watch() vs fs.watchFile() ===')
    log.push('')
    log.push('┌─────────────┬────────────────────┬───────────────────┐')
    log.push('│             │ fs.watch()          │ fs.watchFile()    │')
    log.push('├─────────────┼────────────────────┼───────────────────┤')
    log.push('│ Mechanism   │ OS notifications    │ Polling (stat)    │')
    log.push('│ Efficiency  │ High               │ Low               │')
    log.push('│ Recursive   │ macOS/Win: yes     │ N/A               │')
    log.push('│ Reliability │ Platform-dependent │ Always works      │')
    log.push('│ Network FS  │ May not work       │ Works             │')
    log.push('└─────────────┴────────────────────┴───────────────────┘')

    log.push('')
    log.push('=== Common Issues with fs.watch() ===')
    log.push('')
    log.push('1. Duplicate events — editors save with temp file + rename')
    log.push('2. Missing filename — some platforms don\'t provide it')
    log.push('3. Recursive not on Linux — need chokidar or manual')
    log.push('')
    log.push('=== Debouncing File Changes ===')
    log.push('')
    log.push('// Problem: multiple events for single save')
    log.push('let timeout')
    log.push('watcher.on("change", (event, filename) => {')
    log.push('  clearTimeout(timeout)')
    log.push('  timeout = setTimeout(() => {')
    log.push('    console.log("File changed:", filename)')
    log.push('  }, 100) // debounce 100ms')
    log.push('})')

    log.push('')
    log.push('=== Chokidar (Production Library) ===')
    log.push('')
    log.push('const chokidar = require("chokidar")')
    log.push('const watcher = chokidar.watch("./src", {')
    log.push('  ignored: /node_modules/,')
    log.push('  persistent: true,')
    log.push('  ignoreInitial: true')
    log.push('})')
    log.push('')
    log.push('watcher')
    log.push('  .on("add", path => console.log("Added:", path))')
    log.push('  .on("change", path => console.log("Changed:", path))')
    log.push('  .on("unlink", path => console.log("Removed:", path))')
    log.push('  .on("addDir", path => console.log("Dir added:", path))')
    log.push('  .on("unlinkDir", path => console.log("Dir removed:", path))')
    log.push('  .on("ready", () => console.log("Watching..."))')

    // Simulate file watch events
    log.push('')
    log.push('=== Simulation: File Watch Events ===')
    const events = [
      { time: '00:01', type: 'change', file: 'src/index.ts' },
      { time: '00:01', type: 'change', file: 'src/index.ts' },
      { time: '00:03', type: 'rename', file: 'src/old.ts' },
      { time: '00:03', type: 'rename', file: 'src/new.ts' },
      { time: '00:05', type: 'change', file: 'src/utils.ts' },
    ]

    log.push('Raw events (note duplicates):')
    events.forEach(e => log.push(`  [${e.time}] ${e.type}: ${e.file}`))

    log.push('')
    log.push('After debouncing:')
    log.push('  [00:01] change: src/index.ts (1 event)')
    log.push('  [00:03] rename: src/old.ts → src/new.ts')
    log.push('  [00:05] change: src/utils.ts')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.4: File Watching</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
