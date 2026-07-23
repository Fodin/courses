# Keyboard shortcuts и ProseMirror-плагины

## addKeyboardShortcuts: свои горячие клавиши

Любой extension может зарегистрировать собственные keyboard shortcuts:

```tsx
const MyExtension = Extension.create({
  name: 'myExtension',

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-x': () => {
        return this.editor.chain().focus().toggleStrike().run()
      },
    }
  },
})
```

`Mod` — кроссплатформенный алиас: `Ctrl` на Windows/Linux, `Cmd` на macOS. Обработчик должен вернуть `true`, если событие обработано (что и делает результат `.run()` — `boolean`), либо `false`/`undefined`, чтобы позволить событию продолжить своё стандартное поведение (например, если условие не выполнено).

```mermaid
graph LR
  A["Пользователь нажимает Mod-Shift-x"] --> B["ProseMirror ищет<br/>зарегистрированные shortcuts"] --> C["Обработчик вызван"] --> D["Вернул true?"] --> E["Событие 'проглочено',<br/>браузер не обрабатывает его дальше"]
```

📌 Если два extensions регистрируют один и тот же shortcut, срабатывает тот, что зарегистрирован **позже** в списке `extensions` (последний "выигрывает"). Это стоит учитывать при подключении сторонних extensions вместе со своими.

## addProseMirrorPlugins: прямой доступ к ProseMirror

Иногда возможностей команд и input rules недостаточно — нужен полный контроль на уровне ProseMirror. Для этого — `addProseMirrorPlugins()`, возвращающий массив "сырых" ProseMirror `Plugin`:

```tsx
import { Plugin, PluginKey } from '@tiptap/pm/state'

const MyPluginExtension = Extension.create({
  name: 'myPlugin',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('myPlugin'),
        props: {
          handleClick(view, pos, event) {
            console.log('Клик в позиции', pos)
            return false // false — не "проглатывать" событие, дать сработать стандартной логике дальше
          },
        },
      }),
    ]
  },
})
```

`PluginKey` — уникальный идентификатор плагина, по которому можно получить доступ к его состоянию из других мест: `myPluginKey.getState(editor.state)`.

## Decorations: визуальные "накладки" без изменения документа

**Decoration** — способ визуально изменить отображение документа (подсветка, рамка, замена контента), **не изменяя сам документ**. Это принципиально важно: decorations существуют только в представлении (view), а не в данных — их не видно в `getJSON()`/`getHTML()`.

```tsx
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

const HighlightTodoPlugin = Extension.create({
  name: 'highlightTodo',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('highlightTodo'),
        props: {
          decorations(state) {
            const decorations: Decoration[] = []
            state.doc.descendants((node, pos) => {
              if (!node.isText) return
              const regex = /TODO/g
              let match
              while ((match = regex.exec(node.text ?? ''))) {
                const from = pos + match.index
                const to = from + match[0].length
                decorations.push(Decoration.inline(from, to, { class: 'todo-highlight' }))
              }
            })
            return DecorationSet.create(state.doc, decorations)
          },
        },
      }),
    ]
  },
})
```

`state.doc.descendants((node, pos) => {...})` обходит все узлы документа с их позициями — стандартный способ найти нужные фрагменты текста для декорирования. `Decoration.inline(from, to, attrs)` создаёт инлайн-декорацию (добавляет CSS-класс/атрибуты к тексту в диапазоне), не трогая сами данные документа.

## Ключевая разница: mark vs decoration

|                                | Mark                                   | Decoration                                                                     |
| ------------------------------ | -------------------------------------- | ------------------------------------------------------------------------------ |
| Хранится в документе           | Да (`getJSON()` покажет)               | Нет, только в runtime view                                                     |
| Переживает сохранение/загрузку | Да                                     | Нет — пересчитывается заново из содержимого                                    |
| Типичное применение            | Постоянное форматирование (bold, link) | Временная подсветка (найденный поиском текст, TODO-маркеры, ошибки орфографии) |

## ⚠️ Частые ошибки новичков

**Ошибка 1: возвращать true из props.handleClick/handleKeyDown, даже когда не нужно "глотать" событие**

```tsx
// ❌ Плохо — блокирует стандартную обработку клика для ВСЕХ кликов
handleClick() {
  console.log('click')
  return true // событие никогда не дойдёт до остальной логики
}
```

```tsx
// ✅ Хорошо — возвращаем true только когда реально обработали событие сами
handleClick(view, pos, event) {
  if (!isSpecialCase) return false
  doSomething()
  return true
}
```

**Ошибка 2: путать decoration и mark для постоянного форматирования**

Если данные должны сохраниться и восстановиться при следующей загрузке документа — нужен mark, а не decoration. Decorations пересчитываются каждый раз заново на основе текущего содержимого и не являются частью сохраняемых данных.

**Ошибка 3: забыть про производительность в decorations() при больших документах**

Функция `decorations(state)` вызывается при каждом обновлении состояния — обход всего документа регулярными выражениями на каждое изменение может быть дорогим для больших документов. На практике стоит ограничивать область пересчёта или использовать мемоизацию там, где возможно.

## 💡 Best practices

- Используйте `addKeyboardShortcuts` для быстрого доступа к часто используемым командам, но избегайте конфликтов со стандартными браузерными шорткатами
- Используйте `Plugin`/`PluginKey` из `@tiptap/pm/state`, когда нужен доступ к низкоуровневым ProseMirror-хукам (`handleClick`, `handleKeyDown`, `decorations`, `appendTransaction`)
- Выбирайте decorations для всего временного/вычисляемого (подсветка поиска, индикаторы валидации), а marks — для того, что должно быть частью сохраняемого документа
- Давайте плагинам уникальные `PluginKey` — это упрощает отладку (видно в devtools ProseMirror) и позволяет читать состояние плагина извне
