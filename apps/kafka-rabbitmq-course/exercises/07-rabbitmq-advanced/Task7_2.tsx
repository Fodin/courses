import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 7.2: RPC через RabbitMQ
// ============================================
//
// Цель: реализовать симулятор RPC-паттерна.
// Клиент генерирует correlation-id и reply-to очередь,
// отправляет запрос на rpc.queue, сервер обрабатывает и
// отвечает в reply-to очередь. Клиент сопоставляет ответ по correlation-id.

// TODO: Определи интерфейс RpcCall:
//   correlationId: string    — уникальный идентификатор вызова
//   requestBody: string      — тело запроса
//   replyTo: string          — имя временной очереди ответа
//   status: 'pending' | 'processing' | 'completed' | 'timeout'
//   response: string | null  — ответ сервера
//   startedAt: number
//   completedAt: number | null
// interface RpcCall { ... }

// TODO: Определи тип RpcStep — discriminated union (тип шага sequence diagram):
//   { type: 'client-send'; correlationId: string; msg: string }
//   { type: 'server-recv'; correlationId: string }
//   { type: 'server-process'; correlationId: string }
//   { type: 'server-reply'; correlationId: string; result: string }
//   { type: 'client-recv'; correlationId: string; result: string }
//   { type: 'timeout'; correlationId: string }
// type RpcStep = ...

// TODO: Реализуй функцию generateCorrelationId(): string
//   Возвращает строку вида `corr-${случайные 6 символов}`
// function generateCorrelationId(): string { ... }

// TODO: Создай массив RPC_OPERATIONS с 3 операциями:
//   Каждая операция: { label: string; request: string; response: () => string }
//   1. 'Получить курс USD' → запрос: { "op": "getRate", ... } → ответ с динамическим курсом
//   2. 'Подтвердить заказ' → запрос: { "op": "confirmOrder", ... } → { "status": "confirmed", ... }
//   3. 'Вычислить скидку' → запрос: { "op": "calcDiscount", ... } → { "discount": 15, ... }
// const RPC_OPERATIONS = [...]

export function Task7_2() {
  const { t } = useLanguage()

  // TODO: Состояние calls: RpcCall[] — список всех RPC-вызовов
  const [calls, setCalls] = useState<unknown[]>([])

  // TODO: Состояние sequence: RpcStep[] — шаги sequence diagram
  const [sequence, setSequence] = useState<unknown[]>([])

  // TODO: Состояние selectedOp: number — индекс выбранной операции (по умолчанию 0)
  const [selectedOp, setSelectedOp] = useState(0)

  // TODO: Состояние simulateTimeout: boolean — флаг симуляции таймаута (по умолчанию false)
  const [simulateTimeout, setSimulateTimeout] = useState(false)

  // TODO: Ref timerRef для хранения setTimeout-ов
  const timerRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  // TODO: Реализуй функцию clearAll():
  //   - Очищает все таймеры
  //   - Сбрасывает calls и sequence
  const clearAll = () => {
    // TODO: реализовать
  }

  // TODO: Реализуй вспомогательную функцию addStep(step: RpcStep):
  //   - Добавляет шаг в конец массива sequence
  // const addStep = (step: RpcStep) => { ... }

  // TODO: Реализуй функцию sendRpc():
  //   1. Сгенерируй correlationId через generateCorrelationId()
  //   2. Сгенерируй replyTo: `amq.gen-${случайные 8 символов}`
  //   3. Создай RpcCall и добавь в calls
  //   4. Добавь шаг 'client-send' в sequence
  //   5. Если simulateTimeout === true:
  //      - Через 4000 мс обнови статус на 'timeout', добавь шаг 'timeout'
  //   6. Иначе выполни полную цепочку с задержками:
  //      - 500 мс: статус → 'processing', шаг 'server-recv'
  //      - +600 мс: шаг 'server-process'
  //      - +800 мс: вычисли result = op.response(), шаг 'server-reply'
  //      - +500 мс: статус → 'completed', response = result, completedAt = Date.now(), шаг 'client-recv'
  //   7. Сохраняй таймеры в timerRef.current
  const sendRpc = () => {
    // TODO: реализовать
  }

  // TODO: Добавь useEffect для очистки таймеров при размонтировании

  // TODO: Определи маппинги для отображения шагов sequence diagram:
  //   stepIcon: Record<RpcStep['type'], string>     — иконки (эмодзи)
  //   stepColor: Record<RpcStep['type'], string>    — цвета
  //   stepLabel: Record<RpcStep['type'], string>    — подписи
  //
  // Примеры:
  //   'client-send'    → '📤', '#1565C0', 'CLIENT → rpc.queue'
  //   'server-recv'    → '📥', '#2E7D32', 'SERVER получил запрос'
  //   'server-process' → '⚙️', '#E65100', 'SERVER обрабатывает...'
  //   'server-reply'   → '📤', '#2E7D32', 'SERVER → reply-to queue'
  //   'client-recv'    → '📥', '#1565C0', 'CLIENT получил ответ'
  //   'timeout'        → '⏰', '#C62828', 'TIMEOUT — нет ответа'

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.7.2')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Симулятор RPC поверх RabbitMQ: correlation ID, reply-to queue, sequence diagram.
      </p>

      {/* TODO: Диаграмма RPC-паттерна — статичная схема:
          CLIENT → [request + reply-to + correlationId] → rpc.queue → SERVER → [response + correlationId] → reply-to → CLIENT
          Каждый блок отображается как цветной бейдж с моноширинным шрифтом */}

      {/* TODO: Панель управления:
          - Выпадающий список "Операция" из RPC_OPERATIONS
          - Чекбокс "Симулировать timeout"
          - Кнопка "Отправить RPC" → sendRpc()
          - Кнопка "Очистить" (если calls.length > 0 || sequence.length > 0) → clearAll() */}

      {/* TODO: Сетка 2 колонки:
          Левая колонка — "Активные вызовы":
            - Список карточек calls
            - Каждая карточка: correlationId (фиолетовый, mono), статус-бейдж,
              reply-to имя, ответ (если есть), RTT в мс (если completedAt)

          Правая колонка — "Sequence Diagram":
            - Тёмный фон (#1a1a2e)
            - Список шагов sequence с иконкой, подписью, correlationId
            - Для шагов client-send и client-recv/server-reply: показывать первые 40 символов данных */}

      <div style={{ color: '#aaa', fontSize: '0.85rem', marginTop: '2rem' }}>
        TODO: реализовать интерфейс задания
      </div>
    </div>
  )
}
