import { useLanguage } from 'src/hooks'

// ============================================
// Задание 13.2: FloatingMenu на пустой строке
// Task 13.2: FloatingMenu on Empty Line
// ============================================

// TODO: Импортируйте useEditor, EditorContent, StarterKit,
// FloatingMenu из '@tiptap/react/menus'
// TODO: Import useEditor, EditorContent, StarterKit,
// FloatingMenu from '@tiptap/react/menus'

export function Task13_2() {
  const { t } = useLanguage()

  // TODO: Создайте editor с несколькими заполненными параграфами
  // и одним пустым параграфом в конце
  // TODO: Create editor with several filled paragraphs and one empty at the end

  return (
    <div className="exercise-container">
      <h2>{t('task.13.2')}</h2>

      {/* TODO: {editor && <FloatingMenu editor={editor}>
          кнопки H2 / Список / Цитата
        </FloatingMenu>} */}
      {/* TODO: Conditional FloatingMenu with H2/List/Quote buttons */}

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}
    </div>
  )
}
