import { useLanguage } from 'src/hooks'

// ============================================
// Задание 0.1: Первый редактор
// Task 0.1: First Editor
// ============================================

// TODO: Импортируйте useEditor и EditorContent из '@tiptap/react'
// TODO: Import useEditor and EditorContent from '@tiptap/react'

// TODO: Импортируйте StarterKit из '@tiptap/starter-kit'
// TODO: Import StarterKit from '@tiptap/starter-kit'

export function Task0_1() {
  const { t } = useLanguage()

  // TODO: Создайте editor через useEditor({ extensions: [StarterKit], content: '...' })
  // TODO: Create editor via useEditor({ extensions: [StarterKit], content: '...' })

  return (
    <div className="exercise-container">
      <h2>{t('task.0.1')}</h2>

      {/* TODO: Отрендерите <EditorContent editor={editor} /> внутри контейнера */}
      {/* TODO: Render <EditorContent editor={editor} /> inside a container */}
    </div>
  )
}
