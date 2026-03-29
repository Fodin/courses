import { useState } from 'react'

// ============================================
// Task 12.1: Helmet & Security Headers — Solution
// ============================================

export function Task12_1_Solution() {
  const [results, setResults] = useState<string[]>([])
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  const simulateHelmet = () => {
    const log: string[] = []
    log.push('// === Helmet Configuration ===')
    log.push("import helmet from 'helmet'")
    log.push('')
    log.push('// Default helmet (sets 11 headers)')
    log.push('app.use(helmet())')
    log.push('')
    log.push('// Custom configuration')
    log.push('app.use(helmet({')
    log.push('  contentSecurityPolicy: {')
    log.push('    directives: {')
    log.push('      defaultSrc: ["\'self\'"],')
    log.push('      scriptSrc: ["\'self\'", "cdn.example.com"],')
    log.push('      styleSrc: ["\'self\'", "\'unsafe-inline\'"],')
    log.push('      imgSrc: ["\'self\'", "data:", "*.cloudinary.com"],')
    log.push('      connectSrc: ["\'self\'", "api.example.com"],')
    log.push('      fontSrc: ["\'self\'", "fonts.googleapis.com"],')
    log.push('      objectSrc: ["\'none\'"],')
    log.push('      upgradeInsecureRequests: []')
    log.push('    }')
    log.push('  },')
    log.push('  hsts: {')
    log.push('    maxAge: 31536000,     // 1 year')
    log.push('    includeSubDomains: true,')
    log.push('    preload: true')
    log.push('  },')
    log.push('  referrerPolicy: { policy: "strict-origin-when-cross-origin" },')
    log.push('  crossOriginEmbedderPolicy: false, // disable if loading external images')
    log.push('}))')
    log.push('')
    log.push('// Response headers after helmet:')
    log.push('[HEADERS] Content-Security-Policy: default-src \'self\'; script-src \'self\' cdn.example.com')
    log.push('[HEADERS] Strict-Transport-Security: max-age=31536000; includeSubDomains; preload')
    log.push('[HEADERS] X-Content-Type-Options: nosniff')
    log.push('[HEADERS] X-Frame-Options: SAMEORIGIN')
    log.push('[HEADERS] X-XSS-Protection: 0  (deprecated, CSP is preferred)')
    log.push('[HEADERS] X-DNS-Prefetch-Control: off')
    log.push('[HEADERS] X-Download-Options: noopen')
    log.push('[HEADERS] X-Permitted-Cross-Domain-Policies: none')
    log.push('[HEADERS] Referrer-Policy: strict-origin-when-cross-origin')
    log.push('[HEADERS] Cross-Origin-Opener-Policy: same-origin')
    log.push('[HEADERS] Cross-Origin-Resource-Policy: same-origin')
    setResults(log)
    setActiveDemo('helmet')
  }

  const simulateCSP = () => {
    const log: string[] = []
    log.push('// === Content Security Policy (CSP) Deep Dive ===')
    log.push('')
    log.push('// CSP prevents XSS by controlling what resources can load')
    log.push('')
    log.push('// Report-only mode (for testing)')
    log.push('app.use(helmet({')
    log.push('  contentSecurityPolicy: {')
    log.push('    reportOnly: true,  // logs violations but does not block')
    log.push('    directives: {')
    log.push('      defaultSrc: ["\'self\'"],')
    log.push("      reportUri: '/csp-report'")
    log.push('    }')
    log.push('  }')
    log.push('}))')
    log.push('')
    log.push('// CSP violation report endpoint')
    log.push("app.post('/csp-report', express.json({ type: 'application/csp-report' }), (req, res) => {")
    log.push('  console.log("[CSP VIOLATION]", req.body)')
    log.push('  res.sendStatus(204)')
    log.push('})')
    log.push('')
    log.push('// Simulation of CSP violations:')
    log.push('[CSP] Page loads inline <script>alert("xss")</script>')
    log.push("[CSP VIOLATION] Blocked 'unsafe-inline' script execution")
    log.push("[CSP REPORT] { blocked-uri: 'inline', violated-directive: 'script-src' }")
    log.push('')
    log.push('[CSP] Page loads <img src="http://evil.com/track.gif">')
    log.push("[CSP VIOLATION] Blocked image from 'http://evil.com'")
    log.push("[CSP REPORT] { blocked-uri: 'http://evil.com', violated-directive: 'img-src' }")
    log.push('')
    log.push('[CSP] Page loads <script src="https://cdn.example.com/lib.js">')
    log.push('[CSP OK] Allowed - cdn.example.com is in script-src whitelist')
    setResults(log)
    setActiveDemo('csp')
  }

  const buttons = [
    { id: 'helmet', label: 'Helmet Setup', handler: simulateHelmet },
    { id: 'csp', label: 'CSP Deep Dive', handler: simulateCSP },
  ]

  return (
    <div className="exercise-container">
      <h2>Задание 12.1: Helmet & Security Headers</h2>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {buttons.map(b => (
          <button
            key={b.id}
            onClick={b.handler}
            style={{
              padding: '0.5rem 1rem',
              background: activeDemo === b.id ? '#d32f2f' : '#ffebee',
              color: activeDemo === b.id ? 'white' : '#d32f2f',
              border: '1px solid #d32f2f',
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
// Task 12.2: Input Sanitization — Solution
// ============================================

export function Task12_2_Solution() {
  const [results, setResults] = useState<string[]>([])
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  const simulateInjection = () => {
    const log: string[] = []
    log.push('// === SQL / NoSQL Injection Prevention ===')
    log.push('')
    log.push('// SQL INJECTION')
    log.push('// BAD: string concatenation')
    log.push('const bad = `SELECT * FROM users WHERE email = \'${req.body.email}\'`')
    log.push("// Input: ' OR '1'='1")
    log.push("[ATTACK] SELECT * FROM users WHERE email = '' OR '1'='1'")
    log.push('[RESULT] Returns ALL users!')
    log.push('')
    log.push('// GOOD: parameterized queries')
    log.push("const [rows] = await pool.query('SELECT * FROM users WHERE email = $1', [req.body.email])")
    log.push("[SAFE] Parameter is escaped: email = \"' OR '1'='1\" (treated as literal string)")
    log.push('[RESULT] Returns 0 users (no match)')
    log.push('')
    log.push('// NoSQL INJECTION')
    log.push('// BAD: passing raw request body to MongoDB')
    log.push('const user = await db.collection("users").findOne({ email: req.body.email })')
    log.push('// Input: { "email": { "$gt": "" } }')
    log.push('[ATTACK] findOne({ email: { $gt: "" } }) => returns first user!')
    log.push('')
    log.push('// GOOD: validate and sanitize input')
    log.push("import mongoSanitize from 'express-mongo-sanitize'")
    log.push('app.use(mongoSanitize())  // strips $ and . from req.body/query/params')
    log.push('')
    log.push('// Or validate with Zod:')
    log.push('const loginSchema = z.object({')
    log.push('  email: z.string().email(),')
    log.push('  password: z.string().min(8)')
    log.push('})')
    log.push('[SAFE] { "$gt": "" } fails zod email validation')
    setResults(log)
    setActiveDemo('injection')
  }

  const simulateXSS = () => {
    const log: string[] = []
    log.push('// === XSS Prevention ===')
    log.push('')
    log.push("import xss from 'xss'")
    log.push("import { JSDOM } from 'jsdom'")
    log.push("import DOMPurify from 'dompurify'")
    log.push('')
    log.push('// Stored XSS example:')
    log.push("// User submits: <script>document.cookie</script> as 'name'")
    log.push('')
    log.push('// Option 1: xss library')
    log.push('const clean = xss(req.body.name)')
    log.push("[XSS] Input:  '<script>alert(1)</script>'")
    log.push("[XSS] Output: '&lt;script&gt;alert(1)&lt;/script&gt;'")
    log.push('')
    log.push('// Option 2: DOMPurify (for HTML content)')
    log.push('const window = new JSDOM("").window')
    log.push('const purify = DOMPurify(window)')
    log.push('const cleanHtml = purify.sanitize(req.body.content)')
    log.push("[PURIFY] Input:  '<p>Hello <script>evil()</script> world</p>'")
    log.push("[PURIFY] Output: '<p>Hello  world</p>'")
    log.push('')
    log.push('// Option 3: escape for JSON responses (automatic in Express)')
    log.push('res.json({ name: userInput })  // Express escapes by default in JSON')
    log.push('')
    log.push('// Validation-based approach (recommended):')
    log.push('const commentSchema = z.object({')
    log.push('  text: z.string()')
    log.push('    .min(1)')
    log.push('    .max(1000)')
    log.push('    .transform(val => xss(val)),  // sanitize in schema')
    log.push('  authorId: z.string().uuid()')
    log.push('})')
    log.push('[VALIDATE] Sanitized at schema level before reaching any handler')
    setResults(log)
    setActiveDemo('xss')
  }

  const buttons = [
    { id: 'injection', label: 'Injection Prevention', handler: simulateInjection },
    { id: 'xss', label: 'XSS Protection', handler: simulateXSS },
  ]

  return (
    <div className="exercise-container">
      <h2>Задание 12.2: Input Sanitization</h2>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {buttons.map(b => (
          <button
            key={b.id}
            onClick={b.handler}
            style={{
              padding: '0.5rem 1rem',
              background: activeDemo === b.id ? '#e65100' : '#fff3e0',
              color: activeDemo === b.id ? 'white' : '#e65100',
              border: '1px solid #e65100',
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
// Task 12.3: CSRF & Advanced Security — Solution
// ============================================

export function Task12_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    log.push('// === CSRF Protection ===')
    log.push("import csrf from 'csurf'")
    log.push("import cookieParser from 'cookie-parser'")
    log.push('')
    log.push('app.use(cookieParser())')
    log.push('const csrfProtection = csrf({ cookie: true })')
    log.push('')
    log.push('// Token endpoint')
    log.push("app.get('/csrf-token', csrfProtection, (req, res) => {")
    log.push('  res.json({ csrfToken: req.csrfToken() })')
    log.push('})')
    log.push('')
    log.push('// Protected route')
    log.push("app.post('/api/transfer', csrfProtection, (req, res) => {")
    log.push('  // Only reaches here if CSRF token is valid')
    log.push('  processTransfer(req.body)')
    log.push('})')
    log.push('')
    log.push('// For SPAs: Double-submit cookie pattern')
    log.push("// 1. Server sets cookie: _csrf=<token>")
    log.push('// 2. Client reads cookie and sends in X-CSRF-Token header')
    log.push('// 3. Server compares cookie value with header value')
    log.push('')
    log.push('// Simulation:')
    log.push('[GET] /csrf-token => { csrfToken: "abc123" }')
    log.push('[POST] /api/transfer (with X-CSRF-Token: abc123)')
    log.push('[CSRF] Token valid, processing request...')
    log.push('[OK] 200')
    log.push('')
    log.push('[POST] /api/transfer (without CSRF token)')
    log.push('[CSRF] EBADCSRFTOKEN: invalid csrf token')
    log.push('[ERROR] 403 Forbidden')
    log.push('')
    log.push('// === HTTP Parameter Pollution ===')
    log.push("import hpp from 'hpp'")
    log.push('')
    log.push('app.use(hpp({')
    log.push('  whitelist: ["sort", "fields", "filter"]  // allow duplicates for these')
    log.push('}))')
    log.push('')
    log.push('// Attack: /api/users?role=user&role=admin')
    log.push('// Without hpp: req.query.role => ["user", "admin"]')
    log.push('// With hpp:    req.query.role => "admin" (last value)')
    log.push('')
    log.push('[HPP] GET /api/users?role=user&role=admin')
    log.push('[HPP] Deduplicated: role = "admin" (last wins)')
    log.push('')
    log.push('// === ReDoS Prevention ===')
    log.push("import { RE2 } from 're2'")
    log.push('')
    log.push('// BAD: catastrophic backtracking')
    log.push("const bad = /^(a+)+$/  // ReDoS vulnerable!")
    log.push('// Input: "aaaaaaaaaaaaaaaaab" => hangs for seconds/minutes')
    log.push('')
    log.push('// GOOD: use RE2 (linear-time regex engine)')
    log.push("const safe = new RE2('^[a-z]+$')")
    log.push('safe.test("aaaaaaaaaaaaaaaaab") // instant, returns false')
    log.push('')
    log.push('[REDOS] Vulnerable regex tested with 20-char input:')
    log.push('[REDOS] /^(a+)+$/ => TIMEOUT (>5s)')
    log.push("[REDOS] RE2('^[a-z]+$') => false (0.01ms)")
    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 12.3: CSRF & Advanced Security</h2>
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
