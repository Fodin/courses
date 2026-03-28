import { useState } from 'react'

// ============================================
// Задание 1.1: docker pull и реестры — Решение
// ============================================

interface RegistryExample {
  name: string
  description: string
  commands: { cmd: string; explanation: string }[]
  color: string
}

const registries: RegistryExample[] = [
  {
    name: 'Docker Hub (по умолчанию)',
    description:
      'Крупнейший публичный реестр. Используется по умолчанию, если реестр не указан в имени образа.',
    commands: [
      { cmd: 'docker pull nginx', explanation: 'Скачивает nginx:latest из Docker Hub' },
      { cmd: 'docker pull nginx:1.25-alpine', explanation: 'Конкретная версия с Alpine Linux' },
      { cmd: 'docker pull library/nginx:1.25', explanation: 'Полная форма для official images' },
    ],
    color: '#1976d2',
  },
  {
    name: 'GitHub Container Registry (ghcr.io)',
    description:
      'Реестр GitHub. Интегрируется с GitHub Actions и поддерживает публичные и приватные образы.',
    commands: [
      {
        cmd: 'docker pull ghcr.io/myorg/my-app:v1.0',
        explanation: 'Образ организации myorg',
      },
      {
        cmd: 'docker pull ghcr.io/username/tool:latest',
        explanation: 'Образ пользователя',
      },
    ],
    color: '#6e5494',
  },
  {
    name: 'Amazon ECR',
    description:
      'Приватный реестр AWS. Требует аутентификации через AWS CLI перед использованием.',
    commands: [
      {
        cmd: 'aws ecr get-login-password | docker login --username AWS --password-stdin <id>.dkr.ecr.<region>.amazonaws.com',
        explanation: 'Аутентификация в ECR',
      },
      {
        cmd: 'docker pull 123456789.dkr.ecr.us-east-1.amazonaws.com/my-app:1.0',
        explanation: 'Скачивание образа из ECR',
      },
    ],
    color: '#ff9900',
  },
  {
    name: 'Digest Pinning',
    description:
      'Использование SHA256-хеша для побитовой идентификации образа. Гарантирует воспроизводимость.',
    commands: [
      {
        cmd: 'docker pull nginx@sha256:4c0fdaa8b6341...',
        explanation: 'Скачивание по digest — всегда тот же образ',
      },
      {
        cmd: 'docker inspect --format="{{index .RepoDigests 0}}" nginx:1.25',
        explanation: 'Узнать digest существующего образа',
      },
    ],
    color: '#d32f2f',
  },
]

interface PullOutputLine {
  text: string
  type: 'info' | 'layer' | 'digest' | 'status' | 'name'
}

const pullOutput: PullOutputLine[] = [
  { text: '$ docker pull node:20-alpine', type: 'info' },
  { text: '', type: 'info' },
  { text: '20-alpine: Pulling from library/node', type: 'name' },
  { text: 'c926b61bad3b: Pull complete', type: 'layer' },
  { text: '5765c9a6d4d8: Pull complete', type: 'layer' },
  { text: 'a4dad7bfc247: Pull complete', type: 'layer' },
  { text: 'bfa6f8a61e0b: Pull complete', type: 'layer' },
  { text: 'Digest: sha256:7a91aa397f2548...', type: 'digest' },
  { text: 'Status: Downloaded newer image for node:20-alpine', type: 'status' },
  { text: 'docker.io/library/node:20-alpine', type: 'name' },
]

const cachedPullOutput: PullOutputLine[] = [
  { text: '$ docker pull node:20-slim', type: 'info' },
  { text: '', type: 'info' },
  { text: '20-slim: Pulling from library/node', type: 'name' },
  { text: 'c926b61bad3b: Already exists    ← слой из кэша!', type: 'layer' },
  { text: '8a7c47254b8a: Pull complete', type: 'layer' },
  { text: 'f3c4e4f1e209: Pull complete', type: 'layer' },
  { text: 'Digest: sha256:b2e8c901fa23...', type: 'digest' },
  { text: 'Status: Downloaded newer image for node:20-slim', type: 'status' },
  { text: 'docker.io/library/node:20-slim', type: 'name' },
]

