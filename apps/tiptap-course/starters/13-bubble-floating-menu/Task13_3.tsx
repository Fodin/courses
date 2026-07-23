import { useLanguage } from 'src/hooks'

// ============================================
// Задание 13.3: shouldShow: кастомная логика
// Task 13.3: shouldShow: Custom Logic
// ============================================

// TODO: Импортируйте useEditor, EditorContent, StarterKit,
// BubbleMenu из '@tiptap/react/menus'
// TODO: Import useEditor, EditorContent, StarterKit,
// BubbleMenu from '@tiptap/react/menus'

export function Task13_3() {
  const { t } = useLanguage()

  // TODO: Создайте editor с заголовками и обычными параграфами в content
  // TODO: Create editor with headings and regular paragraphs in content

  return (
    <div className="exercise-container">
      <h2>{t('task.13.3')}</h2>

      {/* TODO: {editor && <BubbleMenu editor={editor} shouldShow={({ editor, state }) => {
          const { from, to } = state.selection
          return from !== to && editor.isActive('heading')
        }}>
          кнопки H1/H2/H3
        </BubbleMenu>} */}
      {/* TODO: Conditional BubbleMenu with custom shouldShow (see above) */}

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}
    </div>
  )
}
