import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// Task 14.1: Full Lifecycle Diagram
//
// Создайте интерактивную диаграмму полного lifecycle React:
//   setState → dispatchSetState → Scheduler → Work Loop → beginWork
//   → Reconciliation → completeWork → Commit → DOM Update → useEffect
//
// Требования:
// - Минимум 9 кликабельных блоков
// - При клике — показать popover/панель с объяснением этапа
// - Активный блок визуально подсвечивается (другой цвет)
// - Commit Phase содержит три подфазы: Before Mutation, Mutation, Layout
// - Кнопка "Сбросить" снимает подсветку
// - Повторный клик на активный блок — закрывает popover

// ─── TODO: Данные для объяснений ──────────────────────────────────────────────
// const EXPLANATIONS: Record<string, { title: string; text: string }> = {
//   setState: { title: '...', text: '...' },
//   ...
// }

// ─── TODO: LifecycleBlock компонент ──────────────────────────────────────────
// Props: id, label, active, onClick
// При active — другой цвет фона и рамки
// function LifecycleBlock(...) { ... }

// ─── TODO: Стрелка между блоками ─────────────────────────────────────────────
// function Arrow() { return <span>→</span> }

// ─── Main component ───────────────────────────────────────────────────────────

export function Task14_1() {
  const { t } = useLanguage()

  // TODO: useState для activeId: string | null
  // const [activeId, setActiveId] = useState<string | null>(null)

  // TODO: handleClick — если клик по активному → null, иначе → id
  // const handleClick = (id: string) => { ... }

  return (
    <div className="exercise-container">
      <h2>{t('task.14.1')}</h2>

      {/* TODO: Основная цепочка блоков со стрелками:
          setState → dispatchSetState → Scheduler → Work Loop → beginWork
          → Reconciliation → completeWork */}

      {/* TODO: Блок Commit Phase с пунктирной рамкой:
          Before Mutation → Mutation → Layout
          (внутри общего группирующего div) */}

      {/* TODO: Продолжение цепочки после Commit:
          → DOM Update → useEffect */}

      {/* TODO: Панель с объяснением (показывается если activeId !== null):
          Заголовок, описание, кнопка закрытия */}

      {/* TODO: Кнопка "Сбросить" */}

      <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 10, border: '2px solid #86efac', marginTop: 16 }}>
        <p style={{ margin: 0, fontSize: 14 }}>
          Реализуйте интерактивную диаграмму. Каждый блок при клике показывает
          объяснение этапа lifecycle. Commit Phase содержит три подфазы.
        </p>
      </div>
    </div>
  )
}
