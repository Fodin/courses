// ============================================
// Level 15: Releases and Versioning — Solutions
// ============================================

import { useState, useRef } from 'react'

// ============================================
// Task 15.1: Semantic Versioning and git tags
// ============================================

type CommitType = 'feat!' | 'feat' | 'fix'

interface SemVer {
  major: number
  minor: number
  patch: number
}

interface CommitEntry {
  id: number
  type: CommitType
  message: string
  sha: string
}

const COMMIT_DESCRIPTIONS: Record<CommitType, string[]> = {
  'feat!': [
    'переписать API аутентификации',
    'удалить устаревший метод getUserById()',
    'мигрировать на новый формат конфига',
  ],
  'feat': [
    'добавить авторизацию через Google',
    'реализовать экспорт в PDF',
    'поддержать тёмную тему',
  ],
  'fix': [
    'исправить утечку памяти в worker',
    'корректно обрабатывать 429 ошибки',
    'исправить краш при logout',
  ],
}

const COMMIT_COLORS: Record<CommitType, { bg: string; text: string; label: string; border: string }> = {
  'feat!': { bg: '#FFF3E0', text: '#E65100', label: 'MAJOR', border: '#FFCC80' },
  'feat':  { bg: '#E8F5E9', text: '#2E7D32', label: 'MINOR', border: '#A5D6A7' },
  'fix':   { bg: '#E3F2FD', text: '#1565C0', label: 'PATCH', border: '#90CAF9' },
}

function randomSha() {
  return Math.random().toString(16).slice(2, 9)
}

function bumpVersion(ver: SemVer, type: CommitType): SemVer {
  if (type === 'feat!') return { major: ver.major + 1, minor: 0, patch: 0 }
  if (type === 'feat')  return { major: ver.major, minor: ver.minor + 1, patch: 0 }
  return { major: ver.major, minor: ver.minor, patch: ver.patch + 1 }
}

function formatVersion(v: SemVer) {
  return `v${v.major}.${v.minor}.${v.patch}`
}

function buildTagYaml(tag: string) {
  return `release:
  stage: release
  image: registry.gitlab.com/gitlab-org/release-cli:latest
  rules:
    - if: '$CI_COMMIT_TAG =~ /^v\\d+\\.\\d+\\.\\d+$/'
  script:
    - echo "Releasing ${tag}"
  release:
    tag_name: '$CI_COMMIT_TAG'
    name: 'Release ${tag}'
    description: './CHANGELOG.md'`
}

