// ============================================
// Cheat.tsx — Полное решение Level 14: Collaboration
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 14 — Collaboration</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>14.1: Общий Y.Doc</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>{'const [ydoc] = useState(() => new Y.Doc())'}</code> — один Y.Doc, два
            независимых useEditor
          </li>
          <li>
            Обязательно <code>StarterKit.configure({'{ undoRedo: false }'})</code>
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>14.2: y-webrtc</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Два ОТДЕЛЬНЫХ Y.Doc, связанных одним <code>roomName</code> через{' '}
            <code>WebrtcProvider</code>
          </li>
          <li>
            Обязательная очистка:{' '}
            <code>
              {'useEffect(() => () => { provider.destroy(); ydoc.destroy() }, [provider, ydoc])'}
            </code>
          </li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#2563eb' }}>14.3: CollaborationCaret</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>CollaborationCaret.configure({'{ provider, user: { name, color } }'})</code>
          </li>
          <li>
            <code>editor.storage.collaborationCaret.users</code> — актуальный список через{' '}
            <code>onTransaction</code>
          </li>
        </ul>
      </section>
    </div>
  )
}
