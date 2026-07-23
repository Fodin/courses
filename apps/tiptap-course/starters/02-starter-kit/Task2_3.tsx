import { useLanguage } from 'src/hooks'

// ============================================
// Задание 2.3: Точечная конфигурация
// Task 2.3: Fine-Grained Configuration
// ============================================

// TODO: Импортируйте useEditor, EditorContent, StarterKit
// TODO: Import useEditor, EditorContent, StarterKit

// TODO: Настройте StarterKit.configure({
//   heading: { levels: [1, 2] },
//   bulletList: { HTMLAttributes: { class: 'my-bullet-list' } },
//   history: { depth: 50 },
// })
// TODO: Configure StarterKit (see above)

export function Task2_3() {
  const { t } = useLanguage()

  // TODO: Создайте editor с настроенным StarterKit
  // TODO: Create editor with configured StarterKit

  return (
    <div className="exercise-container">
      <h2>{t('task.2.3')}</h2>

      {/* TODO: Кнопки H1, H2, H3 (недоступен) вызывающие */}
      {/* editor?.chain().focus().toggleHeading({ level }).run() */}
      {/* Подсветите активную кнопку через editor?.isActive('heading', { level }) */}
      {/* TODO: H1, H2, H3 (unavailable) buttons calling toggleHeading */}
      {/* Highlight active button via editor?.isActive('heading', { level }) */}

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}
    </div>
  )
}
