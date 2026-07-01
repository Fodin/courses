import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Task 10.3: Exactly-Once — Kafka Transactions
// Задание 10.3: Exactly-Once — транзакции Kafka
// ============================================
//
// Goal: implement a step-by-step Kafka transaction API simulator.
// Цель: реализовать пошаговый симулятор транзакционного API Kafka.
// Two scenarios: successful commit (3 topics atomically) and failure with rollback.
// Два сценария: успешный коммит (3 топика атомарно) и сбой с откатом.
// The simulator visualizes the Transaction Coordinator role
// Симулятор визуализирует роль Transaction Coordinator
// and the __transaction_state topic.
// и работу топика __transaction_state.

// TODO: Define type TxState — union type of 7 values:
// TODO: Определи тип TxState — union type из 7 значений:
// 'idle' | 'begin' | 'produce' | 'commit' | 'abort' | 'committed' | 'aborted'
// type TxState = ...

// TODO: Define interface TxMessage:
// TODO: Определи интерфейс TxMessage:
//   topic: string
//   partition: number
//   key: string
//   value: string
//   txId: string
// interface TxMessage { ... }

// TODO: Define type for a transaction step (can be interface or type):
// TODO: Определи тип для шага транзакции (можно как interface или type):
//   state: TxState
//   label: string
//   description: string
//   coordinatorAction: string
// type TxStep = { ... }

// TODO: Create array TX_MESSAGES of 3 messages (txId: 'tx-001'):
// TODO: Создай массив TX_MESSAGES из 3 сообщений (txId: 'tx-001'):
// 1. topic: 'payments',      partition: 0, key: 'order-42', value: '{"status":"PAID","amount":500}'
// 2. topic: 'inventory',     partition: 2, key: 'item-99',  value: '{"reserved":1,"orderId":"order-42"}'
// 3. topic: 'notifications', partition: 1, key: 'user-7',   value: '{"type":"PAYMENT_CONFIRMED"}'
// const TX_MESSAGES: TxMessage[] = [...]

// TODO: Create array TX_STEPS (successful commit) of 3 steps:
// TODO: Создай массив TX_STEPS (успешный коммит) из 3 шагов:
// 1. state: 'begin', label: '1. beginTransaction()'
//    description: 'Producer starts a transaction. Transaction Coordinator registers the TX in __transaction_state,
//    description: 'Producer начинает транзакцию. Transaction Coordinator регистрирует TX в __transaction_state,
//                  assigns an epoch for fencing zombie producers.'
//                  присваивает epoch для фенсинга зомби-продюсеров.'
//    coordinatorAction: 'Write to __transaction_state: {txId:"tx-001", state:ONGOING, epoch:1}'
//    coordinatorAction: 'Запись в __transaction_state: {txId:"tx-001", state:ONGOING, epoch:1}'
//
// 2. state: 'produce', label: '2. produce() to multiple topics'
//    2. state: 'produce', label: '2. produce() в несколько топиков'
//    description: 'Producer atomically writes messages to payments, inventory, notifications.
//    description: 'Producer атомарно записывает сообщения в payments, inventory, notifications.
//                  Messages are visible to consumer only in read_committed mode after commit.'
//                  Сообщения видны consumer-у только в режиме read_committed после commit.'
//    coordinatorAction: 'Tracking partitions: payments-0, inventory-2, notifications-1'
//    coordinatorAction: 'Tracking partitions: payments-0, inventory-2, notifications-1'
//
// 3. state: 'commit', label: '3. commitTransaction()'
//    description: 'Producer requests commit from Transaction Coordinator. Coordinator writes
//    description: 'Producer запрашивает commit у Transaction Coordinator. Coordinator записывает
//                  PREPARE_COMMIT, then COMMITTED to __transaction_state. Data becomes visible.'
//                  PREPARE_COMMIT, затем COMMITTED в __transaction_state. Данные становятся видимы.'
//    coordinatorAction: '__transaction_state: {txId:"tx-001", state:COMMITTED}'
// const TX_STEPS: TxStep[] = [...]

