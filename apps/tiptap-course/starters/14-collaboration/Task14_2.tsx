import { useLanguage } from 'src/hooks'

// ============================================
// Задание 14.2: y-webrtc: синхронизация вкладок
// Task 14.2: y-webrtc: Tab Synchronization
// ============================================

// TODO: Импортируйте useEffect, useMemo, Collaboration, useEditor, EditorContent,
// StarterKit, WebrtcProvider из 'y-webrtc', * as Y из 'yjs'
// TODO: Import useEffect, useMemo, Collaboration, useEditor, EditorContent,
// StarterKit, WebrtcProvider from 'y-webrtc', * as Y from 'yjs'

// TODO: const ROOM_NAME = 'tiptap-course-demo-room-14-2'
// TODO: Define ROOM_NAME constant

// TODO: function WebrtcPeerEditor({ label }: { label: string }) {
//   const ydoc = useMemo(() => new Y.Doc(), [])
//   const provider = useMemo(() => new WebrtcProvider(ROOM_NAME, ydoc), [ydoc])
//   const editor = useEditor({
//     extensions: [StarterKit.configure({ undoRedo: false }), Collaboration.configure({ document: ydoc })],
//   })
//   useEffect(() => { return () => { provider.destroy(); ydoc.destroy() } }, [provider, ydoc])
//   return (<div><h3>{label}</h3><EditorContent editor={editor} /></div>)
// }
// TODO: Define WebrtcPeerEditor component (see above)

export function Task14_2() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.14.2')}</h2>

      {/* TODO: Отрендерите два <WebrtcPeerEditor label="..." /> рядом */}
      {/* TODO: Render two WebrtcPeerEditor instances side by side */}
    </div>
  )
}
