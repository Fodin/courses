import { useLanguage } from 'src/hooks'

// ============================================
// Задание 15.3: Программное управление выделением
// Task 15.3: Programmatic Selection Control
// ============================================

// TODO: Импортируйте useState, useEditor, EditorContent, StarterKit
// TODO: Import useState, useEditor, EditorContent, StarterKit

// TODO: interface HeadingEntry { pos: number; text: string; level: number }
// TODO: Define HeadingEntry interface

// TODO: Заведите content с несколькими заголовками (h1, h2, h3) и параграфами между ними
// TODO: Define content with several headings (h1, h2, h3) and paragraphs between them

export function Task15_3() {
  const { t } = useLanguage()

  // TODO: Заведите state headings: HeadingEntry[]
  // TODO: Create headings state: HeadingEntry[]

  // TODO: Функция collectHeadings(editor) — обходит editor.state.doc.descendants,
  // собирает ноды с type.name === 'heading' в список { pos, text: node.textContent, level: node.attrs.level }
  // TODO: collectHeadings(editor) function (see above)

  // TODO: Создайте editor, вызывайте collectHeadings в onCreate и onUpdate
  // TODO: Create editor, call collectHeadings in onCreate and onUpdate

  return (
    <div className="exercise-container">
      <h2>{t('task.15.3')}</h2>

      {/* TODO: Список оглавления — клик по пункту вызывает
          editor?.chain().focus().setTextSelection(pos).scrollIntoView().run() */}
      {/* TODO: TOC list — click calls setTextSelection(pos).scrollIntoView() */}

      {/* TODO: Кнопка "Выделить весь документ" — editor?.commands.selectAll() */}
      {/* TODO: "Select all" button — editor?.commands.selectAll() */}

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}
    </div>
  )
}
