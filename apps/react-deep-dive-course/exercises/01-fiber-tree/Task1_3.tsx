import { useState } from 'react'
import { useLanguage } from 'src/hooks'

type FiberTag =
  | 'FunctionComponent'
  | 'HostComponent'
  | 'HostText'
  | 'Fragment'
  | 'ContextProvider'
  | 'ContextConsumer'
  | 'Memo'

// Описание Fiber node (с children для удобства)
type FiberNodeDef = {
  name: string
  tag: FiberTag
  children?: FiberNodeDef[]
}

// Узел DOM-дерева (только host-узлы)
type DomNode = {
  name: string
  children: DomNode[]
}

// Теги, которые создают реальные DOM-узлы
const HOST_TAGS: FiberTag[] = ['HostComponent', 'HostText']

// TODO: Реализовать flattenToDom(fiber)
// Обходит Fiber-дерево рекурсивно и возвращает DomNode[]:
// - HostComponent: остаётся, его children рекурсивно обрабатываются через flattenToDom
// - HostText: остаётся как листовой узел (children: [])
// - FunctionComponent, Fragment, ContextProvider, ContextConsumer, Memo:
//   "прозрачны" — возвращаем flatMap(flattenToDom) их детей, сами исчезают
function flattenToDom(fiber: FiberNodeDef): DomNode[] {
  // TODO: проверить является ли fiber host-узлом (HOST_TAGS.includes(fiber.tag))
  // TODO: если да — вернуть [{ name, children: рекурсивно обработанные дети }]
  // TODO: если нет — вернуть (fiber.children ?? []).flatMap(c => flattenToDom(c))
  throw new Error('Not implemented')
}

// TODO: Реализовать FiberTreeView
// Отображает Fiber-дерево со всеми узлами:
// - host-узлы: яркие, полная непрозрачность
// - non-host узлы: серые/приглушённые, курсив, opacity < 1
// - рекурсия по children с отступом
function FiberTreeView({ node, depth = 0 }: { node: FiberNodeDef; depth?: number }) {
  // TODO: цветовое кодирование по tag
  // TODO: host vs non-host визуальное различие
  return <div style={{ marginLeft: depth * 16, fontSize: '12px' }}>{node.name}</div>
}

// TODO: Реализовать DomTreeView
// Отображает DOM-дерево (только host-узлы):
// - Зелёные карточки с именем в угловых скобках <name>
// - Рекурсия по children
function DomTreeView({ node, depth = 0 }: { node: DomNode; depth?: number }) {
  // TODO
  return <div style={{ marginLeft: depth * 16, fontSize: '12px', color: '#10b981' }}>&lt;{node.name}&gt;</div>
}

// Два предустановленных примера дерева
const EXAMPLES: { label: string; tree: FiberNodeDef }[] = [
  {
    label: 'Context + Fragment',
    tree: {
      name: 'App',
      tag: 'FunctionComponent',
      children: [
        {
          name: 'ThemeContext.Provider',
          tag: 'ContextProvider',
          children: [
            {
              name: 'Fragment',
              tag: 'Fragment',
              children: [
                {
                  name: 'nav',
                  tag: 'HostComponent',
                  children: [{ name: 'Home', tag: 'HostText' }],
                },
                {
                  name: 'main',
                  tag: 'HostComponent',
                  children: [
                    {
                      name: 'Article',
                      tag: 'FunctionComponent',
                      children: [{ name: 'article', tag: 'HostComponent' }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    label: 'Memo + nested Fragment',
    tree: {
      name: 'Page',
      tag: 'FunctionComponent',
      children: [
        {
          name: 'div',
          tag: 'HostComponent',
          children: [
            {
              name: 'Fragment',
              tag: 'Fragment',
              children: [
                {
                  name: 'h1',
                  tag: 'HostComponent',
                  children: [{ name: 'Title', tag: 'HostText' }],
                },
                {
                  name: 'p',
                  tag: 'HostComponent',
                  children: [{ name: 'Content', tag: 'HostText' }],
                },
              ],
            },
            {
              name: 'MemoFooter',
              tag: 'Memo',
              children: [{ name: 'footer', tag: 'HostComponent' }],
            },
          ],
        },
      ],
    },
  },
]

export function Task1_3() {
  const { t } = useLanguage()
  const [exampleIdx, setExampleIdx] = useState(0)
  const example = EXAMPLES[exampleIdx]

  // TODO: вызвать flattenToDom(example.tree) для получения DOM-дерева
  // const domTree = flattenToDom(example.tree)

  return (
    <div className="exercise-container">
      <h2>{t('task.1.3')}</h2>

      {/* TODO: кнопки переключения между EXAMPLES */}

      {/* TODO: два блока рядом (flex): */}
      {/* Левый: FiberTreeView с example.tree */}
      {/* Правый: DomTreeView с каждым узлом из domTree */}
      {/* Стрелка → между блоками */}

      {/* TODO: подпись-объяснение под деревьями */}

      <p style={{ color: '#6b7280', fontSize: '13px' }}>
        Реализуй flattenToDom, FiberTreeView и DomTreeView
      </p>
    </div>
  )
}
