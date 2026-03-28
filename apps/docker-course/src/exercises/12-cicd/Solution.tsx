import { useState } from 'react'

// ========================================
// Задание 12.1: CI Pipeline — Решение
// ========================================

const pipelineStages = [
  {
    name: 'Lint',
    icon: '🔍',
    description: 'Проверка кода и Dockerfile',
    tools: ['hadolint', 'eslint', 'prettier'],
    duration: '~30s',
    config: `lint:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Lint Dockerfile
      uses: hadolint/hadolint-action@v3.1.0
      with:
        dockerfile: Dockerfile
    - name: Lint code
      run: npm run lint`,
  },
  {
    name: 'Build',
    icon: '🔨',
    description: 'Сборка Docker-образа',
    tools: ['docker buildx', 'kaniko', 'buildah'],
    duration: '~2-5min',
    config: `build:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: docker/setup-buildx-action@v3
    - uses: docker/build-push-action@v5
      with:
        context: .
        load: true
        tags: myapp:test
        cache-from: type=gha
        cache-to: type=gha,mode=max`,
  },
  {
    name: 'Test',
    icon: '🧪',
    description: 'Unit, integration, e2e тесты',
    tools: ['jest', 'vitest', 'playwright', 'docker compose'],
    duration: '~3-10min',
    config: `test:
  runs-on: ubuntu-latest
  services:
    postgres:
      image: postgres:16
      env:
        POSTGRES_PASSWORD: test
      options: >-
        --health-cmd pg_isready
        --health-interval 10s
  steps:
    - run: docker run --rm myapp:test npm test
    - run: docker run --rm myapp:test npm run test:e2e`,
  },
  {
    name: 'Scan',
    icon: '🛡️',
    description: 'Сканирование на уязвимости',
    tools: ['trivy', 'docker scout', 'snyk', 'grype'],
    duration: '~1-3min',
    config: `scan:
  runs-on: ubuntu-latest
  steps:
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: myapp:test
        format: 'sarif'
        output: 'trivy-results.sarif'
        severity: 'CRITICAL,HIGH'`,
  },
  {
    name: 'Push',
    icon: '📦',
    description: 'Отправка образа в Registry',
    tools: ['docker push', 'GHCR', 'ECR', 'Docker Hub'],
    duration: '~1-2min',
    config: `push:
  runs-on: ubuntu-latest
  steps:
    - uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: \${{ github.actor }}
        password: \${{ secrets.GITHUB_TOKEN }}
    - uses: docker/build-push-action@v5
      with:
        push: true
        tags: ghcr.io/user/app:\${{ github.sha }}`,
  },
  {
    name: 'Deploy',
    icon: '🚀',
    description: 'Деплой в staging/production',
    tools: ['docker compose', 'docker swarm', 'kubectl', 'ssh'],
    duration: '~1-5min',
    config: `deploy:
  runs-on: ubuntu-latest
  environment: production
  steps:
    - name: Deploy
      uses: appleboy/ssh-action@v1
      with:
        host: \${{ secrets.PROD_HOST }}
        script: |
          docker pull ghcr.io/user/app:\${{ github.sha }}
          docker service update --image ghcr.io/user/app:\${{ github.sha }} myapp`,
  },
]

const cacheTypes = [
  { type: 'type=gha', name: 'GitHub Actions Cache', description: 'Нативная интеграция с GitHub Actions', pros: 'Простая настройка, быстрый', cons: 'Только для GitHub, лимит 10GB' },
  { type: 'type=registry', name: 'Registry Cache', description: 'Кэш в Container Registry', pros: 'Shared для всех раннеров', cons: 'Сетевые задержки, доп. расходы' },
  { type: 'type=local', name: 'Local Cache', description: 'Кэш в локальной директории', pros: 'Максимальная скорость', cons: 'Не shared между раннерами' },
  { type: 'type=s3', name: 'S3 Cache', description: 'Кэш в AWS S3 / MinIO', pros: 'Гибкий, масштабируемый', cons: 'Нужна настройка инфраструктуры' },
]

const matrixExamples = [
  {
    name: 'Мультиплатформа',
    config: `strategy:
  matrix:
    platform:
      - linux/amd64
      - linux/arm64`,
  },
  {
    name: 'Множество версий',
    config: `strategy:
  matrix:
    node: [18, 20, 22]
    os: [ubuntu-latest, alpine]`,
  },
  {
    name: 'Include/Exclude',
    config: `strategy:
  matrix:
    node: [18, 20]
    os: [ubuntu-latest]
    include:
      - node: 22
        os: ubuntu-latest
        experimental: true
    exclude:
      - node: 18
        os: alpine`,
  },
]

