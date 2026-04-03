import { useState, useCallback } from 'react'

// ============================================
// Задание 11.1: Справочная карточка — Notification System
// ============================================

export function Task11_1_Solution() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Notification System — краткая справка</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Каналы доставки</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Push (APNs/FCM)</strong> — мгновенно, бесплатно, но устройство может быть офлайн. APNs для iOS, FCM для Android/Web.
            <br /><br />
            <strong>Email (SendGrid/SES)</strong> — надёжно, богатый контент (HTML), но задержка 1-30 сек. Нужен SPF/DKIM/DMARC.
            <br /><br />
            <strong>SMS (Twilio)</strong> — самый дорогой ($0.01-0.05), только для critical (OTP, алерты безопасности).
            <br /><br />
            <strong>In-App (WebSocket)</strong> — бесплатно, мгновенно, но только когда приложение открыто.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Notification Pipeline</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>1. Event Trigger</strong> — внешний сервис генерирует событие
            <br />
            <strong>2. Deduplication</strong> — проверка idempotency key
            <br />
            <strong>3. Preference Check</strong> — каналы, тихие часы, отписки
            <br />
            <strong>4. Template Render</strong> — подстановка переменных
            <br />
            <strong>5. Priority Queue</strong> — critical/high/normal/low
            <br />
            <strong>6. Channel Router</strong> — маршрутизация в канал
            <br />
            <strong>7. Delivery</strong> — отправка через провайдера
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Приоритеты</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Critical</strong> — OTP, security alerts. Отдельная очередь, отдельные workers. Доставка &lt; 1 сек.
            <br /><br />
            <strong>High</strong> — заказы, платежи. Доставка &lt; 5 сек.
            <br /><br />
            <strong>Normal</strong> — лайки, комментарии. Доставка &lt; 30 сек.
            <br /><br />
            <strong>Low</strong> — промо, рассылки. Доставка — минуты/часы.
            <br /><br />
            Физически отдельные очереди для изоляции!
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fce4ec', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Retry per Channel</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Push</strong> — 3 retry, backoff 1s/5s/30s. InvalidToken = permanent fail, удалить токен.
            <br /><br />
            <strong>Email</strong> — 5 retry, backoff 1m..12h. HardBounce = permanent fail. SpamComplaint = disable.
            <br /><br />
            <strong>SMS</strong> — 2 retry, backoff 30s/2m. Fallback на push при полном провале.
            <br /><br />
            <strong>In-App</strong> — 0 retry, запись в БД всегда успешна.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#f3e5f5', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Дедупликация</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Idempotency key</strong> = eventId + userId + channel
            <br /><br />
            Хранение: Redis SET с TTL 24 часа.
            <br /><br />
            Проверка ДО постановки в очередь (экономия ресурсов).
            <br /><br />
            Без дедупликации retry при timeout приведёт к дубликатам: пользователь получит 2-5 одинаковых push.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e0f2f1', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>User Preferences</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Каналы</strong> — push/email/SMS/in-app вкл/выкл
            <br /><br />
            <strong>Тихие часы</strong> — 23:00-08:00 по timezone пользователя. Low priority откладывается, critical доставляется.
            <br /><br />
            <strong>Отписки по категориям</strong> — promotion, newsletter, social. Transactional всегда доставляется.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 11.2: Конструктор Notification Pipeline
// ============================================

interface PipelineStage {
  id: string
  name: string
  description: string
  icon: string
}

const CORRECT_ORDER: string[] = [
  'trigger',
  'dedup',
  'preference',
  'template',
  'priority_queue',
  'router',
  'delivery',
]

