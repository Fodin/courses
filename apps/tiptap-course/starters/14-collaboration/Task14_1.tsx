import { useLanguage } from 'src/hooks'

// ============================================
// Задание 14.1: Y.Doc и Collaboration
// Task 14.1: Y.Doc and Collaboration
// ============================================

// TODO: Импортируйте useState, Collaboration из '@tiptap/extension-collaboration',
// useEditor, EditorContent, StarterKit, * as Y из 'yjs'
// TODO: Import useState, Collaboration from '@tiptap/extension-collaboration',
// useEditor, EditorContent, StarterKit, * as Y from 'yjs'

// TODO: function SharedDocEditor({ ydoc, label }: { ydoc: Y.Doc; label: string }) {
//   const editor = useEditor({
//     extensions: [StarterKit.configure({ undoRedo: false }), Collaboration.configure({ document: ydoc })],
//   })
//   return (<div><h3>{label}</h3><EditorContent editor={editor} /></div>)
// }
// TODO: Define SharedDocEditor component (see above)

export function Task14_1() {
  const { t } = useLanguage()

  // TODO: const [ydoc] = useState(() => new Y.Doc())
  // TODO: Create shared ydoc via useState(() => new Y.Doc())

  return (
    <div className="exercise-container">
      <h2>{t('task.14.1')}</h2>

      {/* TODO: Отрендерите два <SharedDocEditor ydoc={ydoc} label="..." /> рядом */}
      {/* TODO: Render two SharedDocEditor instances side by side */}
    </div>
  )
}
