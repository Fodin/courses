import { useLanguage } from 'src/hooks'

// ============================================
// Задание 1.3: Счётчик символов
// Task 1.3: Character Counter
// ============================================

// TODO: Импортируйте useState, useEditor, EditorContent, StarterKit
// TODO: Import useState, useEditor, EditorContent, StarterKit

// TODO: Заведите константу MAX_CHARS = 280
// TODO: Define MAX_CHARS = 280 constant

export function Task1_3() {
  const { t } = useLanguage()

  // TODO: Заведите state charCount, wordCount (числа)
  // TODO: Create charCount, wordCount state (numbers)

  // TODO: Напишите функцию countWords(text) — split(/\s+/).filter(Boolean).length
  // TODO: Write countWords(text) function — split(/\s+/).filter(Boolean).length

  // TODO: Создайте editor, в onCreate/onUpdate считайте editor.getText().length
  // и countWords(editor.getText())
  // TODO: Create editor, in onCreate/onUpdate compute editor.getText().length
  // and countWords(editor.getText())

  return (
    <div className="exercise-container">
      <h2>{t('task.1.3')}</h2>

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}

      {/* TODO: Выведите "charCount / MAX_CHARS символов · wordCount слов" */}
      {/* TODO: Output "charCount / MAX_CHARS characters · wordCount words" */}
      {/* с цветом: обычный < 90%, оранжевый >= 90%, красный > 100% */}
      {/* with color: normal < 90%, orange >= 90%, red > 100% */}
    </div>
  )
}
