import { useLanguage } from 'src/hooks'

// ============================================
// Задание 4.3: Blockquote и HorizontalRule
// Task 4.3: Blockquote & HorizontalRule
// ============================================

// TODO: Импортируйте useEditor, EditorContent, StarterKit
// TODO: Import useEditor, EditorContent, StarterKit

export function Task4_3() {
  const { t } = useLanguage()

  // TODO: Создайте editor через useEditor с StarterKit
  // TODO: Create editor via useEditor with StarterKit

  return (
    <div className="exercise-container">
      <h2>{t('task.4.3')}</h2>

      {/* TODO: Кнопка "Цитата" — toggleBlockquote(), подсветка через isActive('blockquote') */}
      {/* TODO: "Quote" button — toggleBlockquote(), highlighted via isActive('blockquote') */}

      {/* TODO: Кнопка "Разделитель" — setHorizontalRule() (без toggle-подсветки!) */}
      {/* TODO: "Divider" button — setHorizontalRule() (no toggle highlight!) */}

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}
    </div>
  )
}
