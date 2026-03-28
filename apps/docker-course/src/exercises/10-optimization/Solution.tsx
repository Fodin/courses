import { useState } from 'react'

// ========================================
// Задание 10.1: Анализ и уменьшение размера образов — Решение
// ========================================

const analysisTools = [
  {
    name: 'docker history',
    description: 'Показывает каждый слой образа с размером и командой, которая его создала',
    command: 'docker history myapp:latest',
    output: `IMAGE          CREATED       CREATED BY                                      SIZE
a1b2c3d4e5f6   2 mins ago   CMD ["node" "server.js"]                        0B
<missing>      2 mins ago   COPY . /app                                     1.2MB
<missing>      2 mins ago   RUN npm install                                 450MB
<missing>      2 mins ago   COPY package*.json ./                           2KB
<missing>      2 mins ago   WORKDIR /app                                    0B
<missing>      3 weeks ago  /bin/sh -c apt-get update && apt-get install…   350MB
<missing>      3 weeks ago  /bin/sh -c #(nop) ENV NODE_VERSION=20.10.0      0B`,
  },
  {
    name: 'docker image inspect',
    description: 'Полная JSON-информация об образе: размер, слои, конфигурация, метаданные',
    command: 'docker image inspect --format=\'{{.Size}}\' myapp:latest',
    output: `1578432512

# В человекочитаемом формате:
$ docker images myapp:latest --format '{{.Repository}}:{{.Tag}} -> {{.Size}}'
myapp:latest -> 1.47GB`,
  },
  {
    name: 'dive',
    description: 'Интерактивный TUI-инструмент: слои, файловая система, потерянное пространство, эффективность',
    command: 'dive myapp:latest',
    output: `┃ Layers ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ │ Current Layer Contents ┈┈┈┈┈┈
┃ 77.8 MB  FROM ubuntu:22.04                    │ /bin/
┃ 350 MB   RUN apt-get update && install...      │ /usr/lib/
┃ 450 MB   RUN npm install                       │ /app/node_modules/
┃ 1.2 MB   COPY . /app                           │ /app/src/
┃ 0 B      CMD ["node" "server.js"]              │
┃                                                 │
┃ Image efficiency score: 62%                     │
┃ Potential wasted space: 180 MB                  │`,
  },
]

const baseImages = [
  { name: 'Full', example: 'node:20', size: '1.1 GB', sizePercent: 100, description: 'Debian + системные пакеты + runtime + build tools', useCase: 'Разработка, сборка, отладка' },
  { name: 'Slim', example: 'node:20-slim', size: '220 MB', sizePercent: 20, description: 'Debian minimal + runtime', useCase: 'Production (когда нужен apt)' },
  { name: 'Alpine', example: 'node:20-alpine', size: '135 MB', sizePercent: 12, description: 'Alpine Linux (musl libc) + runtime', useCase: 'Production (Node.js, Go, nginx)' },
  { name: 'Distroless', example: 'gcr.io/distroless/nodejs20', size: '130 MB', sizePercent: 12, description: 'Только runtime, нет shell/пакетного менеджера', useCase: 'Production (максимальная безопасность)' },
  { name: 'Scratch', example: 'scratch', size: '0 MB', sizePercent: 1, description: 'Абсолютно пустой образ', useCase: 'Go, Rust (статически скомпилированные бинарники)' },
]

type AnalysisSection = 'tools' | 'images'

