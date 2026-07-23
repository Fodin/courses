import { useLanguage } from 'src/hooks'

// ============================================
// Задание 2.1: Обзор StarterKit
// Task 2.1: StarterKit Overview
// ============================================

// TODO: Импортируйте useEditor, EditorContent, StarterKit
// TODO: Import useEditor, EditorContent, StarterKit

// TODO: Заведите константу content с заголовком, bold/italic/strike/code,
// маркированным и нумерованным списком, blockquote, code block, hr
// TODO: Define content constant with a heading, bold/italic/strike/code,
// bullet and ordered lists, blockquote, code block, hr

export function Task2_1() {
  const { t } = useLanguage()

  // TODO: Создайте editor через useEditor с StarterKit и вашим content
  // TODO: Create editor via useEditor with StarterKit and your content

  // TODO: Получите имена активных extensions:
  // editor?.extensionManager.extensions.map(ext => ext.name) ?? []
  // TODO: Get active extension names

  return (
    <div className="exercise-container">
      <h2>{t('task.2.1')}</h2>

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}

      {/* TODO: Выведите список имён extensions как <ul> */}
      {/* TODO: Output extension names list as <ul> */}
    </div>
  )
}
