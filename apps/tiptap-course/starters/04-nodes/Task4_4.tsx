import { useLanguage } from 'src/hooks'

// ============================================
// Задание 4.4: CodeBlock
// Task 4.4: CodeBlock
// ============================================

// TODO: Импортируйте useEditor, EditorContent, StarterKit
// TODO: Import useEditor, EditorContent, StarterKit

// TODO: Заведите content с готовым многострочным блоком кода <pre><code>...</code></pre>
// TODO: Define content with a ready multiline code block

export function Task4_4() {
  const { t } = useLanguage()

  // TODO: Создайте editor через useEditor с StarterKit и вашим content
  // TODO: Create editor via useEditor with StarterKit and your content

  return (
    <div className="exercise-container">
      <h2>{t('task.4.4')}</h2>

      {/* TODO: Кнопка "Code Block" — toggleCodeBlock(), подсветка через isActive('codeBlock') */}
      {/* TODO: "Code Block" button — toggleCodeBlock(), highlighted via isActive('codeBlock') */}

      {/* TODO: Отрендерите EditorContent, стилизуйте pre/code моноширинным шрифтом */}
      {/* TODO: Render EditorContent, style pre/code with monospace font */}
    </div>
  )
}
