import { useState, useRef } from 'react'
import { flushSync } from 'react-dom'
import { useLanguage } from 'src/hooks'

// Task 9.2: flushSync Demo
//
// Chat with auto-scroll. Without flushSync the scroll fires before React
// applies the new state — the DOM doesn't yet contain the new message,
// so scrollHeight is stale.
//
// With flushSync the update is flushed synchronously before scrollToBottom
// is called — DOM is up to date, scroll is always accurate.

// ─── Initial messages (use these as the starting state) ──────────────────────

interface Message {
  id: number
  text: string
  author: string
}

const INITIAL_MESSAGES: Message[] = [
  { id: 1, text: 'Привет! Как дела?', author: 'Алиса' },
  { id: 2, text: 'Всё отлично, спасибо!', author: 'Боб' },
  { id: 3, text: 'Чем занимаешься?', author: 'Алиса' },
  { id: 4, text: 'Изучаю React батчинг', author: 'Боб' },
  { id: 5, text: 'О, это интересно! Расскажи подробнее', author: 'Алиса' },
  { id: 6, text: 'Сейчас как раз делаю задание про flushSync', author: 'Боб' },
]

// ─── TODO: implement ChatPane ─────────────────────────────────────────────────
//
// Props:
//   title: string
//   withFlushSync: boolean   ← controls the behaviour
//
// Requirements:
//   - useState for messages (start with INITIAL_MESSAGES)
//   - useState for text input
//   - useRef for the message list container (for scroll)
//   - useRef for render count (increment in body)
//
// sendMessage():
//   if withFlushSync:
//     flushSync(() => { setMessages(prev => [...prev, newMsg]) })
//     listRef.current.scrollTop = listRef.current.scrollHeight   // DOM ready
//   else:
//     setMessages(prev => [...prev, newMsg])
//     listRef.current.scrollTop = listRef.current.scrollHeight   // DOM NOT ready yet
//
// The message list div MUST have:
//   ref={listRef}
//   style={{ height: 220, overflowY: 'auto' }}
//
// IMPORTANT: no useEffect for scroll — call scrollToBottom directly in the handler

function ChatPane({
  title,
  withFlushSync,
}: {
  title: string
  withFlushSync: boolean
}) {
  const { t } = useLanguage()

  // TODO: add state and refs

  const sendMessage = () => {
    // TODO: implement with / without flushSync
  }

  return (
    <div style={{ flex: 1, border: '2px solid #d1d5db', borderRadius: 10, padding: 16 }}>
      <h3>{title}</h3>
      {/* TODO: code label showing flushSync or plain setState */}
      {/* TODO: render counter */}
      {/* TODO: message list with ref */}
      {/* TODO: input + send button */}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Task9_2() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.9.2')}</h2>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>
        Добавляйте длинные сообщения — в левом чате прокрутка иногда неточная.
      </p>

      <div style={{ display: 'flex', gap: 16 }}>
        <ChatPane title="Без flushSync" withFlushSync={false} />
        <ChatPane title="С flushSync" withFlushSync={true} />
      </div>
    </div>
  )
}
