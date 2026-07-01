import { useState, useEffect } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 6.1: async/await vs Promise
// Task 6.1: async/await vs Promise
// ============================================
// Реализуйте интерактивный компонент с двумя параллельными
// панелями кода: слева async/await, справа Promise-цепочка.
// Implement an interactive component with two side-by-side
// code panels: async/await on the left, Promise chain on the right.

// -----------------------------------------------
// Данные / Data
// -----------------------------------------------

// Примеры для переключения / Examples to switch between
const EXAMPLES = [
  {
    label: 'Простой запрос',
    // Строки кода / Code lines
    async: [
      'async function fetchUser(id) {',
      '  const res = await fetch(`/api/users/${id}`)',
      '  const user = await res.json()',
      '  return user',
      '}',
    ],
    promise: [
      'function fetchUser(id) {',
      '  return fetch(`/api/users/${id}`)',
      '    .then(res => res.json())',
      '    .then(user => user)',
      '}',
    ],
    // Шаги: какая строка подсвечивается в каждой панели + объяснение
    // Steps: which line is highlighted in each panel + explanation
    steps: [
      { asyncLine: 0, promiseLine: 0, log: 'Вызов функции. async версия — то же самое, что return Promise.' },
      { asyncLine: 1, promiseLine: 1, log: 'await fetch(...) ≡ .then() — функция приостановлена, поток свободен.' },
      { asyncLine: 2, promiseLine: 2, log: 'await res.json() ≡ следующий .then() — распаковываем тело.' },
      { asyncLine: 3, promiseLine: 3, log: 'return user — Promise резолвится со значением user.' },
    ],
  },
  {
    label: 'С обработкой ошибки',
    async: [
      'async function safeFetch(url) {',
      '  try {',
      '    const res = await fetch(url)',
      '    return await res.json()',
      '  } catch (err) {',
      '    console.error(err)',
      '    return null',
      '  }',
      '}',
    ],
    promise: [
      'function safeFetch(url) {',
      '  return fetch(url)',
      '    .then(res => res.json())',
      '    .catch(err => {',
      '      console.error(err)',
      '      return null',
      '    })',
      '}',
      '',
    ],
    steps: [
      { asyncLine: 0, promiseLine: 0, log: 'Объявление функции. async делает её возвращающей Promise.' },
      { asyncLine: 2, promiseLine: 1, log: 'await fetch(url) — запрос ушёл, функция приостановлена.' },
      { asyncLine: 3, promiseLine: 2, log: 'Если успех: await res.json() ≡ .then(res => res.json()).' },
      { asyncLine: 4, promiseLine: 3, log: 'Если ошибка: catch (err) ≡ .catch(err => ...). Оба перехватывают reject.' },
      { asyncLine: 6, promiseLine: 5, log: 'return null — промис резолвится с null (не реджектится).' },
    ],
  },
  {
    label: 'Вложенные await',
    async: [
      'async function loadDashboard() {',
      '  const user = await fetchUser()',
      '  const posts = await fetchPosts(user.id)',
      '  const comments = await fetchComments(posts[0].id)',
      '  return { user, posts, comments }',
      '}',
    ],
    promise: [
      'function loadDashboard() {',
      '  return fetchUser()',
      '    .then(user => fetchPosts(user.id)',
      '      .then(posts => fetchComments(posts[0].id)',
      '        .then(comments =>',
      '          ({ user, posts, comments }))))',
      '}',
    ],
    steps: [
      { asyncLine: 0, promiseLine: 0, log: 'async/await читается линейно. Promise — пирамида вложенности.' },
      { asyncLine: 1, promiseLine: 1, log: 'await fetchUser() ≡ return fetchUser().then(...).' },
      { asyncLine: 2, promiseLine: 2, log: 'await fetchPosts() — Promise: вложенный .then().' },
      { asyncLine: 3, promiseLine: 3, log: 'await fetchComments() — ещё один уровень вложенности в Promise.' },
      { asyncLine: 4, promiseLine: 5, log: 'return {...} — async линеен, Promise — "пирамида смерти".' },
    ],
  },
]

// TODO: Выберите тип для одного шага
// TODO: Define type for a single step
// interface Step {
//   asyncLine: number
//   promiseLine: number
//   log: string
// }

export function Task6_1() {
  const { t } = useLanguage()

  // TODO: Состояние для индекса текущего примера (0..2)
  // TODO: State for current example index (0..2)
  // const [exampleIdx, setExampleIdx] = useState(0)

  // TODO: Состояние для индекса текущего шага
  // TODO: State for current step index
  // const [stepIdx, setStepIdx] = useState(0)

  // TODO: Состояние для лога выполнения (массив строк)
  // TODO: State for execution log (array of strings)
  // const [log, setLog] = useState<string[]>([EXAMPLES[0].steps[0].log])

  // -----------------------------------------------
  // TODO: Реализуйте handleNext()
  // TODO: Implement handleNext()
  // -----------------------------------------------
  // Если stepIdx < example.steps.length - 1:
  //   - увеличить stepIdx на 1
  //   - добавить в log объяснение нового шага

  // -----------------------------------------------
  // TODO: Реализуйте handleReset(idx?)
  // TODO: Implement handleReset(idx?)
  // -----------------------------------------------
  // Сбросить: exampleIdx = idx ?? exampleIdx, stepIdx = 0
  // Установить log = [первое объяснение нового примера]

  // -----------------------------------------------
  // TODO: useEffect — сброс при смене примера
  // TODO: useEffect — reset when example changes
  // -----------------------------------------------
  // useEffect(() => { setLog([example.steps[0].log]); setStepIdx(0) }, [exampleIdx])

  // TODO: Вспомогательная функция renderCode(lines, activeLine, accentColor)
  // TODO: Helper function renderCode(lines, activeLine, accentColor)
  // Отрисовывает блок кода с нумерацией строк и подсветкой activeLine.
  // Render code block with line numbers and highlight on activeLine.
  // Используйте borderLeft для подсветки активной строки.
  // Use borderLeft for highlighting the active line.

  return (
    <div className="exercise-container">
      <h2>{t('task.6.1')}</h2>

      {/* TODO: Три вкладки для переключения примеров */}
      {/* TODO: Three tabs for switching examples */}
      {/* EXAMPLES.map((ex, i) => <button key={i} onClick={() => handleReset(i)}>{ex.label}</button>) */}

      {/* TODO: Параллельные панели кода */}
      {/* TODO: Side-by-side code panels */}
      {/* Левая: example.async, подсветка step.asyncLine, зелёный акцент */}
      {/* Left: example.async, highlight step.asyncLine, green accent */}
      {/* Правая: example.promise, подсветка step.promiseLine, жёлтый акцент */}
      {/* Right: example.promise, highlight step.promiseLine, yellow accent */}

      {/* TODO: Лог выполнения */}
      {/* TODO: Execution log */}
      {/* Последняя запись — яркая, предыдущие — тусклые */}
      {/* Last entry — bright, previous entries — dimmed */}

      {/* TODO: Информационный блок */}
      {/* TODO: Info block */}
      {/* "await приостанавливает функцию, но не поток" */}

      {/* TODO: Кнопки "Шаг вперёд" и "Сброс" */}
      {/* TODO: "Next step" and "Reset" buttons */}
      {/* Блокировать "Шаг вперёд" если stepIdx >= example.steps.length - 1 */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте параллельный просмотр async/await vs Promise
      </div>
    </div>
  )
}
