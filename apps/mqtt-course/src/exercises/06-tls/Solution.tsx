import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 6.1: Генерация сертификатов — Решение
// ============================================

interface CertStep {
  id: string
  title: string
  command: string
  description: string
  output: string
  generates: string[]
}

const certSteps: CertStep[] = [
  {
    id: 'ca-key',
    title: '1. Генерация ключа CA',
    command: 'openssl genrsa -out ca.key 2048',
    description:
      'Создаём приватный ключ удостоверяющего центра (Certificate Authority). Длина 2048 бит — минимально допустимый стандарт безопасности.',
    output: 'Generating RSA private key, 2048 bit long modulus\n...+++++\n...+++++\ne is 65537 (0x10001)',
    generates: ['ca.key'],
  },
  {
    id: 'ca-cert',
    title: '2. Самоподписанный сертификат CA',
    command:
      'openssl req -new -x509 -days 3650 \\\n  -key ca.key \\\n  -out ca.crt \\\n  -subj "/CN=MQTT CA/O=HomeNetwork/C=RU"',
    description:
      'Создаём корневой сертификат CA, действительный 10 лет. Этому сертификату будут доверять все клиенты. Параметр -x509 означает, что сертификат самоподписан.',
    output: '',
    generates: ['ca.crt'],
  },
  {
    id: 'server-key',
    title: '3. Ключ и запрос сертификата сервера',
    command:
      'openssl genrsa -out server.key 2048\nopenssl req -new \\\n  -key server.key \\\n  -out server.csr \\\n  -subj "/CN=mqtt.home/O=HomeNetwork/C=RU"',
    description:
      'Генерируем приватный ключ сервера и Certificate Signing Request (CSR). CN (Common Name) должен совпадать с hostname брокера, иначе клиент отклонит соединение.',
    output: '',
    generates: ['server.key', 'server.csr'],
  },
  {
    id: 'server-cert',
    title: '4. Подписание сертификата сервера',
    command:
      'openssl x509 -req -days 3650 \\\n  -in server.csr \\\n  -CA ca.crt \\\n  -CAkey ca.key \\\n  -CAcreateserial \\\n  -out server.crt',
    description:
      'CA подписывает запрос, выдавая серверный сертификат. Флаг -CAcreateserial создаёт файл ca.srl с серийными номерами выданных сертификатов.',
    output:
      'Signature ok\nsubject=/CN=mqtt.home/O=HomeNetwork/C=RU\nGetting CA Private Key',
    generates: ['server.crt', 'ca.srl'],
  },
  {
    id: 'client-cert',
    title: '5. Клиентский сертификат (для mTLS)',
    command:
      'openssl genrsa -out client.key 2048\nopenssl req -new \\\n  -key client.key \\\n  -out client.csr \\\n  -subj "/CN=sensor-01/O=HomeNetwork/C=RU"\nopenssl x509 -req -days 3650 \\\n  -in client.csr \\\n  -CA ca.crt \\\n  -CAkey ca.key \\\n  -CAcreateserial \\\n  -out client.crt',
    description:
      'Аналогично серверному сертификату, но для клиента. CN станет именем пользователя при использовании use_identity_as_username true в Mosquitto.',
    output: 'Signature ok\nsubject=/CN=sensor-01/O=HomeNetwork/C=RU\nGetting CA Private Key',
    generates: ['client.key', 'client.csr', 'client.crt'],
  },
]