// TODO: Create array ABORT_STEPS (failure and abort) of 3 steps:
// TODO: Создай массив ABORT_STEPS (сбой и откат) из 3 шагов:
// 1. state: 'begin', label: '1. beginTransaction()'
//    description: 'Producer starts a transaction. Transactional ID must be stable across producer restarts.'
//    description: 'Producer начинает транзакцию. Транзакционный ID должен быть стабильным при перезапуске producer-а.'
//    coordinatorAction: 'Write to __transaction_state: {txId:"tx-002", state:ONGOING, epoch:1}'
//    coordinatorAction: 'Запись в __transaction_state: {txId:"tx-002", state:ONGOING, epoch:1}'
//
// 2. state: 'produce', label: '2. produce() — partial write'
//    2. state: 'produce', label: '2. produce() — частичная запись'
//    description: 'Only the first message was written. Simulating failure: producer crash / network error / timeout.'
//    description: 'Записано только первое сообщение. Симуляция сбоя: producer crash / network error / timeout.'
//    coordinatorAction: 'Tracking partitions: payments-0 (ONLY payments written!)'
//    coordinatorAction: 'Tracking partitions: payments-0 (ТОЛЬКО payments записан!)'
//
// 3. state: 'abort', label: '3. abortTransaction() / Timeout'
//    description: 'Producer calls abortTransaction() or Transaction Coordinator automatically aborts
//    description: 'Producer вызывает abortTransaction() или Transaction Coordinator автоматически прерывает
//                  the transaction after transaction.timeout.ms (15 min by default). All partial writes are rolled back.'
//                  транзакцию по transaction.timeout.ms (15 мин по умолчанию). Все частичные записи откатываются.'
//    coordinatorAction: '__transaction_state: {txId:"tx-002", state:ABORTED} → sending abort markers to all partitions'
//    coordinatorAction: '__transaction_state: {txId:"tx-002", state:ABORTED} → отправка abort markers во все partitions'
// const ABORT_STEPS: TxStep[] = [...]

