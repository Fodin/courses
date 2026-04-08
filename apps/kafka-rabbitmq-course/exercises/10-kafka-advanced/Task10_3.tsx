import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 10.3: Exactly-Once — транзакции Kafka
// ============================================
//
// Цель: реализовать пошаговый симулятор транзакционного API Kafka.
// Два сценария: успешный коммит (3 топика атомарно) и сбой с откатом.
// Симулятор визуализирует роль Transaction Coordinator
// и работу топика __transaction_state.

// TODO: Определи тип TxState — union type из 7 значений:
// 'idle' | 'begin' | 'produce' | 'commit' | 'abort' | 'committed' | 'aborted'
// type TxState = ...

// TODO: Определи интерфейс TxMessage:
//   topic: string
//   partition: number
//   key: string
//   value: string
//   txId: string
// interface TxMessage { ... }

// TODO: Определи тип для шага транзакции (можно как interface или type):
//   state: TxState
//   label: string
//   description: string
//   coordinatorAction: string
// type TxStep = { ... }

// TODO: Создай массив TX_MESSAGES из 3 сообщений (txId: 'tx-001'):
// 1. topic: 'payments',      partition: 0, key: 'order-42', value: '{"status":"PAID","amount":500}'
// 2. topic: 'inventory',     partition: 2, key: 'item-99',  value: '{"reserved":1,"orderId":"order-42"}'
// 3. topic: 'notifications', partition: 1, key: 'user-7',   value: '{"type":"PAYMENT_CONFIRMED"}'
// const TX_MESSAGES: TxMessage[] = [...]

// TODO: Создай массив TX_STEPS (успешный коммит) из 3 шагов:
// 1. state: 'begin', label: '1. beginTransaction()'
//    description: 'Producer начинает транзакцию. Transaction Coordinator регистрирует TX в __transaction_state,
//                  присваивает epoch для фенсинга зомби-продюсеров.'
//    coordinatorAction: 'Запись в __transaction_state: {txId:"tx-001", state:ONGOING, epoch:1}'
//
// 2. state: 'produce', label: '2. produce() в несколько топиков'
//    description: 'Producer атомарно записывает сообщения в payments, inventory, notifications.
//                  Сообщения видны consumer-у только в режиме read_committed после commit.'
//    coordinatorAction: 'Tracking partitions: payments-0, inventory-2, notifications-1'
//
// 3. state: 'commit', label: '3. commitTransaction()'
//    description: 'Producer запрашивает commit у Transaction Coordinator. Coordinator записывает
//                  PREPARE_COMMIT, затем COMMITTED в __transaction_state. Данные становятся видимы.'
//    coordinatorAction: '__transaction_state: {txId:"tx-001", state:COMMITTED}'
// const TX_STEPS: TxStep[] = [...]

// TODO: Создай массив ABORT_STEPS (сбой и откат) из 3 шагов:
// 1. state: 'begin', label: '1. beginTransaction()'
//    description: 'Producer начинает транзакцию. Транзакционный ID должен быть стабильным при перезапуске producer-а.'
//    coordinatorAction: 'Запись в __transaction_state: {txId:"tx-002", state:ONGOING, epoch:1}'
//
// 2. state: 'produce', label: '2. produce() — частичная запись'
//    description: 'Записано только первое сообщение. Симуляция сбоя: producer crash / network error / timeout.'
//    coordinatorAction: 'Tracking partitions: payments-0 (ТОЛЬКО payments записан!)'
//
// 3. state: 'abort', label: '3. abortTransaction() / Timeout'
//    description: 'Producer вызывает abortTransaction() или Transaction Coordinator автоматически прерывает
//                  транзакцию по transaction.timeout.ms (15 мин по умолчанию). Все частичные записи откатываются.'
//    coordinatorAction: '__transaction_state: {txId:"tx-002", state:ABORTED} → отправка abort markers во все partitions'
// const ABORT_STEPS: TxStep[] = [...]

