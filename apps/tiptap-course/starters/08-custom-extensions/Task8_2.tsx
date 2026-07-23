import { useLanguage } from 'src/hooks'

// ============================================
// Задание 8.2: addStorage
// Task 8.2: addStorage
// ============================================

// TODO: Импортируйте useState, Extension, useEditor, EditorContent, StarterKit
// TODO: Import useState, Extension, useEditor, EditorContent, StarterKit

// TODO: interface EditStatsStorage { updatesCount: number; totalChars: number }
// TODO: interface EditStatsStorage { updatesCount: number; totalChars: number }

// TODO: declare module '@tiptap/core' { interface Storage { editStats: EditStatsStorage } }
// TODO: declare module '@tiptap/core' { interface Storage { editStats: EditStatsStorage } }

// TODO: const EditStats = Extension.create<Record<string, never>, EditStatsStorage>({
//   name: 'editStats',
//   addStorage() { return { updatesCount: 0, totalChars: 0 } },
//   onUpdate() {
//     this.storage.updatesCount += 1
//     this.storage.totalChars = this.editor.getText().length
//   },
// })
// TODO: Define EditStats extension (see above)

export function Task8_2() {
  const { t } = useLanguage()

  // TODO: Заведите state stats: EditStatsStorage
  // TODO: Create stats state: EditStatsStorage

  // TODO: Создайте editor со StarterKit + EditStats, в onUpdate синхронизируйте
  // stats с editor.storage.editStats через setStats
  // TODO: Create editor with StarterKit + EditStats, sync stats in onUpdate

  return (
    <div className="exercise-container">
      <h2>{t('task.8.2')}</h2>

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}

      {/* TODO: Выведите "Изменений: N · Символов сейчас: M" */}
      {/* TODO: Output "Updates: N · Characters now: M" */}
    </div>
  )
}
