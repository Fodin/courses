import { useState } from 'react'

// ========================================
// Задание 11.1: Пользователи и Capabilities — Решение
// ========================================

const userExamples = [
  {
    name: 'root (по умолчанию)',
    status: 'bad',
    description: 'Процесс работает от root (UID 0). Container escape = root на хосте.',
    dockerfile: `FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
# Нет USER -- всё работает от root!
CMD ["node", "server.js"]`,
  },
  {
    name: 'Кастомный пользователь',
    status: 'good',
    description: 'Создаём непривилегированного пользователя. Даже при escape -- обычный пользователь.',
    dockerfile: `FROM node:20-alpine
WORKDIR /app

# Создаём группу и пользователя
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json ./
RUN npm ci --only=production

# Меняем владельца файлов
COPY --chown=appuser:appgroup . .

# Переключаемся на непривилегированного пользователя
USER appuser
CMD ["node", "server.js"]`,
  },
  {
    name: 'Встроенный user (Node.js)',
    status: 'good',
    description: 'Образ node уже содержит пользователя "node" (UID 1000).',
    dockerfile: `FROM node:20-alpine
WORKDIR /app
COPY --chown=node:node . .
RUN npm ci --only=production
USER node
CMD ["node", "server.js"]`,
  },
  {
    name: '--user при запуске',
    status: 'good',
    description: 'Переопределение пользователя флагом при docker run.',
    dockerfile: `# Запуск:
docker run --user 1000:1000 myapp:latest

# Или по имени:
docker run --user nobody myapp:latest

# Проверка:
docker run --user 1000:1000 alpine id
# uid=1000 gid=1000`,
  },
  {
    name: 'Distroless (nonroot)',
    status: 'good',
    description: 'Distroless-образы имеют встроенного пользователя nonroot (UID 65534).',
    dockerfile: `FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
# Distroless: пользователь nonroot уже настроен
USER nonroot
CMD ["dist/server.js"]`,
  },
]

const capabilities = [
  { name: 'CAP_SYS_ADMIN', description: 'Монтирование FS, управление namespaces, cgroups', risk: 'high', recommendation: 'drop', riskLabel: 'Высокий' },
  { name: 'CAP_SYS_PTRACE', description: 'Отладка процессов, чтение памяти других процессов', risk: 'high', recommendation: 'drop', riskLabel: 'Высокий' },
  { name: 'CAP_NET_RAW', description: 'Raw сокеты: ping, tcpdump, ARP spoofing', risk: 'high', recommendation: 'drop', riskLabel: 'Высокий' },
  { name: 'CAP_DAC_OVERRIDE', description: 'Игнорирование прав доступа к файлам', risk: 'high', recommendation: 'drop', riskLabel: 'Высокий' },
  { name: 'CAP_SETUID', description: 'Смена UID процесса (privilege escalation)', risk: 'medium', recommendation: 'drop*', riskLabel: 'Средний' },
  { name: 'CAP_SETGID', description: 'Смена GID процесса', risk: 'medium', recommendation: 'drop*', riskLabel: 'Средний' },
  { name: 'CAP_NET_BIND_SERVICE', description: 'Привязка к портам < 1024 (80, 443)', risk: 'low', recommendation: 'keep (web)', riskLabel: 'Низкий' },
  { name: 'CAP_CHOWN', description: 'Смена владельца файлов', risk: 'medium', recommendation: 'drop*', riskLabel: 'Средний' },
  { name: 'CAP_FOWNER', description: 'Обход проверок владельца файла', risk: 'medium', recommendation: 'drop*', riskLabel: 'Средний' },
  { name: 'CAP_KILL', description: 'Отправка сигналов другим процессам', risk: 'low', recommendation: 'keep', riskLabel: 'Низкий' },
]

const minimalSets = [
  { service: 'Web-сервер (nginx, caddy)', caps: 'cap_drop: [ALL], cap_add: [NET_BIND_SERVICE, CHOWN, SETUID, SETGID]', reason: 'Нужен порт 80/443, смена пользователя при старте' },
  { service: 'Node.js / Python / Go (порт > 1024)', caps: 'cap_drop: [ALL]', reason: 'Не нужны никакие дополнительные capabilities!' },
  { service: 'PostgreSQL / MySQL', caps: 'cap_drop: [ALL], cap_add: [CHOWN, SETUID, SETGID, FOWNER, DAC_OVERRIDE]', reason: 'Нужна смена владельца data-директории при инициализации' },
]

