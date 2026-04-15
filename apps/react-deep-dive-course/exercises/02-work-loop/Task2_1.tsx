import { useState, useEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// Work Loop симулятор — обход Fiber-дерева шаг за шагом

// Структура узла дерева (как в настоящем React Fiber)
type WorkNode = {
  id: string
  name: string
  child: WorkNode | null
  sibling: WorkNode | null
  return: WorkNode | null  // ссылка на родителя ("return" как в React)
}

// Шаг Work Loop: вход (begin) или выход (complete)
type LoopStep = {
  type: 'begin' | 'complete'
  nodeId: string
  nodeName: string
}

// TODO: Реализовать buildWorkTree()
// Построй следующее дерево с правильными ссылками child/sibling/return:
//
//   App
//   ├── Header
//   ├── Main
//   │   ├── Article
//   │   └── Aside
//   └── Footer
//
// Важно:
// - app.child = header (первый ребёнок)
// - header.sibling = main, main.sibling = footer
// - main.child = article, article.sibling = aside
// - каждый узел знает своего родителя через .return
function buildWorkTree(): WorkNode {
  throw new Error('Not implemented')
}

// TODO: Реализовать buildSteps(root)
// Обходи дерево DFS и собирай шаги:
// - При входе в узел: { type: 'begin', nodeId, nodeName }
// - После обработки детей: { type: 'complete', nodeId, nodeName }
// - Порядок: begin(App) → begin(Header) → complete(Header) → begin(Main) → ...
function buildSteps(root: WorkNode): LoopStep[] {
  throw new Error('Not implemented')
}

// TODO: Реализовать компонент WorkNodeCard
// Отображает один узел дерева:
// - Имя узла и текущая фаза (pending / beginWork / completeWork / done)
// - Если узел — workInProgress: выделить ярко (синяя рамка), показать "← workInProgress"
// - Если done: приглушить (opacity 0.6)
// - Дочерние узлы через child (рекурсивно) со сдвигом и "child ↓"
// - Братские узлы через sibling со стрелкой "→"
function WorkNodeCard(_props: {
  node: WorkNode
  currentId: string | null
  begunIds: Set<string>
  completedIds: Set<string>
}) {
  return <div>TODO</div>
}

// Предварительно построенные данные (обнови когда реализуешь функции выше)
// const ROOT_NODE = buildWorkTree()
// const ALL_STEPS = buildSteps(ROOT_NODE)

export function Task2_1() {
  const { t } = useLanguage()

  // TODO: Хранить текущий шаг в useState (начинаем с -1 = ещё не начали)
  // const [stepIndex, setStepIndex] = useState(-1)

  // TODO: Хранить состояние авто-режима
  // const [isAuto, setIsAuto] = useState(false)

  // TODO: Ссылка на интервал для авто-режима
  // const autoRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // TODO: Вычислять из stepIndex:
  // - begunIds: Set<string> — id узлов с type='begin' до stepIndex включительно
  // - completedIds: Set<string> — id узлов с type='complete' до stepIndex включительно
  // - currentId: string | null — nodeId текущего шага
  // - logEntries: string[] — последние 8 шагов в формате "→ beginWork(App)" или "✓ completeWork(App)"
  // - isDone: boolean — stepIndex >= ALL_STEPS.length - 1

  // TODO: useEffect для авто-режима:
  // Каждые 600ms вызывать doStep если isAuto && !isDone
  // При isDone — остановить авто-режим
  // Не забыть cleanup: clearInterval при размонтировании

  return (
    <div className="exercise-container">
      <h2>{t('task.2.1')}</h2>

      {/* TODO: Кнопки Step, Auto/Стоп, Reset */}
      {/* Step — один шаг (disabled если isDone или isAuto) */}
      {/* Auto — запустить/остановить авто-режим */}
      {/* Reset — вернуть stepIndex = -1, isAuto = false */}

      {/* TODO: Визуализация дерева + лог рядом (flex) */}
      {/* Дерево: WorkNodeCard с ROOT_NODE и текущим состоянием */}
      {/* Лог: последние 8 записей, синий цвет для begin, зелёный для complete */}

      <p style={{ color: '#6b7280', fontSize: '13px' }}>
        Реализуй buildWorkTree, buildSteps, WorkNodeCard и логику шагов
      </p>
    </div>
  )
}
