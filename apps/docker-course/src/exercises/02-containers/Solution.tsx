import { useState } from 'react'

// ========================================
// Задание 2.1: docker run — Решение
// ========================================

const runExamples = [
  {
    cmd: 'docker run ubuntu echo "Hello!"',
    desc: 'Запуск команды в контейнере Ubuntu (foreground)',
    steps: ['Поиск образа ubuntu локально', 'Скачивание из Docker Hub (если нет)', 'Создание контейнера', 'Выполнение echo "Hello!"', 'Контейнер завершается (exit 0)'],
  },
  {
    cmd: 'docker run -it ubuntu bash',
    desc: 'Интерактивная оболочка в Ubuntu',
    steps: ['Создание контейнера', 'Подключение stdin (-i) и TTY (-t)', 'Запуск bash', 'Вы внутри контейнера!'],
  },
  {
    cmd: 'docker run -d --name web -p 8080:80 nginx',
    desc: 'Запуск nginx в фоне с пробросом портов',
    steps: ['Создание контейнера с именем "web"', 'Проброс порта 8080 (хост) → 80 (контейнер)', 'Запуск в фоне (-d)', 'Nginx доступен на http://localhost:8080'],
  },
  {
    cmd: 'docker run --rm -e NODE_ENV=production node:20 node -e "console.log(process.env.NODE_ENV)"',
    desc: 'Одноразовый контейнер с переменной окружения',
    steps: ['Создание контейнера с NODE_ENV=production', 'Выполнение node-скрипта', 'Вывод: "production"', 'Автоудаление контейнера (--rm)'],
  },
]

