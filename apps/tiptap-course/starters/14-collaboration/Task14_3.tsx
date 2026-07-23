import { useLanguage } from 'src/hooks'

// ============================================
// Задание 14.3: CollaborationCaret: курсоры соавторов
// Task 14.3: CollaborationCaret: Peer Cursors
// ============================================

// TODO: Импортируйте useEffect, useMemo, useState, Collaboration,
// CollaborationCaret из '@tiptap/extension-collaboration-caret',
// useEditor, EditorContent, StarterKit, WebrtcProvider, * as Y
// TODO: Import useEffect, useMemo, useState, Collaboration,
// CollaborationCaret, useEditor, EditorContent, StarterKit, WebrtcProvider, * as Y

// TODO: const CARET_ROOM_NAME = 'tiptap-course-demo-room-14-3'
// TODO: Define CARET_ROOM_NAME constant

// TODO: interface CaretUser { clientId: number; name?: string; color?: string }
// TODO: Define CaretUser interface

// TODO: function CaretPeerEditor({ label, name, color }: { label: string; name: string; color: string }) {
//   const ydoc = useMemo(() => new Y.Doc(), [])
//   const provider = useMemo(() => new WebrtcProvider(CARET_ROOM_NAME, ydoc), [ydoc])
//   const [users, setUsers] = useState<CaretUser[]>([])
//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({ undoRedo: false }),
//       Collaboration.configure({ document: ydoc }),
//       CollaborationCaret.configure({ provider, user: { name, color } }),
//     ],
//     onTransaction: ({ editor }) => setUsers(editor.storage.collaborationCaret.users),
//   })
//   useEffect(() => { return () => { provider.destroy(); ydoc.destroy() } }, [provider, ydoc])
//   return (<div><h3>{label}</h3><EditorContent editor={editor} /><p>Активных: {users.length}</p></div>)
// }
// TODO: Define CaretPeerEditor component (see above)

export function Task14_3() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.14.3')}</h2>

      {/* TODO: Отрендерите два <CaretPeerEditor label="..." name="..." color="#..." /> с разными
          именами/цветами, стилизуйте .collaboration-carets__caret / __label через CSS */}
      {/* TODO: Render two CaretPeerEditor instances with different name/color,
          style .collaboration-carets__caret / __label via CSS */}
    </div>
  )
}
