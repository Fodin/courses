import { useState } from 'react'

// ============================================
// Задание 5.1: Файл паролей (password_file) — Решение
// ============================================

interface MqttUser {
  username: string
  passwordHash: string
  createdAt: string
  roles: string[]
}

function hashPassword(password: string): string {
  // Симуляция PBKDF2-SHA512 хеша
  const salt = Math.random().toString(36).substring(2, 10)
  return `$7$101$${salt}$${btoa(password + salt).substring(0, 43)}`
}

function generateMosquittoPasswdCommands(users: MqttUser[]): string {
  const lines: string[] = [
    '# Создание файла паролей для Mosquitto',
    '# Выполнять на роутере OpenWRT',
    '',
  ]
  users.forEach((user, idx) => {
    if (idx === 0) {
      lines.push(`# Создать файл и добавить первого пользователя`)
      lines.push(`mosquitto_passwd -c /etc/mosquitto/passwd ${user.username}`)
    } else {
      lines.push(`mosquitto_passwd /etc/mosquitto/passwd ${user.username}`)
    }
  })
  lines.push('')
  lines.push('# Применить изменения без перезапуска:')
  lines.push('kill -HUP $(pgrep mosquitto)')
  return lines.join('\n')
}

const roleColors: Record<string, string> = {
  admin: '#7c3aed',
  sensor: '#0369a1',
  dashboard: '#15803d',
  automation: '#c2410c',
  bridge: '#6b7280',
}

