// ============================================
// Cheat.tsx — Подсказки для Level 1: Иммутабельность
// Hints for Level 1: Immutability
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 1 — Иммутабельность</h2>

      {/* Задание 1.1 */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 1.1: Ловушки мутаций</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Для хранения состояния используйте <code>useState&lt;User&gt;</code> с начальным
            значением через <code>JSON.parse(JSON.stringify(INITIAL_USER))</code> — чтобы
            состояние не разделяло ссылку с константой.
          </li>
          <li>
            Прямая мутация: <code>userState.age = 31</code> — изменяет объект в памяти.
            После этого нужен принудительный ре-рендер: <code>{'setUserState({ ...userState })'}</code>.
          </li>
          <li>
            Для spread-копии: <code>{'const copy = { ...userState, age: userState.age + 1 }'}</code>.
            Оригинал при этом не меняется.
          </li>
          <li>
            После мутации <code>original === copy</code> будет <code>true</code> — это один объект.
            После spread — <code>false</code> — разные ссылки.
          </li>
          <li>
            Функция диффа полей: сравните каждое поле вручную и соберите в массив.
            Вложенное поле: <code>a.address.city !== b.address.city</code>.
          </li>
          <li>
            Для сброса: <code>{'setUserState(JSON.parse(JSON.stringify(INITIAL_USER)))'}</code>.
          </li>
        </ul>
      </section>

      {/* Задание 1.2 */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 1.2: Глубокое клонирование</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Каждая колонка должна иметь <em>свою</em> копию оригинала в state.
            Используйте три отдельных useState: <code>origShallow</code>, <code>origJson</code>, <code>origStructured</code>.
          </li>
          <li>
            Shallow: <code>{'const clone = { ...origShallow }'}</code> — после
            <code>clone.user.settings.theme = 'light'</code> проверьте <code>origShallow.user.settings.theme</code>
            — он тоже станет <code>'light'</code>.
          </li>
          <li>
            JSON clone: <code>{'const clone = JSON.parse(JSON.stringify(origJson))'}</code> —
            оригинал не изменится, но <code>typeof clone.user.createdAt === 'string'</code>.
          </li>
          <li>
            structuredClone: <code>{'const clone = structuredClone(origStructured)'}</code> —
            оригинал не изменится, <code>clone.user.createdAt instanceof Date === true</code>.
          </li>
          <li>
            Для принудительного обновления UI после shallow (поскольку объект мутировался):
            <code>{'setOrigShallow(prev => ({ ...prev }))'}</code>.
          </li>
        </ul>
      </section>

      {/* Задание 1.3 */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 1.3: Immer produce</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Ручное добавление:
            <code>{'return { ...state, todos: [...state.todos, { id: state.nextId, text, done: false }], nextId: state.nextId + 1 }'}</code>
          </li>
          <li>
            Ручной toggle:
            <code>{'return { ...state, todos: state.todos.map(t => t.id === id ? { ...t, done: !t.done } : t) }'}</code>
          </li>
          <li>
            Ручное удаление:
            <code>{'return { ...state, todos: state.todos.filter(t => t.id !== id) }'}</code>
          </li>
          <li>
            Immer добавление:
            <code>{'produce(state, draft => { draft.todos.push({ id: draft.nextId, text, done: false }); draft.nextId++ })'}</code>
          </li>
          <li>
            Immer toggle: <code>{'produce(state, draft => { const t = draft.todos.find(t => t.id === id); if (t) t.done = !t.done })'}</code>
          </li>
          <li>
            Immer удаление: <code>{'produce(state, draft => { const i = draft.todos.findIndex(t => t.id === id); if (i !== -1) draft.todos.splice(i, 1) })'}</code>
          </li>
          <li>
            История: <code>{'setHistory(prev => [{ action, snapshot: JSON.parse(JSON.stringify(newState)) }, ...prev].slice(0, 5))'}</code>
          </li>
          <li>
            Счётчик строк: <code>{'code.split(\'\\n\').length'}</code> для каждой строки кода в <code>MANUAL_CODE</code> и <code>IMMER_CODE</code>.
          </li>
        </ul>
      </section>
    </div>
  )
}