export function Task10_3() {
  const { t } = useLanguage()

  // TODO: State mode: 'commit' | 'abort' — current scenario (initially 'commit')
  // TODO: Состояние mode: 'commit' | 'abort' — текущий сценарий (начально 'commit')
  const [mode, setMode] = useState<'commit' | 'abort'>('commit')

  // TODO: State stepIndex: number — current step (initially -1, meaning "not started yet")
  // TODO: Состояние stepIndex: number — текущий шаг (начально -1, то есть "ещё не начали")
  const [stepIndex, setStepIndex] = useState(-1)

  // TODO: State producerConfig — object with 4 fields:
  // TODO: Состояние producerConfig — объект с 4 полями:
  // transactional_id: 'order-processor-1'
  // enable_idempotence: 'true'
  // acks: 'all'
  // retries: '2147483647'
  const [producerConfig] = useState({
    transactional_id: 'order-processor-1',
    enable_idempotence: 'true',
    acks: 'all',
    retries: '2147483647',
  })

  // TODO: Compute variables:
  // TODO: Вычисли переменные:
  // steps = mode === 'commit' ? TX_STEPS : ABORT_STEPS
  // currentStep = stepIndex >= 0 ? steps[stepIndex] : null
  // const steps = ...
  // const currentStep = ...

  // TODO: Implement handleNext:
  // TODO: Реализуй handleNext:
  // Increments stepIndex by 1 if stepIndex < steps.length - 1
  // Увеличивает stepIndex на 1, если stepIndex < steps.length - 1
  const handleNext = () => {
    // TODO: implement
    // TODO: реализовать
  }

  // TODO: Implement handleReset:
  // TODO: Реализуй handleReset:
  // Resets stepIndex to -1
  // Сбрасывает stepIndex в -1
  const handleReset = () => {
    // TODO: implement
    // TODO: реализовать
  }

  // TODO: Implement getMessageOpacity(msgIndex: number): number
  // TODO: Реализуй getMessageOpacity(msgIndex: number): number
  // - if stepIndex < 1 → 0.3
  // - если stepIndex < 1 → 0.3
  // - if mode === 'abort' && msgIndex > 0 && stepIndex >= 1 → 0.2
  // - если mode === 'abort' && msgIndex > 0 && stepIndex >= 1 → 0.2
  // - if stepIndex >= 2 → 1
  // - если stepIndex >= 2 → 1
  // - otherwise → 0.7
  // - иначе → 0.7
  const getMessageOpacity = (_msgIndex: number): number => {
    // TODO: implement
    // TODO: реализовать
    return 0.3
  }

  // TODO: Implement getMessageBorderColor(msgIndex: number): string
  // TODO: Реализуй getMessageBorderColor(msgIndex: number): string
  // - if stepIndex < 1 → '#333'
  // - если stepIndex < 1 → '#333'
  // - if mode === 'abort' && msgIndex > 0 → '#6b1a1a'
  // - если mode === 'abort' && msgIndex > 0 → '#6b1a1a'
  // - if stepIndex >= 2 → mode === 'commit' ? '#2d6a4f' : '#6b1a1a'
  // - если stepIndex >= 2 → mode === 'commit' ? '#2d6a4f' : '#6b1a1a'
  // - otherwise → '#7a4f00'
  // - иначе → '#7a4f00'
  const getMessageBorderColor = (_msgIndex: number): string => {
    // TODO: implement
    // TODO: реализовать
    return '#333'
  }

  // TODO: Compute finalState:
  // TODO: Вычисли finalState:
  // If stepIndex === steps.length - 1:
  // Если stepIndex === steps.length - 1:
  //   mode === 'commit' → 'COMMITTED'
  //   mode === 'commit' → 'COMMITTED'
  //   mode === 'abort'  → 'ABORTED'
  //   mode === 'abort'  → 'ABORTED'
  // Otherwise → null
  // Иначе → null
  // const finalState = ...

  return (
    <div className="exercise-container">
      <h2>{t('task.10.3')}</h2>

      {/* TODO: Mode toggle buttons:
          TODO: Кнопки переключения режима:
          1. "Successful Commit"
             background: mode === 'commit' ? '#2d6a4f' : '#222'
             onClick: setMode('commit'); setStepIndex(-1)
          2. "Failure & Abort"
             2. "Сбой и откат"
             background: mode === 'abort' ? '#6b1a1a' : '#222'
             onClick: setMode('abort'); setStepIndex(-1) */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {/* TODO: buttons */}
        {/* TODO: кнопки */}
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Left column — Producer Config + messages */}
        {/* Левая колонка — Producer Config + сообщения */}
        <div style={{ flex: '1 1 320px' }}>
          {/* TODO: "Producer Config" block (background '#0d1117', border '#333', monospace):
              TODO: Блок "Producer Config" (background '#0d1117', border '#333', monospace):
              For each pair [k, v] from producerConfig:
              Для каждой пары [k, v] из producerConfig:
              - Key: k.replace(/_/g, '.') — color #9cdcfe
              - Ключ: k.replace(/_/g, '.') — цвет #9cdcfe
              - Value: v — color #ce9178
              - Значение: v — цвет #ce9178 */}
          <h3 style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>
            Producer Config
          </h3>
          <div
            style={{
              background: '#0d1117',
              border: '1px solid #333',
              borderRadius: '6px',
              padding: '0.6rem',
              fontFamily: 'monospace',
              fontSize: '0.78rem',
              marginBottom: '1rem',
            }}
          >
            {/* TODO: render key-value pairs */}
            {/* TODO: отрисовать пары ключ-значение */}
          </div>

          {/* TODO: TX_MESSAGES list (header "Messages in transaction"):
              TODO: Список TX_MESSAGES (заголовок "Сообщения в транзакции"):
              For each message with index i:
              Для каждого сообщения с индексом i:
              - border: getMessageBorderColor(i)
              - opacity: getMessageOpacity(i)
              - transition: 'all 0.3s'
              Content:
              Содержимое:
              - Top line: "{msg.topic} [partition {msg.partition}]" — color #888
              - Верхняя строка: "{msg.topic} [partition {msg.partition}]" — цвет #888
              - Bottom line: key (color #9cdcfe) + ' → ' (color #666) + value (color #ce9178)
              - Нижняя строка: key (цвет #9cdcfe) + ' → ' (цвет #666) + value (цвет #ce9178)
              In abort mode, if i > 0 && stepIndex >= 1:
              В режиме abort, если i > 0 && stepIndex >= 1:
              - Show label "NOT WRITTEN (failure)" in red (#f66)
              - Показать метку "НЕ ЗАПИСАН (сбой)" красным цветом (#f66) */}
          <h3 style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>
            Сообщения в транзакции
          </h3>
          {/* TODO: render messages */}
          {/* TODO: отрисовать сообщения */}

          {/* TODO: If finalState is set — show result block:
              TODO: Если finalState задан — показать итоговый блок:
              - COMMITTED: background '#0d2b1a', border '#2d6a4f', color '#4ec9b0'
              - ABORTED:   background '#2b0d0d', border '#6b1a1a', color '#f66'
              Text: "Transaction: {finalState}"
              Текст: "Транзакция: {finalState}" */}
          {null /* TODO: final status */}
          {null /* TODO: финальный статус */}
        </div>

        {/* Right column — Transaction Coordinator */}
        {/* Правая колонка — Transaction Coordinator */}
        <div style={{ flex: '1 1 320px' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>
            Transaction Coordinator
          </h3>

          {/* TODO: Steps list:
              TODO: Список шагов steps:
              For each step with index i:
              Для каждого шага с индексом i:
              - background: stepIndex > i → '#1a2d1a', stepIndex === i → '#1a1a2d', otherwise '#1a1a1a'
              - background: stepIndex > i → '#1a2d1a', stepIndex === i → '#1a1a2d', иначе '#1a1a1a'
              - border: stepIndex > i → '#2d6a4f', stepIndex === i → '#4040a0', otherwise '#333'
              - border: stepIndex > i → '#2d6a4f', stepIndex === i → '#4040a0', иначе '#333'
              Content:
              Содержимое:
              - step.label (color: stepIndex >= i → '#fff', otherwise '#666')
              - step.label (цвет: stepIndex >= i → '#fff', иначе '#666')
              - If stepIndex >= i: show step.coordinatorAction (color #888, size 0.75rem)
              - Если stepIndex >= i: показать step.coordinatorAction (цвет #888, размер 0.75rem) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
            {/* TODO: render steps */}
            {/* TODO: отрисовать шаги */}
          </div>

          {/* TODO: If currentStep is set — show description panel:
              TODO: Если currentStep задан — показать панель описания:
              - Title: currentStep.label (color #4ec9b0)
              - Заголовок: currentStep.label (цвет #4ec9b0)
              - Description: currentStep.description (color #ccc)
              - Описание: currentStep.description (цвет #ccc) */}
          {null /* TODO: current step description */}
          {null /* TODO: описание текущего шага */}

          {/* TODO: Control buttons:
              TODO: Кнопки управления:
              1. Text: stepIndex === -1 ? 'Start Simulation' : 'Next Step'
                 1. Текст: stepIndex === -1 ? 'Начать симуляцию' : 'Следующий шаг'
                 disabled: stepIndex >= steps.length - 1
                 onClick: handleNext
              2. "Reset" → handleReset
                 2. "Сброс" → handleReset */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {/* TODO: buttons */}
            {/* TODO: кнопки */}
          </div>

          {/* TODO: Info block about __transaction_state:
              TODO: Информационный блок о __transaction_state:
              Header "__transaction_state topic:"
              Заголовок "__transaction_state топик:"
              Text: "Internal Kafka topic (50 partitions by default).
              Текст: "Внутренний топик Kafka (50 partitions по умолчанию).
                      Stores state of all active and completed transactions.
                      Хранит состояние всех активных и завершённых транзакций.
                      Coordinator is determined by: hash(transactional.id) % 50"
                      Coordinator определяется по: hash(transactional.id) % 50"
              Isolation levels:
              - 'read_committed' (color #4ec9b0) — only committed transactions
              - 'read_committed' (цвет #4ec9b0) — только завершённые транзакции
              - 'read_uncommitted' (color #ce9178) — all messages (default)
              - 'read_uncommitted' (цвет #ce9178) — все сообщения (по умолчанию) */}
          <div
            style={{
              marginTop: '1rem',
              background: '#0d1117',
              border: '1px solid #333',
              borderRadius: '6px',
              padding: '0.6rem',
              fontSize: '0.78rem',
              color: '#888',
            }}
          >
            {/* TODO: text */}
            {/* TODO: текст */}
          </div>
        </div>
      </div>
    </div>
  )
}
