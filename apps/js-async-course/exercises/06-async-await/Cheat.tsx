// ============================================
// Cheat.tsx — Подсказки для Level 6: async/await
// Hints for Level 6: async/await
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 6 — async/await</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 6.1: async/await vs Promise</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>renderCode(lines, activeLine, accent)</strong>: для каждой строки
            проверяйте <code>i === activeLine</code> и рисуйте
            <code>borderLeft: '3px solid accentColor'</code>
          </li>
          <li>
            <strong>Параллельные панели</strong>: используйте <code>display: flex, gap: 0.75rem</code>
            с двумя <code>flex: 1</code> блоками
          </li>
          <li>
            <strong>Лог</strong>: храните массив строк, последняя запись яркая:
            <code> color: i === log.length - 1 ? '#93c5fd' : '#475569'</code>
          </li>
          <li>
            <strong>Сброс при смене примера</strong>:
            <code> useEffect{'(() => { setStepIdx(0); setLog([...]) }, [exampleIdx])'}</code>
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 6.2: Обработка ошибок</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>simulateFetch</strong>:
            <code>{` new Promise((resolve, reject) => setTimeout(() => shouldFail ? reject(new Error('...')) : resolve({data: '...'}), 600))`}</code>
          </li>
          <li>
            <strong>to{'<T>'}() хелпер</strong>:
            <code>{` async function to(p) { try { return [null, await p] } catch(e) { return [e, null] } }`}</code>
          </li>
          <li>
            <strong>Блокировка кнопки</strong>: <code>disabled={'phase === "loading"'}</code>
          </li>
          <li>
            <strong>addLog хелпер</strong>:
            <code>{` setLogLines(prev => [...prev, { text, color }])`}</code>
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 6.3: Sequential vs Parallel</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>Смещения для sequential</strong>:
            <code>{` const offsets = TASKS.map((_, i) => TASKS.slice(0, i).reduce((s, t) => s + t.duration, 0))`}</code>
          </li>
          <li>
            <strong>Прогресс в tick()</strong>:
            <code>{` progress = clamp((elapsed - offset) / duration * 100, 0, 100)`}</code>
            где <code>clamp = (v, min, max) {'=> Math.min(max, Math.max(min, v))'}</code>
          </li>
          <li>
            <strong>Ширина полосы в sequential режиме</strong>: полоса задачи занимает
            <code>{` (task.duration / totalSequential) * 100%`}</code> всей дорожки,
            начиная с <code>{` (offset / totalSequential) * 100%`}</code> от левого края
          </li>
          <li>
            <strong>Cleanup</strong>:
            <code>{` useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])`}</code>
          </li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#2563eb' }}>Задание 6.4: Антипаттерны</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>Граница блока кода</strong>:
            <code>{` borderLeft: \`3px solid \${showGood ? '#10b981' : '#ef4444'}\``}</code>
          </li>
          <li>
            <strong>Навигационные пилюли</strong>: кнопки с
            <code> borderRadius: '20px'</code>, меняют цвет при <code>activeIdx === i</code>
          </li>
          <li>
            <strong>Сброс showGood при смене</strong>:
            <code>{` const navigate = (idx) => { setActiveIdx(idx); setShowGood(false) }`}</code>
          </li>
          <li>
            <strong>Блокировка кнопок навигации</strong>:
            "Предыдущий" — <code>disabled={'activeIdx === 0'}</code>,
            "Следующий" — <code>disabled={'activeIdx === ANTIPATTERNS.length - 1'}</code>
          </li>
          <li>
            <strong>5 антипаттернов</strong>: forEach+async, забытый await, sequential вместо
            parallel, unnecessary async, пустой catch — обязательно все пять
          </li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem', background: '#f0f9ff', borderRadius: '8px', padding: '1rem' }}>
        <h3 style={{ color: '#0369a1', marginTop: 0 }}>Ключевые концепции уровня</h3>
        <ul style={{ lineHeight: 1.8 }}>
          <li><strong>async function</strong> всегда возвращает Promise</li>
          <li><strong>await</strong> приостанавливает функцию, но НЕ поток — Event Loop продолжает работать</li>
          <li><strong>try/catch</strong> с await перехватывает reject промиса</li>
          <li>Независимые await — запускайте через <strong>Promise.all</strong></li>
          <li><strong>for...of</strong> вместо forEach при async-итерации</li>
          <li><strong>Пустой catch</strong> — антипаттерн, ошибки должны логироваться или пробрасываться</li>
        </ul>
      </section>
    </div>
  )
}
