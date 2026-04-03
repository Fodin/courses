import { useState } from 'react'

// ============================================
// Задание 1.1: Квиз — заглушка (квиз рендерится платформой)
// ============================================

export function Task1_1_Solution() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Масштабирование — краткая справка</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Scale Up vs Scale Out</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Scale Up</strong> — увеличение ресурсов одного сервера (CPU, RAM). Просто, но дорого и ограничено.
            <br />
            <strong>Scale Out</strong> — добавление серверов. Безлимитно, но требует stateless-архитектуры.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Stateless vs Stateful</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Stateless</strong> — сервер не хранит состояние клиента. Любой сервер обработает любой запрос.
            <br />
            <strong>Stateful</strong> — состояние в памяти. Нужно выносить в Redis/БД для масштабирования.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Scaling Cube (X/Y/Z)</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>X</strong> — клонирование (одинаковые копии).{' '}
            <strong>Y</strong> — декомпозиция (микросервисы).{' '}
            <strong>Z</strong> — шардинг (разделение данных).
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fce4ec', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Закон Амдала</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            Speedup = 1 / (S + (1-S)/N). При 5% последовательного кода максимальное ускорение — 20x,
            сколько бы серверов ни добавляли.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 1.2: Планировщик масштабирования
// ============================================

interface ScalingParams {
  targetRps: number
  cpuPerRequest: number
  ramPerRequestMb: number
  baseServerCost: number
  baseCpuCores: number
  baseRamGb: number
}

interface ScalingPreset {
  name: string
  description: string
  params: ScalingParams
}

const scalingPresets: ScalingPreset[] = [
  {
    name: 'Стартап',
    description: '~100 RPS, лёгкие API-запросы',
    params: {
      targetRps: 100,
      cpuPerRequest: 2,
      ramPerRequestMb: 10,
      baseServerCost: 100,
      baseCpuCores: 4,
      baseRamGb: 16,
    },
  },
  {
    name: 'Средний бизнес',
    description: '~2 000 RPS, каталог + поиск',
    params: {
      targetRps: 2000,
      cpuPerRequest: 3,
      ramPerRequestMb: 20,
      baseServerCost: 150,
      baseCpuCores: 4,
      baseRamGb: 16,
    },
  },
  {
    name: 'Highload',
    description: '~50 000 RPS, e-commerce в Black Friday',
    params: {
      targetRps: 50000,
      cpuPerRequest: 1,
      ramPerRequestMb: 5,
      baseServerCost: 200,
      baseCpuCores: 8,
      baseRamGb: 32,
    },
  },
]

function calculateScaling(params: ScalingParams) {
  const {
    targetRps,
    cpuPerRequest,
    ramPerRequestMb,
    baseServerCost,
    baseCpuCores,
    baseRamGb,
  } = params

  // RPS capacity per base server
  // CPU bottleneck: cores * 100% / cpuPerRequest
  const rpsPerServerCpu = Math.floor((baseCpuCores * 100) / Math.max(cpuPerRequest, 0.1))
  // RAM bottleneck: total RAM / ram per request (concurrent requests ~ RPS * avg_latency, assume 50ms)
  const concurrentRequests = (rpsPerServerCpu * 50) / 1000
  const ramNeededMb = concurrentRequests * ramPerRequestMb
  const ramAvailableMb = baseRamGb * 1024
  const rpsPerServerRam = ramNeededMb > ramAvailableMb
    ? Math.floor(rpsPerServerCpu * (ramAvailableMb / ramNeededMb))
    : rpsPerServerCpu
  const rpsPerServer = Math.min(rpsPerServerCpu, rpsPerServerRam)

  // Horizontal: number of servers needed
  const serversNeeded = Math.max(1, Math.ceil(targetRps / Math.max(rpsPerServer, 1)))
  const horizontalCost = serversNeeded * baseServerCost
  const horizontalOverhead = Math.ceil(serversNeeded * 0.1) * 50 // LB + infra overhead
  const horizontalTotalCost = horizontalCost + horizontalOverhead

  // Vertical: exponential cost
  // multiplier = targetRps / rpsPerServer, cost = base * multiplier^1.6
  const multiplier = Math.max(1, targetRps / Math.max(rpsPerServer, 1))
  const verticalCost = Math.round(baseServerCost * Math.pow(multiplier, 1.6))

  // Cost comparison at different scales
  const costCurve = []
  for (let rps = 100; rps <= Math.max(targetRps * 1.5, 1000); rps = Math.round(rps * 1.5)) {
    const hServers = Math.max(1, Math.ceil(rps / Math.max(rpsPerServer, 1)))
    const hCost = hServers * baseServerCost + Math.ceil(hServers * 0.1) * 50
    const vMult = Math.max(1, rps / Math.max(rpsPerServer, 1))
    const vCost = Math.round(baseServerCost * Math.pow(vMult, 1.6))
    costCurve.push({ rps, horizontalCost: hCost, verticalCost: vCost, servers: hServers })
  }

  return {
    rpsPerServer,
    serversNeeded,
    horizontalTotalCost,
    verticalCost,
    costCurve,
  }
}

