import { useEffect, useMemo, useState } from 'react'

import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCaret from '@tiptap/extension-collaboration-caret'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { WebrtcProvider } from 'y-webrtc'
import * as Y from 'yjs'

// ============================================
// Задание 14.1: Y.Doc и Collaboration — Решение
// ============================================

function SharedDocEditor({ ydoc, label }: { ydoc: Y.Doc; label: string }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ undoRedo: false }),
      Collaboration.configure({ document: ydoc }),
    ],
  })

  return (
    <div style={{ flex: 1, minWidth: '220px' }}>
      <h3>{label}</h3>
      <div
        style={{
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          padding: '1rem',
          minHeight: '120px',
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export function Task14_1_Solution() {
  const [ydoc] = useState(() => new Y.Doc())

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Y.Doc и Collaboration</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <SharedDocEditor ydoc={ydoc} label="Редактор А" />
        <SharedDocEditor ydoc={ydoc} label="Редактор Б" />
      </div>
    </div>
  )
}

// ============================================
// Задание 14.2: y-webrtc: синхронизация вкладок — Решение
// ============================================

const ROOM_NAME = 'tiptap-course-demo-room-14-2'

function WebrtcPeerEditor({ label }: { label: string }) {
  const ydoc = useMemo(() => new Y.Doc(), [])
  const provider = useMemo(() => new WebrtcProvider(ROOM_NAME, ydoc), [ydoc])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ undoRedo: false }),
      Collaboration.configure({ document: ydoc }),
    ],
  })

  useEffect(() => {
    return () => {
      provider.destroy()
      ydoc.destroy()
    }
  }, [provider, ydoc])

  return (
    <div style={{ flex: 1, minWidth: '220px' }}>
      <h3>{label}</h3>
      <div
        style={{
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          padding: '1rem',
          minHeight: '120px',
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export function Task14_2_Solution() {
  return (
    <div className="exercise-container">
      <h2>✅ Решение: y-webrtc: синхронизация вкладок</h2>
      <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
        Изменения синхронизируются через WebRTC (в т.ч. между вкладками этой страницы, через
        BroadcastChannel — без интернета).
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <WebrtcPeerEditor label="Участник А" />
        <WebrtcPeerEditor label="Участник Б" />
      </div>
    </div>
  )
}

// ============================================
// Задание 14.3: CollaborationCaret: курсоры соавторов — Решение
// ============================================

const CARET_ROOM_NAME = 'tiptap-course-demo-room-14-3'

interface CaretUser {
  clientId: number
  name?: string
  color?: string
}

function CaretPeerEditor({ label, name, color }: { label: string; name: string; color: string }) {
  const ydoc = useMemo(() => new Y.Doc(), [])
  const provider = useMemo(() => new WebrtcProvider(CARET_ROOM_NAME, ydoc), [ydoc])
  const [users, setUsers] = useState<CaretUser[]>([])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ undoRedo: false }),
      Collaboration.configure({ document: ydoc }),
      CollaborationCaret.configure({ provider, user: { name, color } }),
    ],
    onTransaction: ({ editor }) => setUsers(editor.storage.collaborationCaret.users),
  })

  useEffect(() => {
    return () => {
      provider.destroy()
      ydoc.destroy()
    }
  }, [provider, ydoc])

  return (
    <div style={{ flex: 1, minWidth: '260px' }}>
      <h3>
        {label} <span style={{ color }}>●</span>
      </h3>
      <div
        className="collaboration-caret-demo"
        style={{
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          padding: '1rem',
          minHeight: '120px',
        }}
      >
        <EditorContent editor={editor} />
      </div>
      <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>Активных пользователей: {users.length}</p>
    </div>
  )
}

export function Task14_3_Solution() {
  return (
    <div className="exercise-container">
      <h2>✅ Решение: CollaborationCaret: курсоры соавторов</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <CaretPeerEditor label="Алиса" name="Алиса" color="#f783ac" />
        <CaretPeerEditor label="Борис" name="Борис" color="#4dabf7" />
      </div>

      <style>{`
        .collaboration-caret-demo .collaboration-carets__caret {
          border-left: 1px solid;
          border-right: 1px solid;
          margin-left: -1px;
          margin-right: -1px;
          pointer-events: none;
          position: relative;
          word-break: normal;
        }
        .collaboration-caret-demo .collaboration-carets__label {
          border-radius: 3px 3px 3px 0;
          color: #fff;
          font-size: 0.65rem;
          font-weight: bold;
          left: -1px;
          padding: 0.1rem 0.3rem;
          position: absolute;
          top: -1.2rem;
          user-select: none;
          white-space: nowrap;
        }
      `}</style>
    </div>
  )
}
