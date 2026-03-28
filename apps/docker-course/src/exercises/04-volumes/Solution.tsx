import { useState } from 'react'

// ========================================
// Задание 4.1: Именованные тома — Решение
// ========================================

const volumeCommands = [
  { cmd: 'docker volume create my-data', desc: 'Создать именованный том' },
  { cmd: 'docker volume ls', desc: 'Список всех томов' },
  { cmd: 'docker volume inspect my-data', desc: 'Подробная информация о томе' },
  { cmd: 'docker volume rm my-data', desc: 'Удалить том' },
  { cmd: 'docker volume prune', desc: 'Удалить все неиспользуемые тома' },
]

const volumeExamples = [
  {
    title: 'Использование с -v',
    cmd: 'docker run -v my-data:/app/data nginx',
    note: 'Если том не существует, Docker создаст его автоматически',
  },
  {
    title: 'Использование с --mount',
    cmd: 'docker run --mount type=volume,source=my-data,target=/app/data nginx',
    note: 'Рекомендуемый синтаксис — более явный и читаемый',
  },
  {
    title: 'Общий том для двух контейнеров',
    cmd: `docker run -d --name writer -v shared:/data ubuntu bash -c "while true; do date >> /data/log.txt; sleep 1; done"
docker run --rm -v shared:/data ubuntu tail -5 /data/log.txt`,
    note: 'Оба контейнера видят одни и те же данные',
  },
]

export function Task4_1_Solution() {
  const [tab, setTab] = useState<'commands' | 'examples'>('commands')

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Именованные тома (Named Volumes)</h3>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {(['commands', 'examples'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '0.5rem 1rem',
              background: tab === t ? '#1976d2' : '#f5f5f5',
              color: tab === t ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {t === 'commands' ? 'Команды управления' : 'Примеры использования'}
          </button>
        ))}
      </div>

      {tab === 'commands' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {volumeCommands.map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: '#f8f9fa', borderRadius: '6px', alignItems: 'center' }}>
              <code style={{ color: '#1565c0' }}>{c.cmd}</code>
              <span style={{ color: '#666', fontSize: '0.85rem' }}>{c.desc}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'examples' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {volumeExamples.map((ex, i) => (
            <div key={i} style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '3px solid #1976d2' }}>
              <strong>{ex.title}</strong>
              <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.75rem', borderRadius: '4px', margin: '0.5rem 0', fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>
                {ex.cmd}
              </pre>
              <small style={{ color: '#666' }}>💡 {ex.note}</small>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#e8f5e9', borderRadius: '8px' }}>
        <strong>Преимущества именованных томов:</strong>
        <ul style={{ margin: '0.5rem 0 0 0' }}>
          <li>Docker управляет хранением — портируемость между ОС</li>
          <li>Предзаполнение данными из образа</li>
          <li>Поддержка удалённых драйверов (NFS, AWS EBS)</li>
          <li>Легко найти и переиспользовать по имени</li>
        </ul>
      </div>
    </div>
  )
}

// ========================================
// Задание 4.2: Bind Mounts — Решение
// ========================================

const bindExamples = [
  {
    title: 'Разработка с hot-reload',
    cmd: `docker run -d \\
  -v $(pwd)/src:/app/src \\
  -v $(pwd)/package.json:/app/package.json \\
  -p 3000:3000 \\
  node:20 npm run dev`,
    desc: 'Код с хоста монтируется в контейнер. Изменения мгновенно видны.',
  },
  {
    title: 'Монтирование конфигурации (read-only)',
    cmd: `docker run -d \\
  -v ./nginx.conf:/etc/nginx/nginx.conf:ro \\
  -p 80:80 \\
  nginx`,
    desc: 'Конфигурация доступна контейнеру только для чтения (:ro).',
  },
  {
    title: 'Проблема с node_modules',
    cmd: `# ❌ node_modules с хоста перекроют установленные в образе
docker run -v $(pwd):/app node:20 npm start

# ✅ Анонимный том защищает node_modules
docker run -v $(pwd):/app -v /app/node_modules node:20 npm start`,
    desc: 'Анонимный том для node_modules предотвращает конфликт.',
  },
]