export function Task15_1_Solution() {
  const [version, setVersion] = useState<SemVer>({ major: 0, minor: 1, patch: 0 })
  const [logs, setLogs] = useState<CommitEntry[]>([])
  const [tagCreated, setTagCreated] = useState(false)
  const [highlight, setHighlight] = useState(false)
  const [tagVersion, setTagVersion] = useState<SemVer | null>(null)
  const counterRef = useRef(0)

  const handleCommit = (type: CommitType) => {
    const newVer = bumpVersion(version, type)
    const descs = COMMIT_DESCRIPTIONS[type]
    const msg = descs[counterRef.current % descs.length]
    counterRef.current += 1

    const entry: CommitEntry = { id: Date.now(), type, message: `${type}: ${msg}`, sha: randomSha() }
    setLogs(prev => [entry, ...prev].slice(0, 6))
    setVersion(newVer)
    setTagCreated(false)
    setHighlight(true)
    setTimeout(() => setHighlight(false), 800)
  }

  const handleCreateTag = () => {
    setTagCreated(true)
    setTagVersion({ ...version })
  }

  const tag = formatVersion(tagVersion ?? version)
  const currentTag = formatVersion(version)
  const col = highlight ? '#4CAF50' : '#1565C0'

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '860px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Semantic Versioning и git tags</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Нажимай кнопки коммитов, чтобы увеличивать версию, затем создавай тег
      </p>

      {/* Version display */}
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        background: '#F8F9FA',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        border: '2px solid #E0E0E0',
      }}>
        <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>
          ТЕКУЩАЯ ВЕРСИЯ
        </div>
        <div style={{
          fontSize: '3rem',
          fontWeight: 700,
          color: col,
          fontFamily: 'monospace',
          transition: 'color 0.3s',
          letterSpacing: '-0.02em',
        }}>
          {currentTag}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '0.75rem' }}>
          {(['major', 'minor', 'patch'] as const).map(part => (
            <div key={part} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#333', fontFamily: 'monospace' }}>
                {version[part]}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#999', textTransform: 'uppercase' }}>{part}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Commit buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {(['feat!', 'feat', 'fix'] as CommitType[]).map(type => {
          const c = COMMIT_COLORS[type]
          return (
            <button
              key={type}
              onClick={() => handleCommit(type)}
              style={{
                flex: 1,
                minWidth: '180px',
                padding: '0.75rem 1rem',
                background: c.bg,
                border: `2px solid ${c.border}`,
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ fontFamily: 'monospace', fontWeight: 700, color: c.text, fontSize: '0.95rem' }}>
                {type}:
              </div>
              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.2rem' }}>
                {c.label} bump — {type === 'feat!' ? 'breaking change' : type === 'feat' ? 'новая функция' : 'исправление бага'}
              </div>
            </button>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Commit log */}
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#555', marginBottom: '0.5rem' }}>
            Лог коммитов
          </div>
          <div style={{ border: '1px solid #E0E0E0', borderRadius: '8px', overflow: 'hidden', minHeight: '150px' }}>
            {logs.length === 0 && (
              <div style={{ padding: '1rem', color: '#999', fontSize: '0.85rem', textAlign: 'center' }}>
                Нет коммитов
              </div>
            )}
            {logs.map(entry => {
              const c = COMMIT_COLORS[entry.type]
              return (
                <div key={entry.id} style={{
                  padding: '0.5rem 0.75rem',
                  borderBottom: '1px solid #F0F0F0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <span style={{
                    background: c.bg,
                    color: c.text,
                    border: `1px solid ${c.border}`,
                    borderRadius: '4px',
                    padding: '0.1rem 0.4rem',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}>
                    {c.label}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#333', flex: 1 }}>{entry.message}</span>
                  <span style={{ fontSize: '0.7rem', color: '#999', fontFamily: 'monospace' }}>{entry.sha}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tag panel */}
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#555', marginBottom: '0.5rem' }}>
            Git Tag
          </div>
          <div style={{ border: '1px solid #E0E0E0', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#555', marginBottom: '0.75rem' }}>
              git tag -a {currentTag} -m "Release {currentTag}"
            </div>
            <button
              onClick={handleCreateTag}
              disabled={logs.length === 0}
              style={{
                width: '100%',
                padding: '0.6rem',
                background: logs.length === 0 ? '#F5F5F5' : '#1565C0',
                color: logs.length === 0 ? '#BDBDBD' : '#FFF',
                border: 'none',
                borderRadius: '6px',
                cursor: logs.length === 0 ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              Создать тег {currentTag}
            </button>
            {logs.length === 0 && (
              <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.5rem', textAlign: 'center' }}>
                Сначала добавь хотя бы один коммит
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tag result */}
      {tagCreated && tagVersion && (
        <div style={{ background: '#E8F5E9', border: '1px solid #A5D6A7', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 700, color: '#2E7D32', marginBottom: '0.75rem' }}>
            Тег создан — пайплайн запущен
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            {['test', 'build', 'release'].map((stage, i) => (
              <div key={stage} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  background: '#FFF',
                  border: '2px solid #66BB6A',
                  borderRadius: '8px',
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#2E7D32',
                }}>
                  {stage}
                </div>
                {i < 2 && <span style={{ margin: '0 0.25rem', color: '#66BB6A', fontWeight: 700 }}>→</span>}
              </div>
            ))}
          </div>
          <div style={{ background: '#1E1E1E', borderRadius: '6px', padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.8rem', color: '#A5D6A7' }}>
            <div>CI_COMMIT_TAG = <span style={{ color: '#FFE082' }}>{tag}</span></div>
            <div>CI_COMMIT_REF_NAME = <span style={{ color: '#FFE082' }}>{tag}</span></div>
            <div style={{ color: '#888', marginTop: '0.5rem' }}># release pipeline triggered by tag</div>
          </div>
        </div>
      )}

      {/* YAML */}
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#555', marginBottom: '0.5rem' }}>
          Сгенерированный YAML
        </div>
        <pre style={{
          background: '#1E1E1E',
          color: '#D4D4D4',
          padding: '1rem',
          borderRadius: '8px',
          fontSize: '0.8rem',
          margin: 0,
          overflowX: 'auto',
          lineHeight: 1.6,
        }}>
          {buildTagYaml(tagCreated && tagVersion ? tag : currentTag)}
        </pre>
      </div>
    </div>
  )
}

// ============================================
// Task 15.2: GitLab Release and changelog
// ============================================

type LinkType = 'other' | 'image' | 'package' | 'runbook'
type ChangeType = 'feat' | 'fix' | 'chore'

interface ChangeEntry {
  id: number
  type: ChangeType
  text: string
}

interface AssetLink {
  id: number
  name: string
  url: string
  link_type: LinkType
}

const CHANGE_COLORS: Record<ChangeType, { bg: string; text: string; label: string }> = {
  feat:  { bg: '#E8F5E9', text: '#2E7D32', label: 'feat' },
  fix:   { bg: '#E3F2FD', text: '#1565C0', label: 'fix' },
  chore: { bg: '#F3E5F5', text: '#6A1B9A', label: 'chore' },
}

const SECTION_LABELS: Record<ChangeType, string> = {
  feat:  'Features',
  fix:   'Bug Fixes',
  chore: 'Chores',
}

function buildReleaseYaml(tag: string, name: string, assets: AssetLink[]) {
  const assetLines = assets.length > 0
    ? '\n    assets:\n      links:\n' + assets.map(a =>
        `        - name: '${a.name || 'link'}'\n          url: '${a.url || 'https://example.com'}'\n          link_type: '${a.link_type}'`
      ).join('\n')
    : ''
  return `create-release:
  stage: release
  image: registry.gitlab.com/gitlab-org/release-cli:latest
  rules:
    - if: '$CI_COMMIT_TAG =~ /^v\\d+\\.\\d+\\.\\d+$/'
  script:
    - echo "Creating release ${tag}"
  release:
    tag_name: '${tag}'
    name: '${name || `Release ${tag}`}'
    description: './CHANGELOG.md'${assetLines}`
}

let entryIdCounter = 10

export function Task15_2_Solution() {
  const [tagInput, setTagInput] = useState('v1.3.0')
  const [releaseName, setReleaseName] = useState('Release v1.3.0: OAuth и оптимизации')
  const [changes, setChanges] = useState<ChangeEntry[]>([
    { id: 1, type: 'feat', text: 'добавить авторизацию через Google' },
    { id: 2, type: 'feat', text: 'реализовать экспорт в PDF' },
    { id: 3, type: 'fix', text: 'исправить краш при logout' },
  ])
  const [assets, setAssets] = useState<AssetLink[]>([
    { id: 1, name: 'Docker Image', url: 'https://hub.docker.com/r/myapp/backend', link_type: 'image' },
  ])

  const isValidTag = /^v\d+\.\d+\.\d+$/.test(tagInput)

  const addChange = () => {
    entryIdCounter += 1
    setChanges(prev => [...prev, { id: entryIdCounter, type: 'feat', text: 'новое изменение' }])
  }

  const removeChange = (id: number) => setChanges(prev => prev.filter(c => c.id !== id))
  const updateChange = (id: number, field: keyof ChangeEntry, value: string) => {
    setChanges(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  const addAsset = () => {
    entryIdCounter += 1
    setAssets(prev => [...prev, { id: entryIdCounter, name: '', url: '', link_type: 'other' }])
  }
  const removeAsset = (id: number) => setAssets(prev => prev.filter(a => a.id !== id))
  const updateAsset = (id: number, field: keyof AssetLink, value: string) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a))
  }

  // Group changes
  const grouped = (['feat', 'fix', 'chore'] as ChangeType[]).map(type => ({
    type,
    items: changes.filter(c => c.type === type),
  })).filter(g => g.items.length > 0)

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>GitLab Release и changelog</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Заполни параметры релиза — увидишь предпросмотр страницы и YAML конфиг
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Left: inputs */}
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#555', marginBottom: '0.25rem' }}>
              Тег релиза
            </label>
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: `2px solid ${isValidTag ? '#A5D6A7' : '#EF9A9A'}`,
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontFamily: 'monospace',
                boxSizing: 'border-box',
              }}
              placeholder="v1.0.0"
            />
            {!isValidTag && (
              <div style={{ fontSize: '0.75rem', color: '#D32F2F', marginTop: '0.25rem' }}>
                Формат: vMAJOR.MINOR.PATCH (например, v1.3.0)
              </div>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#555', marginBottom: '0.25rem' }}>
              Название релиза
            </label>
            <input
              value={releaseName}
              onChange={e => setReleaseName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #E0E0E0',
                borderRadius: '6px',
                fontSize: '0.9rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Changelog entries */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#555' }}>
                Changelog записи
              </label>
              <button onClick={addChange} style={{
                padding: '0.25rem 0.6rem', background: '#E8F5E9', border: '1px solid #A5D6A7',
                borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', color: '#2E7D32',
              }}>
                + Добавить
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {changes.map(c => (
                <div key={c.id} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <select
                    value={c.type}
                    onChange={e => updateChange(c.id, 'type', e.target.value)}
                    style={{
                      padding: '0.3rem', border: `1px solid ${CHANGE_COLORS[c.type].bg}`,
                      borderRadius: '4px', fontSize: '0.8rem', background: CHANGE_COLORS[c.type].bg,
                      color: CHANGE_COLORS[c.type].text, fontWeight: 600,
                    }}
                  >
                    <option value="feat">feat</option>
                    <option value="fix">fix</option>
                    <option value="chore">chore</option>
                  </select>
                  <input
                    value={c.text}
                    onChange={e => updateChange(c.id, 'text', e.target.value)}
                    style={{
                      flex: 1, padding: '0.3rem 0.5rem',
                      border: '1px solid #E0E0E0', borderRadius: '4px', fontSize: '0.8rem',
                    }}
                  />
                  <button onClick={() => removeChange(c.id)} style={{
                    padding: '0.3rem 0.5rem', background: '#FFEBEE', border: '1px solid #FFCDD2',
                    borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', color: '#C62828',
                  }}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Assets */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#555' }}>Assets</label>
              <button onClick={addAsset} style={{
                padding: '0.25rem 0.6rem', background: '#E3F2FD', border: '1px solid #90CAF9',
                borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', color: '#1565C0',
              }}>
                + Добавить
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {assets.map(a => (
                <div key={a.id} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    value={a.name}
                    onChange={e => updateAsset(a.id, 'name', e.target.value)}
                    placeholder="Название"
                    style={{ flex: 1, minWidth: '80px', padding: '0.3rem 0.5rem', border: '1px solid #E0E0E0', borderRadius: '4px', fontSize: '0.8rem' }}
                  />
                  <input
                    value={a.url}
                    onChange={e => updateAsset(a.id, 'url', e.target.value)}
                    placeholder="https://..."
                    style={{ flex: 2, minWidth: '100px', padding: '0.3rem 0.5rem', border: '1px solid #E0E0E0', borderRadius: '4px', fontSize: '0.8rem' }}
                  />
                  <select
                    value={a.link_type}
                    onChange={e => updateAsset(a.id, 'link_type', e.target.value)}
                    style={{ padding: '0.3rem', border: '1px solid #E0E0E0', borderRadius: '4px', fontSize: '0.8rem' }}
                  >
                    <option value="other">other</option>
                    <option value="image">image</option>
                    <option value="package">package</option>
                    <option value="runbook">runbook</option>
                  </select>
                  <button onClick={() => removeAsset(a.id)} style={{
                    padding: '0.3rem 0.5rem', background: '#FFEBEE', border: '1px solid #FFCDD2',
                    borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', color: '#C62828',
                  }}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: preview */}
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#555', marginBottom: '0.5rem' }}>
            Предпросмотр GitLab Release
          </div>
          <div style={{ border: '1px solid #E0E0E0', borderRadius: '8px', overflow: 'hidden' }}>
            {/* GitLab-style header */}
            <div style={{ background: '#292961', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#FFF', fontSize: '0.75rem' }}>gitlab.com / project /</span>
              <span style={{ color: '#A5B4FC', fontSize: '0.75rem' }}>Releases</span>
            </div>
            <div style={{ padding: '1rem' }}>
              {/* Tag badge + title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{
                  background: isValidTag ? '#E8F5E9' : '#FFEBEE',
                  color: isValidTag ? '#2E7D32' : '#C62828',
                  border: `1px solid ${isValidTag ? '#A5D6A7' : '#FFCDD2'}`,
                  borderRadius: '4px',
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                }}>
                  {tagInput || 'v0.0.0'}
                </span>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: '#333' }}>
                  {releaseName || `Release ${tagInput}`}
                </span>
              </div>
              {/* Changelog sections */}
              {grouped.map(group => (
                <div key={group.type} style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#333', marginBottom: '0.25rem' }}>
                    {SECTION_LABELS[group.type]}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                    {group.items.map(item => (
                      <li key={item.id} style={{ fontSize: '0.85rem', color: '#555', marginBottom: '0.15rem' }}>
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {/* Assets */}
              {assets.length > 0 && (
                <div style={{ marginTop: '0.75rem', borderTop: '1px solid #F0F0F0', paddingTop: '0.75rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#333', marginBottom: '0.4rem' }}>Assets</div>
                  {assets.map(a => (
                    <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                      <span style={{
                        background: '#E3F2FD', color: '#1565C0',
                        borderRadius: '3px', padding: '0.1rem 0.4rem',
                        fontSize: '0.7rem', fontWeight: 600,
                      }}>
                        {a.link_type}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#1565C0', textDecoration: 'underline' }}>
                        {a.name || 'link'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* YAML */}
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#555', marginBottom: '0.5rem' }}>
          Сгенерированный YAML
        </div>
        <pre style={{
          background: '#1E1E1E',
          color: '#D4D4D4',
          padding: '1rem',
          borderRadius: '8px',
          fontSize: '0.8rem',
          margin: 0,
          overflowX: 'auto',
          lineHeight: 1.6,
        }}>
          {buildReleaseYaml(isValidTag ? tagInput : 'v0.0.0', releaseName, assets)}
        </pre>
      </div>
    </div>
  )
}

// ============================================
// Task 15.3: Full release pipeline
// ============================================

type JobStatus = 'pending' | 'running' | 'success'

interface PipelineJob {
  id: string
  label: string
  stage: string
  icon: string
  deps: string[]
}

const PIPELINE_JOBS: PipelineJob[] = [
  { id: 'unit-tests',           label: 'unit-tests',           stage: 'test',    icon: '🧪', deps: [] },
  { id: 'build-npm',            label: 'build-npm',            stage: 'build',   icon: '📦', deps: ['unit-tests'] },
  { id: 'build-docker',         label: 'build-docker',         stage: 'build',   icon: '🐳', deps: ['unit-tests'] },
  { id: 'publish-npm',          label: 'publish-npm',          stage: 'release', icon: '🚀', deps: ['build-npm'] },
  { id: 'create-changelog',     label: 'create-changelog',     stage: 'release', icon: '📝', deps: ['build-npm'] },
  { id: 'create-gitlab-release',label: 'create-gitlab-release',stage: 'release', icon: '🏷️', deps: ['publish-npm', 'create-changelog'] },
]

const STAGES = ['test', 'build', 'release']

const STATUS_COLORS: Record<JobStatus, { bg: string; border: string; text: string; label: string }> = {
  pending: { bg: '#F5F5F5', border: '#E0E0E0', text: '#9E9E9E', label: 'ожидание' },
  running: { bg: '#E3F2FD', border: '#90CAF9', text: '#1565C0', label: 'выполняется' },
  success: { bg: '#E8F5E9', border: '#A5D6A7', text: '#2E7D32', label: 'успех' },
}

function delay(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

export function Task15_3_Solution() {
  const [statuses, setStatuses] = useState<Record<string, JobStatus>>(
    Object.fromEntries(PIPELINE_JOBS.map(j => [j.id, 'pending']))
  )
  const [log, setLog] = useState<string[]>([])
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)

  const setJobStatus = (id: string, status: JobStatus) => {
    setStatuses(prev => ({ ...prev, [id]: status }))
  }

  const addLog = (msg: string) => {
    setLog(prev => [...prev, `[${new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}] ${msg}`])
  }

  const runJob = async (job: PipelineJob) => {
    setJobStatus(job.id, 'running')
    addLog(`Запущен джоб: ${job.label}`)
    await delay(1200 + Math.random() * 600)
    setJobStatus(job.id, 'success')
    addLog(`Завершён джоб: ${job.label} ✓`)
  }

  const handleRun = async () => {
    if (done) {
      setStatuses(Object.fromEntries(PIPELINE_JOBS.map(j => [j.id, 'pending'])))
      setLog([])
      setDone(false)
      return
    }

    setRunning(true)
    setLog([])
    addLog('Пайплайн запущен — тег v1.2.3 обнаружен')

    // test stage
    await runJob(PIPELINE_JOBS[0])

    // build stage — parallel
    addLog('Стадия build: параллельный запуск build-npm и build-docker')
    await Promise.all([
      runJob(PIPELINE_JOBS[1]),
      runJob(PIPELINE_JOBS[2]),
    ])

    // release: publish-npm and create-changelog in parallel
    addLog('Стадия release: параллельный запуск publish-npm и create-changelog')
    await Promise.all([
      runJob(PIPELINE_JOBS[3]),
      runJob(PIPELINE_JOBS[4]),
    ])

    // final release job
    addLog('create-gitlab-release: ожидание зависимостей...')
    await runJob(PIPELINE_JOBS[5])

    addLog('Пайплайн завершён успешно')
    setRunning(false)
    setDone(true)
  }

  const jobsByStage = (stage: string) => PIPELINE_JOBS.filter(j => j.stage === stage)

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Полный release pipeline</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Визуализация выполнения pipeline от git push tag v1.2.3 до публикации
      </p>

      {/* Trigger info */}
      <div style={{
        background: '#F3F4F6',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#555' }}>
          <span style={{ color: '#888' }}>$ </span>
          git push origin <span style={{ color: '#1565C0', fontWeight: 700 }}>v1.2.3</span>
        </div>
        <span style={{ color: '#888', fontSize: '0.8rem' }}>→</span>
        <div style={{
          background: '#E8F5E9', border: '1px solid #A5D6A7',
          borderRadius: '4px', padding: '0.2rem 0.5rem',
          fontSize: '0.8rem', color: '#2E7D32', fontFamily: 'monospace',
        }}>
          CI_COMMIT_TAG = v1.2.3
        </div>
      </div>

      {/* Pipeline visualization */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {STAGES.map((stage, stageIdx) => (
          <div key={stage}>
            <div style={{
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '0.8rem',
              color: '#555',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.5rem',
              paddingBottom: '0.4rem',
              borderBottom: '2px solid #E0E0E0',
            }}>
              {stageIdx + 1}. {stage}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {jobsByStage(stage).map(job => {
                const status = statuses[job.id] as JobStatus
                const c = STATUS_COLORS[status]
                return (
                  <div key={job.id} style={{
                    border: `2px solid ${c.border}`,
                    borderRadius: '8px',
                    padding: '0.6rem 0.75rem',
                    background: c.bg,
                    transition: 'all 0.3s',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '1.1rem' }}>{job.icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.8rem', color: c.text, fontFamily: 'monospace' }}>
                          {job.label}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#999' }}>{c.label}</div>
                      </div>
                      {status === 'running' && (
                        <div style={{
                          marginLeft: 'auto',
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: '#1565C0',
                          animation: 'none',
                          opacity: 0.8,
                        }} />
                      )}
                      {status === 'success' && (
                        <span style={{ marginLeft: 'auto', color: '#2E7D32', fontWeight: 700 }}>✓</span>
                      )}
                    </div>
                    {job.deps.length > 0 && status === 'pending' && (
                      <div style={{ fontSize: '0.65rem', color: '#BDBDBD', marginTop: '0.25rem' }}>
                        ждёт: {job.deps.join(', ')}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Run button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={handleRun}
          disabled={running}
          style={{
            padding: '0.65rem 1.5rem',
            background: running ? '#F5F5F5' : done ? '#E8F5E9' : '#1565C0',
            color: running ? '#BDBDBD' : done ? '#2E7D32' : '#FFF',
            border: `2px solid ${running ? '#E0E0E0' : done ? '#A5D6A7' : '#1565C0'}`,
            borderRadius: '8px',
            cursor: running ? 'not-allowed' : 'pointer',
            fontWeight: 700,
            fontSize: '0.9rem',
          }}
        >
          {running ? 'Выполняется...' : done ? 'Сбросить' : 'Запустить пайплайн'}
        </button>
      </div>

      {/* Log */}
      {log.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#555', marginBottom: '0.5rem' }}>
            Лог выполнения
          </div>
          <div style={{
            background: '#1E1E1E',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            maxHeight: '180px',
            overflowY: 'auto',
          }}>
            {log.map((line, i) => (
              <div key={i} style={{
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                color: line.includes('✓') ? '#A5D6A7' : line.includes('Запущен') ? '#FFE082' : '#D4D4D4',
                marginBottom: '0.2rem',
              }}>
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {done && (
        <div style={{ background: '#E8F5E9', border: '1px solid #A5D6A7', borderRadius: '8px', padding: '1rem' }}>
          <div style={{ fontWeight: 700, color: '#2E7D32', marginBottom: '0.75rem' }}>
            Релиз v1.2.3 опубликован успешно
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {[
              { icon: '📦', title: 'npm registry', detail: 'my-package@1.2.3' },
              { icon: '🐳', title: 'Docker Hub', detail: 'myapp:v1.2.3\nmyapp:latest' },
              { icon: '🏷️', title: 'GitLab Release', detail: 'Release v1.2.3\n+ Changelog' },
            ].map(item => (
              <div key={item.title} style={{
                background: '#FFF',
                border: '1px solid #C8E6C9',
                borderRadius: '6px',
                padding: '0.6rem 0.75rem',
              }}>
                <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#333' }}>{item.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#666', fontFamily: 'monospace', whiteSpace: 'pre-line' }}>
                  {item.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
