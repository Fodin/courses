import { useState, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Task 8.2: State down / Children up — without React.memo
// Задание 8.2: State down / Children up — без React.memo
// ============================================
//
// Here's the Task8_2 component: color picker + heavy HeavyPreview.
// Right now HeavyPreview re-renders on every color change.
//
// Перед тобой компонент Task8_2: пикер цвета + тяжёлый HeavyPreview.
// Сейчас HeavyPreview ре-рендерится при каждом изменении цвета.
//
// Task: fix WITHOUT React.memo — only structural changes.
//
// Задача: исправить БЕЗ React.memo — только структурными изменениями.
//
// Part 1 — State down:
//   Move useState(color) and input[type=color] into a separate ColorPicker.
//   HeavyPreview stays next to it in the parent — not a child of ColorPicker.
//
// Часть 1 — State down:
//   Вынеси useState(color) и input[type=color] в отдельный ColorPicker.
//   HeavyPreview останется рядом в родителе — не потомком ColorPicker.
//
// Part 2 — Children up:
//   Create ColorWrapper({ children }) — it stores the color state.
//   Pass HeavyPreview as children from the outside.
//
// Часть 2 — Children up:
//   Создай ColorWrapper({ children }) — он хранит state цвета.
//   Передай HeavyPreview как children снаружи.

// TODO: Add render counter via useRef and display render count in UI
// TODO: Добавь render counter через useRef и отобрази количество рендеров в UI
function HeavyPreview({ label }: { label: string }) {
  // const renderCount = useRef(0)
  // renderCount.current++

  const items = Array.from({ length: 8 }, (_, i) => ({ id: i, color: `hsl(${i * 45}, 60%, 55%)` }))

  return (
    <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
      {/* TODO: Display render counter */}
      {/* TODO: Отобрази счётчик рендеров */}
      <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>{label}</div>
      <div style={{ display: 'flex', gap: '4px' }}>
        {items.map(item => (
          <div key={item.id} style={{ width: 28, height: 28, borderRadius: '4px', background: item.color }} />
        ))}
      </div>
    </div>
  )
}

// TODO: Implement ColorPicker — separate component with its own state (state down)
// TODO: Реализуй ColorPicker — отдельный компонент со своим state (state down)
// function ColorPicker() {
//   const [color, setColor] = useState('#1976d2')
//   // ... render counter ...
//   return (
//     <div>...</div>
//   )
// }

// TODO: Implement ColorWrapper — accepts children, stores color state (children up)
// TODO: Реализуй ColorWrapper — принимает children, хранит state цвета (children up)
// function ColorWrapper({ children }: { children: React.ReactNode }) {
//   const [color, setColor] = useState('#388e3c')
//   // ... render counter ...
//   return (
//     <div style={{ background: color + '18', border: `2px solid ${color}` }}>
//       {/* picker */}
//       {children}
//     </div>
//   )
// }

export function Task8_2() {
  const { t } = useLanguage()

  // TODO: Remove color and setColor from here after refactoring
  // TODO: Убери color и setColor отсюда после рефакторинга
  const [color, setColor] = useState('#1976d2')

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 8.2 — State down / Children up</h2>
      <p style={{ color: '#888', fontStyle: 'italic', fontSize: '0.85rem', marginBottom: '1rem' }}>
        Change color — HeavyPreview counter should not increase. Do not use React.memo!
      </p>

      {/* Variant 1: State down */}
      {/* Вариант 1: State down */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Variant 1: State down</div>
        {/* TODO: replace with <ColorPicker /> and <HeavyPreview /> side by side */}
        {/* TODO: замени на <ColorPicker /> и <HeavyPreview /> рядом */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#fff', borderRadius: '8px', border: '1px solid #eee' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: color }} />
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              style={{ width: 60, height: 28 }}
            />
            <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{color}</span>
          </div>
          <HeavyPreview label="HeavyPreview (should be a sibling of ColorPicker, not a child)" />
        </div>
      </div>

      {/* Variant 2: Children up */}
      {/* Вариант 2: Children up */}
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Variant 2: Children up</div>
        {/* TODO: replace with <ColorWrapper><HeavyPreview label="..." /></ColorWrapper> */}
        {/* TODO: замени на <ColorWrapper><HeavyPreview label="..." /></ColorWrapper> */}
        <div style={{ padding: '0.75rem', border: '2px solid #eee', borderRadius: '8px' }}>
          <HeavyPreview label="HeavyPreview (should be passed as children)" />
        </div>
      </div>
    </div>
  )
}

// So TypeScript doesn't complain about unused imports before implementation
// Чтобы TypeScript не ругался на неиспользуемые импорты до реализации
void useRef
