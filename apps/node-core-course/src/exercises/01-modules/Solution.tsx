import { useState } from 'react'

// ============================================
// Задание 1.1: CommonJS — Решение
// ============================================

export function Task1_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== CommonJS Module System ===')
    log.push('')
    log.push('📌 Core concepts:')
    log.push('  - require() — synchronous module loading')
    log.push('  - module.exports — what the module exposes')
    log.push('  - exports — shorthand reference to module.exports')
    log.push('')
    log.push('=== How require() Works ===')
    log.push('')
    log.push('1. Resolve: find the file path')
    log.push('   require("fs")        → built-in module')
    log.push('   require("./utils")   → relative path → ./utils.js')
    log.push('   require("lodash")    → node_modules lookup')
    log.push('')
    log.push('2. Load: read file contents')
    log.push('   .js  → parsed as JavaScript')
    log.push('   .json → parsed with JSON.parse()')
    log.push('   .node → loaded as C++ addon')
    log.push('')
    log.push('3. Wrap: Node.js wraps code in a function')
    log.push('   (function(exports, require, module, __filename, __dirname) {')
    log.push('     // your module code here')
    log.push('   });')
    log.push('')
    log.push('4. Execute: run the wrapped function')
    log.push('5. Cache: store in require.cache')
    log.push('')
    log.push('=== Module Caching ===')
    log.push('')
    log.push('// counter.js')
    log.push('let count = 0')
    log.push('module.exports = {')
    log.push('  increment: () => ++count,')
    log.push('  getCount: () => count')
    log.push('}')
    log.push('')
    log.push('// app.js')
    log.push('const c1 = require("./counter")')
    log.push('const c2 = require("./counter") // same cached instance!')
    log.push('c1.increment()')
    log.push('console.log(c2.getCount()) // 1 — same object!')

    // Simulate module caching
    log.push('')
    log.push('=== Simulation: Module Caching ===')
    const moduleCache: Record<string, { count: number }> = {}

    function simulateRequire(path: string) {
      if (moduleCache[path]) {
        log.push(`  require("${path}") → cache HIT`)
        return moduleCache[path]
      }
      log.push(`  require("${path}") → cache MISS, loading...`)
      const mod = { count: 0 }
      moduleCache[path] = mod
      return mod
    }

    const m1 = simulateRequire('./counter')
    const m2 = simulateRequire('./counter')
    m1.count++
    log.push(`  m1.count = ${m1.count}`)
    log.push(`  m2.count = ${m2.count} (same reference!)`)
    log.push(`  m1 === m2: ${m1 === m2}`)
    log.push('')
    log.push('=== exports vs module.exports ===')
    log.push('')
    log.push('// ✅ This works:')
    log.push('exports.hello = () => "world"')
    log.push('')
    log.push('// ❌ This does NOT work:')
    log.push('exports = { hello: () => "world" }')
    log.push('// Reassigning exports breaks the reference to module.exports')
    log.push('')
    log.push('// ✅ This works (use module.exports for full replacement):')
    log.push('module.exports = { hello: () => "world" }')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.1: CommonJS</h2>
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
// Задание 1.2: ESM — Решение
// ============================================

