import { useState } from 'react'

// ============================================
// Задание 1.1: ESM/CJS, hoisting, TDZ и live bindings — Решение
// ============================================

type StepKind = 'start' | 'require' | 'partial' | 'tdz' | 'ready' | 'note'

interface Step {
  kind: StepKind
  text: string
}

// Симулируем реальную инициализацию модулей ESM и CJS,
// чтобы показать РАЗНЫЙ результат для одного и того же цикла a<->b

function simulateCjsCycle(): Step[] {
  const log: Step[] = []
  // Реальное состояние "модульных объектов", как в CommonJS.
  // ВАЖНО: require возвращает ССЫЛКУ на этот объект, а НЕ его копию.
  const moduleA: Record<string, unknown> = {}
  const moduleB: Record<string, unknown> = {}

  log.push({ kind: 'start', text: 'main.js: require("./a.js")' })
  log.push({ kind: 'start', text: 'a.js: старт исполнения' })
  log.push({ kind: 'require', text: 'a.js: const b = require("./b.js")' })
  log.push({ kind: 'start', text: 'b.js: старт исполнения' })
  log.push({ kind: 'require', text: 'b.js: const a = require("./a.js") -> a.js уже "в процессе"!' })

  // b.js получает ССЫЛКУ на текущий (ещё пустой) moduleA — не копию/снимок!
  const aRefInB = moduleA
  log.push({
    kind: 'partial',
    text: `b.js: const a = ССЫЛКА на exports из a.js, сейчас = ${JSON.stringify(aRefInB)} (a.js ещё пуст)`,
  })
  log.push({
    kind: 'partial',
    text: `b.js: чтение a.valueA НА ВЕРХНЕМ УРОВНЕ -> ${JSON.stringify(
      aRefInB.valueA
    )} (строка exports.valueA ещё не выполнилась)`,
  })

  moduleB.valueB = 'B is ready'
  log.push({ kind: 'ready', text: 'b.js: exports.valueB = "B is ready" -> b.js доисполнился' })

  log.push({ kind: 'require', text: 'a.js: получил b.js полностью готовым' })
  moduleA.valueA = 'A is ready'
  log.push({ kind: 'ready', text: 'a.js: exports.valueA = "A is ready" -> a.js доисполнился' })

  // aRefInB — ТА ЖЕ ССЫЛКА, что и moduleA: теперь в ней уже виден valueA
  log.push({
    kind: 'note',
    text: `Ключ: require вернул ССЫЛКУ, а не копию. Тот же объект a внутри b.js теперь = ${JSON.stringify(
      aRefInB
    )}`,
  })
  log.push({
    kind: 'note',
    text: `Поэтому a.valueA, прочитанное ЛЕНИВО (в функции, вызванной позже), вернёт "${aRefInB.valueA}" — как и в ESM`,
  })
  log.push({
    kind: 'note',
    text: 'Баг возникает ТОЛЬКО при чтении на верхнем уровне, пока объект ещё пуст — а не потому что это «копия»',
  })

  return log
}

function simulateEsmCycleSafe(): Step[] {
  const log: Step[] = []
  log.push({ kind: 'start', text: 'main.ts: import "./a.ts"' })
  log.push({ kind: 'start', text: 'a.ts: старт исполнения (ESM, live bindings)' })
  log.push({ kind: 'require', text: 'a.ts: import { getBValue } from "./b.ts"' })
  log.push({ kind: 'start', text: 'b.ts: старт исполнения' })
  log.push({ kind: 'require', text: 'b.ts: import { getAValue } from "./a.ts" -> цикл!' })
  log.push({
    kind: 'ready',
    text: 'b.ts: getAValue - это ФУНКЦИЯ (объявление hoisted), безопасно ссылаться на неё сразу',
  })
  log.push({ kind: 'ready', text: 'b.ts: export const B_VALUE = "B" -> b.ts доисполнился' })
  log.push({ kind: 'ready', text: 'a.ts: export const A_VALUE = "A" -> a.ts доисполнился' })
  log.push({
    kind: 'note',
    text: '✅ Обращение к значениям идёт ЛЕНИВО через функции-геттеры -> TDZ не срабатывает',
  })
  return log
}

function simulateEsmCycleCrash(): Step[] {
  const log: Step[] = []
  log.push({ kind: 'start', text: 'main.ts: import "./a.ts"' })
  log.push({ kind: 'start', text: 'a.ts: старт исполнения (ESM, live bindings)' })
  log.push({ kind: 'require', text: 'a.ts: import { B_VALUE } from "./b.ts"' })
  log.push({ kind: 'start', text: 'b.ts: старт исполнения' })
  log.push({ kind: 'require', text: 'b.ts: import { A_VALUE } from "./a.ts" -> цикл!' })
  log.push({
    kind: 'tdz',
    text: 'b.ts: console.log(A_VALUE) на верхнем уровне -> A_VALUE это const, ещё в TDZ!',
  })

  // Реально провоцируем TDZ через динамически собранную функцию, чтобы TS не ругался
  // на "used before declaration" на этапе компиляции этого файла
  let realError = ''
  try {
    // eslint-disable-next-line no-new-func
    const triggerTdz = new Function(
      'try { console.log(tdzDemoValue); let tdzDemoValue = "unreachable"; } catch (e) { return e.message; } return "no error"'
    )
    realError = String(triggerTdz())
  } catch (e) {
    realError = e instanceof ReferenceError ? e.message : String(e)
  }

  log.push({
    kind: 'tdz',
    text: `⛔ Реальный ReferenceError, пойманный в этом демо: "${realError}"`,
  })
  log.push({
    kind: 'note',
    text: '❌ Обращение к A_VALUE произошло НА ВЕРХНЕМ УРОВНЕ модуля -> краш',
  })
  return log
}

