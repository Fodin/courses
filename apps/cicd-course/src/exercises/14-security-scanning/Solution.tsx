// ============================================
// Level 14: Security Scanning — Solutions
// ============================================

import { useState, useEffect } from 'react'

// ============================================
// Task 14.1: SAST — Static Application Security Testing
// ============================================

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', analyzer: 'eslint', icon: 'JS' },
  { id: 'python', label: 'Python', analyzer: 'bandit', icon: 'PY' },
  { id: 'go', label: 'Go', analyzer: 'gosec', icon: 'GO' },
]

const ANALYZER_TABLE = [
  { lang: 'JavaScript', tool: 'eslint + semgrep', finds: 'XSS, prototype pollution, eval injection' },
  { lang: 'Python', tool: 'bandit', finds: 'SQL injection, hardcoded secrets, unsafe deserialization' },
  { lang: 'Go', tool: 'gosec', finds: 'Race conditions, weak crypto, path traversal' },
  { lang: 'Все языки', tool: 'semgrep', finds: 'OWASP Top 10, кастомные правила' },
]

const EXCLUDE_OPTIONS = ['spec', 'test', 'tests', 'vendor', 'node_modules', 'fixtures']

function buildSastYaml(
  language: string,
  mode: 'template' | 'manual',
  excludedPaths: string[],
  semgrepRules: string,
  allowFailure: boolean
): string {
  const analyzer = LANGUAGES.find(l => l.id === language)?.analyzer ?? 'semgrep'
  const excluded = excludedPaths.length > 0 ? excludedPaths.join(',') : 'spec,test'

  if (mode === 'template') {
    return `include:
  - template: Security/SAST.gitlab-ci.yml

variables:
  SAST_ANALYZERS: '${analyzer}'
  SAST_EXCLUDED_PATHS: '${excluded}'`
  }

  return `sast:
  stage: security
  image: semgrep/semgrep
  script:
    - semgrep --config=${semgrepRules}
        --json --output=gl-sast-report.json .
  variables:
    SAST_EXCLUDED_PATHS: '${excluded}'
  artifacts:
    reports:
      sast: gl-sast-report.json
    when: always
    expire_in: 1 week
  allow_failure: ${allowFailure}
  rules:
    - if: $CI_PIPELINE_SOURCE == 'merge_request_event'
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH`
}