const lineColors: Record<PullOutputLine['type'], string> = {
  info: '#e0e0e0',
  layer: '#81c784',
  digest: '#ffb74d',
  status: '#64b5f6',
  name: '#ce93d8',
}

export function Task1_1_Solution() {
  const [selectedRegistry, setSelectedRegistry] = useState<number | null>(null)
  const [showCached, setShowCached] = useState(false)

  return (
    <div style={{ padding: '1rem' }}>
      <h2>docker pull и реестры</h2>

      <h3>Формат имени образа</h3>
      <div
        style={{
          padding: '1rem',
          background: '#263238',
          color: '#e0e0e0',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ marginBottom: '0.5rem', color: '#90caf9' }}>
          [registry/][namespace/]repository[:tag|@digest]
        </div>
        <div style={{ fontSize: '0.8rem', color: '#78909c' }}>
          <div>ghcr.io / myorg / my-app : v1.3.0</div>
          <div>
            {'  '}реестр {'    '}namespace{'  '}репозиторий{'  '}тег
          </div>
        </div>
      </div>

      <h3>Реестры (кликните для подробностей)</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        {registries.map((reg, i) => (
          <button
            key={i}
            onClick={() => setSelectedRegistry(selectedRegistry === i ? null : i)}
            style={{
              padding: '0.5rem 1rem',
              border: `2px solid ${reg.color}`,
              background: selectedRegistry === i ? reg.color : 'white',
              color: selectedRegistry === i ? 'white' : reg.color,
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.85rem',
            }}
          >
            {reg.name}
          </button>
        ))}
      </div>

      {selectedRegistry !== null && (
        <div
          style={{
            padding: '1rem',
            background: '#f5f5f5',
            borderRadius: '8px',
            border: `1px solid ${registries[selectedRegistry].color}`,
            marginBottom: '1.5rem',
          }}
        >
          <p style={{ margin: '0 0 0.75rem', color: '#555' }}>
            {registries[selectedRegistry].description}
          </p>
          {registries[selectedRegistry].commands.map((cmd, j) => (
            <div key={j} style={{ marginBottom: '0.5rem' }}>
              <code
                style={{
                  display: 'block',
                  padding: '0.5rem',
                  background: '#263238',
                  color: '#a5d6a7',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                }}
              >
                {cmd.cmd}
              </code>
              <span style={{ fontSize: '0.8rem', color: '#777', marginLeft: '0.5rem' }}>
                {cmd.explanation}
              </span>
            </div>
          ))}
        </div>
      )}

      <h3>Вывод docker pull</h3>
      <div
        style={{
          padding: '1rem',
          background: '#1e1e1e',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '0.8rem',
          marginBottom: '0.75rem',
        }}
      >
        {(showCached ? cachedPullOutput : pullOutput).map((line, i) => (
          <div key={i} style={{ color: lineColors[line.type], lineHeight: 1.6 }}>
            {line.text || '\u00A0'}
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowCached(!showCached)}
        style={{
          padding: '0.5rem 1rem',
          background: showCached ? '#f57c00' : '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.85rem',
        }}
      >
        {showCached ? 'Показать первый pull' : 'Показать pull с кэшированием'}
      </button>
    </div>
  )
}

// ============================================
// Задание 1.2: Структура Dockerfile — Решение
// ============================================

interface DockerInstruction {
  instruction: string
  description: string
  example: string
  tip: string
  category: 'base' | 'build' | 'config' | 'runtime'
}

const instructions: DockerInstruction[] = [
  {
    instruction: 'FROM',
    description: 'Задаёт базовый образ. Обязательная первая инструкция.',
    example: 'FROM node:20-alpine',
    tip: 'Используйте конкретные теги и минимальные образы (-alpine, -slim)',
    category: 'base',
  },
  {
    instruction: 'WORKDIR',
    description: 'Устанавливает рабочую директорию для последующих команд.',
    example: 'WORKDIR /app',
    tip: 'Всегда используйте абсолютные пути. Создаёт директорию, если её нет.',
    category: 'config',
  },
  {
    instruction: 'COPY',
    description: 'Копирует файлы из контекста сборки в образ.',
    example: 'COPY package.json ./\nCOPY . .',
    tip: 'Копируйте зависимости отдельно от кода для лучшего кэширования.',
    category: 'build',
  },
  {
    instruction: 'RUN',
    description: 'Выполняет команду и создаёт новый слой.',
    example: 'RUN npm ci --only=production',
    tip: 'Объединяйте команды через && для уменьшения числа слоёв.',
    category: 'build',
  },
  {
    instruction: 'ENV',
    description: 'Устанавливает переменные окружения.',
    example: 'ENV NODE_ENV=production',
    tip: 'Доступны как при сборке, так и при запуске контейнера.',
    category: 'config',
  },
  {
    instruction: 'EXPOSE',
    description: 'Документирует порт, который слушает приложение.',
    example: 'EXPOSE 3000',
    tip: 'Не открывает порт! Для проброса используйте -p при docker run.',
    category: 'config',
  },
  {
    instruction: 'CMD',
    description: 'Команда по умолчанию при запуске контейнера.',
    example: 'CMD ["node", "server.js"]',
    tip: 'Используйте exec-форму (JSON-массив), а не shell-форму.',
    category: 'runtime',
  },
  {
    instruction: 'ENTRYPOINT',
    description: 'Основная команда контейнера (сложнее переопределить).',
    example: 'ENTRYPOINT ["node"]',
    tip: 'Комбинируйте с CMD для передачи аргументов по умолчанию.',
    category: 'runtime',
  },
]

const categoryColors: Record<DockerInstruction['category'], { bg: string; border: string; label: string }> = {
  base: { bg: '#e8f5e9', border: '#4caf50', label: 'Базовый образ' },
  build: { bg: '#e3f2fd', border: '#2196f3', label: 'Сборка' },
  config: { bg: '#fff3e0', border: '#ff9800', label: 'Конфигурация' },
  runtime: { bg: '#fce4ec', border: '#e91e63', label: 'Запуск' },
}

const sampleDockerfile = `# Базовый образ с конкретной версией
FROM node:20-alpine

# Метаданные образа
LABEL maintainer="dev@example.com"
LABEL version="1.0"

# Рабочая директория
WORKDIR /app

# 1. Копируем файлы зависимостей (отдельно для кэширования)
COPY package.json package-lock.json ./

# 2. Устанавливаем зависимости
RUN npm ci --only=production

# 3. Копируем исходный код
COPY . .

# Переменные окружения
ENV NODE_ENV=production
ENV PORT=3000

# Документируем порт
EXPOSE 3000

# Непривилегированный пользователь
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Команда запуска
CMD ["node", "server.js"]`

export function Task1_2_Solution() {
  const [selectedInstruction, setSelectedInstruction] = useState<number | null>(null)
  const [showAnnotated, setShowAnnotated] = useState(true)

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Структура Dockerfile</h2>

      <h3>Инструкции Dockerfile</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.5rem',
          marginBottom: '1rem',
        }}
      >
        {instructions.map((inst, i) => (
          <button
            key={i}
            onClick={() => setSelectedInstruction(selectedInstruction === i ? null : i)}
            style={{
              padding: '0.5rem',
              border: `2px solid ${categoryColors[inst.category].border}`,
              background:
                selectedInstruction === i
                  ? categoryColors[inst.category].border
                  : categoryColors[inst.category].bg,
              color: selectedInstruction === i ? 'white' : '#333',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              fontSize: '0.9rem',
            }}
          >
            {inst.instruction}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {Object.entries(categoryColors).map(([key, val]) => (
          <span
            key={key}
            style={{
              padding: '0.25rem 0.5rem',
              background: val.bg,
              border: `1px solid ${val.border}`,
              borderRadius: '4px',
              fontSize: '0.75rem',
            }}
          >
            {val.label}
          </span>
        ))}
      </div>

      {selectedInstruction !== null && (
        <div
          style={{
            padding: '1rem',
            background: categoryColors[instructions[selectedInstruction].category].bg,
            border: `1px solid ${categoryColors[instructions[selectedInstruction].category].border}`,
            borderRadius: '8px',
            marginBottom: '1rem',
          }}
        >
          <h4 style={{ margin: '0 0 0.5rem', fontFamily: 'monospace' }}>
            {instructions[selectedInstruction].instruction}
          </h4>
          <p style={{ margin: '0 0 0.5rem' }}>
            {instructions[selectedInstruction].description}
          </p>
          <pre
            style={{
              padding: '0.5rem',
              background: '#263238',
              color: '#a5d6a7',
              borderRadius: '4px',
              margin: '0 0 0.5rem',
              fontSize: '0.85rem',
            }}
          >
            {instructions[selectedInstruction].example}
          </pre>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#555', fontStyle: 'italic' }}>
            {instructions[selectedInstruction].tip}
          </p>
        </div>
      )}

      <h3>
        Пример Dockerfile
        <button
          onClick={() => setShowAnnotated(!showAnnotated)}
          style={{
            marginLeft: '1rem',
            padding: '0.25rem 0.75rem',
            background: showAnnotated ? '#388e3c' : '#757575',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.8rem',
          }}
        >
          {showAnnotated ? 'С комментариями' : 'Без комментариев'}
        </button>
      </h3>
      <pre
        style={{
          padding: '1rem',
          background: '#263238',
          color: '#e0e0e0',
          borderRadius: '8px',
          fontSize: '0.8rem',
          lineHeight: 1.6,
          overflow: 'auto',
        }}
      >
        {showAnnotated
          ? sampleDockerfile
          : sampleDockerfile
              .split('\n')
              .filter((line) => !line.startsWith('#'))
              .filter((line) => line.trim() !== '')
              .join('\n')}
      </pre>
    </div>
  )
}

// ============================================
// Задание 1.3: docker build — Решение
// ============================================

interface BuildExample {
  command: string
  description: string
  flags: { flag: string; meaning: string }[]
}

const buildExamples: BuildExample[] = [
  {
    command: 'docker build -t my-app:1.0 .',
    description: 'Базовая сборка с тегом из текущей директории',
    flags: [
      { flag: '-t my-app:1.0', meaning: 'Тег для образа (имя:версия)' },
      { flag: '.', meaning: 'Контекст сборки — текущая директория' },
    ],
  },
  {
    command: 'docker build -f Dockerfile.dev -t my-app:dev .',
    description: 'Сборка из альтернативного Dockerfile',
    flags: [
      { flag: '-f Dockerfile.dev', meaning: 'Путь к Dockerfile' },
      { flag: '-t my-app:dev', meaning: 'Тег для dev-сборки' },
    ],
  },
  {
    command: 'docker build --no-cache --build-arg NODE_VERSION=18 -t my-app .',
    description: 'Сборка без кэша с build-аргументом',
    flags: [
      { flag: '--no-cache', meaning: 'Игнорировать кэш слоёв' },
      { flag: '--build-arg NODE_VERSION=18', meaning: 'Передать переменную сборки (ARG)' },
    ],
  },
  {
    command: 'docker build --platform linux/amd64 -t my-app:amd64 .',
    description: 'Кросс-платформенная сборка (например, для CI на Mac M1)',
    flags: [
      { flag: '--platform linux/amd64', meaning: 'Целевая платформа образа' },
    ],
  },
]

interface BuildOutputLine {
  text: string
  type: 'step' | 'cache' | 'output' | 'done' | 'header'
  duration?: string
}

const buildOutput: BuildOutputLine[] = [
  { text: '$ docker build -t my-app:1.0 .', type: 'header' },
  { text: '', type: 'output' },
  { text: '[+] Building 12.3s (10/10) FINISHED', type: 'done' },
  { text: ' => [internal] load build definition from Dockerfile', type: 'step', duration: '0.0s' },
  { text: ' => [internal] load .dockerignore', type: 'step', duration: '0.0s' },
  { text: ' => [internal] load metadata for docker.io/library/node', type: 'step', duration: '1.2s' },
  { text: ' => [1/5] FROM node:20-alpine@sha256:abc123...', type: 'step', duration: '0.0s' },
  { text: ' => CACHED [2/5] WORKDIR /app', type: 'cache', duration: '0.0s' },
  { text: ' => CACHED [3/5] COPY package*.json ./', type: 'cache', duration: '0.0s' },
  { text: ' => CACHED [4/5] RUN npm ci --only=production', type: 'cache', duration: '0.0s' },
  { text: ' => [5/5] COPY . .', type: 'step', duration: '0.2s' },
  { text: ' => exporting to image', type: 'step', duration: '0.8s' },
  { text: ' => => naming to docker.io/library/my-app:1.0', type: 'done', duration: '0.0s' },
]

const buildOutputColors: Record<BuildOutputLine['type'], string> = {
  header: '#e0e0e0',
  step: '#81c784',
  cache: '#ffb74d',
  output: '#e0e0e0',
  done: '#64b5f6',
}

const dockerignoreContent = `# Зависимости
node_modules

# Система контроля версий
.git
.gitignore

# Секреты и окружение
.env
.env.*

# Логи и временные файлы
*.log
*.tmp
.DS_Store

# Тесты и документация
coverage
__tests__
docs
README.md

# Результаты сборки (если есть)
dist
build`

export function Task1_3_Solution() {
  const [selectedExample, setSelectedExample] = useState(0)
  const [showDockerignore, setShowDockerignore] = useState(false)

  return (
    <div style={{ padding: '1rem' }}>
      <h2>docker build</h2>

      <h3>Примеры команд сборки</h3>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {buildExamples.map((ex, i) => (
          <button
            key={i}
            onClick={() => setSelectedExample(i)}
            style={{
              padding: '0.5rem 0.75rem',
              border: `2px solid ${selectedExample === i ? '#1976d2' : '#bdbdbd'}`,
              background: selectedExample === i ? '#1976d2' : 'white',
              color: selectedExample === i ? 'white' : '#333',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.8rem',
            }}
          >
            Пример {i + 1}
          </button>
        ))}
      </div>

      <div
        style={{
          padding: '1rem',
          background: '#f5f5f5',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          marginBottom: '1.5rem',
        }}
      >
        <p style={{ margin: '0 0 0.5rem', fontWeight: 'bold' }}>
          {buildExamples[selectedExample].description}
        </p>
        <code
          style={{
            display: 'block',
            padding: '0.75rem',
            background: '#263238',
            color: '#a5d6a7',
            borderRadius: '4px',
            fontSize: '0.85rem',
            marginBottom: '0.75rem',
          }}
        >
          {buildExamples[selectedExample].command}
        </code>
        <div>
          {buildExamples[selectedExample].flags.map((f, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '0.25rem',
                fontSize: '0.85rem',
              }}
            >
              <code
                style={{
                  padding: '0.1rem 0.4rem',
                  background: '#e3f2fd',
                  borderRadius: '3px',
                  whiteSpace: 'nowrap',
                }}
              >
                {f.flag}
              </code>
              <span style={{ color: '#555' }}>{f.meaning}</span>
            </div>
          ))}
        </div>
      </div>

      <h3>Вывод docker build (с кэшированием)</h3>
      <div
        style={{
          padding: '1rem',
          background: '#1e1e1e',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '0.78rem',
          marginBottom: '1rem',
          overflow: 'auto',
        }}
      >
        {buildOutput.map((line, i) => (
          <div key={i} style={{ color: buildOutputColors[line.type], lineHeight: 1.6 }}>
            {line.text || '\u00A0'}
            {line.duration && (
              <span style={{ color: '#78909c', marginLeft: '1rem' }}>{line.duration}</span>
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          padding: '0.75rem',
          background: '#fff3e0',
          border: '1px solid #ff9800',
          borderRadius: '6px',
          marginBottom: '1rem',
          fontSize: '0.85rem',
        }}
      >
        <strong>CACHED</strong> означает, что слой не изменился и взят из кэша. Это значительно
        ускоряет повторные сборки. Порядок инструкций в Dockerfile влияет на эффективность
        кэширования.
      </div>

      <h3>
        .dockerignore
        <button
          onClick={() => setShowDockerignore(!showDockerignore)}
          style={{
            marginLeft: '0.75rem',
            padding: '0.25rem 0.75rem',
            background: showDockerignore ? '#d32f2f' : '#388e3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.8rem',
          }}
        >
          {showDockerignore ? 'Скрыть' : 'Показать пример'}
        </button>
      </h3>

      {showDockerignore && (
        <pre
          style={{
            padding: '1rem',
            background: '#263238',
            color: '#e0e0e0',
            borderRadius: '8px',
            fontSize: '0.8rem',
            lineHeight: 1.5,
          }}
        >
          {dockerignoreContent}
        </pre>
      )}
    </div>
  )
}

// ============================================
// Задание 1.4: Теги и версионирование — Решение
// ============================================

interface TagStrategy {
  name: string
  description: string
  examples: string[]
  pros: string[]
  cons: string[]
  useCase: string
}

const tagStrategies: TagStrategy[] = [
  {
    name: 'Semantic Versioning',
    description: 'Стандартная схема MAJOR.MINOR.PATCH',
    examples: ['my-app:1.0.0', 'my-app:1.0', 'my-app:1'],
    pros: [
      'Понятная семантика изменений',
      'Гибкость: можно подписаться на major/minor',
      'Широко используется в индустрии',
    ],
    cons: [
      'Требует дисциплины при выборе версии',
      'Не показывает привязку к коммиту',
    ],
    useCase: 'Библиотеки, public-facing сервисы, open-source проекты',
  },
  {
    name: 'Git SHA',
    description: 'Тег на основе хеша коммита',
    examples: ['my-app:abc123f', 'my-app:main-abc123f'],
    pros: [
      'Однозначная привязка к коду',
      'Легко автоматизировать в CI',
      'Невозможно случайно перезаписать',
    ],
    cons: [
      'Непонятно, какие изменения содержит',
      'Сложно запомнить хеш',
    ],
    useCase: 'CI/CD пайплайны, внутренние сервисы',
  },
  {
    name: 'Date-based',
    description: 'Тег на основе даты сборки',
    examples: ['my-app:2024-01-15', 'my-app:20240115-abc123f'],
    pros: [
      'Видно когда собран образ',
      'Хронологический порядок',
      'Уникальность (с точностью до дня)',
    ],
    cons: [
      'Не показывает содержание изменений',
      'Несколько сборок в день требуют доп. суффикса',
    ],
    useCase: 'Nightly builds, регулярные релизы',
  },
  {
    name: 'Environment',
    description: 'Тег привязан к среде деплоя',
    examples: ['my-app:staging', 'my-app:production'],
    pros: [
      'Видно текущий деплой для каждой среды',
      'Простота использования',
    ],
    cons: [
      'Перезаписывается при каждом деплое',
      'Нет истории версий',
      'Невозможно откатить к конкретной версии',
    ],
    useCase: 'Только как дополнительный тег к версионному',
  },
]

interface LatestPitfall {
  scenario: string
  problem: string
  solution: string
}

const latestPitfalls: LatestPitfall[] = [
  {
    scenario: 'Два разработчика делают docker pull my-app:latest в разное время',
    problem: 'Получают разные образы, если latest был обновлён между pull-ами',
    solution: 'Использовать конкретные теги: my-app:1.2.3',
  },
  {
    scenario: 'В production используется latest, нужно откатить деплой',
    problem: 'Непонятно, к какой версии откатываться — latest уже перезаписан',
    solution: 'Деплоить по конкретным тегам или digest',
  },
  {
    scenario: 'docker build -t my-app . (без тега)',
    problem: 'Автоматически получает тег latest, перезаписывая предыдущий',
    solution: 'Всегда указывать тег: docker build -t my-app:1.0.0 .',
  },
]

export function Task1_4_Solution() {
  const [selectedStrategy, setSelectedStrategy] = useState(0)
  const [showPitfalls, setShowPitfalls] = useState(false)

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Теги и версионирование</h2>

      <h3>Стратегии тегирования</h3>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {tagStrategies.map((s, i) => (
          <button
            key={i}
            onClick={() => setSelectedStrategy(i)}
            style={{
              padding: '0.5rem 1rem',
              border: `2px solid ${selectedStrategy === i ? '#1976d2' : '#bdbdbd'}`,
              background: selectedStrategy === i ? '#1976d2' : 'white',
              color: selectedStrategy === i ? 'white' : '#333',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: selectedStrategy === i ? 'bold' : 'normal',
            }}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div
        style={{
          padding: '1rem',
          background: '#f5f5f5',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          marginBottom: '1.5rem',
        }}
      >
        <h4 style={{ margin: '0 0 0.5rem' }}>
          {tagStrategies[selectedStrategy].name}
        </h4>
        <p style={{ margin: '0 0 0.75rem', color: '#555' }}>
          {tagStrategies[selectedStrategy].description}
        </p>

        <div style={{ marginBottom: '0.75rem' }}>
          <strong>Примеры:</strong>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
            {tagStrategies[selectedStrategy].examples.map((ex, i) => (
              <code
                key={i}
                style={{
                  padding: '0.25rem 0.5rem',
                  background: '#263238',
                  color: '#a5d6a7',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                }}
              >
                {ex}
              </code>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <strong style={{ color: '#388e3c' }}>Плюсы:</strong>
            <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1.25rem' }}>
              {tagStrategies[selectedStrategy].pros.map((p, i) => (
                <li key={i} style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ flex: 1 }}>
            <strong style={{ color: '#d32f2f' }}>Минусы:</strong>
            <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1.25rem' }}>
              {tagStrategies[selectedStrategy].cons.map((c, i) => (
                <li key={i} style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          style={{
            marginTop: '0.75rem',
            padding: '0.5rem',
            background: '#e3f2fd',
            borderRadius: '4px',
            fontSize: '0.85rem',
          }}
        >
          <strong>Когда использовать:</strong> {tagStrategies[selectedStrategy].useCase}
        </div>
      </div>

      <h3>Рекомендуемая комбинация тегов для CI/CD</h3>
      <div
        style={{
          padding: '1rem',
          background: '#263238',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '0.8rem',
          color: '#e0e0e0',
          lineHeight: 1.8,
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ color: '#78909c' }}># При релизе v1.2.3 создаём несколько тегов:</div>
        <div>
          <span style={{ color: '#a5d6a7' }}>docker build</span> -t my-app:1.2.3 \
        </div>
        <div>{'                '}-t my-app:1.2 \</div>
        <div>{'                '}-t my-app:1 \</div>
        <div>{'                '}-t my-app:latest \</div>
        <div>{'                '}-t my-app:abc123f .</div>
        <div style={{ color: '#78909c', marginTop: '0.5rem' }}>
          # Пользователи выбирают уровень стабильности:
        </div>
        <div style={{ color: '#ffb74d' }}>
          # :1.2.3 — точная версия (production)
        </div>
        <div style={{ color: '#ffb74d' }}>
          # :1.2 — последний патч (авто-обновления безопасности)
        </div>
        <div style={{ color: '#ffb74d' }}>
          # :1 — последний минор (новые фичи)
        </div>
        <div style={{ color: '#ffb74d' }}># :abc123f — привязка к коммиту (отладка)</div>
      </div>

      <h3>
        Ловушки тега latest
        <button
          onClick={() => setShowPitfalls(!showPitfalls)}
          style={{
            marginLeft: '0.75rem',
            padding: '0.25rem 0.75rem',
            background: showPitfalls ? '#d32f2f' : '#f57c00',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.8rem',
          }}
        >
          {showPitfalls ? 'Скрыть' : 'Показать'}
        </button>
      </h3>

      {showPitfalls && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {latestPitfalls.map((p, i) => (
            <div
              key={i}
              style={{
                padding: '0.75rem',
                background: '#fff3e0',
                border: '1px solid #ff9800',
                borderRadius: '6px',
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                Сценарий: {p.scenario}
              </div>
              <div
                style={{
                  color: '#d32f2f',
                  marginBottom: '0.25rem',
                  fontSize: '0.85rem',
                }}
              >
                Проблема: {p.problem}
              </div>
              <div style={{ color: '#388e3c', fontSize: '0.85rem' }}>
                Решение: {p.solution}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
