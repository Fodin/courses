import { useState, useEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 17.1: E-Commerce — архитектура заказа
// ============================================================
//
// Goal: implement an animated flow diagram of a hybrid e-commerce
// microservice architecture. When the user clicks "Создать заказ",
// messages travel step by step through API Gateway, OrderService,
// RabbitMQ (commands) and Kafka (events) until the order is confirmed
// and an email is sent.

// TODO: Define OrderStep type.
// Values (11 total):
// 'idle' | 'api-gateway' | 'order-created' | 'payment-command'
// | 'payment-processing' | 'payment-done' | 'inventory-command'
// | 'inventory-reserved' | 'order-confirmed' | 'notification-sent' | 'complete'
// type OrderStep = ...

// TODO: Define the FlowMessage interface.
// Fields: id: number, from: string, to: string, text: string,
//         broker: 'rabbitmq' | 'kafka' | 'http', step: OrderStep
// interface FlowMessage { ... }

// TODO: Declare FLOW_MESSAGES: FlowMessage[] — 10 messages describing the flow:
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

// TODO: Declare STEP_LABELS: Record<OrderStep, string>
// Human-readable Russian description for each OrderStep value.
// const STEP_LABELS: Record<OrderStep, string> = { ... }

// TODO: Declare BROKER_COLORS: { rabbitmq: string; kafka: string; http: string }
// rabbitmq → '#ff6600', kafka → '#3a7ebf', http → '#38a169'
// const BROKER_COLORS = { ... }

// TODO: Declare BROKER_LABELS: { rabbitmq: string; kafka: string; http: string }
// rabbitmq → 'RabbitMQ (команды)', kafka → 'Kafka (события)', http → 'HTTP/REST'
// const BROKER_LABELS = { ... }

// TODO: Declare SERVICE_POSITIONS: Record<string, { x: number; y: number; color: string }>
// 8 nodes: Client, API Gateway, OrderService, RabbitMQ, PaymentService,
//          Kafka, InventoryService, NotificationService
// Choose x/y coordinates that fit in a 650×360 viewBox.
// const SERVICE_POSITIONS: Record<string, { x: number; y: number; color: string }> = { ... }

// TODO: Declare node dimensions
// const NODE_W = 110
// const NODE_H = 36

// TODO: Implement getNodeCenter(name: string): { cx: number; cy: number }
// Returns the center point of a service node rectangle.
// cx = SERVICE_POSITIONS[name].x + NODE_W / 2
// cy = SERVICE_POSITIONS[name].y + NODE_H / 2
// function getNodeCenter(name: string): { cx: number; cy: number } { ... }

export function Task17_1() {
  const { t } = useLanguage()

  // TODO: Declare state:
  // currentStep: number — index into FLOW_MESSAGES (-1 = idle)
  // running: boolean — whether animation is in progress
  // speed: number — delay between steps in ms (initial: 1200)
  // timerRef via useRef<ReturnType<typeof setTimeout> | null>(null)
  const [currentStep, setCurrentStep] = useState(-1)
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState(1200)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // TODO: Derive visibleMessages — all messages up to and including currentStep
  // const visibleMessages = FLOW_MESSAGES.slice(0, currentStep + 1)

  // TODO: Derive currentStepName: OrderStep
  // If currentStep < 0 → 'idle', otherwise FLOW_MESSAGES[currentStep].step
  // const currentStepName: OrderStep = ...

  // TODO: Implement startFlow:
  // Set currentStep to -1 and running to true.
  const startFlow = () => {
    // TODO: implement
  }

  // TODO: Implement useEffect for auto-advance:
  // When running === true and currentStep < FLOW_MESSAGES.length - 1:
  //   set a setTimeout(speed) that increments currentStep by 1.
  // When currentStep reaches the last message, set running to false.
  // Return cleanup to clear the timer.
  // Dependency array: [running, currentStep, speed]
  useEffect(() => {
    // TODO: implement
  }, [running, currentStep, speed])

  // TODO: Implement reset:
  // Clear timerRef, set running to false, set currentStep to -1.
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

      {/* TODO: SVG diagram (viewBox="0 0 650 360").
          For each visible message draw an arrow from getNodeCenter(msg.from) to getNodeCenter(msg.to).
          Last active arrow: full opacity (strokeOpacity 1), strokeWidth 2.5, with text label.
          Previous arrows: reduced opacity (0.35), strokeWidth 1.5.
          Arrow color = BROKER_COLORS[msg.broker].
          Add <defs><marker> for each broker color (id="arrow-{broker}").
          For each service node: rect + text, highlight (fill with node color, white text)
          if it is the sender or receiver of the current message. */}
      <div style={{ overflowX: 'auto' }}>
        {/* TODO: render <svg> */}
      </div>

      {/* TODO: Status block — shows STEP_LABELS[currentStepName], a colored dot for the
          current broker, and a step counter "шаг X / 10".
          Background changes: idle → light grey, active → light blue. */}
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

      {/* TODO: Message log — only render when visibleMessages.length > 0.
          Scrollable (maxHeight 180px), monospace font.
          Each row: colored broker badge | "From → To: text"
          Last row has a tinted background matching broker color. */}

      {/* TODO: Legend — three horizontal items (RabbitMQ, Kafka, HTTP)
          each with a short colored line and label from BROKER_LABELS. */}

      {/* TODO: Controls row:
          - Button "Создать заказ" (disabled while running) → calls startFlow
          - Button "Сбросить" → calls reset
          - <select> for speed with options: Медленно (2000ms), Нормально (1200ms), Быстро (600ms) */}
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* TODO: render controls */}
      </div>

      {/* TODO: Completion block — only when currentStepName === 'complete'.
          Green background, text explaining the hybrid architecture pattern. */}
    </div>
  )
}