const securityModules = [
  {
    name: 'Seccomp (Secure Computing Mode)',
    description: 'Фильтрует системные вызовы к ядру Linux. Docker по умолчанию блокирует ~44 из ~300+ syscalls (mount, reboot, swapon, ptrace и другие).',
    commands: `# По умолчанию seccomp активен
docker info | grep -i seccomp

# Запуск с кастомным профилем
docker run --security-opt seccomp=custom-profile.json nginx

# Генерация профиля на основе реального использования
# (инструмент oci-seccomp-bpf-hook)

# ❌ НИКОГДА в production:
docker run --security-opt seccomp=unconfined alpine`,
  },
  {
    name: 'AppArmor',
    description: 'Система мандатного контроля доступа (MAC). Ограничивает доступ контейнера к файлам, сети, capabilities. Docker использует профиль docker-default.',
    commands: `# Проверить статус
sudo aa-status

# Запуск с профилем по умолчанию
docker run --security-opt apparmor=docker-default nginx

# Кастомный профиль
docker run --security-opt apparmor=my-custom-profile nginx

# ❌ НИКОГДА в production:
docker run --security-opt apparmor=unconfined nginx`,
  },
  {
    name: 'no-new-privileges',
    description: 'Запрещает процессу получать дополнительные привилегии через setuid/setgid бинарники. Рекомендуется ВСЕГДА включать.',
    commands: `# Включение
docker run --security-opt=no-new-privileges myapp

# Docker Compose
services:
  api:
    security_opt:
      - no-new-privileges:true`,
  },
]

type Section11_1 = 'users' | 'capabilities' | 'seccomp'

