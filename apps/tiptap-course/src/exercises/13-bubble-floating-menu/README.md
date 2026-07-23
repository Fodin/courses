# BubbleMenu и FloatingMenu

## Два вида контекстных меню

Tiptap предоставляет два готовых паттерна всплывающих панелей инструментов:

```mermaid
graph LR
  A["BubbleMenu"] --> B["Появляется при выделении текста,<br/>рядом с выделением"]
  C["FloatingMenu"] --> D["Появляется на пустой строке,<br/>обычно слева от курсора"]
```

- **BubbleMenu** — классический паттерн "выделил текст → появилась панель форматирования" (как в Medium, Notion при выделении)
- **FloatingMenu** — панель, появляющаяся на **пустой строке**, обычно предлагающая вставить блок (заголовок, список, изображение) — как в Notion при нажатии на пустую строку

📌 В Tiptap v3 позиционирование обоих меню построено на **floating-ui** (пришедшей на смену tippy.js из v2) — библиотеке для умного позиционирования всплывающих элементов с учётом границ экрана.

## Установка

Оба компонента — React-обёртки, импортируемые из отдельного подпакета `@tiptap/react/menus` (чтобы `floating-ui` оставался опциональной зависимостью для тех, кто не использует эти меню):

```bash
npm install @tiptap/extension-bubble-menu @tiptap/extension-floating-menu
```

```tsx
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'
```

## BubbleMenu: панель при выделении

```tsx
import { EditorContent, useEditor } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'

function Editor() {
  const editor = useEditor({ extensions: [StarterKit] })

  return (
    <>
      {editor && (
        <BubbleMenu editor={editor}>
          <button onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </>
  )
}
```

`BubbleMenu` рендерит `children` в `<div>`, который автоматически появляется рядом с текущим выделением и скрывается, когда выделения нет. Позиционированием (появление сверху/снизу выделения с учётом границ окна) занимается floating-ui автоматически.

## FloatingMenu: панель на пустой строке

```tsx
import { FloatingMenu } from '@tiptap/react/menus'

function Editor() {
  const editor = useEditor({ extensions: [StarterKit] })

  return (
    <>
      {editor && (
        <FloatingMenu editor={editor}>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            H2
          </button>
          <button onClick={() => editor.chain().focus().toggleBulletList().run()}>• Список</button>
        </FloatingMenu>
      )}
      <EditorContent editor={editor} />
    </>
  )
}
```

По умолчанию `FloatingMenu` показывается только когда курсор находится на **пустом** текстовом блоке (пустой параграф) — это встроенная логика "показывать меню только когда есть что предложить вставить".

## shouldShow: своя логика показа

Оба компонента принимают проп `shouldShow`, позволяющий полностью переопределить условие показа:

```tsx
<BubbleMenu
  editor={editor}
  shouldShow={({ editor, state }) => {
    // Показывать bubble menu только когда выделен текст ВНУТРИ заголовка
    const { from, to } = state.selection
    const isTextSelected = from !== to
    return isTextSelected && editor.isActive('heading')
  }}
>
  ...
</BubbleMenu>
```

`shouldShow` получает объект с `editor`, `state`, `from`, `to` и должен вернуть `boolean`. Это открывает сценарии вроде: "показывать разные меню для разных типов контента", "не показывать меню внутри блока кода" и т.п.

## options: позиционирование через floating-ui

Проп `options` пробрасывается напрямую в `floating-ui` и позволяет настроить, например, предпочтительное положение меню:

```tsx
<BubbleMenu editor={editor} options={{ placement: 'top', offset: 8 }}>
  ...
</BubbleMenu>
```

## ⚠️ Частые ошибки новичков

**Ошибка 1: рендерить BubbleMenu/FloatingMenu до того, как editor создан**

```tsx
// ❌ Плохо — упадёт, потому что editor может быть null на первом рендере
<BubbleMenu editor={editor}>...</BubbleMenu>
```

```tsx
// ✅ Хорошо — условный рендер
{
  editor && <BubbleMenu editor={editor}>...</BubbleMenu>
}
```

**Ошибка 2: ожидать, что FloatingMenu появится при любом выделении**

FloatingMenu по умолчанию — это меню для **пустой строки**, не для выделения текста (для этого есть BubbleMenu). Если нужно показать оба меню в разных сценариях в одном редакторе — используйте оба компонента одновременно с их разной, взаимоисключающей логикой показа.

**Ошибка 3: забыть про shouldShow при кастомизации поведения, вместо этого пытаться скрывать через CSS**

```tsx
// ❌ Плохо — меню всё равно монтируется/позиционируется, просто визуально скрыто,
// это не отменяет лишнюю работу по позиционированию
<BubbleMenu editor={editor} className={shouldHide ? 'hidden' : ''}>
  ...
</BubbleMenu>
```

```tsx
// ✅ Хорошо — используйте встроенный механизм показа/скрытия
<BubbleMenu editor={editor} shouldShow={props => !shouldHideCondition(props)}>
  ...
</BubbleMenu>
```

## 💡 Best practices

- Всегда оборачивайте `BubbleMenu`/`FloatingMenu` в условный рендер `{editor && ...}`, так как `editor` может быть `null` на первом рендере
- Используйте `shouldShow` для тонкой настройки условий показа, а не CSS-классы для скрытия — это избавляет от лишней работы позиционирования
- Не дублируйте всю логику toolbar внутри BubbleMenu — переиспользуйте общий компонент кнопок форматирования (например, тот же `Toolbar` из уровня 3), передавая туда `editor`
- Настраивайте `options.placement`/`offset` под конкретный UX вашего приложения, а не полагайтесь только на значения по умолчанию
