// ============================================
// Задание 2.1: Состояния джоба
// Task 2.1: Job states
// ============================================
//
// RU: Реализуй интерактивную state machine джоба CI/CD.
//     Каждый джоб проходит через состояния: created → pending → running → success/failed/canceled.
//     Пользователь должен видеть текущее состояние и нажимать кнопки-события для переходов.
//
// EN: Implement an interactive CI/CD job state machine.
//     Each job goes through states: created → pending → running → success/failed/canceled.
//     User should see current state and click event buttons to trigger transitions.
// ============================================

import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// TODO (RU): Определи тип JobState — union type всех возможных состояний:
//            'created' | 'pending' | 'running' | 'success' | 'failed' | 'canceled' | 'skipped' | 'manual'
// TODO (EN): Define JobState type — a union of all possible states:
//            'created' | 'pending' | 'running' | 'success' | 'failed' | 'canceled' | 'skipped' | 'manual'
// type JobState = ...

// TODO (RU): Определи тип EventType — события, вызывающие переходы:
//            'queue' | 'start' | 'succeed' | 'fail' | 'cancel' | 'timeout' | 'trigger'
// TODO (EN): Define EventType — events that trigger state transitions
// type EventType = ...

// TODO (RU): Создай константу TRANSITIONS — объект, описывающий допустимые переходы.
//            Структура: { [from: JobState]: { [event: EventType]: JobState } }
//            Например: pending → { start: 'running', cancel: 'canceled' }
// TODO (EN): Create TRANSITIONS constant — object describing valid transitions.
//            Example: pending → { start: 'running', cancel: 'canceled' }
// const TRANSITIONS = { ... }

// TODO (RU): Создай объект STATE_INFO с информацией о каждом состоянии:
//            { label, icon, color, bg, border, description }
//            Цвета: success — зелёный, failed — красный, running — синий, pending — жёлтый
// TODO (EN): Create STATE_INFO with display info for each state:
//            { label, icon, color, bg, border, description }
// const STATE_INFO = { ... }

// TODO (RU): Определи тип LogEntry для записи переходов:
//            { time: string, from: JobState, to: JobState, event: string }
// TODO (EN): Define LogEntry type for transition records
// interface LogEntry { ... }

export function Task2_1() {
  const { t } = useLanguage()
  // TODO (RU): Добавь состояния через useState:
  //            - currentState: JobState (начальное: 'created')
  //            - log: LogEntry[] (начальный: [])
  // TODO (EN): Add useState for:
  //            - currentState: JobState (initial: 'created')
  //            - log: LogEntry[]
  const [state] = useState('created')

  // TODO (RU): Реализуй функцию canTransition(event) — возвращает true если переход допустим
  //            Подсказка: проверь TRANSITIONS[currentState][event]
  // TODO (EN): Implement canTransition(event) — returns true if transition is valid
  // function canTransition(event: EventType): boolean { ... }

  // TODO (RU): Реализуй функцию applyEvent(event) — применяет событие к текущему состоянию,
  //            обновляет состояние и добавляет запись в лог.
  //            Для времени используй: new Date().toLocaleTimeString('ru-RU')
  // TODO (EN): Implement applyEvent(event) — applies event, updates state, appends log entry.
  //            Use new Date().toLocaleTimeString('ru-RU') for time
  // function applyEvent(event: EventType) { ... }

  // TODO (RU): Реализуй функцию reset() — возвращает state в 'created' и очищает лог
  // TODO (EN): Implement reset() — resets state to 'created' and clears log
  // function reset() { ... }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 700, margin: '0 auto', padding: '1.5rem' }}>
      <h2 style={{ marginTop: 0 }}>{t('task.2.1.title')}</h2>

      {/* TODO (RU): Отобразить блок с текущим состоянием — иконка, название, описание, цветной фон */}
      {/* TODO (EN): Render current state block — icon, name, description, colored background */}
      <div style={{ padding: '1.5rem', border: '2px solid #ccc', borderRadius: 12, marginBottom: '1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 700 }}>{state}</div>
      </div>

      {/* TODO (RU): Отобразить все состояния как маленькие бейджи — активное выделено цветом */}
      {/* TODO (EN): Render all states as small badges — active one highlighted with color */}

      {/* TODO (RU): Отобразить кнопки событий: Queue, Start, Success, Fail, Cancel, Timeout, Manual trigger
                    Кнопка должна быть disabled если переход недопустим (canTransition возвращает false)
                    Кнопка Reset — всегда активна */}
      {/* TODO (EN): Render event buttons: Queue, Start, Success, Fail, Cancel, Timeout, Manual trigger
                    Button should be disabled if transition is not allowed
                    Reset button — always active */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
        <button>{t('task.2.1.queue')}</button>
        <button>{t('task.2.1.start')}</button>
        <button>{t('task.2.1.success')}</button>
        <button>{t('task.2.1.fail')}</button>
        <button>{t('task.2.1.cancel')}</button>
        <button>{t('task.2.1.timeout')}</button>
      </div>

      {/* TODO (RU): Отобразить лог переходов — каждая запись: время, from → to, событие
                    Если лог пуст — показать подсказку "Нажми кнопку события, чтобы начать" */}
      {/* TODO (EN): Render transition log — each entry: time, from → to, event
                    If log is empty — show hint "Click an event button to start" */}
      <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: '12px' }}>
        <div style={{ color: '#999', textAlign: 'center' }}>{t('task.2.1.logHint')}</div>
      </div>
    </div>
  )
}
