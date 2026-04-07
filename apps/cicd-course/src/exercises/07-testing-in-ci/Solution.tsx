// ============================================
// Level 7: Testing in CI — Solutions
// ============================================

import { useState, useEffect, useRef } from 'react'

// ============================================
// Task 7.1: Test Pyramid in Pipeline
// ============================================

const PYRAMID_LEVELS = [
  {
    id: 'e2e',
    label: 'E2E Tests',
    color: '#E65100',
    bg: '#FFF3E0',
    border: '#FFCC80',
    width: '40%',
    time: '~15 мин',
    percent: '10%',
    deps: 'Браузер, все сервисы',
    desc: 'Имитируют реального пользователя в браузере. Медленные, нестабильные, но ловят интеграционные баги.',
    stage: 'e2e',
    script: 'npx playwright test',
    minutes: 15,
  },
  {
    id: 'integration',
    label: 'Integration',
    color: '#1565C0',
    bg: '#E3F2FD',
    border: '#90CAF9',
    width: '65%',
    time: '~5 мин',
    percent: '20%',
    deps: 'PostgreSQL, Redis',
    desc: 'Проверяют взаимодействие компонентов: API + БД, сервис + очередь. Требуют запущенных зависимостей.',
    stage: 'integration',
    script: 'npm run test:integration',
    minutes: 5,
  },
  {
    id: 'unit',
    label: 'Unit Tests',
    color: '#2E7D32',
    bg: '#E8F5E9',
    border: '#A5D6A7',
    width: '100%',
    time: '~2 мин',
    percent: '70%',
    deps: 'Нет',
    desc: 'Тестируют отдельные функции в изоляции. Быстрые, стабильные, запускаются первыми. 70-80% всех тестов.',
    stage: 'unit-test',
    script: 'npm run test:unit -- --coverage',
    minutes: 2,
  },
]

function buildPipelineYaml(enabled: string[]): string {
  const stages = ['lint', ...PYRAMID_LEVELS.filter(l => enabled.includes(l.id)).reverse().map(l => l.stage), 'deploy']
  const stagesYaml = stages.map(s => `  - ${s}`).join('\n')

  const jobs = PYRAMID_LEVELS.filter(l => enabled.includes(l.id))
    .reverse()
    .map(l => {
      const extra = l.id === 'e2e'
        ? '\n  rules:\n    - if: \'$CI_COMMIT_BRANCH == "main"\''
        : ''
      return `${l.stage.replace('-', '_').replace('test', 'tests')}:
  stage: ${l.stage}
  image: node:20-alpine
  script:
    - ${l.script}${extra}`
    })
    .join('\n\n')

  return `stages:\n${stagesYaml}\n\nlint:\n  stage: lint\n  script:\n    - npm run lint\n\n${jobs}\n\ndeploy:\n  stage: deploy\n  script:\n    - ./deploy.sh`
}