export function Task1_2_Solution() {
  const [params, setParams] = useState<ScalingParams>(scalingPresets[0].params)
  const [activePreset, setActivePreset] = useState(0)

  const applyPreset = (index: number) => {
    setActivePreset(index)
    setParams(scalingPresets[index].params)
  }

  const updateParam = <K extends keyof ScalingParams>(key: K, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }))
    setActivePreset(-1)
  }

  const result = calculateScaling(params)
  const maxCost = Math.max(result.horizontalTotalCost, result.verticalCost, 1)
  const savings = result.verticalCost - result.horizontalTotalCost
  const horizontalCheaper = savings > 0

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Планировщик масштабирования</h2>

      {/* Presets */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 0.5rem' }}>Пресеты нагрузки</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {scalingPresets.map((preset, i) => (
            <button
              key={i}
              onClick={() => applyPreset(i)}
              style={{
                padding: '0.5rem 1rem',
                border: `2px solid ${activePreset === i ? '#1976d2' : '#e0e0e0'}`,
                background: activePreset === i ? '#1976d2' : 'white',
                color: activePreset === i ? 'white' : '#333',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              <strong>{preset.name}</strong>
              <br />
              <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{preset.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input params */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
          padding: '1rem',
          background: '#fafafa',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
        }}
      >
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
            Target RPS
          </label>
          <input
            type="number"
            min={1}
            max={1000000}
            value={params.targetRps}
            onChange={(e) => updateParam('targetRps', Math.max(1, Number(e.target.value)))}
            style={{ width: '100%', padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
            CPU per request (%)
          </label>
          <input
            type="number"
            min={0.1}
            max={100}
            step={0.5}
            value={params.cpuPerRequest}
            onChange={(e) => updateParam('cpuPerRequest', Math.max(0.1, Number(e.target.value)))}
            style={{ width: '100%', padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
            RAM per request (MB)
          </label>
          <input
            type="number"
            min={1}
            max={1024}
            value={params.ramPerRequestMb}
            onChange={(e) => updateParam('ramPerRequestMb', Math.max(1, Number(e.target.value)))}
            style={{ width: '100%', padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
            Base server cost ($/мес)
          </label>
          <input
            type="number"
            min={10}
            max={10000}
            value={params.baseServerCost}
            onChange={(e) => updateParam('baseServerCost', Math.max(10, Number(e.target.value)))}
            style={{ width: '100%', padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
            Base CPU cores
          </label>
          <input
            type="number"
            min={1}
            max={128}
            value={params.baseCpuCores}
            onChange={(e) => updateParam('baseCpuCores', Math.max(1, Number(e.target.value)))}
            style={{ width: '100%', padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
            Base RAM (GB)
          </label>
          <input
            type="number"
            min={1}
            max={1024}
            value={params.baseRamGb}
            onChange={(e) => updateParam('baseRamGb', Math.max(1, Number(e.target.value)))}
            style={{ width: '100%', padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* Results summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#555', marginBottom: '0.25rem' }}>RPS на 1 сервер</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1976d2' }}>{result.rpsPerServer.toLocaleString()}</div>
        </div>
        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#555', marginBottom: '0.25rem' }}>Серверов нужно (Scale Out)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#388e3c' }}>{result.serversNeeded}</div>
        </div>
        <div style={{ padding: '1rem', background: horizontalCheaper ? '#e8f5e9' : '#fff3e0', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#555', marginBottom: '0.25rem' }}>Экономия Scale Out</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: horizontalCheaper ? '#2e7d32' : '#e65100' }}>
            {horizontalCheaper ? `-$${savings.toLocaleString()}/мес` : `+$${Math.abs(savings).toLocaleString()}/мес`}
          </div>
        </div>
      </div>

      {/* Cost comparison bars */}
      <div
        style={{
          padding: '1rem',
          background: '#fafafa',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          marginBottom: '1.5rem',
        }}
      >
        <h3 style={{ margin: '0 0 1rem' }}>Сравнение стоимости при {params.targetRps.toLocaleString()} RPS</h3>

        {/* Vertical */}
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Scale Up (1 мощный сервер)</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#d32f2f' }}>${result.verticalCost.toLocaleString()}/мес</span>
          </div>
          <div style={{ height: '32px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${(result.verticalCost / maxCost) * 100}%`,
                height: '100%',
                background: '#d32f2f',
                borderRadius: '4px',
                minWidth: '2px',
                transition: 'width 0.3s',
              }}
            />
          </div>
        </div>

        {/* Horizontal */}
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Scale Out ({result.serversNeeded} серверов + infra)</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#1976d2' }}>${result.horizontalTotalCost.toLocaleString()}/мес</span>
          </div>
          <div style={{ height: '32px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${(result.horizontalTotalCost / maxCost) * 100}%`,
                height: '100%',
                background: '#1976d2',
                borderRadius: '4px',
                minWidth: '2px',
                transition: 'width 0.3s',
              }}
            />
          </div>
        </div>

        <div style={{ padding: '0.5rem', background: horizontalCheaper ? '#e8f5e9' : '#fff3e0', borderRadius: '6px', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          {horizontalCheaper
            ? `Scale Out выгоднее на $${savings.toLocaleString()}/мес (${Math.round((savings / result.verticalCost) * 100)}% экономии)`
            : `Scale Up пока выгоднее на $${Math.abs(savings).toLocaleString()}/мес — нагрузка невелика`}
        </div>
      </div>

      {/* Cost curve table */}
      <div
        style={{
          padding: '1rem',
          background: '#fafafa',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
        }}
      >
        <h3 style={{ margin: '0 0 0.75rem' }}>Кривая стоимости при росте нагрузки</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#263238', color: 'white' }}>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>RPS</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Серверов</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Scale Out ($/мес)</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Scale Up ($/мес)</th>
              <th style={{ padding: '0.5rem', textAlign: 'center' }}>Выгоднее</th>
            </tr>
          </thead>
          <tbody>
            {result.costCurve.map((row, i) => {
              const isTarget = row.rps === params.targetRps
              const winner = row.horizontalCost < row.verticalCost ? 'horizontal' : row.horizontalCost > row.verticalCost ? 'vertical' : 'tie'
              return (
                <tr
                  key={i}
                  style={{
                    borderBottom: '1px solid #e0e0e0',
                    background: isTarget ? '#e3f2fd' : i % 2 === 0 ? 'white' : '#fafafa',
                  }}
                >
                  <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: isTarget ? 'bold' : 'normal' }}>
                    {row.rps.toLocaleString()}
                  </td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>{row.servers}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right', color: winner === 'horizontal' ? '#2e7d32' : '#333', fontWeight: winner === 'horizontal' ? 'bold' : 'normal' }}>
                    ${row.horizontalCost.toLocaleString()}
                  </td>
                  <td style={{ padding: '0.5rem', textAlign: 'right', color: winner === 'vertical' ? '#2e7d32' : '#333', fontWeight: winner === 'vertical' ? 'bold' : 'normal' }}>
                    ${row.verticalCost.toLocaleString()}
                  </td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      background: winner === 'horizontal' ? '#e8f5e9' : winner === 'vertical' ? '#fff3e0' : '#eee',
                      color: winner === 'horizontal' ? '#2e7d32' : winner === 'vertical' ? '#e65100' : '#666',
                    }}>
                      {winner === 'horizontal' ? 'Scale Out' : winner === 'vertical' ? 'Scale Up' : 'Равны'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p style={{ margin: '0.75rem 0 0', fontSize: '0.8rem', color: '#666' }}>
          Scale Up стоимость растёт как cost * multiplier^1.6 — суперлинейная кривая.
          Scale Out стоимость растёт линейно + небольшой overhead на инфраструктуру (балансировщик, мониторинг).
        </p>
      </div>
    </div>
  )
}

// ============================================
// Задание 1.3: Стратегия масштабирования
// ============================================

interface EcommerceComponent {
  id: string
  name: string
  description: string
  loadType: string
  correctType: 'stateless' | 'stateful'
  correctStrategy: string
  correctStateStorage: string
  explanation: string
}

const ecommerceComponents: EcommerceComponent[] = [
  {
    id: 'sessions',
    name: 'User Sessions',
    description: 'Хранение корзины, авторизации пользователя, предпочтений. Данные привязаны к конкретному пользователю.',
    loadType: 'Read/Write, привязано к пользователю',
    correctType: 'stateful',
    correctStrategy: 'Scale Out (X-axis) + вынос состояния в Redis',
    correctStateStorage: 'Redis (TTL 30 мин, сериализация JSON)',
    explanation: 'Сессии — классический stateful-компонент. Хранить в памяти сервера нельзя (при Scale Out сессия потеряется). Redis обеспечивает быстрый доступ (< 1 мс), TTL для автоматического истечения, и доступность с любого сервера.',
  },
  {
    id: 'catalog',
    name: 'Product Catalog',
    description: 'Каталог товаров: название, цена, описание, фото. Обновляется редко (менеджерами), читается постоянно.',
    loadType: 'Read-heavy (99% чтение, 1% запись)',
    correctType: 'stateless',
    correctStrategy: 'Scale Out (X-axis) + кэширование',
    correctStateStorage: 'PostgreSQL (основа) + Redis/CDN (кэш)',
    explanation: 'Каталог — read-heavy stateless-сервис. Каждая копия может обслуживать любой запрос. Кэширование в Redis или CDN снижает нагрузку на БД в 10-100 раз. Обновления каталога инвалидируют кэш.',
  },
  {
    id: 'search',
    name: 'Search Service',
    description: 'Полнотекстовый поиск товаров по названию, описанию, категориям. CPU-интенсивная обработка запросов.',
    loadType: 'Read-heavy, CPU-intensive',
    correctType: 'stateless',
    correctStrategy: 'Scale Out (X-axis) + Y-axis (отдельный сервис) + Z-axis (шардинг индекса)',
    correctStateStorage: 'Elasticsearch / OpenSearch (шардированный индекс)',
    explanation: 'Поиск — отдельный CPU-интенсивный сервис (Y-axis декомпозиция). Stateless: каждый узел имеет реплику поискового индекса. При большом каталоге — Z-axis шардинг индекса по категориям. Elasticsearch автоматически распределяет шарды.',
  },
  {
    id: 'orders',
    name: 'Order Processing',
    description: 'Создание и обработка заказов. Критичны ACID-транзакции, нельзя потерять заказ или создать дубликат.',
    loadType: 'Write-heavy, транзакционный',
    correctType: 'stateful',
    correctStrategy: 'Scale Up (БД) + Z-axis (шардинг по user_id) при росте',
    correctStateStorage: 'PostgreSQL (ACID транзакции, leader-replica)',
    explanation: 'Заказы требуют строгой консистентности (ACID). Сначала Scale Up для БД заказов. При росте — шардинг по user_id (Z-axis): заказы одного пользователя на одном шарде, транзакции локальные. Сервис обработки — stateless, состояние в БД.',
  },
  {
    id: 'notifications',
    name: 'Notification Service',
    description: 'Отправка email, push-уведомлений, SMS. Допустима небольшая задержка (минуты). Высокий объём при акциях.',
    loadType: 'Write-heavy, асинхронный, пиковые нагрузки',
    correctType: 'stateless',
    correctStrategy: 'Scale Out (X-axis) + очередь сообщений',
    correctStateStorage: 'Kafka / RabbitMQ (очередь) + PostgreSQL (лог доставки)',
    explanation: 'Уведомления — идеальный кандидат для асинхронной обработки. Сообщения кладутся в очередь (Kafka/RabbitMQ), N воркеров забирают и отправляют. Stateless: любой воркер обработает любое сообщение. При Black Friday — добавляем воркеров.',
  },
]

const typeOptions = ['stateless', 'stateful'] as const
const strategyOptions = [
  'Scale Up',
  'Scale Out (X-axis)',
  'Scale Out (X-axis) + кэширование',
  'Scale Out (X-axis) + вынос состояния в Redis',
  'Scale Out (X-axis) + Y-axis (отдельный сервис) + Z-axis (шардинг индекса)',
  'Scale Up (БД) + Z-axis (шардинг по user_id) при росте',
  'Scale Out (X-axis) + очередь сообщений',
]

export function Task1_3_Solution() {
  const [answers, setAnswers] = useState<Record<string, { type: string; strategy: string }>>({})
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [showAll, setShowAll] = useState(false)

  const setAnswer = (id: string, field: 'type' | 'strategy', value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }))
  }

  const revealComponent = (id: string) => {
    setRevealed((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const revealAll = () => {
    setShowAll(true)
    setRevealed(new Set(ecommerceComponents.map((c) => c.id)))
  }

  const getScore = () => {
    let correct = 0
    let total = 0
    ecommerceComponents.forEach((comp) => {
      const answer = answers[comp.id]
      if (answer) {
        total += 2
        if (answer.type === comp.correctType) correct++
        if (answer.strategy === comp.correctStrategy) correct++
      }
    })
    return { correct, total }
  }

  const score = getScore()

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Стратегия масштабирования: E-commerce система</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Для каждого компонента определите тип (stateless/stateful) и выберите стратегию масштабирования.
        Затем проверьте себя, раскрыв правильные ответы.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', alignItems: 'center' }}>
        <button
          onClick={revealAll}
          style={{
            padding: '0.5rem 1rem',
            background: '#263238',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          Показать все ответы
        </button>
        {score.total > 0 && (
          <span style={{ fontSize: '0.85rem', color: '#666' }}>
            Совпадений: {score.correct}/{score.total}
          </span>
        )}
      </div>

      {ecommerceComponents.map((comp) => {
        const isRevealed = revealed.has(comp.id) || showAll
        const answer = answers[comp.id] || { type: '', strategy: '' }
        const typeCorrect = answer.type === comp.correctType
        const strategyCorrect = answer.strategy === comp.correctStrategy

        return (
          <div
            key={comp.id}
            style={{
              marginBottom: '1rem',
              border: `1px solid ${isRevealed ? '#4caf50' : '#e0e0e0'}`,
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ padding: '1rem', background: isRevealed ? '#f1f8e9' : '#fafafa' }}>
              <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem' }}>{comp.name}</h3>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#666' }}>{comp.description}</p>
              <span style={{ padding: '0.2rem 0.5rem', background: '#e0e0e0', borderRadius: '4px', fontSize: '0.75rem' }}>
                {comp.loadType}
              </span>
            </div>

            {/* Answer inputs */}
            <div style={{ padding: '1rem', borderTop: '1px solid #e0e0e0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
                    Тип {isRevealed && (typeCorrect ? ' ✅' : answer.type ? ' ❌' : '')}
                  </label>
                  <select
                    value={answer.type}
                    onChange={(e) => setAnswer(comp.id, 'type', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px' }}
                  >
                    <option value="">Выберите...</option>
                    {typeOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
                    Стратегия {isRevealed && (strategyCorrect ? ' ✅' : answer.strategy ? ' ❌' : '')}
                  </label>
                  <select
                    value={answer.strategy}
                    onChange={(e) => setAnswer(comp.id, 'strategy', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px' }}
                  >
                    <option value="">Выберите...</option>
                    {strategyOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {!isRevealed && (
                <button
                  onClick={() => revealComponent(comp.id)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    background: 'white',
                    border: '1px solid #1976d2',
                    color: '#1976d2',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  Показать ответ
                </button>
              )}

              {isRevealed && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div style={{ padding: '0.5rem', background: '#e8f5e9', borderRadius: '6px', fontSize: '0.85rem' }}>
                      <strong>Тип:</strong> {comp.correctType}
                    </div>
                    <div style={{ padding: '0.5rem', background: '#e8f5e9', borderRadius: '6px', fontSize: '0.85rem' }}>
                      <strong>Стратегия:</strong> {comp.correctStrategy}
                    </div>
                  </div>
                  <div style={{ padding: '0.5rem', background: '#e3f2fd', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <strong>Хранение состояния:</strong> {comp.correctStateStorage}
                  </div>
                  <div style={{ padding: '0.5rem', background: '#fff3e0', borderRadius: '6px', fontSize: '0.85rem' }}>
                    <strong>Обоснование:</strong> {comp.explanation}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