export function Task10_3() {
  const { t } = useLanguage()

  // TODO: Состояние mode: 'commit' | 'abort' — текущий сценарий (начально 'commit')
  const [mode, setMode] = useState<'commit' | 'abort'>('commit')

  // TODO: Состояние stepIndex: number — текущий шаг (начально -1, то есть "ещё не начали")
  const [stepIndex, setStepIndex] = useState(-1)

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

  // TODO: Вычисли переменные:
  // steps = mode === 'commit' ? TX_STEPS : ABORT_STEPS
  // currentStep = stepIndex >= 0 ? steps[stepIndex] : null
  // const steps = ...
  // const currentStep = ...

  // TODO: Реализуй handleNext:
  // Увеличивает stepIndex на 1, если stepIndex < steps.length - 1
  const handleNext = () => {
    // TODO: реализовать
  }

  // TODO: Реализуй handleReset:
  // Сбрасывает stepIndex в -1
  const handleReset = () => {
    // TODO: реализовать
  }

  // TODO: Реализуй getMessageOpacity(msgIndex: number): number
  // - если stepIndex < 1 → 0.3
  // - если mode === 'abort' && msgIndex > 0 && stepIndex >= 1 → 0.2
  // - если stepIndex >= 2 → 1
  // - иначе → 0.7
  const getMessageOpacity = (_msgIndex: number): number => {
    // TODO: реализовать
    return 0.3
  }

  // TODO: Реализуй getMessageBorderColor(msgIndex: number): string
  // - если stepIndex < 1 → '#333'
  // - если mode === 'abort' && msgIndex > 0 → '#6b1a1a'
  // - если stepIndex >= 2 → mode === 'commit' ? '#2d6a4f' : '#6b1a1a'
  // - иначе → '#7a4f00'
  const getMessageBorderColor = (_msgIndex: number): string => {
    // TODO: реализовать
    return '#333'
  }

  // TODO: Вычисли finalState:
  // Если stepIndex === steps.length - 1:
  //   mode === 'commit' → 'COMMITTED'
  //   mode === 'abort'  → 'ABORTED'
  // Иначе → null
  // const finalState = ...

  return (
    <div className="exercise-container">
      <h2>{t('task.10.3')}</h2>

      {/* TODO: Кнопки переключения режима:
          1. "Successful Commit"
             background: mode === 'commit' ? '#2d6a4f' : '#222'
             onClick: setMode('commit'); setStepIndex(-1)
          2. "Failure & Abort"
             background: mode === 'abort' ? '#6b1a1a' : '#222'
             onClick: setMode('abort'); setStepIndex(-1) */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {/* TODO: кнопки */}
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Левая колонка — Producer Config + сообщения */}
        <div style={{ flex: '1 1 320px' }}>
          {/* TODO: Блок "Producer Config" (background '#0d1117', border '#333', monospace):
              Для каждой пары [k, v] из producerConfig:
              - Ключ: k.replace(/_/g, '.') — цвет #9cdcfe
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
            {/* TODO: отрисовать пары ключ-значение */}
          </div>

          {/* TODO: Список TX_MESSAGES (заголовок "Сообщения в транзакции"):
              Для каждого сообщения с индексом i:
              - border: getMessageBorderColor(i)
              - opacity: getMessageOpacity(i)
              - transition: 'all 0.3s'
              Содержимое:
              - Верхняя строка: "{msg.topic} [partition {msg.partition}]" — цвет #888
              - Нижняя строка: key (цвет #9cdcfe) + ' → ' (цвет #666) + value (цвет #ce9178)
              В режиме abort, если i > 0 && stepIndex >= 1:
              - Показать метку "НЕ ЗАПИСАН (сбой)" красным цветом (#f66) */}
          <h3 style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>
            Сообщения в транзакции
          </h3>
          {/* TODO: отрисовать сообщения */}

          {/* TODO: Если finalState задан — показать итоговый блок:
              - COMMITTED: background '#0d2b1a', border '#2d6a4f', color '#4ec9b0'
              - ABORTED:   background '#2b0d0d', border '#6b1a1a', color '#f66'
              Текст: "Транзакция: {finalState}" */}
          {null /* TODO: финальный статус */}
        </div>

        {/* Правая колонка — Transaction Coordinator */}
        <div style={{ flex: '1 1 320px' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>
            Transaction Coordinator
          </h3>

          {/* TODO: Список шагов steps:
              Для каждого шага с индексом i:
              - background: stepIndex > i → '#1a2d1a', stepIndex === i → '#1a1a2d', иначе '#1a1a1a'
              - border: stepIndex > i → '#2d6a4f', stepIndex === i → '#4040a0', иначе '#333'
              Содержимое:
              - step.label (цвет: stepIndex >= i → '#fff', иначе '#666')
              - Если stepIndex >= i: показать step.coordinatorAction (цвет #888, размер 0.75rem) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
            {/* TODO: отрисовать шаги */}
          </div>

          {/* TODO: Если currentStep задан — показать панель описания:
              - Заголовок: currentStep.label (цвет #4ec9b0)
              - Описание: currentStep.description (цвет #ccc) */}
          {null /* TODO: описание текущего шага */}

          {/* TODO: Кнопки управления:
              1. Текст: stepIndex === -1 ? 'Начать симуляцию' : 'Следующий шаг'
                 disabled: stepIndex >= steps.length - 1
                 onClick: handleNext
              2. "Сброс" → handleReset */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {/* TODO: кнопки */}
          </div>

          {/* TODO: Информационный блок о __transaction_state:
              Заголовок "__transaction_state топик:"
              Текст: "Внутренний топик Kafka (50 partitions по умолчанию).
                      Хранит состояние всех активных и завершённых транзакций.
                      Coordinator определяется по: hash(transactional.id) % 50"
              Isolation levels:
              - 'read_committed' (цвет #4ec9b0) — только завершённые транзакции
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
            {/* TODO: текст */}
          </div>
        </div>
      </div>
    </div>
  )
}
