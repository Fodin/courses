import { useLanguage } from 'src/hooks'

// ============================================
// Задание 2.2: Отключение extensions
// Task 2.2: Disabling Extensions
// ============================================

// TODO: Импортируйте useState, useEditor, EditorContent, StarterKit
// TODO: Import useState, useEditor, EditorContent, StarterKit

// TODO: Заведите два набора extensions: fullExtensions = [StarterKit]
// и minimalExtensions = [StarterKit.configure({ heading: false, bulletList: false,
// orderedList: false, blockquote: false, codeBlock: false, horizontalRule: false })]
// TODO: Define two extension sets: fullExtensions and minimalExtensions (see above)

export function Task2_2() {
  const { t } = useLanguage()

  // TODO: Заведите state mode: 'full' | 'minimal'
  // TODO: Create mode state: 'full' | 'minimal'

  // TODO: Создайте editor с extensions в зависимости от mode
  // Подсказка: используйте key={mode} на обёртке, чтобы редактор пересоздавался
  // TODO: Create editor with extensions depending on mode
  // Hint: use key={mode} on a wrapper so the editor is recreated

  return (
    <div className="exercise-container">
      <h2>{t('task.2.2')}</h2>

      {/* TODO: Кнопки переключения между 'full' и 'minimal' */}
      {/* TODO: Buttons to switch between 'full' and 'minimal' */}

      {/* TODO: Отрендерите EditorContent (в под-компоненте с key={mode}) */}
      {/* TODO: Render EditorContent (in a sub-component with key={mode}) */}
    </div>
  )
}
