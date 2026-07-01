import { useState, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 8.3: Генератор как конечный автомат (State Machine)
// Task 8.3: Generator as a finite state machine
// ============================================
// Реализуйте два демо конечных автоматов на генераторах:
// 1. Светофор: red → green → yellow → red (бесконечный цикл)
// 2. Кофемашина: idle → selecting → brewing → ready → idle
//
// Implement two finite state machine demos using generators:
// 1. Traffic light: red → green → yellow → red (infinite loop)
// 2. Coffee machine: idle → selecting → brewing → ready → idle

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

type TrafficState = 'red' | 'green' | 'yellow'
type CoffeeState = 'idle' | 'selecting' | 'brewing' | 'ready'

// -----------------------------------------------
// TODO: Реализуйте генератор trafficLight()
// TODO: Implement trafficLight() generator
// -----------------------------------------------
// Бесконечный цикл: yield 'red', yield 'green', yield 'yellow', повторить
// Infinite loop: yield 'red', yield 'green', yield 'yellow', repeat
//
// function* trafficLight(): Generator<TrafficState, void, string> {
//   while (true) {
//     yield 'red'
//     yield 'green'
//     yield 'yellow'
//   }
// }

// -----------------------------------------------
// TODO: Реализуйте генератор coffeeMachine()
// TODO: Implement coffeeMachine() generator
// -----------------------------------------------
// Бесконечный цикл четырёх состояний:
// Infinite loop of four states:
// yield 'idle' → yield 'selecting' → yield 'brewing' → yield 'ready' → repeat
//
// function* coffeeMachine(): Generator<CoffeeState, void, string> {
//   while (true) {
//     yield 'idle'
//     yield 'selecting'
//     yield 'brewing'
//     yield 'ready'
//   }
// }

// -----------------------------------------------
// Данные для отображения / Display data
// -----------------------------------------------

// Цвета и метки состояний светофора / Traffic light state colors and labels
const STATE_COLORS: Record<TrafficState, { bg: string; glow: string; label: string }> = {
  red:    { bg: '#ef4444', glow: '#ef444480', label: 'КРАСНЫЙ — Стоп' },
  green:  { bg: '#10b981', glow: '#10b98180', label: 'ЗЕЛЁНЫЙ — Идти' },
  yellow: { bg: '#f59e0b', glow: '#f59e0b80', label: 'ЖЁЛТЫЙ — Внимание' },
}

// Переходы кофемашины / Coffee machine transitions
const COFFEE_TRANSITIONS: Array<{
  from: CoffeeState
  action: string
  to: CoffeeState
  btn: string
}> = [
  { from: 'idle',      action: 'select', to: 'selecting', btn: 'Выбрать напиток' },
  { from: 'selecting', action: 'brew',   to: 'brewing',   btn: 'Начать варку' },
  { from: 'brewing',   action: 'done',   to: 'ready',     btn: 'Готово (авто)' },
  { from: 'ready',     action: 'take',   to: 'idle',      btn: 'Забрать напиток' },
]

// Цвета состояний кофемашины / Coffee machine state colors
const COFFEE_COLORS: Record<CoffeeState, { border: string; desc: string }> = {
  idle:      { border: '#334155', desc: 'Ожидание' },
  selecting: { border: '#f59e0b', desc: 'Выбор напитка...' },
  brewing:   { border: '#10b981', desc: 'Варится кофе...' },
  ready:     { border: '#60a5fa', desc: 'Готово! Забирай' },
}

export function Task8_3() {
  const { t } = useLanguage()

  // Текущее демо / Current demo
  const [demo, setDemo] = useState<'traffic' | 'coffee'>('traffic')

  // Генератор светофора — в ref, не пересоздаётся при рендере
  // Traffic light generator — in ref, not recreated on render
  // TODO: const trafficRef = useRef<Generator<TrafficState, void, string>>(trafficLight())

  // TODO: Состояние светофора (начальное: 'red')
  // TODO: Traffic light state (initial: 'red')
  // const [trafficState, setTrafficState] = useState<TrafficState>('red')

  // TODO: Лог переходов светофора
  // TODO: Traffic light transition log
  // const [trafficLog, setTrafficLog] = useState<string[]>(['red — начальное состояние'])

  // Генератор кофемашины — в ref
  // Coffee machine generator — in ref
  // TODO: const coffeeRef = useRef<Generator<CoffeeState, void, string>>(coffeeMachine())

  // TODO: Состояние кофемашины (начальное: 'idle')
  // TODO: Coffee machine state (initial: 'idle')
  // const [coffeeState, setCoffeeState] = useState<CoffeeState>('idle')

  // TODO: Лог переходов кофемашины
  // TODO: Coffee machine transition log
  // const [coffeeLog, setCoffeeLog] = useState<string[]>(['idle — машина ожидает'])

  // -----------------------------------------------
  // TODO: Реализуйте handleTrafficSwitch()
  // TODO: Implement handleTrafficSwitch()
  // -----------------------------------------------
  // - Вызвать trafficRef.current.next()
  // - Если value определено (nextState):
  //   - setTrafficLog добавить строку: `${trafficState} → switch → ${nextState}`
  //   - setTrafficState(nextState)

  // -----------------------------------------------
  // TODO: Реализуйте handleTrafficReset()
  // TODO: Implement handleTrafficReset()
  // -----------------------------------------------
  // - trafficRef.current = trafficLight() — пересоздать генератор
  // - setTrafficState('red')
  // - setTrafficLog(['red — начальное состояние'])

  // -----------------------------------------------
  // TODO: Найдите текущий переход кофемашины
  // TODO: Find current coffee machine transition
  // -----------------------------------------------
  // const coffeeTransition = COFFEE_TRANSITIONS.find(t => t.from === coffeeState)

  // -----------------------------------------------
  // TODO: Реализуйте handleCoffeeAction()
  // TODO: Implement handleCoffeeAction()
  // -----------------------------------------------
  // - Если coffeeTransition не найден — ничего не делать
  // - Вызвать coffeeRef.current.next()
  // - Если value определено (nextState):
  //   - setCoffeeLog добавить: `${coffeeState} → ${coffeeTransition.action} → ${nextState}`
  //   - setCoffeeState(nextState)

  // -----------------------------------------------
  // TODO: Реализуйте handleCoffeeReset()
  // TODO: Implement handleCoffeeReset()
  // -----------------------------------------------
  // - coffeeRef.current = coffeeMachine() — пересоздать генератор
  // - setCoffeeState('idle')
  // - setCoffeeLog(['idle — машина ожидает'])

  return (
    <div className="exercise-container">
      <h2>{t('task.8.3')}</h2>

      {/* TODO: Вкладки "Светофор" / "Кофемашина" */}
      {/* TODO: Tabs "Светофор" / "Кофемашина" */}
      {/* При переключении — НЕ сбрасывать состояние машин (только menять demo) */}
      {/* On switch — do NOT reset machine state (just change demo) */}

      {/* ---- Светофор / Traffic Light ---- */}
      {/* TODO: Показать если demo === 'traffic' */}
      {/* TODO: Show if demo === 'traffic' */}
      {/*
        1. Код генератора trafficLight() (snippet)

        2. Диаграмма состояний — три цветных круга:
           - (['red', 'green', 'yellow'] as TrafficState[]).map(s => ...)
           - Активное состояние: полная заливка + glow, неактивное: только border
           - Между кругами: стрелки "→"

        3. Метка текущего состояния:
           STATE_COLORS[trafficState].label + '"trafficState"'

        4. Лог переходов (trafficLog.map)

        5. Кнопки: "Переключить" (→ handleTrafficSwitch) и "Сброс"
      */}

      {/* ---- Кофемашина / Coffee Machine ---- */}
      {/* TODO: Показать если demo === 'coffee' */}
      {/* TODO: Show if demo === 'coffee' */}
      {/*
        1. Код генератора coffeeMachine() (snippet)

        2. Диаграмма состояний — четыре горизонтальных блока:
           - (['idle', 'selecting', 'brewing', 'ready'] as CoffeeState[]).map(s => ...)
           - Активное состояние: border нужного цвета + glow, неактивное: серый border
           - Между блоками: стрелки "→", в конце "→ (цикл)"

        3. Метка текущего состояния:
           COFFEE_COLORS[coffeeState].desc + '"coffeeState"'

        4. Лог переходов (coffeeLog.map)

        5. Кнопка действия:
           - Текст: coffeeTransition?.btn ?? 'Завершено'
           - Disabled если !coffeeTransition
           - onClick: handleCoffeeAction

        6. Кнопка "Сброс" → handleCoffeeReset

        7. Пояснительный текст:
           "Генератор — идеальный конечный автомат: каждый yield — новое состояние,
           .next(action) — переход. Состояния инкапсулированы, переходы — строго по порядку."
      */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте два конечных автомата на генераторах: светофор и кофемашину
      </div>
    </div>
  )
}
