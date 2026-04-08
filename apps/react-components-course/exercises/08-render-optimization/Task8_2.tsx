import { useState, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 8.2: State down / Children up — без React.memo
// ============================================
//
// Перед тобой компонент Task8_2: пикер цвета + тяжёлый HeavyPreview.
// Сейчас HeavyPreview ре-рендерится при каждом изменении цвета.
//
// Задача: исправить БЕЗ React.memo — только структурными изменениями.
//
// Часть 1 — State down:
//   Вынеси useState(color) и input[type=color] в отдельный ColorPicker.
//   HeavyPreview останется рядом в родителе — не потомком ColorPicker.
//
// Часть 2 — Children up:
//   Создай ColorWrapper({ children }) — он хранит state цвета.
//   Передай HeavyPreview как children снаружи.

// TODO: Добавь render counter через useRef и отобрази количество рендеров в UI
function HeavyPreview({ label }: { label: string }) {
  // const renderCount = useRef(0)
  // renderCount.current++

  const items = Array.from({ length: 8 }, (_, i) => ({ id: i, color: `hsl(${i * 45}, 60%, 55%)` }))

  return (
    <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
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

// TODO: Реализуй ColorPicker — отдельный компонент со своим state (state down)
// function ColorPicker() {
//   const [color, setColor] = useState('#1976d2')
//   // ... render counter ...
//   return (
//     <div>...</div>
//   )
// }

// TODO: Реализуй ColorWrapper — принимает children, хранит state цвета (children up)
// function ColorWrapper({ children }: { children: React.ReactNode }) {
//   const [color, setColor] = useState('#388e3c')
//   // ... render counter ...
//   return (
//     <div style={{ background: color + '18', border: `2px solid ${color}` }}>
//       {/* пикер */}
//       {children}
//     </div>
//   )
// }

export function Task8_2() {
  const { t } = useLanguage()

  // TODO: Убери color и setColor отсюда после рефакторинга
  const [color, setColor] = useState('#1976d2')

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 8.2 — State down / Children up</h2>
      <p style={{ color: '#888', fontStyle: 'italic', fontSize: '0.85rem', marginBottom: '1rem' }}>
        Меняй цвет — счётчик HeavyPreview не должен расти. React.memo не использовать!
      </p>

      {/* Вариант 1: State down */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Вариант 1: State down</div>
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
          <HeavyPreview label="HeavyPreview (должен быть соседом ColorPicker, не потомком)" />
        </div>
      </div>

      {/* Вариант 2: Children up */}
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Вариант 2: Children up</div>
        {/* TODO: замени на <ColorWrapper><HeavyPreview label="..." /></ColorWrapper> */}
        <div style={{ padding: '0.75rem', border: '2px solid #eee', borderRadius: '8px' }}>
          <HeavyPreview label="HeavyPreview (должен передаваться как children)" />
        </div>
      </div>
    </div>
  )
}

// Чтобы TypeScript не ругался на неиспользуемые импорты до реализации
void useRef
