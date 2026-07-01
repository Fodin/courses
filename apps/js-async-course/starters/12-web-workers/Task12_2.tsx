import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 12.2: postMessage и Structured Clone
// Task 12.2: postMessage and Structured Clone
// ============================================
// Продемонстрируйте какие типы данных можно передавать через postMessage,
// а какие вызовут DataCloneError. Покажите что clone — это deep copy.
//
// Demonstrate which types can be transferred via postMessage
// and which cause DataCloneError. Show that clone means deep copy.

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

// Список поддерживаемых типов для демонстрации
// List of data types for demonstration
type DataType = 'object' | 'array' | 'date' | 'map' | 'error' | 'function' | 'dom'

interface TypeInfo {
  label: string      // Человекочитаемое название / Human-readable label
  canClone: boolean  // Поддерживает ли Structured Clone? / Supports Structured Clone?
  icon: string       // Иконка для кнопки / Icon for button
  createValue: () => unknown    // Создать тестовое значение / Create test value
  displayValue: (v: unknown) => string  // Отобразить значение / Display value
}

// TODO: Заполните DATA_TYPES для всех 7 типов
// TODO: Fill DATA_TYPES for all 7 types
// Формат:
// Format:
// const DATA_TYPES: Record<DataType, TypeInfo> = {
//   object: {
//     label: 'Object',
//     canClone: true,
//     icon: '{}',
//     createValue: () => ({ name: 'Alice', score: 42, nested: { x: 1 } }),
//     displayValue: (v) => JSON.stringify(v),
//   },
//   array: { ... canClone: true ... },
//   date: { ... canClone: true ... },
//   map: { ... canClone: true ... },
//   error: { ... canClone: true ... },
//   function: { ... canClone: false ... },  // DataCloneError
//   dom: { ... canClone: false ... },       // DataCloneError
// }

// -----------------------------------------------
// Код воркера / Worker code
// -----------------------------------------------

// TODO: Код воркера, который изменяет полученные данные и отправляет обратно
// TODO: Worker code that modifies received data and sends it back
// Воркер должен:
// Worker should:
//   - Получить данные через self.onmessage
//   - Изменить их (например, data.name = 'MODIFIED_IN_WORKER')
//   - Отправить обратно { received: JSON.stringify(data), modified: true }
//
// const CLONE_WORKER_CODE = `
//   self.onmessage = function(e) { ... }
// `

export function Task12_2() {
  const { t } = useLanguage()

  // TODO: Выбранный тип данных
  // TODO: Selected data type
  // const [selectedType, setSelectedType] = useState<DataType>('object')

  // TODO: Лог сообщений { dir: 'send'|'recv'|'error'|'info', text: string }[]
  // TODO: Message log entries
  // const [log, setLog] = useState<Array<{ dir: string; text: string }>>([])

  // TODO: Значение оригинала (до отправки) для сравнения
  // TODO: Original value (before sending) for comparison
  // const [originalVal, setOriginalVal] = useState<string | null>(null)

  // -----------------------------------------------
  // TODO: Реализуйте handleSend()
  // TODO: Implement handleSend()
  // -----------------------------------------------
  // 1. Если !info.canClone → добавить в лог DataCloneError (без Worker)
  // 2. Иначе:
  //    a. Создать value через info.createValue()
  //    b. Запомнить displayBefore = info.displayValue(value)
  //    c. Добавить в лог 'send': `Отправляем: ${displayBefore}`
  //    d. Создать Inline Worker (Blob → URL → new Worker → revokeObjectURL)
  //    e. worker.postMessage(value)
  //    f. worker.onmessage → лог 'recv' + 'info' о том что оригинал не изменился
  //    g. worker.terminate()

  return (
    <div className="exercise-container">
      <h2>{t('task.12.2')}</h2>

      {/* TODO: Таблица типов — кнопки для каждого типа */}
      {/* TODO: Type table — buttons for each type */}
      {/* Кнопки с иконками, canClone ? '✓' : '✗', цвет зелёный/красный */}
      {/* Buttons with icons, canClone ? '✓' : '✗', green/red color */}

      {/* TODO: Информационный блок для выбранного типа */}
      {/* TODO: Info block for selected type */}
      {/* Описание: клонируется ли, почему */}
      {/* Description: whether cloneable and why */}

      {/* TODO: Лог */}
      {/* TODO: Log */}
      {/* Каждая запись с цветом по dir: send=синий, recv=зелёный, error=красный, info=жёлтый */}
      {/* Each entry colored by dir: send=blue, recv=green, error=red, info=yellow */}

      {/* TODO: Кнопки "Отправить <Тип> в Worker" и "Очистить лог" */}
      {/* TODO: Buttons "Send <Type> to Worker" and "Clear log" */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте демонстрацию Structured Clone
      </div>
    </div>
  )
}
