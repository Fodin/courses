import { useLanguage } from 'src/hooks'

// ============================================
// Задание 11.1: Markdown input rules
// Task 11.1: Markdown Input Rules
// ============================================

// TODO: Импортируйте useEditor, EditorContent, StarterKit
// TODO: Import useEditor, EditorContent, StarterKit

// TODO: Заведите массив HINTS: [{ pattern: '## ', result: 'Заголовок H2' }, ...]
// (## , **текст**, * или - , 1. , > )
// TODO: Define HINTS array (see patterns above)

export function Task11_1() {
  const { t } = useLanguage()

  // TODO: Создайте editor через useEditor с StarterKit
  // TODO: Create editor via useEditor with StarterKit

  return (
    <div className="exercise-container">
      <h2>{t('task.11.1')}</h2>

      {/* TODO: Таблица подсказок HINTS */}
      {/* TODO: HINTS table */}

      {/* TODO: Кнопка "Вставить примеры" — insertContent с готовым HTML */}
      {/* TODO: "Insert examples" button — insertContent with ready HTML */}

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}
    </div>
  )
}
