import { useLanguage } from 'src/hooks'

// ============================================
// Задание 0.2: Мини-тулбар
// Task 0.2: Mini Toolbar
// ============================================

// TODO: Импортируйте useEditor, EditorContent и StarterKit
// TODO: Import useEditor, EditorContent and StarterKit

export function Task0_2() {
  const { t } = useLanguage()

  // TODO: Создайте editor через useEditor({ extensions: [StarterKit], content: '...' })
  // TODO: Create editor via useEditor({ extensions: [StarterKit], content: '...' })

  return (
    <div className="exercise-container">
      <h2>{t('task.0.2')}</h2>

      {/* TODO: Добавьте кнопки Bold и Italic, вызывающие */}
      {/* editor?.chain().focus().toggleBold().run() и toggleItalic() */}
      {/* TODO: Add Bold and Italic buttons calling */}
      {/* editor?.chain().focus().toggleBold().run() and toggleItalic() */}

      {/* TODO: Отрендерите <EditorContent editor={editor} /> */}
      {/* TODO: Render <EditorContent editor={editor} /> */}
    </div>
  )
}