export function Task14_1_Solution() {
  const [language, setLanguage] = useState('javascript')
  const [mode, setMode] = useState<'template' | 'manual'>('template')
  const [excludedPaths, setExcludedPaths] = useState<string[]>(['spec', 'test'])
  const [semgrepRules, setSemgrepRules] = useState('p/owasp-top-ten')
  const [allowFailure, setAllowFailure] = useState(true)

  const togglePath = (path: string) => {
    setExcludedPaths(prev =>
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    )
  }

  const yaml = buildSastYaml(language, mode, excludedPaths, semgrepRules, allowFailure)

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>SAST: статический анализ кода</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Настрой SAST-сканирование и получи готовый конфиг для GitLab CI
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Left controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Language */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Язык</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {LANGUAGES.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)}
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '6px',
                    border: `2px solid ${language === lang.id ? '#1565C0' : '#ccc'}`,
                    background: language === lang.id ? '#E3F2FD' : 'white',
                    color: language === lang.id ? '#1565C0' : '#444',
                    cursor: 'pointer',
                    fontWeight: language === lang.id ? 600 : 400,
                    fontSize: '0.85rem',
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mode */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Режим подключения</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['template', 'manual'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '6px',
                    border: `2px solid ${mode === m ? '#2E7D32' : '#ccc'}`,
                    background: mode === m ? '#E8F5E9' : 'white',
                    color: mode === m ? '#2E7D32' : '#444',
                    cursor: 'pointer',
                    fontWeight: mode === m ? 600 : 400,
                    fontSize: '0.85rem',
                  }}
                >
                  {m === 'template' ? 'GitLab шаблон' : 'Ручная настройка'}
                </button>
              ))}
            </div>
          </div>

          {/* Semgrep rules (manual only) */}
          {mode === 'manual' && (
            <div>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                SEMGREP_RULES
              </div>
              <input
                value={semgrepRules}
                onChange={e => setSemgrepRules(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  border: '1.5px solid #90CAF9',
                  fontSize: '0.85rem',
                  fontFamily: 'monospace',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ color: '#888', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                Примеры: p/owasp-top-ten, p/javascript, auto
              </div>
            </div>
          )}

          {/* Excluded paths */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              SAST_EXCLUDED_PATHS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {EXCLUDE_OPTIONS.map(path => (
                <label
                  key={path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    background: excludedPaths.includes(path) ? '#FFF8E1' : '#f5f5f5',
                    border: `1px solid ${excludedPaths.includes(path) ? '#FFD54F' : '#ddd'}`,
                  }}
                >
                  <input
                    type='checkbox'
                    checked={excludedPaths.includes(path)}
                    onChange={() => togglePath(path)}
                  />
                  {path}
                </label>
              ))}
            </div>
          </div>

          {/* allow_failure */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              allow_failure
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                onClick={() => setAllowFailure(true)}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '6px',
                  border: `2px solid ${allowFailure ? '#2E7D32' : '#ccc'}`,
                  background: allowFailure ? '#E8F5E9' : 'white',
                  color: allowFailure ? '#2E7D32' : '#444',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                true
              </button>
              <button
                onClick={() => setAllowFailure(false)}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '6px',
                  border: `2px solid ${!allowFailure ? '#C62828' : '#ccc'}`,
                  background: !allowFailure ? '#FFEBEE' : 'white',
                  color: !allowFailure ? '#C62828' : '#444',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                false
              </button>
            </div>
            {!allowFailure && (
              <div style={{
                marginTop: '0.5rem',
                padding: '0.5rem 0.75rem',
                background: '#FFEBEE',
                border: '1px solid #EF9A9A',
                borderRadius: '6px',
                fontSize: '0.8rem',
                color: '#C62828',
              }}>
                Все MR будут заблокированы при обнаружении уязвимостей. Рекомендуется начинать с true.
              </div>
            )}
          </div>
        </div>

        {/* YAML output */}
        <div>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Сгенерированный конфиг
          </div>
          <pre style={{
            background: '#1e1e2e',
            color: '#cdd6f4',
            padding: '1rem',
            borderRadius: '8px',
            fontSize: '0.78rem',
            lineHeight: 1.6,
            overflowX: 'auto',
            margin: 0,
            minHeight: '260px',
          }}>
            {yaml}
          </pre>
        </div>
      </div>

      {/* Analyzer table */}
      <div>
        <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
          Анализаторы по языкам
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#F5F5F5' }}>
              {['Язык', 'Инструмент', 'Что находит'].map(h => (
                <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ANALYZER_TABLE.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
                <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #ddd', fontWeight: 500 }}>{row.lang}</td>
                <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #ddd', fontFamily: 'monospace', color: '#1565C0' }}>{row.tool}</td>
                <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #ddd', color: '#555' }}>{row.finds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================
// Task 14.2: Dependency Scanning + Container Scanning
// ============================================

type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

interface Vulnerability {
  id: string
  name: string
  severity: Severity
  source: 'deps' | 'os'
  pkg: string
  fixed: boolean
}

const MOCK_VULNS: Vulnerability[] = [
  { id: 'CVE-2021-23337', name: 'Prototype Pollution', severity: 'HIGH', source: 'deps', pkg: 'lodash@4.17.4', fixed: true },
  { id: 'CVE-2022-0536', name: 'Path Traversal', severity: 'MEDIUM', source: 'deps', pkg: 'follow-redirects@1.14.7', fixed: true },
  { id: 'CVE-2023-28858', name: 'Timing Attack', severity: 'LOW', source: 'deps', pkg: 'redis@3.1.2', fixed: true },
  { id: 'CVE-2023-0286', name: 'OpenSSL Buffer Overflow', severity: 'CRITICAL', source: 'os', pkg: 'openssl@1.1.1n', fixed: true },
  { id: 'CVE-2022-37434', name: 'Zlib Heap Overflow', severity: 'CRITICAL', source: 'os', pkg: 'zlib@1.2.11', fixed: false },
  { id: 'CVE-2023-29383', name: 'Shadow Misparse', severity: 'LOW', source: 'os', pkg: 'shadow@4.8.1', fixed: false },
]

const SEVERITY_ORDER: Record<Severity, number> = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 }
const SEVERITY_COLORS: Record<Severity, { bg: string; color: string; border: string }> = {
  LOW: { bg: '#E8F5E9', color: '#2E7D32', border: '#A5D6A7' },
  MEDIUM: { bg: '#FFF8E1', color: '#F57F17', border: '#FFD54F' },
  HIGH: { bg: '#FFF3E0', color: '#E65100', border: '#FFCC80' },
  CRITICAL: { bg: '#FFEBEE', color: '#B71C1C', border: '#EF9A9A' },
}

const LAYER_DATA = [
  { label: 'Код приложения', pct: 5, color: '#4CAF50', tool: 'SAST', desc: 'Анализирует исходный код на уязвимые паттерны (инъекции, небезопасные функции)' },
  { label: 'Зависимости npm/pip', pct: 30, color: '#2196F3', tool: 'Dependency Scanning', desc: 'Проверяет lock-файлы по базе CVE. Находит уязвимые версии пакетов.' },
  { label: 'OS пакеты (Ubuntu/Alpine)', pct: 65, color: '#9C27B0', tool: 'Container Scanning', desc: 'Сканирует установленные системные пакеты внутри Docker-образа.' },
]

export function Task14_2_Solution() {
  const [scanned, setScanned] = useState(false)
  const [threshold, setThreshold] = useState<Severity>('HIGH')
  const [ignoreUnfixed, setIgnoreUnfixed] = useState(false)
  const [activeLayer, setActiveLayer] = useState<number | null>(null)

  const visibleVulns = MOCK_VULNS.filter(v => {
    if (ignoreUnfixed && !v.fixed) return false
    return true
  })

  const blockedVulns = visibleVulns.filter(v => SEVERITY_ORDER[v.severity] >= SEVERITY_ORDER[threshold])
  const depsVulns = visibleVulns.filter(v => v.source === 'deps')
  const osVulns = visibleVulns.filter(v => v.source === 'os')

  const yaml = `dependency-scanning:
  stage: security
  image: aquasec/trivy:latest
  script:
    - trivy fs --format template
        --template "@/contrib/gitlab.tpl"
        --output gl-dependency-scanning-report.json
        --severity ${threshold},CRITICAL .
  artifacts:
    reports:
      dependency_scanning: gl-dependency-scanning-report.json

container-scanning:
  stage: security
  image: aquasec/trivy:latest
  script:
    - trivy image
        --severity ${threshold},CRITICAL${ignoreUnfixed ? '\n        --ignore-unfixed' : ''}
        --output gl-container-scanning-report.json
        $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  artifacts:
    reports:
      container_scanning: gl-container-scanning-report.json`

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Dependency & Container Scanning</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Два инструмента для разных слоёв приложения
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Layer diagram */}
        <div>
          <div style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>
            Слои Docker-образа (кликни на слой)
          </div>
          <div style={{ border: '2px solid #ddd', borderRadius: '8px', overflow: 'hidden', marginBottom: '0.5rem' }}>
            {LAYER_DATA.map((layer, i) => (
              <div
                key={i}
                onClick={() => setActiveLayer(activeLayer === i ? null : i)}
                style={{
                  height: `${layer.pct * 1.2 + 30}px`,
                  background: activeLayer === i ? layer.color : layer.color + '33',
                  borderBottom: i < LAYER_DATA.length - 1 ? '2px dashed #ddd' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 1rem',
                  gap: '0.75rem',
                  transition: 'background 0.2s',
                }}
              >
                <span style={{ fontWeight: 700, color: layer.color, minWidth: '2.5rem', fontSize: '0.9rem' }}>
                  {layer.pct}%
                </span>
                <span style={{ fontWeight: 500, fontSize: '0.85rem' }}>{layer.label}</span>
                <span style={{
                  marginLeft: 'auto',
                  background: layer.color + '22',
                  border: `1px solid ${layer.color}`,
                  color: layer.color,
                  borderRadius: '4px',
                  padding: '0.15rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}>
                  {layer.tool}
                </span>
              </div>
            ))}
          </div>
          {activeLayer !== null && (
            <div style={{
              padding: '0.75rem',
              background: LAYER_DATA[activeLayer].color + '11',
              border: `1px solid ${LAYER_DATA[activeLayer].color}44`,
              borderRadius: '6px',
              fontSize: '0.85rem',
              color: '#444',
            }}>
              <strong style={{ color: LAYER_DATA[activeLayer].color }}>{LAYER_DATA[activeLayer].tool}:</strong>{' '}
              {LAYER_DATA[activeLayer].desc}
            </div>
          )}
        </div>

        {/* Scanner controls + results */}
        <div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setScanned(true)}
              style={{
                padding: '0.5rem 1.25rem',
                background: '#1565C0',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              Сканировать
            </button>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type='checkbox'
                checked={ignoreUnfixed}
                onChange={e => setIgnoreUnfixed(e.target.checked)}
              />
              --ignore-unfixed
            </label>
          </div>

          {/* Threshold */}
          <div style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 500, marginRight: '0.5rem' }}>Порог блокировки:</span>
            {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as Severity[]).map(s => {
              const colors = SEVERITY_COLORS[s]
              return (
                <button
                  key={s}
                  onClick={() => setThreshold(s)}
                  style={{
                    marginRight: '0.4rem',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '4px',
                    border: `2px solid ${threshold === s ? colors.border : '#ddd'}`,
                    background: threshold === s ? colors.bg : 'white',
                    color: threshold === s ? colors.color : '#666',
                    cursor: 'pointer',
                    fontWeight: threshold === s ? 700 : 400,
                    fontSize: '0.78rem',
                  }}
                >
                  {s}
                </button>
              )
            })}
          </div>

          {scanned && (
            <>
              {/* Summary */}
              <div style={{
                padding: '0.5rem 0.75rem',
                background: blockedVulns.length > 0 ? '#FFEBEE' : '#E8F5E9',
                border: `1px solid ${blockedVulns.length > 0 ? '#EF9A9A' : '#A5D6A7'}`,
                borderRadius: '6px',
                fontSize: '0.85rem',
                marginBottom: '0.75rem',
                color: blockedVulns.length > 0 ? '#B71C1C' : '#2E7D32',
                fontWeight: 600,
              }}>
                Заблокирует: {blockedVulns.length} из {visibleVulns.length} уязвимостей
                {ignoreUnfixed && ` (${MOCK_VULNS.length - visibleVulns.length} без патча скрыто)`}
              </div>

              {/* Deps */}
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1565C0', marginBottom: '0.35rem' }}>
                Dependency Scanning ({depsVulns.length})
              </div>
              {depsVulns.map(v => {
                const colors = SEVERITY_COLORS[v.severity]
                const blocked = SEVERITY_ORDER[v.severity] >= SEVERITY_ORDER[threshold]
                return (
                  <div key={v.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.3rem 0.5rem',
                    marginBottom: '0.25rem',
                    borderRadius: '5px',
                    background: blocked ? colors.bg : '#f9f9f9',
                    border: `1px solid ${blocked ? colors.border : '#eee'}`,
                    opacity: ignoreUnfixed && !v.fixed ? 0.4 : 1,
                  }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: colors.color,
                      background: colors.bg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '3px',
                      padding: '0.1rem 0.35rem',
                      minWidth: '60px',
                      textAlign: 'center',
                    }}>{v.severity}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#333' }}>{v.pkg}</span>
                    <span style={{ color: '#666', fontSize: '0.78rem', marginLeft: 'auto' }}>{v.name}</span>
                    {!v.fixed && <span style={{ fontSize: '0.7rem', color: '#999' }}>нет патча</span>}
                  </div>
                )
              })}

              {/* OS */}
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#6A1B9A', marginBottom: '0.35rem', marginTop: '0.75rem' }}>
                Container Scanning ({osVulns.length})
              </div>
              {osVulns.map(v => {
                const colors = SEVERITY_COLORS[v.severity]
                const blocked = SEVERITY_ORDER[v.severity] >= SEVERITY_ORDER[threshold]
                return (
                  <div key={v.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.3rem 0.5rem',
                    marginBottom: '0.25rem',
                    borderRadius: '5px',
                    background: blocked ? colors.bg : '#f9f9f9',
                    border: `1px solid ${blocked ? colors.border : '#eee'}`,
                    opacity: ignoreUnfixed && !v.fixed ? 0.4 : 1,
                  }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: colors.color,
                      background: colors.bg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '3px',
                      padding: '0.1rem 0.35rem',
                      minWidth: '60px',
                      textAlign: 'center',
                    }}>{v.severity}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#333' }}>{v.pkg}</span>
                    <span style={{ color: '#666', fontSize: '0.78rem', marginLeft: 'auto' }}>{v.name}</span>
                    {!v.fixed && <span style={{ fontSize: '0.7rem', color: '#999' }}>нет патча</span>}
                  </div>
                )
              })}
            </>
          )}
        </div>
      </div>

      {/* YAML */}
      <div>
        <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Конфигурация</div>
        <pre style={{
          background: '#1e1e2e',
          color: '#cdd6f4',
          padding: '1rem',
          borderRadius: '8px',
          fontSize: '0.78rem',
          lineHeight: 1.6,
          overflowX: 'auto',
          margin: 0,
        }}>
          {yaml}
        </pre>
      </div>
    </div>
  )
}

