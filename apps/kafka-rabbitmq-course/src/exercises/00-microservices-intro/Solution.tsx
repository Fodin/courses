import { useState } from 'react'
import { useLanguage } from '../../hooks'

// ============================================
// Задание 0.1: Монолит vs микросервисы
// ============================================

interface MonolithModule {
  id: string
  label: string
  color: string
  separated: boolean
}

const INITIAL_MODULES: MonolithModule[] = [
  { id: 'users', label: 'Users', color: '#4f86f7', separated: false },
  { id: 'orders', label: 'Orders', color: '#f7844f', separated: false },
  { id: 'payments', label: 'Payments', color: '#4fbe7c', separated: false },
  { id: 'inventory', label: 'Inventory', color: '#f7d44f', separated: false },
  { id: 'notifications', label: 'Notifications', color: '#b34ff7', separated: false },
  { id: 'reports', label: 'Reports', color: '#f74fa0', separated: false },
]

export function Task0_1_Solution() {
  const { t } = useLanguage()
  const [modules, setModules] = useState<MonolithModule[]>(INITIAL_MODULES)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const separatedCount = modules.filter(m => m.separated).length
  const totalCount = modules.length
  const allSeparated = separatedCount === totalCount

  const handleModuleClick = (id: string) => {
    if (allSeparated) return
    setSelectedId(id)
    setTimeout(() => {
      setModules(prev =>
        prev.map(m => (m.id === id ? { ...m, separated: true } : m))
      )
      setSelectedId(null)
    }, 400)
  }

  const handleReset = () => {
    setModules(INITIAL_MODULES.map(m => ({ ...m, separated: false })))
    setSelectedId(null)
  }

  const monolithModules = modules.filter(m => !m.separated)
  const microservices = modules.filter(m => m.separated)

  return (
    <div className="exercise-container">
      <h2>{t('task.0.1')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Кликни на модуль внутри монолита, чтобы выделить его в отдельный микросервис.
        Наблюдай, как монолит постепенно распадается на независимые сервисы.
      </p>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Монолит */}
        <div style={{ flex: '0 0 auto' }}>
          <div style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#888',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem',
          }}>
            Монолит ({monolithModules.length} модулей)
          </div>
          <div style={{
            border: '3px solid #e53e3e',
            borderRadius: '12px',
            padding: '1rem',
            background: monolithModules.length === 0 ? '#f0fff4' : '#fff5f5',
            minWidth: '220px',
            minHeight: '160px',
            transition: 'all 0.4s ease',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            alignContent: 'flex-start',
          }}>
            {monolithModules.length === 0 ? (
              <div style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38a169',
                fontWeight: 600,
                fontSize: '0.9rem',
                padding: '2rem 0',
              }}>
                Монолит разобран!
              </div>
            ) : (
              monolithModules.map(mod => (
                <button
                  key={mod.id}
                  onClick={() => handleModuleClick(mod.id)}
                  style={{
                    background: selectedId === mod.id ? '#fff' : mod.color,
                    border: `2px solid ${mod.color}`,
                    borderRadius: '8px',
                    padding: '0.5rem 0.75rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    color: selectedId === mod.id ? mod.color : '#fff',
                    transform: selectedId === mod.id ? 'scale(0.92)' : 'scale(1)',
                    transition: 'all 0.25s ease',
                    outline: 'none',
                  }}
                >
                  {mod.label}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Стрелка */}
        {microservices.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '1.5rem',
            color: '#38a169',
            paddingTop: '2rem',
          }}>
            →
          </div>
        )}

        {/* Микросервисы */}
        {microservices.length > 0 && (
          <div style={{ flex: '1 1 auto' }}>
            <div style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#888',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem',
            }}>
              Микросервисы ({microservices.length})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {microservices.map(mod => (
                <div
                  key={mod.id}
                  style={{
                    border: `2px solid ${mod.color}`,
                    borderRadius: '10px',
                    padding: '0.6rem 1rem',
                    background: '#fff',
                    boxShadow: `0 2px 8px ${mod.color}40`,
                    animation: 'fadeIn 0.4s ease',
                  }}
                >
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: mod.color,
                    display: 'inline-block',
                    marginRight: '0.5rem',
                  }} />
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#333' }}>
                    {mod.label} Service
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Прогресс */}
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#666' }}>Декомпозиция</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            {separatedCount}/{totalCount}
          </span>
        </div>
        <div style={{
          height: '8px',
          background: '#eee',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${(separatedCount / totalCount) * 100}%`,
            background: 'linear-gradient(90deg, #4fbe7c, #38a169)',
            borderRadius: '4px',
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {allSeparated && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#f0fff4',
          borderRadius: '8px',
          border: '1px solid #68d391',
          color: '#276749',
        }}>
          <strong>Отлично!</strong> Монолит полностью декомпозирован на {totalCount} независимых
          микросервиса. Каждый может деплоиться, масштабироваться и падать независимо.
        </div>
      )}

      <div style={{ marginTop: '1rem' }}>
        <button
          onClick={handleReset}
          style={{
            padding: '0.5rem 1.25rem',
            background: '#e53e3e',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Сбросить (собрать монолит)
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

// ============================================
// Задание 0.2: Карта зависимостей сервисов
// ============================================

interface Service {
  id: string
  label: string
  x: number
  y: number
  color: string
  dependsOn: string[]
}

const SERVICES: Service[] = [
  { id: 'api-gateway', label: 'API Gateway', x: 200, y: 20, color: '#4f86f7', dependsOn: [] },
  { id: 'users', label: 'User Service', x: 50, y: 130, color: '#f7844f', dependsOn: ['api-gateway'] },
  { id: 'orders', label: 'Order Service', x: 200, y: 130, color: '#4fbe7c', dependsOn: ['api-gateway', 'users', 'inventory', 'payments'] },
  { id: 'payments', label: 'Payment Service', x: 360, y: 130, color: '#b34ff7', dependsOn: ['api-gateway', 'users'] },
  { id: 'inventory', label: 'Inventory Service', x: 50, y: 260, color: '#f7d44f', dependsOn: ['users'] },
  { id: 'notifications', label: 'Notification Service', x: 360, y: 260, color: '#f74fa0', dependsOn: ['users', 'orders', 'payments'] },
]

type ImpactLevel = 'selected' | 'depends-on' | 'depended-by' | 'affected' | 'none'

export function Task0_2_Solution() {
  const { t } = useLanguage()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const getServiceImpact = (serviceId: string): ImpactLevel => {
    if (!selectedId) return 'none'
    if (serviceId === selectedId) return 'selected'

    const selected = SERVICES.find(s => s.id === selectedId)!
    // Этот сервис зависит от выбранного
    const currentService = SERVICES.find(s => s.id === serviceId)!
    if (currentService.dependsOn.includes(selectedId)) return 'depends-on'
    // Выбранный сервис зависит от этого
    if (selected.dependsOn.includes(serviceId)) return 'depended-by'
    // Косвенно затронутые — те кто зависят от depends-on
    const directDependents = SERVICES.filter(s => s.dependsOn.includes(selectedId))
    if (directDependents.some(dep =>
      SERVICES.find(s => s.id === serviceId)?.dependsOn.includes(dep.id)
    )) return 'affected'

    return 'none'
  }

  const impactColors: Record<ImpactLevel, string> = {
    'selected': '#e53e3e',
    'depends-on': '#e53e3e',
    'depended-by': '#4f86f7',
    'affected': '#ed8936',
    'none': '#ddd',
  }

  const impactLabels: Record<ImpactLevel, string> = {
    'selected': 'Упавший сервис',
    'depends-on': 'Напрямую затронут',
    'depended-by': 'Зависимость упавшего',
    'affected': 'Косвенно затронут',
    'none': '',
  }

  const SVG_W = 500
  const SVG_H = 360

  const getNodeColor = (id: string) => {
    const impact = getServiceImpact(id)
    return selectedId ? impactColors[impact] : SERVICES.find(s => s.id === id)!.color
  }

  const isEdgeHighlighted = (from: Service, toId: string): boolean => {
    if (!selectedId) return false
    if (from.id === selectedId && from.dependsOn.includes(toId)) return true
    if (toId === selectedId) return true
    return false
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.0.2')}</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Кликни на сервис, чтобы увидеть его зависимости и <em>blast radius</em> — какие сервисы
        пострадают при его падении.
      </p>

      <svg
        width="100%"
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{ border: '1px solid #eee', borderRadius: '12px', background: '#fafafa', maxHeight: '360px' }}
      >
        {/* Рёбра */}
        {SERVICES.map(service =>
          service.dependsOn.map(depId => {
            const dep = SERVICES.find(s => s.id === depId)!
            const highlighted = isEdgeHighlighted(service, depId)
            return (
              <line
                key={`${service.id}-${depId}`}
                x1={service.x + 60}
                y1={service.y + 20}
                x2={dep.x + 60}
                y2={dep.y + 20}
                stroke={highlighted ? '#e53e3e' : '#ddd'}
                strokeWidth={highlighted ? 2.5 : 1.5}
                strokeDasharray={highlighted ? '0' : '4 3'}
                style={{ transition: 'all 0.3s ease' }}
              />
            )
          })
        )}

        {/* Узлы */}
        {SERVICES.map(service => {
          const impact = getServiceImpact(service.id)
          const color = getNodeColor(service.id)
          return (
            <g
              key={service.id}
              transform={`translate(${service.x}, ${service.y})`}
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedId(prev => prev === service.id ? null : service.id)}
            >
              <rect
                width={120}
                height={40}
                rx={8}
                fill={selectedId ? (impact === 'none' ? '#f5f5f5' : '#fff') : '#fff'}
                stroke={color}
                strokeWidth={selectedId && impact === 'selected' ? 3 : 2}
                style={{ transition: 'all 0.3s ease', filter: selectedId && impact === 'none' ? 'opacity(0.5)' : 'none' }}
              />
              <text
                x={60}
                y={24}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill={selectedId && impact === 'none' ? '#aaa' : '#333'}
                style={{ userSelect: 'none', transition: 'all 0.3s ease' }}
              >
                {service.label}
              </text>
              {selectedId && impact !== 'none' && (
                <circle cx={110} cy={8} r={6} fill={color} />
              )}
            </g>
          )
        })}
      </svg>

      {/* Легенда */}
      {selectedId && (
        <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {(Object.entries(impactLabels) as [ImpactLevel, string][])
            .filter(([, label]) => label)
            .map(([level, label]) => (
              <div key={level} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: impactColors[level],
                }} />
                <span style={{ fontSize: '0.8rem', color: '#555' }}>{label}</span>
              </div>
            ))}
        </div>
      )}

      {selectedId && (() => {
        const selected = SERVICES.find(s => s.id === selectedId)!
        const directlyAffected = SERVICES.filter(s => s.dependsOn.includes(selectedId))
        return (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#fff5f5',
            borderRadius: '8px',
            border: '1px solid #fc8181',
          }}>
            <strong style={{ color: '#c53030' }}>
              Blast radius: {selected.label} упал
            </strong>
            <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem', color: '#744210' }}>
              {directlyAffected.length === 0
                ? <li>Нет зависимых сервисов — изолированное падение</li>
                : directlyAffected.map(s => (
                    <li key={s.id}>{s.label} — напрямую зависит и перестанет работать</li>
                  ))}
            </ul>
          </div>
        )
      })()}

      {!selectedId && (
        <p style={{ marginTop: '0.75rem', color: '#999', fontSize: '0.85rem' }}>
          Кликни на любой сервис для анализа зависимостей
        </p>
      )}
    </div>
  )
}

// ============================================
// Задание 0.3: Калькулятор trade-offs
// ============================================

interface Criterion {
  id: string
  label: string
  description: string
  value: number // 1 = strongly monolith, 5 = strongly microservices
  monoScore: (v: number) => number
  microScore: (v: number) => number
}

const CRITERIA: Criterion[] = [
  {
    id: 'team-size',
    label: 'Размер команды',
    description: '1 = маленькая (1-5 чел.), 5 = большая (50+ чел.)',
    value: 2,
    monoScore: v => Math.max(0, 6 - v),
    microScore: v => v,
  },
  {
    id: 'deploy-freq',
    label: 'Частота деплоев',
    description: '1 = раз в квартал, 5 = несколько раз в день',
    value: 2,
    monoScore: v => Math.max(0, 5 - v + 1),
    microScore: v => v,
  },
  {
    id: 'fault-isolation',
    label: 'Критичность изоляции отказов',
    description: '1 = весь сайт — один контекст, 5 = нужна полная изоляция',
    value: 2,
    monoScore: v => Math.max(0, 6 - v),
    microScore: v => v,
  },
  {
    id: 'scalability',
    label: 'Потребность в масштабировании',
    description: '1 = нагрузка равномерна, 5 = разные компоненты масштабируются по-разному',
    value: 2,
    monoScore: v => Math.max(0, 6 - v),
    microScore: v => v,
  },
  {
    id: 'tech-diversity',
    label: 'Технологическое разнообразие',
    description: '1 = один стек, 5 = нужны разные языки и БД',
    value: 1,
    monoScore: v => Math.max(0, 6 - v),
    microScore: v => v,
  },
  {
    id: 'project-age',
    label: 'Стадия проекта',
    description: '1 = MVP / стартап, 5 = зрелый продукт с устоявшимися доменами',
    value: 1,
    monoScore: v => Math.max(0, 6 - v),
    microScore: v => v,
  },
  {
    id: 'infra-maturity',
    label: 'Зрелость инфраструктуры',
    description: '1 = нет DevOps, 5 = Kubernetes, CI/CD, observability',
    value: 2,
    monoScore: v => Math.max(0, 5 - v + 1),
    microScore: v => v,
  },
]

const LABELS = ['', 'Совсем нет', 'Слабо', 'Средне', 'Сильно', 'Максимально']

export function Task0_3_Solution() {
  const { t } = useLanguage()
  const [criteria, setCriteria] = useState<Criterion[]>(CRITERIA)

  const updateValue = (id: string, value: number) => {
    setCriteria(prev => prev.map(c => c.id === id ? { ...c, value } : c))
  }

  const totalMonoScore = criteria.reduce((acc, c) => acc + c.monoScore(c.value), 0)
  const totalMicroScore = criteria.reduce((acc, c) => acc + c.microScore(c.value), 0)
  const maxScore = criteria.length * 5
  const monoPercent = Math.round((totalMonoScore / maxScore) * 100)
  const microPercent = Math.round((totalMicroScore / maxScore) * 100)

  const recommendation = totalMicroScore > totalMonoScore + 5
    ? 'microservices'
    : totalMonoScore > totalMicroScore + 5
    ? 'monolith'
    : 'modular-monolith'

  const recConfig = {
    monolith: {
      label: 'Монолит',
      color: '#4f86f7',
      message: 'Ваш контекст хорошо подходит для монолитной архитектуры. Это быстрый старт, простая отладка и минимум operational overhead.',
    },
    microservices: {
      label: 'Микросервисы',
      color: '#38a169',
      message: 'Ваш контекст готов к микросервисам. Есть команды, инфраструктура и явная потребность в независимом масштабировании.',
    },
    'modular-monolith': {
      label: 'Модульный монолит',
      color: '#ed8936',
      message: 'Оптимально начать с модульного монолита — чёткие границы модулей, единый деплой. Мигрировать будет легче, когда появится реальная необходимость.',
    },
  }

  const rec = recConfig[recommendation]

  return (
    <div className="exercise-container">
      <h2>{t('task.0.3')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Настройте параметры вашего проекта. Калькулятор динамически рассчитывает,
        какая архитектура подходит лучше.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {criteria.map(c => (
          <div key={c.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.label}</span>
              <span style={{
                fontSize: '0.8rem',
                color: '#666',
                background: '#f3f4f6',
                padding: '0.1rem 0.5rem',
                borderRadius: '4px',
              }}>
                {LABELS[c.value]}
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#888', marginBottom: '0.4rem' }}>
              {c.description}
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {[1, 2, 3, 4, 5].map(v => (
                <button
                  key={v}
                  onClick={() => updateValue(c.id, v)}
                  style={{
                    flex: 1,
                    padding: '0.35rem 0',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: c.value === v ? 700 : 400,
                    fontSize: '0.9rem',
                    background: c.value === v
                      ? (c.microScore(v) > c.monoScore(v) ? '#38a169' : '#4f86f7')
                      : '#f0f0f0',
                    color: c.value === v ? '#fff' : '#555',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Результат */}
      <div style={{
        marginTop: '2rem',
        padding: '1.25rem',
        background: '#f8f9fa',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
      }}>
        <div style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>
          Результат анализа
        </div>

        {/* Шкалы */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#4f86f7', fontWeight: 600 }}>Монолит</span>
            <span style={{ fontSize: '0.85rem', color: '#666' }}>{monoPercent}%</span>
          </div>
          <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px', marginBottom: '0.75rem' }}>
            <div style={{
              height: '100%',
              width: `${monoPercent}%`,
              background: '#4f86f7',
              borderRadius: '5px',
              transition: 'width 0.4s ease',
            }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#38a169', fontWeight: 600 }}>Микросервисы</span>
            <span style={{ fontSize: '0.85rem', color: '#666' }}>{microPercent}%</span>
          </div>
          <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px' }}>
            <div style={{
              height: '100%',
              width: `${microPercent}%`,
              background: '#38a169',
              borderRadius: '5px',
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>

        {/* Рекомендация */}
        <div style={{
          padding: '1rem',
          borderRadius: '8px',
          background: `${rec.color}15`,
          border: `2px solid ${rec.color}`,
        }}>
          <div style={{ fontWeight: 700, color: rec.color, marginBottom: '0.4rem', fontSize: '1.05rem' }}>
            Рекомендация: {rec.label}
          </div>
          <div style={{ color: '#444', fontSize: '0.88rem', lineHeight: 1.5 }}>
            {rec.message}
          </div>
        </div>
      </div>
    </div>
  )
}
