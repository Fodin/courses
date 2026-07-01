import { useState, useMemo } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// TODO 1: Объявите тип StoreOp<A>
//
// Четыре варианта:
//   Get    — ключ + функция next: (value: string | null) => A
//   Set    — ключ, значение, продолжение next: A
//   Delete — ключ, продолжение next: A
//   Return — финальное значение value: A
//
// Это описание программы как структуры данных (AST).
// Программа не выполняется при создании!
// ============================================

// type StoreOp<A> =
//   | { tag: 'Get';    key: string; next: (value: string | null) => A }
//   | { tag: 'Set';    key: string; value: string; next: A }
//   | { tag: 'Delete'; key: string; next: A }
//   | { tag: 'Return'; value: A }

// ============================================
// TODO 2: Реализуйте runInMemory
//
// runInMemory<A>(op: StoreOp<A>, store: Map<string, string>):
//   { result: A; store: Map<string, string> }
//
// Алгоритм:
//   Return — вернуть { result: op.value, store }
//   Get    — val = store.get(op.key) ?? null; рекурсивно runInMemory(op.next(val), store)
//   Set    — создать копию Map, set(key, value); рекурсивно runInMemory(op.next, newStore)
//   Delete — создать копию Map, delete(key); рекурсивно runInMemory(op.next, newStore)
//
// Важно: всегда создавайте КОПИЮ Map (new Map(store)), не мутируйте!
// ============================================

// function runInMemory<A>(op: StoreOp<A>, store: Map<string, string>):
//   { result: A; store: Map<string, string> } { ... }

// ============================================
// TODO 3: Реализуйте runAsLog
//
// runAsLog<A>(op: StoreOp<A>, log: string[] = []): string[]
//
// НЕ выполняет операции реально. Только собирает лог:
//   Get    — добавить "GET key", передать null в next (не знаем значения!)
//   Set    — добавить "SET key = value"
//   Delete — добавить "DELETE key"
//   Return — вернуть log без изменений
//
// Ключевая идея: Log-интерпретатор не знает о состоянии хранилища
// ============================================

// function runAsLog<A>(op: StoreOp<A>, log: string[] = []): string[] { ... }

// ============================================
// TODO 4: Реализуйте вспомогательные конструкторы
//
// Они упрощают построение программы:
//   get(key, next)          — создаёт { tag: 'Get', key, next }
//   set(key, value, next)   — создаёт { tag: 'Set', key, value, next }
//   del(key, next)          — создаёт { tag: 'Delete', key, next }
//   ret(value)              — создаёт { tag: 'Return', value }
// ============================================

// const get = (key: string, next: (v: string | null) => StoreOp<string>): StoreOp<string> => ...
// const set = (key: string, value: string, next: StoreOp<string>): StoreOp<string> => ...
// const del = (key: string, next: StoreOp<string>): StoreOp<string> => ...
// const ret = (value: string): StoreOp<string> => ...

// ============================================
// TODO 5: Создайте пример программы EXAMPLE_PROGRAM
//
// Программа должна:
//   1. SET user = Alice
//   2. SET role = admin
//   3. GET user (получить значение)
//   4. SET greeting = Hello, {userVal}
//   5. DELETE role
//   6. GET greeting (получить приветствие)
//   7. Return greeting
//
// Используйте конструкторы set/get/del/ret:
//   const EXAMPLE_PROGRAM: StoreOp<string> = set('user', 'Alice',
//     set('role', 'admin',
//       get('user', userVal => ...)
//     )
//   )
// ============================================

// const EXAMPLE_PROGRAM: StoreOp<string> = ...

// ============================================
// TODO 6: Реализуйте buildProgram
//
// buildProgram(steps: ProgramStep[]): StoreOp<string>
//
// Строит программу из массива шагов.
// Подсказка: идите с конца массива,
//   начните с ret('done'), оборачивайте каждый шаг.
// ============================================

type StepKind = 'Get' | 'Set' | 'Delete'

interface ProgramStep {
  kind: StepKind
  key: string
  value?: string
}

// function buildProgram(steps: ProgramStep[]): StoreOp<string> { ... }

export function Task9_3() {
  const { t } = useLanguage()
  const [steps, setSteps] = useState<ProgramStep[]>([
    { kind: 'Set', key: 'user', value: 'Alice' },
    { kind: 'Set', key: 'role', value: 'admin' },
    { kind: 'Get', key: 'user' },
    { kind: 'Delete', key: 'role' },
  ])
  const [newKey, setNewKey]     = useState('key')
  const [newValue, setNewValue] = useState('value')
  const [newKind, setNewKind]   = useState<StepKind>('Set')
  const [interpreter, setInterpreter] = useState<'memory' | 'log'>('memory')
  const [useExample, setUseExample]   = useState(false)

  void steps
  void newKey
  void newValue
  void newKind
  void interpreter
  void useExample
  void setSteps
  void setNewKey
  void setNewValue
  void setNewKind
  void setInterpreter
  void setUseExample

  // TODO 7: Постройте программу из steps или используйте EXAMPLE_PROGRAM
  // const program = useMemo(
  //   () => useExample ? EXAMPLE_PROGRAM : buildProgram(steps),
  //   [steps, useExample]
  // )
  void useMemo

  // TODO 8: Запустите оба интерпретатора через useMemo
  // const memResult = useMemo(() => { try { return runInMemory(program, new Map()) } catch { return null } }, [program])
  // const logResult = useMemo(() => { try { return runAsLog(program) } catch { return [] } }, [program])

  return (
    <div className="exercise-container">
      <h2>{t('task.9.3')}</h2>

      {/* TODO 9: Переключатель "Свои шаги" / "Пример"
          При "Свои шаги" показывать конструктор программы (TODO 10-11)
          При "Пример" — скрыть конструктор, использовать EXAMPLE_PROGRAM */}

      {/* TODO 10: Форма добавления шага
          - select: Get / Set / Delete
          - input: ключ
          - input: значение (только для Set)
          - кнопка "+ Добавить шаг"
          При добавлении: setSteps(prev => [...prev, newStep]) */}

      {/* TODO 11: Список текущих шагов с удалением
          Для каждого шага отображать: kind (цветом), key, value (если есть)
          Кнопка удаления шага */}

      {/* TODO 12: Переключатель интерпретаторов
          Кнопки "In-Memory" и "Log" */}

      {/* TODO 13: Результат In-Memory (если interpreter === 'memory')
          Таблица: ключ → значение для каждой записи в memResult.store
          Финальный результат программы */}

      {/* TODO 14: Результат Log (если interpreter === 'log')
          Список строк из logResult, каждая с цветовой пометкой:
          GET — зелёный, SET — синий, DELETE — красный */}

      <p style={{ color: '#6b7280' }}>
        Реализуйте StoreOp, runInMemory и runAsLog для демонстрации
      </p>
    </div>
  )
}
