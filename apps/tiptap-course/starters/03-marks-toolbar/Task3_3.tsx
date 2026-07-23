import { useLanguage } from 'src/hooks'

// ============================================
// Задание 3.3: Link mark
// Task 3.3: Link Mark
// ============================================

// TODO: Импортируйте useEditor, EditorContent, StarterKit
// TODO: Import useEditor, EditorContent, StarterKit

// TODO: Link уже входит в StarterKit (Tiptap v3) — настройте его через
// StarterKit.configure({ link: { openOnClick: false, autolink: true } })
// TODO: Link is already part of StarterKit (Tiptap v3) — configure it via
// StarterKit.configure({ link: { openOnClick: false, autolink: true } })

export function Task3_3() {
  const { t } = useLanguage()

  // TODO: Создайте editor с настроенным StarterKit (см. выше)
  // TODO: Create editor with configured StarterKit (see above)

  // TODO: Функция handleSetLink — window.prompt('URL ссылки'), затем
  // editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  // TODO: handleSetLink function — prompt for URL, then setLink command

  // TODO: Функция handleUnsetLink — extendMarkRange('link').unsetLink().run()
  // TODO: handleUnsetLink function — extendMarkRange('link').unsetLink().run()

  return (
    <div className="exercise-container">
      <h2>{t('task.3.3')}</h2>

      {/* TODO: Кнопка "Добавить ссылку" вызывает handleSetLink */}
      {/* TODO: "Add link" button calls handleSetLink */}

      {/* TODO: Кнопка "Убрать ссылку" видна только при editor?.isActive('link') */}
      {/* TODO: "Remove link" button visible only when editor?.isActive('link') */}

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}
    </div>
  )
}
