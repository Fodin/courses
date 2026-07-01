import { useState, useEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 17.1: E-Commerce — архитектура заказа
// Task 17.1: E-Commerce — Order Architecture
// ============================================================
//
// Goal: implement an animated flow diagram of a hybrid e-commerce
// microservice architecture. When the user clicks "Создать заказ",
// messages travel step by step through API Gateway, OrderService,
// RabbitMQ (commands) and Kafka (events) until the order is confirmed
// and an email is sent.

// TODO: Define OrderStep type. / Определите тип OrderStep.
// Values (11 total):
// 'idle' | 'api-gateway' | 'order-created' | 'payment-command'
// | 'payment-processing' | 'payment-done' | 'inventory-command'
// | 'inventory-reserved' | 'order-confirmed' | 'notification-sent' | 'complete'
// type OrderStep = ...

// TODO: Define the FlowMessage interface. / Определите интерфейс FlowMessage.
// Fields: id: number, from: string, to: string, text: string,
//         broker: 'rabbitmq' | 'kafka' | 'http', step: OrderStep
// interface FlowMessage { ... }

// TODO: Declare FLOW_MESSAGES: FlowMessage[] — 10 messages describing the flow: / Объявите FLOW_MESSAGES: FlowMessage[] — 10 сообщений, описывающих поток:
// 1. Client → API Gateway (http): 'POST /orders'
// 2. API Gateway → OrderService (http): 'CreateOrder command'
// 3. OrderService → RabbitMQ (rabbitmq): 'order.commands → ProcessPayment'
// 4. RabbitMQ → PaymentService (rabbitmq): 'Consume ProcessPayment'
// 5. PaymentService → Kafka (kafka): 'payment-events → PaymentCompleted'
// 6. OrderService → RabbitMQ (rabbitmq): 'order.commands → ReserveInventory'
// 7. RabbitMQ → InventoryService (rabbitmq): 'Consume ReserveInventory'
// 8. InventoryService → Kafka (kafka): 'inventory-events → ItemReserved'
// 9. Kafka → OrderService (kafka): 'order-events → OrderConfirmed'
// 10. Kafka → NotificationService (kafka): 'notification-events → SendEmail'
// const FLOW_MESSAGES: FlowMessage[] = [...]

// TODO: Declare STEP_LABELS: Record<OrderStep, string> / Объявите STEP_LABELS: Record<OrderStep, string>
// Human-readable Russian description for each OrderStep value. / Человекочитаемое описание на русском для каждого значения OrderStep.
// const STEP_LABELS: Record<OrderStep, string> = { ... }

// TODO: Declare BROKER_COLORS: { rabbitmq: string; kafka: string; http: string } / Объявите BROKER_COLORS
// rabbitmq → '#ff6600', kafka → '#3a7ebf', http → '#38a169'
// const BROKER_COLORS = { ... }

// TODO: Declare BROKER_LABELS: { rabbitmq: string; kafka: string; http: string } / Объявите BROKER_LABELS
// rabbitmq → 'RabbitMQ (команды)', kafka → 'Kafka (события)', http → 'HTTP/REST'
// const BROKER_LABELS = { ... }

// TODO: Declare SERVICE_POSITIONS: Record<string, { x: number; y: number; color: string }> / Объявите SERVICE_POSITIONS
// 8 nodes: Client, API Gateway, OrderService, RabbitMQ, PaymentService,
//          Kafka, InventoryService, NotificationService
// Choose x/y coordinates that fit in a 650×360 viewBox. / Выберите координаты x/y, помещающиеся в viewBox 650×360.
// const SERVICE_POSITIONS: Record<string, { x: number; y: number; color: string }> = { ... }

// TODO: Declare node dimensions / Объявите размеры узлов
// const NODE_W = 110
// const NODE_H = 36

// TODO: Implement getNodeCenter(name: string): { cx: number; cy: number } / Реализуйте getNodeCenter
// Returns the center point of a service node rectangle. / Возвращает центральную точку прямоугольника узла сервиса.
// cx = SERVICE_POSITIONS[name].x + NODE_W / 2
// cy = SERVICE_POSITIONS[name].y + NODE_H / 2
// function getNodeCenter(name: string): { cx: number; cy: number } { ... }

export function Task17_1() {
  const { t } = useLanguage()

  // TODO: Declare state: / Объявите состояние:
  // currentStep: number — index into FLOW_MESSAGES (-1 = idle)
  // running: boolean — whether animation is in progress
  // speed: number — delay between steps in ms (initial: 1200)
  // timerRef via useRef<ReturnType<typeof setTimeout> | null>(null)
  const [currentStep, setCurrentStep] = useState(-1)
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState(1200)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // TODO: Derive visibleMessages — all messages up to and including currentStep / Получите visibleMessages — все сообщения до currentStep включительно
  // const visibleMessages = FLOW_MESSAGES.slice(0, currentStep + 1)

  // TODO: Derive currentStepName: OrderStep / Получите currentStepName: OrderStep
  // If currentStep < 0 → 'idle', otherwise FLOW_MESSAGES[currentStep].step / Если currentStep < 0 → 'idle', иначе FLOW_MESSAGES[currentStep].step
  // const currentStepName: OrderStep = ...

  // TODO: Implement startFlow: / Реализуйте startFlow:
  // Set currentStep to -1 and running to true. / Установите currentStep в -1 и running в true.
  const startFlow = () => {
    // TODO: implement
  }

  // TODO: Implement useEffect for auto-advance: / Реализуйте useEffect для авто-продвижения:
  // When running === true and currentStep < FLOW_MESSAGES.length - 1: / Когда running === true и currentStep < FLOW_MESSAGES.length - 1:
  //   set a setTimeout(speed) that increments currentStep by 1. / установите setTimeout(speed), который увеличивает currentStep на 1.
  // When currentStep reaches the last message, set running to false. / Когда currentStep достигает последнего сообщения, установите running в false.
  // Return cleanup to clear the timer. / Верните функцию очистки для удаления таймера.
  // Dependency array: [running, currentStep, speed]
  useEffect(() => {
    // TODO: implement
  }, [running, currentStep, speed])

  // TODO: Implement reset: / Реализуйте reset:
  // Clear timerRef, set running to false, set currentStep to -1. / Очистите timerRef, установите running в false, currentStep в -1.
  const reset = () => {
    // TODO: implement
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.17.1')}</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Нажми «Создать заказ» и наблюдай, как сообщения текут через RabbitMQ (команды)
        и Kafka (события). Оранжевый — RabbitMQ, синий — Kafka, зелёный — HTTP.
      </p>

      {/* TODO: SVG diagram (viewBox="0 0 650 360"). / SVG-диаграмма (viewBox="0 0 650 360").
          For each visible message draw an arrow from getNodeCenter(msg.from) to getNodeCenter(msg.to). / Для каждого видимого сообщения нарисуйте стрелку от getNodeCenter(msg.from) до getNodeCenter(msg.to).
          Last active arrow: full opacity (strokeOpacity 1), strokeWidth 2.5, with text label. / Последняя активная стрелка: полная непрозрачность (strokeOpacity 1), strokeWidth 2.5, с текстовой меткой.
          Previous arrows: reduced opacity (0.35), strokeWidth 1.5. / Предыдущие стрелки: уменьшенная непрозрачность (0.35), strokeWidth 1.5.
          Arrow color = BROKER_COLORS[msg.broker]. / Цвет стрелки = BROKER_COLORS[msg.broker].
          Add <defs><marker> for each broker color (id="arrow-{broker}"). / Добавьте <defs><marker> для каждого цвета брокера.
          For each service node: rect + text, highlight (fill with node color, white text) / Для каждого узла сервиса: rect + text, выделение (заполнение цветом узла, белый текст)
          if it is the sender or receiver of the current message. / если это отправитель или получатель текущего сообщения. */}
      <div style={{ overflowX: 'auto' }}>
        {/* TODO: render <svg> */}
      </div>

      {/* TODO: Status block — shows STEP_LABELS[currentStepName], a colored dot for the / Блок статуса — показывает STEP_LABELS[currentStepName], цветную точку для
          current broker, and a step counter "шаг X / 10". / текущего брокера и счётчик шагов "шаг X / 10".
          Background changes: idle → light grey, active → light blue. / Фон меняется: idle → светло-серый, active → светло-голубой. */}
      <div style={{
        marginTop: '1rem',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        background: '#f7f7f7',
        border: '1px solid #e2e8f0',
        fontSize: '0.9rem',
        fontWeight: 600,
        color: '#999',
      }}>
        {/* TODO: render step label */}
      </div>

      {/* TODO: Message log — only render when visibleMessages.length > 0. / Лог сообщений — рендерить только когда visibleMessages.length > 0.
          Scrollable (maxHeight 180px), monospace font. / Прокручиваемый (maxHeight 180px), моноширинный шрифт.
          Each row: colored broker badge | "From → To: text" / Каждая строка: цветной бейдж брокера | "From → To: text"
          Last row has a tinted background matching broker color. / Последняя строка с фоном, соответствующим цвету брокера. */}

      {/* TODO: Legend — three horizontal items (RabbitMQ, Kafka, HTTP) / Легенда — три горизонтальных элемента (RabbitMQ, Kafka, HTTP)
          each with a short colored line and label from BROKER_LABELS. / каждый с короткой цветной линией и меткой из BROKER_LABELS. */}

      {/* TODO: Controls row: / Строка управления:
          - Button "Создать заказ" (disabled while running) → calls startFlow
          - Button "Сбросить" → calls reset
          - <select> for speed with options: Медленно (2000ms), Нормально (1200ms), Быстро (600ms) */}
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* TODO: render controls */}
      </div>

      {/* TODO: Completion block — only when currentStepName === 'complete'. / Блок завершения — только когда currentStepName === 'complete'.
          Green background, text explaining the hybrid architecture pattern. / Зелёный фон, текст, объясняющий паттерн гибридной архитектуры. */}
    </div>
  )
}
