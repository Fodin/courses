import { useState } from 'react'

// TODO: Implement API Protection Design self-check / Реализуй self-check по защите API
//
// Data / Данные: SCENARIOS — три сценария, у каждого:
//   { icon, title, description, reference: { auth, authz, encryption, logging } }
//   1) Публичный API для разработчиков
//   2) Внутренний API между микросервисами
//   3) Банковский / финтех API
//
// State / Состояние:
//   selected: number — индекс активного сценария
//   answers: Record<number, string> — ответ студента по каждому сценарию
//   revealed: Record<number, boolean> — показан ли эталон для сценария
//
// UI:
//   - три кликабельные карточки (активная — рамка #6366f1)
//   - textarea ответа (сохраняется при переключении сценариев)
//   - кнопка «Показать эталон» (toggle, отдельно для каждого сценария)
//   - панель эталона из 4 блоков: аутентификация / авторизация / шифрование / логирование
//
// Сохранение ответа: setAnswers(prev => ({ ...prev, [selected]: text }))

export function Task12_3() {
  const [selected, setSelected] = useState(0)

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Проектирование защиты API / API Protection Design</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Спроектируй четыре слоя защиты, затем сравни с эталоном / Design four layers, then compare
      </p>

      {/* TODO: три карточки сценариев / three scenario cards */}
      {/* TODO: textarea ответа студента с сохранением по сценарию / student answer textarea */}
      {/* TODO: кнопка «Показать эталон» / reveal button */}
      {/* TODO: панель эталона (auth / authz / encryption / logging) / reference panel */}

      <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Выбран сценарий: {selected}</p>
    </div>
  )
}
