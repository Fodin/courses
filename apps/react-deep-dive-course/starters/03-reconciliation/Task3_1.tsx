import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// Элемент списка с ключом и значением
type DiffItem = {
  key: string
  value: string
}

// Тип операции diff
type DiffOpType = 'CREATE' | 'DELETE' | 'UPDATE' | 'NOOP'

// Результат diff-операции
type DiffOp = {
  type: DiffOpType
  key: string
  oldValue?: string
  newValue?: string
}

// TODO: Реализовать функцию diffArrays(before, after)
// Сравнивает два массива DiffItem по полю key и возвращает список операций:
// - CREATE: key есть только в after
// - DELETE: key есть только в before
// - UPDATE: key есть в обоих, но value изменился
// - NOOP: key есть в обоих, value одинаков
// Подсказка: используй Map для O(n) поиска
function diffArrays(before: DiffItem[], after: DiffItem[]): DiffOp[] {
  // TODO: создать beforeMap и afterMap
  // TODO: пройти по beforeMap: если key нет в after → DELETE, иначе сравнить values
  // TODO: пройти по afterMap: если key нет в before → CREATE
  // TODO: вернуть отсортированный массив (DELETE → UPDATE → CREATE → NOOP)
  return []
}

// Стили для каждого типа операции
const OP_COLORS: Record<DiffOpType, { bg: string; color: string }> = {
  CREATE: { bg: '#065f46', color: '#6ee7b7' },
  DELETE: { bg: '#7f1d1d', color: '#fca5a5' },
  UPDATE: { bg: '#78350f', color: '#fcd34d' },
  NOOP:   { bg: '#1f2937', color: '#9ca3af' },
}

let idCounter = 1

export function Task3_1() {
  const { t } = useLanguage()

  const [before, setBefore] = useState<DiffItem[]>([
    { key: 'a', value: 'Alice' },
    { key: 'b', value: 'Bob' },
    { key: 'c', value: 'Charlie' },
  ])
  const [after, setAfter] = useState<DiffItem[]>([
    { key: 'b', value: 'Bobby' },
    { key: 'c', value: 'Charlie' },
    { key: 'd', value: 'Diana' },
  ])

  // TODO: вычислить ops через diffArrays(before, after)
  const ops: DiffOp[] = [] // заменить на diffArrays(before, after)

  // TODO: вычислить counts — количество операций каждого типа
  // const counts = ops.reduce(...)

  function updateItem(
    list: DiffItem[],
    setList: (l: DiffItem[]) => void,
    idx: number,
    field: 'key' | 'value',
    val: string
  ) {
    setList(list.map((item, i) => (i === idx ? { ...item, [field]: val } : item)))
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.3.1')}</h2>

      {/* TODO: Два редактируемых списка Before / After */}
      {/* Каждый элемент: input для key + input для value + кнопка удалить */}
      {/* Кнопка "Добавить" под каждым списком */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: '#e5e7eb', marginBottom: '8px' }}>До (Before)</div>
          {before.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
              {/* TODO: input для item.key */}
              {/* TODO: input для item.value */}
              {/* TODO: кнопка удалить */}
            </div>
          ))}
          {/* TODO: кнопка "+ Добавить" */}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: '#e5e7eb', marginBottom: '8px' }}>После (After)</div>
          {after.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
              {/* TODO: input для item.key */}
              {/* TODO: input для item.value */}
              {/* TODO: кнопка удалить */}
            </div>
          ))}
          {/* TODO: кнопка "+ Добавить" */}
        </div>
      </div>

      {/* TODO: Счётчики операций (CREATE: N, UPDATE: N, DELETE: N, NOOP: N) */}

      {/* TODO: Таблица результатов diff */}
      {/* Колонки: Op (цветной бейдж), Key, Old Value, New Value */}

      <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '16px' }}>
        Реализуй diffArrays и добавь интерактивное редактирование списков
      </p>

      {/* Suppress unused variable warnings */}
      <span style={{ display: 'none' }}>{JSON.stringify({ ops, OP_COLORS, updateItem, idCounter })}</span>
    </div>
  )
}
