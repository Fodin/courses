// ============================================
// Level 1: Installation on OpenWRT — Solutions
// ============================================

import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Task 1.1: Installation via opkg
// ============================================

interface InstallStep {
  id: number
  command: string
  description: string
  output: string
  category: 'prepare' | 'install' | 'verify'
}

const installSteps: InstallStep[] = [
  {
    id: 1,
    command: 'opkg update',
    description: 'Обновить список пакетов из репозиториев',
    output: `Downloading https://downloads.openwrt.org/releases/23.05.3/packages/mipsel_24kc/base/Packages.gz
Updated list of available packages in /var/opkg-lists/openwrt_base
Downloading https://downloads.openwrt.org/releases/23.05.3/packages/mipsel_24kc/packages/Packages.gz
Updated list of available packages in /var/opkg-lists/openwrt_packages`,
    category: 'prepare',
  },
  {
    id: 2,
    command: 'opkg install mosquitto-nossl',
    description: 'Установить Mosquitto без TLS (облегчённая версия для роутеров)',
    output: `Installing mosquitto-nossl (2.0.18-1) to root...
Downloading https://downloads.openwrt.org/releases/23.05.3/packages/mipsel_24kc/packages/mosquitto-nossl_2.0.18-1_mipsel_24kc.ipk
Installing libmosquitto-nossl (2.0.18-1) to root...
Configuring libmosquitto-nossl.
Configuring mosquitto-nossl.`,
    category: 'install',
  },
  {
    id: 3,
    command: 'opkg install mosquitto-client-nossl',
    description: 'Установить CLI-клиент (mosquitto_pub и mosquitto_sub)',
    output: `Installing mosquitto-client-nossl (2.0.18-1) to root...
Downloading https://downloads.openwrt.org/releases/23.05.3/packages/mipsel_24kc/packages/mosquitto-client-nossl_2.0.18-1_mipsel_24kc.ipk
Configuring mosquitto-client-nossl.`,
    category: 'install',
  },
  {
    id: 4,
    command: '/etc/init.d/mosquitto enable',
    description: 'Включить автозапуск при загрузке системы',
    output: '',
    category: 'install',
  },
  {
    id: 5,
    command: '/etc/init.d/mosquitto start',
    description: 'Запустить брокер немедленно',
    output: '',
    category: 'install',
  },
  {
    id: 6,
    command: 'ps | grep mosquitto',
    description: 'Проверить, что процесс запущен',
    output: ' 1847 mosquit   1568 S /usr/sbin/mosquitto -c /etc/mosquitto/mosquitto.conf',
    category: 'verify',
  },
  {
    id: 7,
    command: 'netstat -tlnp | grep 1883',
    description: 'Убедиться, что брокер слушает порт 1883',
    output: 'tcp        0      0 0.0.0.0:1883            0.0.0.0:*               LISTEN      1847/mosquitto',
    category: 'verify',
  },
]

const categoryLabels: Record<InstallStep['category'], { label: string; color: string; bg: string }> =
  {
    prepare: { label: 'Подготовка', color: '#1565C0', bg: '#E3F2FD' },
    install: { label: 'Установка', color: '#6A1B9A', bg: '#F3E5F5' },
    verify: { label: 'Проверка', color: '#2E7D32', bg: '#E8F5E9' },
  }

