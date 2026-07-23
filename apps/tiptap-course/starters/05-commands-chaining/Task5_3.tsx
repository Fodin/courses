import { useLanguage } from 'src/hooks'

// ============================================
// Задание 5.3: Своя простая команда
// Task 5.3: Your Own Simple Command
// ============================================

// TODO: Импортируйте useEditor, EditorContent, type Editor, StarterKit
// TODO: Import useEditor, EditorContent, type Editor, StarterKit

// TODO: Функция clearFormatting(editor: Editor) —
// editor.chain().focus().unsetAllMarks().clearNodes().run()
// TODO: clearFormatting(editor: Editor) function (see above)

// TODO: Функция applyHighlightHeading(editor: Editor) —
// editor.chain().focus().toggleHeading({ level: 2 }).toggleBold().run()
// TODO: applyHighlightHeading(editor: Editor) function (see above)

export function Task5_3() {
  const { t } = useLanguage()

  // TODO: Создайте editor через useEditor с StarterKit и начальным контентом
  // (заголовок, bold/italic текст, список)
  // TODO: Create editor with StarterKit and rich initial content

  return (
    <div className="exercise-container">
      <h2>{t('task.5.3')}</h2>

      {/* TODO: Кнопка "Очистить форматирование" вызывает clearFormatting(editor) */}
      {/* TODO: "Clear formatting" button calls clearFormatting(editor) */}

      {/* TODO: Кнопка "Заголовок + Bold" вызывает applyHighlightHeading(editor) */}
      {/* TODO: "Heading + Bold" button calls applyHighlightHeading(editor) */}

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}
    </div>
  )
}