export function Task5_1_Solution() {
  const [users, setUsers] = useState<MqttUser[]>([
    { username: 'admin', passwordHash: hashPassword('admin123'), createdAt: '10:00:00', roles: ['admin'] },
    { username: 'sensor_kitchen', passwordHash: hashPassword('s3cr3t'), createdAt: '10:00:01', roles: ['sensor'] },
    { username: 'dashboard', passwordHash: hashPassword('viewonly'), createdAt: '10:00:02', roles: ['dashboard'] },
  ])

  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState('sensor')
  const [showPasswd, setShowPasswd] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [log, setLog] = useState<string[]>(['> Файл паролей создан. 3 пользователя.'])

  const now = () => new Date().toLocaleTimeString('ru')

  const addUser = () => {
    if (!newUsername.trim() || !newPassword.trim()) return
    if (users.find((u) => u.username === newUsername)) {
      setLog((prev) => [...prev, `> [${now()}] Ошибка: пользователь "${newUsername}" уже существует`])
      return
    }

    const user: MqttUser = {
      username: newUsername,
      passwordHash: hashPassword(newPassword),
      createdAt: now(),
      roles: [newRole],
    }
    setUsers((prev) => [...prev, user])
    setLog((prev) => [...prev, `> [${now()}] Добавлен пользователь "${newUsername}" (роль: ${newRole})`])
    setNewUsername('')
    setNewPassword('')
  }

  const deleteUser = (username: string) => {
    setUsers((prev) => prev.filter((u) => u.username !== username))
    setLog((prev) => [...prev, `> [${now()}] Удалён пользователь "${username}"`])
  }

  const passwdFileContent = users.map((u) => `${u.username}:${u.passwordHash}`).join('\n')

  const mosquittoConf = `# /etc/mosquitto/mosquitto.conf

# Запретить анонимный доступ
allow_anonymous false

# Файл паролей
password_file /etc/mosquitto/passwd

# Список доступа (следующее задание)
# acl_file /etc/mosquitto/acl`

  return (
    <div className="exercise-container">
      <h2>Задание 5.1: Файл паролей (password_file)</h2>
      <p style={{ color: '#6b7280', marginBottom: 16 }}>
        Управление пользователями Mosquitto. Пароли хранятся в виде PBKDF2-SHA512 хешей.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <h3 style={{ fontSize: 14, color: '#6b7280', textTransform: 'uppercase', marginBottom: 12 }}>
            Пользователи ({users.length})
          </h3>

          {users.map((user) => (
            <div key={user.username} style={{
              padding: 12,
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              marginBottom: 8,
              background: 'white',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <strong style={{ fontSize: 14, fontFamily: 'monospace' }}>{user.username}</strong>
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      style={{
                        padding: '1px 8px',
                        borderRadius: 10,
                        background: roleColors[role] ?? '#6b7280',
                        color: 'white',
                        fontSize: 11,
                      }}
                    >
                      {role}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => deleteUser(user.username)}
                  style={{
                    padding: '2px 8px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 4,
                    color: '#dc2626',
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                >
                  Удалить
                </button>
              </div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, fontFamily: 'monospace' }}>
                {user.passwordHash.substring(0, 30)}...
              </div>
            </div>
          ))}

          <div style={{ marginTop: 16, padding: 12, background: '#f9fafb', borderRadius: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Добавить пользователя</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Имя пользователя"
                style={{ padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 13, fontFamily: 'monospace' }}
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Пароль"
                style={{ padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 13 }}
              />
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                style={{ padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 13 }}
              >
                <option value="sensor">sensor</option>
                <option value="dashboard">dashboard</option>
                <option value="automation">automation</option>
                <option value="bridge">bridge</option>
                <option value="admin">admin</option>
              </select>
              <button
                onClick={addUser}
                style={{
                  padding: '8px 16px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                mosquitto_passwd ... {newUsername || '<username>'}
              </button>
            </div>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button
              onClick={() => { setShowPasswd(!showPasswd); setShowConfig(false) }}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #e5e7eb',
                borderRadius: 6,
                background: showPasswd ? '#1e1e2e' : 'white',
                color: showPasswd ? '#a6e3a1' : '#374151',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              📄 /etc/mosquitto/passwd
            </button>
            <button
              onClick={() => { setShowConfig(!showConfig); setShowPasswd(false) }}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #e5e7eb',
                borderRadius: 6,
                background: showConfig ? '#1e1e2e' : 'white',
                color: showConfig ? '#a6e3a1' : '#374151',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              ⚙️ mosquitto.conf
            </button>
          </div>

          {showPasswd && (
            <pre style={{
              background: '#1e1e2e',
              color: '#cdd6f4',
              padding: 12,
              borderRadius: 8,
              fontSize: 11,
              fontFamily: 'monospace',
              overflowX: 'auto',
              marginBottom: 12,
            }}>
              {passwdFileContent}
            </pre>
          )}

          {showConfig && (
            <pre style={{
              background: '#1e1e2e',
              color: '#cdd6f4',
              padding: 12,
              borderRadius: 8,
              fontSize: 11,
              fontFamily: 'monospace',
              overflowX: 'auto',
              marginBottom: 12,
            }}>
              {mosquittoConf}
            </pre>
          )}

          <h3 style={{ fontSize: 14, color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>
            Shell команды для OpenWRT
          </h3>
          <button
            onClick={() => setShowPasswd(true)}
            style={{ marginBottom: 8, padding: '6px 12px', border: '1px solid #e5e7eb', borderRadius: 6, background: 'white', cursor: 'pointer', fontSize: 12 }}
          >
            Показать команды mosquitto_passwd
          </button>
          {showPasswd && (
            <pre style={{
              background: '#1e1e2e',
              color: '#a6e3a1',
              padding: 12,
              borderRadius: 8,
              fontSize: 11,
              fontFamily: 'monospace',
              marginBottom: 12,
            }}>
              {generateMosquittoPasswdCommands(users)}
            </pre>
          )}

          <h3 style={{ fontSize: 14, color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>
            Лог
          </h3>
          <div style={{
            background: '#1e1e2e',
            color: '#cdd6f4',
            padding: 10,
            borderRadius: 8,
            fontFamily: 'monospace',
            fontSize: 11,
            maxHeight: 150,
            overflowY: 'auto',
          }}>
            {log.map((line, i) => <div key={i}>{line}</div>)}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 5.2: ACL — списки контроля доступа — Решение
// ============================================

interface AclRule {
  user: string | null  // null = глобальное правило
  access: 'read' | 'write' | 'readwrite' | 'deny'
  topic: string
  isPattern: boolean
}

interface AclCheckResult {
  user: string
  topic: string
  action: 'subscribe' | 'publish'
  allowed: boolean
  matchedRule: string | null
}

function parseAclFile(content: string): AclRule[] {
  const rules: AclRule[] = []
  let currentUser: string | null = null

  content.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return

    if (trimmed.startsWith('user ')) {
      currentUser = trimmed.substring(5).trim()
    } else if (trimmed.startsWith('pattern ')) {
      const parts = trimmed.substring(8).split(' ')
      rules.push({
        user: null,
        access: parts[0] as AclRule['access'],
        topic: parts[1] ?? '',
        isPattern: true,
      })
    } else if (trimmed.startsWith('topic ')) {
      const parts = trimmed.substring(6).split(' ')
      if (parts.length === 2) {
        rules.push({
          user: currentUser,
          access: parts[0] as AclRule['access'],
          topic: parts[1] ?? '',
          isPattern: false,
        })
      } else {
        // topic <name> without access = readwrite
        rules.push({
          user: currentUser,
          access: 'readwrite',
          topic: parts[0] ?? '',
          isPattern: false,
        })
      }
    }
  })

  return rules
}

function checkAclAccess(
  rules: AclRule[],
  username: string,
  topic: string,
  action: 'subscribe' | 'publish',
  clientId: string
): AclCheckResult {
  const actionType = action === 'subscribe' ? 'read' : 'write'

  for (const rule of rules) {
    // Проверяем применимость правила
    const appliesToUser = rule.user === null || rule.user === username

    if (!appliesToUser) continue

    // Расширяем паттерн %c и %u
    const expandedTopic = rule.topic
      .replace('%c', clientId)
      .replace('%u', username)

    // Проверяем совпадение топика
    if (!topicMatchesPattern(expandedTopic, topic)) continue

    // Проверяем тип доступа
    const hasAccess = rule.access === 'readwrite' ||
      rule.access === actionType ||
      rule.access === 'deny'

    if (hasAccess) {
      const allowed = rule.access !== 'deny'
      return {
        user: username,
        topic,
        action,
        allowed,
        matchedRule: `${rule.user ?? '(global)'}: topic ${rule.access} ${rule.topic}`,
      }
    }
  }

  return {
    user: username,
    topic,
    action,
    allowed: false,
    matchedRule: null,
  }
}

function topicMatchesPattern(pattern: string, topic: string): boolean {
  const pParts = pattern.split('/')
  const tParts = topic.split('/')

  for (let i = 0; i < pParts.length; i++) {
    if (pParts[i] === '#') return true
    if (i >= tParts.length) return false
    if (pParts[i] !== '+' && pParts[i] !== tParts[i]) return false
  }

  return pParts.length === tParts.length
}

const defaultAclContent = `# /etc/mosquitto/acl

# Глобально — статистику брокера могут читать все
topic read $SYS/#

# Администратор — полный доступ
user admin
topic readwrite #

# Датчик кухни
user sensor_kitchen
topic write home/kitchen/#
topic read home/kitchen/cmd

# Дашборд — только чтение
user dashboard
topic read home/#
topic read $SYS/broker/clients/connected

# Паттерн: каждый клиент только в своё пространство
pattern write devices/%c/data
pattern read devices/%c/cmd`

export function Task5_2_Solution() {
  const [aclContent, setAclContent] = useState(defaultAclContent)
  const [checkUser, setCheckUser] = useState('sensor_kitchen')
  const [checkTopic, setCheckTopic] = useState('home/kitchen/temp')
  const [checkAction, setCheckAction] = useState<'subscribe' | 'publish'>('publish')
  const [checkClientId, setCheckClientId] = useState('esp32-kitchen')
  const [checkResults, setCheckResults] = useState<AclCheckResult[]>([])

  const rules = parseAclFile(aclContent)

  const runCheck = () => {
    const result = checkAclAccess(rules, checkUser, checkTopic, checkAction, checkClientId)
    setCheckResults((prev) => [result, ...prev].slice(0, 10))
  }

  const presetChecks = [
    { user: 'sensor_kitchen', topic: 'home/kitchen/temp', action: 'publish' as const, clientId: 'esp32-k', description: 'Сенсор пишет в свою зону' },
    { user: 'sensor_kitchen', topic: 'home/living/temp', action: 'publish' as const, clientId: 'esp32-k', description: 'Сенсор пишет в чужую зону' },
    { user: 'dashboard', topic: 'home/kitchen/temp', action: 'subscribe' as const, clientId: 'grafana', description: 'Дашборд читает все данные' },
    { user: 'dashboard', topic: 'home/kitchen/cmd', action: 'publish' as const, clientId: 'grafana', description: 'Дашборд пишет команду (запрещено)' },
    { user: 'admin', topic: 'device/relay/cmd', action: 'publish' as const, clientId: 'admin-pc', description: 'Админ управляет устройством' },
  ]

  return (
    <div className="exercise-container">
      <h2>Задание 5.2: ACL — списки контроля доступа</h2>
      <p style={{ color: '#6b7280', marginBottom: 16 }}>
        Редактируйте ACL файл и проверяйте права доступа пользователей к топикам.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <h3 style={{ fontSize: 14, color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>
            /etc/mosquitto/acl
          </h3>
          <textarea
            value={aclContent}
            onChange={(e) => setAclContent(e.target.value)}
            style={{
              width: '100%',
              height: 300,
              padding: 12,
              background: '#1e1e2e',
              color: '#cdd6f4',
              border: 'none',
              borderRadius: 8,
              fontFamily: 'monospace',
              fontSize: 12,
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />

          <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
            Распознано правил: <strong>{rules.length}</strong>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Примеры проверок:</div>
            {presetChecks.map((check, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCheckUser(check.user)
                  setCheckTopic(check.topic)
                  setCheckAction(check.action)
                  setCheckClientId(check.clientId)
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '4px 8px',
                  marginBottom: 3,
                  border: '1px solid #e5e7eb',
                  borderRadius: 4,
                  background: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: 12,
                }}
              >
                {check.description}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: 14, color: '#6b7280', textTransform: 'uppercase', marginBottom: 12 }}>
            Проверка доступа
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: '#6b7280' }}>Пользователь:</label>
              <input
                value={checkUser}
                onChange={(e) => setCheckUser(e.target.value)}
                style={{ width: '100%', padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: 6, fontFamily: 'monospace', fontSize: 13, boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#6b7280' }}>Client ID:</label>
              <input
                value={checkClientId}
                onChange={(e) => setCheckClientId(e.target.value)}
                style={{ width: '100%', padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: 6, fontFamily: 'monospace', fontSize: 13, boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#6b7280' }}>Топик:</label>
              <input
                value={checkTopic}
                onChange={(e) => setCheckTopic(e.target.value)}
                style={{ width: '100%', padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: 6, fontFamily: 'monospace', fontSize: 13, boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['publish', 'subscribe'] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setCheckAction(a)}
                  style={{
                    flex: 1,
                    padding: '6px',
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                    background: checkAction === a ? '#3b82f6' : 'white',
                    color: checkAction === a ? 'white' : '#374151',
                    cursor: 'pointer',
                    fontSize: 13,
                  }}
                >
                  {a}
                </button>
              ))}
            </div>
            <button
              onClick={runCheck}
              style={{
                padding: '8px 16px',
                background: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              Проверить доступ
            </button>
          </div>

          <h3 style={{ fontSize: 14, color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>
            Результаты проверки
          </h3>
          {checkResults.map((result, idx) => (
            <div
              key={idx}
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                marginBottom: 4,
                border: `1px solid ${result.allowed ? '#bbf7d0' : '#fecaca'}`,
                background: result.allowed ? '#f0fdf4' : '#fef2f2',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 16 }}>{result.allowed ? '✅' : '❌'}</span>
                <span style={{ fontWeight: 600, color: result.allowed ? '#166534' : '#991b1b' }}>
                  {result.allowed ? 'Разрешено' : 'Запрещено'}
                </span>
              </div>
              <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#374151' }}>
                {result.user} → {result.action} → <code>{result.topic}</code>
              </div>
              {result.matchedRule && (
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                  Правило: {result.matchedRule}
                </div>
              )}
              {!result.matchedRule && (
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                  Правило не найдено → запрещено по умолчанию
                </div>
              )}
            </div>
          ))}
          {checkResults.length === 0 && (
            <div style={{ color: '#9ca3af', fontSize: 13 }}>Нажмите «Проверить доступ»</div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 5.3: Плагины аутентификации — Решение
// ============================================

interface AuthPlugin {
  id: string
  name: string
  type: 'builtin' | 'thirdparty'
  description: string
  backends: string[]
  pros: string[]
  cons: string[]
  configExample: string
  openWrtSupport: 'full' | 'partial' | 'limited'
  openWrtNote: string
}

const authPlugins: AuthPlugin[] = [
  {
    id: 'passwd_file',
    name: 'Password File + ACL',
    type: 'builtin',
    description: 'Встроенный механизм Mosquitto. Файл паролей + файл ACL. Самое простое и лёгкое решение.',
    backends: ['passwd file', 'acl file'],
    pros: [
      'Нет зависимостей, встроен в Mosquitto',
      'Минимальное потребление RAM',
      'Работает на всех платформах',
      'Reload без перезапуска (SIGHUP)',
    ],
    cons: [
      'Статическая конфигурация',
      'Нет динамического управления',
      'Не масштабируется на тысячи пользователей',
    ],
    configExample: `# mosquitto.conf
allow_anonymous false
password_file /etc/mosquitto/passwd
acl_file /etc/mosquitto/acl`,
    openWrtSupport: 'full',
    openWrtNote: 'Полная поддержка. Рекомендуется для большинства установок на OpenWRT.',
  },
  {
    id: 'dynamic_security',
    name: 'Dynamic Security Plugin',
    type: 'builtin',
    description: 'Встроен в Mosquitto 2.x. Управление пользователями через MQTT без перезапуска. Поддерживает роли и группы.',
    backends: ['JSON config', 'MQTT control'],
    pros: [
      'Динамическое управление через MQTT',
      'Роли и группы пользователей',
      'Не требует перезапуска',
      'Встроен в Mosquitto 2.x',
    ],
    cons: [
      'Сложнее в начальной настройке',
      'Требует Mosquitto 2.x+',
      'Чуть больше overhead чем файлы',
    ],
    configExample: `# mosquitto.conf
plugin /usr/lib/mosquitto_dynamic_security.so
plugin_opt_config_file /etc/mosquitto/dynsec.json

# Инициализация:
# mosquitto_ctrl dynsec init dynsec.json admin adminpass`,
    openWrtSupport: 'full',
    openWrtNote: 'Поддерживается в opkg пакете mosquitto 2.x для OpenWRT 23.x.',
  },
  {
    id: 'go_auth',
    name: 'mosquitto-go-auth',
    type: 'thirdparty',
    description: 'Сторонний плагин (Go). Поддерживает PostgreSQL, MySQL, Redis, JWT, HTTP API, gRPC. Для крупных установок.',
    backends: ['PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'HTTP API', 'JWT', 'gRPC'],
    pros: [
      'Богатый выбор бэкендов',
      'JWT токены',
      'Интеграция с любым HTTP API',
      'Кэширование для производительности',
    ],
    cons: [
      'Требует компиляции или готового бинарника',
      'CGO — проблемы совместимости с musl',
      'Внешние зависимости (база данных)',
      'Большой размер бинарника',
    ],
    configExample: `# mosquitto.conf
plugin /usr/lib/mosquitto_go_auth.so
plugin_opt_backends http
plugin_opt_http_host localhost
plugin_opt_http_port 8080
plugin_opt_http_getuser_uri /auth/user
plugin_opt_http_aclcheck_uri /auth/acl`,
    openWrtSupport: 'limited',
    openWrtNote: 'Ограниченная поддержка. musl libc совместимость проблематична. Требует кросс-компиляции.',
  },
  {
    id: 'jwt_plugin',
    name: 'JWT Authentication',
    type: 'thirdparty',
    description: 'Аутентификация через JWT токены. Клиент передаёт токен как пароль, брокер проверяет подпись без обращения к базе.',
    backends: ['JWT RS256', 'JWT HS256'],
    pros: [
      'Stateless — не нужна база данных',
      'Токены содержат claims (роли, топики)',
      'Идеально для микросервисов',
    ],
    cons: [
      'Нет немедленного отзыва токенов',
      'Требует реализации выдачи токенов',
      'Нужна дополнительная библиотека',
    ],
    configExample: `# Через mosquitto-go-auth:
plugin_opt_backends jwt
plugin_opt_jwt_remote false
plugin_opt_jwt_secret your_hmac_secret
plugin_opt_jwt_userfield Username`,
    openWrtSupport: 'partial',
    openWrtNote: 'Через mosquitto-go-auth, если удастся скомпилировать под musl.',
  },
]

export function Task5_3_Solution() {
  const [selectedPlugin, setSelectedPlugin] = useState<string>('passwd_file')
  const [showConfig, setShowConfig] = useState(false)

  const plugin = authPlugins.find((p) => p.id === selectedPlugin)!

  const supportBadge = (support: AuthPlugin['openWrtSupport']) => {
    const config = {
      full: { label: 'Полная', color: '#16a34a', bg: '#f0fdf4' },
      partial: { label: 'Частичная', color: '#c2410c', bg: '#fff7ed' },
      limited: { label: 'Ограниченная', color: '#dc2626', bg: '#fef2f2' },
    }
    const c = config[support]
    return (
      <span style={{ padding: '2px 8px', borderRadius: 10, background: c.bg, color: c.color, fontSize: 12, fontWeight: 600 }}>
        OpenWRT: {c.label}
      </span>
    )
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.3: Плагины аутентификации</h2>
      <p style={{ color: '#6b7280', marginBottom: 16 }}>
        Обзор механизмов аутентификации для Mosquitto с оценкой совместимости с OpenWRT.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>
        <div>
          <h3 style={{ fontSize: 14, color: '#6b7280', textTransform: 'uppercase', marginBottom: 12 }}>
            Плагины
          </h3>
          {authPlugins.map((p) => (
            <button
              key={p.id}
              onClick={() => { setSelectedPlugin(p.id); setShowConfig(false) }}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px 12px',
                border: `2px solid ${selectedPlugin === p.id ? '#3b82f6' : '#e5e7eb'}`,
                borderRadius: 8,
                background: selectedPlugin === p.id ? '#eff6ff' : 'white',
                cursor: 'pointer',
                textAlign: 'left',
                marginBottom: 6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</span>
                <span style={{
                  fontSize: 10,
                  padding: '1px 6px',
                  borderRadius: 10,
                  background: p.type === 'builtin' ? '#eff6ff' : '#fef3c7',
                  color: p.type === 'builtin' ? '#1d4ed8' : '#92400e',
                }}>
                  {p.type === 'builtin' ? 'встроен' : 'сторонний'}
                </span>
              </div>
              <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                {p.backends.slice(0, 2).join(', ')}{p.backends.length > 2 ? '...' : ''}
              </div>
            </button>
          ))}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>{plugin.name}</h2>
            {supportBadge(plugin.openWrtSupport)}
          </div>

          <p style={{ color: '#374151', marginBottom: 16, fontSize: 14 }}>{plugin.description}</p>

          <div style={{ marginBottom: 12 }}>
            <strong style={{ fontSize: 13 }}>Бэкенды/источники данных:</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
              {plugin.backends.map((b) => (
                <span key={b} style={{ padding: '2px 8px', background: '#f3f4f6', borderRadius: 10, fontSize: 12 }}>{b}</span>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
              <div style={{ fontWeight: 600, color: '#15803d', marginBottom: 6, fontSize: 13 }}>Преимущества</div>
              {plugin.pros.map((p) => (
                <div key={p} style={{ fontSize: 12, color: '#166534', marginBottom: 3 }}>✅ {p}</div>
              ))}
            </div>
            <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
              <div style={{ fontWeight: 600, color: '#b91c1c', marginBottom: 6, fontSize: 13 }}>Недостатки</div>
              {plugin.cons.map((c) => (
                <div key={c} style={{ fontSize: 12, color: '#991b1b', marginBottom: 3 }}>⚠️ {c}</div>
              ))}
            </div>
          </div>

          <div style={{ padding: 10, background: '#fffbeb', borderRadius: 8, fontSize: 12, marginBottom: 12 }}>
            <strong>OpenWRT:</strong> {plugin.openWrtNote}
          </div>

          <button
            onClick={() => setShowConfig(!showConfig)}
            style={{
              padding: '8px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: 6,
              background: showConfig ? '#1e1e2e' : 'white',
              color: showConfig ? '#a6e3a1' : '#374151',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            {showConfig ? '▼ Скрыть конфигурацию' : '▶ Показать пример конфигурации'}
          </button>

          {showConfig && (
            <pre style={{
              background: '#1e1e2e',
              color: '#cdd6f4',
              padding: 12,
              borderRadius: 8,
              fontSize: 12,
              fontFamily: 'monospace',
              marginTop: 8,
              overflowX: 'auto',
            }}>
              {plugin.configExample}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}
