import { useLanguage } from 'src/hooks'

// ============================================
// Задание 1.1: HTML и JSON вывод
// Task 1.1: HTML and JSON Output
// ============================================

// TODO: Импортируйте useState из 'react'
// TODO: Import useState from 'react'

// TODO: Импортируйте useEditor, EditorContent, тип JSONContent из '@tiptap/react'
// TODO: Import useEditor, EditorContent, JSONContent type from '@tiptap/react'

// TODO: Импортируйте StarterKit
// TODO: Import StarterKit

export function Task1_1() {
  const { t } = useLanguage()

  // TODO: Заведите state html (string) и json (JSONContent | null)
  // TODO: Create html (string) and json (JSONContent | null) state

  // TODO: Создайте editor с onCreate и onUpdate, обновляющими html и json
  // через editor.getHTML() и editor.getJSON()
  // TODO: Create editor with onCreate and onUpdate updating html and json
  // via editor.getHTML() and editor.getJSON()

  return (
    <div className="exercise-container">
      <h2>{t('task.1.1')}</h2>

      {/* TODO: Отрендерите <EditorContent editor={editor} /> */}
      {/* TODO: Render <EditorContent editor={editor} /> */}

      {/* TODO: Выведите html и JSON.stringify(json, null, 2) в двух блоках <pre> */}
      {/* TODO: Output html and JSON.stringify(json, null, 2) in two <pre> blocks */}
    </div>
  )
}