export function Task1_1_Solution() {
  const { t } = useLanguage()
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [copied, setCopied] = useState<number | null>(null)

  const toggleStep = (id: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const copyCommand = (id: number, cmd: string) => {
    navigator.clipboard?.writeText(cmd).catch(() => {})
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }

  const progress = Math.round((completedSteps.size / installSteps.length) * 100)

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '820px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>{t('solution.level1.installTitle')}</h2>
      <p style={{ color: '#555', marginBottom: '1rem' }}>
        {t('solution.level1.installDesc')}
      </p>

      {/* Progress bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.85rem',
            marginBottom: '4px',
          }}
        >
          <span>{t('solution.level1.installProgress')}</span>
          <span style={{ fontWeight: 700, color: progress === 100 ? '#2E7D32' : '#1565C0' }}>
            {completedSteps.size}/{installSteps.length} ({progress}%)
          </span>
        </div>
        <div style={{ background: '#f0f0f0', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: progress === 100 ? '#2E7D32' : '#1565C0',
              transition: 'width 0.3s ease',
              borderRadius: '8px',
            }}
          />
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {installSteps.map(step => {
          const cat = categoryLabels[step.category]
          const done = completedSteps.has(step.id)
          const expanded = expandedStep === step.id

          return (
            <div
              key={step.id}
              style={{
                border: `1px solid ${done ? '#A5D6A7' : '#ddd'}`,
                borderRadius: '8px',
                background: done ? '#F1F8E9' : '#fff',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                }}
                onClick={() => setExpandedStep(expanded ? null : step.id)}
              >
                {/* Checkbox */}
                <div
                  onClick={e => {
                    e.stopPropagation()
                    toggleStep(step.id)
                  }}
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '4px',
                    border: `2px solid ${done ? '#4CAF50' : '#bbb'}`,
                    background: done ? '#4CAF50' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    cursor: 'pointer',
                  }}
                >
                  {done && <span style={{ color: '#fff', fontSize: '0.85rem', lineHeight: 1 }}>✓</span>}
                </div>

                {/* Step number */}
                <span
                  style={{
                    fontWeight: 700,
                    color: '#888',
                    fontSize: '0.85rem',
                    flexShrink: 0,
                    minWidth: '24px',
                  }}
                >
                  {step.id}.
                </span>

                {/* Command */}
                <code
                  style={{
                    flex: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    color: '#1a1a2e',
                    fontWeight: 600,
                  }}
                >
                  {step.command}
                </code>

                {/* Category badge */}
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: cat.bg,
                    color: cat.color,
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {cat.label}
                </span>

                {/* Copy button */}
                <button
                  onClick={e => {
                    e.stopPropagation()
                    copyCommand(step.id, step.command)
                  }}
                  style={{
                    padding: '4px 8px',
                    background: copied === step.id ? '#E8F5E9' : '#f5f5f5',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    flexShrink: 0,
                  }}
                >
                  {copied === step.id ? '✓' : '📋'}
                </button>

                <span style={{ color: '#aaa', fontSize: '0.8rem', flexShrink: 0 }}>
                  {expanded ? '▲' : '▼'}
                </span>
              </div>

              {expanded && (
                <div
                  style={{
                    borderTop: '1px solid #eee',
                    padding: '0.75rem 1rem',
                    background: '#fafafa',
                  }}
                >
                  <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: '0.5rem' }}>
                    {step.description}
                  </div>
                  {step.output && (
                    <pre
                      style={{
                        background: '#1a1a2e',
                        color: '#00ff88',
                        fontFamily: 'monospace',
                        fontSize: '0.78rem',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        margin: 0,
                        overflowX: 'auto',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {step.output}
                    </pre>
                  )}
                  {!step.output && (
                    <div style={{ fontSize: '0.82rem', color: '#999', fontStyle: 'italic' }}>
                      {t('solution.level1.noOutput')}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {progress === 100 && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#E8F5E9',
            border: '1px solid #A5D6A7',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
          <div style={{ fontWeight: 700, color: '#2E7D32' }}>{t('solution.level1.successTitle')}</div>
          <div style={{ fontSize: '0.85rem', color: '#555', marginTop: '0.25rem' }}>
            {t('solution.level1.successDesc')}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 1.2: Mosquitto file structure
// ============================================

interface FileNode {
  name: string
  path: string
  type: 'file' | 'dir'
  size?: string
  description: string
  content?: string
  important?: boolean
}

const fileStructure: FileNode[] = [
  {
    name: '/etc/mosquitto/',
    path: '/etc/mosquitto',
    type: 'dir',
    description: 'Главная директория конфигурации Mosquitto',
    important: true,
  },
  {
    name: 'mosquitto.conf',
    path: '/etc/mosquitto/mosquitto.conf',
    type: 'file',
    size: '~4 KB',
    description: 'Главный файл конфигурации. Всё поведение брокера настраивается здесь.',
    content: `# Main configuration file
# Generated by OpenWRT package

pid_file /var/run/mosquitto.pid
persistence false
log_dest syslog
log_type error
log_type warning
log_type notice
log_type information

listener 1883
protocol mqtt`,
    important: true,
  },
  {
    name: 'passwd',
    path: '/etc/mosquitto/passwd',
    type: 'file',
    size: 'varies',
    description: 'База паролей пользователей (создаётся командой mosquitto_passwd)',
    content: `# Format: username:hashed_password
admin:$7$101$xxxxx$hashed...
sensor01:$7$101$yyyyy$hashed...`,
  },
  {
    name: 'acl',
    path: '/etc/mosquitto/acl',
    type: 'file',
    size: 'varies',
    description: 'Список контроля доступа (Access Control List) к топикам',
    content: `# ACL file
user admin
topic readwrite #

user sensor01
topic write home/sensor/#
topic read home/sensor/sensor01/config`,
  },
  {
    name: '/usr/sbin/mosquitto',
    path: '/usr/sbin/mosquitto',
    type: 'file',
    size: '~250 KB',
    description: 'Исполняемый файл брокера',
    important: true,
  },
  {
    name: 'mosquitto_pub',
    path: '/usr/bin/mosquitto_pub',
    type: 'file',
    size: '~80 KB',
    description: 'Утилита публикации сообщений из командной строки',
    content: `# Usage:
mosquitto_pub -h localhost -p 1883 -t "home/sensor/temp" -m "23.5"
mosquitto_pub -h localhost -u user -P pass -t "topic" -m "payload" -q 1`,
  },
  {
    name: 'mosquitto_sub',
    path: '/usr/bin/mosquitto_sub',
    type: 'file',
    size: '~80 KB',
    description: 'Утилита подписки на топики из командной строки',
    content: `# Usage:
mosquitto_sub -h localhost -p 1883 -t "home/#" -v
mosquitto_sub -h localhost -u user -P pass -t "home/+" -v -d`,
  },
  {
    name: '/var/run/mosquitto.pid',
    path: '/var/run/mosquitto.pid',
    type: 'file',
    size: '<10 байт',
    description: 'PID-файл брокера. Создаётся автоматически при запуске.',
    content: '1847',
  },
  {
    name: '/var/lib/mosquitto/',
    path: '/var/lib/mosquitto',
    type: 'dir',
    description: 'Директория для persistence-данных (retained messages, QoS-очереди)',
  },
  {
    name: 'mosquitto.db',
    path: '/var/lib/mosquitto/mosquitto.db',
    type: 'file',
    size: 'varies',
    description: 'База данных persistence (SQLite-подобный формат). Создаётся при включённом persistence.',
  },
]

export function Task1_2_Solution() {
  const { t } = useLanguage()
  const [selected, setSelected] = useState<FileNode | null>(null)

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>{t('solution.level1.fileStructTitle')}</h2>
      <p style={{ color: '#555', marginBottom: '1.5rem' }}>
        {t('solution.level1.fileStructDesc')}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '1.5rem' }}>
        {/* File tree */}
        <div>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.9rem', color: '#666', textTransform: 'uppercase' }}>
            {t('solution.level1.fileSystem')}
          </h3>
          <div
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '0.75rem',
              background: '#1a1a2e',
            }}
          >
            {fileStructure.map(node => (
              <div
                key={node.path}
                onClick={() => setSelected(node)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '5px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: selected?.path === node.path ? '#2a2a4e' : 'transparent',
                  marginBottom: '2px',
                  paddingLeft: node.path.includes('/mosquitto/') && !node.path.endsWith('/mosquitto') ? '24px' : (node.path.startsWith('/var/lib/mosquitto/') ? '24px' : '8px'),
                }}
              >
                <span style={{ fontSize: '0.9rem' }}>{node.type === 'dir' ? '📁' : '📄'}</span>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.82rem',
                    color: node.important ? '#FFD700' : '#ccc',
                    fontWeight: node.important ? 700 : 400,
                  }}
                >
                  {node.name}
                </span>
                {node.size && (
                  <span style={{ fontSize: '0.7rem', color: '#666', marginLeft: 'auto' }}>
                    {node.size}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.9rem', color: '#666', textTransform: 'uppercase' }}>
            {t('solution.level1.description')}
          </h3>
          {selected ? (
            <div>
              <div
                style={{
                  padding: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  background: '#fafafa',
                }}
              >
                <div style={{ fontFamily: 'monospace', fontWeight: 700, marginBottom: '0.5rem', color: '#6A1B9A' }}>
                  {selected.path}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#333', lineHeight: 1.6 }}>
                  {selected.description}
                </div>
                {selected.important && (
                  <div
                    style={{
                      marginTop: '0.5rem',
                      padding: '4px 10px',
                      background: '#FFF9C4',
                      borderRadius: '4px',
                      fontSize: '0.78rem',
                      color: '#F57F17',
                    }}
                  >
                    {t('solution.level1.importantFile')}
                  </div>
                )}
              </div>
              {selected.content && (
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '4px' }}>
                    {t('solution.level1.contentExample')}:
                  </div>
                  <pre
                    style={{
                      background: '#1a1a2e',
                      color: '#00ff88',
                      fontFamily: 'monospace',
                      fontSize: '0.78rem',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      margin: 0,
                      overflowX: 'auto',
                      whiteSpace: 'pre-wrap',
                      maxHeight: '250px',
                      overflowY: 'auto',
                    }}
                  >
                    {selected.content}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                padding: '2rem',
                border: '2px dashed #ddd',
                borderRadius: '8px',
                textAlign: 'center',
                color: '#aaa',
                fontSize: '0.9rem',
              }}
            >
              {t('solution.level1.selectFile')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 1.3: First start and verification
// ============================================

interface VerifyCommand {
  id: string
  title: string
  command: string
  description: string
  expectedOutput: string
  category: 'status' | 'publish' | 'subscribe' | 'debug'
}

const verifyCommands: VerifyCommand[] = [
  {
    id: 'status',
    title: 'Статус сервиса',
    command: '/etc/init.d/mosquitto status',
    description: 'Проверить, что сервис запущен и работает',
    expectedOutput: `mosquitto is running`,
    category: 'status',
  },
  {
    id: 'pid',
    title: 'PID процесса',
    command: 'cat /var/run/mosquitto.pid',
    description: 'Показать PID рабочего процесса брокера',
    expectedOutput: `1847`,
    category: 'status',
  },
  {
    id: 'port',
    title: 'Порт 1883',
    command: 'netstat -tlnp | grep 1883',
    description: 'Убедиться, что брокер слушает MQTT порт',
    expectedOutput: `tcp   0   0 0.0.0.0:1883   0.0.0.0:*   LISTEN   1847/mosquitto`,
    category: 'status',
  },
  {
    id: 'subscribe',
    title: 'Подписка на тест-топик',
    command: 'mosquitto_sub -h 127.0.0.1 -t "test/#" -v &',
    description: 'Запустить подписчика в фоне (будет ждать сообщений)',
    expectedOutput: `[Ожидание сообщений в фоне, PID: 2101]`,
    category: 'subscribe',
  },
  {
    id: 'publish',
    title: 'Публикация тест-сообщения',
    command: 'mosquitto_pub -h 127.0.0.1 -t "test/hello" -m "Hello OpenWRT!"',
    description: 'Отправить тестовое сообщение брокеру',
    expectedOutput: `[подписчик получит: test/hello Hello OpenWRT!]`,
    category: 'publish',
  },
  {
    id: 'sys',
    title: 'Системные метрики',
    command: 'mosquitto_sub -h 127.0.0.1 -t "$SYS/#" -C 5',
    description: 'Получить 5 системных сообщений о состоянии брокера',
    expectedOutput: `$SYS/broker/version mosquitto version 2.0.18
$SYS/broker/uptime 142 seconds
$SYS/broker/clients/connected 1
$SYS/broker/messages/received 3
$SYS/broker/messages/sent 3`,
    category: 'debug',
  },
  {
    id: 'log',
    title: 'Просмотр логов',
    command: 'logread | grep mosquitto | tail -20',
    description: 'Показать последние 20 строк из системного журнала Mosquitto',
    expectedOutput: `Apr  7 12:05:23 OpenWrt daemon.notice mosquitto[1847]: mosquitto version 2.0.18 starting
Apr  7 12:05:23 OpenWrt daemon.notice mosquitto[1847]: Config loaded from /etc/mosquitto/mosquitto.conf
Apr  7 12:05:23 OpenWrt daemon.notice mosquitto[1847]: Opening ipv4 listen socket on port 1883.
Apr  7 12:05:23 OpenWrt daemon.notice mosquitto[1847]: Opening ipv6 listen socket on port 1883.
Apr  7 12:05:23 OpenWrt daemon.notice mosquitto[1847]: mosquitto version 2.0.18 running`,
    category: 'debug',
  },
]

const categoryConfig: Record<VerifyCommand['category'], { label: string; color: string; bg: string; icon: string }> = {
  status: { label: 'Статус', color: '#1565C0', bg: '#E3F2FD', icon: '🔍' },
  subscribe: { label: 'Подписка', color: '#6A1B9A', bg: '#F3E5F5', icon: '👂' },
  publish: { label: 'Публикация', color: '#E65100', bg: '#FFF3E0', icon: '📤' },
  debug: { label: 'Отладка', color: '#2E7D32', bg: '#E8F5E9', icon: '🐛' },
}

export function Task1_3_Solution() {
  const { t } = useLanguage()
  const [runOutput, setRunOutput] = useState<Record<string, string>>({})
  const [runningId, setRunningId] = useState<string | null>(null)

  const runCommand = (cmd: VerifyCommand) => {
    setRunningId(cmd.id)
    setTimeout(() => {
      setRunOutput(prev => ({ ...prev, [cmd.id]: cmd.expectedOutput }))
      setRunningId(null)
    }, 600)
  }

  const categoryGroups = ['status', 'subscribe', 'publish', 'debug'] as const

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '820px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>{t('solution.level1.firstStartTitle')}</h2>
      <p style={{ color: '#555', marginBottom: '1.5rem' }}>
        {t('solution.level1.firstStartDesc')}
      </p>

      {categoryGroups.map(cat => {
        const cmds = verifyCommands.filter(c => c.category === cat)
        const cfg = categoryConfig[cat]
        return (
          <div key={cat} style={{ marginBottom: '1.5rem' }}>
            <h3
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem',
                color: cfg.color,
                fontSize: '1rem',
              }}
            >
              <span>{cfg.icon}</span>
              <span>{cfg.label}</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {cmds.map(cmd => (
                <div
                  key={cmd.id}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      background: '#fafafa',
                    }}
                  >
                    <code
                      style={{
                        flex: 1,
                        fontFamily: 'monospace',
                        fontSize: '0.88rem',
                        color: '#1a1a2e',
                        fontWeight: 600,
                      }}
                    >
                      {cmd.command}
                    </code>
                    <button
                      onClick={() => runCommand(cmd)}
                      disabled={runningId === cmd.id}
                      style={{
                        padding: '0.4rem 0.9rem',
                        background: runOutput[cmd.id] ? '#E8F5E9' : cfg.bg,
                        color: cfg.color,
                        border: `1px solid ${cfg.color}`,
                        borderRadius: '6px',
                        cursor: runningId === cmd.id ? 'wait' : 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {runningId === cmd.id ? '...' : runOutput[cmd.id] ? `✓ ${t('solution.level1.running')}` : `▶ ${t('solution.level1.run')}`}
                    </button>
                  </div>
                  <div style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', color: '#666', borderTop: '1px solid #f0f0f0' }}>
                    {cmd.description}
                  </div>
                  {runOutput[cmd.id] && (
                    <pre
                      style={{
                        background: '#1a1a2e',
                        color: '#00ff88',
                        fontFamily: 'monospace',
                        fontSize: '0.78rem',
                        padding: '0.75rem 1rem',
                        margin: 0,
                        overflowX: 'auto',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {runOutput[cmd.id]}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
