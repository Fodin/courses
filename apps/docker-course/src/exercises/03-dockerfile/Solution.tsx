import { useState } from 'react'

// ============================================
// Задание 3.1: WORKDIR, ENV, ARG — Решение
// ============================================

interface InstructionExample {
  title: string
  dockerfile: string
  explanation: string
  type: 'workdir' | 'env' | 'arg' | 'combined'
}

const instructionExamples: InstructionExample[] = [
  {
    title: 'WORKDIR -- установка рабочей директории',
    type: 'workdir',
    dockerfile: `FROM node:20-alpine

# Создаёт директорию и переходит в неё
WORKDIR /app

# Все пути теперь относительно /app
COPY package.json ./     # -> /app/package.json
RUN npm install           # выполняется в /app

WORKDIR /app/src
COPY . .                  # -> /app/src/`,
    explanation:
      'WORKDIR устанавливает рабочую директорию для RUN, CMD, ENTRYPOINT, COPY, ADD. Если директория не существует, она будет создана автоматически. Можно вызывать несколько раз.',
  },
  {
    title: 'ENV -- переменные окружения (runtime)',
    type: 'env',
    dockerfile: `FROM node:20-alpine
WORKDIR /app

# Доступны при сборке И в контейнере
ENV NODE_ENV=production
ENV APP_PORT=3000
ENV LOG_LEVEL=info

# Используются в RUN
RUN echo "Environment: $NODE_ENV"

# Переопределение при запуске:
# docker run -e NODE_ENV=development my-app`,
    explanation:
      'ENV задаёт переменные окружения, которые сохраняются в образе и доступны в запущенном контейнере. Можно переопределить через docker run -e или --env-file.',
  },
  {
    title: 'ARG -- аргументы сборки (build-time)',
    type: 'arg',
    dockerfile: `# ARG до FROM: только для FROM
ARG NODE_VERSION=20

FROM node:\${NODE_VERSION}-alpine

# ARG после FROM: для инструкций сборки
ARG APP_VERSION=1.0.0
ARG BUILD_DATE

# Доступны только при сборке!
RUN echo "Version: $APP_VERSION"
LABEL version=$APP_VERSION

# Передача: docker build --build-arg APP_VERSION=2.0 .`,
    explanation:
      'ARG определяет переменные, доступные ТОЛЬКО при сборке. Они не сохраняются в образе и недоступны в контейнере. ARG до FROM виден только в инструкции FROM.',
  },
  {
    title: 'Комбинация ARG + ENV',
    type: 'combined',
    dockerfile: `ARG NODE_VERSION=20
FROM node:\${NODE_VERSION}-alpine

# Паттерн: ARG -> ENV для сохранения в контейнере
ARG APP_VERSION=1.0.0
ENV APP_VERSION=\${APP_VERSION}

# Теперь APP_VERSION доступна и при сборке, и в контейнере
RUN echo "Building v$APP_VERSION"
CMD ["sh", "-c", "echo Running v$APP_VERSION"]

# docker build --build-arg APP_VERSION=2.0 .
# docker run my-app  -> "Running v2.0"`,
    explanation:
      'Частый паттерн: принять значение через ARG при сборке и сохранить в ENV для доступа в контейнере. Это позволяет параметризовать и сборку, и runtime.',
  },
]

const scopeComparison = [
  { feature: 'Доступна при сборке', env: true, arg: true },
  { feature: 'Доступна в контейнере', env: true, arg: false },
  { feature: 'Сохраняется в образе', env: true, arg: false },
  { feature: 'Переопределение при сборке', env: false, arg: true },
  { feature: 'Переопределение при запуске', env: true, arg: false },
  { feature: 'Видима в docker inspect', env: true, arg: false },
]