export function Task1_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== ECMAScript Modules (ESM) ===')
    log.push('')
    log.push('📌 Key Differences from CommonJS:')
    log.push('  - Static imports (analyzed at parse time)')
    log.push('  - Asynchronous loading')
    log.push('  - Live bindings (not copies)')
    log.push('  - Strict mode by default')
    log.push('  - No __filename, __dirname, require, module, exports')
    log.push('')
    log.push('=== Enabling ESM ===')
    log.push('')
    log.push('Option 1: "type": "module" in package.json')
    log.push('  → All .js files treated as ESM')
    log.push('  → Use .cjs for CommonJS files')
    log.push('')
    log.push('Option 2: Use .mjs extension')
    log.push('  → File always treated as ESM regardless of package.json')
    log.push('')
    log.push('=== Import/Export Syntax ===')
    log.push('')
    log.push('// Named exports')
    log.push('export const name = "Node"')
    log.push('export function greet() { return "Hello" }')
    log.push('')
    log.push('// Default export')
    log.push('export default class Server { }')
    log.push('')
    log.push('// Named imports')
    log.push('import { name, greet } from "./module.mjs"')
    log.push('')
    log.push('// Default import')
    log.push('import Server from "./module.mjs"')
    log.push('')
    log.push('// Namespace import')
    log.push('import * as mod from "./module.mjs"')
    log.push('')
    log.push('=== Top-Level Await ===')
    log.push('')
    log.push('// ESM supports top-level await (no async wrapper needed)')
    log.push('const data = await fetch("https://api.example.com/data")')
    log.push('const config = await fs.promises.readFile("config.json", "utf8")')
    log.push('')
    log.push('=== Live Bindings ===')
    log.push('')
    log.push('// counter.mjs')
    log.push('export let count = 0')
    log.push('export function increment() { count++ }')
    log.push('')
    log.push('// app.mjs')
    log.push('import { count, increment } from "./counter.mjs"')
    log.push('console.log(count) // 0')
    log.push('increment()')
    log.push('console.log(count) // 1 ← live binding!')

    // Simulate live bindings
    log.push('')
    log.push('=== Simulation: Live Bindings vs CJS Copies ===')
    log.push('')

    // CJS simulation (copies)
    let cjsExportedCount = 0
    const cjsCopy = cjsExportedCount // snapshot/copy
    cjsExportedCount++
    log.push('CommonJS (copies):')
    log.push(`  Exported count = ${cjsExportedCount}`)
    log.push(`  Imported copy = ${cjsCopy} ← stale!`)

    // ESM simulation (live bindings via object)
    const esmModule = { count: 0 }
    const esmBinding = esmModule // reference
    esmModule.count++
    log.push('')
    log.push('ESM (live bindings):')
    log.push(`  Exported count = ${esmModule.count}`)
    log.push(`  Imported binding = ${esmBinding.count} ← up to date!`)
    log.push('')
    log.push('=== __filename / __dirname in ESM ===')
    log.push('')
    log.push('import { fileURLToPath } from "url"')
    log.push('import { dirname } from "path"')
    log.push('')
    log.push('const __filename = fileURLToPath(import.meta.url)')
    log.push('const __dirname = dirname(__filename)')
    log.push('')
    log.push('// Node.js 21.2+: import.meta.dirname and import.meta.filename')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.2: ESM</h2>
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
// Задание 1.3: Circular Dependencies — Решение
// ============================================

export function Task1_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Circular Dependencies ===')
    log.push('')
    log.push('A circular dependency occurs when module A requires module B,')
    log.push('and module B requires module A (directly or transitively).')
    log.push('')
    log.push('=== CommonJS Circular Dependencies ===')
    log.push('')
    log.push('// a.js')
    log.push('console.log("a: loading")')
    log.push('exports.loaded = false')
    log.push('const b = require("./b")')
    log.push('console.log("a: b.loaded =", b.loaded)')
    log.push('exports.loaded = true')
    log.push('console.log("a: done")')
    log.push('')
    log.push('// b.js')
    log.push('console.log("b: loading")')
    log.push('exports.loaded = false')
    log.push('const a = require("./a")')
    log.push('console.log("b: a.loaded =", a.loaded) // false! Partial export!')
    log.push('exports.loaded = true')
    log.push('console.log("b: done")')
    log.push('')
    log.push('// main.js')
    log.push('require("./a")')

    // Simulate circular dependency
    log.push('')
    log.push('=== Simulation ===')

    interface ModState {
      loaded: boolean
      executing: boolean
    }

    const cache: Record<string, ModState> = {}
    const output: string[] = []

    function simulateRequireA() {
      if (cache['a']) {
        output.push('  require("a") → returning cached (partial)')
        return cache['a']
      }
      cache['a'] = { loaded: false, executing: true }
      output.push('  a.js: start executing')
      output.push('  a.js: exports.loaded = false')

      // a requires b
      output.push('  a.js: require("./b") →')
      const b = simulateRequireB()
      output.push(`  a.js: b.loaded = ${b.loaded}`)
      cache['a'].loaded = true
      output.push('  a.js: exports.loaded = true')
      output.push('  a.js: done')
      return cache['a']
    }

    function simulateRequireB() {
      if (cache['b']) {
        output.push('  require("b") → returning cached (partial)')
        return cache['b']
      }
      cache['b'] = { loaded: false, executing: true }
      output.push('    b.js: start executing')
      output.push('    b.js: exports.loaded = false')

      // b requires a — but a is partially loaded!
      output.push('    b.js: require("./a") →')
      const a = simulateRequireA()
      output.push(`    b.js: a.loaded = ${a.loaded} ← PARTIAL! Not yet true!`)
      cache['b'].loaded = true
      output.push('    b.js: exports.loaded = true')
      output.push('    b.js: done')
      return cache['b']
    }

    simulateRequireA()
    output.forEach(line => log.push(line))

    log.push('')
    log.push('=== Resolution Strategies ===')
    log.push('')
    log.push('1. Restructure: extract shared code into a third module')
    log.push('   a.js → shared.js ← b.js')
    log.push('')
    log.push('2. Lazy require: move require() inside a function')
    log.push('   function getB() { return require("./b") }')
    log.push('')
    log.push('3. Dependency injection: pass dependencies as arguments')
    log.push('   module.exports = function(dep) { ... }')
    log.push('')
    log.push('4. ESM handles circular deps better with live bindings')
    log.push('   (but still dangerous for init-time side effects)')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.3: Circular Dependencies</h2>
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
// Задание 1.4: Package.json exports — Решение
// ============================================

