# Продвинутое

Этот уровень — сборник продвинутых техник, которые не укладываются в отдельную большую тему, но регулярно встречаются в реальных проектах на Tiptap.

## Decorations поверх поиска и подсветки

Мы уже видели `Decoration` на уровне 12 (подсветка "TODO"). Ту же технику можно применить для **live-поиска по документу**:

```tsx
function searchDecorations(doc: ProseMirrorNode, query: string): DecorationSet {
  if (!query) return DecorationSet.empty
  const decorations: Decoration[] = []
  doc.descendants((node, pos) => {
    if (!node.isText) return
    let index = 0
    const text = node.text ?? ''
    while ((index = text.indexOf(query, index)) !== -1) {
      decorations.push(
        Decoration.inline(pos + index, pos + index + query.length, { class: 'search-match' })
      )
      index += query.length
    }
  })
  return DecorationSet.create(doc, decorations)
}
```

Отличие от статичного плагина уровня 12: здесь состояние (поисковый запрос) должно передаваться в плагин **извне**, а не быть захардкожено. Для этого используют `PluginKey` + `setMeta`/`getMeta` транзакции:

```tsx
const searchKey = new PluginKey<{ query: string }>('search')

new Plugin({
  key: searchKey,
  state: {
    init: () => ({ query: '' }),
    apply(tr, prev) {
      const meta = tr.getMeta(searchKey)
      return meta ? { query: meta.query } : prev
    },
  },
  props: {
    decorations(state) {
      const { query } = searchKey.getState(state) ?? { query: '' }
      return searchDecorations(state.doc, query)
    },
  },
})

// Снаружи, чтобы обновить запрос:
editor.view.dispatch(editor.state.tr.setMeta(searchKey, { query: 'привет' }))
```

Это классический паттерн ProseMirror: **плагин с собственным состоянием**, обновляемым через `tr.setMeta(key, payload)` и читаемым через `key.getState(state)`.

## Drag handle: перетаскивание блоков

"Drag handle" — небольшая ручка сбоку от блока, позволяющая перетаскивать его мышью, меняя порядок блоков в документе (как в Notion). Упрощённая реализация строится на:

1. **decoration-виджете**, добавляющем невидимый "хендл" рядом с каждым блоком (`Decoration.widget`)
2. Обработчике `dragstart`/`dragover`/`drop` через `props.handleDOMEvents` плагина
3. Использовании `editor.commands.deleteRange` + `editor.commands.insertContentAt` для перемещения содержимого блока на новую позицию

```tsx
props: {
  handleDOMEvents: {
    dragstart(view, event) {
      const pos = view.posAtDOM(event.target as HTMLElement, 0)
      event.dataTransfer?.setData('text/plain', String(pos))
    },
    drop(view, event) {
      event.preventDefault()
      const fromPos = Number(event.dataTransfer?.getData('text/plain'))
      const toPos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos
      // ... логика перемещения контента между fromPos и toPos
      return true
    },
  },
}
```

Полноценные drag handle решения (как в реальных Notion-подобных редакторах) — довольно сложная тема, выходящая за рамки курса; здесь показан принцип, на основе которого строятся такие реализации.

## Программное управление выделением

Помимо простого `.focus()`, Tiptap/ProseMirror позволяет точно управлять положением курсора и выделением:

```tsx
import { TextSelection } from '@tiptap/pm/state'

// Установить курсор на конкретную позицию
editor.commands.setTextSelection(10)

// Установить выделение диапазона
editor.commands.setTextSelection({ from: 5, to: 15 })

// Выделить весь документ
editor.commands.selectAll()

// Программно создать TextSelection и применить через транзакцию
const { state } = editor
const selection = TextSelection.create(state.doc, 3, 8)
editor.view.dispatch(state.tr.setSelection(selection))
```

Это полезно для сценариев вроде "после вставки шаблона поставить курсор в конкретное место для заполнения", "выделить найденный текст поиска", "перейти к определённому заголовку по клику в оглавлении".

## ⚠️ Частые ошибки новичков

**Ошибка 1: пытаться хранить динамическое состояние плагина в замыкании JS вместо PluginState**

```tsx
// ❌ Плохо — переменная в замыкании не связана с транзакциями/undo, легко рассинхронизируется
let currentQuery = ''
new Plugin({ props: { decorations: state => searchDecorations(state.doc, currentQuery) } })
```

```tsx
// ✅ Хорошо — состояние живёт в самом плагине через init/apply, синхронизировано с транзакциями
new Plugin({ key: searchKey, state: { init: () => ({query: ''}), apply(tr, prev) {...} }, ... })
```

**Ошибка 2: использовать setTextSelection с позицией за пределами документа**

Позиции ProseMirror строго ограничены размером документа — установка позиции больше `doc.content.size` приведёт к ошибке. Проверяйте границы или используйте `Math.min(pos, doc.content.size)`.

**Ошибка 3: недооценивать сложность полноценного drag & drop**

Готовое решение должно обрабатывать вложенные структуры (перетаскивание элемента списка внутрь другого списка), визуальную индикацию места вставки, отмену перетаскивания — это значительно сложнее наивной реализации через `dragstart`/`drop`.

## 💡 Best practices

- Храните любое динамическое состояние ProseMirror-плагина через `state: { init, apply }`, а не во внешних переменных
- Используйте `tr.setMeta(key, payload)` для передачи данных "снаружи" в состояние плагина — это единственный официально поддерживаемый канал
- Для сложных фич (drag & drop, полноценное совместное выделение и т.п.) сверяйтесь с официальными примерами Tiptap/ProseMirror — многие тонкости (границы документа, вложенные структуры) легко упустить при реализации с нуля
- Программное управление выделением используйте умеренно — избыточные перемещения курсора без явного действия пользователя ухудшают UX
