import { useState } from 'react'

// ============================================
// Задание 5.2: ACL — списки контроля доступа
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

// TODO: Реализуйте парсер ACL файла
// Формат строк:
//   user <username>     — установить текущего пользователя
//   topic <access> <topic>  — правило для текущего пользователя (user=null если глобальное)
//   pattern <access> <topic> — правило с подстановкой %c/%u
//   # comment           — пропустить
//   пустая строка       — пропустить
// Возвращает массив AclRule
function parseAclFile(content: string): AclRule[] {
  const rules: AclRule[] = []
  // TODO: реализуйте парсер
  void content
  return rules
}

// TODO: Реализуйте функцию проверки совпадения паттерна MQTT с топиком
// Паттерн поддерживает + и # (аналог задания 3.2)
function topicMatchesPattern(pattern: string, topic: string): boolean {
  // TODO: реализуйте
  void pattern
  void topic
  return false
}

// TODO: Реализуйте проверку доступа по ACL правилам
// Алгоритм:
// 1. Пройтись по правилам по порядку
// 2. Для каждого правила проверить: применяется ли к пользователю (rule.user === null || rule.user === username)
// 3. Расширить %c → clientId, %u → username в topic паттерне
// 4. Проверить совпадение топика через topicMatchesPattern
// 5. Проверить тип доступа: action 'publish' = нужен 'write' или 'readwrite'
//    action 'subscribe' = нужен 'read' или 'readwrite'
// 6. При совпадении: если rule.access === 'deny' → запрещено, иначе → разрешено
// 7. Если ни одно правило не совпало → запрещено (matchedRule = null)
function checkAclAccess(
  rules: AclRule[],
  username: string,
  topic: string,
  action: 'subscribe' | 'publish',
  clientId: string
): AclCheckResult {
  // TODO: реализуйте
  void rules
  void clientId
  return {
    user: username,
    topic,
    action,
    allowed: false,
    matchedRule: null,
  }
}

// Начальный ACL файл для редактирования
const defaultAclContent = `# /etc/mosquitto/acl

# TODO: добавьте глобальное правило - читать $SYS/#

# TODO: добавьте пользователя admin с полным доступом

# TODO: добавьте пользователя sensor_kitchen
# - может писать в home/kitchen/#
# - может читать home/kitchen/cmd

# TODO: добавьте пользователя dashboard
# - может только читать home/#`

export function Task5_2() {
  const [aclContent, setAclContent] = useState(defaultAclContent)
  const [checkUser, setCheckUser] = useState('sensor_kitchen')
  const [checkTopic, setCheckTopic] = useState('home/kitchen/temp')
  const [checkAction, setCheckAction] = useState<'subscribe' | 'publish'>('publish')
  const [checkClientId, setCheckClientId] = useState('esp32-kitchen')
  const [checkResults, setCheckResults] = useState<AclCheckResult[]>([])

  // TODO: распарсите aclContent через parseAclFile
  const rules = parseAclFile(aclContent)

  const runCheck = () => {
    // TODO: вызовите checkAclAccess и добавьте результат в checkResults
    const result = checkAclAccess(rules, checkUser, checkTopic, checkAction, checkClientId)
    setCheckResults((prev) => [result, ...prev].slice(0, 10))
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.2: ACL — списки контроля доступа</h2>
      <p style={{ color: '#6b7280', marginBottom: 16 }}>
        Редактируйте ACL файл и проверяйте права доступа пользователей.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <h3 style={{ fontSize: 14, color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>
            /etc/mosquitto/acl (распознано правил: {rules.length})
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
              style={{ padding: '8px 16px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
            >
              Проверить доступ
            </button>
          </div>

          {/* TODO: отрендерите checkResults */}
          <h3 style={{ fontSize: 14, color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>
            Результаты ({checkResults.length})
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>{result.allowed ? '✅' : '❌'}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
                  {result.user} → {result.action} → {result.topic}
                </span>
              </div>
              {/* TODO: покажите matchedRule или сообщение "правило не найдено" */}
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                {result.matchedRule ?? 'Правило не найдено → запрещено по умолчанию'}
              </div>
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
