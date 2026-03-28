import { useState } from 'react'

// ========================================
// Задание 9.1: docker logs — Решение
// ========================================

const logsFlags = [
  { flag: '-f, --follow', description: 'Следить за логами в реальном времени', example: 'docker logs -f myapp' },
  { flag: '--tail N', description: 'Показать последние N строк', example: 'docker logs --tail 100 myapp' },
  { flag: '--since', description: 'Логи с момента (время или duration)', example: 'docker logs --since 30m myapp' },
  { flag: '--until', description: 'Логи до момента', example: 'docker logs --until 1h myapp' },
  { flag: '-t, --timestamps', description: 'Показать временные метки', example: 'docker logs -t myapp' },
  { flag: '--details', description: 'Дополнительные атрибуты логирования', example: 'docker logs --details myapp' },
]

const loggingDrivers = [
  { name: 'json-file', description: 'JSON-файлы на хосте (по умолчанию)', supportsLogs: true },
  { name: 'local', description: 'Оптимизированный формат с автоматической ротацией', supportsLogs: true },
  { name: 'journald', description: 'Системный журнал Linux (systemd)', supportsLogs: true },
  { name: 'syslog', description: 'Syslog-сервер', supportsLogs: false },
  { name: 'fluentd', description: 'Fluentd-коллектор логов', supportsLogs: false },
  { name: 'awslogs', description: 'Amazon CloudWatch Logs', supportsLogs: false },
  { name: 'none', description: 'Логирование отключено', supportsLogs: false },
]

const rotationExamples = [
  {
    label: 'CLI (docker run)',
    code: `docker run \\
  --log-driver json-file \\
  --log-opt max-size=10m \\
  --log-opt max-file=3 \\
  myapp`,
  },
  {
    label: 'Docker Compose',
    code: `services:
  api:
    image: myapp
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "5"
        tag: "{{.Name}}"`,
  },
  {
    label: 'daemon.json (глобально)',
    code: `{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3",
    "labels": "production_status",
    "env": "os,customer"
  }
}`,
  },
]

const stdoutExamples = `# Bash
echo "info message"   # STDOUT -> docker logs
echo "error!" >&2     # STDERR -> docker logs

# Node.js
console.log("info")    # STDOUT
console.error("error") # STDERR

# Python
print("info")                                # STDOUT
import sys; print("error", file=sys.stderr)  # STDERR`

type LogsSection = 'flags' | 'drivers' | 'rotation'

