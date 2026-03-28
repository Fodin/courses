import { useState } from 'react'

// ========================================
// Задание 5.1: Bridge network — Решение
// ========================================

const networkDrivers = [
  { driver: 'bridge', desc: 'Виртуальный мост на хосте (по умолчанию)', use: 'Стандартные контейнеры' },
  { driver: 'host', desc: 'Контейнер использует сеть хоста напрямую', use: 'Максимальная производительность' },
  { driver: 'none', desc: 'Полное отключение сети', use: 'Batch-задачи, безопасность' },
  { driver: 'overlay', desc: 'Сеть между несколькими Docker-хостами', use: 'Docker Swarm' },
  { driver: 'macvlan', desc: 'Контейнер получает MAC-адрес в физической сети', use: 'Legacy-интеграция' },
]

const bridgeComparison = [
  { feature: 'DNS по имени', default: '❌ Нет', custom: '✅ Да' },
  { feature: 'Изоляция', default: '❌ Все вместе', custom: '✅ Только участники' },
  { feature: 'Горячее подключение', default: '❌ Нет', custom: '✅ docker network connect' },
  { feature: 'Настройка подсети', default: '❌ Ограничена', custom: '✅ --subnet, --gateway' },
  { feature: 'Рекомендация', default: '⚠️ Только для тестов', custom: '✅ Для реальных проектов' },
]

export function Task5_1_Solution() {
  const [tab, setTab] = useState<'drivers' | 'diagram' | 'comparison'>('drivers')

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Bridge Network</h3>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {([
          { key: 'drivers' as const, label: 'Сетевые драйверы' },
          { key: 'diagram' as const, label: 'Архитектура bridge' },
          { key: 'comparison' as const, label: 'Default vs Custom' },
        ]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '0.5rem 1rem',
              background: tab === t.key ? '#1976d2' : '#f5f5f5',
              color: tab === t.key ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'drivers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {networkDrivers.map((d, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: i === 0 ? '#e3f2fd' : '#f8f9fa', borderRadius: '6px', alignItems: 'center', borderLeft: i === 0 ? '3px solid #1976d2' : '3px solid transparent' }}>
              <div>
                <code style={{ color: '#1565c0', fontWeight: 'bold' }}>{d.driver}</code>
                <span style={{ color: '#666', fontSize: '0.85rem', marginLeft: '0.75rem' }}>{d.desc}</span>
              </div>
              <span style={{ color: '#888', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{d.use}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'diagram' && (
        <div>
          <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '6px', fontSize: '0.8rem', lineHeight: '1.4', overflowX: 'auto' }}>
{`┌──────────────────────────────────────────┐
│              Хост-машина                 │
│                                          │
│   :8080 (пользователь)                   │
│      │                                   │
│      ▼  iptables / NAT                   │
│                                          │
│   ┌──────────────────────────────────┐   │
│   │  bridge network (172.17.0.0/16)  │   │
│   │                                  │   │
│   │  ┌──────────┐   ┌──────────┐    │   │
│   │  │   web    │   │   api    │    │   │
│   │  │ :80      │   │ :3000    │    │   │
│   │  │ 172.17.  │   │ 172.17.  │    │   │
│   │  │ 0.2      │◄──►  0.3     │    │   │
│   │  └──────────┘   └──────────┘    │   │
│   └──────────────────────────────────┘   │
└──────────────────────────────────────────┘`}
          </pre>
          <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#fff3e0', borderRadius: '8px', fontSize: '0.85rem' }}>
            <strong>Как работает bridge:</strong> Docker создает виртуальный мост (docker0) на хосте. Каждый контейнер получает виртуальный сетевой интерфейс (veth), подключённый к мосту. Трафик между контейнерами проходит через мост, а наружу -- через NAT/iptables.
          </div>
        </div>
      )}

      {tab === 'comparison' && (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Возможность</th>
                <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #ddd' }}>Default bridge</th>
                <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #ddd' }}>User-defined bridge</th>
              </tr>
            </thead>
            <tbody>
              {bridgeComparison.map((row, i) => (
                <tr key={i}>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontWeight: 'bold' }}>{row.feature}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center' }}>{row.default}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center' }}>{row.custom}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#e8f5e9', borderRadius: '8px' }}>
            <strong>Вывод:</strong> всегда создавайте пользовательскую сеть через <code>docker network create</code>. Default bridge подходит только для быстрых тестов.
          </div>
        </div>
      )}
    </div>
  )
}

