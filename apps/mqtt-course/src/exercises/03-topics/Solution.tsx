import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 3.1: Иерархия топиков — Решение
// ============================================

interface TopicNode {
  name: string
  children?: TopicNode[]
  value?: string
  description?: string
}

const iotTopicTree: TopicNode = {
  name: 'home',
  children: [
    {
      name: 'living_room',
      children: [
        { name: 'temperature', value: '22.5', description: 'Температура в °C' },
        { name: 'humidity', value: '65', description: 'Влажность в %' },
        {
          name: 'light',
          children: [
            { name: 'state', value: 'ON', description: 'Вкл/Выкл' },
            { name: 'brightness', value: '75', description: 'Яркость 0-100' },
          ],
        },
        { name: 'motion', value: 'clear', description: 'Детектор движения' },
      ],
    },
    {
      name: 'kitchen',
      children: [
        { name: 'temperature', value: '24.1', description: 'Температура' },
        { name: 'smoke_alarm', value: 'normal', description: 'Датчик дыма' },
        { name: 'humidity', value: '70', description: 'Влажность' },
      ],
    },
    {
      name: 'bedroom',
      children: [
        { name: 'temperature', value: '20.8', description: 'Температура' },
        { name: 'humidity', value: '55', description: 'Влажность' },
        {
          name: 'light',
          children: [
            { name: 'state', value: 'OFF', description: 'Вкл/Выкл' },
          ],
        },
      ],
    },
  ],
}

interface TreeNodeProps {
  node: TopicNode
  path: string
  depth: number
  selectedPath: string | null
  onSelect: (path: string) => void
}