export function Task7_1_Solution() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>('unit')
  const [enabled, setEnabled] = useState<string[]>(['unit', 'integration', 'e2e'])

  const toggleEnabled = (id: string) => {
    setEnabled(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const totalTime = PYRAMID_LEVELS
    .filter(l => enabled.includes(l.id))
    .reduce((sum, l) => sum + l.minutes, 0) + 1 // +1 for lint

  const hasUnitDisabled = !enabled.includes('unit')
  const hasE2EWithoutUnit = enabled.includes('e2e') && !enabled.includes('unit')
  const selected = PYRAMID_LEVELS.find(l => l.id === selectedLevel)

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '860px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Пирамида тестов в пайплайне</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Кликай на уровни пирамиды, включай/отключай типы тестов — YAML обновится автоматически
      </p>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Pyramid + checkboxes */}
        <div style={{ flex: '0 0 auto' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            marginBottom: '1rem',
          }}>
            {PYRAMID_LEVELS.map(level => (
              <div key={level.id} style={{
                width: level.width,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <div
                  onClick={() => setSelectedLevel(level.id)}
                  style={{
                    flex: 1,
                    background: enabled.includes(level.id) ? level.bg : '#f5f5f5',
                    border: `2px solid ${selectedLevel === level.id ? level.color : (enabled.includes(level.id) ? level.border : '#ddd')}`,
                    borderRadius: '8px',
                    padding: '0.6rem 1rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s',
                    opacity: enabled.includes(level.id) ? 1 : 0.5,
                    boxShadow: selectedLevel === level.id ? `0 0 0 3px ${level.border}` : 'none',
                  }}
                >
                  <div style={{
                    fontWeight: 700,
                    color: enabled.includes(level.id) ? level.color : '#999',
                    fontSize: '0.9rem',
                  }}>
                    {level.label}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#888' }}>
                    {level.time} · {level.percent} тестов
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkboxes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {PYRAMID_LEVELS.map(level => (
              <label key={level.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}>
                <input
                  type="checkbox"
                  checked={enabled.includes(level.id)}
                  onChange={() => toggleEnabled(level.id)}
                  style={{ width: '16px', height: '16px' }}
                />
                <span style={{ color: level.color, fontWeight: 600 }}>{level.label}</span>
              </label>
            ))}
          </div>

          {/* Total time */}
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: '#F5F5F5',
            borderRadius: '8px',
            fontSize: '0.9rem',
          }}>
            <div style={{ color: '#666', marginBottom: '4px' }}>Итоговое время:</div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#333' }}>
              ~{totalTime} мин
            </div>
          </div>
        </div>

        {/* Details + YAML */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          {/* Selected level details */}
          {selected && (
            <div style={{
              border: `2px solid ${selected.border}`,
              borderRadius: '10px',
              padding: '1rem',
              background: selected.bg,
              marginBottom: '1rem',
            }}>
              <div style={{ fontWeight: 700, color: selected.color, marginBottom: '0.5rem', fontSize: '1rem' }}>
                {selected.label}
              </div>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#444' }}>{selected.desc}</p>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                <div>Время: <strong>{selected.time}</strong></div>
                <div>Доля тестов: <strong>{selected.percent}</strong></div>
                <div>Зависимости: <strong>{selected.deps}</strong></div>
              </div>
            </div>
          )}

          {/* Warnings */}
          {hasUnitDisabled && (
            <div style={{
              background: '#FFF3E0',
              border: '1px solid #FFCC80',
              borderRadius: '8px',
              padding: '0.75rem',
              marginBottom: '1rem',
              fontSize: '0.85rem',
              color: '#E65100',
            }}>
              ⚠️ Unit-тесты отключены! Нарушается принцип fail-fast — дорогие тесты запускаются без базовой проверки кода.
            </div>
          )}
          {hasE2EWithoutUnit && (
            <div style={{
              background: '#FFEBEE',
              border: '1px solid #FFCDD2',
              borderRadius: '8px',
              padding: '0.75rem',
              marginBottom: '1rem',
              fontSize: '0.85rem',
              color: '#C62828',
            }}>
              ❌ E2E без unit-тестов — антипаттерн! Сломанный unit будет обнаружен только через 15+ минут.
            </div>
          )}

          {/* YAML */}
          <div style={{
            background: '#1E1E1E',
            borderRadius: '8px',
            padding: '1rem',
            fontSize: '0.78rem',
            fontFamily: 'monospace',
            color: '#D4D4D4',
            whiteSpace: 'pre',
            overflow: 'auto',
            maxHeight: '340px',
          }}>
            {buildPipelineYaml(enabled)}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 7.2: Services — databases in CI
// ============================================

interface ServiceDef {
  id: string
  label: string
  icon: string
  image: string
  defaultPort: number
  color: string
  bg: string
  border: string
  envVars: Array<{ key: string; value: string; desc: string }>
  urlTemplate: (host: string) => string
}

const SERVICES: ServiceDef[] = [
  {
    id: 'postgres',
    label: 'PostgreSQL',
    icon: '🐘',
    image: 'postgres:15-alpine',
    defaultPort: 5432,
    color: '#336791',
    bg: '#EBF5FB',
    border: '#AED6F1',
    envVars: [
      { key: 'POSTGRES_DB', value: 'testdb', desc: 'Имя базы данных' },
      { key: 'POSTGRES_USER', value: 'test', desc: 'Пользователь' },
      { key: 'POSTGRES_PASSWORD', value: 'test', desc: 'Пароль' },
      { key: 'POSTGRES_HOST_AUTH_METHOD', value: 'trust', desc: 'Упрощённая аутентификация' },
    ],
    urlTemplate: (host) => `postgresql://test:test@${host}:5432/testdb`,
  },
  {
    id: 'redis',
    label: 'Redis',
    icon: '🔴',
    image: 'redis:7-alpine',
    defaultPort: 6379,
    color: '#DC382D',
    bg: '#FDEDEC',
    border: '#F1948A',
    envVars: [],
    urlTemplate: (host) => `redis://${host}:6379`,
  },
  {
    id: 'mongo',
    label: 'MongoDB',
    icon: '🍃',
    image: 'mongo:7',
    defaultPort: 27017,
    color: '#13AA52',
    bg: '#EAFAF1',
    border: '#A9DFBF',
    envVars: [
      { key: 'MONGO_INITDB_ROOT_USERNAME', value: 'test', desc: 'Root пользователь' },
      { key: 'MONGO_INITDB_ROOT_PASSWORD', value: 'test', desc: 'Root пароль' },
      { key: 'MONGO_INITDB_DATABASE', value: 'testdb', desc: 'Начальная БД' },
    ],
    urlTemplate: (host) => `mongodb://test:test@${host}:27017/testdb`,
  },
  {
    id: 'mysql',
    label: 'MySQL',
    icon: '🐬',
    image: 'mysql:8',
    defaultPort: 3306,
    color: '#F29111',
    bg: '#FEF9E7',
    border: '#F8C471',
    envVars: [
      { key: 'MYSQL_DATABASE', value: 'testdb', desc: 'Имя базы данных' },
      { key: 'MYSQL_USER', value: 'test', desc: 'Пользователь' },
      { key: 'MYSQL_PASSWORD', value: 'test', desc: 'Пароль' },
      { key: 'MYSQL_ROOT_PASSWORD', value: 'rootpass', desc: 'Root пароль' },
    ],
    urlTemplate: (host) => `mysql://test:test@${host}:3306/testdb`,
  },
]

function buildServicesYaml(selected: Map<string, string>): string {
  if (selected.size === 0) return '# Выбери сервисы выше'

  const servicesBlock = Array.from(selected.entries()).map(([id, alias]) => {
    const svc = SERVICES.find(s => s.id === id)!
    const defaultHost = svc.image.split(':')[0]
    const hasAlias = alias && alias !== defaultHost
    return hasAlias
      ? `    - name: ${svc.image}\n      alias: ${alias}`
      : `    - ${svc.image}`
  }).join('\n')

  const allVars: string[] = []
  Array.from(selected.entries()).forEach(([id, alias]) => {
    const svc = SERVICES.find(s => s.id === id)!
    const host = alias || svc.image.split(':')[0]
    svc.envVars.forEach(v => allVars.push(`    ${v.key}: "${v.value}"`))
    const urlKey = id === 'postgres' ? 'DATABASE_URL'
      : id === 'redis' ? 'REDIS_URL'
        : id === 'mongo' ? 'MONGODB_URI'
          : 'MYSQL_URL'
    allVars.push(`    ${urlKey}: "${svc.urlTemplate(host)}"`)
  })

  return `integration-tests:
  stage: integration
  image: node:20-alpine
  services:
${servicesBlock}
  variables:
${allVars.join('\n')}
  script:
    - npm ci
    - npm run test:integration`
}

export function Task7_2_Solution() {
  const [selectedServices, setSelectedServices] = useState<Map<string, string>>(new Map())
  const [aliases, setAliases] = useState<Map<string, string>>(new Map())

  const toggleService = (id: string) => {
    setSelectedServices(prev => {
      const next = new Map(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        const svc = SERVICES.find(s => s.id === id)!
        next.set(id, svc.image.split(':')[0])
      }
      return next
    })
  }

  const setAlias = (id: string, alias: string) => {
    const svc = SERVICES.find(s => s.id === id)!
    const defaultHost = svc.image.split(':')[0]
    const effective = alias.trim() || defaultHost
    setAliases(prev => new Map(prev).set(id, alias))
    setSelectedServices(prev => {
      const next = new Map(prev)
      if (next.has(id)) next.set(id, effective)
      return next
    })
  }

  const isSelected = (id: string) => selectedServices.has(id)

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Services: базы данных в CI</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Выбери сервисы и получи готовую конфигурацию GitLab CI
      </p>

      {/* Service selector */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {SERVICES.map(svc => (
          <div
            key={svc.id}
            onClick={() => toggleService(svc.id)}
            style={{
              border: `2px solid ${isSelected(svc.id) ? svc.color : '#ddd'}`,
              borderRadius: '10px',
              padding: '0.75rem 1.25rem',
              cursor: 'pointer',
              background: isSelected(svc.id) ? svc.bg : '#fafafa',
              minWidth: '130px',
              textAlign: 'center',
              transition: 'all 0.15s',
              boxShadow: isSelected(svc.id) ? `0 2px 8px ${svc.border}` : 'none',
            }}
          >
            <div style={{ fontSize: '1.75rem', marginBottom: '4px' }}>{svc.icon}</div>
            <div style={{ fontWeight: 700, color: isSelected(svc.id) ? svc.color : '#666', fontSize: '0.9rem' }}>
              {svc.label}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '2px' }}>{svc.image}</div>
          </div>
        ))}
      </div>

      {/* Selected service details */}
      {selectedServices.size > 0 && (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {Array.from(selectedServices.keys()).map(id => {
            const svc = SERVICES.find(s => s.id === id)!
            const currentAlias = aliases.get(id) || ''
            const effectiveHost = currentAlias.trim() || svc.image.split(':')[0]
            return (
              <div key={id} style={{
                border: `1px solid ${svc.border}`,
                borderRadius: '10px',
                padding: '0.75rem',
                background: svc.bg,
                flex: '1',
                minWidth: '220px',
              }}>
                <div style={{ fontWeight: 700, color: svc.color, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  {svc.icon} {svc.label}
                </div>

                {/* Alias input */}
                <label style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: '4px' }}>
                  Alias (имя хоста):
                </label>
                <input
                  type="text"
                  value={currentAlias}
                  onChange={e => setAlias(id, e.target.value)}
                  placeholder={svc.image.split(':')[0]}
                  style={{
                    width: '100%',
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '0.85rem',
                    fontFamily: 'monospace',
                    boxSizing: 'border-box',
                    marginBottom: '0.5rem',
                  }}
                />

                {/* Connection URL */}
                <div style={{
                  background: '#1E1E1E',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '0.72rem',
                  fontFamily: 'monospace',
                  color: '#9CDCFE',
                  marginBottom: '0.5rem',
                  wordBreak: 'break-all',
                }}>
                  {svc.urlTemplate(effectiveHost)}
                </div>

                {/* Env vars */}
                {svc.envVars.length > 0 && (
                  <div>
                    {svc.envVars.map(v => (
                      <div key={v.key} style={{ fontSize: '0.75rem', color: '#555', marginBottom: '2px' }}>
                        <span style={{ fontFamily: 'monospace', color: svc.color }}>{v.key}</span>
                        <span style={{ color: '#999' }}>="{v.value}" — {v.desc}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Wait hint for postgres */}
                {id === 'postgres' && (
                  <div style={{
                    marginTop: '0.5rem',
                    background: '#FFF8E1',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    color: '#F57F17',
                  }}>
                    💡 Добавь в script: <code>until pg_isready -h {effectiveHost}; do sleep 1; done</code>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Network visualization */}
      {selectedServices.size > 0 && (
        <div style={{
          background: '#F8F9FA',
          borderRadius: '10px',
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}>
          <div style={{ fontSize: '0.8rem', color: '#999', marginRight: '0.5rem' }}>Docker-сеть:</div>
          <div style={{
            background: '#E3F2FD',
            border: '2px solid #90CAF9',
            borderRadius: '8px',
            padding: '0.5rem 0.75rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#1565C0',
          }}>
            📦 Job Container
          </div>
          {Array.from(selectedServices.keys()).map(id => {
            const svc = SERVICES.find(s => s.id === id)!
            const alias = selectedServices.get(id)!
            return (
              <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ color: '#999', fontSize: '0.9rem' }}>——→</div>
                <div style={{
                  background: svc.bg,
                  border: `2px solid ${svc.border}`,
                  borderRadius: '8px',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.8rem',
                  textAlign: 'center',
                }}>
                  <div style={{ fontWeight: 700, color: svc.color }}>{svc.icon} {svc.label}</div>
                  <div style={{ fontSize: '0.7rem', color: '#888', fontFamily: 'monospace' }}>{alias}:{svc.defaultPort}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* YAML */}
      <div style={{
        background: '#1E1E1E',
        borderRadius: '8px',
        padding: '1rem',
        fontSize: '0.78rem',
        fontFamily: 'monospace',
        color: '#D4D4D4',
        whiteSpace: 'pre',
        overflow: 'auto',
      }}>
        {buildServicesYaml(selectedServices)}
      </div>
    </div>
  )
}

// ============================================
// Task 7.3: Coverage and JUnit reports
// ============================================

const FRAMEWORKS = [
  {
    id: 'jest',
    label: 'Jest',
    lang: 'Node.js',
    color: '#C21325',
    bg: '#FEEBEC',
    exampleOutput: `PASS src/auth.test.ts
PASS src/api.test.ts
FAIL src/payment.test.ts
  ● processPayment › should handle timeout

----------|---------|----------|---------|---------|
File      | % Stmts | % Branch | % Funcs | % Lines |
----------|---------|----------|---------|---------|
All files |   85.32 |    72.14 |   88.46 |   85.32 |
 auth.ts  |   96.10 |    91.30 |   95.00 |   96.10 |
 api.ts   |   88.73 |    79.41 |   91.67 |   88.73 |
 pay.ts   |   71.13 |    45.71 |   78.57 |   71.13 |
----------|---------|----------|---------|---------|

Tests: 3 failed, 47 passed, 50 total`,
    regexOptions: [
      { label: 'All files (рекомендуется)', pattern: '/All files[^|]*\\|[^|]*\\|\\s*(\\d+\\.?\\d*)/' },
      { label: 'Lines', pattern: '/Lines\\s*:\\s*(\\d+\\.?\\d*)%/' },
    ],
    coverageFlag: '--coverage',
    junitFlag: '--reporters=jest-junit',
    junitEnv: '\n  variables:\n    JEST_JUNIT_OUTPUT_DIR: reports\n    JEST_JUNIT_OUTPUT_NAME: junit.xml',
  },
  {
    id: 'vitest',
    label: 'Vitest',
    lang: 'Node.js',
    color: '#729B1B',
    bg: '#F2FFDB',
    exampleOutput: `✓ src/auth.test.ts (12 tests) 234ms
✓ src/api.test.ts (8 tests) 156ms
✗ src/payment.test.ts (5 tests | 2 failed) 89ms

Coverage report from v8:
File      | % Stmts | % Branch | % Funcs | % Lines |
All files |   85.32 |    72.14 |   88.46 |   85.32 |

Test Files  3 failed | 1 passed (4)
     Tests  2 failed | 23 passed (25)`,
    regexOptions: [
      { label: 'All files', pattern: '/All files[^|]*\\|[^|]*\\|[^|]*\\|\\s*(\\d+\\.?\\d*)/' },
      { label: 'Lines', pattern: '/Lines\\s*:\\s*(\\d+\\.?\\d*)%/' },
    ],
    coverageFlag: '--coverage',
    junitFlag: '--reporter=junit --outputFile=reports/junit.xml',
    junitEnv: '',
  },
  {
    id: 'pytest',
    label: 'pytest',
    lang: 'Python',
    color: '#3670A0',
    bg: '#EBF5FB',
    exampleOutput: `collected 50 items

src/test_auth.py ........ [ 16%]
src/test_api.py ......... [ 34%]
src/test_payment.py ...F.. [ 68%]

FAILED src/test_payment.py::test_timeout

----------- coverage: platform linux, python 3.12.2 -----------
Name             Stmts   Miss  Cover
------------------------------------
src/auth.py         82      3    96%
src/api.py         134     15    89%
src/payment.py      97     28    71%
------------------------------------
TOTAL              313     46    85%

3 failed, 47 passed in 12.34s`,
    regexOptions: [
      { label: 'TOTAL (рекомендуется)', pattern: '/TOTAL\\s+\\d+\\s+\\d+\\s+(\\d+)%/' },
      { label: 'Cover', pattern: '/Cover\\s+(\\d+)%/' },
    ],
    coverageFlag: '--cov=src --cov-report=term --cov-report=xml:coverage/coverage.xml',
    junitFlag: '--junitxml=reports/junit.xml',
    junitEnv: '',
  },
  {
    id: 'gotest',
    label: 'go test',
    lang: 'Go',
    color: '#00ACD7',
    bg: '#E8F8FC',
    exampleOutput: `ok  	github.com/app/auth	0.234s	coverage: 96.1% of statements
ok  	github.com/app/api	0.156s	coverage: 88.7% of statements
FAIL	github.com/app/payment	0.089s
--- FAIL: TestProcessPayment (0.02s)
FAIL	github.com/app/payment	coverage: 71.1% of statements

total coverage: 85.3% of statements`,
    regexOptions: [
      { label: 'total coverage', pattern: '/total coverage: (\\d+\\.?\\d*)%/' },
      { label: 'coverage (любой пакет)', pattern: '/coverage: (\\d+\\.?\\d*)% of statements/' },
    ],
    coverageFlag: '-coverprofile=coverage.out ./...',
    junitFlag: '2>&1 | go-junit-report > reports/junit.xml',
    junitEnv: '',
  },
]

const COVERAGE_FORMATS = [
  { id: 'regex', label: 'Только regex', desc: 'Badge в README и значение в MR' },
  { id: 'cobertura', label: 'Cobertura XML', desc: 'Детальный diff покрытия в MR (Premium)' },
  { id: 'lcov', label: 'lcov', desc: 'HTML-отчёт для скачивания' },
]

function buildCoverageYaml(fw: typeof FRAMEWORKS[0], regex: string, format: string, when: string): string {
  let reportsBlock = `    reports:\n      junit: reports/junit.xml`
  if (format === 'cobertura') {
    reportsBlock += `\n      coverage_report:\n        coverage_format: cobertura\n        path: coverage/coverage.xml`
  }
  if (format === 'lcov') {
    reportsBlock += `\n  # lcov: сохраняем как обычный artifacts:paths`
  }

  return `unit-tests:
  stage: test
  image: ${fw.id === 'pytest' ? 'python:3.12-slim' : fw.id === 'gotest' ? 'golang:1.22-alpine' : 'node:20-alpine'}
  script:
    - ${fw.id === 'pytest' ? 'pip install pytest pytest-cov' : fw.id === 'gotest' ? 'go install' : 'npm ci'}
    - ${fw.id === 'pytest' ? `pytest ${fw.coverageFlag} ${fw.junitFlag}` : fw.id === 'gotest' ? `go test ${fw.coverageFlag} ${fw.junitFlag}` : `npx ${fw.id === 'jest' ? 'jest' : 'vitest run'} ${fw.coverageFlag} ${fw.junitFlag}`}
  coverage: '${regex}'${fw.junitEnv}
  artifacts:
    when: ${when}
${reportsBlock}
    expire_in: 1 week`
}

export function Task7_3_Solution() {
  const [frameworkId, setFrameworkId] = useState('jest')
  const [userRegex, setUserRegex] = useState('')
  const [coverageFormat, setCoverageFormat] = useState('regex')
  const [artifactsWhen, setArtifactsWhen] = useState<'always' | 'on_success' | 'on_failure'>('always')
  const [matchResult, setMatchResult] = useState<string | null>(null)
  const [regexError, setRegexError] = useState<string | null>(null)

  const fw = FRAMEWORKS.find(f => f.id === frameworkId)!

  const testRegex = (pattern: string) => {
    try {
      setRegexError(null)
      const clean = pattern.replace(/^\//, '').replace(/\/$/, '')
      const re = new RegExp(clean)
      const m = re.exec(fw.exampleOutput)
      setMatchResult(m ? m[1] : null)
    } catch (e) {
      setRegexError('Некорректный regex')
      setMatchResult(null)
    }
  }

  const setRegex = (pattern: string) => {
    setUserRegex(pattern)
    testRegex(pattern)
  }

  const activeRegex = userRegex || fw.regexOptions[0].pattern
  const yaml = buildCoverageYaml(fw, activeRegex, coverageFormat, artifactsWhen)

  const highlightOutput = (text: string): JSX.Element[] => {
    if (!matchResult) return [<span key="all">{text}</span>]
    const lines = text.split('\n')
    return lines.map((line, i) => {
      if (line.includes(matchResult)) {
        const idx = line.indexOf(matchResult)
        return (
          <span key={i}>
            {line.slice(0, idx)}
            <span style={{ background: '#FFD600', color: '#000', borderRadius: '2px', padding: '0 2px' }}>
              {matchResult}
            </span>
            {line.slice(idx + matchResult.length)}
            {i < lines.length - 1 ? '\n' : ''}
          </span>
        )
      }
      return <span key={i}>{line}{i < lines.length - 1 ? '\n' : ''}</span>
    })
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Coverage и JUnit отчёты</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Выбери фреймворк, проверь regex и получи готовую конфигурацию
      </p>

      {/* Framework selector */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {FRAMEWORKS.map(f => (
          <button
            key={f.id}
            onClick={() => { setFrameworkId(f.id); setUserRegex(''); setMatchResult(null); setRegexError(null) }}
            style={{
              border: `2px solid ${frameworkId === f.id ? f.color : '#ddd'}`,
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              background: frameworkId === f.id ? f.bg : '#fff',
              cursor: 'pointer',
              fontWeight: frameworkId === f.id ? 700 : 400,
              color: frameworkId === f.id ? f.color : '#555',
              fontSize: '0.9rem',
            }}
          >
            {f.label}
            <span style={{ fontSize: '0.75rem', color: '#999', marginLeft: '6px' }}>{f.lang}</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '280px' }}>
          {/* Example output */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '6px' }}>
              Пример вывода {fw.label}:
            </div>
            <div style={{
              background: '#1E1E1E',
              borderRadius: '8px',
              padding: '0.75rem',
              fontSize: '0.72rem',
              fontFamily: 'monospace',
              color: '#D4D4D4',
              whiteSpace: 'pre',
              overflow: 'auto',
              maxHeight: '200px',
            }}>
              {highlightOutput(fw.exampleOutput)}
            </div>
          </div>

          {/* Regex input */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '6px' }}>
              Coverage regex:
            </div>
            <input
              type="text"
              value={userRegex}
              onChange={e => setRegex(e.target.value)}
              placeholder={fw.regexOptions[0].pattern}
              style={{
                width: '100%',
                border: `1px solid ${regexError ? '#f44336' : matchResult ? '#4CAF50' : '#ccc'}`,
                borderRadius: '6px',
                padding: '8px 10px',
                fontSize: '0.85rem',
                fontFamily: 'monospace',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
            {regexError && <div style={{ color: '#f44336', fontSize: '0.8rem', marginTop: '4px' }}>{regexError}</div>}
            {matchResult && !regexError && (
              <div style={{ color: '#4CAF50', fontSize: '0.8rem', marginTop: '4px' }}>
                Найдено: <strong>{matchResult}%</strong>
              </div>
            )}
            {!userRegex && !regexError && (
              <div style={{ color: '#999', fontSize: '0.8rem', marginTop: '4px' }}>
                Введи regex или выбери готовый ниже
              </div>
            )}
            {userRegex && !matchResult && !regexError && (
              <div style={{ color: '#FF9800', fontSize: '0.8rem', marginTop: '4px' }}>
                Regex не совпал с выводом
              </div>
            )}
          </div>

          {/* Preset regex buttons */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '6px' }}>Готовые regex для {fw.label}:</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {fw.regexOptions.map(opt => (
                <button
                  key={opt.pattern}
                  onClick={() => setRegex(opt.pattern)}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    background: userRegex === opt.pattern ? '#E8F5E9' : '#fff',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    color: '#333',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Coverage format */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '8px' }}>
              Формат отчёта:
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {COVERAGE_FORMATS.map(f => (
                <div
                  key={f.id}
                  onClick={() => setCoverageFormat(f.id)}
                  style={{
                    border: `2px solid ${coverageFormat === f.id ? '#1565C0' : '#ddd'}`,
                    borderRadius: '8px',
                    padding: '0.5rem 0.75rem',
                    cursor: 'pointer',
                    background: coverageFormat === f.id ? '#E3F2FD' : '#fff',
                    fontSize: '0.85rem',
                  }}
                >
                  <div style={{ fontWeight: 600, color: coverageFormat === f.id ? '#1565C0' : '#333' }}>{f.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#888' }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* artifacts:when */}
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '8px' }}>
              artifacts:when:
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {(['always', 'on_success', 'on_failure'] as const).map(w => (
                <button
                  key={w}
                  onClick={() => setArtifactsWhen(w)}
                  style={{
                    border: `2px solid ${artifactsWhen === w ? '#333' : '#ddd'}`,
                    borderRadius: '6px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    background: artifactsWhen === w ? '#333' : '#fff',
                    color: artifactsWhen === w ? '#fff' : '#555',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    fontWeight: artifactsWhen === w ? 700 : 400,
                  }}
                >
                  {w}
                </button>
              ))}
            </div>
            {artifactsWhen === 'on_success' && (
              <div style={{
                marginTop: '8px',
                background: '#FFF3E0',
                border: '1px solid #FFCC80',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '0.8rem',
                color: '#E65100',
              }}>
                ⚠️ При on_success JUnit-файл не сохранится если тесты упали — MR не покажет детали ошибок!
              </div>
            )}
            {artifactsWhen === 'always' && (
              <div style={{
                marginTop: '8px',
                background: '#E8F5E9',
                border: '1px solid #A5D6A7',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '0.8rem',
                color: '#2E7D32',
              }}>
                ✅ always — оптимально для отчётов тестов: видно детали как при успехе, так и при падении
              </div>
            )}
          </div>
        </div>

        {/* YAML */}
        <div style={{ flex: '1', minWidth: '280px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '6px' }}>
            Конфигурация GitLab CI:
          </div>
          <div style={{
            background: '#1E1E1E',
            borderRadius: '8px',
            padding: '1rem',
            fontSize: '0.78rem',
            fontFamily: 'monospace',
            color: '#D4D4D4',
            whiteSpace: 'pre',
            overflow: 'auto',
            minHeight: '300px',
          }}>
            {yaml}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 7.4: Parallel test execution
// ============================================

const TEST_SUITE = [
  { id: 1, name: 'auth.login', duration: 3 },
  { id: 2, name: 'auth.register', duration: 2 },
  { id: 3, name: 'auth.logout', duration: 1 },
  { id: 4, name: 'auth.token', duration: 4 },
  { id: 5, name: 'api.users.list', duration: 2 },
  { id: 6, name: 'api.users.create', duration: 3 },
  { id: 7, name: 'api.users.update', duration: 2 },
  { id: 8, name: 'api.users.delete', duration: 1 },
  { id: 9, name: 'payment.charge', duration: 5 },
  { id: 10, name: 'payment.refund', duration: 4 },
  { id: 11, name: 'payment.webhook', duration: 3 },
  { id: 12, name: 'billing.invoice', duration: 2 },
  { id: 13, name: 'billing.plan', duration: 1 },
  { id: 14, name: 'email.send', duration: 3 },
  { id: 15, name: 'email.template', duration: 2 },
  { id: 16, name: 'cache.set', duration: 1 },
  { id: 17, name: 'cache.get', duration: 1 },
  { id: 18, name: 'search.query', duration: 4 },
  { id: 19, name: 'search.index', duration: 5 },
  { id: 20, name: 'search.suggest', duration: 3 },
]

const SHARD_OPTIONS = [1, 2, 4, 8]

const SHARD_COLORS = [
  { bg: '#E3F2FD', border: '#90CAF9', text: '#1565C0' },
  { bg: '#E8F5E9', border: '#A5D6A7', text: '#2E7D32' },
  { bg: '#FFF3E0', border: '#FFCC80', text: '#E65100' },
  { bg: '#F3E5F5', border: '#CE93D8', text: '#6A1B9A' },
  { bg: '#FCE4EC', border: '#F48FB1', text: '#AD1457' },
  { bg: '#E0F2F1', border: '#80CBC4', text: '#00695C' },
  { bg: '#FFFDE7', border: '#FFF176', text: '#F57F17' },
  { bg: '#E8EAF6', border: '#9FA8DA', text: '#283593' },
]

type TestItem = typeof TEST_SUITE[number]

function distributeTests(shards: number): TestItem[][] {
  const result: TestItem[][] = Array.from({ length: shards }, () => [])
  TEST_SUITE.forEach((test, i) => result[i % shards].push(test))
  return result
}

export function Task7_4_Solution() {
  const [shards, setShards] = useState(4)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<number[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const distribution = distributeTests(shards)
  const shardTimes = distribution.map(s => s.reduce((sum, t) => sum + t.duration, 0))
  const sequentialTime = TEST_SUITE.reduce((sum, t) => sum + t.duration, 0)
  const parallelTime = Math.max(...shardTimes)
  const savings = Math.round((1 - parallelTime / sequentialTime) * 100)

  const runSimulation = () => {
    if (running) return
    setRunning(true)
    setProgress(Array(shards).fill(0))

    const maxDuration = parallelTime * 200 // ms per second unit
    const interval = setInterval(() => {
      setProgress(prev => prev.map((p, i) => {
        const shardDuration = shardTimes[i] * 200
        return Math.min(100, p + (100 / (shardDuration / 50)))
      }))
    }, 50)

    timerRef.current = setTimeout(() => {
      clearInterval(interval)
      setProgress(Array(shards).fill(100))
      setTimeout(() => {
        setRunning(false)
        setProgress([])
      }, 800)
    }, maxDuration + 100)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const parallelYaml = `unit-tests:
  stage: test
  image: node:20-alpine
  parallel: ${shards}
  script:
    - npm ci
    - npx jest --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL \\
        --reporters=jest-junit
  variables:
    JEST_JUNIT_OUTPUT_NAME: junit-$CI_NODE_INDEX.xml
  artifacts:
    when: always
    reports:
      junit: "junit-*.xml"`

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Параллельный запуск тестов</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Выбери количество шардов и запусти симуляцию
      </p>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#555' }}>Количество шардов:</div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {SHARD_OPTIONS.map(n => (
            <button
              key={n}
              onClick={() => { setShards(n); setProgress([]) }}
              style={{
                border: `2px solid ${shards === n ? '#1565C0' : '#ddd'}`,
                borderRadius: '8px',
                padding: '6px 16px',
                cursor: 'pointer',
                background: shards === n ? '#1565C0' : '#fff',
                color: shards === n ? '#fff' : '#555',
                fontWeight: shards === n ? 700 : 400,
                fontSize: '1rem',
              }}
            >
              {n}
            </button>
          ))}
        </div>

        <button
          onClick={runSimulation}
          disabled={running}
          style={{
            border: 'none',
            borderRadius: '8px',
            padding: '8px 20px',
            cursor: running ? 'not-allowed' : 'pointer',
            background: running ? '#ccc' : '#2E7D32',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.9rem',
          }}
        >
          {running ? '⏳ Выполняется...' : '▶ Запустить симуляцию'}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div style={{ background: '#F5F5F5', borderRadius: '10px', padding: '1rem 1.25rem', flex: '1', minWidth: '150px' }}>
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '4px' }}>Последовательно (1 шард)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#D32F2F' }}>{sequentialTime} сек</div>
        </div>
        <div style={{ background: '#E8F5E9', borderRadius: '10px', padding: '1rem 1.25rem', flex: '1', minWidth: '150px' }}>
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '4px' }}>Параллельно ({shards} шардов)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2E7D32' }}>{parallelTime} сек</div>
        </div>
        <div style={{ background: '#E3F2FD', borderRadius: '10px', padding: '1rem 1.25rem', flex: '1', minWidth: '150px' }}>
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '4px' }}>Экономия времени</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1565C0' }}>{savings}%</div>
        </div>
      </div>

      {/* Shard visualization */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '8px' }}>
          Распределение тестов по шардам:
        </div>
        {distribution.map((tests, si) => {
          const color = SHARD_COLORS[si % SHARD_COLORS.length]
          const shardTime = shardTimes[si]
          const p = progress[si] ?? 0
          return (
            <div key={si} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: color.text,
                  width: '80px',
                  flexShrink: 0,
                }}>
                  Шард {si + 1}/{shards}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#888', width: '50px', flexShrink: 0 }}>
                  {shardTime} сек
                </div>
                <div style={{
                  flex: 1,
                  display: 'flex',
                  gap: '3px',
                  flexWrap: 'wrap',
                  background: color.bg,
                  border: `1px solid ${color.border}`,
                  borderRadius: '6px',
                  padding: '4px 6px',
                }}>
                  {tests.map(t => (
                    <div key={t.id} style={{
                      background: color.border,
                      borderRadius: '3px',
                      padding: '2px 6px',
                      fontSize: '0.7rem',
                      color: color.text,
                      fontFamily: 'monospace',
                      whiteSpace: 'nowrap',
                    }}>
                      {t.name} ({t.duration}s)
                    </div>
                  ))}
                </div>
              </div>
              {/* Progress bar */}
              {(running || p === 100) && (
                <div style={{ paddingLeft: '138px' }}>
                  <div style={{
                    height: '4px',
                    background: '#eee',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${p}%`,
                      background: p === 100 ? '#4CAF50' : color.text,
                      transition: 'width 0.1s linear',
                      borderRadius: '2px',
                    }} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* YAML */}
      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '6px' }}>
        GitLab CI конфигурация:
      </div>
      <div style={{
        background: '#1E1E1E',
        borderRadius: '8px',
        padding: '1rem',
        fontSize: '0.78rem',
        fontFamily: 'monospace',
        color: '#D4D4D4',
        whiteSpace: 'pre',
        overflow: 'auto',
      }}>
        {parallelYaml}
      </div>
    </div>
  )
}