export function Task1_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Package.json "exports" Field ===')
    log.push('')
    log.push('The "exports" field (Node.js 12.7+) controls what can be')
    log.push('imported from your package and how.')
    log.push('')
    log.push('=== Basic exports map ===')
    log.push('')
    log.push('{')
    log.push('  "name": "my-lib",')
    log.push('  "exports": {')
    log.push('    ".": "./dist/index.js",')
    log.push('    "./utils": "./dist/utils.js",')
    log.push('    "./types": "./dist/types.d.ts"')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push('// Consumer can:')
    log.push('import lib from "my-lib"         // → ./dist/index.js')
    log.push('import utils from "my-lib/utils"  // → ./dist/utils.js')
    log.push('')
    log.push('// Consumer CANNOT:')
    log.push('import internal from "my-lib/dist/internal.js"  // ❌ ERR_PACKAGE_PATH_NOT_EXPORTED')
    log.push('')
    log.push('=== Conditional Exports ===')
    log.push('')
    log.push('{')
    log.push('  "exports": {')
    log.push('    ".": {')
    log.push('      "import": "./dist/esm/index.mjs",')
    log.push('      "require": "./dist/cjs/index.cjs",')
    log.push('      "types": "./dist/types/index.d.ts",')
    log.push('      "default": "./dist/cjs/index.cjs"')
    log.push('    }')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push('Conditions evaluated:')
    log.push('  "import"  — when loaded via import/import()')
    log.push('  "require" — when loaded via require()')
    log.push('  "types"   — TypeScript type definitions')
    log.push('  "node"    — Node.js environment')
    log.push('  "browser" — bundler browser target')
    log.push('  "default" — fallback (always matched)')
    log.push('')
    log.push('=== Subpath Patterns (Node.js 12.20+) ===')
    log.push('')
    log.push('{')
    log.push('  "exports": {')
    log.push('    ".": "./dist/index.js",')
    log.push('    "./components/*": "./dist/components/*.js",')
    log.push('    "./utils/*.js": "./dist/utils/*.js"')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push('import Button from "my-lib/components/Button"')
    log.push('// → ./dist/components/Button.js')
    log.push('')
    log.push('=== Simulation: Export Resolution ===')

    interface ExportsMap {
      [key: string]: string | { import?: string; require?: string; default?: string }
    }

    const exportsMap: ExportsMap = {
      '.': {
        import: './dist/esm/index.mjs',
        require: './dist/cjs/index.cjs',
        default: './dist/cjs/index.cjs'
      },
      './utils': './dist/utils.js',
      './components/*': './dist/components/*.js'
    }

    function resolveExport(specifier: string, condition: 'import' | 'require'): string {
      const entry = exportsMap[specifier]
      if (!entry) return `❌ ERR_PACKAGE_PATH_NOT_EXPORTED: "${specifier}"`
      if (typeof entry === 'string') return `✅ ${entry}`
      return `✅ ${entry[condition] || entry.default || 'not found'}`
    }

    log.push('')
    const testCases: Array<[string, 'import' | 'require']> = [
      ['.', 'import'],
      ['.', 'require'],
      ['./utils', 'import'],
      ['./internal', 'import'],
    ]

    testCases.forEach(([spec, cond]) => {
      log.push(`  ${cond}("my-lib${spec === '.' ? '' : '/' + spec.slice(2)}") → ${resolveExport(spec, cond)}`)
    })

    log.push('')
    log.push('=== Best Practices ===')
    log.push('✅ Always include "types" condition for TypeScript')
    log.push('✅ Include "default" as fallback')
    log.push('✅ Use conditional exports for dual CJS/ESM packages')
    log.push('❌ Don\'t expose internal files outside exports map')
    log.push('📌 "main" field is ignored when "exports" is present')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.4: Package.json exports</h2>
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