// ============================================
// Task 14.3: DAST + Secret Detection + Full Pipeline
// ============================================

const SECRET_PATTERNS: { pattern: string; label: string; example: string }[] = [
  { pattern: 'AKIA', label: 'AWS Access Key', example: 'AKIAIOSFODNN7EXAMPLE' },
  { pattern: 'sk_live_', label: 'Stripe API Key', example: 'sk_live_1234567890abcdef' },
  { pattern: '-----BEGIN RSA PRIVATE KEY-----', label: 'RSA Private Key', example: '-----BEGIN RSA PRIVATE KEY-----' },
  { pattern: 'password=', label: 'Hardcoded Password', example: 'password=mysecret123' },
  { pattern: 'token=', label: 'Hardcoded Token', example: 'token=ghp_abcdef123456' },
  { pattern: 'DATABASE_URL=postgres://', label: 'Database URL with credentials', example: 'DATABASE_URL=postgres://user:pass@host/db' },
]

interface DastRequest {
  path: string
  status: 'checking' | 'ok' | 'warning' | 'critical'
  finding?: string
}

const DAST_SCAN_SEQUENCE: DastRequest[] = [
  { path: '/login', status: 'ok' },
  { path: '/api/users', status: 'warning', finding: 'Missing X-Content-Type-Options header' },
  { path: '/admin', status: 'critical', finding: 'Unauthenticated access to admin endpoint' },
  { path: '/api/search?q=test', status: 'warning', finding: 'Reflected parameter in response' },
]

