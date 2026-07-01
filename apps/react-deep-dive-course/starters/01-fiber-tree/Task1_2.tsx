import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// React Element — одноразовый snapshot, результат JSX
type MyElement = {
  type: string | string | null
  typeName: string        // читаемое имя (строка или имя функции)
  props: Record<string, unknown>
  children: (MyElement | string)[]
}

// Fiber Node — долгоживущий объект с child/sibling/return
type MyFiber = {
  type: string | null
  tag: 'FunctionComponent' | 'HostComponent' | 'HostText'
  memoizedProps: Record<string, unknown>
  stateNode: null  // у FC — всегда null
  child: MyFiber | null
  sibling: MyFiber | null
  returnFiber: MyFiber | null
}

// TODO: Реализовать myCreateElement(type, props, ...children)
// type — строка ('div') или объект с полем name (имитация функции-компонента)
// Возвращает MyElement с полями: type (строка или 'function'), typeName, props, children
function myCreateElement(
  type: string | { name: string },
  props: Record<string, unknown> | null,
  ...children: (MyElement | string)[]
): MyElement {
  // TODO: определить typeName и type ('function' или строка-тег)
  // TODO: вернуть объект MyElement
  throw new Error('Not implemented')
}

// TODO: Реализовать myCreateFiber(element, returnFiber)
// Конвертирует MyElement (или строку) в MyFiber:
// - Строка → tag: 'HostText', type: null, memoizedProps: { text: строка }
// - type === 'function' → tag: 'FunctionComponent'
// - иначе → tag: 'HostComponent'
// - Рекурсивно создать дочерние fibers из element.children
// - Связать children через sibling, первый записать в child
// - returnFiber у каждого child → текущий fiber
function myCreateFiber(element: MyElement | string, returnFiber: MyFiber | null): MyFiber {
  // TODO: обработать случай строки (HostText)
  // TODO: определить tag по element.type
  // TODO: создать fiber node
  // TODO: обработать children (создать, связать sibling, записать child)
  throw new Error('Not implemented')
}

// Вспомогательная функция для отображения имени fiber
function getFiberName(f: MyFiber | null): string {
  if (!f) return 'null'
  return f.type ?? f.tag
}

// TODO: Реализовать компонент ElementTree
// Рекурсивно отображает дерево MyElement:
// - строка → жёлтый текст в кавычках
// - элемент → имя тега/компонента, затем рекурсия по children со сдвигом
function ElementTree({ el, depth = 0 }: { el: MyElement | string; depth?: number }) {
  // TODO
  return <div style={{ marginLeft: depth * 20, fontSize: '12px', fontFamily: 'monospace' }}>{typeof el === 'string' ? el : el.typeName}</div>
}

// TODO: Реализовать компонент FiberTree
// Рекурсивно отображает дерево MyFiber:
// - Каждый узел: [tag] typeName с цветным бейджем
// - Рекурсия: сначала child (со сдвигом), затем sibling (без сдвига)
function FiberTree({ fiber, depth = 0 }: { fiber: MyFiber; depth?: number }) {
  // TODO
  return <div style={{ marginLeft: depth * 20, fontSize: '12px', fontFamily: 'monospace', color: '#e5e7eb' }}>{getFiberName(fiber)}</div>
}

// Имитация компонента-функции (объект с именем)
const Nav = { name: 'Nav' }

// Дерево для демонстрации
// TODO: построить через myCreateElement
// div → [Nav, main → [h1 → 'Hello', p → 'World']]
const DEMO_ELEMENT = myCreateElement(
  'div',
  { className: 'app' },
  myCreateElement(Nav, {}),
  myCreateElement(
    'main',
    null,
    myCreateElement('h1', null, 'Hello'),
    myCreateElement('p', null, 'World')
  )
)

export function Task1_2() {
  const { t } = useLanguage()
  const [renderKey, setRenderKey] = useState(0)
  const [selectedFiber, setSelectedFiber] = useState<MyFiber | null>(null)

  // TODO: создать fiberRoot из DEMO_ELEMENT через myCreateFiber
  // const fiberRoot = myCreateFiber(DEMO_ELEMENT, null)

  // TODO: собрать все fibers в массив для панели кликабельных узлов
  // Подсказка: рекурсивный обход через child и sibling

  return (
    <div className="exercise-container">
      <h2>{t('task.1.2')}</h2>

      <button
        onClick={() => { setRenderKey(k => k + 1); setSelectedFiber(null) }}
        style={{
          padding: '8px 16px',
          borderRadius: '6px',
          border: 'none',
          background: '#3b82f6',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '13px',
          marginBottom: '20px',
        }}
      >
        Пересоздать (симуляция рендера #{renderKey + 1})
      </button>

      {/* TODO: три колонки: Elements → стрелка → Fiber Nodes → Инспектор */}
      {/* Инспектор показывает поля выбранного fiber: type, tag, child, sibling, return */}
      {/* Список кнопок для выбора fiber */}

      <p style={{ color: '#6b7280', fontSize: '13px' }}>
        Реализуй myCreateElement, myCreateFiber и компоненты отображения
      </p>
    </div>
  )
}