// ========================================
// Задание 5.2: Связь между контейнерами — Решение
// ========================================

const communicationSteps = [
  { step: 1, cmd: 'docker network create app-net', output: 'a1b2c3d4e5f6...', desc: 'Создаём пользовательскую сеть' },
  { step: 2, cmd: 'docker run -d --name db --network app-net postgres:16', output: 'f7g8h9i0j1k2...', desc: 'Запускаем БД в сети' },
  { step: 3, cmd: 'docker run -d --name api --network app-net my-api', output: 'l3m4n5o6p7q8...', desc: 'Запускаем API в той же сети' },
  { step: 4, cmd: 'docker exec api ping -c 2 db', output: 'PING db (172.18.0.2): 56 data bytes\n64 bytes from 172.18.0.2: seq=0 ttl=64 time=0.089 ms\n64 bytes from 172.18.0.2: seq=1 ttl=64 time=0.102 ms', desc: 'API находит БД по имени!' },
  { step: 5, cmd: 'docker exec api psql -h db -U postgres -c "SELECT 1"', output: ' ?column?\n----------\n        1\n(1 row)', desc: 'API подключается к БД через DNS' },
]

const isolationDemo = [
  { cmd: 'docker network create frontend', desc: 'Сеть для фронтенда' },
  { cmd: 'docker network create backend', desc: 'Сеть для бэкенда' },
  { cmd: 'docker run -d --name web --network frontend nginx', desc: 'web в frontend' },
  { cmd: 'docker run -d --name api --network frontend my-api\ndocker network connect backend api', desc: 'api в обеих сетях (мост)' },
  { cmd: 'docker run -d --name db --network backend postgres:16', desc: 'db только в backend' },
]

