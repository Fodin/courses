/**
 * Cheat Sheet: Level 12 — FP в React
 *
 * Используйте этот файл как справочник при выполнении заданий.
 * Не копируйте код напрямую — попробуйте написать самостоятельно.
 */

import { useState, useCallback, useEffect, type ReactNode } from 'react'
import { produce } from 'immer'

// ============================================================
// 1. Иммутабельный стейт: useReducer + Immer
// ============================================================

// Pure reducer: принимает state и action, возвращает новый state
// Immer позволяет мутировать draft — реальный state остаётся неизменным

type ExampleAction =
  | { type: 'INCREMENT' }
  | { type: 'SET'; value: number }

interface CounterState { count: number }

const counterReducer = (state: CounterState, action: ExampleAction): CounterState =>
  produce(state, draft => {
    switch (action.type) {
      case 'INCREMENT':
        draft.count++   // мутация! но это безопасно внутри produce
        break
      case 'SET':
        draft.count = action.value
        break
    }
  })

// Undo/Redo: History = { past[], present, future[] }
//
// dispatch(action):
//   past = [...past, present]
//   present = reducer(present, action)
//   future = []
//
// undo():
//   если past пуст — возвращаем без изменений
//   present = last(past)
//   past = past.slice(0, -1)
//   future = [present, ...future]   (прежний present → в future)
//
// redo():
//   если future пуст — возвращаем без изменений
//   present = future[0]
//   past = [...past, present]       (прежний present → в past)
//   future = future.slice(1)

// ============================================================
// 2. Валидация: pipe правил
// ============================================================

// Правило: принимает строку, возвращает массив ошибок
type ValidationRule = (value: string) => string[]

// pipeRules: запускает все правила и объединяет результаты
function pipeRules(...rules: ValidationRule[]): ValidationRule {
  return (value: string) => rules.flatMap(rule => rule(value))
}

// Фабрики правил
const checkRequired = (msg: string): ValidationRule =>
  value => value.trim().length === 0 ? [msg] : []

const checkMinLength = (min: number, msg: string): ValidationRule =>
  value => value.trim().length > 0 && value.trim().length < min ? [msg] : []

const checkPattern = (pattern: RegExp, msg: string): ValidationRule =>
  value => value.trim().length > 0 && !pattern.test(value.trim()) ? [msg] : []

// Пример использования:
const validate = pipeRules(
  checkRequired('Поле обязательно'),
  checkMinLength(3, 'Минимум 3 символа'),
  checkPattern(/^[a-zA-Z]+$/, 'Только латиница')
)

// validate('') → ['Поле обязательно']
// validate('ab') → ['Минимум 3 символа']
// validate('ab1') → ['Только латиница']
// validate('abc') → []   ← всё ок

// Хук useValidation
function useValidation(rules: ValidationRule[]) {
  const [errors, setErrors] = useState<string[]>([])

  const touch = useCallback(
    (value: string) => setErrors(pipeRules(...rules)(value)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return { errors, touch }
}

// ============================================================
// 3. useDebouncedValue: задержка обновления значения
// ============================================================

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)   // cleanup при каждом изменении value
  }, [value, delay])

  return debounced
}

// ============================================================
// 4. useFilteredList: composable фильтры
// ============================================================

type FilterFn<T> = (item: T) => boolean

function useFilteredList<T>(items: T[], filters: FilterFn<T>[]): T[] {
  return items.filter(item => filters.every(f => f(item)))
}

// Фабрики фильтров (data-last: параметры → фильтр):
interface SampleProduct { name: string; category: string; price: number }

const byCategory = (cat: string): FilterFn<SampleProduct> =>
  item => cat === 'All' || item.category === cat

const byPriceRange = (min: number, max: number): FilterFn<SampleProduct> =>
  item => item.price >= min && item.price <= max

const bySearchTerm = (term: string): FilterFn<SampleProduct> =>
  item => item.name.toLowerCase().includes(term.toLowerCase())

// ============================================================
// 5. RemoteData: ADT для состояния загрузки
// ============================================================

// Discriminated union: дискриминант 'tag'
type RemoteData<E, A> =
  | { tag: 'NotAsked' }
  | { tag: 'Loading' }
  | { tag: 'Failure'; error: E }
  | { tag: 'Success'; data: A }

// Конструкторы
const notAsked = <E, A>(): RemoteData<E, A> => ({ tag: 'NotAsked' })
const loading  = <E, A>(): RemoteData<E, A> => ({ tag: 'Loading' })
const failure  = <E, A>(error: E): RemoteData<E, A> => ({ tag: 'Failure', error })
const success  = <E, A>(data: A): RemoteData<E, A> => ({ tag: 'Success', data })

// map: применяет функцию только к Success, остальные состояния остаются
function mapRD<E, A, B>(rd: RemoteData<E, A>, f: (a: A) => B): RemoteData<E, B> {
  if (rd.tag === 'Success') return success(f(rd.data))
  return rd as RemoteData<E, B>
}

// getOrElse: возвращает data если Success, иначе fallback
function getOrElse<E, A>(rd: RemoteData<E, A>, fallback: A): A {
  if (rd.tag === 'Success') return rd.data
  return fallback
}

// ============================================================
// 6. Match: exhaustive pattern matching компонент
// ============================================================

interface MatchProps<E, A> {
  data: RemoteData<E, A>
  notAsked: () => ReactNode
  loading: () => ReactNode
  failure: (e: E) => ReactNode
  success: (a: A) => ReactNode
}

// Generic функциональный компонент
function Match<E, A>({ data, notAsked, loading, failure, success }: MatchProps<E, A>): ReactNode {
  switch (data.tag) {
    case 'NotAsked': return notAsked()
    case 'Loading':  return loading()
    case 'Failure':  return failure(data.error)
    case 'Success':  return success(data.data)
    // TypeScript гарантирует exhaustiveness: если добавить новый tag —
    // будет ошибка компиляции о пропущенном кейсе
  }
}

// Использование:
function ExampleUsage() {
  const [rd, setRd] = useState<RemoteData<string, string[]>>(notAsked())

  return (
    <Match
      data={rd}
      notAsked={() => <p>Данные ещё не запрошены</p>}
      loading={() => <p>Загрузка...</p>}
      failure={e => <p style={{ color: 'red' }}>Ошибка: {e}</p>}
      success={items => <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>}
    />
  )
}

// ============================================================
// 7. Частые ошибки
// ============================================================

// ОШИБКА 1: Мутация state вне produce
// ❌ state.todos.push(newTodo)  — прямая мутация!
// ✅ return produce(state, draft => { draft.todos.push(newTodo) })

// ОШИБКА 2: Undo не очищает future при dispatch
// ❌ dispatch: { past: [...past, present], present: next }
//    (future не очищен — будущее становится некорректным)
// ✅ dispatch: { past: [...past, present], present: next, future: [] }

// ОШИБКА 3: useDebouncedValue без cleanup
// ❌ useEffect(() => { setTimeout(() => set(value), delay) }, [value])
//    (при быстром вводе накапливаются таймеры)
// ✅ useEffect(() => {
//      const id = setTimeout(() => set(value), delay)
//      return () => clearTimeout(id)
//    }, [value, delay])

// ОШИБКА 4: if/else вместо Match при RemoteData
// ❌ if (state === 'loading') ...
//    Легко пропустить NotAsked или Failure — нет гарантии exhaustiveness
// ✅ <Match data={rd} notAsked={...} loading={...} failure={...} success={...} />
//    TypeScript заставит покрыть все 4 кейса

export {}
