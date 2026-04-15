import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// Узел fiber с key, value и позицией в старом дереве
type RecFiber = {
  key: string
  value: string
  index: number
}

// Тип операции reconciliation
type RecOpType = 'PLACEMENT' | 'UPDATE' | 'DELETION' | 'NOOP'

// Операция reconciliation
type RecOp = {
  type: RecOpType
  key: string
  oldIndex?: number
  newIndex?: number
  note: string
}

// Шаг алгоритма для визуализации
type RecStep = {
  phase: 1 | 2
  description: string
  currentOldKey?: string
  currentNewKey?: string
}

type RecResult = {
  ops: RecOp[]
  steps: RecStep[]
}

// TODO: Реализовать reconcileChildren(oldFibers, newElements)
// Алгоритм работает в два прохода:
//
// Фаза 1 (линейный поиск):
//   - Идём одновременно по oldFibers и newElements (oldIdx, newIdx)
//   - Если key совпадает → UPDATE (value изменился) или NOOP (без изменений)
//   - Если key НЕ совпадает → прерываем фазу 1
//   - Если один из списков кончился → обрабатываем оставшиеся (PLACEMENT или DELETION)
//
// Фаза 2 (Map-based поиск):
//   - Создаём Map<key, RecFiber> из оставшихся oldFibers
//   - Для каждого нового элемента ищем в Map:
//     - Не найден → PLACEMENT (новый)
//     - Найден, oldIndex < lastPlacedIndex → PLACEMENT (перемещение)
//     - Найден, oldIndex >= lastPlacedIndex → UPDATE или NOOP, обновляем lastPlacedIndex
//   - Всё, что осталось в Map → DELETION
//
// Собирай steps[] для пошаговой визуализации на каждом решении
function reconcileChildren(_oldFibers: RecFiber[], _newElements: RecFiber[]): RecResult {
  // TODO: реализовать алгоритм
  return { ops: [], steps: [] }
}

// Цвета для операций
const OP_COLORS: Record<RecOpType, { bg: string; color: string }> = {
  PLACEMENT: { bg: '#065f46', color: '#6ee7b7' },
  UPDATE:    { bg: '#78350f', color: '#fcd34d' },
  DELETION:  { bg: '#7f1d1d', color: '#fca5a5' },
  NOOP:      { bg: '#1f2937', color: '#9ca3af' },
}

// Пресеты для быстрого тестирования
const PRESETS = {
  addToStart: {
    label: 'Добавить в начало [B,C] -> [A,B,C]',
    old: [{ key: 'B', value: 'Bob', index: 0 }, { key: 'C', value: 'Charlie', index: 1 }],
    new: [{ key: 'A', value: 'Alice', index: 0 }, { key: 'B', value: 'Bob', index: 1 }, { key: 'C', value: 'Charlie', index: 2 }],
  },
  removeMiddle: {
    label: 'Удалить из середины [A,B,C] -> [A,C]',
    old: [{ key: 'A', value: 'Alice', index: 0 }, { key: 'B', value: 'Bob', index: 1 }, { key: 'C', value: 'Charlie', index: 2 }],
    new: [{ key: 'A', value: 'Alice', index: 0 }, { key: 'C', value: 'Charlie', index: 1 }],
  },
  reorder: {
    label: 'Переупорядочить [A,B,C,D] -> [B,C,D,A]',
    old: [
      { key: 'A', value: 'Alice', index: 0 }, { key: 'B', value: 'Bob', index: 1 },
      { key: 'C', value: 'Charlie', index: 2 }, { key: 'D', value: 'Diana', index: 3 },
    ],
    new: [
      { key: 'B', value: 'Bob', index: 0 }, { key: 'C', value: 'Charlie', index: 1 },
      { key: 'D', value: 'Diana', index: 2 }, { key: 'A', value: 'Alice', index: 3 },
    ],
  },
}

export function Task3_4() {
  const { t } = useLanguage()

  const [oldFibers, setOldFibers] = useState<RecFiber[]>(PRESETS.reorder.old)
  const [newElements, setNewElements] = useState<RecFiber[]>(PRESETS.reorder.new)
  const [result, setResult] = useState<RecResult | null>(null)
  const [stepIdx, setStepIdx] = useState(0)

  function runReconcile() {
    // TODO: вызвать reconcileChildren(oldFibers, newElements)
    // и записать результат в setResult, сбросить stepIdx = 0
  }

  function applyPreset(key: keyof typeof PRESETS) {
    const p = PRESETS[key]
    setOldFibers(p.old)
    setNewElements(p.new)
    setResult(null)
    setStepIdx(0)
  }

  const currentStep = result?.steps[stepIdx]

  return (
    <div className="exercise-container">
      <h2>{t('task.3.4')}</h2>

      {/* Пресеты */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {Object.entries(PRESETS).map(([key, p]) => (
          <button
            key={key}
            onClick={() => applyPreset(key as keyof typeof PRESETS)}
            style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', background: '#374151', color: '#d1d5db', cursor: 'pointer', fontSize: '12px' }}
          >
            {p.label}
          </button>
        ))}
        <button
          onClick={runReconcile}
          style={{ padding: '6px 18px', borderRadius: '6px', border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
        >
          Запустить reconciliation
        </button>
      </div>

      {/* Два списка для визуализации */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: '#e5e7eb', marginBottom: '8px', fontSize: '13px' }}>
            Старые fibers (current tree)
          </div>
          {oldFibers.map((item, i) => (
            <div
              key={i}
              style={{
                padding: '6px 10px',
                marginBottom: '4px',
                borderRadius: '4px',
                // TODO: подсвечивать элемент если item.key === currentStep?.currentOldKey
                background: '#1f2937',
                fontFamily: 'monospace',
                fontSize: '13px',
                color: '#e5e7eb',
              }}
            >
              [{i}] key="{item.key}" value="{item.value}"
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: '#e5e7eb', marginBottom: '8px', fontSize: '13px' }}>
            Новые элементы (JSX)
          </div>
          {newElements.map((item, i) => (
            <div
              key={i}
              style={{
                padding: '6px 10px',
                marginBottom: '4px',
                borderRadius: '4px',
                // TODO: подсвечивать элемент если item.key === currentStep?.currentNewKey
                background: '#1f2937',
                fontFamily: 'monospace',
                fontSize: '13px',
                color: '#e5e7eb',
              }}
            >
              [{i}] key="{item.key}" value="{item.value}"
            </div>
          ))}
        </div>
      </div>

      {/* TODO: Показывать текущий шаг если result !== null */}
      {/* - Панель с описанием шага (фаза 1 — синяя, фаза 2 — фиолетовая) */}
      {/* - Кнопки "Назад" / "Вперёд" / "В конец" */}
      {/* - Список итоговых операций с цветными бейджами */}

      {!result && (
        <div style={{ color: '#6b7280', fontSize: '13px', padding: '24px', textAlign: 'center', background: '#111827', borderRadius: '8px' }}>
          Реализуй reconcileChildren и нажми "Запустить reconciliation"
        </div>
      )}

      {/* Suppress warnings */}
      <span style={{ display: 'none' }}>{JSON.stringify({ currentStep, OP_COLORS, stepIdx })}</span>
    </div>
  )
}
