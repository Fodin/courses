import { useState } from 'react'

// TODO: Implement HATEOAS API Design self-check / Реализуй self-check по проектированию HATEOAS
//
// Data / Данные: SCENARIOS — три сценария, у каждого:
//   { icon, title, description, states: [{ state, rels: [...] }], rule }
//   1) Платёж (created → authorized → captured → refunded)
//   2) Статья в блоге (draft → published → archived)
//   3) Заявка на отпуск (submitted → approved/rejected → cancelled)
//
// State / Состояние:
//   selected: number — активный сценарий
//   answers: Record<number, string> — ответ студента по сценарию
//   revealed: Record<number, boolean> — показан ли эталон
//
// UI:
//   - три кликабельные карточки (активная — рамка #6366f1)
//   - textarea ответа (сохраняется при переключении)
//   - кнопка «Показать эталон» (toggle для каждого сценария)
//   - эталон: таблица «состояние → доступные rel» + комментарий с ключевым правилом

export function Task13_3() {
  const [selected, setSelected] = useState(0)

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Проектирование HATEOAS API / HATEOAS API Design</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Продумай состояния и переходы, затем сравни с эталоном / Design states and transitions, then compare
      </p>

      {/* TODO: три карточки сценариев / three scenario cards */}
      {/* TODO: textarea ответа с сохранением по сценарию / student answer textarea */}
      {/* TODO: кнопка «Показать эталон» / reveal button */}
      {/* TODO: эталон — таблица «состояние → rel» + правило / reference table */}

      <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Выбран сценарий: {selected}</p>
    </div>
  )
}