export function Task12_1_Solution() {
  const [activeStage, setActiveStage] = useState<number | null>(null)
  const [activeSection, setActiveSection] = useState<'pipeline' | 'cache' | 'matrix'>('pipeline')
  const [showConfig, setShowConfig] = useState<Record<number, boolean>>({})
  const [runningPipeline, setRunningPipeline] = useState(false)
  const [pipelineStep, setPipelineStep] = useState(-1)

  const toggleConfig = (index: number) => {
    setShowConfig(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const runPipeline = () => {
    setRunningPipeline(true)
    setPipelineStep(0)
    let step = 0
    const interval = setInterval(() => {
      step++
      if (step >= pipelineStages.length) {
        clearInterval(interval)
        setRunningPipeline(false)
        setPipelineStep(pipelineStages.length)
      } else {
        setPipelineStep(step)
      }
    }, 800)
  }

  const sections = [
    { key: 'pipeline' as const, label: 'CI Pipeline' },
    { key: 'cache' as const, label: 'Кэширование' },
    { key: 'matrix' as const, label: 'Matrix Builds' },
  ]

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h3>Задание 12.1: CI Pipeline — сборка и тестирование</h3>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {sections.map(s => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: activeSection === s.key ? 'bold' : 'normal',
              background: activeSection === s.key ? '#0366d6' : '#e1e4e8',
              color: activeSection === s.key ? '#fff' : '#24292e',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === 'pipeline' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ margin: 0 }}>Стадии CI/CD Pipeline</h4>
            <button
              onClick={runPipeline}
              disabled={runningPipeline}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '4px',
                cursor: runningPipeline ? 'not-allowed' : 'pointer',
                background: runningPipeline ? '#6a737d' : '#28a745',
                color: '#fff',
                fontWeight: 'bold',
              }}
            >
              {runningPipeline ? 'Выполняется...' : pipelineStep === pipelineStages.length ? 'Pipeline завершён' : 'Запустить Pipeline'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {pipelineStages.map((stage, i) => {
              let bg = '#e1e4e8'
              let color = '#24292e'
              if (pipelineStep > i) { bg = '#28a745'; color = '#fff' }
              else if (pipelineStep === i && runningPipeline) { bg = '#ffd33d'; color = '#24292e' }
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <div style={{
                    padding: '0.4rem 0.8rem',
                    background: bg,
                    color,
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                  }}>
                    {stage.icon} {stage.name}
                  </div>
                  {i < pipelineStages.length - 1 && <span style={{ color: '#6a737d' }}>→</span>}
                </div>
              )
            })}
          </div>

          {pipelineStages.map((stage, i) => (
            <div
              key={i}
              style={{
                border: '1px solid #d1d5da',
                borderRadius: '6px',
                marginBottom: '0.75rem',
                overflow: 'hidden',
                borderLeft: activeStage === i ? '4px solid #0366d6' : '4px solid transparent',
              }}
            >
              <div
                onClick={() => setActiveStage(activeStage === i ? null : i)}
                style={{
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#f6f8fa',
                }}
              >
                <div>
                  <strong>{stage.icon} {stage.name}</strong>
                  <span style={{ color: '#6a737d', marginLeft: '0.75rem', fontSize: '0.9rem' }}>{stage.description}</span>
                </div>
                <span style={{ color: '#6a737d', fontSize: '0.85rem' }}>{stage.duration}</span>
              </div>

              {activeStage === i && (
                <div style={{ padding: '1rem', borderTop: '1px solid #d1d5da' }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <strong>Инструменты:</strong>{' '}
                    {stage.tools.map((tool, j) => (
                      <span key={j} style={{
                        display: 'inline-block',
                        padding: '0.15rem 0.5rem',
                        background: '#dfe2e5',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        marginRight: '0.4rem',
                        marginBottom: '0.25rem',
                      }}>
                        {tool}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => toggleConfig(i)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      border: '1px solid #d1d5da',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      background: '#fff',
                      fontSize: '0.85rem',
                    }}
                  >
                    {showConfig[i] ? 'Скрыть конфиг' : 'Показать конфиг'}
                  </button>

                  {showConfig[i] && (
                    <pre style={{
                      background: '#24292e',
                      color: '#e1e4e8',
                      padding: '1rem',
                      borderRadius: '6px',
                      marginTop: '0.5rem',
                      overflow: 'auto',
                      fontSize: '0.8rem',
                      lineHeight: 1.5,
                    }}>
                      {stage.config}
                    </pre>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeSection === 'cache' && (
        <div>
          <h4>Кэширование слоёв Docker в CI</h4>
          <p style={{ color: '#586069', marginBottom: '1rem' }}>
            CI-раннеры стартуют с чистого окружения, поэтому Docker-кэш теряется между сборками. Решение — внешний кэш.
          </p>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
            <thead>
              <tr style={{ background: '#f6f8fa' }}>
                <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '2px solid #d1d5da' }}>Тип</th>
                <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '2px solid #d1d5da' }}>Описание</th>
                <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '2px solid #d1d5da' }}>Плюсы</th>
                <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '2px solid #d1d5da' }}>Минусы</th>
              </tr>
            </thead>
            <tbody>
              {cacheTypes.map((cache, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #e1e4e8' }}>
                  <td style={{ padding: '0.6rem' }}>
                    <code style={{ background: '#f1f3f5', padding: '0.15rem 0.4rem', borderRadius: '3px', fontSize: '0.8rem' }}>
                      {cache.type}
                    </code>
                  </td>
                  <td style={{ padding: '0.6rem', fontSize: '0.9rem' }}>{cache.description}</td>
                  <td style={{ padding: '0.6rem', fontSize: '0.9rem', color: '#28a745' }}>{cache.pros}</td>
                  <td style={{ padding: '0.6rem', fontSize: '0.9rem', color: '#d73a49' }}>{cache.cons}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ background: '#f6f8fa', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
            <strong>Пример использования (GitHub Actions):</strong>
            <pre style={{
              background: '#24292e',
              color: '#e1e4e8',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflow: 'auto',
              fontSize: '0.8rem',
            }}>
{`- uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: myapp:latest
    cache-from: type=gha
    cache-to: type=gha,mode=max`}
            </pre>
          </div>

          <div style={{ background: '#fffbdd', border: '1px solid #ffd33d', padding: '0.75rem', borderRadius: '6px' }}>
            <strong>mode=max</strong> кэширует все промежуточные слои, а не только финальный stage.
            Это значительно ускоряет пересборку при изменении одного слоя.
          </div>
        </div>
      )}

      {activeSection === 'matrix' && (
        <div>
          <h4>Matrix Builds</h4>
          <p style={{ color: '#586069', marginBottom: '1rem' }}>
            Matrix strategy позволяет запускать job параллельно для разных комбинаций параметров.
          </p>

          {matrixExamples.map((example, i) => (
            <div key={i} style={{
              border: '1px solid #d1d5da',
              borderRadius: '6px',
              marginBottom: '0.75rem',
              padding: '1rem',
            }}>
              <strong>{example.name}</strong>
              <pre style={{
                background: '#24292e',
                color: '#e1e4e8',
                padding: '1rem',
                borderRadius: '6px',
                marginTop: '0.5rem',
                overflow: 'auto',
                fontSize: '0.8rem',
              }}>
                {example.config}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ========================================
// Задание 12.2: Container Registry и тегирование — Решение
// ========================================

const registries = [
  { name: 'Docker Hub', provider: 'Docker', free: '1 приватный репо', auth: 'docker login', url: 'docker.io', features: ['Самый популярный', 'Rate limits (100 pulls/6h)', 'Automated builds'] },
  { name: 'GHCR', provider: 'GitHub', free: 'Безлимит (public)', auth: 'echo $TOKEN | docker login ghcr.io -u USER --password-stdin', url: 'ghcr.io', features: ['Интеграция с GitHub Actions', 'GITHUB_TOKEN для auth', 'Package visibility'] },
  { name: 'ECR', provider: 'AWS', free: '500 MB free tier', auth: 'aws ecr get-login-password | docker login --username AWS --password-stdin ECR_URL', url: '<account>.dkr.ecr.<region>.amazonaws.com', features: ['Интеграция с ECS/EKS', 'Lifecycle policies', 'Image scanning'] },
  { name: 'ACR', provider: 'Azure', free: 'Basic tier', auth: 'az acr login --name myregistry', url: 'myregistry.azurecr.io', features: ['Интеграция с AKS', 'Geo-replication', 'Tasks (cloud builds)'] },
  { name: 'GCR / Artifact Registry', provider: 'Google', free: '500 MB free', auth: 'gcloud auth configure-docker', url: 'gcr.io/<project>', features: ['Интеграция с GKE', 'Vulnerability scanning', 'Multi-region'] },
  { name: 'Harbor', provider: 'Self-hosted', free: 'Бесплатно (OSS)', auth: 'docker login harbor.example.com', url: 'harbor.example.com', features: ['Полный контроль', 'RBAC', 'Replication', 'Signing'] },
]

const tagStrategies = [
  {
    name: 'Semantic Versioning',
    description: 'Стандарт для релизов. Чёткая версионность.',
    when: 'Production релизы',
    examples: ['myapp:1.0.0', 'myapp:1.0', 'myapp:1'],
    color: '#28a745',
  },
  {
    name: 'Git SHA',
    description: 'Точная привязка к коммиту. Идеален для трейсинга.',
    when: 'CI builds, staging',
    examples: ['myapp:sha-a1b2c3d', 'myapp:main-a1b2c3d'],
    color: '#0366d6',
  },
  {
    name: 'Branch Name',
    description: 'Последняя сборка ветки. Мутабельный тег.',
    when: 'Dev/staging environments',
    examples: ['myapp:main', 'myapp:develop', 'myapp:feature-auth'],
    color: '#6f42c1',
  },
  {
    name: 'Timestamp',
    description: 'Дата и время сборки. Удобно для сортировки.',
    when: 'Аудит, compliance',
    examples: ['myapp:20240315-143022', 'myapp:main-20240315'],
    color: '#e36209',
  },
  {
    name: 'Build Number',
    description: 'Номер CI build. Монотонно растущий.',
    when: 'CI/CD pipelines',
    examples: ['myapp:build-1234', 'myapp:ci-5678'],
    color: '#d73a49',
  },
]

const metadataExample = `- uses: docker/metadata-action@v5
  with:
    images: ghcr.io/username/myapp
    tags: |
      # Branch: main
      type=ref,event=branch
      # SHA: sha-abc1234
      type=sha
      # Semver: 1.2.3, 1.2, 1
      type=semver,pattern={{version}}
      type=semver,pattern={{major}}.{{minor}}
      # PR: pr-42
      type=ref,event=pr`

export function Task12_2_Solution() {
  const [activeSection, setActiveSection] = useState<'registries' | 'tags' | 'automation'>('registries')
  const [selectedRegistry, setSelectedRegistry] = useState<number | null>(null)
  const [showAuth, setShowAuth] = useState<Record<number, boolean>>({})
  const [tagInput, setTagInput] = useState('v1.2.3')
  const [generatedTags, setGeneratedTags] = useState<string[]>([])

  const generateTags = () => {
    const tags: string[] = []
    const sha = 'a1b2c3d'
    const branch = 'main'
    const date = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 15)

    if (tagInput.match(/^v?\d+\.\d+\.\d+$/)) {
      const version = tagInput.replace('v', '')
      const [major, minor] = version.split('.')
      tags.push(`myapp:${version}`)
      tags.push(`myapp:${major}.${minor}`)
      tags.push(`myapp:${major}`)
      tags.push('myapp:latest')
    }
    tags.push(`myapp:sha-${sha}`)
    tags.push(`myapp:${branch}-${sha}`)
    tags.push(`myapp:${branch}`)
    tags.push(`myapp:${date}`)
    setGeneratedTags(tags)
  }

  const toggleAuth = (index: number) => {
    setShowAuth(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const sections = [
    { key: 'registries' as const, label: 'Container Registries' },
    { key: 'tags' as const, label: 'Стратегии тегов' },
    { key: 'automation' as const, label: 'Автоматизация' },
  ]

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h3>Задание 12.2: Container Registry и тегирование</h3>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {sections.map(s => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: activeSection === s.key ? 'bold' : 'normal',
              background: activeSection === s.key ? '#0366d6' : '#e1e4e8',
              color: activeSection === s.key ? '#fff' : '#24292e',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === 'registries' && (
        <div>
          <h4>Популярные Container Registries</h4>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
            <thead>
              <tr style={{ background: '#f6f8fa' }}>
                <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '2px solid #d1d5da' }}>Registry</th>
                <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '2px solid #d1d5da' }}>Провайдер</th>
                <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '2px solid #d1d5da' }}>Бесплатно</th>
                <th style={{ padding: '0.6rem', textAlign: 'left', borderBottom: '2px solid #d1d5da' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {registries.map((reg, i) => (
                <tr key={i} style={{
                  borderBottom: '1px solid #e1e4e8',
                  background: selectedRegistry === i ? '#f1f8ff' : 'transparent',
                }}>
                  <td style={{ padding: '0.6rem', fontWeight: 'bold' }}>{reg.name}</td>
                  <td style={{ padding: '0.6rem' }}>{reg.provider}</td>
                  <td style={{ padding: '0.6rem', fontSize: '0.9rem' }}>{reg.free}</td>
                  <td style={{ padding: '0.6rem' }}>
                    <button
                      onClick={() => setSelectedRegistry(selectedRegistry === i ? null : i)}
                      style={{
                        padding: '0.25rem 0.6rem',
                        border: '1px solid #d1d5da',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        background: '#fff',
                        fontSize: '0.8rem',
                      }}
                    >
                      {selectedRegistry === i ? 'Скрыть' : 'Подробнее'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedRegistry !== null && (
            <div style={{
              border: '1px solid #0366d6',
              borderRadius: '6px',
              padding: '1rem',
              background: '#f1f8ff',
              marginBottom: '1rem',
            }}>
              <h5 style={{ margin: '0 0 0.5rem 0' }}>{registries[selectedRegistry].name}</h5>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                <strong>URL:</strong>{' '}
                <code style={{ background: '#e1e4e8', padding: '0.15rem 0.4rem', borderRadius: '3px' }}>
                  {registries[selectedRegistry].url}
                </code>
              </p>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Особенности:</strong>
                <ul style={{ margin: '0.25rem 0', paddingLeft: '1.5rem' }}>
                  {registries[selectedRegistry].features.map((f, j) => (
                    <li key={j} style={{ fontSize: '0.9rem' }}>{f}</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => toggleAuth(selectedRegistry)}
                style={{
                  padding: '0.3rem 0.7rem',
                  border: '1px solid #d1d5da',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: '#fff',
                  fontSize: '0.85rem',
                }}
              >
                {showAuth[selectedRegistry] ? 'Скрыть auth' : 'Показать auth'}
              </button>
              {showAuth[selectedRegistry] && (
                <pre style={{
                  background: '#24292e',
                  color: '#e1e4e8',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  marginTop: '0.5rem',
                  overflow: 'auto',
                  fontSize: '0.8rem',
                }}>
                  {registries[selectedRegistry].auth}
                </pre>
              )}
            </div>
          )}
        </div>
      )}

      {activeSection === 'tags' && (
        <div>
          <h4>Стратегии тегирования образов</h4>

          {tagStrategies.map((strategy, i) => (
            <div key={i} style={{
              border: '1px solid #d1d5da',
              borderLeft: `4px solid ${strategy.color}`,
              borderRadius: '6px',
              padding: '0.75rem 1rem',
              marginBottom: '0.75rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{strategy.name}</strong>
                <span style={{
                  padding: '0.15rem 0.5rem',
                  background: strategy.color + '20',
                  color: strategy.color,
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                }}>
                  {strategy.when}
                </span>
              </div>
              <p style={{ margin: '0.4rem 0', fontSize: '0.9rem', color: '#586069' }}>{strategy.description}</p>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {strategy.examples.map((ex, j) => (
                  <code key={j} style={{
                    background: '#f1f3f5',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '3px',
                    fontSize: '0.8rem',
                  }}>
                    {ex}
                  </code>
                ))}
              </div>
            </div>
          ))}

          <div style={{ background: '#ffdce0', border: '1px solid #d73a49', padding: '0.75rem', borderRadius: '6px', marginTop: '1rem' }}>
            <strong>latest — плохая практика для production!</strong>
            <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.9rem' }}>
              Тег latest не говорит, какая версия кода. Невозможен откат, нет воспроизводимости. Используйте только для локальной разработки.
            </p>
          </div>
        </div>
      )}

      {activeSection === 'automation' && (
        <div>
          <h4>Автоматическая генерация тегов</h4>

          <div style={{ border: '1px solid #d1d5da', borderRadius: '6px', padding: '1rem', marginBottom: '1rem' }}>
            <strong>Симулятор тегирования</strong>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                placeholder="v1.2.3 или branch name"
                style={{
                  padding: '0.4rem 0.75rem',
                  border: '1px solid #d1d5da',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  flex: 1,
                }}
              />
              <button
                onClick={generateTags}
                style={{
                  padding: '0.4rem 1rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: '#0366d6',
                  color: '#fff',
                  fontWeight: 'bold',
                }}
              >
                Генерировать
              </button>
            </div>
            {generatedTags.length > 0 && (
              <div style={{ marginTop: '0.75rem' }}>
                <strong>Сгенерированные теги:</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.3rem' }}>
                  {generatedTags.map((tag, i) => (
                    <code key={i} style={{
                      background: '#f1f3f5',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '3px',
                      fontSize: '0.85rem',
                    }}>
                      {tag}
                    </code>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ background: '#f6f8fa', padding: '1rem', borderRadius: '6px' }}>
            <strong>docker/metadata-action (GitHub Actions):</strong>
            <pre style={{
              background: '#24292e',
              color: '#e1e4e8',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflow: 'auto',
              fontSize: '0.8rem',
            }}>
              {metadataExample}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

// ========================================
// Задание 12.3: Деплой и мониторинг — Решение
// ========================================

const deployStrategies = [
  {
    name: 'Rolling Update',
    description: 'Постепенная замена старых контейнеров новыми. Нулевой downtime.',
    pros: ['Нет downtime', 'Простая реализация', 'Экономия ресурсов'],
    cons: ['Долгий rollback', 'Две версии одновременно', 'Сложная отладка'],
    diagram: `Время ──────────────────────►
Реплика 1:  [v1] [v2] [v2] [v2]
Реплика 2:  [v1] [v1] [v2] [v2]
Реплика 3:  [v1] [v1] [v1] [v2]`,
    config: `deploy:
  replicas: 3
  update_config:
    parallelism: 1
    delay: 30s
    failure_action: rollback
    monitor: 60s
    order: start-first`,
  },
  {
    name: 'Blue-Green',
    description: 'Два идентичных окружения. Мгновенное переключение трафика.',
    pros: ['Мгновенный rollback', 'Полное тестирование перед switch', 'Чистый переход'],
    cons: ['Двойные ресурсы', 'Сложность с БД', 'Стоимость инфраструктуры'],
    diagram: `┌─────────────┐     ┌─────────────┐
│ Load Balancer│──►  │  Blue (v1)  │ ◄── active
│             │     └─────────────┘
│             │     ┌─────────────┐
│             │     │ Green (v2)  │ ◄── testing
│             │     └─────────────┘
└─────────────┘
После проверки: switch трафика на Green`,
    config: `services:
  blue:
    image: myapp:\${BLUE_VERSION}
    ports: ["8080:3000"]
  green:
    image: myapp:\${GREEN_VERSION}
    ports: ["8081:3000"]
  nginx:
    image: nginx:alpine
    ports: ["80:80"]`,
  },
  {
    name: 'Canary',
    description: 'Малая часть трафика на новую версию. Постепенное увеличение.',
    pros: ['Минимальный риск', 'A/B тестирование', 'Раннее обнаружение проблем'],
    cons: ['Сложная настройка', 'Нужен мониторинг', 'Долгий процесс'],
    diagram: `Load Balancer
  ├── 90% ──► Stable (v1)
  └── 10% ──► Canary (v2)

Если OK: 10% → 30% → 50% → 100%
Если ошибки: 10% → 0% (rollback)`,
    config: `upstream backend {
  server app-stable:3000 weight=9;  # 90%
  server app-canary:3000 weight=1;  # 10%
}`,
  },
]

const healthCheckTypes = [
  { type: 'Liveness', description: 'Жив ли процесс?', action: 'Перезапуск контейнера', example: 'GET /healthz → 200', color: '#d73a49' },
  { type: 'Readiness', description: 'Готов ли принимать трафик?', action: 'Убрать из балансировки', example: 'GET /ready → 200 (DB + Redis OK)', color: '#e36209' },
  { type: 'Startup', description: 'Завершился ли запуск?', action: 'Не проверять liveness/readiness', example: 'GET /startup → 200 (миграции OK)', color: '#0366d6' },
]

const monitoringMetrics = [
  { category: 'Контейнер', metrics: ['CPU usage %', 'Memory usage / limit', 'Network I/O', 'Block I/O', 'Restart count'] },
  { category: 'Приложение', metrics: ['Request rate (RPS)', 'Error rate (5xx)', 'Response time (p50, p95, p99)', 'Active connections', 'Queue length'] },
  { category: 'Инфраструктура', metrics: ['Disk usage', 'Node CPU / Memory', 'Container count', 'Image pull time', 'Deploy duration'] },
]

export function Task12_3_Solution() {
  const [activeSection, setActiveSection] = useState<'deploy' | 'health' | 'monitoring'>('deploy')
  const [selectedStrategy, setSelectedStrategy] = useState<number | null>(0)
  const [showConfig, setShowConfig] = useState<Record<number, boolean>>({})
  const [healthStatus, setHealthStatus] = useState<Record<string, 'healthy' | 'unhealthy' | 'unknown'>>({
    database: 'unknown',
    redis: 'unknown',
    app: 'unknown',
  })
  const [isChecking, setIsChecking] = useState(false)

  const toggleConfig = (index: number) => {
    setShowConfig(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const simulateHealthCheck = () => {
    setIsChecking(true)
    setHealthStatus({ database: 'unknown', redis: 'unknown', app: 'unknown' })

    setTimeout(() => setHealthStatus(prev => ({ ...prev, database: 'healthy' })), 500)
    setTimeout(() => setHealthStatus(prev => ({ ...prev, redis: 'healthy' })), 1000)
    setTimeout(() => {
      setHealthStatus(prev => ({ ...prev, app: Math.random() > 0.3 ? 'healthy' : 'unhealthy' }))
      setIsChecking(false)
    }, 1500)
  }

  const getStatusColor = (status: string) => {
    if (status === 'healthy') return '#28a745'
    if (status === 'unhealthy') return '#d73a49'
    return '#6a737d'
  }

  const getStatusIcon = (status: string) => {
    if (status === 'healthy') return 'OK'
    if (status === 'unhealthy') return 'FAIL'
    return '...'
  }

  const sections = [
    { key: 'deploy' as const, label: 'Стратегии деплоя' },
    { key: 'health' as const, label: 'Health Checks' },
    { key: 'monitoring' as const, label: 'Мониторинг' },
  ]

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h3>Задание 12.3: Деплой и мониторинг</h3>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {sections.map(s => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: activeSection === s.key ? 'bold' : 'normal',
              background: activeSection === s.key ? '#0366d6' : '#e1e4e8',
              color: activeSection === s.key ? '#fff' : '#24292e',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === 'deploy' && (
        <div>
          <h4>Стратегии деплоя</h4>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {deployStrategies.map((strategy, i) => (
              <button
                key={i}
                onClick={() => setSelectedStrategy(i)}
                style={{
                  padding: '0.5rem 1rem',
                  border: selectedStrategy === i ? '2px solid #0366d6' : '1px solid #d1d5da',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: selectedStrategy === i ? '#f1f8ff' : '#fff',
                  fontWeight: selectedStrategy === i ? 'bold' : 'normal',
                }}
              >
                {strategy.name}
              </button>
            ))}
          </div>

          {selectedStrategy !== null && (
            <div style={{ border: '1px solid #d1d5da', borderRadius: '6px', padding: '1rem' }}>
              <h5 style={{ margin: '0 0 0.5rem 0' }}>{deployStrategies[selectedStrategy].name}</h5>
              <p style={{ color: '#586069', margin: '0 0 0.75rem 0' }}>
                {deployStrategies[selectedStrategy].description}
              </p>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <strong style={{ color: '#28a745' }}>Плюсы:</strong>
                  <ul style={{ margin: '0.25rem 0', paddingLeft: '1.25rem' }}>
                    {deployStrategies[selectedStrategy].pros.map((p, j) => (
                      <li key={j} style={{ fontSize: '0.9rem' }}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <strong style={{ color: '#d73a49' }}>Минусы:</strong>
                  <ul style={{ margin: '0.25rem 0', paddingLeft: '1.25rem' }}>
                    {deployStrategies[selectedStrategy].cons.map((c, j) => (
                      <li key={j} style={{ fontSize: '0.9rem' }}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <pre style={{
                background: '#f6f8fa',
                padding: '0.75rem',
                borderRadius: '6px',
                overflow: 'auto',
                fontSize: '0.8rem',
                lineHeight: 1.6,
                fontFamily: 'monospace',
              }}>
                {deployStrategies[selectedStrategy].diagram}
              </pre>

              <button
                onClick={() => toggleConfig(selectedStrategy)}
                style={{
                  padding: '0.35rem 0.75rem',
                  border: '1px solid #d1d5da',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: '#fff',
                  fontSize: '0.85rem',
                  marginTop: '0.75rem',
                }}
              >
                {showConfig[selectedStrategy] ? 'Скрыть конфиг' : 'Показать конфиг'}
              </button>

              {showConfig[selectedStrategy] && (
                <pre style={{
                  background: '#24292e',
                  color: '#e1e4e8',
                  padding: '1rem',
                  borderRadius: '6px',
                  marginTop: '0.5rem',
                  overflow: 'auto',
                  fontSize: '0.8rem',
                }}>
                  {deployStrategies[selectedStrategy].config}
                </pre>
              )}
            </div>
          )}
        </div>
      )}

      {activeSection === 'health' && (
        <div>
          <h4>Health Checks</h4>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {healthCheckTypes.map((hc, i) => (
              <div key={i} style={{
                flex: 1,
                minWidth: '200px',
                border: '1px solid #d1d5da',
                borderTop: `4px solid ${hc.color}`,
                borderRadius: '6px',
                padding: '0.75rem',
              }}>
                <strong style={{ color: hc.color }}>{hc.type}</strong>
                <p style={{ margin: '0.3rem 0', fontSize: '0.9rem', color: '#586069' }}>{hc.description}</p>
                <p style={{ margin: '0.3rem 0', fontSize: '0.85rem' }}>
                  <strong>Действие:</strong> {hc.action}
                </p>
                <code style={{
                  display: 'block',
                  background: '#f1f3f5',
                  padding: '0.3rem 0.5rem',
                  borderRadius: '3px',
                  fontSize: '0.8rem',
                  marginTop: '0.3rem',
                }}>
                  {hc.example}
                </code>
              </div>
            ))}
          </div>

          <div style={{
            border: '1px solid #d1d5da',
            borderRadius: '6px',
            padding: '1rem',
            marginBottom: '1rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <strong>Симулятор Health Check</strong>
              <button
                onClick={simulateHealthCheck}
                disabled={isChecking}
                style={{
                  padding: '0.4rem 1rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isChecking ? 'not-allowed' : 'pointer',
                  background: isChecking ? '#6a737d' : '#0366d6',
                  color: '#fff',
                  fontWeight: 'bold',
                }}
              >
                {isChecking ? 'Проверяется...' : 'Запустить проверку'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {Object.entries(healthStatus).map(([name, status]) => (
                <div key={name} style={{
                  flex: 1,
                  minWidth: '150px',
                  padding: '0.75rem',
                  border: `2px solid ${getStatusColor(status)}`,
                  borderRadius: '6px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{ fontSize: '0.85rem', color: '#586069', marginBottom: '0.3rem' }}>{name}</div>
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: getStatusColor(status),
                  }}>
                    {getStatusIcon(status)}
                  </div>
                </div>
              ))}
            </div>

            {!isChecking && healthStatus.app !== 'unknown' && (
              <div style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                borderRadius: '4px',
                background: healthStatus.app === 'healthy' ? '#dcffe4' : '#ffdce0',
                textAlign: 'center',
                fontWeight: 'bold',
                color: healthStatus.app === 'healthy' ? '#28a745' : '#d73a49',
              }}>
                {healthStatus.app === 'healthy'
                  ? 'Все проверки пройдены. Сервис здоров.'
                  : 'Health check не пройден! Требуется rollback.'}
              </div>
            )}
          </div>

          <div style={{ background: '#f6f8fa', padding: '1rem', borderRadius: '6px' }}>
            <strong>Docker Compose health check:</strong>
            <pre style={{
              background: '#24292e',
              color: '#e1e4e8',
              padding: '0.75rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflow: 'auto',
              fontSize: '0.8rem',
            }}>
{`healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s`}
            </pre>
          </div>
        </div>
      )}

      {activeSection === 'monitoring' && (
        <div>
          <h4>Мониторинг в Production</h4>

          {monitoringMetrics.map((group, i) => (
            <div key={i} style={{
              border: '1px solid #d1d5da',
              borderRadius: '6px',
              padding: '0.75rem 1rem',
              marginBottom: '0.75rem',
            }}>
              <strong>{group.category}</strong>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {group.metrics.map((metric, j) => (
                  <span key={j} style={{
                    padding: '0.25rem 0.6rem',
                    background: '#f1f3f5',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                  }}>
                    {metric}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div style={{ background: '#f6f8fa', padding: '1rem', borderRadius: '6px', marginTop: '1rem' }}>
            <strong>Стек мониторинга (Prometheus + Grafana):</strong>
            <pre style={{
              background: '#24292e',
              color: '#e1e4e8',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflow: 'auto',
              fontSize: '0.8rem',
            }}>
{`services:
  prometheus:
    image: prom/prometheus:latest
    ports: ["9090:9090"]
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
    ports: ["3001:3000"]

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    ports: ["8080:8080"]
    volumes:
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro`}
            </pre>
          </div>

          <div style={{
            background: '#fffbdd',
            border: '1px solid #ffd33d',
            padding: '0.75rem',
            borderRadius: '6px',
            marginTop: '1rem',
          }}>
            <strong>Ключевой принцип:</strong> Мониторьте не только то, что контейнер жив (liveness),
            но и то, что он работает правильно — время ответа, error rate, бизнес-метрики.
          </div>
        </div>
      )}
    </div>
  )
}
