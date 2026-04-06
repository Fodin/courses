import { useState } from 'react'
import { useLanguage } from '../../src/hooks'

// ============================================
// Задание 12.3: Чеклист безопасности MQTT
// ============================================
// Цель: реализовать интерактивный чеклист аудита безопасности.
//
// TODO:
// 1. Определите интерфейс ChecklistItem:
//    { id, category, title, description, severity: 'critical'|'high'|'medium'|'low', config? }
//
// 2. Создайте массив CHECKLIST с минимум 12 пунктами в 4 категориях:
//    - Аутентификация: allow_anonymous false, ACL, сложные пароли, уникальные учётные данные
//    - Шифрование: TLS включён, tls_version tlsv1.2, WSS вместо WS
//    - Сеть: порт 1883 закрыт от WAN, bind_address, rate limiting
//    - Ресурсы: max_connections, message_size_limit, memory_limit
//
// 3. Реализуйте:
//    - Чекбоксы для отметки выполненных пунктов
//    - Счётчик прогресса (выполнено X/Y критических, X/Y всего)
//    - Фильтр по severity
//    - Показ примера config при клике на пункт с config
//
// 4. На роутере: пройдите все пункты и исправьте найденные проблемы

interface ChecklistItem {
  id: string
  category: string
  title: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  config?: string
}

// TODO: Заполните массив пунктами чеклиста (минимум 12 пунктов):
const CHECKLIST: ChecklistItem[] = [
  // Пример одного пункта:
  {
    id: 'auth-1',
    category: 'Аутентификация',
    title: 'Отключён allow_anonymous',
    description: 'Анонимные подключения запрещены',
    severity: 'critical',
    config: 'allow_anonymous false',
  },
  // TODO: добавьте остальные 11+ пунктов
]

export function Task12_3() {
  const { t } = useLanguage()
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [filterSeverity, setFilterSeverity] = useState('Все')
  const [expandedConfig, setExpandedConfig] = useState<string | null>(null)

  const toggleCheck = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // TODO: Реализуйте фильтрацию по severity
  const filtered = CHECKLIST

  // TODO: Посчитайте прогресс:
  // - totalChecked: сколько выполнено из всех
  // - criticalChecked: сколько критических выполнено
  const totalChecked = checked.size
  const totalCritical = CHECKLIST.filter((i) => i.severity === 'critical').length
  const criticalChecked = CHECKLIST.filter((i) => i.severity === 'critical' && checked.has(i.id)).length

  return (
    <div className="exercise-container">
      <h2>{t('task.12.3')}</h2>

      {/* TODO: Добавьте панель прогресса */}
      <div style={{ background: '#2d2d2d', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>
        <span>Выполнено: <strong>{totalChecked}/{CHECKLIST.length}</strong></span>
        {' | '}
        <span>Критических: <strong style={{ color: criticalChecked === totalCritical ? '#44bb44' : '#ff4444' }}>
          {criticalChecked}/{totalCritical}
        </strong></span>
      </div>

      {/* TODO: Добавьте фильтр по severity: Все / critical / high / medium / low */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {['Все', 'critical', 'high', 'medium', 'low'].map((s) => (
          <button
            key={s}
            onClick={() => setFilterSeverity(s)}
            style={{ fontWeight: filterSeverity === s ? 'bold' : 'normal' }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* TODO: Отобразите пункты чеклиста сгруппированно по category */}
      <div>
        {filtered.length === 0 && (
          <p style={{ color: '#888' }}>Заполните массив CHECKLIST пунктами</p>
        )}
        {filtered.map((item) => (
          <div key={item.id} style={{ marginBottom: '0.5rem', padding: '0.5rem', borderBottom: '1px solid #333' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={checked.has(item.id)}
                onChange={() => toggleCheck(item.id)}
                style={{ marginTop: '0.15rem' }}
              />
              <div>
                <span style={{ textDecoration: checked.has(item.id) ? 'line-through' : 'none' }}>
                  {item.title}
                </span>
                {' '}
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#888' }}>
                  [{item.severity}]
                </span>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>{item.description}</div>
              </div>
            </label>
            {/* TODO: Добавьте кнопку показа config если item.config существует */}
            {item.config && (
              <button
                onClick={() => setExpandedConfig(expandedConfig === item.id ? null : item.id)}
                style={{ fontSize: '0.75rem', marginLeft: '1.5rem', marginTop: '0.25rem' }}
              >
                {expandedConfig === item.id ? 'скрыть' : 'показать config'}
              </button>
            )}
            {expandedConfig === item.id && item.config && (
              <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem', marginLeft: '1.5rem', marginTop: '0.25rem' }}>
                {item.config}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