export function Task6_1_Solution() {
  const { t } = useLanguage()
  const [activeStep, setActiveStep] = useState<string | null>(null)
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)

  const allFiles = certSteps.flatMap((s) => s.generates)

  const handleCopy = (id: string, command: string) => {
    navigator.clipboard.writeText(command).catch(() => {})
    setCopiedCommand(id)
    setTimeout(() => setCopiedCommand(null), 2000)
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>{t('solution.level6.certGenTitle')}</h2>

      <div
        style={{
          padding: '1rem',
          background: '#e8f5e9',
          borderRadius: '8px',
          border: '1px solid #4caf50',
          marginBottom: '1.5rem',
        }}
      >
        <strong>{t('solution.level6.result')}:</strong> {t('solution.level6.resultDesc')}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
          {allFiles.map((f) => (
            <code
              key={f}
              style={{
                background: '#fff',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                border: '1px solid #4caf50',
                fontSize: '0.85rem',
              }}
            >
              {f}
            </code>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {certSteps.map((step) => {
          const isActive = activeStep === step.id
          return (
            <div
              key={step.id}
              style={{
                border: `1px solid ${isActive ? '#1976d2' : '#e0e0e0'}`,
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setActiveStep(isActive ? null : step.id)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: isActive ? '#e3f2fd' : '#fafafa',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{step.title}</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#666',
                    fontWeight: 'normal',
                    marginLeft: '1rem',
                  }}
                >
                  {t('solution.level6.creates')}: {step.generates.join(', ')}
                </span>
              </button>

              {isActive && (
                <div style={{ padding: '1rem', background: '#fff' }}>
                  <p style={{ margin: '0 0 0.75rem', color: '#555', lineHeight: 1.6 }}>
                    {step.description}
                  </p>

                  <div style={{ position: 'relative' }}>
                    <pre
                      style={{
                        background: '#1e1e1e',
                        color: '#d4d4d4',
                        padding: '1rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        lineHeight: 1.6,
                        overflowX: 'auto',
                        margin: '0 0 0.5rem',
                      }}
                    >
                      {step.command}
                    </pre>
                    <button
                      onClick={() => handleCopy(step.id, step.command)}
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        padding: '0.25rem 0.6rem',
                        background: copiedCommand === step.id ? '#4caf50' : '#555',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                      }}
                    >
                      {copiedCommand === step.id ? t('solution.level6.copied') : t('solution.level6.copy')}
                    </button>
                  </div>

                  {step.output && (
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.25rem' }}>
                        {t('solution.level6.commandOutput')}:
                      </div>
                      <pre
                        style={{
                          background: '#f5f5f5',
                          padding: '0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          color: '#555',
                          margin: 0,
                        }}
                      >
                        {step.output}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div
        style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#fff3e0',
          borderRadius: '8px',
          border: '1px solid #ff9800',
        }}
      >
        <strong>{t('solution.level6.openwrtPlacement')}:</strong>
        <pre
          style={{
            background: '#1e1e1e',
            color: '#d4d4d4',
            padding: '0.75rem',
            borderRadius: '6px',
            fontSize: '0.82rem',
            marginTop: '0.5rem',
          }}
        >
          {`mkdir -p /etc/mosquitto/certs
cp ca.crt server.crt server.key /etc/mosquitto/certs/
chmod 600 /etc/mosquitto/certs/server.key
chown mosquitto: /etc/mosquitto/certs/server.key`}
        </pre>
      </div>
    </div>
  )
}

// ============================================
// Задание 6.2: Настройка TLS в Mosquitto — Решение
// ============================================

interface TlsOption {
  key: string
  value: string
  description: string
  required: boolean
}

const tlsOptions: TlsOption[] = [
  { key: 'listener', value: '8883', description: 'Стандартный порт MQTT over TLS (аналог HTTPS → 443)', required: true },
  { key: 'cafile', value: '/etc/mosquitto/certs/ca.crt', description: 'Корневой сертификат CA для проверки клиентских сертификатов', required: true },
  { key: 'certfile', value: '/etc/mosquitto/certs/server.crt', description: 'Сертификат сервера, отправляется клиентам при handshake', required: true },
  { key: 'keyfile', value: '/etc/mosquitto/certs/server.key', description: 'Приватный ключ сервера, никогда не покидает сервер', required: true },
  { key: 'tls_version', value: 'tlsv1.2', description: 'Минимальная версия TLS. tlsv1.2 — стандарт безопасности, tlsv1.3 — рекомендуется для новых устройств', required: false },
  { key: 'ciphers', value: 'ECDHE-RSA-AES256-GCM-SHA384', description: 'Список допустимых шифров. Ограничивает использование слабых алгоритмов', required: false },
]

export function Task6_2_Solution() {
  const { t } = useLanguage()
  const [showAll, setShowAll] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<string | null>(null)

  const displayed = showAll ? tlsOptions : tlsOptions.filter((o) => o.required)

  const configText = tlsOptions
    .filter((o) => o.required || showAll)
    .map((o) => `${o.key} ${o.value}`)
    .join('\n')

  const handleTest = () => {
    setTestResult(null)
    setTimeout(() => {
      setTestResult(
        'Connecting to mqtt.home:8883...\nTLS handshake OK (TLSv1.2, ECDHE-RSA-AES256-GCM-SHA384)\nConnected successfully!'
      )
    }, 800)
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>{t('solution.level6.tlsConfigTitle')}</h2>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Left: options */}
        <div style={{ flex: '1', minWidth: '260px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <h3 style={{ margin: 0 }}>{t('solution.level6.configParams')}</h3>
            <label style={{ fontSize: '0.85rem', cursor: 'pointer', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={showAll}
                onChange={(e) => setShowAll(e.target.checked)}
                style={{ marginRight: '0.3rem' }}
              />
              {t('solution.level6.showAll')}
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {displayed.map((opt) => (
              <div
                key={opt.key}
                onClick={() => setSelectedOption(selectedOption === opt.key ? null : opt.key)}
                style={{
                  padding: '0.6rem 0.8rem',
                  border: `1px solid ${selectedOption === opt.key ? '#1976d2' : opt.required ? '#4caf50' : '#e0e0e0'}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: selectedOption === opt.key ? '#e3f2fd' : '#fafafa',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <code style={{ fontSize: '0.85rem', color: '#1976d2' }}>{opt.key}</code>
                  {opt.required && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        background: '#4caf50',
                        color: '#fff',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '3px',
                      }}
                    >
                      {t('solution.level6.required')}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#555', marginTop: '0.2rem' }}>
                  <code>{opt.value}</code>
                </div>
                {selectedOption === opt.key && (
                  <div
                    style={{
                      marginTop: '0.5rem',
                      fontSize: '0.82rem',
                      color: '#333',
                      lineHeight: 1.5,
                      borderTop: '1px solid #e0e0e0',
                      paddingTop: '0.5rem',
                    }}
                  >
                    {opt.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: config preview + test */}
        <div style={{ flex: '1', minWidth: '260px' }}>
          <h3 style={{ margin: '0 0 0.75rem' }}>mosquitto.conf</h3>
          <pre
            style={{
              background: '#1e1e1e',
              color: '#d4d4d4',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.83rem',
              lineHeight: 1.7,
              margin: '0 0 1rem',
            }}
          >
            {`# Основной listener (без TLS, только локально)\nlistener 1883 localhost\n\n# TLS listener\n`}
            {configText}
          </pre>

          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ margin: '0 0 0.5rem' }}>{t('solution.level6.connectionTest')}</h3>
            <pre
              style={{
                background: '#1e1e1e',
                color: '#90caf9',
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '0.82rem',
                margin: '0 0 0.5rem',
              }}
            >
              {`mosquitto_pub \\\n  --cafile /etc/mosquitto/certs/ca.crt \\\n  -h mqtt.home -p 8883 \\\n  -t test -m "hello TLS"`}
            </pre>
            <button
              onClick={handleTest}
              style={{
                padding: '0.5rem 1rem',
                background: '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              {t('solution.level6.simulateConnection')}
            </button>
            {testResult && (
              <pre
                style={{
                  background: '#e8f5e9',
                  color: '#2e7d32',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  marginTop: '0.5rem',
                }}
              >
                {testResult}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 6.3: Клиентские сертификаты (mTLS) — Решение
// ============================================

interface MtlsMode {
  id: string
  title: string
  config: string
  description: string
  useCases: string[]
  pros: string[]
  cons: string[]
}

const mtlsModes: MtlsMode[] = [
  {
    id: 'tls-only',
    title: 'TLS (только шифрование)',
    config: `listener 8883
cafile /etc/mosquitto/certs/ca.crt
certfile /etc/mosquitto/certs/server.crt
keyfile /etc/mosquitto/certs/server.key
require_certificate false`,
    description:
      'Сервер шифрует соединение, но не требует сертификат от клиента. Клиенты аутентифицируются через логин/пароль или без аутентификации.',
    useCases: ['Публичные MQTT-серверы', 'Устройства без возможности хранить сертификат'],
    pros: ['Простота настройки клиентов', 'Поддержка legacy-устройств'],
    cons: ['Слабее по безопасности', 'Пароли могут быть скомпрометированы'],
  },
  {
    id: 'mtls',
    title: 'mTLS (взаимная аутентификация)',
    config: `listener 8883
cafile /etc/mosquitto/certs/ca.crt
certfile /etc/mosquitto/certs/server.crt
keyfile /etc/mosquitto/certs/server.key
require_certificate true
use_identity_as_username true`,
    description:
      'Клиент обязан предъявить сертификат, подписанный нашим CA. CN из сертификата автоматически становится именем пользователя — пароль не нужен.',
    useCases: ['IoT-устройства с прошитыми сертификатами', 'Корпоративные сети', 'Высокий уровень безопасности'],
    pros: ['Наивысший уровень безопасности', 'Нет паролей для утечки', 'Автоматический username из CN'],
    cons: ['Сложнее управлять сертификатами', 'Устройства должны поддерживать TLS-клиент'],
  },
]

export function Task6_3_Solution() {
  const { t } = useLanguage()
  const [selectedMode, setSelectedMode] = useState<string>('tls-only')
  const [showClientCmd, setShowClientCmd] = useState(false)

  const mode = mtlsModes.find((m) => m.id === selectedMode)!

  const clientCommands: Record<string, string> = {
    'tls-only': `mosquitto_sub \\
  --cafile /etc/mosquitto/certs/ca.crt \\
  -h mqtt.home -p 8883 \\
  -u "user1" -P "password" \\
  -t "#"`,
    mtls: `mosquitto_sub \\
  --cafile /etc/mosquitto/certs/ca.crt \\
  --cert /etc/mosquitto/certs/client.crt \\
  --key /etc/mosquitto/certs/client.key \\
  -h mqtt.home -p 8883 \\
  -t "#"
# username = "sensor-01" (из CN сертификата)`,
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>{t('solution.level6.mtlsTitle')}</h2>

      <div
        style={{
          padding: '0.75rem 1rem',
          background: '#e3f2fd',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          lineHeight: 1.6,
        }}
      >
        <strong>{t('solution.level6.analogy')}:</strong> {t('solution.level6.analogyText')}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {mtlsModes.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedMode(m.id)}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: `2px solid ${selectedMode === m.id ? '#1976d2' : '#e0e0e0'}`,
              background: selectedMode === m.id ? '#e3f2fd' : '#fafafa',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.9rem',
            }}
          >
            {m.title}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '260px' }}>
          <h3 style={{ margin: '0 0 0.5rem' }}>{t('solution.level6.mosquittoConfig')}</h3>
          <pre
            style={{
              background: '#1e1e1e',
              color: '#d4d4d4',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.83rem',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {mode.config}
          </pre>
        </div>

        <div style={{ flex: '1', minWidth: '260px' }}>
          <p style={{ margin: '0 0 0.75rem', lineHeight: 1.6, color: '#333' }}>
            {mode.description}
          </p>

          <div style={{ marginBottom: '0.75rem' }}>
            <strong>{t('solution.level6.useCases')}:</strong>
            <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1.2rem' }}>
              {mode.useCases.map((u, i) => (
                <li key={i} style={{ fontSize: '0.88rem', marginBottom: '0.25rem' }}>
                  {u}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div
              style={{
                flex: 1,
                padding: '0.6rem',
                background: '#e8f5e9',
                borderRadius: '6px',
                border: '1px solid #4caf50',
              }}
            >
              <strong style={{ fontSize: '0.82rem' }}>{t('solution.level6.prosLabel')}:</strong>
              <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1.2rem' }}>
                {mode.pros.map((p, i) => (
                  <li key={i} style={{ fontSize: '0.82rem', marginBottom: '0.2rem' }}>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div
              style={{
                flex: 1,
                padding: '0.6rem',
                background: '#ffebee',
                borderRadius: '6px',
                border: '1px solid #ef9a9a',
              }}
            >
              <strong style={{ fontSize: '0.82rem' }}>{t('solution.level6.consLabel')}:</strong>
              <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1.2rem' }}>
                {mode.cons.map((c, i) => (
                  <li key={i} style={{ fontSize: '0.82rem', marginBottom: '0.2rem' }}>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <button
          onClick={() => setShowClientCmd(!showClientCmd)}
          style={{
            padding: '0.5rem 1rem',
            background: '#546e7a',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          {showClientCmd ? t('solution.level6.hideClientCmd') : t('solution.level6.showClientCmd')}
        </button>
        {showClientCmd && (
          <pre
            style={{
              background: '#1e1e1e',
              color: '#a5d6a7',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.83rem',
              marginTop: '0.5rem',
              lineHeight: 1.7,
            }}
          >
            {clientCommands[selectedMode]}
          </pre>
        )}
      </div>
    </div>
  )
}
