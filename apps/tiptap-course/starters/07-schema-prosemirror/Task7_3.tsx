import { useLanguage } from 'src/hooks'

// ============================================
// Задание 7.3: Группы inline и block
// Task 7.3: Inline & Block Groups
// ============================================

// TODO: Импортируйте useEditor, EditorContent, StarterKit
// TODO: Import useEditor, EditorContent, StarterKit

export function Task7_3() {
  const { t } = useLanguage()

  // TODO: Создайте editor через useEditor с StarterKit
  // TODO: Create editor via useEditor with StarterKit

  // TODO: Получите nodeEntries и разделите на blockNodes (spec.group === 'block'),
  // inlineNodes (spec.group === 'inline') и otherNodes (всё остальное)
  // TODO: Get nodeEntries and split into blockNodes/inlineNodes/otherNodes by spec.group

  return (
    <div className="exercise-container">
      <h2>{t('task.7.3')}</h2>

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}

      {/* TODO: Три колонки: Block-ноды / Inline-ноды / Прочие, с пояснениями */}
      {/* TODO: Three columns: Block / Inline / Other nodes, with explanations */}
    </div>
  )
}
