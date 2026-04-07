// ============================================
// Level 8: Docker in CI — Solutions
// ============================================

import { useState } from 'react'

// ============================================
// Task 8.1: Docker build methods comparison
// ============================================

type BuildMethod = 'dind' | 'kaniko' | 'socket'

interface MethodInfo {
  label: string
  icon: string
  description: string
  privileged: boolean
  daemon: boolean
  securityLevel: 'safe' | 'warning' | 'danger'
  speed: string
  complexity: string
}

const METHODS: Record<BuildMethod, MethodInfo> = {
  dind: {
    label: 'Docker-in-Docker',
    icon: '🐳',
    description: 'Запускает Docker-демон внутри контейнера как sidecar service',
    privileged: true,
    daemon: true,
    securityLevel: 'warning',
    speed: 'Быстро',
    complexity: 'Средняя',
  },
  kaniko: {
    label: 'Kaniko',
    icon: '🔒',
    description: 'Собирает образы в userspace без Docker-демона и privileged mode',
    privileged: false,
    daemon: false,
    securityLevel: 'safe',
    speed: 'Среднее',
    complexity: 'Средняя',
  },
  socket: {
    label: 'Socket mount',
    icon: '⚡',
    description: 'Монтирует /var/run/docker.sock хоста — контейнер управляет хостовым Docker',
    privileged: false,
    daemon: false,
    securityLevel: 'danger',
    speed: 'Очень быстро',
    complexity: 'Простая',
  },
}

function buildDindYaml(tls: boolean): string {
  if (tls) {
    return `build-image:
  image: docker:24-cli
  services:
    - docker:24-dind
  variables:
    DOCKER_TLS_CERTDIR: '/certs'
    DOCKER_HOST: 'tcp://docker:2376'
    DOCKER_TLS_VERIFY: '1'
    DOCKER_CERT_PATH: '$DOCKER_TLS_CERTDIR/client'
  before_script:
    - docker login -u $CI_REGISTRY_USER
        -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA`
  }
  return `build-image:
  image: docker:24-cli
  services:
    - docker:24-dind
  variables:
    DOCKER_TLS_CERTDIR: ''       # ⚠️ TLS отключён!
    DOCKER_HOST: 'tcp://docker:2375'
  before_script:
    - docker login -u $CI_REGISTRY_USER
        -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA`
}

const KANIKO_YAML = `build-image:
  image:
    name: gcr.io/kaniko-project/executor:v1.23.0-debug
    entrypoint: ['']
  before_script:
    - echo "{\\"auths\\":{\\"$CI_REGISTRY\\":{\\"auth\\":\\"$(printf
        "%s:%s" "$CI_REGISTRY_USER" "$CI_REGISTRY_PASSWORD"
        | base64 | tr -d '\\n')\\"}}}" > /kaniko/.docker/config.json
  script:
    - /kaniko/executor
        --context "$CI_PROJECT_DIR"
        --dockerfile "$CI_PROJECT_DIR/Dockerfile"
        --destination "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA"
        --cache=true
        --cache-repo "$CI_REGISTRY_IMAGE/cache"`

const SOCKET_YAML = `build-image:
  image: docker:24-cli
  variables:
    # ⚠️ ОПАСНО: монтируется хостовый Docker socket
    DOCKER_HOST: 'unix:///var/run/docker.sock'
  before_script:
    - docker login -u $CI_REGISTRY_USER
        -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA
  # В config.toml Runner должен быть:
  # volumes = ["/var/run/docker.sock:/var/run/docker.sock"]`

const SECURITY_CONFIG = {
  safe: { color: '#2E7D32', bg: '#E8F5E9', border: '#A5D6A7', label: 'Безопасно' },
  warning: { color: '#E65100', bg: '#FFF3E0', border: '#FFCC80', label: 'Умеренный риск' },
  danger: { color: '#C62828', bg: '#FFEBEE', border: '#EF9A9A', label: 'Высокий риск' },
}

