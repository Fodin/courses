import { useLanguage } from 'src/hooks'

// ============================================
// Задание 8.1: Extension.create и addOptions
// Task 8.1: Extension.create and addOptions
// ============================================

// TODO: Импортируйте useState, Extension из '@tiptap/core',
// useEditor, EditorContent, StarterKit
// TODO: Import useState, Extension from '@tiptap/core',
// useEditor, EditorContent, StarterKit

// TODO: interface MaxLengthOptions { maxLength: number }
// TODO: interface MaxLengthOptions { maxLength: number }

// TODO: const MaxLength = Extension.create<MaxLengthOptions>({
//   name: 'maxLength',
//   addOptions() { return { maxLength: 280 } },
// })
// TODO: Define MaxLength extension (see above)

export function Task8_1() {
  const { t } = useLanguage()

  // TODO: Создайте editor со StarterKit + MaxLength.configure({ maxLength: 100 })
  // TODO: Create editor with StarterKit + MaxLength.configure({ maxLength: 100 })

  // TODO: Найдите extension через editor?.extensionManager.extensions.find(...)
  // и прочитайте его options.maxLength
  // TODO: Find extension and read its options.maxLength

  return (
    <div className="exercise-container">
      <h2>{t('task.8.1')}</h2>

      {/* TODO: Выведите "Лимит: N символов" */}
      {/* TODO: Output "Limit: N characters" */}

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}

      {/* TODO: Выведите счётчик "currentLength / maxLength", красный при превышении */}
      {/* TODO: Output "currentLength / maxLength" counter, red when exceeded */}
    </div>
  )
}
