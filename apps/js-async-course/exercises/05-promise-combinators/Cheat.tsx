import { useState, useEffect, useRef } from 'react'
import { Task5_1_Solution, Task5_2_Solution, Task5_3_Solution, Task5_4_Solution } from 'src/exercises/05-promise-combinators'

// ============================================
// Cheat.tsx — Подсказки для Level 5: Promise: комбинаторы
// Hints for Level 5: Promise Combinators
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 5 — Promise: комбинаторы</h2>

      {/* ============ Task 5.1 ============ */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 5.1: Promise.all — ключевые идеи</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>Запускайте все промисы ДО Promise.all</strong>: создайте массив промисов заранее,
            передайте его в Promise.all — все они стартуют немедленно при создании
          </li>
          <li>
            <strong>Анимация через setInterval</strong>: каждые 30мс считайте прогресс как{' '}
            <code>Math.min(100, round((elapsed / duration) * 100))</code>,
            где <code>elapsed = Date.now() - startTime</code>
          </li>
          <li>
            <strong>Хранение таймеров</strong>: используйте <code>useRef&lt;ReturnType&lt;typeof setInterval&gt;[]&gt;([])</code>
            — пушьте каждый интервал в массив, очищайте в handleReset и useEffect cleanup
          </li>
          <li>
            <strong>Fail-fast визуализация</strong>: в <code>.catch</code> сделайте{' '}
            <code>setLoaders(prev =&gt; prev.map(l =&gt; l.status === 'running' ? ... 'error' : l))</code>
            — это показывает что остальные промисы продолжали работать
          </li>
          <li>
            <strong>Обновление одного загрузчика</strong>:{' '}
            <code>setLoaders(prev =&gt; {'{'} const next = [...prev]; next[i] = {'{'} ...next[i], progress {'}'}; return next {'}'})</code>
          </li>
        </ul>

        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '1rem', marginTop: '0.75rem', fontSize: '0.85rem' }}>
          <strong>Шаблон создания промисов для Promise.all:</strong>
          <pre style={{ marginTop: '0.5rem', background: '#0f172a', color: '#cbd5e1', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem' }}>{`const promises = LOADER_DURATIONS.map((duration, i) => {
  return new Promise<string>((resolve, reject) => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(100, Math.round((elapsed / duration) * 100))

      setLoaders(prev => {
        const next = [...prev]
        next[i] = { ...next[i], progress }
        return next
      })

      if (progress >= 100) {
        clearInterval(interval)
        if (fails[i]) {
          setLoaders(prev => { const next = [...prev]; next[i] = { ...next[i], status: 'error' }; return next })
          reject(new Error(\`Ошибка \${LOADER_NAMES[i]}\`))
        } else {
          setLoaders(prev => { const next = [...prev]; next[i] = { ...next[i], status: 'done' }; return next })
          resolve(\`data_\${LOADER_NAMES[i].toLowerCase()}\`)
        }
      }
    }, 30)
    timersRef.current.push(interval)
  })
})

Promise.all(promises)
  .then(values => { setResult(JSON.stringify(values)); setResultOk(true) })
  .catch(err => { setResult(err.message); setResultOk(false) })`}</pre>
        </div>
      </section>

      {/* ============ Task 5.2 ============ */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 5.2: Promise.allSettled — ключевые идеи</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>Промисы создаются так же, как в 5.1</strong> — разница только в финальном вызове:
            используйте <code>Promise.allSettled</code> вместо <code>Promise.all</code>
          </li>
          <li>
            <strong>Преобразование результата</strong>: settled.map проверяет <code>r.status === 'fulfilled'</code>
            и создаёт объект с нужными полями
          </li>
          <li>
            <strong>allSettled всегда .then</strong>: не нужен .catch — результат allSettled всегда
            приходит в .then как массив статусов
          </li>
          <li>
            <strong>Сравнение с Promise.all</strong>: найдите первый индекс где fails[i]=true:
            <code> const firstFail = fails.findIndex(f =&gt; f)</code>
          </li>
        </ul>

        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '1rem', marginTop: '0.75rem', fontSize: '0.85rem' }}>
          <strong>Преобразование settled в SettledResult[]:</strong>
          <pre style={{ marginTop: '0.5rem', background: '#0f172a', color: '#cbd5e1', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem' }}>{`Promise.allSettled(promises).then(settled => {
  const mapped = settled.map(r =>
    r.status === 'fulfilled'
      ? { status: 'fulfilled' as const, value: r.value }
      : { status: 'rejected' as const, reason: (r.reason as Error).message }
  )
  setResults(mapped)

  const firstFailIdx = fails.findIndex(f => f)
  if (firstFailIdx !== -1) {
    setAllComparison(
      \`Если бы это был Promise.all — он упал бы на шаге \${firstFailIdx + 1} (\${LOADER_NAMES[firstFailIdx]})\`
    )
  } else {
    setAllComparison('Все успешно — Promise.all дал бы тот же результат')
  }
  setRunning(false)
})`}</pre>
        </div>
      </section>

      {/* ============ Task 5.3 ============ */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 5.3: Promise.race — ключевые идеи</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>Флаг resolved</strong>: Promise.race может вызвать и .then и .catch если
            несколько промисов завершатся почти одновременно — используйте флаг{' '}
            <code>let resolved = false</code> чтобы setWinner вызвался только один раз
          </li>
          <li>
            <strong>outcome='fail' → reject</strong>: бегун с outcome='fail' вызывает <code>reject()</code>
            — race отреагирует на него так же как на fulfilled, только с rejected
          </li>
          <li>
            <strong>Таймаут-паттерн</strong>: fetchPromise resolves через fetchDelay,
            timeoutPromise rejects через timeoutMs — race берёт первого
          </li>
          <li>
            <strong>Два setInterval</strong> для таймаутного режима: один для fetch-прогресса,
            другой для timeout-прогресса — оба стартуют одновременно
          </li>
        </ul>

        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '1rem', marginTop: '0.75rem', fontSize: '0.85rem' }}>
          <strong>Шаблон race с флагом resolved:</strong>
          <pre style={{ marginTop: '0.5rem', background: '#0f172a', color: '#cbd5e1', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem' }}>{`let resolved = false

Promise.race(promises)
  .then(result => {
    if (!resolved) {
      resolved = true
      setWinner(result)
      setRunning(false)
    }
  })
  .catch((result: { index: number; outcome: 'success' | 'fail' }) => {
    if (!resolved) {
      resolved = true
      setWinner(result)
      setRunning(false)
    }
  })`}</pre>
        </div>
      </section>

      {/* ============ Task 5.4 ============ */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 5.4: Promise.any — ключевые идеи</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>online=false → reject</strong>: offline-сервер вызывает{' '}
            <code>reject(new Error(`${'{server.name}'}: offline`))</code>
          </li>
          <li>
            <strong>AggregateError в .catch</strong>: когда все серверы offline,
            Promise.any отдаёт AggregateError — но в .catch нет удобного типа,
            поэтому собирайте ошибки сами через массив errors[] по мере reject
          </li>
          <li>
            <strong>Сборка errors[]</strong>: создайте <code>const errors: string[] = []</code>
            вне промисов и пушьте в него при каждом reject перед вызовом reject()
          </li>
          <li>
            <strong>allOffline</strong>: вычислите <code>servers.every(s =&gt; !s.online)</code>
            и показывайте предупреждение до запуска
          </li>
        </ul>

        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '1rem', marginTop: '0.75rem', fontSize: '0.85rem' }}>
          <strong>Сборка errors для AggregateError:</strong>
          <pre style={{ marginTop: '0.5rem', background: '#0f172a', color: '#cbd5e1', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem' }}>{`const errors: string[] = []

const promises = servers.map((server, i) => {
  return new Promise<{ winner: number; value: string }>((resolve, reject) => {
    // ... анимация прогресса ...
    if (!server.online) {
      const errMsg = \`\${server.name}: offline\`
      errors.push(errMsg)   // сохраняем для AggregateError
      reject(new Error(errMsg))
    } else {
      resolve({ winner: i, value: \`asset.js from \${server.name}\` })
    }
  })
})

Promise.any(promises)
  .then(res => setResult({ type: 'fulfilled', winner: res.winner, value: res.value }))
  .catch(() => setResult({ type: 'aggregate', errors }))`}</pre>
        </div>
      </section>

      {/* ============ Live solutions ============ */}
      <section>
        <h3 style={{ color: '#2563eb' }}>Живые решения</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Task5_1_Solution />
          <Task5_2_Solution />
          <Task5_3_Solution />
          <Task5_4_Solution />
        </div>
      </section>
    </div>
  )
}
