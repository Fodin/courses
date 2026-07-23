import { useLanguage } from 'src/hooks'

// ============================================
// Задание 7.2: Content-выражения
// Task 7.2: Content Expressions
// ============================================

// TODO: Импортируйте useState, useEditor, EditorContent, StarterKit
// TODO: Import useState, useEditor, EditorContent, StarterKit

// TODO: Заведите content с blockquote из двух параграфов
// TODO: Define content with a blockquote of two paragraphs

export function Task7_2() {
  const { t } = useLanguage()

  // TODO: Создайте editor, используйте onSelectionUpdate/onUpdate чтобы триггерить
  // перерендер компонента (например через forceRender state)
  // TODO: Create editor, use onSelectionUpdate/onUpdate to trigger re-render

  // TODO: boldAvailable = editor?.can().toggleBold() ?? false
  // TODO: boldAvailable = editor?.can().toggleBold() ?? false

  return (
    <div className="exercise-container">
      <h2>{t('task.7.2')}</h2>

      {/* TODO: Кнопка "Добавить параграф в конец документа" —
          editor?.chain().focus('end').insertContent('...').run() */}
      {/* TODO: "Add paragraph at document end" button */}

      {/* TODO: Кнопка "Переключить Code Block" — toggleCodeBlock() */}
      {/* TODO: "Toggle Code Block" button */}

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}

      {/* TODO: Выведите "Bold доступен/недоступен" на основе boldAvailable */}
      {/* TODO: Output "Bold available/unavailable" based on boldAvailable */}
    </div>
  )
}
