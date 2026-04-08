import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Task 12.3: Choreography vs Orchestration
// Задание 12.3: Хореография vs Оркестрация
// ============================================================
//
// Goal: implement an animated visualization of two approaches
// Цель: реализовать анимированную визуализацию двух подходов
// to coordinating distributed operations.
// к координации распределённых операций.
// Choreography: services react to events on their own.
// Хореография: сервисы самостоятельно реагируют на события.
// Orchestration: central Saga Controller manages the flow,
// Оркестрация: центральный Saga Controller управляет потоком,
// explicitly calling services and receiving responses.
// явно вызывая сервисы и получая ответы.

// TODO: Define type FlowStep — union of 5 strings:
// TODO: Определи тип FlowStep — объединение 5 строк:
// 'order-service' | 'payment-service' | 'inventory-service' | 'shipping-service' | 'notification-service'
// type FlowStep = ...

// TODO: Define interface ServiceNode:
// TODO: Определи интерфейс ServiceNode:
// { id: FlowStep; label: string; x: number; y: number; color: string }
// interface ServiceNode { ... }

// TODO: Declare constant SERVICES_LAYOUT: ServiceNode[] of 5 nodes:
// TODO: Объяви константу SERVICES_LAYOUT: ServiceNode[] из 5 узлов:
// { id: 'order-service',        label: 'Order\nService',        x: 60,  y: 90,  color: '#4f86f7' }
// { id: 'payment-service',      label: 'Payment\nService',      x: 200, y: 30,  color: '#38a169' }
// { id: 'inventory-service',    label: 'Inventory\nService',    x: 200, y: 150, color: '#ed8936' }
// { id: 'shipping-service',     label: 'Shipping\nService',     x: 340, y: 90,  color: '#b34ff7' }
// { id: 'notification-service', label: 'Notification\nService', x: 200, y: 260, color: '#e53e3e' }
// const SERVICES_LAYOUT: ServiceNode[] = [...]

// TODO: Define interface ChoreographyStep:
// TODO: Определи интерфейс ChoreographyStep:
// { from: FlowStep; event: string; to: FlowStep; produces: string; delay: number }
// interface ChoreographyStep { ... }

// TODO: Declare CHOREOGRAPHY_STEPS: ChoreographyStep[] of 4 steps (600ms delay each):
// TODO: Объяви CHOREOGRAPHY_STEPS: ChoreographyStep[] из 4 шагов (delay 600 мс каждый):
// { from: 'order-service',     event: 'OrderPlaced',      to: 'payment-service',      produces: 'PaymentProcessed' }
// { from: 'payment-service',   event: 'PaymentProcessed', to: 'inventory-service',    produces: 'StockReserved'    }
// { from: 'inventory-service', event: 'StockReserved',    to: 'shipping-service',     produces: 'ShipmentCreated'  }
// { from: 'shipping-service',  event: 'ShipmentCreated',  to: 'notification-service', produces: 'NotificationSent' }
// const CHOREOGRAPHY_STEPS: ChoreographyStep[] = [...]

// TODO: Define interface OrchestrationStep:
// TODO: Определи интерфейс OrchestrationStep:
// { service: FlowStep; command: string; response: string; delay: number }
// interface OrchestrationStep { ... }

// TODO: Declare ORCHESTRATION_STEPS: OrchestrationStep[] of 4 steps (600ms delay each):
// TODO: Объяви ORCHESTRATION_STEPS: OrchestrationStep[] из 4 шагов (delay 600 мс каждый):
// { service: 'payment-service',      command: 'ProcessPayment',   response: 'PaymentOK'  }
// { service: 'inventory-service',    command: 'ReserveStock',     response: 'StockOK'    }
// { service: 'shipping-service',     command: 'CreateShipment',   response: 'ShipmentOK' }
// { service: 'notification-service', command: 'SendNotification', response: 'NotifOK'    }
// const ORCHESTRATION_STEPS: OrchestrationStep[] = [...]