export function Task2_1_Solution() {
  const [selected, setSelected] = useState(0)

  return (
    <div style={{ padding: '1rem' }}>
      <h3>docker run — примеры и объяснения</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
        {runExamples.map((ex, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            style={{
              padding: '0.5rem 1rem',
              textAlign: 'left',
              background: selected === i ? '#1976d2' : '#f5f5f5',
              color: selected === i ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
            }}
          >
            {ex.cmd}
          </button>
        ))}
      </div>

      <div style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px' }}>
        <div style={{ color: '#569cd6', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          $ {runExamples[selected].cmd}
        </div>
        <div style={{ color: '#9cdcfe', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {runExamples[selected].desc}
        </div>
        <div style={{ borderTop: '1px solid #444', paddingTop: '0.5rem' }}>
          <div style={{ color: '#6a9955', marginBottom: '0.5rem' }}>// Что происходит:</div>
          {runExamples[selected].steps.map((step, i) => (
            <div key={i} style={{ padding: '0.2rem 0', color: '#ce9178' }}>
              {i + 1}. {step}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff3e0', borderRadius: '8px', border: '1px solid #ffcc02' }}>
        <strong>💡 Формат:</strong>{' '}
        <code>docker run [ОПЦИИ] ОБРАЗ [КОМАНДА] [АРГУМЕНТЫ]</code>
        <br />
        Если КОМАНДА не указана, используется CMD/ENTRYPOINT из образа.
      </div>
    </div>
  )
}

// ========================================
// Задание 2.2: Флаги запуска — Решение
// ========================================

interface FlagInfo {
  flag: string
  short: string
  description: string
  example: string
  category: string
}

const flags: FlagInfo[] = [
  { flag: '-d, --detach', short: '-d', description: 'Запуск в фоне. Контейнер работает как демон.', example: 'docker run -d nginx', category: 'Режим' },
  { flag: '-i, --interactive', short: '-i', description: 'Держать stdin открытым.', example: 'docker run -i ubuntu cat', category: 'Режим' },
  { flag: '-t, --tty', short: '-t', description: 'Выделить псевдо-TTY (терминал).', example: 'docker run -it ubuntu bash', category: 'Режим' },
  { flag: '--rm', short: '--rm', description: 'Удалить контейнер после остановки.', example: 'docker run --rm alpine echo hi', category: 'Режим' },
  { flag: '--name', short: '--name', description: 'Задать имя контейнера.', example: 'docker run --name web nginx', category: 'Идентификация' },
  { flag: '-p, --publish', short: '-p', description: 'Проброс портов host:container.', example: 'docker run -p 8080:80 nginx', category: 'Сеть' },
  { flag: '--network', short: '--network', description: 'Подключить к указанной сети.', example: 'docker run --network mynet nginx', category: 'Сеть' },
  { flag: '-e, --env', short: '-e', description: 'Установить переменную окружения.', example: 'docker run -e DB_HOST=db myapp', category: 'Окружение' },
  { flag: '--env-file', short: '--env-file', description: 'Загрузить переменные из файла.', example: 'docker run --env-file .env myapp', category: 'Окружение' },
  { flag: '-v, --volume', short: '-v', description: 'Монтирование тома или директории.', example: 'docker run -v data:/app/data nginx', category: 'Данные' },
  { flag: '--memory', short: '--memory', description: 'Лимит оперативной памяти.', example: 'docker run --memory=512m nginx', category: 'Ресурсы' },
  { flag: '--cpus', short: '--cpus', description: 'Лимит CPU.', example: 'docker run --cpus=1.5 nginx', category: 'Ресурсы' },
  { flag: '--restart', short: '--restart', description: 'Политика перезапуска.', example: 'docker run --restart=unless-stopped nginx', category: 'Ресурсы' },
]

export function Task2_2_Solution() {
  const [filter, setFilter] = useState<string>('all')
  const categories = ['all', ...new Set(flags.map(f => f.category))]
  const filtered = filter === 'all' ? flags : flags.filter(f => f.category === filter)

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Флаги docker run</h3>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '0.3rem 0.8rem',
              background: filter === cat ? '#1976d2' : '#e0e0e0',
              color: filter === cat ? 'white' : '#333',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {cat === 'all' ? 'Все' : cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {filtered.map((f, i) => (
          <div key={i} style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '3px solid #1976d2' }}>
            <div style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#1976d2' }}>{f.flag}</div>
            <div style={{ margin: '0.3rem 0', fontSize: '0.9rem' }}>{f.description}</div>
            <code style={{ fontSize: '0.8rem', background: '#e8e8e8', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
              {f.example}
            </code>
          </div>
        ))}
      </div>
    </div>
  )
}

// ========================================
// Задание 2.3: Жизненный цикл — Решение
// ========================================

interface LifecycleState {
  name: string
  color: string
  commands: string[]
  description: string
}

const states: LifecycleState[] = [
  { name: 'Created', color: '#9e9e9e', commands: ['docker create'], description: 'Контейнер создан, но не запущен. Ресурсы выделены, но процесс не стартовал.' },
  { name: 'Running', color: '#4caf50', commands: ['docker start', 'docker run'], description: 'Главный процесс (PID 1) работает. Контейнер потребляет ресурсы.' },
  { name: 'Paused', color: '#ff9800', commands: ['docker pause'], description: 'Процессы заморожены через cgroup freezer. Память сохраняется, CPU не используется.' },
  { name: 'Exited', color: '#f44336', commands: ['docker stop', 'docker kill', 'процесс завершился'], description: 'Процесс завершён. Файловая система и метаданные сохранены. Можно перезапустить.' },
  { name: 'Removed', color: '#000000', commands: ['docker rm'], description: 'Контейнер полностью удалён. Writable layer стёрт. Восстановление невозможно.' },
]

export function Task2_3_Solution() {
  const [active, setActive] = useState(1)

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Жизненный цикл контейнера</h3>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {states.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setActive(i)}
              style={{
                padding: '0.5rem 1rem',
                background: active === i ? s.color : '#f5f5f5',
                color: active === i ? 'white' : s.color,
                border: `2px solid ${s.color}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              {s.name}
            </button>
            {i < states.length - 1 && <span style={{ fontSize: '1.2rem' }}>→</span>}
          </div>
        ))}
      </div>

      <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: `4px solid ${states[active].color}` }}>
        <h4 style={{ color: states[active].color, marginTop: 0 }}>{states[active].name}</h4>
        <p>{states[active].description}</p>
        <div>
          <strong>Команды для перехода в это состояние:</strong>
          <ul>
            {states[active].commands.map((cmd, i) => (
              <li key={i}><code>{cmd}</code></li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <h4>Основные команды управления</h4>
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', overflow: 'auto', fontSize: '0.85rem' }}>
{`docker ps              # Запущенные контейнеры
docker ps -a           # Все контейнеры
docker start <name>    # Запустить остановленный
docker stop <name>     # Остановить (SIGTERM → SIGKILL)
docker kill <name>     # Убить (SIGKILL)
docker restart <name>  # Перезапуск
docker rm <name>       # Удалить остановленный
docker rm -f <name>    # Удалить принудительно
docker container prune # Удалить все остановленные`}
        </pre>
      </div>

      <div style={{ marginTop: '1rem', padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
        <strong>⚠️ SIGTERM vs SIGKILL:</strong>
        <br />
        <code>docker stop</code> → SIGTERM (корректное завершение) → 10 сек → SIGKILL
        <br />
        <code>docker kill</code> → SIGKILL (немедленно, без очистки)
      </div>
    </div>
  )
}

// ========================================
// Задание 2.4: docker exec — Решение
// ========================================

const execExamples = [
  { cmd: 'docker exec my-app ls /app', desc: 'Просмотр файлов приложения', category: 'Файлы' },
  { cmd: 'docker exec -it my-app bash', desc: 'Интерактивная оболочка (bash)', category: 'Оболочка' },
  { cmd: 'docker exec -it my-app sh', desc: 'Интерактивная оболочка (sh, для Alpine)', category: 'Оболочка' },
  { cmd: 'docker exec my-app env', desc: 'Просмотр переменных окружения', category: 'Отладка' },
  { cmd: 'docker exec my-app cat /etc/hosts', desc: 'Проверка DNS-записей', category: 'Сеть' },
  { cmd: 'docker exec my-app curl -s localhost:3000/health', desc: 'Проверка health endpoint', category: 'Сеть' },
  { cmd: 'docker exec -u root my-app apt-get update', desc: 'Выполнение от root', category: 'Администрирование' },
  { cmd: 'docker exec -w /app/src my-app ls', desc: 'Выполнение в определённой директории', category: 'Файлы' },
  { cmd: 'docker exec -e DEBUG=1 my-app node script.js', desc: 'Запуск с доп. переменной окружения', category: 'Отладка' },
  { cmd: 'docker exec -it my-postgres psql -U postgres', desc: 'Подключение к PostgreSQL', category: 'БД' },
]

export function Task2_4_Solution() {
  const [filter, setFilter] = useState('all')
  const categories = ['all', ...new Set(execExamples.map(e => e.category))]
  const filtered = filter === 'all' ? execExamples : execExamples.filter(e => e.category === filter)

  return (
    <div style={{ padding: '1rem' }}>
      <h3>docker exec — выполнение команд в контейнере</h3>

      <div style={{ padding: '0.75rem', background: '#e8f5e9', borderRadius: '8px', marginBottom: '1rem' }}>
        <strong>Синтаксис:</strong>{' '}
        <code>docker exec [ОПЦИИ] КОНТЕЙНЕР КОМАНДА [АРГУМЕНТЫ]</code>
        <br />
        <small>Ключевые флаги: <code>-it</code> (интерактивный), <code>-u</code> (пользователь), <code>-w</code> (рабочая директория), <code>-e</code> (переменная окружения)</small>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '0.25rem 0.6rem',
              background: filter === cat ? '#2e7d32' : '#e0e0e0',
              color: filter === cat ? 'white' : '#333',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '0.8rem',
            }}
          >
            {cat === 'all' ? 'Все' : cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {filtered.map((ex, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: '#f8f9fa', borderRadius: '6px' }}>
            <code style={{ fontSize: '0.82rem', color: '#1b5e20' }}>{ex.cmd}</code>
            <span style={{ fontSize: '0.82rem', color: '#666', marginLeft: '1rem', textAlign: 'right' }}>{ex.desc}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
        <strong>💡 Совет:</strong> <code>docker exec</code> работает только с <strong>запущенными</strong> контейнерами.
        Для остановленного контейнера используйте <code>docker start</code> сначала, или <code>docker run --rm -it IMAGE sh</code> для одноразовой отладки.
      </div>
    </div>
  )
}