export function Task10_1_Solution() {
  const [activeSection, setActiveSection] = useState<AnalysisSection>('tools')
  const [visibleOutputs, setVisibleOutputs] = useState<Record<string, boolean>>({})

  const toggleOutput = (name: string) => {
    setVisibleOutputs((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  const sections: { key: AnalysisSection; label: string }[] = [
    { key: 'tools', label: 'Инструменты анализа' },
    { key: 'images', label: 'Сравнение базовых образов' },
  ]

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h3 style={{ marginBottom: '1rem' }}>Задание 10.1: Анализ и уменьшение размера образов</h3>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            style={{
              padding: '0.4rem 0.8rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: activeSection === s.key ? '#0070f3' : '#fff',
              color: activeSection === s.key ? '#fff' : '#333',
              fontSize: '0.85rem',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === 'tools' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
          {analysisTools.map((tool) => (
            <div key={tool.name} style={{ border: '1px solid #e2e2e2', borderRadius: '6px', padding: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <strong style={{ fontSize: '0.95rem', fontFamily: 'monospace' }}>{tool.name}</strong>
                  <p style={{ fontSize: '0.85rem', color: '#555', margin: '0.25rem 0 0' }}>{tool.description}</p>
                </div>
              </div>
              <pre
                style={{
                  backgroundColor: '#2d2d2d',
                  color: '#a9dc76',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  margin: '0.5rem 0',
                  overflow: 'auto',
                }}
              >
                $ {tool.command}
              </pre>
              <button
                onClick={() => toggleOutput(tool.name)}
                style={{
                  padding: '0.3rem 0.6rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: visibleOutputs[tool.name] ? '#e8f4fd' : '#f9f9f9',
                  fontSize: '0.8rem',
                }}
              >
                {visibleOutputs[tool.name] ? 'Скрыть' : 'Показать'} пример вывода
              </button>
              {visibleOutputs[tool.name] && (
                <pre
                  style={{
                    backgroundColor: '#1e1e1e',
                    color: '#d4d4d4',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    overflow: 'auto',
                    fontSize: '0.75rem',
                    lineHeight: '1.5',
                    marginTop: '0.5rem',
                  }}
                >
                  {tool.output}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}

      {activeSection === 'images' && (
        <div style={{ marginBottom: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Тип</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Пример</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Размер</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Содержимое</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Когда использовать</th>
              </tr>
            </thead>
            <tbody>
              {baseImages.map((img) => (
                <tr key={img.name}>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontWeight: 'bold' }}>{img.name}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontFamily: 'monospace', fontSize: '0.75rem' }}>{img.example}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{img.size}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{img.description}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{img.useCase}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>Визуальное сравнение размеров</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {baseImages.map((img) => (
              <div key={img.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '80px', fontSize: '0.8rem', fontWeight: 'bold', textAlign: 'right' }}>{img.name}</span>
                <div style={{ flex: 1, backgroundColor: '#f0f0f0', borderRadius: '4px', height: '24px', position: 'relative' }}>
                  <div
                    style={{
                      width: `${img.sizePercent}%`,
                      backgroundColor: img.sizePercent > 50 ? '#e74c3c' : img.sizePercent > 15 ? '#f39c12' : '#27ae60',
                      borderRadius: '4px',
                      height: '100%',
                      minWidth: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: '0.5rem',
                    }}
                  >
                    <span style={{ fontSize: '0.7rem', color: '#fff', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                      {img.size}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          padding: '0.75rem',
          backgroundColor: '#e8f5e9',
          borderRadius: '6px',
          border: '1px solid #4caf50',
          fontSize: '0.85rem',
        }}
      >
        <strong>💡 Ключевой вывод:</strong> Для production используйте <strong>alpine</strong> (Node.js, Go) или{' '}
        <strong>slim</strong> (Python с нативными расширениями). Для статически скомпилированных бинарников (Go, Rust) --{' '}
        <strong>scratch</strong> или <strong>distroless</strong>. Разница: от 1.1 ГБ (full) до 8 МБ (scratch) -- в <strong>130 раз</strong>.
      </div>
    </div>
  )
}

// ========================================
// Задание 10.2: Multi-stage builds — Решение
// ========================================

const multiStageData = [
  {
    lang: 'Node.js',
    beforeDockerfile: `FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["node", "dist/server.js"]`,
    afterDockerfile: `# Stage 1: Builder
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

# Stage 2: Runner
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
CMD ["node", "dist/server.js"]`,
    beforeSize: 1400,
    afterSize: 180,
    unit: 'MB',
  },
  {
    lang: 'Go',
    beforeDockerfile: `FROM golang:1.22
WORKDIR /app
COPY . .
RUN go build -o server ./cmd/server
CMD ["./server"]`,
    afterDockerfile: `# Stage 1: Builder
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux \\
    go build -ldflags="-w -s" -o server ./cmd/server

# Stage 2: Runner (scratch!)
FROM scratch
COPY --from=builder /app/server /server
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
ENTRYPOINT ["/server"]`,
    beforeSize: 820,
    afterSize: 12,
    unit: 'MB',
  },
  {
    lang: 'Python',
    beforeDockerfile: `FROM python:3.12
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "main.py"]`,
    afterDockerfile: `# Stage 1: Builder
FROM python:3.12-slim AS builder
WORKDIR /app
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Runner
FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY . .
CMD ["python", "main.py"]`,
    beforeSize: 1050,
    afterSize: 195,
    unit: 'MB',
  },
  {
    lang: 'Java',
    beforeDockerfile: `FROM maven:3.9-eclipse-temurin-21
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn package -DskipTests
CMD ["java", "-jar", "target/app.jar"]`,
    afterDockerfile: `# Stage 1: Builder
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

# Stage 2: Runner (JRE only)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]`,
    beforeSize: 900,
    afterSize: 200,
    unit: 'MB',
  },
]

const multiStageCommands = [
  { command: '--target <stage>', description: 'Собрать только до определённого stage', example: 'docker build --target test -t myapp-test .' },
  { command: 'COPY --from=<stage>', description: 'Копировать файлы из именованного stage', example: 'COPY --from=builder /app/dist ./dist' },
  { command: 'COPY --from=<image>', description: 'Копировать файлы из внешнего образа', example: 'COPY --from=nginx:alpine /etc/nginx/nginx.conf /etc/nginx/' },
  { command: 'FROM ... AS <name>', description: 'Именование stage для ссылок', example: 'FROM node:20 AS builder' },
]

const asciiDiagram = `
  Stage 1 (builder):                   Stage 2 (runner):
  ┌───────────────────────┐           ┌───────────────────────┐
  │ node:20 (1.1 GB)      │           │ node:20-alpine        │
  │ + npm ci (450 MB)     │  COPY     │ (135 MB)              │
  │ + source code (5 MB)  │ ───────>  │ + dist/ (500 KB)      │
  │ + npm run build       │ --from=   │ + node_modules        │
  │ + dist/ (500 KB)      │ builder   │   (prod only, 40 MB)  │
  │ TOTAL: ~1.6 GB        │           │ TOTAL: ~180 MB        │
  └───────────────────────┘           └───────────────────────┘
          ↓                                    ↓
    ОТБРАСЫВАЕТСЯ                      ФИНАЛЬНЫЙ ОБРАЗ
    после сборки                       (только это)
`

export function Task10_2_Solution() {
  const [activeLang, setActiveLang] = useState('Node.js')
  const [showDiagram, setShowDiagram] = useState(false)

  const current = multiStageData.find((d) => d.lang === activeLang)!

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h3 style={{ marginBottom: '1rem' }}>Задание 10.2: Multi-stage builds</h3>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {multiStageData.map((d) => (
          <button
            key={d.lang}
            onClick={() => setActiveLang(d.lang)}
            style={{
              padding: '0.4rem 0.8rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: activeLang === d.lang ? '#0070f3' : '#fff',
              color: activeLang === d.lang ? '#fff' : '#333',
              fontSize: '0.85rem',
            }}
          >
            {d.lang}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <strong style={{ fontSize: '0.85rem', color: '#e74c3c' }}>❌ До оптимизации:</strong>
          <pre
            style={{
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
              padding: '0.75rem',
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '0.72rem',
              lineHeight: '1.5',
              marginTop: '0.25rem',
              border: '2px solid #e74c3c',
            }}
          >
            {current.beforeDockerfile}
          </pre>
        </div>
        <div>
          <strong style={{ fontSize: '0.85rem', color: '#27ae60' }}>✅ Multi-stage:</strong>
          <pre
            style={{
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
              padding: '0.75rem',
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '0.72rem',
              lineHeight: '1.5',
              marginTop: '0.25rem',
              border: '2px solid #27ae60',
            }}
          >
            {current.afterDockerfile}
          </pre>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <strong style={{ fontSize: '0.85rem' }}>Сравнение размеров ({current.lang}):</strong>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '60px', fontSize: '0.8rem', textAlign: 'right', color: '#e74c3c' }}>До:</span>
            <div style={{ flex: 1, backgroundColor: '#f0f0f0', borderRadius: '4px', height: '22px' }}>
              <div
                style={{
                  width: '100%',
                  backgroundColor: '#e74c3c',
                  borderRadius: '4px',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '0.5rem',
                }}
              >
                <span style={{ fontSize: '0.7rem', color: '#fff', fontWeight: 'bold' }}>{current.beforeSize} {current.unit}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '60px', fontSize: '0.8rem', textAlign: 'right', color: '#27ae60' }}>После:</span>
            <div style={{ flex: 1, backgroundColor: '#f0f0f0', borderRadius: '4px', height: '22px' }}>
              <div
                style={{
                  width: `${(current.afterSize / current.beforeSize) * 100}%`,
                  backgroundColor: '#27ae60',
                  borderRadius: '4px',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '0.5rem',
                  minWidth: '60px',
                }}
              >
                <span style={{ fontSize: '0.7rem', color: '#fff', fontWeight: 'bold' }}>{current.afterSize} {current.unit}</span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#555', margin: '0.25rem 0 0' }}>
            Сокращение: <strong>{Math.round((1 - current.afterSize / current.beforeSize) * 100)}%</strong> (в {Math.round(current.beforeSize / current.afterSize)}x раз меньше)
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setShowDiagram(!showDiagram)}
          style={{
            padding: '0.4rem 0.8rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: showDiagram ? '#f0f7ff' : '#f9f9f9',
            fontSize: '0.85rem',
          }}
        >
          {showDiagram ? 'Скрыть' : 'Показать'} схему builder-runner
        </button>
        {showDiagram && (
          <pre
            style={{
              backgroundColor: '#1e1e1e',
              color: '#a9dc76',
              padding: '0.75rem',
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '0.72rem',
              lineHeight: '1.4',
              marginTop: '0.5rem',
            }}
          >
            {asciiDiagram}
          </pre>
        )}
      </div>

      <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Команды multi-stage</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginBottom: '1rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '0.4rem', border: '1px solid #ddd', textAlign: 'left' }}>Команда</th>
            <th style={{ padding: '0.4rem', border: '1px solid #ddd', textAlign: 'left' }}>Описание</th>
            <th style={{ padding: '0.4rem', border: '1px solid #ddd', textAlign: 'left' }}>Пример</th>
          </tr>
        </thead>
        <tbody>
          {multiStageCommands.map((c) => (
            <tr key={c.command}>
              <td style={{ padding: '0.4rem', border: '1px solid #ddd', fontFamily: 'monospace', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{c.command}</td>
              <td style={{ padding: '0.4rem', border: '1px solid #ddd' }}>{c.description}</td>
              <td style={{ padding: '0.4rem', border: '1px solid #ddd', fontFamily: 'monospace', fontSize: '0.72rem' }}>{c.example}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          padding: '0.75rem',
          backgroundColor: '#fff3cd',
          borderRadius: '6px',
          border: '1px solid #ffc107',
          fontSize: '0.85rem',
        }}
      >
        <strong>⚠️ Важно:</strong> <code>COPY --from</code> может копировать файлы не только из stages вашего Dockerfile,
        но и из <strong>любых внешних образов</strong>. Например:{' '}
        <code>COPY --from=nginx:alpine /etc/nginx/nginx.conf /etc/nginx/</code>. Это удобно, но следите за версиями образов.
      </div>
    </div>
  )
}

// ========================================
// Задание 10.3: Оптимизация слоёв и кэширование — Решение
// ========================================

type LayerStatus = 'cached' | 'miss' | 'rebuild'

interface LayerInfo {
  instruction: string
  cachedNormal: LayerStatus
  cachedChanged: LayerStatus
}

const badOrder: LayerInfo[] = [
  { instruction: 'FROM node:20-alpine', cachedNormal: 'cached', cachedChanged: 'cached' },
  { instruction: 'WORKDIR /app', cachedNormal: 'cached', cachedChanged: 'cached' },
  { instruction: 'COPY . .', cachedNormal: 'cached', cachedChanged: 'miss' },
  { instruction: 'RUN npm install', cachedNormal: 'cached', cachedChanged: 'rebuild' },
  { instruction: 'RUN npm run build', cachedNormal: 'cached', cachedChanged: 'rebuild' },
  { instruction: 'CMD ["node", "dist/server.js"]', cachedNormal: 'cached', cachedChanged: 'rebuild' },
]

const goodOrder: LayerInfo[] = [
  { instruction: 'FROM node:20-alpine', cachedNormal: 'cached', cachedChanged: 'cached' },
  { instruction: 'WORKDIR /app', cachedNormal: 'cached', cachedChanged: 'cached' },
  { instruction: 'COPY package*.json ./', cachedNormal: 'cached', cachedChanged: 'cached' },
  { instruction: 'RUN npm ci', cachedNormal: 'cached', cachedChanged: 'cached' },
  { instruction: 'COPY . .', cachedNormal: 'cached', cachedChanged: 'miss' },
  { instruction: 'RUN npm run build', cachedNormal: 'cached', cachedChanged: 'rebuild' },
  { instruction: 'CMD ["node", "dist/server.js"]', cachedNormal: 'cached', cachedChanged: 'rebuild' },
]

const runExamples = [
  {
    label: '❌ Раздельные RUN (кэш apt остаётся)',
    code: `RUN apt-get update
RUN apt-get install -y curl wget
RUN rm -rf /var/lib/apt/lists/*`,
    size: '150 MB',
    layers: 3,
  },
  {
    label: '✅ Объединённый RUN (кэш удалён)',
    code: `RUN apt-get update \\
    && apt-get install -y --no-install-recommends curl wget \\
    && rm -rf /var/lib/apt/lists/*`,
    size: '50 MB',
    layers: 1,
  },
  {
    label: '❌ Файл удалён в отдельном слое',
    code: `RUN wget https://example.com/big-file.tar.gz
RUN tar xzf big-file.tar.gz
RUN rm big-file.tar.gz`,
    size: '300 MB (tar.gz в первом слое!)',
    layers: 3,
  },
  {
    label: '✅ Скачивание и очистка в одном слое',
    code: `RUN wget https://example.com/big-file.tar.gz \\
    && tar xzf big-file.tar.gz \\
    && rm big-file.tar.gz`,
    size: '150 MB',
    layers: 1,
  },
]

const cacheMountExamples = [
  {
    manager: 'npm',
    code: `RUN --mount=type=cache,target=/root/.npm \\
    npm ci`,
  },
  {
    manager: 'pip',
    code: `RUN --mount=type=cache,target=/root/.cache/pip \\
    pip install -r requirements.txt`,
  },
  {
    manager: 'go',
    code: `RUN --mount=type=cache,target=/go/pkg/mod \\
    go mod download

RUN --mount=type=cache,target=/root/.cache/go-build \\
    go build -o server .`,
  },
  {
    manager: 'apt',
    code: `RUN --mount=type=cache,target=/var/cache/apt \\
    --mount=type=cache,target=/var/lib/apt/lists \\
    apt-get update && apt-get install -y curl`,
  },
]

type CacheSection = 'order' | 'run' | 'mounts'

const statusColors: Record<LayerStatus, string> = {
  cached: '#27ae60',
  miss: '#e74c3c',
  rebuild: '#f39c12',
}

const statusLabels: Record<LayerStatus, string> = {
  cached: 'CACHED',
  miss: 'MISS',
  rebuild: 'REBUILD',
}

export function Task10_3_Solution() {
  const [activeSection, setActiveSection] = useState<CacheSection>('order')
  const [fileChanged, setFileChanged] = useState(false)

  const sections: { key: CacheSection; label: string }[] = [
    { key: 'order', label: 'Порядок инструкций' },
    { key: 'run', label: 'Объединение RUN' },
    { key: 'mounts', label: 'Cache mounts' },
  ]

  const renderLayers = (layers: LayerInfo[], label: string, isGood: boolean) => (
    <div style={{ flex: 1 }}>
      <strong style={{ fontSize: '0.85rem', color: isGood ? '#27ae60' : '#e74c3c' }}>
        {isGood ? '✅' : '❌'} {label}
      </strong>
      <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {layers.map((layer, i) => {
          const status = fileChanged ? layer.cachedChanged : layer.cachedNormal
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.3rem 0.5rem',
                backgroundColor: '#f9f9f9',
                borderRadius: '4px',
                border: `1px solid ${statusColors[status]}30`,
              }}
            >
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  color: '#fff',
                  backgroundColor: statusColors[status],
                  padding: '0.1rem 0.3rem',
                  borderRadius: '3px',
                  whiteSpace: 'nowrap',
                  minWidth: '55px',
                  textAlign: 'center',
                }}
              >
                {statusLabels[status]}
              </span>
              <code style={{ fontSize: '0.72rem', color: '#333' }}>{layer.instruction}</code>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h3 style={{ marginBottom: '1rem' }}>Задание 10.3: Оптимизация слоёв и кэширование</h3>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            style={{
              padding: '0.4rem 0.8rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: activeSection === s.key ? '#0070f3' : '#fff',
              color: activeSection === s.key ? '#fff' : '#333',
              fontSize: '0.85rem',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === 'order' && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input
                type="checkbox"
                checked={fileChanged}
                onChange={(e) => setFileChanged(e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <span>Исходный код изменился (src/index.ts)</span>
            </label>
            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
              {fileChanged
                ? '⚡ Код изменён -- смотрите, сколько слоёв инвалидируется в каждом варианте'
                : '💤 Ничего не изменилось -- все слои из кэша'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {renderLayers(badOrder, 'Плохой порядок', false)}
            {renderLayers(goodOrder, 'Хороший порядок', true)}
          </div>

          {fileChanged && (
            <div style={{ marginTop: '0.75rem', padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '6px', fontSize: '0.8rem', border: '1px solid #ffc107' }}>
              <strong>Результат:</strong> В плохом варианте <code>npm install</code> пересобирается при каждом изменении кода.
              В хорошем -- <code>npm ci</code> берётся из кэша (package.json не менялся). Экономия: <strong>2-5 минут</strong> на каждой сборке.
            </div>
          )}
        </div>
      )}

      {activeSection === 'run' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
          {runExamples.map((example, i) => (
            <div key={i} style={{ border: '1px solid #e2e2e2', borderRadius: '6px', padding: '0.75rem' }}>
              <strong style={{ fontSize: '0.85rem' }}>{example.label}</strong>
              <pre
                style={{
                  backgroundColor: '#1e1e1e',
                  color: '#d4d4d4',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  overflow: 'auto',
                  fontSize: '0.78rem',
                  lineHeight: '1.5',
                  margin: '0.5rem 0',
                }}
              >
                {example.code}
              </pre>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#555' }}>
                <span>Слоёв: <strong>{example.layers}</strong></span>
                <span>Размер: <strong>{example.size}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'mounts' && (
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '0.75rem' }}>
            <code>--mount=type=cache</code> сохраняет кэш пакетных менеджеров <strong>между сборками</strong>,
            не добавляя его в слой образа. Требует BuildKit и <code># syntax=docker/dockerfile:1</code>.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {cacheMountExamples.map((cm) => (
              <div key={cm.manager} style={{ border: '1px solid #e2e2e2', borderRadius: '6px', padding: '0.75rem' }}>
                <strong style={{ fontSize: '0.9rem', fontFamily: 'monospace' }}>{cm.manager}</strong>
                <pre
                  style={{
                    backgroundColor: '#1e1e1e',
                    color: '#d4d4d4',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    overflow: 'auto',
                    fontSize: '0.78rem',
                    lineHeight: '1.5',
                    marginTop: '0.25rem',
                  }}
                >
                  {cm.code}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          padding: '0.75rem',
          backgroundColor: '#e8f5e9',
          borderRadius: '6px',
          border: '1px solid #4caf50',
          fontSize: '0.85rem',
        }}
      >
        <strong>📌 Правило:</strong> Редко меняющееся -- <strong>сверху</strong>, часто меняющееся -- <strong>снизу</strong>.
        Зависимости (package.json) копируются перед кодом (COPY . .). Удаление файлов -- в том же RUN, где они создаются.
      </div>
    </div>
  )
}

// ========================================
// Задание 10.4: .dockerignore и BuildKit — Решение
// ========================================

const dockerignorePatterns = [
  { pattern: '# comment', description: 'Комментарий (игнорируется)', example: '# Dependencies' },
  { pattern: 'node_modules', description: 'Директория или файл по имени', example: 'node_modules, .git, dist' },
  { pattern: '*.log', description: 'Wildcard: все файлы с расширением', example: '*.log, *.tmp, *.md' },
  { pattern: '**/*.test.ts', description: 'Рекурсивный wildcard в поддиректориях', example: '**/*.test.ts, **/*.spec.js' },
  { pattern: '!README.md', description: 'Исключение: включить обратно файл', example: '*.md затем !README.md' },
  { pattern: 'temp?', description: 'Один любой символ', example: 'temp1, temp2, tempX' },
  { pattern: '.env*', description: 'Все файлы начинающиеся с .env', example: '.env, .env.local, .env.prod' },
]

const dockerignoreNodejs = `# Dependencies
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build output
dist
build

# Tests
coverage
**/*.test.ts
**/*.spec.ts
__tests__
jest.config.*

# Version control
.git
.gitignore

# IDE
.vscode
.idea
*.swp
*.swo

# Environment
.env
.env.*
!.env.example

# Docker
Dockerfile*
docker-compose*.yml
.dockerignore

# Documentation
*.md
!README.md

# OS
.DS_Store
Thumbs.db

# CI/CD
.github
.gitlab-ci.yml
.circleci`

const dockerignorePython = `# Python
__pycache__
*.pyc
*.pyo
*.egg-info
.eggs
dist
build

# Virtual environment
venv
.venv
env

# Tests
.pytest_cache
htmlcov
.coverage
tests

# IDE
.vscode
.idea

# Git
.git
.gitignore

# Docker
Dockerfile*
docker-compose*.yml
.dockerignore

# Environment
.env
.env.*

# Documentation
*.md
docs`

const buildkitFeatures = [
  {
    feature: 'Параллельная сборка',
    description: 'Независимые stages собираются одновременно',
    code: `# frontend-builder и backend-builder
# собираются параллельно!
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend
COPY frontend/ .
RUN npm ci && npm run build

FROM golang:1.22-alpine AS backend-builder
WORKDIR /app
COPY . .
RUN go build -o server .

FROM alpine:3.19
COPY --from=backend-builder /app/server /server
COPY --from=frontend-builder /frontend/dist /static`,
  },
  {
    feature: 'Cache mounts',
    description: 'Кэш пакетных менеджеров между сборками (не попадает в слой)',
    code: `# syntax=docker/dockerfile:1
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \\
    npm ci
COPY . .`,
  },
  {
    feature: 'Секреты (--mount=type=secret)',
    description: 'Безопасная передача секретов при сборке, не попадают в слой',
    code: `# syntax=docker/dockerfile:1
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \\
    npm ci

# Сборка:
# docker build --secret id=npmrc,src=$HOME/.npmrc -t myapp .`,
  },
  {
    feature: 'SSH-агент (--mount=type=ssh)',
    description: 'Проброс SSH-ключей для клонирования приватных репозиториев',
    code: `# syntax=docker/dockerfile:1
FROM alpine AS builder
RUN apk add --no-cache git openssh-client
RUN --mount=type=ssh \\
    git clone git@github.com:myorg/private-repo.git /app

# Сборка:
# docker build --ssh default -t myapp .`,
  },
  {
    feature: 'Heredoc синтаксис',
    description: 'Многострочные скрипты и inline файлы без backslash',
    code: `# syntax=docker/dockerfile:1

# Многострочный скрипт
RUN <<EOF
apt-get update
apt-get install -y curl wget
rm -rf /var/lib/apt/lists/*
EOF

# Inline файл
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    location / {
        proxy_pass http://app:3000;
    }
}
EOF`,
  },
]

type IgnoreSection = 'dockerignore' | 'buildkit'

export function Task10_4_Solution() {
  const [activeSection, setActiveSection] = useState<IgnoreSection>('dockerignore')
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null)
  const [activeFeature, setActiveFeature] = useState<string | null>(null)

  const sections: { key: IgnoreSection; label: string }[] = [
    { key: 'dockerignore', label: '.dockerignore' },
    { key: 'buildkit', label: 'BuildKit' },
  ]

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h3 style={{ marginBottom: '1rem' }}>Задание 10.4: .dockerignore и BuildKit</h3>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            style={{
              padding: '0.4rem 0.8rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: activeSection === s.key ? '#0070f3' : '#fff',
              color: activeSection === s.key ? '#fff' : '#333',
              fontSize: '0.85rem',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === 'dockerignore' && (
        <div style={{ marginBottom: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginBottom: '1rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '0.4rem', border: '1px solid #ddd', textAlign: 'left' }}>Паттерн</th>
                <th style={{ padding: '0.4rem', border: '1px solid #ddd', textAlign: 'left' }}>Описание</th>
                <th style={{ padding: '0.4rem', border: '1px solid #ddd', textAlign: 'left' }}>Примеры</th>
              </tr>
            </thead>
            <tbody>
              {dockerignorePatterns.map((p) => (
                <tr key={p.pattern}>
                  <td style={{ padding: '0.4rem', border: '1px solid #ddd', fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 'bold' }}>{p.pattern}</td>
                  <td style={{ padding: '0.4rem', border: '1px solid #ddd' }}>{p.description}</td>
                  <td style={{ padding: '0.4rem', border: '1px solid #ddd', fontFamily: 'monospace', fontSize: '0.75rem', color: '#555' }}>{p.example}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              onClick={() => setActiveTemplate(activeTemplate === 'nodejs' ? null : 'nodejs')}
              style={{
                padding: '0.4rem 0.8rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: activeTemplate === 'nodejs' ? '#e8f4fd' : '#f9f9f9',
                fontSize: '0.85rem',
              }}
            >
              {activeTemplate === 'nodejs' ? 'Скрыть' : 'Показать'} шаблон Node.js
            </button>
            <button
              onClick={() => setActiveTemplate(activeTemplate === 'python' ? null : 'python')}
              style={{
                padding: '0.4rem 0.8rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: activeTemplate === 'python' ? '#e8f4fd' : '#f9f9f9',
                fontSize: '0.85rem',
              }}
            >
              {activeTemplate === 'python' ? 'Скрыть' : 'Показать'} шаблон Python
            </button>
          </div>

          {activeTemplate && (
            <pre
              style={{
                backgroundColor: '#1e1e1e',
                color: '#d4d4d4',
                padding: '0.75rem',
                borderRadius: '6px',
                overflow: 'auto',
                fontSize: '0.78rem',
                lineHeight: '1.5',
                marginBottom: '1rem',
              }}
            >
              {activeTemplate === 'nodejs' ? dockerignoreNodejs : dockerignorePython}
            </pre>
          )}

          <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Влияние на размер build context</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '130px', fontSize: '0.8rem', textAlign: 'right', color: '#e74c3c' }}>Без .dockerignore:</span>
              <div style={{ flex: 1, backgroundColor: '#f0f0f0', borderRadius: '4px', height: '24px' }}>
                <div
                  style={{
                    width: '100%',
                    backgroundColor: '#e74c3c',
                    borderRadius: '4px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '0.5rem',
                  }}
                >
                  <span style={{ fontSize: '0.7rem', color: '#fff', fontWeight: 'bold' }}>1.5 GB (node_modules + .git + ...)</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '130px', fontSize: '0.8rem', textAlign: 'right', color: '#27ae60' }}>С .dockerignore:</span>
              <div style={{ flex: 1, backgroundColor: '#f0f0f0', borderRadius: '4px', height: '24px' }}>
                <div
                  style={{
                    width: '3%',
                    backgroundColor: '#27ae60',
                    borderRadius: '4px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '0.5rem',
                    minWidth: '100px',
                  }}
                >
                  <span style={{ fontSize: '0.7rem', color: '#fff', fontWeight: 'bold' }}>45 KB</span>
                </div>
              </div>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#555' }}>Разница: <strong>в 33 000 раз</strong> меньше данных отправляется в Docker daemon.</p>
        </div>
      )}

      {activeSection === 'buildkit' && (
        <div style={{ marginBottom: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginBottom: '1rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '0.4rem', border: '1px solid #ddd', textAlign: 'left' }}>Возможность</th>
                <th style={{ padding: '0.4rem', border: '1px solid #ddd', textAlign: 'left' }}>Описание</th>
                <th style={{ padding: '0.4rem', border: '1px solid #ddd', textAlign: 'center' }}>Пример</th>
              </tr>
            </thead>
            <tbody>
              {buildkitFeatures.map((f) => (
                <tr key={f.feature}>
                  <td style={{ padding: '0.4rem', border: '1px solid #ddd', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{f.feature}</td>
                  <td style={{ padding: '0.4rem', border: '1px solid #ddd' }}>{f.description}</td>
                  <td style={{ padding: '0.4rem', border: '1px solid #ddd', textAlign: 'center' }}>
                    <button
                      onClick={() => setActiveFeature(activeFeature === f.feature ? null : f.feature)}
                      style={{
                        padding: '0.2rem 0.5rem',
                        border: '1px solid #ccc',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        backgroundColor: activeFeature === f.feature ? '#e8f4fd' : '#f9f9f9',
                        fontSize: '0.75rem',
                      }}
                    >
                      {activeFeature === f.feature ? 'Скрыть' : 'Код'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {activeFeature && (
            <div style={{ marginBottom: '1rem' }}>
              <strong style={{ fontSize: '0.85rem' }}>{activeFeature}:</strong>
              <pre
                style={{
                  backgroundColor: '#1e1e1e',
                  color: '#d4d4d4',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  overflow: 'auto',
                  fontSize: '0.78rem',
                  lineHeight: '1.5',
                  marginTop: '0.25rem',
                }}
              >
                {buildkitFeatures.find((f) => f.feature === activeFeature)?.code}
              </pre>
            </div>
          )}
        </div>
      )}

      <div
        style={{
          padding: '0.75rem',
          backgroundColor: '#e8f5e9',
          borderRadius: '6px',
          border: '1px solid #4caf50',
          fontSize: '0.85rem',
        }}
      >
        <strong>💡 Рекомендация:</strong> Добавляйте <code># syntax=docker/dockerfile:1</code> в начало каждого Dockerfile
        для доступа к новейшим возможностям BuildKit. Проверьте версию:{' '}
        <code style={{ backgroundColor: '#d4edda', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>docker buildx version</code>.
        BuildKit включён по умолчанию в Docker 23.0+.
      </div>
    </div>
  )
}
