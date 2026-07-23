import { useLanguage } from 'src/hooks'

// ============================================
// Задание 3.4: Полная панель инструментов
// Task 3.4: Full Toolbar
// ============================================

// TODO: Импортируйте useEditor, EditorContent, type Editor, StarterKit
// TODO: Import useEditor, EditorContent, type Editor, StarterKit

// TODO: Определите interface ToolbarButtonConfig { label, isActive(), onClick() }
// TODO: Define ToolbarButtonConfig interface { label, isActive(), onClick() }

// TODO: Реализуйте компонент Toolbar({ editor }: { editor: Editor | null }),
// который возвращает null, если editor === null, а иначе — рендерит кнопки
// bold/italic/strike/code/link из массива конфигураций через .map()
// TODO: Implement Toolbar({ editor }) component — returns null if editor is null,
// otherwise renders bold/italic/strike/code/link buttons from a config array via .map()

export function Task3_4() {
  const { t } = useLanguage()

  // TODO: Создайте editor со StarterKit.configure({ link: { openOnClick: false, autolink: true } })
  // TODO: Create editor with configured StarterKit (link included in v3)

  return (
    <div className="exercise-container">
      <h2>{t('task.3.4')}</h2>

      {/* TODO: <Toolbar editor={editor} /> */}

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}
    </div>
  )
}