const PIPELINE_TOOLS = [
  { id: 'sast', label: 'SAST', template: 'Security/SAST.gitlab-ci.yml', stage: 'security-static' },
  { id: 'deps', label: 'Dependency Scanning', template: 'Security/Dependency-Scanning.gitlab-ci.yml', stage: 'security-static' },
  { id: 'container', label: 'Container Scanning', template: 'Security/Container-Scanning.gitlab-ci.yml', stage: 'security-static' },
  { id: 'secrets', label: 'Secret Detection', template: 'Security/Secret-Detection.gitlab-ci.yml', stage: 'security-static' },
  { id: 'dast', label: 'DAST', template: 'Security/DAST.gitlab-ci.yml', stage: 'security-dynamic' },
]

const COVERAGE_MATRIX = [
  { tool: 'SAST', codeInject: true, depCve: false, containerCve: false, secrets: false },
  { tool: 'Dependency Scanning', codeInject: false, depCve: true, containerCve: false, secrets: false },
  { tool: 'Container Scanning', codeInject: false, depCve: false, containerCve: true, secrets: false },
  { tool: 'Secret Detection', codeInject: false, depCve: false, containerCve: false, secrets: true },
  { tool: 'DAST', codeInject: true, depCve: false, containerCve: false, secrets: false },
]