export function Task5_2_Solution() {
  const [view, setView] = useState<'dns' | 'isolation' | 'alias'>('dns')
  const [activeStep, setActiveStep] = useState(0)

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Связь между контейнерами</h3>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {([
          { key: 'dns' as const, label: 'DNS-резолвинг' },
          { key: 'isolation' as const, label: 'Сетевая изоляция' },
          { key: 'alias' as const, label: 'Алиасы' },
        ]).map(t => (
          <button
            key={t.key}
            onClick={() => setView(t.key)}
            style={{
              padding: '0.5rem 1rem',
              background: view === t.key ? '#2e7d32' : '#f5f5f5',
              color: view === t.key ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {view === 'dns' && (
        <div>
          <p style={{ fontSize: '0.9rem', color: '#555', margin: '0 0 1rem 0' }}>
            Пошаговая демонстрация: контейнеры находят друг друга по DNS-именам
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {communicationSteps.map((s, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                style={{
                  padding: '0.3rem 0.7rem',
                  background: activeStep === i ? '#2e7d32' : '#f5f5f5',
                  color: activeStep === i ? 'white' : '#333',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                Шаг {s.step}
              </button>
            ))}
          </div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '3px solid #2e7d32' }}>
            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>{communicationSteps[activeStep].desc}</div>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>
              {`$ ${communicationSteps[activeStep].cmd}`}
            </pre>
            <pre style={{ background: '#263238', color: '#a5d6a7', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', margin: 0, whiteSpace: 'pre-wrap' }}>
              {communicationSteps[activeStep].output}
            </pre>
          </div>
        </div>
      )}

      {view === 'isolation' && (
        <div>
          <p style={{ fontSize: '0.9rem', color: '#555', margin: '0 0 1rem 0' }}>
            Контейнер <code>api</code> подключён к обеим сетям и служит мостом. <code>web</code> не видит <code>db</code>.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {isolationDemo.map((item, i) => (
              <div key={i} style={{ padding: '0.5rem 0.75rem', background: '#f8f9fa', borderRadius: '6px' }}>
                <pre style={{ margin: 0, fontSize: '0.8rem', color: '#1565c0' }}>{item.cmd}</pre>
                <small style={{ color: '#888' }}>{item.desc}</small>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div style={{ padding: '0.75rem', background: '#e8f5e9', borderRadius: '6px', textAlign: 'center' }}>
              <strong>web &rarr; api</strong><br /><small>frontend: OK</small>
            </div>
            <div style={{ padding: '0.75rem', background: '#e8f5e9', borderRadius: '6px', textAlign: 'center' }}>
              <strong>api &rarr; db</strong><br /><small>backend: OK</small>
            </div>
            <div style={{ padding: '0.75rem', background: '#fce4ec', borderRadius: '6px', textAlign: 'center', gridColumn: 'span 2' }}>
              <strong>web &rarr; db</strong><br /><small>Изолированы! web не видит db</small>
            </div>
          </div>
        </div>
      )}

      {view === 'alias' && (
        <div>
          <p style={{ fontSize: '0.9rem', color: '#555', margin: '0 0 1rem 0' }}>
            Сетевые алиасы позволяют обращаться к контейнеру по нескольким DNS-именам.
          </p>
          <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>
{`# Контейнер с алиасами
docker run -d --name postgres-primary \\
  --network backend \\
  --network-alias db \\
  --network-alias database \\
  postgres:16

# Все три имени резолвятся в один контейнер:
# postgres-primary, db, database`}
          </pre>
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#e3f2fd', borderRadius: '8px' }}>
            <strong>Зачем алиасы?</strong>
            <ul style={{ margin: '0.5rem 0 0 0' }}>
              <li>Абстракция: приложение обращается к <code>db</code>, а не к конкретному контейнеру</li>
              <li>Миграция: можно заменить PostgreSQL на MySQL, сохранив алиас <code>db</code></li>
              <li>Балансировка: несколько контейнеров с одним алиасом -- round-robin DNS</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

// ========================================
// Задание 5.3: Проброс портов — Решение
// ========================================

const portExamples = [
  {
    title: 'Базовый проброс',
    cmd: 'docker run -p 8080:80 nginx',
    desc: 'localhost:8080 на хосте -> порт 80 в контейнере',
  },
  {
    title: 'Только localhost',
    cmd: 'docker run -p 127.0.0.1:8080:80 nginx',
    desc: 'Порт доступен ТОЛЬКО с localhost, не из внешней сети',
  },
  {
    title: 'Случайный порт',
    cmd: 'docker run -P nginx',
    desc: 'Docker выберет свободный порт на хосте (32768+)',
  },
  {
    title: 'UDP-порт',
    cmd: 'docker run -p 5353:53/udp dns-server',
    desc: 'Проброс UDP-порта (по умолчанию TCP)',
  },
  {
    title: 'Несколько портов',
    cmd: 'docker run -p 80:80 -p 443:443 nginx',
    desc: 'Можно пробрасывать несколько портов одновременно',
  },
]

export function Task5_3_Solution() {
  const [selected, setSelected] = useState(0)
  const [showDiagram, setShowDiagram] = useState(false)

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Проброс портов (Port Mapping)</h3>

      <div style={{ marginBottom: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Синтаксис</th>
              <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Значение</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>-p hostPort:containerPort</code></td>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Конкретный порт на всех интерфейсах</td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>-p ip:hostPort:containerPort</code></td>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Конкретный порт на конкретном интерфейсе</td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>-p containerPort</code></td>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Случайный порт хоста</td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>-P</code></td>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Все EXPOSE-порты на случайные порты</td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>-p port/udp</code></td>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>UDP-протокол (по умолчанию TCP)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {portExamples.map((ex, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            style={{
              padding: '0.4rem 0.8rem',
              background: selected === i ? '#e65100' : '#f5f5f5',
              color: selected === i ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {ex.title}
          </button>
        ))}
      </div>

      <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>
          {portExamples[selected].cmd}
        </pre>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>{portExamples[selected].desc}</p>
      </div>

      <button
        onClick={() => setShowDiagram(!showDiagram)}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          background: showDiagram ? '#e65100' : '#f5f5f5',
          color: showDiagram ? 'white' : '#333',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {showDiagram ? 'Скрыть диаграмму' : 'Показать: EXPOSE vs -p'}
      </button>

      {showDiagram && (
        <div style={{ marginTop: '0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', background: '#fce4ec', borderRadius: '8px' }}>
              <strong>EXPOSE (Dockerfile)</strong>
              <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem', margin: '0.5rem 0' }}>
{`FROM nginx
EXPOSE 80 443`}
              </pre>
              <small>Только документация! Порт НЕ публикуется.</small>
            </div>
            <div style={{ padding: '0.75rem', background: '#e8f5e9', borderRadius: '8px' }}>
              <strong>-p (docker run)</strong>
              <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem', margin: '0.5rem 0' }}>
{`docker run -p 8080:80 nginx`}
              </pre>
              <small>Реальная публикация порта на хосте.</small>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fce4ec', borderRadius: '8px' }}>
        <strong>⚠️ Безопасность:</strong> <code>-p 8080:80</code> открывает порт на <strong>всех интерфейсах</strong> (0.0.0.0). На сервере с публичным IP это означает доступ из интернета. Используйте <code>-p 127.0.0.1:8080:80</code> для ограничения.
      </div>
    </div>
  )
}

// ========================================
// Задание 5.4: Custom networks — Решение
// ========================================

const networkCommands = [
  { cmd: 'docker network create my-net', output: 'a1b2c3d4e5f6...', desc: 'Создать сеть' },
  { cmd: 'docker network create --subnet 172.20.0.0/16 --gateway 172.20.0.1 custom-net', output: 'f7g8h9i0j1k2...', desc: 'Создать с параметрами' },
  { cmd: 'docker network ls', output: 'NETWORK ID   NAME        DRIVER   SCOPE\na1b2c3d4e5   bridge      bridge   local\nd7e8f9a0b1   host        host     local\ne3f4a5b6c7   none        null     local\nf7g8h9i0j1   my-net      bridge   local\nl3m4n5o6p7   custom-net  bridge   local', desc: 'Список сетей' },
  { cmd: 'docker network inspect my-net', output: '[{\n  "Name": "my-net",\n  "Driver": "bridge",\n  "IPAM": {\n    "Config": [{ "Subnet": "172.18.0.0/16", "Gateway": "172.18.0.1" }]\n  },\n  "Containers": {}\n}]', desc: 'Подробная информация' },
  { cmd: 'docker network connect my-net existing-container', output: '(no output)', desc: 'Подключить контейнер' },
  { cmd: 'docker network disconnect my-net existing-container', output: '(no output)', desc: 'Отключить контейнер' },
  { cmd: 'docker network rm my-net', output: 'my-net', desc: 'Удалить сеть' },
  { cmd: 'docker network prune', output: 'Deleted Networks:\nmy-net\ncustom-net', desc: 'Удалить неиспользуемые' },
]

export function Task5_4_Solution() {
  const [section, setSection] = useState<'commands' | 'multi' | 'patterns'>('commands')
  const [activeCmd, setActiveCmd] = useState(0)

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Custom Networks</h3>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {([
          { key: 'commands' as const, label: 'Команды' },
          { key: 'multi' as const, label: 'Multi-network' },
          { key: 'patterns' as const, label: 'Паттерны' },
        ]).map(s => (
          <button
            key={s.key}
            onClick={() => setSection(s.key)}
            style={{
              padding: '0.5rem 1rem',
              background: section === s.key ? '#7b1fa2' : '#f5f5f5',
              color: section === s.key ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {section === 'commands' && (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem' }}>
            {networkCommands.map((c, i) => (
              <button
                key={i}
                onClick={() => setActiveCmd(i)}
                style={{
                  padding: '0.4rem 0.75rem',
                  background: activeCmd === i ? '#7b1fa2' : '#f8f9fa',
                  color: activeCmd === i ? 'white' : '#333',
                  border: '1px solid #eee',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                }}
              >
                <code>{c.desc}</code>
              </button>
            ))}
          </div>
          <div style={{ padding: '1rem', background: '#f3e5f5', borderRadius: '8px' }}>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>
              {`$ ${networkCommands[activeCmd].cmd}`}
            </pre>
            <pre style={{ background: '#263238', color: '#ce93d8', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', margin: 0, whiteSpace: 'pre-wrap' }}>
              {networkCommands[activeCmd].output}
            </pre>
          </div>
        </div>
      )}

      {section === 'multi' && (
        <div>
          <p style={{ fontSize: '0.9rem', color: '#555', margin: '0 0 1rem 0' }}>
            Контейнер может быть подключён к нескольким сетям одновременно.
          </p>
          <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '6px', fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>
{`# Создаём две сети
docker network create frontend
docker network create backend

# api подключён к обеим сетям
docker run -d --name api --network frontend my-api
docker network connect backend api

# web только в frontend
docker run -d --name web --network frontend -p 80:80 nginx

# db только в backend
docker run -d --name db --network backend postgres:16

# Проверяем сети контейнера api
docker inspect api -f '{{json .NetworkSettings.Networks}}' | jq
# { "frontend": { ... }, "backend": { ... } }`}
          </pre>
          <div style={{ marginTop: '1rem' }}>
            <pre style={{ background: '#f3e5f5', color: '#4a148c', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem', lineHeight: '1.4' }}>
{`  frontend          backend
  ┌─────────┐       ┌─────────┐
  │  web    │       │   db    │
  │         │       │         │
  │   api ──┼───────┼── api   │
  │         │       │         │
  └─────────┘       └─────────┘

  web → api  ✅      api → db  ✅
  web → db   ❌  (изоляция!)`}
            </pre>
          </div>
        </div>
      )}

      {section === 'patterns' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '3px solid #7b1fa2' }}>
            <strong>Веб-приложение с БД</strong>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', margin: '0.5rem 0', whiteSpace: 'pre-wrap' }}>
{`docker network create webapp
docker run -d --name db --network webapp \\
  -v pgdata:/var/lib/postgresql/data \\
  postgres:16
docker run -d --name app --network webapp \\
  -e DATABASE_URL=postgresql://postgres@db:5432 \\
  -p 3000:3000 my-app`}
            </pre>
            <small style={{ color: '#666' }}>БД доступна только внутри сети, приложение -- снаружи через порт 3000</small>
          </div>

          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '3px solid #7b1fa2' }}>
            <strong>Reverse proxy</strong>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', margin: '0.5rem 0', whiteSpace: 'pre-wrap' }}>
{`docker network create proxy-net
docker run -d --name api1 --network proxy-net my-api-1
docker run -d --name api2 --network proxy-net my-api-2
docker run -d --name proxy --network proxy-net \\
  -p 80:80 -p 443:443 nginx`}
            </pre>
            <small style={{ color: '#666' }}>Только proxy имеет публичные порты, backend-сервисы изолированы</small>
          </div>

          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '3px solid #7b1fa2' }}>
            <strong>Отладка сети</strong>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', margin: '0.5rem 0', whiteSpace: 'pre-wrap' }}>
{`# Подключиться к сети для отладки
docker run -it --rm --network my-net \\
  nicolaka/netshoot bash
# Внутри: ping api, curl http://web:80, nslookup db`}
            </pre>
            <small style={{ color: '#666' }}>netshoot -- образ с сетевыми утилитами для диагностики</small>
          </div>
        </div>
      )}
    </div>
  )
}