export function Task3_1_Solution() {
  const [activeTab, setActiveTab] = useState<InstructionExample['type']>('workdir')
  const [showComparison, setShowComparison] = useState(false)

  const activeExample = instructionExamples.find((e) => e.type === activeTab)

  return (
    <div style={{ padding: '1rem' }}>
      <h2>WORKDIR, ENV, ARG</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {([
          { key: 'workdir', label: 'WORKDIR' },
          { key: 'env', label: 'ENV' },
          { key: 'arg', label: 'ARG' },
          { key: 'combined', label: 'ARG + ENV' },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: '0.5rem 1rem',
              border: `2px solid ${activeTab === key ? '#1976d2' : '#ccc'}`,
              background: activeTab === key ? '#1976d2' : 'white',
              color: activeTab === key ? 'white' : '#333',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: activeTab === key ? 'bold' : 'normal',
              fontSize: '0.9rem',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {activeExample && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>{activeExample.title}</h3>
          <pre
            style={{
              background: '#1e1e1e',
              color: '#d4d4d4',
              padding: '1rem',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '0.85rem',
              lineHeight: 1.6,
            }}
          >
            {activeExample.dockerfile}
          </pre>
          <div
            style={{
              padding: '0.75rem 1rem',
              background: '#e3f2fd',
              borderRadius: '0 0 8px 8px',
              borderLeft: '4px solid #1976d2',
              fontSize: '0.9rem',
              marginTop: '-8px',
            }}
          >
            {activeExample.explanation}
          </div>
        </div>
      )}

      <button
        onClick={() => setShowComparison(!showComparison)}
        style={{
          padding: '0.5rem 1rem',
          border: '2px solid #388e3c',
          background: showComparison ? '#388e3c' : 'white',
          color: showComparison ? 'white' : '#388e3c',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginBottom: '1rem',
        }}
      >
        {showComparison ? 'Скрыть сравнение' : 'Сравнение ENV vs ARG'}
      </button>

      {showComparison && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#263238', color: 'white' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Характеристика</th>
              <th style={{ padding: '0.75rem', textAlign: 'center' }}>ENV</th>
              <th style={{ padding: '0.75rem', textAlign: 'center' }}>ARG</th>
            </tr>
          </thead>
          <tbody>
            {scopeComparison.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: '0.75rem' }}>{row.feature}</td>
                <td
                  style={{
                    padding: '0.75rem',
                    textAlign: 'center',
                    background: row.env ? '#e8f5e9' : '#ffebee',
                    fontWeight: 'bold',
                  }}
                >
                  {row.env ? 'Da' : 'Net'}
                </td>
                <td
                  style={{
                    padding: '0.75rem',
                    textAlign: 'center',
                    background: row.arg ? '#e8f5e9' : '#ffebee',
                    fontWeight: 'bold',
                  }}
                >
                  {row.arg ? 'Da' : 'Net'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

// ============================================
// Задание 3.2: CMD vs ENTRYPOINT — Решение
// ============================================

interface CommandScenario {
  name: string
  dockerfile: string
  runCommand: string
  result: string
}

const cmdScenarios: CommandScenario[] = [
  {
    name: 'CMD exec-form',
    dockerfile: 'CMD ["node", "server.js"]',
    runCommand: 'docker run my-app',
    result: 'node server.js (PID 1 = node)',
  },
  {
    name: 'CMD shell-form',
    dockerfile: 'CMD node server.js',
    runCommand: 'docker run my-app',
    result: '/bin/sh -c "node server.js" (PID 1 = sh)',
  },
  {
    name: 'CMD override',
    dockerfile: 'CMD ["node", "server.js"]',
    runCommand: 'docker run my-app node test.js',
    result: 'node test.js (CMD полностью заменён)',
  },
  {
    name: 'ENTRYPOINT exec-form',
    dockerfile: 'ENTRYPOINT ["python", "app.py"]',
    runCommand: 'docker run my-app',
    result: 'python app.py (PID 1 = python)',
  },
  {
    name: 'ENTRYPOINT + args',
    dockerfile: 'ENTRYPOINT ["python", "app.py"]',
    runCommand: 'docker run my-app --verbose',
    result: 'python app.py --verbose (args добавляются)',
  },
  {
    name: 'ENTRYPOINT + CMD',
    dockerfile: 'ENTRYPOINT ["python"]\nCMD ["app.py"]',
    runCommand: 'docker run my-app',
    result: 'python app.py (ENTRYPOINT + CMD)',
  },
  {
    name: 'ENTRYPOINT + CMD override',
    dockerfile: 'ENTRYPOINT ["python"]\nCMD ["app.py"]',
    runCommand: 'docker run my-app test.py',
    result: 'python test.py (CMD заменён, ENTRYPOINT остался)',
  },
]

const formComparison = [
  {
    aspect: 'PID 1 процесс',
    exec: 'Приложение (node, python, ...)',
    shell: '/bin/sh',
  },
  {
    aspect: 'Обработка SIGTERM',
    exec: 'Приложение получает сигнал',
    shell: 'sh получает, не передаёт дочерним',
  },
  {
    aspect: 'Graceful shutdown',
    exec: 'Работает корректно',
    shell: 'Не работает (SIGKILL через 10 сек)',
  },
  {
    aspect: 'Подстановка переменных',
    exec: 'Не работает ($VAR не раскрывается)',
    shell: 'Работает ($VAR раскрывается sh)',
  },
  {
    aspect: 'Синтаксис',
    exec: '["executable", "arg1", "arg2"]',
    shell: 'executable arg1 arg2',
  },
]

export function Task3_2_Solution() {
  const [activeScenario, setActiveScenario] = useState(0)
  const [showFormComparison, setShowFormComparison] = useState(false)
  const [showEntrypointPattern, setShowEntrypointPattern] = useState(false)

  return (
    <div style={{ padding: '1rem' }}>
      <h2>CMD vs ENTRYPOINT</h2>

      <h3>Интерактивные сценарии</h3>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Выберите сценарий, чтобы увидеть, что произойдёт при запуске контейнера:
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {cmdScenarios.map((scenario, i) => (
          <button
            key={i}
            onClick={() => setActiveScenario(i)}
            style={{
              padding: '0.4rem 0.8rem',
              border: `2px solid ${activeScenario === i ? '#1976d2' : '#ccc'}`,
              background: activeScenario === i ? '#1976d2' : 'white',
              color: activeScenario === i ? 'white' : '#333',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: activeScenario === i ? 'bold' : 'normal',
            }}
          >
            {scenario.name}
          </button>
        ))}
      </div>

      <div
        style={{
          background: '#1e1e1e',
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ padding: '0.75rem 1rem', background: '#333', color: '#aaa', fontSize: '0.8rem' }}>
          Dockerfile
        </div>
        <pre
          style={{
            margin: 0,
            padding: '1rem',
            color: '#d4d4d4',
            fontSize: '0.85rem',
            lineHeight: 1.6,
          }}
        >
          {cmdScenarios[activeScenario].dockerfile}
        </pre>
        <div style={{ padding: '0.75rem 1rem', background: '#333', color: '#aaa', fontSize: '0.8rem' }}>
          Команда запуска
        </div>
        <pre
          style={{
            margin: 0,
            padding: '1rem',
            color: '#4fc3f7',
            fontSize: '0.85rem',
          }}
        >
          $ {cmdScenarios[activeScenario].runCommand}
        </pre>
        <div style={{ padding: '0.75rem 1rem', background: '#1b5e20', color: '#a5d6a7', fontSize: '0.8rem' }}>
          Результат
        </div>
        <pre
          style={{
            margin: 0,
            padding: '1rem',
            color: '#81c784',
            fontSize: '0.85rem',
          }}
        >
          {cmdScenarios[activeScenario].result}
        </pre>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          onClick={() => setShowFormComparison(!showFormComparison)}
          style={{
            padding: '0.5rem 1rem',
            border: '2px solid #f57c00',
            background: showFormComparison ? '#f57c00' : 'white',
            color: showFormComparison ? 'white' : '#f57c00',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {showFormComparison ? 'Скрыть' : 'Exec vs Shell форма'}
        </button>
        <button
          onClick={() => setShowEntrypointPattern(!showEntrypointPattern)}
          style={{
            padding: '0.5rem 1rem',
            border: '2px solid #7b1fa2',
            background: showEntrypointPattern ? '#7b1fa2' : 'white',
            color: showEntrypointPattern ? 'white' : '#7b1fa2',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {showEntrypointPattern ? 'Скрыть' : 'Паттерн entrypoint.sh'}
        </button>
      </div>

      {showFormComparison && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
          <thead>
            <tr style={{ background: '#263238', color: 'white' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Аспект</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Exec-форма</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Shell-форма</th>
            </tr>
          </thead>
          <tbody>
            {formComparison.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{row.aspect}</td>
                <td style={{ padding: '0.75rem', background: '#e8f5e9' }}>{row.exec}</td>
                <td style={{ padding: '0.75rem', background: '#ffebee' }}>{row.shell}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showEntrypointPattern && (
        <div style={{ marginBottom: '1rem' }}>
          <h4>Паттерн: entrypoint.sh + CMD</h4>
          <pre
            style={{
              background: '#1e1e1e',
              color: '#d4d4d4',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              lineHeight: 1.6,
            }}
          >
            {`# entrypoint.sh
#!/bin/sh
set -e

echo "Running migrations..."
npm run migrate

echo "Starting: $@"
exec "$@"    # Выполняет CMD или аргументы docker run

# Dockerfile
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "server.js"]

# Использование:
# docker run my-app              -> migrate + node server.js
# docker run my-app npm test     -> migrate + npm test
# docker run my-app node repl    -> migrate + node repl`}
          </pre>
          <div
            style={{
              padding: '0.75rem',
              background: '#f3e5f5',
              borderLeft: '4px solid #7b1fa2',
              borderRadius: '0 8px 8px 0',
              fontSize: '0.9rem',
            }}
          >
            exec "$@" заменяет shell-процесс на команду из CMD/аргументов. Это гарантирует, что приложение получит PID 1 и будет корректно обрабатывать сигналы.
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 3.3: COPY vs ADD, .dockerignore — Решение
// ============================================

interface CopyVsAddRow {
  scenario: string
  copy: string
  add: string
  recommended: 'copy' | 'add' | 'neither'
}

const copyVsAddData: CopyVsAddRow[] = [
  {
    scenario: 'Копирование локальных файлов',
    copy: 'COPY package.json /app/',
    add: 'ADD package.json /app/',
    recommended: 'copy',
  },
  {
    scenario: 'Копирование с правами',
    copy: 'COPY --chown=node:node . /app/',
    add: 'ADD --chown=node:node . /app/',
    recommended: 'copy',
  },
  {
    scenario: 'Распаковка tar-архива',
    copy: 'COPY app.tar.gz /app/ (файл как есть)',
    add: 'ADD app.tar.gz /app/ (автораспаковка)',
    recommended: 'add',
  },
  {
    scenario: 'Скачивание из URL',
    copy: 'Не поддерживает',
    add: 'ADD https://url/file /app/ (скачает)',
    recommended: 'neither',
  },
]

const dockerignoreExample = `# Dependencies
node_modules
npm-debug.log*

# Version control
.git
.gitignore

# Docker files
Dockerfile
docker-compose*.yml
.dockerignore

# Environment and secrets
.env
.env.*
*.pem
credentials/

# IDE
.vscode
.idea
*.swp

# Tests and docs
coverage
.nyc_output
**/*.test.js
**/*.spec.ts
*.md
!README.md

# Build artifacts
dist
build`

export function Task3_3_Solution() {
  const [showDockerignore, setShowDockerignore] = useState(false)
  const [contextSize, setContextSize] = useState<'without' | 'with'>('without')

  const contextSizes = {
    without: {
      total: '487 MB',
      breakdown: [
        { name: 'node_modules/', size: '350 MB', color: '#d32f2f' },
        { name: '.git/', size: '85 MB', color: '#f57c00' },
        { name: 'Source code', size: '12 MB', color: '#388e3c' },
        { name: '.env, secrets', size: '0.1 MB', color: '#d32f2f' },
        { name: 'Other', size: '40 MB', color: '#757575' },
      ],
    },
    with: {
      total: '12 MB',
      breakdown: [
        { name: 'Source code', size: '12 MB', color: '#388e3c' },
      ],
    },
  }

  const activeContext = contextSizes[contextSize]

  return (
    <div style={{ padding: '1rem' }}>
      <h2>COPY vs ADD, .dockerignore</h2>

      <h3>COPY vs ADD -- сравнение</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
        <thead>
          <tr style={{ background: '#263238', color: 'white' }}>
            <th style={{ padding: '0.75rem', textAlign: 'left', width: '25%' }}>Сценарий</th>
            <th style={{ padding: '0.75rem', textAlign: 'left', width: '30%' }}>COPY</th>
            <th style={{ padding: '0.75rem', textAlign: 'left', width: '30%' }}>ADD</th>
            <th style={{ padding: '0.75rem', textAlign: 'center', width: '15%' }}>Рекомендация</th>
          </tr>
        </thead>
        <tbody>
          {copyVsAddData.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #e0e0e0' }}>
              <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{row.scenario}</td>
              <td
                style={{
                  padding: '0.75rem',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  background: row.recommended === 'copy' ? '#e8f5e9' : 'transparent',
                }}
              >
                {row.copy}
              </td>
              <td
                style={{
                  padding: '0.75rem',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  background: row.recommended === 'add' ? '#e8f5e9' : 'transparent',
                }}
              >
                {row.add}
              </td>
              <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold' }}>
                {row.recommended === 'copy' && (
                  <span style={{ color: '#1976d2' }}>COPY</span>
                )}
                {row.recommended === 'add' && (
                  <span style={{ color: '#388e3c' }}>ADD</span>
                )}
                {row.recommended === 'neither' && (
                  <span style={{ color: '#f57c00' }}>RUN curl</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          padding: '1rem',
          background: '#fff3e0',
          borderLeft: '4px solid #f57c00',
          borderRadius: '0 8px 8px 0',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
        }}
      >
        <strong>Правило:</strong> используйте COPY по умолчанию. ADD нужен только когда требуется автоматическая распаковка tar-архива. Для скачивания файлов используйте RUN curl/wget.
      </div>

      <h3>.dockerignore</h3>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          onClick={() => setContextSize('without')}
          style={{
            padding: '0.5rem 1rem',
            border: `2px solid ${contextSize === 'without' ? '#d32f2f' : '#ccc'}`,
            background: contextSize === 'without' ? '#d32f2f' : 'white',
            color: contextSize === 'without' ? 'white' : '#333',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Без .dockerignore
        </button>
        <button
          onClick={() => setContextSize('with')}
          style={{
            padding: '0.5rem 1rem',
            border: `2px solid ${contextSize === 'with' ? '#388e3c' : '#ccc'}`,
            background: contextSize === 'with' ? '#388e3c' : 'white',
            color: contextSize === 'with' ? 'white' : '#333',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          С .dockerignore
        </button>
      </div>

      <div
        style={{
          padding: '1rem',
          background: '#fafafa',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
          Sending build context to Docker daemon
        </div>
        <div
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: contextSize === 'without' ? '#d32f2f' : '#388e3c',
            marginBottom: '1rem',
          }}
        >
          {activeContext.total}
        </div>
        {activeContext.breakdown.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem',
            }}
          >
            <div
              style={{
                width: `${Math.max(parseInt(item.size) * 0.5, 20)}px`,
                height: '20px',
                background: item.color,
                borderRadius: '4px',
                minWidth: '20px',
                maxWidth: '200px',
              }}
            />
            <span style={{ fontSize: '0.85rem' }}>
              {item.name} -- {item.size}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowDockerignore(!showDockerignore)}
        style={{
          padding: '0.5rem 1rem',
          border: '2px solid #1976d2',
          background: showDockerignore ? '#1976d2' : 'white',
          color: showDockerignore ? 'white' : '#1976d2',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginBottom: '1rem',
        }}
      >
        {showDockerignore ? 'Скрыть .dockerignore' : 'Показать пример .dockerignore'}
      </button>

      {showDockerignore && (
        <pre
          style={{
            background: '#1e1e1e',
            color: '#d4d4d4',
            padding: '1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            lineHeight: 1.6,
            overflow: 'auto',
          }}
        >
          {dockerignoreExample}
        </pre>
      )}
    </div>
  )
}

// ============================================
// Задание 3.4: Multi-stage builds — Решение
// ============================================

interface BuildStage {
  name: string
  baseImage: string
  purpose: string
  contents: string[]
  size: string
  color: string
}

interface MultiStageExample {
  title: string
  language: string
  stages: BuildStage[]
  dockerfile: string
  singleStageSize: string
  multiStageSize: string
}

const examples: MultiStageExample[] = [
  {
    title: 'Node.js API',
    language: 'node',
    stages: [
      {
        name: 'builder',
        baseImage: 'node:20',
        purpose: 'Сборка и установка зависимостей',
        contents: ['Source code', 'node_modules (dev + prod)', 'TypeScript compiler', 'Build tools', 'dist/'],
        size: '1.1 GB',
        color: '#f57c00',
      },
      {
        name: 'production',
        baseImage: 'node:20-alpine',
        purpose: 'Production runtime',
        contents: ['dist/', 'node_modules (prod only)', 'package.json'],
        size: '150 MB',
        color: '#388e3c',
      },
    ],
    dockerfile: `# Stage 1: Build
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
USER app
EXPOSE 3000
HEALTHCHECK --interval=30s CMD wget -q --spider http://localhost:3000/health || exit 1
CMD ["node", "dist/server.js"]`,
    singleStageSize: '1.1 GB',
    multiStageSize: '150 MB',
  },
  {
    title: 'React + Nginx',
    language: 'react',
    stages: [
      {
        name: 'build',
        baseImage: 'node:20-alpine',
        purpose: 'Сборка React-приложения',
        contents: ['Source code', 'node_modules', 'Build tools', 'build/ (static files)'],
        size: '500 MB',
        color: '#f57c00',
      },
      {
        name: 'production',
        baseImage: 'nginx:alpine',
        purpose: 'Раздача статики',
        contents: ['nginx', 'build/ (HTML, CSS, JS)'],
        size: '25 MB',
        color: '#388e3c',
      },
    ],
    dockerfile: `# Stage 1: Build React app
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`,
    singleStageSize: '500 MB',
    multiStageSize: '25 MB',
  },
  {
    title: 'Go API',
    language: 'go',
    stages: [
      {
        name: 'builder',
        baseImage: 'golang:1.22',
        purpose: 'Компиляция Go-бинарника',
        contents: ['Source code', 'Go modules', 'Go compiler & tools', 'Binary'],
        size: '1.2 GB',
        color: '#f57c00',
      },
      {
        name: 'production',
        baseImage: 'scratch',
        purpose: 'Минимальный runtime',
        contents: ['Static binary'],
        size: '10 MB',
        color: '#388e3c',
      },
    ],
    dockerfile: `# Stage 1: Compile
FROM golang:1.22 AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /server ./cmd/server

# Stage 2: Minimal image
FROM scratch
COPY --from=builder /server /server
EXPOSE 8080
ENTRYPOINT ["/server"]`,
    singleStageSize: '1.2 GB',
    multiStageSize: '10 MB',
  },
]

export function Task3_4_Solution() {
  const [activeExample, setActiveExample] = useState(0)
  const [showDockerfile, setShowDockerfile] = useState(false)

  const example = examples[activeExample]
  const singleSize = parseFloat(example.singleStageSize)
  const multiSize = parseFloat(example.multiStageSize)
  const reduction = Math.round((1 - multiSize / (singleSize * (example.singleStageSize.includes('GB') ? 1000 : 1) / (example.multiStageSize.includes('GB') ? 1000 : 1))) * 100)

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Multi-stage builds</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {examples.map((ex, i) => (
          <button
            key={i}
            onClick={() => { setActiveExample(i); setShowDockerfile(false) }}
            style={{
              padding: '0.5rem 1rem',
              border: `2px solid ${activeExample === i ? '#1976d2' : '#ccc'}`,
              background: activeExample === i ? '#1976d2' : 'white',
              color: activeExample === i ? 'white' : '#333',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: activeExample === i ? 'bold' : 'normal',
            }}
          >
            {ex.title}
          </button>
        ))}
      </div>

      <h3>Этапы сборки: {example.title}</h3>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        {example.stages.map((stage, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              border: `2px solid ${stage.color}`,
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '0.75rem',
                background: stage.color,
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              {i === example.stages.length - 1 ? 'Final' : `Stage ${i + 1}`}: {stage.name}
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
                FROM {stage.baseImage}
              </div>
              <div style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                {stage.purpose}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#555' }}>
                <strong>Содержимое:</strong>
                <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1.25rem' }}>
                  {stage.contents.map((c, j) => (
                    <li key={j}>{c}</li>
                  ))}
                </ul>
              </div>
              <div
                style={{
                  marginTop: '0.75rem',
                  padding: '0.5rem',
                  background: `${stage.color}15`,
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                {stage.size}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>
            Single-stage build
          </div>
          <div
            style={{
              height: '40px',
              background: '#ffcdd2',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '1rem',
              fontWeight: 'bold',
              color: '#c62828',
              width: '100%',
            }}
          >
            {example.singleStageSize}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>
            Multi-stage build
          </div>
          <div
            style={{
              height: '40px',
              background: '#c8e6c9',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '1rem',
              fontWeight: 'bold',
              color: '#2e7d32',
              width: `${Math.max((multiSize / (singleSize * (example.singleStageSize.includes('GB') ? 1000 : 1))) * 100 * (example.multiStageSize.includes('GB') ? 1000 : 1), 10)}%`,
            }}
          >
            {example.multiStageSize}
          </div>
        </div>
        <div
          style={{
            padding: '0.5rem 1rem',
            background: '#e8f5e9',
            border: '2px solid #388e3c',
            borderRadius: '8px',
            fontWeight: 'bold',
            color: '#2e7d32',
            whiteSpace: 'nowrap',
          }}
        >
          -{reduction}%
        </div>
      </div>

      <button
        onClick={() => setShowDockerfile(!showDockerfile)}
        style={{
          padding: '0.5rem 1rem',
          border: '2px solid #1976d2',
          background: showDockerfile ? '#1976d2' : 'white',
          color: showDockerfile ? 'white' : '#1976d2',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginBottom: '1rem',
        }}
      >
        {showDockerfile ? 'Скрыть Dockerfile' : 'Показать Dockerfile'}
      </button>

      {showDockerfile && (
        <pre
          style={{
            background: '#1e1e1e',
            color: '#d4d4d4',
            padding: '1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            lineHeight: 1.6,
            overflow: 'auto',
          }}
        >
          {example.dockerfile}
        </pre>
      )}

      <div
        style={{
          padding: '1rem',
          background: '#e3f2fd',
          borderLeft: '4px solid #1976d2',
          borderRadius: '0 8px 8px 0',
          marginTop: '1rem',
          fontSize: '0.9rem',
        }}
      >
        <strong>Ключевые принципы multi-stage builds:</strong>
        <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem' }}>
          <li>Каждый FROM начинает новый этап сборки</li>
          <li>COPY --from=stage_name копирует файлы между этапами</li>
          <li>В финальный образ попадает только последний этап</li>
          <li>Промежуточные этапы нужны только для сборки</li>
          <li>Используйте alpine или scratch для production-этапа</li>
        </ul>
      </div>
    </div>
  )
}
