import { useState } from 'react'

// ============================================
// Task 11.1: Unit Testing — Solution
// ============================================

export function Task11_1_Solution() {
  const [results, setResults] = useState<string[]>([])
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  const simulateMocking = () => {
    const log: string[] = []
    log.push('// === Mocking Dependencies ===')
    log.push("import { describe, it, expect, vi, beforeEach } from 'vitest'")
    log.push('')
    log.push('// Service to test')
    log.push('class UserService {')
    log.push('  constructor(private db: Database, private mailer: Mailer) {}')
    log.push('')
    log.push('  async createUser(data: CreateUserDTO) {')
    log.push('    const user = await this.db.users.create(data)')
    log.push('    await this.mailer.sendWelcome(user.email)')
    log.push('    return user')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push('// Mock dependencies')
    log.push("describe('UserService', () => {")
    log.push('  let service: UserService')
    log.push('  let mockDb: any')
    log.push('  let mockMailer: any')
    log.push('')
    log.push('  beforeEach(() => {')
    log.push('    mockDb = {')
    log.push('      users: {')
    log.push('        create: vi.fn().mockResolvedValue({')
    log.push('          id: 1, name: "Alice", email: "alice@test.com"')
    log.push('        }),')
    log.push('        findById: vi.fn(),')
    log.push('      }')
    log.push('    }')
    log.push('    mockMailer = {')
    log.push('      sendWelcome: vi.fn().mockResolvedValue(true)')
    log.push('    }')
    log.push('    service = new UserService(mockDb, mockMailer)')
    log.push('  })')
    log.push('')
    log.push("  it('creates user and sends welcome email', async () => {")
    log.push('    const result = await service.createUser({')
    log.push('      name: "Alice", email: "alice@test.com"')
    log.push('    })')
    log.push('')
    log.push('    expect(result.id).toBe(1)')
    log.push('    expect(mockDb.users.create).toHaveBeenCalledWith({')
    log.push('      name: "Alice", email: "alice@test.com"')
    log.push('    })')
    log.push('    expect(mockMailer.sendWelcome).toHaveBeenCalledWith("alice@test.com")')
    log.push('    expect(mockMailer.sendWelcome).toHaveBeenCalledTimes(1)')
    log.push('  })')
    log.push('})')
    log.push('')
    log.push('// Simulation of test run:')
    log.push('[VITEST] Running UserService tests...')
    log.push('  PASS creates user and sends welcome email (3ms)')
    log.push('  PASS throws if email already exists (2ms)')
    log.push('  PASS does not send email on db failure (1ms)')
    log.push('[VITEST] 3/3 tests passed')
    setResults(log)
    setActiveDemo('mocking')
  }

  const simulateHandlers = () => {
    const log: string[] = []
    log.push('// === Testing Route Handlers ===')
    log.push('')
    log.push('// Handler (isolated from Express)')
    log.push('export async function getUserHandler(req: Request, res: Response) {')
    log.push('  const { id } = req.params')
    log.push('  const user = await UserService.findById(id)')
    log.push('  if (!user) {')
    log.push('    return res.status(404).json({ error: "User not found" })')
    log.push('  }')
    log.push('  res.json(user)')
    log.push('}')
    log.push('')
    log.push('// Test with mock req/res')
    log.push("describe('getUserHandler', () => {")
    log.push('  const mockReq = (overrides = {}) => ({')
    log.push('    params: {},')
    log.push('    query: {},')
    log.push('    body: {},')
    log.push('    ...overrides')
    log.push('  }) as unknown as Request')
    log.push('')
    log.push('  const mockRes = () => {')
    log.push('    const res = {} as Response')
    log.push('    res.status = vi.fn().mockReturnValue(res)')
    log.push('    res.json = vi.fn().mockReturnValue(res)')
    log.push('    return res')
    log.push('  }')
    log.push('')
    log.push("  it('returns 404 when user not found', async () => {")
    log.push('    vi.spyOn(UserService, "findById").mockResolvedValue(null)')
    log.push('    const req = mockReq({ params: { id: "999" } })')
    log.push('    const res = mockRes()')
    log.push('')
    log.push('    await getUserHandler(req, res)')
    log.push('')
    log.push('    expect(res.status).toHaveBeenCalledWith(404)')
    log.push('    expect(res.json).toHaveBeenCalledWith({ error: "User not found" })')
    log.push('  })')
    log.push('')
    log.push("  it('returns user when found', async () => {")
    log.push('    const user = { id: "1", name: "Alice" }')
    log.push('    vi.spyOn(UserService, "findById").mockResolvedValue(user)')
    log.push('    const req = mockReq({ params: { id: "1" } })')
    log.push('    const res = mockRes()')
    log.push('')
    log.push('    await getUserHandler(req, res)')
    log.push('')
    log.push('    expect(res.json).toHaveBeenCalledWith(user)')
    log.push('  })')
    log.push('})')
    log.push('')
    log.push('// Simulation:')
    log.push('[VITEST] Running getUserHandler tests...')
    log.push('  PASS returns 404 when user not found (2ms)')
    log.push('  PASS returns user when found (1ms)')
    log.push('  PASS returns 400 for invalid id format (1ms)')
    log.push('[VITEST] 3/3 tests passed')
    setResults(log)
    setActiveDemo('handlers')
  }

  const buttons = [
    { id: 'mocking', label: 'Mocking Dependencies', handler: simulateMocking },
    { id: 'handlers', label: 'Testing Handlers', handler: simulateHandlers },
  ]

  return (
    <div className="exercise-container">
      <h2>Задание 11.1: Unit Testing</h2>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {buttons.map(b => (
          <button
            key={b.id}
            onClick={b.handler}
            style={{
              padding: '0.5rem 1rem',
              background: activeDemo === b.id ? '#388e3c' : '#e8f5e9',
              color: activeDemo === b.id ? 'white' : '#388e3c',
              border: '1px solid #388e3c',
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
// Task 11.2: Integration Tests — Solution
// ============================================

export function Task11_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    log.push('// === Integration Tests with Supertest ===')
    log.push("import request from 'supertest'")
    log.push("import { app } from '../app'")
    log.push('')
    log.push("describe('POST /api/users', () => {")
    log.push("  it('creates a new user', async () => {")
    log.push('    const res = await request(app)')
    log.push("      .post('/api/users')")
    log.push('      .send({ name: "Alice", email: "alice@test.com", password: "secret123" })')
    log.push("      .set('Content-Type', 'application/json')")
    log.push('      .expect(201)')
    log.push("      .expect('Content-Type', /json/)")
    log.push('')
    log.push('    expect(res.body).toMatchObject({')
    log.push('      id: expect.any(Number),')
    log.push('      name: "Alice",')
    log.push('      email: "alice@test.com"')
    log.push('    })')
    log.push('    expect(res.body).not.toHaveProperty("password")')
    log.push('  })')
    log.push('')
    log.push("  it('returns 400 for invalid data', async () => {")
    log.push('    const res = await request(app)')
    log.push("      .post('/api/users')")
    log.push('      .send({ name: "" }) // missing required fields')
    log.push('      .expect(400)')
    log.push('')
    log.push('    expect(res.body.errors).toBeDefined()')
    log.push('  })')
    log.push('')
    log.push("  it('returns 409 for duplicate email', async () => {")
    log.push('    // First create')
    log.push('    await request(app)')
    log.push("      .post('/api/users')")
    log.push('      .send({ name: "Alice", email: "dup@test.com", password: "secret" })')
    log.push('      .expect(201)')
    log.push('')
    log.push('    // Duplicate')
    log.push('    await request(app)')
    log.push("      .post('/api/users')")
    log.push('      .send({ name: "Bob", email: "dup@test.com", password: "secret" })')
    log.push('      .expect(409)')
    log.push('  })')
    log.push('})')
    log.push('')
    log.push("describe('GET /api/users (with auth)', () => {")
    log.push('  let token: string')
    log.push('')
    log.push('  beforeAll(async () => {')
    log.push('    const res = await request(app)')
    log.push("      .post('/api/auth/login')")
    log.push('      .send({ email: "admin@test.com", password: "admin" })')
    log.push('    token = res.body.token')
    log.push('  })')
    log.push('')
    log.push("  it('returns users list with valid token', async () => {")
    log.push('    const res = await request(app)')
    log.push("      .get('/api/users')")
    log.push("      .set('Authorization', `Bearer ${token}`)")
    log.push('      .expect(200)')
    log.push('')
    log.push('    expect(Array.isArray(res.body.data)).toBe(true)')
    log.push('    expect(res.body.meta.total).toBeGreaterThan(0)')
    log.push('  })')
    log.push('')
    log.push("  it('returns 401 without token', async () => {")
    log.push('    await request(app)')
    log.push("      .get('/api/users')")
    log.push('      .expect(401)')
    log.push('  })')
    log.push('})')
    log.push('')
    log.push('// Simulation:')
    log.push('[SUPERTEST] Running integration tests...')
    log.push('  POST /api/users')
    log.push('    PASS creates a new user (45ms)')
    log.push('    PASS returns 400 for invalid data (12ms)')
    log.push('    PASS returns 409 for duplicate email (38ms)')
    log.push('  GET /api/users')
    log.push('    PASS returns users list with valid token (22ms)')
    log.push('    PASS returns 401 without token (5ms)')
    log.push('[SUPERTEST] 5/5 tests passed (122ms total)')
    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 11.2: Integration Tests (Supertest)</h2>
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

// ============================================
// Task 11.3: Test Database — Solution
// ============================================

export function Task11_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    log.push('// === Test Database Management ===')
    log.push('')
    log.push('// vitest.config.ts')
    log.push('export default defineConfig({')
    log.push("  globalSetup: './tests/global-setup.ts',")
    log.push("  setupFiles: ['./tests/setup.ts']")
    log.push('})')
    log.push('')
    log.push('// global-setup.ts — runs ONCE before all tests')
    log.push('export async function setup() {')
    log.push('  // Create test database')
    log.push('  const client = new Client({ connectionString: process.env.DATABASE_URL })')
    log.push('  await client.connect()')
    log.push('  await client.query("CREATE DATABASE test_db")')
    log.push('  await client.end()')
    log.push('')
    log.push('  // Run migrations')
    log.push('  execSync("npx prisma migrate deploy", {')
    log.push('    env: { ...process.env, DATABASE_URL: TEST_DB_URL }')
    log.push('  })')
    log.push('}')
    log.push('')
    log.push('export async function teardown() {')
    log.push('  await client.query("DROP DATABASE test_db")')
    log.push('}')
    log.push('')
    log.push('// setup.ts — runs before EACH test file')
    log.push("import { prisma } from '../src/db'")
    log.push('')
    log.push('beforeEach(async () => {')
    log.push('  // Clean all tables (respecting FK order)')
    log.push('  await prisma.$transaction([')
    log.push('    prisma.comment.deleteMany(),')
    log.push('    prisma.post.deleteMany(),')
    log.push('    prisma.user.deleteMany(),')
    log.push('  ])')
    log.push('})')
    log.push('')
    log.push('afterAll(async () => {')
    log.push('  await prisma.$disconnect()')
    log.push('})')
    log.push('')
    log.push('// === Fixtures / Factories ===')
    log.push('')
    log.push('function createUserFactory(overrides: Partial<User> = {}) {')
    log.push('  return {')
    log.push('    name: `user-${randomUUID().slice(0, 8)}`,')
    log.push('    email: `${randomUUID().slice(0, 8)}@test.com`,')
    log.push('    password: await hash("password123", 10),')
    log.push('    role: "user" as const,')
    log.push('    ...overrides')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push('async function seedTestData() {')
    log.push('  const admin = await prisma.user.create({')
    log.push('    data: createUserFactory({ role: "admin", name: "Admin" })')
    log.push('  })')
    log.push('  const user = await prisma.user.create({')
    log.push('    data: createUserFactory({ name: "Test User" })')
    log.push('  })')
    log.push('  const post = await prisma.post.create({')
    log.push('    data: { title: "Test Post", body: "Content", authorId: user.id }')
    log.push('  })')
    log.push('  return { admin, user, post }')
    log.push('}')
    log.push('')
    log.push('// Usage in tests:')
    log.push("it('admin can delete any post', async () => {")
    log.push('  const { admin, post } = await seedTestData()')
    log.push('  const token = generateToken(admin)')
    log.push('')
    log.push('  await request(app)')
    log.push('    .delete(`/api/posts/${post.id}`)')
    log.push('    .set("Authorization", `Bearer ${token}`)')
    log.push('    .expect(204)')
    log.push('})')
    log.push('')
    log.push('// Simulation:')
    log.push('[GLOBAL SETUP] Creating test_db...')
    log.push('[MIGRATE] Running 5 migrations...')
    log.push('[TEST] users.test.ts')
    log.push('  [CLEANUP] Truncated 3 tables')
    log.push('  [SEED] Created admin, user, post')
    log.push('  PASS admin can delete any post (35ms)')
    log.push('  [CLEANUP] Truncated 3 tables')
    log.push('  PASS user cannot delete others posts (28ms)')
    log.push('[TEST] posts.test.ts')
    log.push('  [CLEANUP] Truncated 3 tables')
    log.push('  PASS creates post with valid data (42ms)')
    log.push('[GLOBAL TEARDOWN] Dropping test_db...')
    log.push('[DONE] 8/8 tests passed (320ms)')
    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 11.3: Test Database Management</h2>
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
