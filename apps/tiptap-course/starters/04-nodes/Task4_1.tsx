import { useLanguage } from 'src/hooks'

// ============================================
// Задание 4.1: Заголовки
// Task 4.1: Headings
// ============================================

// TODO: Импортируйте useEditor, EditorContent, StarterKit
// TODO: Import useEditor, EditorContent, StarterKit

export function Task4_1() {
  const { t } = useLanguage()

  // TODO: Создайте editor со StarterKit.configure({ heading: { levels: [1, 2, 3] } })
  // TODO: Create editor with StarterKit.configure({ heading: { levels: [1, 2, 3] } })

  return (
    <div className="exercise-container">
      <h2>{t('task.4.1')}</h2>

      {/* TODO: Кнопки H1/H2/H3, вызывающие toggleHeading({ level }),
          подсветка через isActive('heading', { level }) */}
      {/* TODO: H1/H2/H3 buttons calling toggleHeading({ level }),
          highlight via isActive('heading', { level }) */}

      {/* TODO: Кнопка "Параграф" — editor?.chain().focus().setParagraph().run() */}
      {/* TODO: "Paragraph" button — editor?.chain().focus().setParagraph().run() */}

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}
    </div>
  )
}