const PIPELINE_STAGES: PipelineStage[] = [
  { id: 'delivery', name: 'Delivery', description: 'Отправка через провайдера (APNs, SendGrid, Twilio)', icon: '🚀' },
  { id: 'template', name: 'Template Render', description: 'Подстановка переменных в шаблон сообщения', icon: '📝' },
  { id: 'trigger', name: 'Event Trigger', description: 'Внешний сервис генерирует событие', icon: '🎯' },
  { id: 'preference', name: 'Preference Check', description: 'Проверка каналов, тихих часов, отписок', icon: '👤' },
  { id: 'router', name: 'Channel Router', description: 'Маршрутизация в push/email/SMS/in-app', icon: '🔀' },
  { id: 'dedup', name: 'Deduplication', description: 'Проверка idempotency key, отсечение дублей', icon: '🔄' },
  { id: 'priority_queue', name: 'Priority Queue', description: 'Постановка в очередь по приоритету', icon: '📊' },
]

interface SimEvent {
  name: string
  type: string
  priority: 'critical' | 'high' | 'normal' | 'low'
  isDuplicate: boolean
  userPrefDisabled: string[]
  channels: string[]
  templateData: Record<string, string>
}

const SIM_EVENTS: SimEvent[] = [
  {
    name: 'OTP-код авторизации',
    type: 'otp_code',
    priority: 'critical',
    isDuplicate: false,
    userPrefDisabled: [],
    channels: ['sms', 'push'],
    templateData: { code: '482901', userName: 'Анна' },
  },
  {
    name: 'Промо-рассылка (дубликат)',
    type: 'promotion',
    priority: 'low',
    isDuplicate: true,
    userPrefDisabled: ['promotion'],
    channels: ['email', 'push'],
    templateData: { discount: '30%', userName: 'Иван' },
  },
  {
    name: 'Заказ подтверждён',
    type: 'order_confirmed',
    priority: 'high',
    isDuplicate: false,
    userPrefDisabled: [],
    channels: ['push', 'email', 'inApp'],
    templateData: { orderNumber: '#78432', userName: 'Мария' },
  },
  {
    name: 'Новый комментарий (push отключён)',
    type: 'social_comment',
    priority: 'normal',
    isDuplicate: false,
    userPrefDisabled: ['push'],
    channels: ['push', 'email', 'inApp'],
    templateData: { commenter: 'Алексей', post: 'React Hooks' },
  },
]

interface SimStep {
  stage: string
  status: 'pass' | 'filtered' | 'pending'
  message: string
}

function simulateEvent(event: SimEvent): SimStep[] {
  const steps: SimStep[] = []

  steps.push({
    stage: 'trigger',
    status: 'pass',
    message: `Событие "${event.type}" (priority: ${event.priority})`,
  })

  if (event.isDuplicate) {
    steps.push({
      stage: 'dedup',
      status: 'filtered',
      message: 'Idempotency key уже существует в Redis — дубликат отсечён',
    })
    return steps
  }
  steps.push({
    stage: 'dedup',
    status: 'pass',
    message: 'Новое событие, idempotency key записан в Redis (TTL 24h)',
  })

  const activeChannels = event.channels.filter(ch => !event.userPrefDisabled.includes(ch))
  if (activeChannels.length === 0) {
    steps.push({
      stage: 'preference',
      status: 'filtered',
      message: `Все каналы отключены пользователем — уведомление не отправлено`,
    })
    return steps
  }

  const disabledInfo = event.userPrefDisabled.length > 0
    ? `. Отключены: ${event.userPrefDisabled.join(', ')}`
    : ''
  steps.push({
    stage: 'preference',
    status: 'pass',
    message: `Активные каналы: ${activeChannels.join(', ')}${disabledInfo}`,
  })

  steps.push({
    stage: 'template',
    status: 'pass',
    message: `Шаблон отрендерен с данными: ${JSON.stringify(event.templateData)}`,
  })

  steps.push({
    stage: 'priority_queue',
    status: 'pass',
    message: `Поставлено в очередь "${event.priority}" (${activeChannels.length} сообщ.)`,
  })

  steps.push({
    stage: 'router',
    status: 'pass',
    message: `Маршруты: ${activeChannels.map(ch => {
      switch (ch) {
        case 'push': return 'push → FCM'
        case 'sms': return 'sms → Twilio'
        case 'email': return 'email → SendGrid'
        case 'inApp': return 'in-app → WebSocket'
        default: return ch
      }
    }).join(', ')}`,
  })

  steps.push({
    stage: 'delivery',
    status: 'pass',
    message: `Отправлено через ${activeChannels.length} канал(ов). Статус: sent → ожидание delivered`,
  })

  return steps
}