export function Task12_3() {
  const { t } = useLanguage()

  // TODO: States for choreography:
  // TODO: Состояния для хореографии:
  // choreoStep: number (−1 = not started), choreoRunning: boolean, choreoLog: string[]
  // choreoStep: number (−1 = не запущено), choreoRunning: boolean, choreoLog: string[]
  const [choreoStep, setChoreoStep] = useState<number>(-1)
  const [choreoRunning, setChoreoRunning] = useState(false)
  const [choreoLog, setChoreoLog] = useState<string[]>([])

  // TODO: States for orchestration:
  // TODO: Состояния для оркестрации:
  // orchStep: number (−1), orchRunning: boolean, orchLog: string[]
  // orchStep: number (−1), orchRunning: boolean, orchLog: string[]
  const [orchStep, setOrchStep] = useState<number>(-1)
  const [orchRunning, setOrchRunning] = useState(false)
  const [orchLog, setOrchLog] = useState<string[]>([])

  // TODO: Implement async runChoreography():
  // TODO: Реализуй async runChoreography():
  // 1. setChoreoRunning(true), setChoreoStep(-1), setChoreoLog([])
  // 1. setChoreoRunning(true), setChoreoStep(-1), setChoreoLog([])
  // 2. setChoreoLog(['[Order Service] Order created → publishing OrderPlaced'])
  // 2. setChoreoLog(['[Order Service] Заказ создан → публикует OrderPlaced'])
  // 3. Loop over CHOREOGRAPHY_STEPS:
  // 3. Цикл по CHOREOGRAPHY_STEPS:
  //    - await new Promise(r => setTimeout(r, step.delay))
  //    - setChoreoStep(i)
  //    - setChoreoLog(prev => [...prev, `[${step.to.replace('-', ' ')}] Received ${step.event} → processing → publishing ${step.produces}`])
  //    - setChoreoLog(prev => [...prev, `[${step.to.replace('-', ' ')}] Получил ${step.event} → обрабатывает → публикует ${step.produces}`])
  // 4. setChoreoRunning(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const runChoreography = async () => {
    // TODO: implementation
    // TODO: реализация
  }

  // TODO: Implement async runOrchestration():
  // TODO: Реализуй async runOrchestration():
  // 1. setOrchRunning(true), setOrchStep(-1), setOrchLog([])
  // 1. setOrchRunning(true), setOrchStep(-1), setOrchLog([])
  // 2. setOrchLog(['[Orchestrator] Received CreateOrder command — starting saga'])
  // 2. setOrchLog(['[Orchestrator] Получил команду CreateOrder — начинает saga'])
  // 3. Loop over ORCHESTRATION_STEPS:
  // 3. Цикл по ORCHESTRATION_STEPS:
  //    - await new Promise(r => setTimeout(r, step.delay))
  //    - setOrchStep(i)
  //    - setOrchLog(prev => [...prev,
  //        `[Orchestrator → ${step.service.replace('-', ' ')}] ${step.command}`,
  //        `[${step.service.replace('-', ' ')} → Orchestrator] ${step.response}`
  //      ])
  // 4. setOrchLog(prev => [...prev, '[Orchestrator] Saga completed successfully'])
  // 4. setOrchLog(prev => [...prev, '[Orchestrator] Saga завершена успешно'])
  // 5. setOrchRunning(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const runOrchestration = async () => {
    // TODO: implementation
    // TODO: реализация
  }

  // TODO: Implement resetAll():
  // TODO: Реализуй resetAll():
  // Reset choreoStep(-1), orchStep(-1), choreoLog([]), orchLog([])
  // Сбросить choreoStep(-1), orchStep(-1), choreoLog([]), orchLog([])
  const resetAll = () => {
    setChoreoStep(-1)
    setOrchStep(-1)
    setChoreoLog([])
    setOrchLog([])
  }

  const SVG_W = 460
  const SVG_H = 320

  // TODO: Helper function getServicePos(id: FlowStep) → { x, y }
  // TODO: Вспомогательная функция getServicePos(id: FlowStep) → { x, y }
  // Finds the service in SERVICES_LAYOUT and returns { x: s.x + 50, y: s.y + 20 }
  // Находит сервис в SERVICES_LAYOUT и возвращает { x: s.x + 50, y: s.y + 20 }
  // const getServicePos = (id: FlowStep) => { ... }

  return (
    <div className="exercise-container">
      <h2>{t('task.12.3')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        {/* Two approaches to coordinating distributed operations: choreography (services react to events on their own) and orchestration (central coordinator manages the flow). */}
        {/* Два подхода к координации распределённых операций: хореография (сервисы реагируют на события самостоятельно) и оркестрация (центральный координатор управляет потоком). */}
        Two approaches to coordinating distributed operations: choreography (services react to events on their own) and orchestration (central coordinator manages the flow).
        {/* Run both and compare how events propagate. */}
        {/* Запустите оба и сравните, как события распространяются. */}
        Run both and compare how events propagate.
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Choreography block */}
        {/* Блок Хореография */}
        <div style={{ flex: '1 1 300px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '0.75rem',
          }}>
            <div style={{
              fontSize: '0.8rem', fontWeight: 700, color: '#4f86f7',
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              Choreography {/* Хореография */}
            </div>
            {/* TODO: Button "Run" / "Running...". */}
            {/* TODO: Кнопка "Запустить" / "Идёт...".
                onClick: runChoreography
                disabled: choreoRunning || orchRunning
                Style: active — background '#4f86f7', inactive — background '#eee'
                Стиль: активная — background '#4f86f7', неактивная — background '#eee'
            */}
            <button
              onClick={() => {/* TODO */}}
              disabled={choreoRunning || orchRunning}
              style={{
                padding: '0.3rem 0.75rem',
                background: choreoRunning ? '#eee' : '#4f86f7',
                color: choreoRunning ? '#999' : '#fff',
                border: 'none', borderRadius: '6px',
                cursor: choreoRunning ? 'not-allowed' : 'pointer',
                fontSize: '0.8rem', fontWeight: 600,
              }}
            >
              {choreoRunning ? 'Running...' : 'Run'} {/* {choreoRunning ? 'Идёт...' : 'Запустить'} */}
            </button>
          </div>

          {/* TODO: Choreography SVG diagram (viewBox 0 0 460 320). */}
          {/* TODO: SVG диаграмма хореографии (viewBox 0 0 460 320).
              1. Lines CHOREOGRAPHY_STEPS: from getServicePos(step.from) to getServicePos(step.to)
              1. Линии CHOREOGRAPHY_STEPS: от getServicePos(step.from) до getServicePos(step.to)
                 - active (choreoStep >= idx): stroke '#4f86f7', strokeWidth 2.5, solid
                 - active (choreoStep >= idx): stroke '#4f86f7', strokeWidth 2.5, сплошная
                 - inactive: stroke '#dde1e7', strokeWidth 1.5, strokeDasharray '5 3'
                 - if active: <text> nearby with step.event name
                 - если active: рядом <text> с именем step.event
              2. Nodes SERVICES_LAYOUT (rect 100x40, rx 8):
              2. Узлы SERVICES_LAYOUT (rect 100×40, rx 8):
                 - isActive: choreoStep >= 0 && (order-service always active OR step.to === svc.id for already passed steps)
                 - isActive: choreoStep >= 0 && (order-service всегда active ИЛИ step.to === svc.id для уже пройденных шагов)
                 - active: fill svc.color, text white
                 - active: fill svc.color, text белый
                 - inactive: fill '#fff', stroke svc.color, text in svc.color
                 - inactive: fill '#fff', stroke svc.color, text цветом svc.color
                 - label draw via svc.label.split('\n').map(line => <text>)
                 - label рисуй через svc.label.split('\n').map(line => <text>)
          */}
          <svg
            width="100%"
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            style={{ border: '1px solid #e2e8f0', borderRadius: '10px', background: '#f8fafc', display: 'block' }}
          >
            {/* TODO: choreography lines and nodes */}
            {/* TODO: линии и узлы хореографии */}
            <text x={SVG_W / 2} y={SVG_H / 2} textAnchor="middle" fontSize={12} fill="#aaa">
              TODO: Choreography SVG {/* TODO: SVG хореографии */}
            </text>
          </svg>

          {/* TODO: Choreography log. */}
          {/* TODO: Лог хореографии.
              maxHeight 130px, overflowY auto.
              If empty — "Click Run".
              Если пусто — "Нажмите Запустить".
              Otherwise: choreoLog.map → monospace lines.
              Иначе: choreoLog.map → строки моноширинным шрифтом.
          */}
          <div style={{
            marginTop: '0.75rem', maxHeight: '130px', overflowY: 'auto',
            border: '1px solid #e2e8f0', borderRadius: '8px',
            padding: '0.5rem', background: '#f8fafc',
          }}>
            {choreoLog.length === 0 ? (
              <div style={{ color: '#aaa', fontSize: '0.78rem', textAlign: 'center', padding: '0.5rem' }}>
                Click Run {/* Нажмите Запустить */}
              </div>
            ) : choreoLog.map((line, idx) => (
              <div key={idx} style={{ fontSize: '0.75rem', color: '#444', padding: '0.15rem 0', fontFamily: 'monospace' }}>
                {line}
              </div>
            ))}
          </div>
        </div>

        {/* Orchestration block */}
        {/* Блок Оркестрация */}
        <div style={{ flex: '1 1 300px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '0.75rem',
          }}>
            <div style={{
              fontSize: '0.8rem', fontWeight: 700, color: '#b34ff7',
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              Orchestration {/* Оркестрация */}
            </div>
            {/* TODO: Button "Run" / "Running...". */}
            {/* TODO: Кнопка "Запустить" / "Идёт...".
                onClick: runOrchestration
                disabled: choreoRunning || orchRunning
                Style: active — background '#b34ff7', inactive — background '#eee'
                Стиль: активная — background '#b34ff7', неактивная — background '#eee'
            */}
            <button
              onClick={() => {/* TODO */}}
              disabled={choreoRunning || orchRunning}
              style={{
                padding: '0.3rem 0.75rem',
                background: orchRunning ? '#eee' : '#b34ff7',
                color: orchRunning ? '#999' : '#fff',
                border: 'none', borderRadius: '6px',
                cursor: orchRunning ? 'not-allowed' : 'pointer',
                fontSize: '0.8rem', fontWeight: 600,
              }}
            >
              {orchRunning ? 'Running...' : 'Run'} {/* {orchRunning ? 'Идёт...' : 'Запустить'} */}
            </button>
          </div>

          {/* TODO: Orchestration SVG diagram (viewBox 0 0 460 320). */}
          {/* TODO: SVG диаграмма оркестрации (viewBox 0 0 460 320).
              1. Central rectangle ORCHESTRATOR (translate 180, 120), size 100x50, rx 10:
              1. Центральный прямоугольник ORCHESTRATOR (translate 180, 120), размер 100×50, rx 10:
                 - active (orchStep >= 0): fill '#b34ff7', text white
                 - active (orchStep >= 0): fill '#b34ff7', text белый
                 - inactive: fill '#fff', stroke '#b34ff7', text color '#b34ff7'
                 - inactive: fill '#fff', stroke '#b34ff7', text цвет '#b34ff7'
                 - two lines of text: 'ORCHESTRATOR' and '(Saga Controller)'
                 - два ряда текста: 'ORCHESTRATOR' и '(Saga Controller)'
              2. ORCHESTRATION_STEPS: lines from orchCenter {230, 145} to getServicePos(step.service)
              2. ORCHESTRATION_STEPS: линии от orchCenter {230, 145} до getServicePos(step.service)
                 - active (orchStep >= idx): stroke '#b34ff7', strokeWidth 2.5, solid
                 - active (orchStep >= idx): stroke '#b34ff7', strokeWidth 2.5, сплошная
                 - inactive: stroke '#dde1e7', strokeWidth 1.5, strokeDasharray '5 3'
                 - if active: <text> with step.command name
                 - если active: <text> с именем step.command
              3. Service nodes — same as choreography (rect 100x40, isActive = orchStep >= idx)
              3. Узлы сервисов — аналогично хореографии (rect 100×40, isActive = orchStep >= idx)
          */}
          <svg
            width="100%"
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            style={{ border: '1px solid #e2e8f0', borderRadius: '10px', background: '#f8fafc', display: 'block' }}
          >
            {/* TODO: orchestrator and lines to services */}
            {/* TODO: оркестратор и линии к сервисам */}
            <text x={SVG_W / 2} y={SVG_H / 2} textAnchor="middle" fontSize={12} fill="#aaa">
              TODO: Orchestration SVG {/* TODO: SVG оркестрации */}
            </text>
          </svg>

          {/* TODO: Orchestration log — same as choreography log */}
          {/* TODO: Лог оркестрации — аналогично логу хореографии */}
          <div style={{
            marginTop: '0.75rem', maxHeight: '130px', overflowY: 'auto',
            border: '1px solid #e2e8f0', borderRadius: '8px',
            padding: '0.5rem', background: '#f8fafc',
          }}>
            {orchLog.length === 0 ? (
              <div style={{ color: '#aaa', fontSize: '0.78rem', textAlign: 'center', padding: '0.5rem' }}>
                Click Run {/* Нажмите Запустить */}
              </div>
            ) : orchLog.map((line, idx) => (
              <div key={idx} style={{ fontSize: '0.75rem', color: '#444', padding: '0.15rem 0', fontFamily: 'monospace' }}>
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reset button */}
      {/* Кнопка Сбросить */}
      <button
        onClick={resetAll}
        style={{
          marginTop: '1rem',
          padding: '0.4rem 1rem',
          background: '#f0f0f0',
          border: '1px solid #ddd',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.83rem',
          color: '#555',
        }}
      >
        Reset {/* Сбросить */}
      </button>

      {/* TODO: Comparison block — two blocks in grid (1fr 1fr). */}
      {/* TODO: Блок сравнения — два блока в grid (1fr 1fr).
          Choreography (background '#ebf4ff', border '#bee3f8', title color '#2b6cb0'):
          Хореография (фон '#ebf4ff', border '#bee3f8', title цвет '#2b6cb0'):
            + High autonomy
            + Высокая автономность
            + No single point of failure
            + Нет единой точки отказа
            + Loose coupling
            + Слабая связанность
            - Hard to trace flow
            - Сложно отследить поток
            - Hard to manage compensation
            - Трудно управлять компенсацией
          Orchestration (background '#f3e8ff', border '#d6bcfa', title color '#6b21a8'):
          Оркестрация (фон '#f3e8ff', border '#d6bcfa', title цвет '#6b21a8'):
            + Transparent control flow
            + Прозрачный поток управления
            + Convenient for compensations
            + Удобна для компенсаций
            + Easy to debug
            + Легко отлаживать
            - Orchestrator is a bottleneck
            - Оркестратор — узкое место
            - Tighter coupling
            - Более жёсткая связанность
      */}
      <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ padding: '0.75rem', background: '#ebf4ff', borderRadius: '8px', border: '1px solid #bee3f8', fontSize: '0.8rem' }}>
          <div style={{ fontWeight: 700, color: '#2b6cb0', marginBottom: '0.4rem' }}>Choreography {/* Хореография */}</div>
          {/* TODO: pros and cons */}
          {/* TODO: плюсы и минусы */}
          <p style={{ color: '#aaa' }}>TODO</p>
        </div>
        <div style={{ padding: '0.75rem', background: '#f3e8ff', borderRadius: '8px', border: '1px solid #d6bcfa', fontSize: '0.8rem' }}>
          <div style={{ fontWeight: 700, color: '#6b21a8', marginBottom: '0.4rem' }}>Orchestration {/* Оркестрация */}</div>
          {/* TODO: pros and cons */}
          {/* TODO: плюсы и минусы */}
          <p style={{ color: '#aaa' }}>TODO</p>
        </div>
      </div>
    </div>
  )
}