function simulateEsmMirrorsCjs(): Step[] {
  const log: Step[] = []
  log.push({
    kind: 'start',
    text: 'main.mjs: import "./a.mjs" (ТОТ ЖЕ цикл a<->b, что и в CJS-сценарии выше)',
  })
  log.push({ kind: 'start', text: 'a.mjs: старт исполнения' })
  log.push({ kind: 'require', text: 'a.mjs: import { valueB } from "./b.mjs" -> уступает b.mjs' })
  log.push({ kind: 'start', text: 'b.mjs: старт исполнения' })
  log.push({
    kind: 'require',
    text: 'b.mjs: import { valueA } from "./a.mjs" -> цикл! тело a.mjs ещё не выполнялось',
  })
  log.push({
    kind: 'tdz',
    text: 'b.mjs: чтение valueA НА ВЕРХНЕМ УРОВНЕ -> valueA это export const, ещё в TDZ',
  })

  // Реально провоцируем TDZ через динамически собранную функцию, чтобы показать
  // НАСТОЯЩИЙ ReferenceError (TS не даст написать доступ до объявления напрямую)
  let realError = ''
  try {
    // eslint-disable-next-line no-new-func
    const triggerTdz = new Function(
      'try { console.log(valueA); let valueA = "A is ready"; } catch (e) { return e.message; } return "no error"'
    )
    realError = String(triggerTdz())
  } catch (e) {
    realError = e instanceof ReferenceError ? e.message : String(e)
  }

  log.push({
    kind: 'tdz',
    text: `⛔ Реальный ReferenceError, пойманный в этом демо: "${realError}"`,
  })
  log.push({
    kind: 'note',
    text: 'CJS в ЭТОЙ ЖЕ точке вернул бы {} и valueA === undefined — тихо, без ошибки',
  })
  log.push({
    kind: 'note',
    text: 'Разница НЕ в «ссылка vs копия»: exports.valueA — отсутствующее свойство объекта -> undefined; а const valueA — привязка в TDZ -> бросок',
  })
  return log
}

const KIND_COLOR: Record<StepKind, string> = {
  start: '#93c5fd',
  require: '#c4b5fd',
  partial: '#fbbf24',
  tdz: '#f87171',
  ready: '#34d399',
  note: '#9ca3af',
}

function StepList({ steps }: { steps: Step[] }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0' }}>
      {steps.map((s, i) => (
        <li
          key={i}
          style={{
            padding: '4px 0',
            fontFamily: 'monospace',
            fontSize: 13,
            color: KIND_COLOR[s.kind],
            whiteSpace: 'pre-wrap',
          }}
        >
          {i + 1}. {s.text}
        </li>
      ))}
    </ul>
  )
}

export function Task1_1_Solution() {
  const [cjsSteps, setCjsSteps] = useState<Step[] | null>(null)
  const [esmSafeSteps, setEsmSafeSteps] = useState<Step[] | null>(null)
  const [esmCrashSteps, setEsmCrashSteps] = useState<Step[] | null>(null)
  const [esmMirrorSteps, setEsmMirrorSteps] = useState<Step[] | null>(null)

  return (
    <div className="exercise-container">
      <h2>Задание 1.1: ESM/CJS, hoisting, TDZ и live bindings</h2>
      <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 20 }}>
        Четыре сценария одного и того же цикла <code>a ⇄ b</code>. Запустите каждый и сравните
        поведение: тихий <code>undefined</code> в CJS, безопасная ленивая работа в ESM, настоящий{' '}
        <code>ReferenceError</code> из-за TDZ и прямой ESM-аналог CJS-примера, где вместо тихого{' '}
        <code>undefined</code> возникает краш.
      </p>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 15 }}>1. CommonJS: частичные exports</h3>
        <button onClick={() => setCjsSteps(simulateCjsCycle())}>Запустить CJS-сценарий</button>
        {cjsSteps && <StepList steps={cjsSteps} />}
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 15 }}>2. ESM: безопасный цикл (ленивое обращение через функции)</h3>
        <button onClick={() => setEsmSafeSteps(simulateEsmCycleSafe())}>
          Запустить безопасный ESM-сценарий
        </button>
        {esmSafeSteps && <StepList steps={esmSafeSteps} />}
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 15 }}>
          3. ESM: краш из-за TDZ (обращение к const на верхнем уровне)
        </h3>
        <button onClick={() => setEsmCrashSteps(simulateEsmCycleCrash())}>
          Запустить сценарий с TDZ
        </button>
        {esmCrashSteps && <StepList steps={esmCrashSteps} />}
      </div>

      <div>
        <h3 style={{ fontSize: 15 }}>4. ESM-аналог CJS-примера: TDZ вместо тихого undefined</h3>
        <p style={{ color: '#9ca3af', fontSize: 12, margin: '4px 0 8px' }}>
          Тот же цикл, что в сценарии 1, но на ESM с <code>export const</code>. Там CJS молчал и
          отдавал <code>undefined</code> — здесь тот же доступ падает с <code>ReferenceError</code>.
        </p>
        <button onClick={() => setEsmMirrorSteps(simulateEsmMirrorsCjs())}>
          Запустить ESM-аналог
        </button>
        {esmMirrorSteps && <StepList steps={esmMirrorSteps} />}
      </div>
    </div>
  )
}