export function Task11_2_Solution() {
  const [stages, setStages] = useState<PipelineStage[]>([...PIPELINE_STAGES])
  const [checked, setChecked] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [simEvent, setSimEvent] = useState<SimEvent | null>(null)
  const [simSteps, setSimSteps] = useState<SimStep[]>([])
  const [simProgress, setSimProgress] = useState(0)
  const [isSimulating, setIsSimulating] = useState(false)

  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return

    setStages(prev => {
      const next = [...prev]
      const dragged = next[dragIndex]
      next.splice(dragIndex, 1)
      next.splice(index, 0, dragged)
      return next
    })
    setDragIndex(index)
    setChecked(false)
  }, [dragIndex])

  const handleDragEnd = useCallback(() => {
    setDragIndex(null)
  }, [])

  const moveStage = useCallback((from: number, direction: 'up' | 'down') => {
    const to = direction === 'up' ? from - 1 : from + 1
    if (to < 0 || to >= stages.length) return
    setStages(prev => {
      const next = [...prev]
      const temp = next[from]
      next[from] = next[to]
      next[to] = temp
      return next
    })
    setChecked(false)
  }, [stages.length])

  const checkOrder = () => {
    setChecked(true)
  }

  const isCorrect = (index: number) => {
    return stages[index].id === CORRECT_ORDER[index]
  }

  const allCorrect = stages.every((s, i) => s.id === CORRECT_ORDER[i])

  const runSimulation = useCallback((event: SimEvent) => {
    setSimEvent(event)
    const steps = simulateEvent(event)
    setSimSteps(steps)
    setSimProgress(0)
    setIsSimulating(true)

    let step = 0
    const interval = setInterval(() => {
      step++
      if (step >= steps.length) {
        clearInterval(interval)
        setIsSimulating(false)
      }
      setSimProgress(step)
    }, 800)
  }, [])

  const getStageColor = (index: number): string => {
    if (!checked) return '#f5f5f5'
    return isCorrect(index) ? '#e8f5e9' : '#ffebee'
  }

  const getStageBorder = (index: number): string => {
    if (!checked) return '2px solid #e0e0e0'
    return isCorrect(index) ? '2px solid #4caf50' : '2px solid #f44336'
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Конструктор Notification Pipeline</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Расставьте этапы pipeline в правильном порядке. Перетаскивайте блоки или используйте стрелки.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
        {stages.map((stage, index) => (
          <div
            key={stage.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              background: getStageColor(index),
              border: getStageBorder(index),
              borderRadius: '8px',
              cursor: 'grab',
              userSelect: 'none',
              opacity: dragIndex === index ? 0.5 : 1,
            }}
          >
            <span style={{ fontSize: '1.2rem', minWidth: '2rem', textAlign: 'center' }}>
              {stage.icon}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                <span style={{ color: '#999', marginRight: '0.5rem' }}>{index + 1}.</span>
                {stage.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>{stage.description}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <button
                onClick={() => moveStage(index, 'up')}
                disabled={index === 0}
                style={{
                  padding: '2px 8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  background: 'white',
                  cursor: index === 0 ? 'default' : 'pointer',
                  opacity: index === 0 ? 0.3 : 1,
                  fontSize: '0.7rem',
                }}
              >
                ▲
              </button>
              <button
                onClick={() => moveStage(index, 'down')}
                disabled={index === stages.length - 1}
                style={{
                  padding: '2px 8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  background: 'white',
                  cursor: index === stages.length - 1 ? 'default' : 'pointer',
                  opacity: index === stages.length - 1 ? 0.3 : 1,
                  fontSize: '0.7rem',
                }}
              >
                ▼
              </button>
            </div>
            {checked && (
              <span style={{ fontSize: '1.2rem' }}>
                {isCorrect(index) ? '✅' : '❌'}
              </span>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          onClick={checkOrder}
          style={{
            padding: '0.5rem 1.5rem',
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Проверить порядок
        </button>
        <button
          onClick={() => {
            setStages([...PIPELINE_STAGES])
            setChecked(false)
            setSimEvent(null)
            setSimSteps([])
            setSimProgress(0)
          }}
          style={{
            padding: '0.5rem 1.5rem',
            background: '#757575',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Сбросить
        </button>
      </div>

      {checked && allCorrect && (
        <div style={{
          padding: '1rem',
          background: '#e8f5e9',
          borderRadius: '8px',
          border: '1px solid #4caf50',
          marginBottom: '1.5rem',
        }}>
          <strong style={{ color: '#2e7d32' }}>Pipeline собран правильно!</strong>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>
            Теперь запустите симуляцию, чтобы увидеть, как событие проходит через pipeline.
          </p>
        </div>
      )}

      {checked && !allCorrect && (
        <div style={{
          padding: '1rem',
          background: '#ffebee',
          borderRadius: '8px',
          border: '1px solid #f44336',
          marginBottom: '1.5rem',
        }}>
          <strong style={{ color: '#c62828' }}>
            Правильно: {stages.filter((_, i) => isCorrect(i)).length} из {stages.length}
          </strong>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>
            Подсказка: подумайте, что должно произойти ДО постановки в очередь, а что ПОСЛЕ.
          </p>
        </div>
      )}

      <h3 style={{ marginTop: '1.5rem' }}>Симуляция прохождения события</h3>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
        Выберите событие и наблюдайте, как оно проходит через pipeline:
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
        {SIM_EVENTS.map((event) => (
          <button
            key={event.name}
            onClick={() => !isSimulating && runSimulation(event)}
            disabled={isSimulating}
            style={{
              padding: '0.75rem',
              background: simEvent?.name === event.name ? '#e3f2fd' : '#fafafa',
              border: simEvent?.name === event.name ? '2px solid #1976d2' : '1px solid #e0e0e0',
              borderRadius: '8px',
              cursor: isSimulating ? 'default' : 'pointer',
              textAlign: 'left',
              opacity: isSimulating ? 0.7 : 1,
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{event.name}</div>
            <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '4px' }}>
              Priority: {event.priority} | Channels: {event.channels.join(', ')}
              {event.isDuplicate && ' | Дубликат'}
              {event.userPrefDisabled.length > 0 && ` | Отключено: ${event.userPrefDisabled.join(', ')}`}
            </div>
          </button>
        ))}
      </div>

      {simSteps.length > 0 && (
        <div style={{
          padding: '1rem',
          background: '#263238',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
        }}>
          <div style={{ color: '#78909c', marginBottom: '0.75rem' }}>
            // Событие: {simEvent?.name}
          </div>
          {simSteps.map((step, index) => {
            if (index > simProgress) return null
            const stageInfo = PIPELINE_STAGES.find(s => s.id === step.stage) || PIPELINE_STAGES[0]
            const statusColor = step.status === 'pass' ? '#81c784'
              : step.status === 'filtered' ? '#ef5350'
              : '#ffb74d'
            const statusIcon = step.status === 'pass' ? 'PASS'
              : step.status === 'filtered' ? 'FILTERED'
              : 'PENDING'

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  marginBottom: '0.5rem',
                  alignItems: 'flex-start',
                  opacity: index === simProgress && isSimulating ? 0.7 : 1,
                }}
              >
                <span style={{ color: '#78909c', minWidth: '1.5rem' }}>{stageInfo.icon}</span>
                <span style={{
                  color: statusColor,
                  fontWeight: 'bold',
                  minWidth: '5.5rem',
                  fontSize: '0.8rem',
                }}>
                  [{statusIcon}]
                </span>
                <span style={{ color: '#e0e0e0' }}>
                  <strong>{stageInfo.name}:</strong>{' '}
                  <span style={{ color: '#b0bec5' }}>{step.message}</span>
                </span>
              </div>
            )
          })}
          {!isSimulating && simProgress >= simSteps.length - 1 && (
            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #37474f' }}>
              {simSteps[simSteps.length - 1].status === 'filtered' ? (
                <span style={{ color: '#ef5350' }}>
                  ✗ Событие отфильтровано на этапе &quot;{
                    PIPELINE_STAGES.find(s => s.id === simSteps[simSteps.length - 1].stage)?.name
                  }&quot;
                </span>
              ) : (
                <span style={{ color: '#81c784' }}>
                  ✓ Уведомление успешно доставлено через все этапы pipeline
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 11.3: Полный System Design — Notification System
// ============================================

interface DesignSection {
  id: string
  title: string
  content: string
}

const DESIGN_SECTIONS: DesignSection[] = [
  {
    id: 'requirements',
    title: '1. Requirements',
    content: `Functional:
  - Отправка уведомлений по 4+ каналам: Push (APNs/FCM), Email, SMS, In-App
  - Управление пользовательскими предпочтениями (каналы, тихие часы, отписки)
  - Шаблоны с динамическими переменными и локализацией
  - Приоритизация: critical (OTP) > high (заказы) > normal (social) > low (промо)
  - Отслеживание статуса доставки per-channel
  - Retry с exponential backoff, per-channel стратегии

Non-Functional:
  - Масштаб: 10M+ уведомлений/день
  - Задержка: critical < 1 сек, high < 5 сек, normal < 30 сек
  - Exactly-once delivery (дедупликация через idempotency key)
  - Высокая доступность: 99.9%+ (критические уведомления не теряются)
  - Расширяемость: добавление нового канала без переделки pipeline`,
  },
  {
    id: 'channels',
    title: '2. Channels & Providers',
    content: `Push Notifications:
  - iOS: Apple Push Notification Service (APNs)
    Payload до 4KB, device token, Feedback Service для невалидных токенов
  - Android/Web: Firebase Cloud Messaging (FCM)
    Data + Notification messages, topic subscriptions
  - Требуется: хранение device_tokens, регулярная очистка невалидных

Email:
  - Провайдер: SendGrid / AWS SES / Mailgun
  - Требуется: SPF, DKIM, DMARC для deliverability
  - Bounce handling: soft bounce → retry, hard bounce → disable email
  - Webhooks: delivered, bounced, opened, clicked, spam_complaint
  - List-Unsubscribe header обязателен для массовых рассылок

SMS:
  - Провайдер: Twilio / Vonage / AWS SNS
  - Формат номера: E.164 (+79161234567)
  - Стоимость: $0.01-0.05 за сообщение — только для critical
  - Лимит: 160 символов (или multipart)
  - Delivery receipts через webhook

In-App:
  - Доставка: WebSocket (realtime) или polling
  - Хранение: PostgreSQL (notification_inbox таблица)
  - Badge count: атомарный счётчик непрочитанных
  - Всегда "успешна" — просто запись в БД`,
  },
  {
    id: 'pipeline',
    title: '3. Notification Pipeline',
    content: `Порядок этапов:

  1. EVENT TRIGGER
     Внешний сервис (Order Service, Auth Service) публикует событие в Kafka
     Payload: { eventType, userId, data, idempotencyKey, priority }

  2. DEDUPLICATION
     Redis GET dedup:{idempotencyKey}
     Если ключ есть → событие уже обработано, skip
     Если нет → Redis SETEX dedup:{key} 86400 "1"

  3. PREFERENCE CHECK
     PostgreSQL: SELECT * FROM user_preferences WHERE user_id = ?
     Фильтрация: отключённые каналы, тихие часы (по timezone), отписки по категориям
     Critical (OTP) → игнорирует тихие часы и отписки

  4. TEMPLATE RENDER
     PostgreSQL: SELECT body FROM templates WHERE event_type = ? AND channel = ? AND locale = ?
     Handlebars: "Заказ {{orderNumber}} подтверждён" → "Заказ #12345 подтверждён"
     Разный шаблон для каждого канала (push = короткий, email = HTML)

  5. PRIORITY QUEUE
     Redis RPUSH notifications:{priority} {message}
     4 отдельные очереди: critical, high, normal, low
     Workers читают в порядке приоритета

  6. CHANNEL ROUTER
     Направляет готовое сообщение в нужный delivery-канал
     Одно событие может породить несколько сообщений (push + email + in-app)

  7. DELIVERY
     Отправка через SDK провайдера (APNs, SendGrid, Twilio)
     Запись статуса в delivery_log
     При failure → retry по per-channel стратегии`,
  },
  {
    id: 'datamodel',
    title: '4. Data Model',
    content: `Таблица notification_templates:
  - id UUID PRIMARY KEY
  - event_type VARCHAR(100) NOT NULL      -- 'order_confirmed'
  - channel VARCHAR(20) NOT NULL          -- 'push', 'email', 'sms', 'inApp'
  - locale VARCHAR(5) NOT NULL            -- 'ru', 'en'
  - subject VARCHAR(500)                  -- Для email
  - body TEXT NOT NULL                    -- "Заказ {{orderNumber}} подтверждён"
  - version INT DEFAULT 1
  - UNIQUE (event_type, channel, locale)

Таблица user_preferences:
  - user_id VARCHAR(36) PRIMARY KEY
  - push_enabled BOOLEAN DEFAULT true
  - email_enabled BOOLEAN DEFAULT true
  - sms_enabled BOOLEAN DEFAULT true
  - in_app_enabled BOOLEAN DEFAULT true
  - quiet_hours_start TIME                -- '23:00'
  - quiet_hours_end TIME                  -- '08:00'
  - timezone VARCHAR(50)                  -- 'Europe/Moscow'
  - unsubscribed_categories TEXT[]        -- ['promotion', 'newsletter']

Таблица device_tokens:
  - id UUID PRIMARY KEY
  - user_id VARCHAR(36) NOT NULL (FK, indexed)
  - token TEXT NOT NULL UNIQUE
  - platform VARCHAR(10) NOT NULL         -- 'ios', 'android', 'web'
  - is_valid BOOLEAN DEFAULT true
  - created_at TIMESTAMP
  - last_used_at TIMESTAMP

Таблица delivery_log:
  - id UUID PRIMARY KEY
  - notification_id VARCHAR(100) NOT NULL (indexed)
  - user_id VARCHAR(36) NOT NULL (indexed)
  - channel VARCHAR(20) NOT NULL
  - status VARCHAR(20) NOT NULL           -- 'pending','sent','delivered','failed','read'
  - attempts INT DEFAULT 0
  - last_attempt_at TIMESTAMP
  - delivered_at TIMESTAMP
  - fail_reason TEXT
  - provider_message_id VARCHAR(200)
  - created_at TIMESTAMP

Индексы:
  - delivery_log: INDEX (user_id, created_at DESC) — inbox пользователя
  - delivery_log: INDEX (notification_id) — все каналы одного уведомления
  - delivery_log: INDEX (status) WHERE status = 'failed' — для retry worker
  - device_tokens: INDEX (user_id) WHERE is_valid = true`,
  },
  {
    id: 'retry',
    title: '5. Retry Strategy per Channel',
    content: `Push (APNs/FCM):
  - Max retries: 3
  - Backoff: 1s → 5s → 30s
  - Permanent failures: InvalidToken, Unregistered
    → Удалить device_token из БД (is_valid = false)
  - Transient failures: ServiceUnavailable, Timeout
    → Retry с backoff

Email (SendGrid/SES):
  - Max retries: 5
  - Backoff: 1m → 5m → 30m → 2h → 12h
  - Permanent failures: HardBounce, SpamComplaint
    → HardBounce: пометить email невалидным
    → SpamComplaint: отключить email-канал для пользователя
  - Transient failures: SoftBounce, Throttled
    → Retry с длинным backoff

SMS (Twilio):
  - Max retries: 2
  - Backoff: 30s → 2m
  - Permanent failures: InvalidNumber, Blacklisted
    → Не повторять, логировать
  - Fallback: если SMS полностью failed → попробовать push
  - Стоимость: каждый retry стоит денег!

In-App:
  - Max retries: 0
  - Запись в БД — всегда успешна
  - При ошибке БД — стандартный retry на уровне БД-транзакции

Общие правила:
  - Exponential backoff + jitter (случайный разброс для снижения thundering herd)
  - Dead Letter Queue (DLQ) для сообщений, исчерпавших все retry
  - Мониторинг: алерт если DLQ растёт быстрее X сообщений/мин`,
  },
  {
    id: 'architecture',
    title: '6. Architecture',
    content: `Компоненты:

  [Order Service] ─┐
  [Auth Service]  ──┤── Kafka topics ──→ [Notification Service]
  [Social Service] ─┘                         │
                                              ├→ [Redis] (dedup + priority queues)
                                              ├→ [PostgreSQL] (preferences, templates, delivery_log)
                                              │
                                    ┌─────────┴─────────┐
                                    │   Priority Queues   │
                                    │ critical│high│normal│low
                                    └─────────┬─────────┘
                                              │
                                    ┌─────────┴─────────┐
                                    │     Workers (N)     │
                                    └──┬──┬──┬──┬───────┘
                                       │  │  │  │
                               APNs  FCM  SendGrid  Twilio  WebSocket
                                       │  │  │  │     │
                                    ┌──┴──┴──┴──┴─────┘
                                    │  Status Webhooks  │
                                    └───────┬──────────┘
                                            │
                                    [Status Tracker] → PostgreSQL (delivery_log)

Write Path (новое уведомление):
  1. Order Service → Kafka topic "notifications"
  2. Notification Service consumer читает событие
  3. Dedup: Redis GET → если дубль, skip
  4. Preference: PostgreSQL → фильтрация каналов
  5. Template: PostgreSQL → рендеринг шаблона
  6. Priority Queue: Redis RPUSH → нужная очередь
  7. Worker: LPOP → отправка через провайдера
  8. Delivery Log: INSERT INTO delivery_log

Read Path (inbox пользователя):
  1. Client → GET /api/notifications?userId=X
  2. PostgreSQL: SELECT * FROM delivery_log WHERE user_id = X AND channel = 'inApp'
  3. Или: Redis LRANGE для быстрого чтения последних N

Отказоустойчивость:
  - Worker crashed → сообщение вернётся в очередь (Redis BRPOPLPUSH)
  - SendGrid down → retry с backoff, fallback на SES
  - PostgreSQL replica down → переключение на standby
  - Kafka partition → consumer rebalance, at-least-once delivery`,
  },
  {
    id: 'scaling',
    title: '7. Scaling & Optimizations',
    content: `Notification Service:
  - Stateless consumers из Kafka → горизонтальное масштабирование
  - Consumer group: N consumers × M partitions
  - Auto-scaling по lag Kafka (если отставание > 10K → добавить consumer)

Workers:
  - Отдельные worker pools для каждого приоритета
  - Critical: always-on, минимум 3 инстанса, запас ×3
  - Low: auto-scaling, может масштабироваться до 0 в тихие часы
  - Rate limiting per provider (APNs: 100K/sec, SendGrid: 600/sec)

Database:
  - PostgreSQL для preferences, templates (read-heavy, кэшировать в Redis)
  - delivery_log: partitioning по created_at (ежемесячные партиции)
  - Архивация логов старше 90 дней → S3 / cold storage

Redis:
  - Cluster для dedup keys (TTL 24h, автоматическая очистка)
  - Отдельный Cluster для priority queues
  - Persistence: AOF для queues (чтобы не терять при рестарте)

Rate Limiting:
  - Per-user: макс 10 push/час (защита от spam-бага)
  - Per-provider: соблюдать лимиты APNs/SendGrid/Twilio
  - Per-category: промо-рассылка макс 1/день на пользователя

Batch Optimization:
  - Массовые рассылки: разбивать на batch по 1000
  - SendGrid batch API: отправка 1000 emails одним запросом
  - FCM topics: один запрос вместо N push'ей

Мониторинг:
  - Delivery rate per channel (% delivered из sent)
  - Queue depth per priority (алерт если critical > 100)
  - Latency P99 per priority (critical < 1s)
  - Provider error rate (алерт если > 5%)
  - DLQ size (алерт если растёт)`,
  },
]

export function Task11_3_Solution() {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())
  const [expandAll, setExpandAll] = useState(false)

  const toggleSection = (id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleAll = () => {
    if (expandAll) {
      setOpenSections(new Set())
    } else {
      setOpenSections(new Set(DESIGN_SECTIONS.map(s => s.id)))
    }
    setExpandAll(!expandAll)
  }

  const getSectionIcon = (id: string) => {
    switch (id) {
      case 'requirements': return '📋'
      case 'channels': return '📡'
      case 'pipeline': return '🔧'
      case 'datamodel': return '💾'
      case 'retry': return '🔄'
      case 'architecture': return '🏗️'
      case 'scaling': return '📈'
      default: return '📌'
    }
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Полный System Design: Notification System</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Эталонное решение. Раскройте каждую секцию, чтобы увидеть детали. Сравните со своим дизайном.
      </p>

      <button
        onClick={toggleAll}
        style={{
          padding: '0.4rem 1rem',
          marginBottom: '1rem',
          background: '#f5f5f5',
          border: '1px solid #ddd',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.85rem',
        }}
      >
        {expandAll ? 'Свернуть все' : 'Развернуть все'}
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {DESIGN_SECTIONS.map(section => {
          const isOpen = openSections.has(section.id)
          return (
            <div key={section.id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
              <button
                onClick={() => toggleSection(section.id)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: isOpen ? '#e3f2fd' : '#fafafa',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  textAlign: 'left',
                }}
              >
                <span style={{
                  transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                  display: 'inline-block',
                }}>
                  ▶
                </span>
                <span>{getSectionIcon(section.id)}</span>
                <span>{section.title}</span>
              </button>
              {isOpen && (
                <div style={{
                  padding: '1rem',
                  background: '#fafafa',
                  borderTop: '1px solid #e0e0e0',
                }}>
                  <pre style={{
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    color: '#333',
                  }}>
                    {section.content}
                  </pre>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
        <strong>Чеклист интервью:</strong>
        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
          1. Requirements (2 мин) → 2. Channels (3 мин) → 3. Pipeline (5 мин)
          <br />
          4. Data Model (3 мин) → 5. Retry Strategy (3 мин) → 6. Architecture (5 мин)
          <br />
          7. Scaling (5 мин) → 8. Вопросы интервьюера (5-10 мин)
          <br /><br />
          Итого: ~30-35 минут. Ключевой момент — показать понимание разницы между каналами и приоритетами.
        </div>
      </div>

      <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
        <strong>Частые вопросы интервьюера:</strong>
        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', lineHeight: '1.8' }}>
          <div>• Как гарантировать, что OTP-код дойдёт за 1 секунду при 10M промо-рассылок?</div>
          <div style={{ color: '#666', marginLeft: '1rem' }}>
            → Физически отдельные очереди и workers для critical приоритета
          </div>
          <div>• Что будет, если SendGrid упал на 30 минут?</div>
          <div style={{ color: '#666', marginLeft: '1rem' }}>
            → Retry с backoff, fallback на SES, сообщения не теряются (в очереди)
          </div>
          <div>• Как не отправить 10 одинаковых push при retry?</div>
          <div style={{ color: '#666', marginLeft: '1rem' }}>
            → Idempotency key (eventId+userId+channel) в Redis с TTL 24h
          </div>
          <div>• Как добавить новый канал (Telegram)?</div>
          <div style={{ color: '#666', marginLeft: '1rem' }}>
            → Новый delivery adapter + запись в user_preferences + шаблоны
          </div>
        </div>
      </div>
    </div>
  )
}
