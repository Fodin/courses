import { useState } from 'react'

// ============================================
// Задание 5.1: Файл паролей (password_file)
// ============================================

// TODO: Опишите структуру пользователя MQTT
// Поля: username, passwordHash (хешированный пароль), createdAt, roles (массив)
interface MqttUser {
  username: string
  // TODO: добавьте поля
}

// TODO: Реализуйте функцию симуляции хеширования пароля
// В реальном Mosquitto используется PBKDF2-SHA512
// Формат хеша: $7$101$<salt>$<hash>
// В симуляции можно использовать btoa() или просто сгенерировать похожую строку
function hashPassword(password: string): string {
  // TODO: реализуйте симуляцию хеша
  return `$7$101$SALT$${password}`  // заглушка — замените на реальную симуляцию
}

// TODO: Реализуйте функцию генерации shell-команд mosquitto_passwd
// Первый пользователь: mosquitto_passwd -c /etc/mosquitto/passwd <username>
// Остальные: mosquitto_passwd /etc/mosquitto/passwd <username>
// В конце: kill -HUP $(pgrep mosquitto)
function generateMosquittoPasswdCommands(users: MqttUser[]): string {
  // TODO: реализуйте
  void users
  return '# TODO: сгенерируйте команды mosquitto_passwd'
}

export function Task5_1() {
  // TODO: Инициализируйте начальный список пользователей (3 штуки)
  // Включите роли: admin, sensor, dashboard
  const [users, setUsers] = useState<MqttUser[]>([
    // TODO: добавьте начальных пользователей
  ])

  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState('sensor')
  const [log, setLog] = useState<string[]>(['> Файл паролей создан.'])

  const now = () => new Date().toLocaleTimeString('ru')

  // TODO: Реализуйте функцию добавления пользователя
  // - Проверить, что username и password не пустые
  // - Проверить, что пользователь с таким именем не существует
  // - Хешировать пароль через hashPassword()
  // - Добавить в users список
  // - Добавить запись в log
  const addUser = () => {
    // TODO: реализуйте
    void setUsers
    void now
    void setLog
  }

  // TODO: Реализуйте удаление пользователя
  const deleteUser = (username: string) => {
    // TODO: реализуйте
    void username
  }

  // TODO: Сформируйте содержимое файла паролей
  // Формат: username:passwordHash (по одному на строку)
  const passwdFileContent = users.map((u) => `${u.username}:TODO`).join('\n')

  // TODO: Сформируйте пример mosquitto.conf с password_file и allow_anonymous false
  const mosquittoConf = `# TODO: добавьте конфигурацию`

  const [showPasswd, setShowPasswd] = useState(false)
  const [showConfig, setShowConfig] = useState(false)

  return (
    <div className="exercise-container">
      <h2>Задание 5.1: Файл паролей (password_file)</h2>
      <p style={{ color: '#6b7280', marginBottom: 16 }}>
        Управление пользователями Mosquitto. Пароли хранятся в виде хешей.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <h3 style={{ fontSize: 14, color: '#6b7280', textTransform: 'uppercase', marginBottom: 12 }}>
            Пользователи ({users.length})
          </h3>

          {/* TODO: отрендерите список пользователей с кнопкой удаления */}
          {users.map((user) => (
            <div key={user.username} style={{ padding: 12, borderRadius: 8, border: '1px solid #e5e7eb', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <strong style={{ fontFamily: 'monospace' }}>{user.username}</strong>
                <button onClick={() => deleteUser(user.username)} style={{ fontSize: 12, padding: '2px 8px', cursor: 'pointer' }}>
                  Удалить
                </button>
              </div>
              {/* TODO: покажите хеш пароля (первые 30 символов + ...) */}
            </div>
          ))}

          {/* Форма добавления пользователя */}
          <div style={{ marginTop: 16, padding: 12, background: '#f9fafb', borderRadius: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Добавить пользователя</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Имя пользователя"
                style={{ padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 13 }}
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
                <option value="admin">admin</option>
              </select>
              <button
                onClick={addUser}
                style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
              >
                mosquitto_passwd ... {newUsername || '&lt;username&gt;'}
              </button>
            </div>
          </div>
        </div>

        <div>
          {/* TODO: Кнопки для показа содержимого файла паролей и mosquitto.conf */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button
              onClick={() => setShowPasswd(!showPasswd)}
              style={{ flex: 1, padding: '8px', border: '1px solid #e5e7eb', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}
            >
              📄 /etc/mosquitto/passwd
            </button>
            <button
              onClick={() => setShowConfig(!showConfig)}
              style={{ flex: 1, padding: '8px', border: '1px solid #e5e7eb', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}
            >
              ⚙️ mosquitto.conf
            </button>
          </div>

          {showPasswd && (
            <pre style={{ background: '#1e1e2e', color: '#cdd6f4', padding: 12, borderRadius: 8, fontSize: 11, fontFamily: 'monospace', overflowX: 'auto', marginBottom: 12 }}>
              {passwdFileContent}
            </pre>
          )}

          {showConfig && (
            <pre style={{ background: '#1e1e2e', color: '#cdd6f4', padding: 12, borderRadius: 8, fontSize: 11, fontFamily: 'monospace', overflowX: 'auto', marginBottom: 12 }}>
              {mosquittoConf}
            </pre>
          )}

          {/* TODO: Кнопка для показа shell-команд mosquitto_passwd */}
          <div style={{ marginBottom: 8 }}>
            <button style={{ padding: '6px 12px', border: '1px solid #e5e7eb', borderRadius: 6, background: 'white', cursor: 'pointer', fontSize: 12 }}>
              Показать команды для OpenWRT
            </button>
          </div>

          {/* TODO: блок generateMosquittoPasswdCommands */}

          <h3 style={{ fontSize: 14, color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>Лог</h3>
          <div style={{ background: '#1e1e2e', color: '#cdd6f4', padding: 10, borderRadius: 8, fontFamily: 'monospace', fontSize: 11, maxHeight: 150, overflowY: 'auto' }}>
            {log.map((line, i) => <div key={i}>{line}</div>)}
          </div>
        </div>
      </div>
    </div>
  )
}