export function Task11_1_Solution() {
  const [activeSection, setActiveSection] = useState<Section11_1>('users')
  const [visibleCode, setVisibleCode] = useState<Record<string, boolean>>({})

  const toggleCode = (key: string) => {
    setVisibleCode((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const riskColor = (risk: string) => {
    if (risk === 'high') return '#e74c3c'
    if (risk === 'medium') return '#f39c12'
    return '#27ae60'
  }

  const sections: { key: Section11_1; label: string }[] = [
    { key: 'users', label: 'Пользователи' },
    { key: 'capabilities', label: 'Capabilities' },
    { key: 'seccomp', label: 'Seccomp и AppArmor' },
  ]

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h3 style={{ marginBottom: '1rem' }}>Задание 11.1: Пользователи и Capabilities</h3>

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

      {activeSection === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {userExamples.map((example) => (
            <div
              key={example.name}
              style={{
                border: `1px solid ${example.status === 'bad' ? '#e74c3c' : '#27ae60'}`,
                borderRadius: '6px',
                padding: '0.75rem',
                borderLeft: `4px solid ${example.status === 'bad' ? '#e74c3c' : '#27ae60'}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <strong style={{ fontSize: '0.9rem' }}>
                  {example.status === 'bad' ? '❌' : '✅'} {example.name}
                </strong>
                <button
                  onClick={() => toggleCode(`user-${example.name}`)}
                  style={{
                    padding: '0.2rem 0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    backgroundColor: '#f8f8f8',
                    fontSize: '0.75rem',
                  }}
                >
                  {visibleCode[`user-${example.name}`] ? 'Скрыть' : 'Показать Dockerfile'}
                </button>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#555', margin: 0 }}>{example.description}</p>
              {visibleCode[`user-${example.name}`] && (
                <pre
                  style={{
                    backgroundColor: '#1e1e1e',
                    color: '#d4d4d4',
                    padding: '0.6rem',
                    borderRadius: '4px',
                    overflow: 'auto',
                    fontSize: '0.72rem',
                    lineHeight: '1.5',
                    marginTop: '0.5rem',
                  }}
                >
                  {example.dockerfile}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}

      {activeSection === 'capabilities' && (
        <div>
          <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Capability</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Описание</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Риск</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Рекомендация</th>
                </tr>
              </thead>
              <tbody>
                {capabilities.map((cap) => (
                  <tr key={cap.name} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 'bold' }}>{cap.name}</td>
                    <td style={{ padding: '0.4rem 0.5rem' }}>{cap.description}</td>
                    <td style={{ padding: '0.4rem 0.5rem', textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.15rem 0.4rem',
                          borderRadius: '10px',
                          backgroundColor: riskColor(cap.risk),
                          color: '#fff',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {cap.riskLabel}
                      </span>
                    </td>
                    <td style={{ padding: '0.4rem 0.5rem', textAlign: 'center', fontFamily: 'monospace', fontSize: '0.72rem' }}>{cap.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Минимальные наборы для типичных сервисов</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {minimalSets.map((set) => (
              <div key={set.service} style={{ border: '1px solid #e2e2e2', borderRadius: '6px', padding: '0.6rem' }}>
                <strong style={{ fontSize: '0.85rem' }}>{set.service}</strong>
                <pre
                  style={{
                    backgroundColor: '#1e1e1e',
                    color: '#d4d4d4',
                    padding: '0.4rem',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    margin: '0.3rem 0',
                    overflow: 'auto',
                  }}
                >
                  {set.caps}
                </pre>
                <p style={{ fontSize: '0.75rem', color: '#666', margin: 0 }}>{set.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'seccomp' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {securityModules.map((mod) => (
            <div key={mod.name} style={{ border: '1px solid #e2e2e2', borderRadius: '6px', padding: '0.75rem' }}>
              <strong style={{ fontSize: '0.9rem' }}>{mod.name}</strong>
              <p style={{ fontSize: '0.82rem', color: '#555', margin: '0.3rem 0' }}>{mod.description}</p>
              <button
                onClick={() => toggleCode(`sec-${mod.name}`)}
                style={{
                  padding: '0.2rem 0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: '#f8f8f8',
                  fontSize: '0.75rem',
                  marginBottom: '0.3rem',
                }}
              >
                {visibleCode[`sec-${mod.name}`] ? 'Скрыть команды' : 'Показать команды'}
              </button>
              {visibleCode[`sec-${mod.name}`] && (
                <pre
                  style={{
                    backgroundColor: '#1e1e1e',
                    color: '#d4d4d4',
                    padding: '0.6rem',
                    borderRadius: '4px',
                    overflow: 'auto',
                    fontSize: '0.72rem',
                    lineHeight: '1.5',
                  }}
                >
                  {mod.commands}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem',
          backgroundColor: '#fff3cd',
          borderRadius: '6px',
          border: '1px solid #ffc107',
        }}
      >
        <strong style={{ fontSize: '0.85rem' }}>📌 Ключевой принцип: Минимальные привилегии</strong>
        <p style={{ fontSize: '0.8rem', margin: '0.3rem 0 0' }}>
          Начинайте с <code style={{ backgroundColor: '#f0f0f0', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>--cap-drop=ALL</code> и добавляйте только необходимые capabilities.
          Используйте <code style={{ backgroundColor: '#f0f0f0', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>USER</code> в каждом Dockerfile.
          Включайте <code style={{ backgroundColor: '#f0f0f0', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>no-new-privileges</code> всегда.
          Получили ошибку &quot;operation not permitted&quot;? Добавьте конкретную capability, а не --privileged.
        </p>
      </div>
    </div>
  )
}

// ========================================
// Задание 11.2: Сканирование уязвимостей — Решение
// ========================================

const cveLevels = [
  {
    level: 'CRITICAL',
    color: '#e74c3c',
    description: 'Удалённое выполнение кода без аутентификации (RCE). Немедленное исправление.',
    example: 'CVE-2021-44228 (Log4Shell)',
    sla: 'Немедленно (< 24 часов)',
    score: '9.0 - 10.0',
  },
  {
    level: 'HIGH',
    color: '#e67e22',
    description: 'Серьёзная уязвимость, требующая определённых условий для эксплуатации.',
    example: 'CVE-2023-44487 (HTTP/2 Rapid Reset)',
    sla: '1-3 дня',
    score: '7.0 - 8.9',
  },
  {
    level: 'MEDIUM',
    color: '#f1c40f',
    description: 'Уязвимость с ограниченным воздействием или требующая локального доступа.',
    example: 'CVE-2023-5363 (OpenSSL)',
    sla: '1-2 недели',
    score: '4.0 - 6.9',
  },
  {
    level: 'LOW',
    color: '#95a5a6',
    description: 'Минимальный риск, информационная уязвимость, DoS при специфических условиях.',
    example: 'CVE-2023-4016 (procps)',
    sla: 'При следующем обновлении',
    score: '0.1 - 3.9',
  },
]

const scanTools = [
  {
    name: 'Docker Scout',
    icon: '🐳',
    description: 'Встроенный в Docker Desktop сканер (Docker Engine 25+). Интеграция с Docker Hub.',
    pros: ['Встроен в Docker CLI', 'Рекомендации по обновлению', 'Сравнение версий'],
    cons: ['Требует Docker Desktop / Hub', 'Менее детальный анализ'],
    commands: `# Сканирование образа
docker scout cves myapp:latest

# Краткая сводка
docker scout quickview myapp:latest

# Только критические
docker scout cves --only-severity critical,high myapp:latest

# Сравнение версий
docker scout compare myapp:latest --to myapp:previous

# Рекомендации
docker scout recommendations myapp:latest`,
  },
  {
    name: 'Trivy',
    icon: '🔍',
    description: 'Open-source сканер от Aqua Security. Самый популярный, сканирует образы, FS, IaC.',
    pros: ['Open-source и бесплатный', 'Сканирует всё: образы, FS, IaC', 'Отличная CI/CD интеграция'],
    cons: ['Нужна установка', 'БД уязвимостей обновляется отдельно'],
    commands: `# Сканирование образа
trivy image myapp:latest

# Только критические
trivy image --severity CRITICAL myapp:latest

# Выход с ошибкой (для CI)
trivy image --exit-code 1 --severity HIGH,CRITICAL myapp:latest

# Сканирование Dockerfile
trivy config Dockerfile

# Сканирование зависимостей
trivy fs --scanners vuln,secret .

# JSON для интеграции
trivy image -f json -o results.json myapp:latest`,
  },
  {
    name: 'Grype',
    icon: '🦅',
    description: 'Open-source сканер от Anchore. Быстрый, поддерживает CycloneDX/SPDX SBOM.',
    pros: ['Очень быстрый', 'SBOM поддержка', 'Лёгкая интеграция'],
    cons: ['Только уязвимости (нет IaC)', 'Меньше сообщество'],
    commands: `# Сканирование
grype myapp:latest

# Только исправленные
grype myapp:latest --only-fixed

# Блокировка при критических
grype myapp:latest --fail-on critical

# Формат JSON
grype myapp:latest -o json > results.json

# SBOM: сначала syft, потом grype
syft myapp:latest -o cyclonedx-json > sbom.json
grype sbom:sbom.json`,
  },
  {
    name: 'Snyk',
    icon: '🛡️',
    description: 'Коммерческий сканер с бесплатным тарифом. Мониторинг, уведомления о новых CVE.',
    pros: ['Мониторинг и уведомления', 'Интеграция с GitHub/GitLab', 'Fix PR\'s'],
    cons: ['Бесплатный тариф ограничен', 'Нужна регистрация'],
    commands: `# Сканирование
snyk container test myapp:latest

# Мониторинг (уведомления)
snyk container monitor myapp:latest

# Сканирование Dockerfile
snyk iac test Dockerfile

# Автоматический fix
snyk container fix myapp:latest`,
  },
]

const scanResult = `myapp:latest (debian 12.4)

Total: 47 vulnerabilities (CRITICAL: 3, HIGH: 12, MEDIUM: 22, LOW: 10)

┌──────────────┬────────────────────┬──────────┬───────────────┬─────────────────────┐
│   Library    │   Vulnerability    │ Severity │    Version    │   Fixed Version     │
├──────────────┼────────────────────┼──────────┼───────────────┼─────────────────────┤
│ openssl      │ CVE-2024-0727      │ CRITICAL │ 3.0.11        │ 3.0.13              │
│ curl         │ CVE-2024-2398      │ CRITICAL │ 8.5.0         │ 8.7.1               │
│ glibc        │ CVE-2024-2961      │ CRITICAL │ 2.36-9+deb12  │ 2.36-9+deb12u7      │
│ zlib         │ CVE-2023-45853     │ HIGH     │ 1.2.13        │ 1.3.1               │
│ libxml2      │ CVE-2024-25062     │ HIGH     │ 2.9.14        │ 2.9.14+dfsg-1.3+d1  │
│ openssh      │ CVE-2023-51385     │ HIGH     │ 9.2p1         │ 9.6p1               │
│ python3.11   │ CVE-2024-0450      │ MEDIUM   │ 3.11.2        │ 3.11.8              │
│ ...          │ (ещё 40 записей)   │          │               │                     │
└──────────────┴────────────────────┴──────────┴───────────────┴─────────────────────┘

Recommendation: Update base image to debian:12.5-slim (fixes 38 of 47 vulnerabilities)`

const ciExample = `# .github/workflows/security-scan.yml
name: Security Scan
on:
  push:
    branches: [main, develop]
  pull_request:
  schedule:
    - cron: '0 2 * * *'  # Ночной скан в 2:00

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # 1. Собираем образ
      - name: Build image
        run: docker build -t myapp:\${{ github.sha }} .

      # 2. Сканируем на уязвимости
      - name: Run Trivy scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: myapp:\${{ github.sha }}
          format: table
          exit-code: 1              # Упасть при найденных CVE
          severity: CRITICAL,HIGH   # Только серьёзные
          ignore-unfixed: true      # Игнорировать без фикса

      # 3. Загружаем отчёт как артефакт
      - name: Upload report
        if: always()
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: myapp:\${{ github.sha }}
          format: sarif
          output: trivy-results.sarif

      - name: Upload to GitHub Security
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: trivy-results.sarif`

type Section11_2 = 'cve' | 'tools' | 'cicd'

export function Task11_2_Solution() {
  const [activeSection, setActiveSection] = useState<Section11_2>('cve')
  const [visibleCommands, setVisibleCommands] = useState<Record<string, boolean>>({})
  const [scanRunning, setScanRunning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)

  const toggleCommands = (key: string) => {
    setVisibleCommands((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const runScan = () => {
    setScanRunning(true)
    setScanComplete(false)
    setTimeout(() => {
      setScanRunning(false)
      setScanComplete(true)
    }, 1500)
  }

  const sections: { key: Section11_2; label: string }[] = [
    { key: 'cve', label: 'Уровни CVE' },
    { key: 'tools', label: 'Инструменты сканирования' },
    { key: 'cicd', label: 'CI/CD интеграция' },
  ]

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h3 style={{ marginBottom: '1rem' }}>Задание 11.2: Сканирование уязвимостей</h3>

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

      {activeSection === 'cve' && (
        <div>
          <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Уровень</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>CVSS Score</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Описание</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Пример CVE</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>SLA</th>
                </tr>
              </thead>
              <tbody>
                {cveLevels.map((cve) => (
                  <tr key={cve.level} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.4rem 0.5rem' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '10px',
                          backgroundColor: cve.color,
                          color: cve.level === 'MEDIUM' ? '#333' : '#fff',
                          fontSize: '0.72rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {cve.level}
                      </span>
                    </td>
                    <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>{cve.score}</td>
                    <td style={{ padding: '0.4rem 0.5rem' }}>{cve.description}</td>
                    <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace', fontSize: '0.72rem' }}>{cve.example}</td>
                    <td style={{ padding: '0.4rem 0.5rem', fontWeight: 'bold', fontSize: '0.78rem' }}>{cve.sla}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '0.75rem' }}>
            <button
              onClick={runScan}
              disabled={scanRunning}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '6px',
                cursor: scanRunning ? 'wait' : 'pointer',
                backgroundColor: scanRunning ? '#95a5a6' : '#e74c3c',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 'bold',
              }}
            >
              {scanRunning ? 'Сканирование...' : '🔍 Запустить сканирование'}
            </button>
            {scanComplete && (
              <pre
                style={{
                  backgroundColor: '#1e1e1e',
                  color: '#d4d4d4',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  overflow: 'auto',
                  fontSize: '0.68rem',
                  lineHeight: '1.4',
                  marginTop: '0.5rem',
                }}
              >
                {scanResult}
              </pre>
            )}
          </div>
        </div>
      )}

      {activeSection === 'tools' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {scanTools.map((tool) => (
            <div key={tool.name} style={{ border: '1px solid #e2e2e2', borderRadius: '6px', padding: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '1.2rem' }}>{tool.icon}</span>
                <strong style={{ fontSize: '0.9rem' }}>{tool.name}</strong>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#555', margin: '0 0 0.4rem' }}>{tool.description}</p>

              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.4rem' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#27ae60', fontWeight: 'bold' }}>Плюсы:</span>
                  <ul style={{ margin: '0.1rem 0', paddingLeft: '1rem' }}>
                    {tool.pros.map((p) => (
                      <li key={p} style={{ fontSize: '0.72rem' }}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#e74c3c', fontWeight: 'bold' }}>Минусы:</span>
                  <ul style={{ margin: '0.1rem 0', paddingLeft: '1rem' }}>
                    {tool.cons.map((c) => (
                      <li key={c} style={{ fontSize: '0.72rem' }}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => toggleCommands(tool.name)}
                style={{
                  padding: '0.2rem 0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: '#f8f8f8',
                  fontSize: '0.72rem',
                }}
              >
                {visibleCommands[tool.name] ? 'Скрыть команды' : 'Показать команды'}
              </button>
              {visibleCommands[tool.name] && (
                <pre
                  style={{
                    backgroundColor: '#1e1e1e',
                    color: '#d4d4d4',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    overflow: 'auto',
                    fontSize: '0.68rem',
                    lineHeight: '1.4',
                    marginTop: '0.3rem',
                  }}
                >
                  {tool.commands}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}

      {activeSection === 'cicd' && (
        <div>
          <p style={{ fontSize: '0.82rem', color: '#555', marginBottom: '0.5rem' }}>
            Пример GitHub Actions workflow: сканирование при каждом push + ночной скан + загрузка отчёта в GitHub Security.
          </p>
          <pre
            style={{
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
              padding: '0.75rem',
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '0.7rem',
              lineHeight: '1.5',
            }}
          >
            {ciExample}
          </pre>
        </div>
      )}

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem',
          backgroundColor: '#e8f5e9',
          borderRadius: '6px',
          border: '1px solid #4caf50',
        }}
      >
        <strong style={{ fontSize: '0.85rem' }}>💡 Рекомендация</strong>
        <p style={{ fontSize: '0.8rem', margin: '0.3rem 0 0' }}>
          Для начала используйте <strong>Trivy</strong> -- бесплатный, мощный, отлично интегрируется с CI/CD.
          Дополните <strong>Docker Scout</strong> для удобного анализа в CLI. Для production добавьте <strong>Snyk</strong> мониторинг
          для уведомлений о новых CVE. Сканируйте при каждом push и ночью по cron.
        </p>
      </div>
    </div>
  )
}

// ========================================
// Задание 11.3: Чеклист безопасности — Решение
// ========================================

interface ChecklistItem {
  id: string
  text: string
  code: string
}

interface ChecklistCategory {
  name: string
  icon: string
  items: ChecklistItem[]
}

const checklistData: ChecklistCategory[] = [
  {
    name: 'Образы',
    icon: '📦',
    items: [
      { id: 'img-1', text: 'Минимальный базовый образ (alpine, distroless, scratch)', code: 'FROM node:20-alpine\n# или\nFROM gcr.io/distroless/nodejs20-debian12' },
      { id: 'img-2', text: 'Фиксированная версия (не latest)', code: 'FROM node:20.11.0-alpine3.19\n# НЕ: FROM node:latest' },
      { id: 'img-3', text: 'Digest для критичных образов', code: 'FROM node:20.11.0-alpine3.19@sha256:1a2b3c4d...' },
      { id: 'img-4', text: 'Сканирование на уязвимости в CI', code: 'trivy image --exit-code 1 --severity HIGH,CRITICAL myapp:latest' },
      { id: 'img-5', text: 'Multi-stage builds (без dev-зависимостей)', code: 'FROM node:20-alpine AS builder\nRUN npm ci\nRUN npm run build\n\nFROM node:20-alpine\nCOPY --from=builder /app/dist ./dist' },
    ],
  },
  {
    name: 'Dockerfile',
    icon: '📝',
    items: [
      { id: 'df-1', text: 'Директива USER (непривилегированный)', code: 'RUN addgroup -S app && adduser -S app -G app\nUSER app' },
      { id: 'df-2', text: 'COPY вместо ADD', code: '# ✅ COPY . /app\n# ❌ ADD . /app  (ADD распаковывает архивы, скачивает URL)' },
      { id: 'df-3', text: '.dockerignore настроен', code: '.git\n.env\nnode_modules\n*.secret\n*.key\ndocker-compose*.yml\nDockerfile' },
      { id: 'df-4', text: 'HEALTHCHECK для мониторинга', code: 'HEALTHCHECK --interval=30s --timeout=5s --retries=3 \\\n  CMD wget --spider -q http://localhost:3000/health || exit 1' },
      { id: 'df-5', text: 'Нет секретов в ENV, ARG, COPY', code: '# ❌ ENV API_KEY=secret123\n# ✅ RUN --mount=type=secret,id=api_key cat /run/secrets/api_key' },
    ],
  },
  {
    name: 'Runtime',
    icon: '🔒',
    items: [
      { id: 'rt-1', text: '--cap-drop=ALL + нужные --cap-add', code: 'docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE nginx\n\n# Compose:\ncap_drop: [ALL]\ncap_add: [NET_BIND_SERVICE]' },
      { id: 'rt-2', text: '--read-only + tmpfs', code: 'docker run --read-only \\\n  --tmpfs /tmp:rw,noexec,nosuid,size=64m \\\n  --tmpfs /var/run:rw,size=1m \\\n  myapp' },
      { id: 'rt-3', text: 'no-new-privileges', code: 'docker run --security-opt=no-new-privileges myapp\n\n# Compose:\nsecurity_opt:\n  - no-new-privileges:true' },
      { id: 'rt-4', text: 'Ограничение ресурсов (memory, cpu, pids)', code: 'docker run --memory=512m --cpus=1.0 --pids-limit=100 myapp\n\n# Compose:\ndeploy:\n  resources:\n    limits:\n      memory: 512M\n      cpus: "1.0"\n      pids: 100' },
      { id: 'rt-5', text: 'Нет docker.sock в контейнере', code: '# ❌ НИКОГДА:\ndocker run -v /var/run/docker.sock:/var/run/docker.sock myapp\n\n# Это даёт полный контроль над Docker daemon!' },
      { id: 'rt-6', text: 'Нет --privileged', code: '# ❌ docker run --privileged myapp\n# ✅ docker run --cap-add=NET_ADMIN myapp\n# Если нужен --privileged -- пересмотрите архитектуру' },
    ],
  },
  {
    name: 'Секреты',
    icon: '🔑',
    items: [
      { id: 'sec-1', text: 'BuildKit secrets для сборки', code: '# Dockerfile:\nRUN --mount=type=secret,id=npm_token \\\n  NPM_TOKEN=$(cat /run/secrets/npm_token) npm ci\n\n# Сборка:\ndocker build --secret id=npm_token,src=.npm_token .' },
      { id: 'sec-2', text: 'Docker secrets / volume mounts для runtime', code: '# Compose:\nsecrets:\n  db_password:\n    file: ./secrets/db_password.txt\n\nservices:\n  db:\n    secrets: [db_password]\n    environment:\n      POSTGRES_PASSWORD_FILE: /run/secrets/db_password' },
      { id: 'sec-3', text: 'Внешний менеджер секретов для production', code: '# HashiCorp Vault\nvault kv get -field=password secret/myapp/db\n\n# AWS Secrets Manager\naws secretsmanager get-secret-value --secret-id myapp/db' },
      { id: 'sec-4', text: 'Ротация секретов по расписанию', code: '# Автоматическая ротация в Vault:\nvault write database/config/mydb \\\n  rotation_period=24h' },
    ],
  },
  {
    name: 'Сеть',
    icon: '🌐',
    items: [
      { id: 'net-1', text: 'Сегментация сетей (frontend / backend)', code: 'networks:\n  frontend-net:\n    driver: bridge\n  backend-net:\n    driver: bridge\n    internal: true  # Нет доступа в интернет!' },
      { id: 'net-2', text: 'internal: true для внутренних сетей', code: '# БД и Redis доступны только через internal сеть\nservices:\n  db:\n    networks: [backend-net]\n  api:\n    networks: [frontend-net, backend-net]' },
      { id: 'net-3', text: 'expose вместо ports для внутренних сервисов', code: '# ❌ ports: ["5432:5432"]  # Доступна с хоста!\n# ✅ expose: ["5432"]        # Только внутри Docker-сети' },
      { id: 'net-4', text: 'Не открывать порты БД наружу', code: '# БД не должна иметь секцию ports:\nservices:\n  db:\n    image: postgres:16\n    expose: ["5432"]\n    networks: [internal]' },
    ],
  },
]

const secureComposeExample = `# docker-compose.yml -- production-ready с безопасностью
services:
  api:
    build: .
    read_only: true
    tmpfs:
      - /tmp:rw,noexec,nosuid,size=64m
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
    security_opt:
      - no-new-privileges:true
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '1.0'
          pids: 100
    networks:
      - frontend-net
      - backend-net
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000/health"]
      interval: 30s
      timeout: 5s
      retries: 3

  db:
    image: postgres:16-alpine
    read_only: true
    tmpfs:
      - /tmp:rw,noexec,nosuid
      - /var/run/postgresql:rw
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - SETUID
      - SETGID
      - FOWNER
      - DAC_OVERRIDE
    security_opt:
      - no-new-privileges:true
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '2.0'
          pids: 200
    networks:
      - backend-net
    secrets:
      - db_password
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    read_only: true
    tmpfs:
      - /data:rw,size=128m
    cap_drop:
      - ALL
    security_opt:
      - no-new-privileges:true
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.5'
          pids: 50
    networks:
      - backend-net

networks:
  frontend-net:
    driver: bridge
  backend-net:
    driver: bridge
    internal: true

secrets:
  db_password:
    file: ./secrets/db_password.txt

volumes:
  pgdata:`

const defenseInDepthLayers = [
  { name: 'USER (непривилегированный)', color: '#3498db', description: 'Контейнер не от root' },
  { name: 'CAP_DROP=ALL', color: '#2ecc71', description: 'Минимальные capabilities' },
  { name: 'READ-ONLY FS', color: '#e67e22', description: 'Нельзя записать файлы' },
  { name: 'NO-NEW-PRIVILEGES', color: '#9b59b6', description: 'Нет повышения привилегий' },
  { name: 'SECCOMP + AppArmor', color: '#e74c3c', description: 'Фильтрация syscalls' },
  { name: 'Сегментация сетей', color: '#1abc9c', description: 'Изоляция сервисов' },
  { name: 'Лимиты ресурсов', color: '#f39c12', description: 'Защита от DoS' },
]

export function Task11_3_Solution() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [visibleCode, setVisibleCode] = useState<Record<string, boolean>>({})
  const [showCompose, setShowCompose] = useState(false)

  const toggleCheck = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleCode = (id: string) => {
    setVisibleCode((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const totalItems = checklistData.reduce((sum, cat) => sum + cat.items.length, 0)
  const checkedCount = Object.values(checked).filter(Boolean).length
  const totalPercent = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0

  const categoryProgress = (category: ChecklistCategory) => {
    const catChecked = category.items.filter((item) => checked[item.id]).length
    return category.items.length > 0 ? Math.round((catChecked / category.items.length) * 100) : 0
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h3 style={{ marginBottom: '0.75rem' }}>Задание 11.3: Чеклист безопасности</h3>

      {/* Total progress */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <strong style={{ fontSize: '0.85rem' }}>Общий прогресс</strong>
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: totalPercent === 100 ? '#27ae60' : '#333' }}>
            {checkedCount}/{totalItems} ({totalPercent}%)
          </span>
        </div>
        <div style={{ backgroundColor: '#f0f0f0', borderRadius: '6px', height: '20px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${totalPercent}%`,
              height: '100%',
              backgroundColor: totalPercent === 100 ? '#27ae60' : '#0070f3',
              borderRadius: '6px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        {totalPercent === 100 && (
          <div style={{ textAlign: 'center', marginTop: '0.3rem', fontSize: '0.85rem', color: '#27ae60', fontWeight: 'bold' }}>
            ✅ Все пункты выполнены! Ваш Docker-окружение защищено.
          </div>
        )}
      </div>

      {/* Category mini progress bars */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {checklistData.map((cat) => {
          const pct = categoryProgress(cat)
          return (
            <div key={cat.name} style={{ flex: '1 1 120px', minWidth: '100px' }}>
              <div style={{ fontSize: '0.7rem', marginBottom: '0.1rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>{cat.icon} {cat.name}</span>
                <span style={{ fontWeight: 'bold' }}>{pct}%</span>
              </div>
              <div style={{ backgroundColor: '#f0f0f0', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    backgroundColor: pct === 100 ? '#27ae60' : '#0070f3',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Checklist categories */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
        {checklistData.map((cat) => (
          <div key={cat.name} style={{ border: '1px solid #e2e2e2', borderRadius: '6px', padding: '0.75rem' }}>
            <h4 style={{ fontSize: '0.9rem', margin: '0 0 0.5rem' }}>{cat.icon} {cat.name}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {cat.items.map((item) => (
                <div key={item.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <input
                      type="checkbox"
                      checked={!!checked[item.id]}
                      onChange={() => toggleCheck(item.id)}
                      style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                    <span
                      style={{
                        fontSize: '0.8rem',
                        flex: 1,
                        textDecoration: checked[item.id] ? 'line-through' : 'none',
                        color: checked[item.id] ? '#999' : '#333',
                      }}
                    >
                      {item.text}
                    </span>
                    <button
                      onClick={() => toggleCode(item.id)}
                      style={{
                        padding: '0.1rem 0.4rem',
                        border: '1px solid #ccc',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        backgroundColor: '#f8f8f8',
                        fontSize: '0.68rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {visibleCode[item.id] ? 'Скрыть' : 'Пример'}
                    </button>
                  </div>
                  {visibleCode[item.id] && (
                    <pre
                      style={{
                        backgroundColor: '#1e1e1e',
                        color: '#d4d4d4',
                        padding: '0.4rem',
                        borderRadius: '4px',
                        overflow: 'auto',
                        fontSize: '0.68rem',
                        lineHeight: '1.4',
                        marginTop: '0.25rem',
                        marginLeft: '1.4rem',
                      }}
                    >
                      {item.code}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Secure docker-compose.yml */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setShowCompose(!showCompose)}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #0070f3',
            borderRadius: '6px',
            cursor: 'pointer',
            backgroundColor: showCompose ? '#0070f3' : '#fff',
            color: showCompose ? '#fff' : '#0070f3',
            fontSize: '0.85rem',
            fontWeight: 'bold',
          }}
        >
          {showCompose ? 'Скрыть' : 'Показать'} безопасный docker-compose.yml
        </button>
        {showCompose && (
          <pre
            style={{
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
              padding: '0.75rem',
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '0.68rem',
              lineHeight: '1.4',
              marginTop: '0.5rem',
            }}
          >
            {secureComposeExample}
          </pre>
        )}
      </div>

      {/* Defense in Depth */}
      <div
        style={{
          padding: '0.75rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          border: '1px solid #dee2e6',
        }}
      >
        <strong style={{ fontSize: '0.9rem' }}>🛡️ Defense in Depth (Эшелонированная оборона)</strong>
        <p style={{ fontSize: '0.78rem', color: '#555', margin: '0.3rem 0 0.5rem' }}>
          Каждый слой защиты останавливает определённые атаки. Пробить все слои -- на порядки сложнее.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {defenseInDepthLayers.map((layer, i) => (
            <div key={layer.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: `${100 - i * 8}%`,
                  minWidth: '200px',
                  padding: '0.3rem 0.5rem',
                  backgroundColor: layer.color,
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>{layer.name}</span>
                <span style={{ opacity: 0.8, fontWeight: 'normal' }}>{layer.description}</span>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.72rem', color: '#666', marginTop: '0.4rem', textAlign: 'center', fontStyle: 'italic' }}>
          Атакующий должен пройти все слои. Один слой -- уязвимость. Семь слоёв -- безопасность.
        </p>
      </div>
    </div>
  )
}