function buildPipelineYaml(enabledTools: string[]): string {
  if (enabledTools.length === 0) return '# Выберите инструменты выше'

  const templates = PIPELINE_TOOLS
    .filter(t => enabledTools.includes(t.id))
    .map(t => `  - template: ${t.template}`)
    .join('\n')

  const hasDynamic = enabledTools.includes('dast')
  const stages = hasDynamic
    ? "stages:\n  - build\n  - security-static\n  - deploy\n  - security-dynamic"
    : "stages:\n  - build\n  - security-static\n  - deploy"

  return `${stages}

include:
${templates}

variables:
  SAST_EXCLUDED_PATHS: 'spec,test,vendor'
  CS_IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA${hasDynamic ? '\n  DAST_WEBSITE: $REVIEW_APP_URL' : ''}`
}

export function Task14_3_Solution() {
  const [codeInput, setCodeInput] = useState('')
  const [dastUrl, setDastUrl] = useState('https://staging.example.com')
  const [dastMode, setDastMode] = useState<'baseline' | 'full-scan'>('baseline')
  const [dastRequests, setDastRequests] = useState<DastRequest[]>([])
  const [scanning, setScanning] = useState(false)
  const [enabledTools, setEnabledTools] = useState<string[]>(['sast', 'secrets'])

  const foundSecrets = SECRET_PATTERNS.filter(p => codeInput.includes(p.pattern))

  const toggleTool = (id: string) => {
    setEnabledTools(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])
  }

  const runDastScan = () => {
    setScanning(true)
    setDastRequests([])
    DAST_SCAN_SEQUENCE.forEach((req, i) => {
      setTimeout(() => {
        setDastRequests(prev => [...prev, { ...req, status: 'checking' }])
        setTimeout(() => {
          setDastRequests(prev => prev.map((r, ri) => ri === prev.length - 1 ? { ...req } : r))
          if (i === DAST_SCAN_SEQUENCE.length - 1) setScanning(false)
        }, 600)
      }, i * 900)
    })
  }

  const pipelineYaml = buildPipelineYaml(enabledTools)

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>DAST и Secret Detection</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Обнаружение секретов в коде и динамическое сканирование приложения
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Secret Detection */}
        <div>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Secret Detection — введи код с секретом
          </div>
          <textarea
            value={codeInput}
            onChange={e => setCodeInput(e.target.value)}
            placeholder={'Попробуй:\nAWS_KEY=AKIAIOSFODNN7EXAMPLE\npassword=mysecret123\nsk_live_abcdef123456'}
            style={{
              width: '100%',
              height: '120px',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              padding: '0.75rem',
              borderRadius: '6px',
              border: foundSecrets.length > 0 ? '2px solid #EF9A9A' : '2px solid #ddd',
              resize: 'vertical',
              boxSizing: 'border-box',
              background: foundSecrets.length > 0 ? '#FFF8F8' : 'white',
            }}
          />

          {foundSecrets.length > 0 && (
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{
                padding: '0.5rem 0.75rem',
                background: '#FFEBEE',
                border: '1px solid #EF9A9A',
                borderRadius: '6px',
                marginBottom: '0.5rem',
                fontWeight: 600,
                color: '#B71C1C',
                fontSize: '0.85rem',
              }}>
                Обнаружено {foundSecrets.length} секрет{foundSecrets.length > 1 ? 'а' : ''}
              </div>
              {foundSecrets.map(s => (
                <div key={s.pattern} style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'flex-start',
                  padding: '0.4rem 0.6rem',
                  background: '#FFF3E0',
                  border: '1px solid #FFCC80',
                  borderRadius: '5px',
                  marginBottom: '0.25rem',
                  fontSize: '0.82rem',
                }}>
                  <span style={{ color: '#E65100', fontWeight: 700 }}>!</span>
                  <div>
                    <div style={{ fontWeight: 600, color: '#BF360C' }}>{s.label}</div>
                    <div style={{ color: '#666', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      Паттерн: {s.pattern}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {codeInput.length > 0 && foundSecrets.length === 0 && (
            <div style={{
              marginTop: '0.5rem',
              padding: '0.5rem 0.75rem',
              background: '#E8F5E9',
              border: '1px solid #A5D6A7',
              borderRadius: '6px',
              fontSize: '0.85rem',
              color: '#2E7D32',
            }}>
              Секретов не обнаружено
            </div>
          )}
        </div>

        {/* DAST */}
        <div>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            DAST — динамическое сканирование
          </div>

          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.82rem', color: '#555', display: 'block', marginBottom: '0.25rem' }}>
              TARGET_URL
            </label>
            <input
              value={dastUrl}
              onChange={e => setDastUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                border: '1.5px solid #90CAF9',
                fontSize: '0.85rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.82rem', color: '#555', marginBottom: '0.25rem' }}>Режим сканирования</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['baseline', 'full-scan'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setDastMode(m)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '6px',
                    border: `2px solid ${dastMode === m ? (m === 'full-scan' ? '#C62828' : '#2E7D32') : '#ccc'}`,
                    background: dastMode === m ? (m === 'full-scan' ? '#FFEBEE' : '#E8F5E9') : 'white',
                    color: dastMode === m ? (m === 'full-scan' ? '#C62828' : '#2E7D32') : '#444',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: dastMode === m ? 600 : 400,
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
            {dastMode === 'full-scan' && (
              <div style={{
                marginTop: '0.4rem',
                padding: '0.4rem 0.6rem',
                background: '#FFEBEE',
                border: '1px solid #EF9A9A',
                borderRadius: '5px',
                fontSize: '0.78rem',
                color: '#C62828',
              }}>
                Активное сканирование: пробует реальные атаки. Может изменить данные в БД. Не использовать на production!
              </div>
            )}
          </div>

          <button
            onClick={runDastScan}
            disabled={scanning}
            style={{
              padding: '0.5rem 1.25rem',
              background: scanning ? '#ccc' : '#1565C0',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: scanning ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              marginBottom: '0.75rem',
            }}
          >
            {scanning ? 'Сканирование...' : 'Запустить сканирование'}
          </button>

          {dastRequests.length > 0 && (
            <div>
              {dastRequests.map((req, i) => {
                const statusConfig = {
                  checking: { color: '#999', bg: '#f5f5f5', label: '...' },
                  ok: { color: '#2E7D32', bg: '#E8F5E9', label: 'OK' },
                  warning: { color: '#F57F17', bg: '#FFF8E1', label: 'WARN' },
                  critical: { color: '#B71C1C', bg: '#FFEBEE', label: 'CRIT' },
                }[req.status]

                return (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    padding: '0.35rem 0.6rem',
                    marginBottom: '0.25rem',
                    borderRadius: '5px',
                    background: statusConfig.bg,
                    border: `1px solid ${statusConfig.color}44`,
                    fontSize: '0.82rem',
                  }}>
                    <span style={{
                      fontWeight: 700,
                      color: statusConfig.color,
                      minWidth: '40px',
                      fontSize: '0.75rem',
                    }}>
                      {statusConfig.label}
                    </span>
                    <div>
                      <span style={{ fontFamily: 'monospace', color: '#333' }}>{req.path}</span>
                      {req.finding && req.status !== 'checking' && (
                        <div style={{ color: '#666', fontSize: '0.75rem' }}>{req.finding}</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Pipeline constructor */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>
          Конструктор security pipeline
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {PIPELINE_TOOLS.map(tool => (
            <label
              key={tool.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                border: `2px solid ${enabledTools.includes(tool.id) ? '#1565C0' : '#ccc'}`,
                background: enabledTools.includes(tool.id) ? '#E3F2FD' : 'white',
                fontSize: '0.82rem',
                fontWeight: enabledTools.includes(tool.id) ? 600 : 400,
                color: enabledTools.includes(tool.id) ? '#1565C0' : '#555',
              }}
            >
              <input
                type='checkbox'
                checked={enabledTools.includes(tool.id)}
                onChange={() => toggleTool(tool.id)}
                style={{ display: 'none' }}
              />
              {tool.label}
            </label>
          ))}
        </div>

        <pre style={{
          background: '#1e1e2e',
          color: '#cdd6f4',
          padding: '1rem',
          borderRadius: '8px',
          fontSize: '0.78rem',
          lineHeight: 1.6,
          overflowX: 'auto',
          margin: 0,
        }}>
          {pipelineYaml}
        </pre>
      </div>

      {/* Coverage matrix */}
      <div>
        <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
          Матрица покрытия
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ background: '#F5F5F5' }}>
              <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Инструмент</th>
              {['Code Injection', 'Dependency CVE', 'Container CVE', 'Leaked Secrets'].map(h => (
                <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'center', border: '1px solid #ddd' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COVERAGE_MATRIX.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
                <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #ddd', fontWeight: 500 }}>{row.tool}</td>
                {[row.codeInject, row.depCve, row.containerCve, row.secrets].map((covered, j) => (
                  <td key={j} style={{
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #ddd',
                    textAlign: 'center',
                    background: covered ? '#E8F5E9' : 'transparent',
                    color: covered ? '#2E7D32' : '#ccc',
                    fontWeight: covered ? 700 : 400,
                    fontSize: '1rem',
                  }}>
                    {covered ? '✓' : '−'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