export function Task8_1_Solution() {
  const [method, setMethod] = useState<BuildMethod>('dind')
  const [tlsEnabled, setTlsEnabled] = useState(true)

  const info = METHODS[method]
  const effectiveSecurity =
    method === 'dind' && !tlsEnabled ? 'danger' : info.securityLevel
  const sec = SECURITY_CONFIG[effectiveSecurity]

  const yaml =
    method === 'dind'
      ? buildDindYaml(tlsEnabled)
      : method === 'kaniko'
        ? KANIKO_YAML
        : SOCKET_YAML

  const showWarning =
    effectiveSecurity === 'danger' ||
    (method === 'dind' && !tlsEnabled) ||
    method === 'socket'

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Методы сборки Docker-образов в CI</h2>
      <p style={{ color: '#666', margin: '0 0 1.5rem' }}>
        Выбери метод и исследуй его характеристики
      </p>

      {/* Method cards */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {(Object.keys(METHODS) as BuildMethod[]).map(m => {
          const mi = METHODS[m]
          const isActive = method === m
          const sc = SECURITY_CONFIG[mi.securityLevel]
          return (
            <div
              key={m}
              onClick={() => setMethod(m)}
              style={{
                flex: '1',
                minWidth: '200px',
                border: `2px solid ${isActive ? '#1565C0' : '#e0e0e0'}`,
                borderRadius: '10px',
                padding: '1rem',
                cursor: 'pointer',
                background: isActive ? '#E3F2FD' : '#fff',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>{mi.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: '0.3rem' }}>{mi.label}</div>
              <div style={{ fontSize: '0.82rem', color: '#555', marginBottom: '0.6rem' }}>
                {mi.description}
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '20px',
                  background: sc.bg,
                  color: sc.color,
                  border: `1px solid ${sc.border}`,
                }}
              >
                {sc.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* dind TLS toggle */}
      {method === 'dind' && (
        <div
          style={{
            background: '#F5F5F5',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <span style={{ fontWeight: 600 }}>TLS для dind:</span>
          {[true, false].map(val => (
            <button
              key={String(val)}
              onClick={() => setTlsEnabled(val)}
              style={{
                padding: '4px 14px',
                borderRadius: '6px',
                border: `2px solid ${tlsEnabled === val ? (val ? '#2E7D32' : '#C62828') : '#ccc'}`,
                background: tlsEnabled === val ? (val ? '#E8F5E9' : '#FFEBEE') : '#fff',
                color: tlsEnabled === val ? (val ? '#2E7D32' : '#C62828') : '#555',
                cursor: 'pointer',
                fontWeight: tlsEnabled === val ? 700 : 400,
              }}
            >
              {val ? 'Включён (порт 2376)' : 'Отключён (порт 2375)'}
            </button>
          ))}
        </div>
      )}

      {/* Warning block */}
      {showWarning && (
        <div
          style={{
            background: '#FFEBEE',
            border: '2px solid #EF9A9A',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            color: '#C62828',
            fontWeight: 500,
          }}
        >
          {method === 'socket'
            ? '⚠️ Монтирование /var/run/docker.sock даёт контейнеру полный контроль над Docker хоста. Компрометация контейнера = компрометация хоста.'
            : '⚠️ TLS отключён: Docker-демон слушает на порту 2375 без аутентификации. Любой процесс в сети контейнеров может управлять Docker.'}
        </div>
      )}

      {/* Comparison table */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.75rem' }}>Характеристики метода</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <tbody>
            {[
              ['Privileged mode', info.privileged ? '✅ Требуется' : '❌ Не нужен',
                info.privileged ? '#FFF3E0' : '#E8F5E9'],
              ['Docker-демон', info.daemon ? 'Запускается внутри' : 'Не нужен',
                info.daemon ? '#FFF3E0' : '#E8F5E9'],
              ['Скорость', info.speed, '#fff'],
              ['Сложность настройки', info.complexity, '#fff'],
              ['Уровень безопасности',
                effectiveSecurity === 'safe' ? '🟢 Безопасно' : effectiveSecurity === 'warning' ? '🟡 Умеренный риск' : '🔴 Высокий риск',
                sec.bg],
            ].map(([key, val, bg]) => (
              <tr key={String(key)} style={{ background: String(bg) }}>
                <td
                  style={{
                    padding: '8px 12px',
                    borderBottom: '1px solid #e0e0e0',
                    fontWeight: 600,
                    width: '45%',
                  }}
                >
                  {key}
                </td>
                <td style={{ padding: '8px 12px', borderBottom: '1px solid #e0e0e0' }}>{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* YAML */}
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>GitLab CI конфиг</h3>
        <pre
          style={{
            background: '#1e1e2e',
            color: '#cdd6f4',
            borderRadius: '8px',
            padding: '1rem',
            overflowX: 'auto',
            fontSize: '0.82rem',
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {yaml}
        </pre>
      </div>
    </div>
  )
}

// ============================================
// Task 8.2: Kaniko command builder
// ============================================

type SnapshotMode = 'time' | 'redo' | 'full'

const SNAPSHOT_MODES: Record<SnapshotMode, { label: string; description: string }> = {
  time: { label: 'time (default)', description: 'Сравнивает время изменения файлов. Безопаснее, чуть медленнее.' },
  redo: { label: 'redo', description: 'Выполняет команду и сравнивает изменения. Быстрее для большинства Dockerfile.' },
  full: { label: 'full', description: 'Полный хэш всех файлов. Самый медленный, максимально точный.' },
}

const AVAILABLE_TAGS = [
  { key: 'sha', value: '$CI_COMMIT_SHORT_SHA', label: 'SHA коммита', description: 'Трассировка: образ ↔ коммит' },
  { key: 'branch', value: '$CI_COMMIT_REF_SLUG', label: 'Имя ветки', description: 'Среда разработки' },
  { key: 'latest', value: 'latest', label: 'latest', description: 'Последняя версия (осторожно!)' },
]

function buildKanikoYaml(
  imageName: string,
  selectedTags: string[],
  cacheEnabled: boolean,
  cacheRepo: string,
  snapshotMode: SnapshotMode,
  noCompressedCaching: boolean,
): string {
  const destinations = selectedTags
    .map(t => `        --destination "${imageName}:${t}"`)
    .join('\n')

  const cacheFlags = cacheEnabled
    ? `\n        --cache=true\n        --cache-repo "${cacheRepo}"`
    : ''

  const snapshotFlag = snapshotMode !== 'time'
    ? `\n        --snapshot-mode=${snapshotMode}`
    : ''

  const compressFlag = noCompressedCaching ? '\n        --compressed-caching=false' : ''

  return `build-image:
  image:
    name: gcr.io/kaniko-project/executor:v1.23.0-debug
    entrypoint: ['']
  before_script:
    - echo "{\\"auths\\":{\\"$CI_REGISTRY\\":{\\"auth\\":\\"$(printf
        "%s:%s" "$CI_REGISTRY_USER" "$CI_REGISTRY_PASSWORD"
        | base64 | tr -d '\\n')\\"}}}" > /kaniko/.docker/config.json
  script:
    - /kaniko/executor
        --context "$CI_PROJECT_DIR"
        --dockerfile "$CI_PROJECT_DIR/Dockerfile"
${destinations || `        --destination "${imageName}:$CI_COMMIT_SHORT_SHA"`}${cacheFlags}${snapshotFlag}${compressFlag}`
}

export function Task8_2_Solution() {
  const [imageName, setImageName] = useState('$CI_REGISTRY_IMAGE')
  const [selectedTags, setSelectedTags] = useState<string[]>(['$CI_COMMIT_SHORT_SHA'])
  const [cacheEnabled, setCacheEnabled] = useState(false)
  const [cacheRepo, setCacheRepo] = useState('${CI_REGISTRY_IMAGE}/cache')
  const [snapshotMode, setSnapshotMode] = useState<SnapshotMode>('time')
  const [noCompressedCaching, setNoCompressedCaching] = useState(false)

  const toggleTag = (value: string) => {
    setSelectedTags(prev =>
      prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value],
    )
  }

  const hasLatest = selectedTags.includes('latest')

  const yaml = buildKanikoYaml(
    imageName,
    selectedTags,
    cacheEnabled,
    cacheRepo,
    snapshotMode,
    noCompressedCaching,
  )

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Kaniko: конструктор команды</h2>
      <p style={{ color: '#666', margin: '0 0 1.5rem' }}>
        Настрой параметры — получи готовый GitLab CI конфиг
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Left column: settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Image name */}
          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
              Имя образа (destination prefix)
            </label>
            <input
              value={imageName}
              onChange={e => setImageName(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Tags */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Теги образа</div>
            {AVAILABLE_TAGS.map(tag => {
              const checked = selectedTags.includes(tag.value)
              return (
                <div
                  key={tag.key}
                  onClick={() => toggleTag(tag.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    padding: '6px 10px',
                    marginBottom: '4px',
                    borderRadius: '6px',
                    background: checked ? '#E3F2FD' : '#F5F5F5',
                    cursor: 'pointer',
                    border: `2px solid ${checked ? '#90CAF9' : 'transparent'}`,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {}}
                    style={{ marginTop: '2px', cursor: 'pointer' }}
                  />
                  <div>
                    <code style={{ fontSize: '0.85rem', fontWeight: 600 }}>{tag.value}</code>
                    <div style={{ fontSize: '0.78rem', color: '#666' }}>{tag.description}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Cache */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                cursor: 'pointer',
              }}
              onClick={() => setCacheEnabled(v => !v)}
            >
              <input type="checkbox" checked={cacheEnabled} onChange={() => {}} />
              <span style={{ fontWeight: 600 }}>Включить кэш слоёв (--cache)</span>
            </div>
            {cacheEnabled && (
              <div style={{ paddingLeft: '1.5rem' }}>
                <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.3rem' }}>
                  Репозиторий для кэша (--cache-repo)
                </label>
                <input
                  value={cacheRepo}
                  onChange={e => setCacheRepo(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '5px 8px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    fontFamily: 'monospace',
                    fontSize: '0.82rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            )}
          </div>

          {/* Snapshot mode */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Snapshot mode</div>
            {(Object.keys(SNAPSHOT_MODES) as SnapshotMode[]).map(mode => {
              const { label, description } = SNAPSHOT_MODES[mode]
              const active = snapshotMode === mode
              return (
                <div
                  key={mode}
                  onClick={() => setSnapshotMode(mode)}
                  style={{
                    padding: '6px 10px',
                    marginBottom: '4px',
                    borderRadius: '6px',
                    background: active ? '#E8F5E9' : '#F5F5F5',
                    border: `2px solid ${active ? '#A5D6A7' : 'transparent'}`,
                    cursor: 'pointer',
                  }}
                >
                  <code style={{ fontSize: '0.85rem', fontWeight: 600 }}>{label}</code>
                  <div style={{ fontSize: '0.78rem', color: '#666' }}>{description}</div>
                </div>
              )
            })}
          </div>

          {/* Compressed caching */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              cursor: 'pointer',
            }}
            onClick={() => setNoCompressedCaching(v => !v)}
          >
            <input
              type="checkbox"
              checked={noCompressedCaching}
              onChange={() => {}}
              style={{ marginTop: '2px' }}
            />
            <div>
              <span style={{ fontWeight: 600 }}>--compressed-caching=false</span>
              <div style={{ fontSize: '0.78rem', color: '#666' }}>
                Полезно если много маленьких файлов — отключение сжатия ускоряет сборку
              </div>
            </div>
          </div>
        </div>

        {/* Right column: preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {hasLatest && (
            <div
              style={{
                background: '#FFF8E1',
                border: '2px solid #FFD54F',
                borderRadius: '8px',
                padding: '0.75rem',
                color: '#E65100',
                fontSize: '0.88rem',
              }}
            >
              ⚠️ <strong>Тег latest</strong> следует пушить только из ветки main. Добавь условие
              в пайплайне: <code>rules: - if: $CI_COMMIT_BRANCH == 'main'</code>
            </div>
          )}

          <div>
            <h3 style={{ margin: '0 0 0.5rem' }}>Итоговая команда</h3>
            <pre
              style={{
                background: '#1e1e2e',
                color: '#a6e3a1',
                borderRadius: '8px',
                padding: '0.75rem',
                fontSize: '0.78rem',
                lineHeight: 1.6,
                margin: 0,
                overflowX: 'auto',
              }}
            >
              {`/kaniko/executor\n  --context "$CI_PROJECT_DIR"\n  --dockerfile "$CI_PROJECT_DIR/Dockerfile"${selectedTags.map(t => `\n  --destination "${imageName}:${t}"`).join('')}${cacheEnabled ? `\n  --cache=true\n  --cache-repo "${cacheRepo}"` : ''}${snapshotMode !== 'time' ? `\n  --snapshot-mode=${snapshotMode}` : ''}${noCompressedCaching ? '\n  --compressed-caching=false' : ''}`}
            </pre>
          </div>

          <div>
            <h3 style={{ margin: '0 0 0.5rem' }}>Полный GitLab CI YAML</h3>
            <pre
              style={{
                background: '#1e1e2e',
                color: '#cdd6f4',
                borderRadius: '8px',
                padding: '0.75rem',
                fontSize: '0.78rem',
                lineHeight: 1.6,
                margin: 0,
                overflowX: 'auto',
                maxHeight: '320px',
              }}
            >
              {yaml}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 8.3: Multi-stage builds simulator
// ============================================

type Scenario = 'first' | 'code-change' | 'deps-change'
type TabVariant = 'simple' | 'multistage'

interface LayerInfo {
  name: string
  cached: boolean
}

interface ScenarioData {
  label: string
  description: string
  simple: { layers: LayerInfo[]; time: number }
  multistage: { layers: LayerInfo[]; time: number }
}

const SIMPLE_DOCKERFILE = `FROM node:20-alpine

WORKDIR /app

# ❌ Все файлы копируются сразу
COPY . .

RUN npm ci

RUN npm run build

EXPOSE 3000
CMD ["node", "dist/index.js"]
# Размер образа: ~620MB
# (node + npm + все инструменты + dist)`

const MULTISTAGE_DOCKERFILE = `# ---- Stage 1: builder ----
FROM node:20-alpine AS builder

WORKDIR /app

# ✅ Сначала только package.json
COPY package*.json ./
RUN npm ci

# ✅ Код копируем отдельно
COPY . .
RUN npm run build

# ---- Stage 2: production ----
FROM node:20-alpine AS production

WORKDIR /app

# Только runtime-зависимости
COPY package*.json ./
RUN npm ci --omit=dev

# Только собранный артефакт
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]
# Размер образа: ~95MB`

const SCENARIOS: Record<Scenario, ScenarioData> = {
  first: {
    label: 'Первая сборка',
    description: 'Кэша нет — всё собирается с нуля',
    simple: {
      layers: [
        { name: 'FROM node:20-alpine', cached: false },
        { name: 'WORKDIR /app', cached: false },
        { name: 'COPY . .', cached: false },
        { name: 'RUN npm ci', cached: false },
        { name: 'RUN npm run build', cached: false },
      ],
      time: 180,
    },
    multistage: {
      layers: [
        { name: '[builder] FROM node:20-alpine', cached: false },
        { name: '[builder] COPY package*.json ./', cached: false },
        { name: '[builder] RUN npm ci', cached: false },
        { name: '[builder] COPY . .', cached: false },
        { name: '[builder] RUN npm run build', cached: false },
        { name: '[prod] FROM node:20-alpine', cached: false },
        { name: '[prod] RUN npm ci --omit=dev', cached: false },
        { name: '[prod] COPY --from=builder dist/', cached: false },
      ],
      time: 200,
    },
  },
  'code-change': {
    label: 'Изменили код',
    description: 'package.json не менялся — зависимости из кэша',
    simple: {
      layers: [
        { name: 'FROM node:20-alpine', cached: true },
        { name: 'WORKDIR /app', cached: true },
        { name: 'COPY . .', cached: false },  // код изменился
        { name: 'RUN npm ci', cached: false },  // кэш сломан — переустановка
        { name: 'RUN npm run build', cached: false },
      ],
      time: 150,
    },
    multistage: {
      layers: [
        { name: '[builder] FROM node:20-alpine', cached: true },
        { name: '[builder] COPY package*.json ./', cached: true },
        { name: '[builder] RUN npm ci', cached: true },    // кэш работает!
        { name: '[builder] COPY . .', cached: false },     // код изменился
        { name: '[builder] RUN npm run build', cached: false },
        { name: '[prod] FROM node:20-alpine', cached: true },
        { name: '[prod] RUN npm ci --omit=dev', cached: true },
        { name: '[prod] COPY --from=builder dist/', cached: false },
      ],
      time: 35,
    },
  },
  'deps-change': {
    label: 'Изменили зависимости',
    description: 'package.json изменился — npm ci пересобирается',
    simple: {
      layers: [
        { name: 'FROM node:20-alpine', cached: true },
        { name: 'WORKDIR /app', cached: true },
        { name: 'COPY . .', cached: false },  // package.json в .
        { name: 'RUN npm ci', cached: false },
        { name: 'RUN npm run build', cached: false },
      ],
      time: 160,
    },
    multistage: {
      layers: [
        { name: '[builder] FROM node:20-alpine', cached: true },
        { name: '[builder] COPY package*.json ./', cached: false },  // изменился
        { name: '[builder] RUN npm ci', cached: false },
        { name: '[builder] COPY . .', cached: false },
        { name: '[builder] RUN npm run build', cached: false },
        { name: '[prod] FROM node:20-alpine', cached: true },
        { name: '[prod] RUN npm ci --omit=dev', cached: false },
        { name: '[prod] COPY --from=builder dist/', cached: false },
      ],
      time: 165,
    },
  },
}

const IMAGE_SIZES = {
  simple: 620,
  multistage: 95,
  max: 650,
}

export function Task8_3_Solution() {
  const [tab, setTab] = useState<TabVariant>('simple')
  const [scenario, setScenario] = useState<Scenario>('first')

  const data = SCENARIOS[scenario]
  const simpleData = data.simple
  const multiData = data.multistage

  const simpleCached = simpleData.layers.filter(l => l.cached).length
  const multiCached = multiData.layers.filter(l => l.cached).length

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Multi-stage builds: симулятор сборки</h2>
      <p style={{ color: '#666', margin: '0 0 1.5rem' }}>
        Выбери сценарий и посмотри, как меняется скорость сборки
      </p>

      {/* Scenario buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {(Object.keys(SCENARIOS) as Scenario[]).map(s => {
          const { label, description } = SCENARIOS[s]
          const active = scenario === s
          return (
            <button
              key={s}
              onClick={() => setScenario(s)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: `2px solid ${active ? '#1565C0' : '#e0e0e0'}`,
                background: active ? '#E3F2FD' : '#fff',
                cursor: 'pointer',
                textAlign: 'left',
                flex: '1',
                minWidth: '150px',
              }}
            >
              <div style={{ fontWeight: active ? 700 : 400, fontSize: '0.9rem' }}>{label}</div>
              <div style={{ fontSize: '0.75rem', color: '#666' }}>{description}</div>
            </button>
          )
        })}
      </div>

      {/* Image size comparison */}
      <div
        style={{
          background: '#F5F5F5',
          borderRadius: '10px',
          padding: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <h3 style={{ margin: '0 0 0.75rem' }}>Размер итогового образа</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {(['simple', 'multistage'] as const).map(variant => {
            const size = IMAGE_SIZES[variant]
            const pct = (size / IMAGE_SIZES.max) * 100
            const label = variant === 'simple' ? 'Простой Dockerfile' : 'Multi-stage'
            const color = variant === 'simple' ? '#EF5350' : '#66BB6A'
            return (
              <div key={variant}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '3px',
                    fontSize: '0.88rem',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{label}</span>
                  <span style={{ fontWeight: 700, color }}>{size} MB</span>
                </div>
                <div
                  style={{
                    height: '18px',
                    background: '#e0e0e0',
                    borderRadius: '9px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: color,
                      borderRadius: '9px',
                      transition: 'width 0.3s',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#777', marginTop: '0.5rem' }}>
          Multi-stage образ в {Math.round(IMAGE_SIZES.simple / IMAGE_SIZES.multistage)}x меньше — нет node, npm, dev-зависимостей
        </div>
      </div>

      {/* Dockerfile tabs */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0', marginBottom: '0' }}>
          {(['simple', 'multistage'] as const).map(v => (
            <button
              key={v}
              onClick={() => setTab(v)}
              style={{
                padding: '8px 20px',
                border: '2px solid #e0e0e0',
                borderBottom: tab === v ? '2px solid #fff' : '2px solid #e0e0e0',
                background: tab === v ? '#fff' : '#F5F5F5',
                cursor: 'pointer',
                borderRadius: '8px 8px 0 0',
                fontWeight: tab === v ? 700 : 400,
                marginRight: '4px',
                position: 'relative',
                zIndex: tab === v ? 1 : 0,
              }}
            >
              {v === 'simple' ? 'Простой' : 'Multi-stage'}
            </button>
          ))}
        </div>
        <pre
          style={{
            background: '#1e1e2e',
            color: '#cdd6f4',
            borderRadius: '0 8px 8px 8px',
            padding: '1rem',
            fontSize: '0.8rem',
            lineHeight: 1.6,
            margin: 0,
            overflowX: 'auto',
            maxHeight: '300px',
          }}
        >
          {tab === 'simple' ? SIMPLE_DOCKERFILE : MULTISTAGE_DOCKERFILE}
        </pre>
      </div>

      {/* Build simulation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {(['simple', 'multistage'] as TabVariant[]).map(variant => {
          const layers = variant === 'simple' ? simpleData.layers : multiData.layers
          const time = variant === 'simple' ? simpleData.time : multiData.time
          const cached = variant === 'simple' ? simpleCached : multiCached
          const total = layers.length
          return (
            <div
              key={variant}
              style={{
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  background: variant === 'simple' ? '#FFEBEE' : '#E8F5E9',
                  padding: '8px 12px',
                  fontWeight: 700,
                  borderBottom: '1px solid #e0e0e0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{variant === 'simple' ? 'Простой' : 'Multi-stage'}</span>
                <span
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: variant === 'simple' ? '#C62828' : '#2E7D32',
                  }}
                >
                  ~{time}с
                </span>
              </div>
              <div style={{ padding: '8px' }}>
                {layers.map((layer, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 6px',
                      marginBottom: '2px',
                      borderRadius: '4px',
                      background: layer.cached ? '#F5F5F5' : '#FFF3E0',
                      fontSize: '0.78rem',
                    }}
                  >
                    <span>{layer.cached ? '📦' : '🔨'}</span>
                    <code
                      style={{
                        color: layer.cached ? '#757575' : '#E65100',
                        flex: 1,
                      }}
                    >
                      {layer.name}
                    </code>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: layer.cached ? '#9E9E9E' : '#E65100',
                      }}
                    >
                      {layer.cached ? 'кэш' : 'rebuild'}
                    </span>
                  </div>
                ))}
                <div
                  style={{
                    marginTop: '8px',
                    padding: '5px 6px',
                    borderRadius: '4px',
                    background: '#F5F5F5',
                    fontSize: '0.78rem',
                    color: '#555',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>
                    Кэш: {cached}/{total} слоёв
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    {total - cached} пересобрано
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary table */}
      <div>
        <h3 style={{ margin: '0 0 0.75rem' }}>Итог для сценария: {data.label}</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ background: '#F5F5F5' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>
                Параметр
              </th>
              <th style={{ padding: '8px 12px', textAlign: 'center', borderBottom: '2px solid #e0e0e0', color: '#C62828' }}>
                Простой
              </th>
              <th style={{ padding: '8px 12px', textAlign: 'center', borderBottom: '2px solid #e0e0e0', color: '#2E7D32' }}>
                Multi-stage
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Время сборки', `~${simpleData.time}с`, `~${multiData.time}с`],
              [
                'Слоёв из кэша',
                `${simpleCached}/${simpleData.layers.length}`,
                `${multiCached}/${multiData.layers.length}`,
              ],
              ['Размер образа', `${IMAGE_SIZES.simple} MB`, `${IMAGE_SIZES.multistage} MB`],
              [
                'Что в образе',
                'node + npm + dev deps + dist',
                'node runtime + prod deps + dist',
              ],
            ].map(([param, sv, mv]) => (
              <tr key={String(param)}>
                <td style={{ padding: '8px 12px', borderBottom: '1px solid #e0e0e0', fontWeight: 600 }}>
                  {param}
                </td>
                <td
                  style={{
                    padding: '8px 12px',
                    borderBottom: '1px solid #e0e0e0',
                    textAlign: 'center',
                    color: '#C62828',
                  }}
                >
                  {sv}
                </td>
                <td
                  style={{
                    padding: '8px 12px',
                    borderBottom: '1px solid #e0e0e0',
                    textAlign: 'center',
                    color: '#2E7D32',
                    fontWeight: 600,
                  }}
                >
                  {mv}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