export function Task4_2_Solution() {
  const [selected, setSelected] = useState(0)

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Bind Mounts</h3>

      <div style={{ marginBottom: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Синтаксис</th>
              <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Пример</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>-v</code> (короткий)</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>-v $(pwd):/app</code></td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>--mount</code> (полный)</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>--mount type=bind,source=$(pwd),target=/app</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {bindExamples.map((ex, i) => (
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
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem', whiteSpace: 'pre-wrap', margin: '0 0 0.5rem 0' }}>
          {bindExamples[selected].cmd}
        </pre>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>{bindExamples[selected].desc}</p>
      </div>

      <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fce4ec', borderRadius: '8px' }}>
        <strong>⚠️ Bind mount перекрывает содержимое контейнера!</strong>
        <br />
        <small>Если в образе по пути /app есть файлы, а вы монтируете пустую директорию, файлы образа станут невидимы.</small>
      </div>
    </div>
  )
}

// ========================================
// Задание 4.3: tmpfs и readonly — Решение
// ========================================

export function Task4_3_Solution() {
  const [section, setSection] = useState<'tmpfs' | 'readonly' | 'combined'>('tmpfs')

  return (
    <div style={{ padding: '1rem' }}>
      <h3>tmpfs и Read-only</h3>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {([
          { key: 'tmpfs' as const, label: 'tmpfs' },
          { key: 'readonly' as const, label: 'Read-only' },
          { key: 'combined' as const, label: 'Комбинация' },
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

      {section === 'tmpfs' && (
        <div>
          <p>tmpfs хранит данные <strong>только в RAM</strong>. Ничего не записывается на диск.</p>
          <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
{`# Простой tmpfs
docker run --tmpfs /app/tmp nginx

# С ограничением размера
docker run --mount type=tmpfs,target=/app/tmp,tmpfs-size=100m nginx`}
          </pre>
          <div style={{ marginTop: '0.75rem' }}>
            <strong>Когда использовать:</strong>
            <ul>
              <li>Секреты и токены — не оставляют следов на диске</li>
              <li>Временные файлы — кэш, сессии</li>
              <li>Высокая производительность — RAM быстрее SSD</li>
            </ul>
          </div>
        </div>
      )}

      {section === 'readonly' && (
        <div>
          <p>Флаг <code>--read-only</code> делает файловую систему контейнера недоступной для записи.</p>
          <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
{`# ❌ nginx не запустится — ему нужно писать PID и кэш
docker run --read-only nginx

# ✅ Добавим tmpfs для записи
docker run --read-only \\
  --tmpfs /var/cache/nginx \\
  --tmpfs /var/run \\
  --tmpfs /tmp \\
  nginx`}
          </pre>
          <div style={{ marginTop: '0.75rem' }}>
            <strong>Суффикс :ro для отдельных монтирований:</strong>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
{`docker run -v config:/etc/app/config:ro -v data:/app/data myapp`}
            </pre>
          </div>
        </div>
      )}

      {section === 'combined' && (
        <div>
          <p>Типичный production-сценарий — <strong>максимальная безопасность</strong>:</p>
          <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
{`docker run -d \\
  --name secure-app \\
  --read-only \\                        # ФС только для чтения
  --tmpfs /tmp:size=50m \\              # Временные файлы в RAM
  --tmpfs /var/run \\                   # PID-файлы в RAM
  -v app-data:/app/data \\              # Данные в именованном томе
  -v ./config.yml:/app/config.yml:ro \\ # Конфиг read-only
  myapp:1.0`}
          </pre>
          <div style={{ marginTop: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            <div style={{ padding: '0.5rem', background: '#e8f5e9', borderRadius: '6px', textAlign: 'center' }}>
              <strong>Volume</strong><br /><small>Постоянные данные</small>
            </div>
            <div style={{ padding: '0.5rem', background: '#fff3e0', borderRadius: '6px', textAlign: 'center' }}>
              <strong>tmpfs</strong><br /><small>Временные файлы</small>
            </div>
            <div style={{ padding: '0.5rem', background: '#e3f2fd', borderRadius: '6px', textAlign: 'center' }}>
              <strong>Bind :ro</strong><br /><small>Конфигурация</small>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
