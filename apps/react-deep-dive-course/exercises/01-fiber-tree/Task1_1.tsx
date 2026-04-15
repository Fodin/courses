import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// WorkTag — тип узла в Fiber-дереве
type WorkTag =
  | 'FunctionComponent'
  | 'HostComponent'
  | 'HostText'
  | 'Fragment'
  | 'ContextProvider'
  | 'ContextConsumer'
  | 'Memo'

// Описание дерева (входные данные)
type FiberNodeDef = {
  name: string
  tag: WorkTag
  children?: FiberNodeDef[]
}

// Готовый Fiber node с реальными child/sibling/return ссылками
type FiberNodeBuilt = {
  name: string
  tag: WorkTag
  child: FiberNodeBuilt | null
  sibling: FiberNodeBuilt | null
  returnNode: FiberNodeBuilt | null
}

// TODO: Реализовать buildFiberTree(def, returnNode)
// Рекурсивно обходит FiberNodeDef и создаёт FiberNodeBuilt:
// - child → первый ребёнок
// - sibling → следующий брат (через цепочку)
// - returnNode → родительский узел
function buildFiberTree(
  def: FiberNodeDef,
  returnNode: FiberNodeBuilt | null
): FiberNodeBuilt {
  // TODO: создать node с полями name, tag, child=null, sibling=null, returnNode
  // TODO: если у def есть children — создать дочерние FiberNodeBuilt через map + рекурсию
  // TODO: связать дочерние узлы через sibling (children[0].sibling = children[1] и т.д.)
  // TODO: первый ребёнок записать в node.child
  throw new Error('Not implemented')
}

// Цвета по тегу — можно изменить
const TAG_COLORS: Record<WorkTag, string> = {
  FunctionComponent: '#3b82f6',
  HostComponent: '#10b981',
  HostText: '#f59e0b',
  Fragment: '#6b7280',
  ContextProvider: '#8b5cf6',
  ContextConsumer: '#a78bfa',
  Memo: '#06b6d4',
}

// TODO: Реализовать компонент FiberCard
// Отображает карточку одного узла:
// - Кнопка с именем и tag-бейджем
// - Подпись "return ↑ ParentName" если есть returnNode
// - Дочерние узлы через child (рекурсивно) со сдвигом и "child ↓"
// - Братский узел через sibling со стрелкой "→"
// При клике вызывает onSelect(node)
// Выделение активного узла через selectedName === node.name
function FiberCard({
  node,
  selectedName,
  onSelect,
}: {
  node: FiberNodeBuilt
  selectedName: string | null
  onSelect: (n: FiberNodeBuilt) => void
}) {
  // TODO: реализовать отображение карточки
  return <div>{node.name}</div>
}

// Пример дерева для отображения
const SAMPLE_TREE: FiberNodeDef = {
  name: 'App',
  tag: 'FunctionComponent',
  children: [
    { name: 'Header', tag: 'FunctionComponent' },
    {
      name: 'Main',
      tag: 'HostComponent',
      children: [
        {
          name: 'Article',
          tag: 'HostComponent',
          children: [{ name: 'Hello', tag: 'HostText' }],
        },
        { name: 'Aside', tag: 'HostComponent' },
      ],
    },
    { name: 'Footer', tag: 'FunctionComponent' },
  ],
}

export function Task1_1() {
  const { t } = useLanguage()

  // TODO: построить fiber дерево из SAMPLE_TREE через buildFiberTree
  // const root = ...

  // TODO: хранить выбранный узел в useState (null по умолчанию)
  // const [selected, setSelected] = useState<FiberNodeBuilt | null>(null)

  return (
    <div className="exercise-container">
      <h2>{t('task.1.1')}</h2>

      {/* TODO: разместить FiberCard и панель деталей рядом (flex) */}
      {/* Панель деталей показывает: name, tag, child, sibling, return выбранного узла */}
      {/* Кнопка "Сбросить" снимает выделение */}
      {/* Легенда: цветные квадратики + название для каждого WorkTag */}

      <p style={{ color: '#6b7280', fontSize: '13px' }}>
        Реализуй buildFiberTree и FiberCard, затем удали этот текст
      </p>
    </div>
  )
}