function TreeNodeComponent({ node, path, depth, selectedPath, onSelect }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(depth < 2)
  const fullPath = path ? `${path}/${node.name}` : node.name
  const isSelected = selectedPath === fullPath
  const hasChildren = node.children && node.children.length > 0

  return (
    <div style={{ marginLeft: depth * 16, fontFamily: 'monospace' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '4px 8px',
          borderRadius: 4,
          cursor: 'pointer',
          background: isSelected ? 'var(--color-accent, #3b82f6)' : 'transparent',
          color: isSelected ? 'white' : 'inherit',
          marginBottom: 2,
        }}
        onClick={() => {
          if (hasChildren) setExpanded(!expanded)
          onSelect(fullPath)
        }}
      >
        <span style={{ color: isSelected ? 'white' : '#6b7280', minWidth: 12 }}>
          {hasChildren ? (expanded ? '▼' : '▶') : '●'}
        </span>
        <span style={{ color: isSelected ? 'white' : '#3b82f6', fontWeight: 600 }}>
          {node.name}
        </span>
        {node.value && (
          <span style={{
            marginLeft: 8,
            padding: '1px 6px',
            background: isSelected ? 'rgba(255,255,255,0.2)' : '#f0fdf4',
            color: isSelected ? 'white' : '#16a34a',
            borderRadius: 4,
            fontSize: 12,
          }}>
            {node.value}
          </span>
        )}
        {node.description && (
          <span style={{ fontSize: 11, color: isSelected ? 'rgba(255,255,255,0.8)' : '#9ca3af' }}>
            — {node.description}
          </span>
        )}
      </div>
      {hasChildren && expanded && node.children!.map((child) => (
        <TreeNodeComponent
          key={child.name}
          node={child}
          path={fullPath}
          depth={depth + 1}
          selectedPath={selectedPath}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

export function Task3_1_Solution() {
  const { t } = useLanguage()
  const [selectedPath, setSelectedPath] = useState<string | null>('home/living_room/temperature')
  const [customTopic, setCustomTopic] = useState('')

  const exampleTopics = [
    'home/living_room/temperature',
    'home/kitchen/smoke_alarm',
    'home/bedroom/light/state',
    'home/+/temperature',
    'home/living_room/#',
    'home/#',
  ]

  return (
    <div className="exercise-container">
      <h2>{t('solution.level3.topicTitle')}</h2>
      <p style={{ color: '#6b7280', marginBottom: 16 }}>
        {t('solution.level3.topicDesc')}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <h3 style={{ marginBottom: 12, fontSize: 14, color: '#6b7280', textTransform: 'uppercase' }}>
            {t('solution.level3.topicTreeHeader')}
          </h3>
          <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: 16,
            background: '#fafafa',
          }}>
            <TreeNodeComponent
              node={iotTopicTree}
              path=""
              depth={0}
              selectedPath={selectedPath}
              onSelect={setSelectedPath}
            />
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: 12, fontSize: 14, color: '#6b7280', textTransform: 'uppercase' }}>
            {t('solution.level3.topicInfo')}
          </h3>

          {selectedPath && (
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{t('solution.level3.fullPath')}:</div>
              <code style={{
                display: 'block',
                padding: '8px 12px',
                background: '#1e1e2e',
                color: '#cdd6f4',
                borderRadius: 6,
                fontSize: 14,
                marginBottom: 12,
                wordBreak: 'break-all',
              }}>
                {selectedPath}
              </code>
              <div style={{ fontSize: 12, color: '#6b7280' }}>
                {t('solution.level3.hierarchyLevels')}: <strong>{selectedPath.split('/').length}</strong>
              </div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>
                {t('solution.level3.stringLength')}: <strong>{selectedPath.length} {t('solution.level3.bytes')}</strong>
              </div>
            </div>
          )}

          <h3 style={{ marginBottom: 8, fontSize: 14, color: '#6b7280', textTransform: 'uppercase' }}>
            {t('solution.level3.subExamples')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {exampleTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedPath(topic)}
                style={{
                  padding: '6px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 6,
                  background: selectedPath === topic ? '#3b82f6' : 'white',
                  color: selectedPath === topic ? 'white' : '#374151',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'monospace',
                  fontSize: 13,
                }}
              >
                {topic}
                {(topic.includes('+') || topic.includes('#')) && (
                  <span style={{
                    marginLeft: 8,
                    fontSize: 10,
                    padding: '1px 4px',
                    background: selectedPath === topic ? 'rgba(255,255,255,0.2)' : '#fef3c7',
                    color: selectedPath === topic ? 'white' : '#92400e',
                    borderRadius: 4,
                  }}>
                    {t('solution.level3.wildcard')}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{t('solution.level3.checkOwnTopic')}:</div>
            <input
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="home/room/sensor"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: 6,
                fontFamily: 'monospace',
                fontSize: 13,
                boxSizing: 'border-box',
              }}
            />
            {customTopic && (
              <div style={{ marginTop: 8, fontSize: 12 }}>
                <div>{t('solution.level3.levels')}: <strong>{customTopic.split('/').length}</strong></div>
                <div>{t('solution.level3.length')}: <strong>{customTopic.length} {t('solution.level3.bytes')}</strong></div>
                <div style={{ color: customTopic.startsWith('/') ? '#ef4444' : '#16a34a' }}>
                  {customTopic.startsWith('/') ? `⚠️ ${t('solution.level3.warningSlash')}` : `✅ ${t('solution.level3.correctStart')}`}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 3.2: Wildcards + и # — Решение
// ============================================

interface WildcardTestCase {
  pattern: string
  topic: string
  expected: boolean
}

function matchesMqttWildcard(pattern: string, topic: string): boolean {
  const patternParts = pattern.split('/')
  const topicParts = topic.split('/')

  for (let i = 0; i < patternParts.length; i++) {
    const p = patternParts[i]

    if (p === '#') {
      // # в конце совпадает со всем остальным
      return true
    }

    if (i >= topicParts.length) {
      return false
    }

    if (p !== '+' && p !== topicParts[i]) {
      return false
    }
  }

  return patternParts.length === topicParts.length
}

const testTopics = [
  'home/living_room/temperature',
  'home/kitchen/temperature',
  'home/bedroom/humidity',
  'home/living_room/light/state',
  'home/kitchen/light/brightness',
  'home/temperature',
  'office/room1/temperature',
  'home/living_room/light/rgb/r',
]

const presetPatterns = [
  { pattern: 'home/+/temperature', description: 'Температура в любой комнате' },
  { pattern: 'home/#', description: 'Всё из дома' },
  { pattern: 'home/+/light/#', description: 'Всё о свете в любой комнате' },
  { pattern: '#', description: 'Все топики (кроме $)' },
  { pattern: 'home/living_room/+', description: 'Прямые дети гостиной' },
  { pattern: '+/+/temperature', description: 'Температура на глубине 3' },
]

export function Task3_2_Solution() {
  const { t } = useLanguage()
  const [pattern, setPattern] = useState('home/+/temperature')
  const [customPattern, setCustomPattern] = useState('')

  const activePattern = customPattern || pattern

  const results = testTopics.map((topic) => ({
    topic,
    matches: matchesMqttWildcard(activePattern, topic),
  }))

  const matchCount = results.filter((r) => r.matches).length

  return (
    <div className="exercise-container">
      <h2>{t('solution.level3.wildcardTitle')}</h2>
      <p style={{ color: '#6b7280', marginBottom: 16 }}>
        {t('solution.level3.wildcardDesc')}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <h3 style={{ marginBottom: 12, fontSize: 14, color: '#6b7280', textTransform: 'uppercase' }}>
            {t('solution.level3.presetPatterns')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
            {presetPatterns.map(({ pattern: p, description }) => (
              <button
                key={p}
                onClick={() => { setPattern(p); setCustomPattern('') }}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 6,
                  background: pattern === p && !customPattern ? '#3b82f6' : 'white',
                  color: pattern === p && !customPattern ? 'white' : '#374151',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: 13,
                }}
              >
                <div style={{ fontFamily: 'monospace', fontWeight: 600 }}>{p}</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>{description}</div>
              </button>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{t('solution.level3.ownPattern')}:</div>
            <input
              value={customPattern}
              onChange={(e) => setCustomPattern(e.target.value)}
              placeholder="home/+/light/#"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: 6,
                fontFamily: 'monospace',
                fontSize: 13,
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginTop: 16, padding: 12, background: '#fffbeb', borderRadius: 8, fontSize: 13 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>{t('solution.level3.wildcardRules')}:</div>
            <div><code style={{ background: '#fef3c7', padding: '1px 4px', borderRadius: 3 }}>+</code> — {t('solution.level3.wildcardPlus')}</div>
            <div><code style={{ background: '#fef3c7', padding: '1px 4px', borderRadius: 3 }}>#</code> — {t('solution.level3.wildcardHash')}</div>
            <div style={{ marginTop: 8, color: '#92400e' }}>⚠️ {t('solution.level3.wildcardWarning')}</div>
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: 8, fontSize: 14, color: '#6b7280', textTransform: 'uppercase' }}>
            {t('solution.level3.resultsForPattern')}:
          </h3>
          <code style={{
            display: 'block',
            padding: '8px 12px',
            background: '#1e1e2e',
            color: '#cdd6f4',
            borderRadius: 6,
            marginBottom: 12,
            fontSize: 14,
          }}>
            {activePattern || `(${t('solution.level3.enterPattern')})`}
          </code>

          <div style={{
            fontSize: 12,
            color: '#6b7280',
            marginBottom: 8,
          }}>
            {t('solution.level3.matchesCount')}: <strong style={{ color: matchCount > 0 ? '#16a34a' : '#9ca3af' }}>{matchCount}</strong> {t('solution.level3.from')} {testTopics.length}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {results.map(({ topic, matches }) => (
              <div
                key={topic}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 10px',
                  borderRadius: 6,
                  background: matches ? '#f0fdf4' : '#fafafa',
                  border: `1px solid ${matches ? '#bbf7d0' : '#e5e7eb'}`,
                  fontFamily: 'monospace',
                  fontSize: 13,
                }}
              >
                <span style={{ fontSize: 16 }}>{matches ? '✅' : '❌'}</span>
                <span style={{ color: matches ? '#166534' : '#6b7280' }}>{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 3.3: Системные топики $SYS — Решение
// ============================================

interface SysTopicEntry {
  topic: string
  example: string
  description: string
  category: string
}

const sysTopics: SysTopicEntry[] = [
  // Брокер
  { category: 'Брокер', topic: '$SYS/broker/version', example: 'mosquitto version 2.0.18', description: 'Версия Mosquitto' },
  { category: 'Брокер', topic: '$SYS/broker/uptime', example: '3600 seconds', description: 'Время работы брокера' },
  { category: 'Брокер', topic: '$SYS/broker/timestamp', example: '2024-01-15 10:00:00+0000', description: 'Дата сборки' },
  // Клиенты
  { category: 'Клиенты', topic: '$SYS/broker/clients/connected', example: '42', description: 'Текущее число подключений' },
  { category: 'Клиенты', topic: '$SYS/broker/clients/disconnected', example: '5', description: 'Отключённые с persistence' },
  { category: 'Клиенты', topic: '$SYS/broker/clients/maximum', example: '128', description: 'Максимум за всё время' },
  { category: 'Клиенты', topic: '$SYS/broker/clients/total', example: '1024', description: 'Всего подключалось' },
  // Сообщения
  { category: 'Сообщения', topic: '$SYS/broker/messages/sent', example: '100500', description: 'Отправлено сообщений' },
  { category: 'Сообщения', topic: '$SYS/broker/messages/received', example: '98200', description: 'Получено сообщений' },
  { category: 'Сообщения', topic: '$SYS/broker/messages/dropped', example: '0', description: 'Отброшено (переполнение)' },
  { category: 'Сообщения', topic: '$SYS/broker/messages/stored', example: '15', description: 'В retained + очередях' },
  { category: 'Сообщения', topic: '$SYS/broker/publish/messages/sent', example: '95000', description: 'Только PUBLISH sent' },
  { category: 'Сообщения', topic: '$SYS/broker/publish/messages/received', example: '90000', description: 'Только PUBLISH received' },
  // Трафик
  { category: 'Трафик', topic: '$SYS/broker/bytes/sent', example: '2048576', description: 'Байт отправлено' },
  { category: 'Трафик', topic: '$SYS/broker/bytes/received', example: '1920000', description: 'Байт получено' },
  // Нагрузка
  { category: 'Нагрузка', topic: '$SYS/broker/load/connections/1min', example: '3.50', description: 'Подключений/мин (1 мин)' },
  { category: 'Нагрузка', topic: '$SYS/broker/load/connections/5min', example: '2.80', description: 'Подключений/мин (5 мин)' },
  { category: 'Нагрузка', topic: '$SYS/broker/load/messages/sent/1min', example: '25.30', description: 'Сообщений/сек (1 мин)' },
  { category: 'Нагрузка', topic: '$SYS/broker/load/bytes/sent/1min', example: '1024.5', description: 'Байт/сек (1 мин)' },
  // Подписки
  { category: 'Подписки', topic: '$SYS/broker/subscriptions/count', example: '187', description: 'Активных подписок' },
  // Хранилище
  { category: 'Хранилище', topic: '$SYS/broker/store/messages/count', example: '15', description: 'Сообщений в persistence' },
  { category: 'Хранилище', topic: '$SYS/broker/store/messages/bytes', example: '4096', description: 'Байт в persistence DB' },
]

const categories = Array.from(new Set(sysTopics.map((t) => t.category)))

export function Task3_3_Solution() {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState<string>('все')
  const [search, setSearch] = useState('')
  const [copiedTopic, setCopiedTopic] = useState<string | null>(null)

  const filtered = sysTopics.filter((entry) => {
    const matchesCategory = activeCategory === 'все' || entry.category === activeCategory
    const matchesSearch = !search ||
      entry.topic.toLowerCase().includes(search.toLowerCase()) ||
      entry.description.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleCopy = (topic: string) => {
    const cmd = `mosquitto_sub -t '${topic}'`
    navigator.clipboard?.writeText(cmd)
    setCopiedTopic(topic)
    setTimeout(() => setCopiedTopic(null), 2000)
  }

  return (
    <div className="exercise-container">
      <h2>{t('solution.level3.sysTitle')}</h2>
      <p style={{ color: '#6b7280', marginBottom: 16 }}>
        {t('solution.level3.sysDesc')}
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {['все', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '4px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: 20,
              background: activeCategory === cat ? '#3b82f6' : 'white',
              color: activeCategory === cat ? 'white' : '#374151',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            {cat === 'все' ? t('solution.level3.all') : cat}
          </button>
        ))}
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t('solution.level3.searchTopicPlaceholder')}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #e5e7eb',
          borderRadius: 6,
          fontSize: 13,
          marginBottom: 12,
          boxSizing: 'border-box',
        }}
      />

      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
        {t('solution.level3.shown')} {filtered.length} {t('solution.level3.of')} {sysTopics.length} {t('solution.level3.topics')}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filtered.map((entry) => (
          <div
            key={entry.topic}
            onClick={() => handleCopy(entry.topic)}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr',
              gap: 8,
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              background: copiedTopic === entry.topic ? '#f0fdf4' : 'white',
              alignItems: 'center',
              transition: 'background 0.15s',
            }}
          >
            <div>
              <code style={{
                fontSize: 12,
                color: entry.topic.startsWith('$SYS/broker/load') ? '#7c3aed' :
                  entry.topic.startsWith('$SYS/broker/client') ? '#0369a1' :
                    entry.topic.startsWith('$SYS/broker/message') ? '#15803d' : '#b45309',
              }}>
                {entry.topic}
              </code>
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>{entry.description}</div>
            </div>
            <code style={{
              fontSize: 12,
              padding: '2px 6px',
              background: '#f3f4f6',
              borderRadius: 4,
              color: '#374151',
            }}>
              {entry.example}
            </code>
            <div style={{ fontSize: 11, textAlign: 'right', color: '#9ca3af' }}>
              {copiedTopic === entry.topic ? (
                <span style={{ color: '#16a34a' }}>✅ {t('solution.level3.copied')}!</span>
              ) : (
                <span>📋 {t('solution.level3.clickCopy')}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, padding: 12, background: '#fffbeb', borderRadius: 8, fontSize: 13 }}>
        <strong>{t('solution.level3.sysImportant')}</strong> <code>$SYS/#</code> {t('solution.level3.sysImportant2')} <code>#</code>. {t('solution.level3.sysQuote')}: <code>mosquitto_sub -t '$SYS/broker/uptime'</code>
      </div>
    </div>
  )
}