export function Task9_1_Solution() {
  const [activeSection, setActiveSection] = useState<LogsSection>('flags')
  const [showStdout, setShowStdout] = useState(false)

  const sections: { key: LogsSection; label: string }[] = [
    { key: 'flags', label: 'Флаги docker logs' },
    { key: 'drivers', label: 'Logging drivers' },
    { key: 'rotation', label: 'Ротация логов' },
  ]

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h3 style={{ marginBottom: '1rem' }}>Задание 9.1: docker logs</h3>

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

      {activeSection === 'flags' && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Флаг</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Описание</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Пример</th>
            </tr>
          </thead>
          <tbody>
            {logsFlags.map((f) => (
              <tr key={f.flag}>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontFamily: 'monospace', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  {f.flag}
                </td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{f.description}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {f.example}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeSection === 'drivers' && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Драйвер</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Описание</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center' }}>docker logs</th>
            </tr>
          </thead>
          <tbody>
            {loggingDrivers.map((d) => (
              <tr key={d.name}>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {d.name}
                </td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{d.description}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center', fontSize: '1rem' }}>
                  {d.supportsLogs ? '✅' : '❌'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeSection === 'rotation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
          {rotationExamples.map((r) => (
            <div key={r.label}>
              <strong style={{ fontSize: '0.9rem' }}>{r.label}:</strong>
              <pre
                style={{
                  backgroundColor: '#1e1e1e',
                  color: '#d4d4d4',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  overflow: 'auto',
                  fontSize: '0.8rem',
                  lineHeight: '1.5',
                  marginTop: '0.25rem',
                }}
              >
                {r.code}
              </pre>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setShowStdout(!showStdout)}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #e2e2e2',
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: showStdout ? '#f0f7ff' : '#f9f9f9',
            fontSize: '0.9rem',
          }}
        >
          {showStdout ? 'Скрыть' : 'Показать'} STDOUT vs STDERR
        </button>
      </div>

      {showStdout && (
        <pre
          style={{
            backgroundColor: '#1e1e1e',
            color: '#d4d4d4',
            padding: '1rem',
            borderRadius: '6px',
            overflow: 'auto',
            fontSize: '0.8rem',
            lineHeight: '1.5',
            marginBottom: '1rem',
          }}
        >
          {stdoutExamples}
        </pre>
      )}

      <div
        style={{
          padding: '0.75rem',
          backgroundColor: '#fff3cd',
          borderRadius: '6px',
          border: '1px solid #ffc107',
          fontSize: '0.85rem',
        }}
      >
        <strong>⚠️ Важно:</strong> docker logs показывает только STDOUT и STDERR.
        Если приложение пишет логи в файл внутри контейнера (например, <code>/var/log/app.log</code>),
        они <strong>не будут видны</strong> через docker logs. Перенаправляйте логи в STDOUT:{' '}
        <code>RUN ln -sf /dev/stdout /var/log/nginx/access.log</code>
      </div>
    </div>
  )
}

// ========================================
// Задание 9.2: inspect, stats, top — Решение
// ========================================

const inspectTemplates = [
  { label: 'IP-адрес', template: "{{.NetworkSettings.IPAddress}}", output: '172.17.0.2' },
  { label: 'Статус', template: "{{.State.Status}}", output: 'running' },
  { label: 'Код выхода', template: "{{.State.ExitCode}}", output: '0' },
  { label: 'Переменные окружения', template: "{{json .Config.Env}}", output: '["NODE_ENV=production","PORT=3000"]' },
  { label: 'Примонтированные тома', template: "{{json .Mounts}}", output: '[{"Source":"/data","Destination":"/app/data"...}]' },
  { label: 'OOM Killed', template: "{{.State.OOMKilled}}", output: 'false' },
  { label: 'PID главного процесса', template: "{{.State.Pid}}", output: '12345' },
  { label: 'Порты', template: "{{json .NetworkSettings.Ports}}", output: '{"3000/tcp":[{"HostIp":"0.0.0.0","HostPort":"3000"}]}' },
  { label: 'Время запуска', template: "{{.State.StartedAt}}", output: '2024-01-15T10:30:15.123456789Z' },
  { label: 'Logging driver', template: "{{.HostConfig.LogConfig.Type}}", output: 'json-file' },
]

const statsColumns = [
  { column: 'CPU %', description: 'Процент использования CPU от лимита' },
  { column: 'MEM USAGE / LIMIT', description: 'Текущее / максимальное потребление RAM' },
  { column: 'MEM %', description: 'Процент использования RAM' },
  { column: 'NET I/O', description: 'Входящий / исходящий сетевой трафик' },
  { column: 'BLOCK I/O', description: 'Чтение / запись на диск' },
  { column: 'PIDS', description: 'Количество процессов' },
]

const eventsFilters = [
  { filter: '--filter event=die', description: 'Только события завершения' },
  { filter: '--filter event=oom', description: 'Только события Out of Memory' },
  { filter: '--filter container=myapp', description: 'Только события контейнера myapp' },
  { filter: '--filter type=container', description: 'Только события контейнеров' },
  { filter: '--filter type=network', description: 'Только события сетей' },
  { filter: '--since 1h --until 30m', description: 'За определённый период' },
]

const lifecycleEvents = ['create', 'start', 'die', 'stop', 'destroy', 'kill', 'oom', 'health_status']

const cheatSheet = `# docker inspect -- полная информация
docker inspect --format='{{.State.Status}}' myapp
docker inspect --format='{{.State.OOMKilled}}' myapp
docker inspect --format='{{.NetworkSettings.IPAddress}}' myapp

# docker stats -- мониторинг ресурсов
docker stats --no-stream
docker stats --format "table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemUsage}}"

# docker top -- процессы в контейнере
docker top myapp
docker top myapp -o pid,user,%cpu,%mem,command

# docker events -- события Docker daemon
docker events --filter event=die
docker events --since 1h --format '{{json .}}'`

type MonitorSection = 'inspect' | 'stats' | 'top' | 'events'

export function Task9_2_Solution() {
  const [activeSection, setActiveSection] = useState<MonitorSection>('inspect')
  const [showCheatSheet, setShowCheatSheet] = useState(false)

  const sections: { key: MonitorSection; label: string }[] = [
    { key: 'inspect', label: 'docker inspect' },
    { key: 'stats', label: 'docker stats' },
    { key: 'top', label: 'docker top' },
    { key: 'events', label: 'docker events' },
  ]

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h3 style={{ marginBottom: '1rem' }}>Задание 9.2: inspect, stats, top</h3>

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

      {activeSection === 'inspect' && (
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: '#555' }}>
            Go templates для извлечения конкретных полей из <code>docker inspect</code>:
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '0.4rem', border: '1px solid #ddd', textAlign: 'left' }}>Данные</th>
                <th style={{ padding: '0.4rem', border: '1px solid #ddd', textAlign: 'left' }}>Template</th>
                <th style={{ padding: '0.4rem', border: '1px solid #ddd', textAlign: 'left' }}>Пример вывода</th>
              </tr>
            </thead>
            <tbody>
              {inspectTemplates.map((t) => (
                <tr key={t.label}>
                  <td style={{ padding: '0.4rem', border: '1px solid #ddd', fontWeight: 'bold' }}>{t.label}</td>
                  <td style={{ padding: '0.4rem', border: '1px solid #ddd', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {t.template}
                  </td>
                  <td style={{ padding: '0.4rem', border: '1px solid #ddd', fontFamily: 'monospace', fontSize: '0.75rem', color: '#2e7d32' }}>
                    {t.output}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSection === 'stats' && (
        <div style={{ marginBottom: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Колонка</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Описание</th>
              </tr>
            </thead>
            <tbody>
              {statsColumns.map((c) => (
                <tr key={c.column}>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '0.8rem' }}>
                    {c.column}
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{c.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <strong style={{ fontSize: '0.9rem' }}>Пользовательский формат:</strong>
          <pre
            style={{
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
              padding: '0.75rem',
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '0.8rem',
              lineHeight: '1.5',
              marginTop: '0.25rem',
            }}
          >
            {`$ docker stats --no-stream --format "table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemUsage}}"

NAME   CPU %   MEM USAGE / LIMIT
api    2.50%   128MiB / 512MiB
db     1.20%   256MiB / 1GiB
redis  0.30%   32MiB / 256MiB`}
          </pre>
        </div>
      )}

      {activeSection === 'top' && (
        <div style={{ marginBottom: '1rem' }}>
          <strong style={{ fontSize: '0.9rem' }}>Процессы внутри контейнера (без exec):</strong>
          <pre
            style={{
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
              padding: '0.75rem',
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '0.8rem',
              lineHeight: '1.5',
              marginTop: '0.5rem',
            }}
          >
            {`$ docker top myapp

UID    PID    PPID   C  STIME  TTY  TIME      CMD
root   12345  12300  0  10:30  ?    00:00:05  node server.js
root   12346  12345  0  10:30  ?    00:00:01  /usr/bin/node worker.js`}
          </pre>
          <div style={{ marginTop: '0.75rem' }}>
            <strong style={{ fontSize: '0.9rem' }}>С пользовательскими полями:</strong>
            <pre
              style={{
                backgroundColor: '#1e1e1e',
                color: '#d4d4d4',
                padding: '0.75rem',
                borderRadius: '6px',
                overflow: 'auto',
                fontSize: '0.8rem',
                lineHeight: '1.5',
                marginTop: '0.25rem',
              }}
            >
              {`$ docker top myapp -o pid,user,%cpu,%mem,command

PID    USER   %CPU  %MEM  COMMAND
12345  root   2.5   1.2   node server.js
12346  root   0.3   0.5   /usr/bin/node worker.js`}
            </pre>
          </div>
          <div
            style={{
              marginTop: '0.75rem',
              padding: '0.5rem',
              backgroundColor: '#e8f5e9',
              borderRadius: '4px',
              fontSize: '0.85rem',
            }}
          >
            <strong>💡 Tip:</strong> Для Docker Compose: <code>docker compose top</code> показывает процессы всех сервисов.
          </div>
        </div>
      )}

      {activeSection === 'events' && (
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: '#555' }}>
            Фильтры для <code>docker events</code>:
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Фильтр</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Описание</th>
              </tr>
            </thead>
            <tbody>
              {eventsFilters.map((f) => (
                <tr key={f.filter}>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {f.filter}
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{f.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <strong style={{ fontSize: '0.9rem' }}>События жизненного цикла контейнера:</strong>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {lifecycleEvents.map((event, i) => (
              <span key={event} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <code
                  style={{
                    padding: '0.2rem 0.5rem',
                    backgroundColor: event === 'oom' || event === 'kill' ? '#ffebee' : '#e3f2fd',
                    borderRadius: '3px',
                    fontSize: '0.8rem',
                    fontWeight: event === 'oom' || event === 'kill' ? 'bold' : 'normal',
                    color: event === 'oom' || event === 'kill' ? '#c62828' : '#1565c0',
                  }}
                >
                  {event}
                </code>
                {i < lifecycleEvents.length - 1 && <span style={{ color: '#999' }}>{i < 4 ? ' →' : ''}</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setShowCheatSheet(!showCheatSheet)}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #e2e2e2',
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: showCheatSheet ? '#f0f7ff' : '#f9f9f9',
            fontSize: '0.9rem',
          }}
        >
          {showCheatSheet ? 'Скрыть' : 'Показать'} шпаргалку
        </button>
      </div>

      {showCheatSheet && (
        <pre
          style={{
            backgroundColor: '#1e1e1e',
            color: '#d4d4d4',
            padding: '1rem',
            borderRadius: '6px',
            overflow: 'auto',
            fontSize: '0.8rem',
            lineHeight: '1.5',
          }}
        >
          {cheatSheet}
        </pre>
      )}
    </div>
  )
}

// ========================================
// Задание 9.3: Отладка типичных ошибок — Решение
// ========================================

const errorScenarios = [
  {
    key: 'exit0',
    label: 'Exit 0',
    symptom: `$ docker ps -a
CONTAINER ID  IMAGE   STATUS                  NAMES
a1b2c3d4e5f6  myapp   Exited (0) 1 sec ago    myapp`,
    cause: 'Главный процесс контейнера завершается. Контейнер живёт, пока работает PID 1. Скрипт выполнился и завершился, или процесс ушёл в фон (демонизировался).',
    diagnosis: `# Проверить логи
docker logs myapp

# Проверить CMD образа
docker inspect --format='{{.Config.Cmd}}' myapp

# Зайти интерактивно
docker run -it myapp sh`,
    solution: `# Процесс на переднем плане:
CMD ["nginx", "-g", "daemon off;"]
CMD ["node", "server.js"]

# Не: CMD ["bash", "setup.sh"]  -- скрипт завершится
# Не: CMD ["nginx"]             -- демонизируется`,
  },
  {
    key: 'exit1',
    label: 'Exit 1',
    symptom: `$ docker ps -a
CONTAINER ID  IMAGE   STATUS                  NAMES
a1b2c3d4e5f6  myapp   Exited (1) 5 secs ago   api`,
    cause: 'Ошибка приложения: отсутствующий модуль, неверный путь, нет подключения к базе данных, синтаксическая ошибка.',
    diagnosis: `# Прочитать логи ошибки
docker logs api
# Error: Cannot find module '/app/server.js'

# Проверить файлы внутри
docker run -it myapp sh
ls -la /app/

# Проверить переменные окружения
docker inspect --format='{{json .Config.Env}}' api`,
    solution: `# Убедиться, что файлы скопированы:
COPY package*.json ./
RUN npm install
COPY . .

# Убедиться, что зависимости доступны:
docker run -it myapp ls -la /app/node_modules/

# Проверить .dockerignore -- не исключает ли нужные файлы`,
  },
  {
    key: 'exit137',
    label: 'Exit 137 (OOM)',
    symptom: `$ docker ps -a
CONTAINER ID  IMAGE   STATUS                    NAMES
a1b2c3d4e5f6  myapp   Exited (137) 2 mins ago   api`,
    cause: 'Exit 137 = 128 + 9 (SIGKILL). Контейнер убит принудительно: OOM Killer (нехватка памяти) или docker kill / docker stop с таймаутом.',
    diagnosis: `# Проверить OOM
docker inspect --format='{{.State.OOMKilled}}' api
# true -> убит из-за нехватки памяти

# Проверить лимиты памяти
docker inspect --format='{{.HostConfig.Memory}}' api
# 268435456 (256 MB)

# Посмотреть потребление (если жив)
docker stats --no-stream api`,
    solution: `# Увеличить лимит памяти:
docker run -m 1g myapp

# В docker-compose.yml:
services:
  api:
    deploy:
      resources:
        limits:
          memory: 1G

# Или оптимизировать приложение:
# Node.js: --max-old-space-size=512
# Java: -Xmx512m`,
  },
  {
    key: 'port',
    label: 'Port conflict',
    symptom: `$ docker run -p 3000:3000 myapp
Error response from daemon:
  Bind for 0.0.0.0:3000 failed: port is already allocated`,
    cause: 'Порт 3000 на хосте уже занят другим контейнером или процессом.',
    diagnosis: `# Какой контейнер занимает порт
docker ps --format '{{.Names}}\\t{{.Ports}}' | grep 3000

# Какой процесс на хосте
lsof -i :3000          # macOS/Linux
netstat -tlnp | grep 3000  # Linux

# Все занятые порты Docker
docker ps --format 'table {{.Names}}\\t{{.Ports}}'`,
    solution: `# Вариант 1: Использовать другой порт хоста
docker run -p 3001:3000 myapp

# Вариант 2: Остановить контейнер, занимающий порт
docker stop <occupying_container>

# Вариант 3: В docker-compose.yml
ports:
  - "3001:3000"  # host:container`,
  },
  {
    key: 'permission',
    label: 'Permission denied',
    symptom: `$ docker logs api
Error: EACCES: permission denied, open '/data/config.json'`,
    cause: 'Процесс в контейнере запущен от пользователя, у которого нет прав на файлы в примонтированном томе или директории.',
    diagnosis: `# Проверить пользователя в контейнере
docker exec api id
# uid=1000(node) gid=1000(node)

# Проверить права на файлы
docker exec api ls -la /data/

# Проверить владельца на хосте
ls -la ./data/`,
    solution: `# В Dockerfile: установить владельца
RUN mkdir -p /data && chown -R node:node /data
USER node

# При запуске: указать uid:gid хоста
docker run -u $(id -u):$(id -g) -v ./data:/data myapp

# Или поправить права на хосте
chmod -R 755 ./data/`,
  },
  {
    key: 'network',
    label: 'Network issues',
    symptom: `$ docker logs api
Error: getaddrinfo ENOTFOUND db`,
    cause: 'Контейнер не может найти другой контейнер по имени. Контейнеры в разных сетях или имя сервиса указано неверно.',
    diagnosis: `# Проверить сети контейнеров
docker inspect --format='{{json .NetworkSettings.Networks}}' api
docker inspect --format='{{json .NetworkSettings.Networks}}' db

# Проверить DNS из контейнера
docker exec api ping db
docker exec api nslookup db

# Список сетей
docker network ls
docker network inspect mynetwork`,
    solution: `# Подключить к общей сети
docker network create mynet
docker network connect mynet api
docker network connect mynet db

# В docker-compose.yml контейнеры
# одного файла автоматически в одной сети.
# Используйте имя сервиса как hostname:
# DATABASE_URL=postgresql://user:pass@db:5432/myapp`,
  },
]

const exitCodes = [
  { code: 0, signal: '-', meaning: 'Нормальное завершение' },
  { code: 1, signal: '-', meaning: 'Ошибка приложения (общая)' },
  { code: 126, signal: '-', meaning: 'Файл не исполняемый (permission)' },
  { code: 127, signal: '-', meaning: 'Команда не найдена (CMD/ENTRYPOINT)' },
  { code: 137, signal: 'SIGKILL (9)', meaning: 'Принудительное завершение / OOM Killed' },
  { code: 143, signal: 'SIGTERM (15)', meaning: 'Graceful shutdown (docker stop)' },
]

const debugAlgorithm = `1. docker ps -a               → Статус и exit code
2. docker logs <container>     → Что написало приложение
3. docker inspect <container>  → Конфигурация, сети, env, OOM
4. docker exec -it <c> sh     → Зайти внутрь и проверить
5. docker events --since 1h    → Что произошло на уровне Docker
6. docker stats               → Ресурсы (CPU, RAM, I/O)
7. docker system df            → Место на диске`

export function Task9_3_Solution() {
  const [activeScenario, setActiveScenario] = useState('exit0')
  const [showAlgorithm, setShowAlgorithm] = useState(false)

  const current = errorScenarios.find((s) => s.key === activeScenario)

  const codeBlockStyle = {
    backgroundColor: '#1e1e1e' as const,
    color: '#d4d4d4' as const,
    padding: '0.75rem' as const,
    borderRadius: '6px' as const,
    overflow: 'auto' as const,
    fontSize: '0.8rem' as const,
    lineHeight: '1.5' as const,
    marginTop: '0.25rem' as const,
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h3 style={{ marginBottom: '1rem' }}>Задание 9.3: Отладка типичных ошибок</h3>

      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {errorScenarios.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveScenario(s.key)}
            style={{
              padding: '0.3rem 0.6rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: activeScenario === s.key ? '#d32f2f' : '#fff',
              color: activeScenario === s.key ? '#fff' : '#333',
              fontSize: '0.8rem',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {current && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <strong style={{ color: '#d32f2f', fontSize: '0.9rem' }}>Симптом:</strong>
            <pre style={codeBlockStyle}>{current.symptom}</pre>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong style={{ color: '#e65100', fontSize: '0.9rem' }}>Причина:</strong>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', color: '#555' }}>{current.cause}</p>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong style={{ color: '#1565c0', fontSize: '0.9rem' }}>Диагностика:</strong>
            <pre style={codeBlockStyle}>{current.diagnosis}</pre>
          </div>

          <div>
            <strong style={{ color: '#2e7d32', fontSize: '0.9rem' }}>Решение:</strong>
            <pre style={codeBlockStyle}>{current.solution}</pre>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setShowAlgorithm(!showAlgorithm)}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #e2e2e2',
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: showAlgorithm ? '#f0f7ff' : '#f9f9f9',
            fontSize: '0.9rem',
          }}
        >
          {showAlgorithm ? 'Скрыть' : 'Показать'} алгоритм отладки
        </button>
      </div>

      {showAlgorithm && (
        <pre
          style={{
            backgroundColor: '#e8f5e9',
            color: '#1b5e20',
            padding: '1rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            lineHeight: '1.8',
            marginBottom: '1rem',
            border: '1px solid #a5d6a7',
          }}
        >
          {debugAlgorithm}
        </pre>
      )}

      <div style={{ marginTop: '0.5rem' }}>
        <strong style={{ fontSize: '0.9rem' }}>Exit codes:</strong>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '0.4rem', border: '1px solid #ddd', textAlign: 'center' }}>Code</th>
              <th style={{ padding: '0.4rem', border: '1px solid #ddd', textAlign: 'center' }}>Signal</th>
              <th style={{ padding: '0.4rem', border: '1px solid #ddd', textAlign: 'left' }}>Значение</th>
            </tr>
          </thead>
          <tbody>
            {exitCodes.map((e) => (
              <tr key={e.code}>
                <td
                  style={{
                    padding: '0.4rem',
                    border: '1px solid #ddd',
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    color: e.code === 0 ? '#2e7d32' : e.code >= 126 ? '#d32f2f' : '#e65100',
                  }}
                >
                  {e.code}
                </td>
                <td style={{ padding: '0.4rem', border: '1px solid #ddd', textAlign: 'center', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {e.signal}
                </td>
                <td style={{ padding: '0.4rem', border: '1px solid #ddd' }}>{e.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
