import { useState } from 'react'

// ============================================
// Задание 1.1: Конструктор пути FSD — слой / слайс / сегмент
// ============================================

interface LayerOption {
  id: string
  title: string
  hasSlices: boolean
  desc: string
}

const LAYERS: LayerOption[] = [
  { id: 'app', title: 'app', hasSlices: false, desc: 'инициализация приложения' },
  { id: 'pages', title: 'pages', hasSlices: true, desc: 'страница под маршрут' },
  { id: 'widgets', title: 'widgets', hasSlices: true, desc: 'самостоятельный блок интерфейса' },
  { id: 'features', title: 'features', hasSlices: true, desc: 'пользовательский сценарий' },
  { id: 'entities', title: 'entities', hasSlices: true, desc: 'бизнес-сущность' },
  { id: 'shared', title: 'shared', hasSlices: false, desc: 'код без бизнес-смысла' },
]

const SLICES_BY_LAYER: Record<string, string[]> = {
  pages: ['profile', 'cart'],
  widgets: ['header', 'product-gallery'],
  features: ['add-to-cart', 'login'],
  entities: ['user', 'product'],
}

const SEGMENTS = ['ui', 'model', 'api', 'lib', 'config']

const SEGMENT_HINT: Record<string, string> = {
  ui: 'компоненты и стили',
  model: 'состояние, типы, бизнес-логика',
  api: 'запросы к серверу',
  lib: 'внутренние утилиты слайса',
  config: 'константы и флаги конфигурации',
}

export function Task1_1_Solution() {
  const [layer, setLayer] = useState<string>('features')
  const [slice, setSlice] = useState<string>('add-to-cart')
  const [segment, setSegment] = useState<string>('ui')

  const currentLayer = LAYERS.find(l => l.id === layer)!
  const availableSlices = SLICES_BY_LAYER[layer] ?? []

  const handleLayerClick = (id: string) => {
    setLayer(id)
    const slices = SLICES_BY_LAYER[id]
    if (slices) setSlice(slices[0])
  }

  const path = currentLayer.hasSlices
    ? `src/${layer}/${slice}/${segment}/File.tsx`
    : `src/${layer}/${segment}/File.tsx`

  return (
    <div className="exercise-container">
      <h2>Конструктор пути FSD</h2>
      <p style={{ color: 'var(--clr-text-muted)' }}>
        Выберите слой, слайс (если есть) и сегмент — карточка соберёт итоговый путь к файлу и
        объяснит, что каждая часть значит.
      </p>

      <div style={{ marginBottom: 12 }}>
        <strong style={{ fontSize: 13 }}>1. Слой (уровень ответственности)</strong>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
          {LAYERS.map(l => (
            <button
              key={l.id}
              onClick={() => handleLayerClick(l.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid var(--clr-border)',
                cursor: 'pointer',
                fontWeight: l.id === layer ? 700 : 500,
                background: l.id === layer ? 'rgba(59,130,246,0.15)' : 'var(--clr-bg-secondary)',
                color: 'var(--clr-text)',
              }}
            >
              {l.title}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <strong style={{ fontSize: 13 }}>2. Слайс (предметная область)</strong>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
          {currentLayer.hasSlices ? (
            availableSlices.map(s => (
              <button
                key={s}
                onClick={() => setSlice(s)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--clr-border)',
                  cursor: 'pointer',
                  fontWeight: s === slice ? 700 : 500,
                  background: s === slice ? 'rgba(34,197,94,0.15)' : 'var(--clr-bg-secondary)',
                  color: 'var(--clr-text)',
                }}
              >
                {s}
              </button>
            ))
          ) : (
            <span style={{ fontSize: 13, color: 'var(--clr-text-muted)', fontStyle: 'italic' }}>
              у слоя «{layer}» слайсов нет — код здесь не делится по предметной области
            </span>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <strong style={{ fontSize: 13 }}>3. Сегмент (техническое назначение)</strong>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
          {SEGMENTS.map(s => (
            <button
              key={s}
              onClick={() => setSegment(s)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid var(--clr-border)',
                cursor: 'pointer',
                fontWeight: s === segment ? 700 : 500,
                background: s === segment ? 'rgba(234,179,8,0.15)' : 'var(--clr-bg-secondary)',
                color: 'var(--clr-text)',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          padding: 16,
          borderRadius: 8,
          border: '1px solid var(--clr-border)',
          background: 'var(--clr-bg-secondary)',
          maxWidth: 560,
        }}
      >
        <code style={{ fontSize: 15, fontWeight: 600 }}>{path}</code>
        <p style={{ marginTop: 10, fontSize: 14 }}>
          <strong>Слой «{layer}»</strong> — {currentLayer.desc}.
          {currentLayer.hasSlices && (
            <>
              {' '}
              <strong>Слайс «{slice}»</strong> — отвечает на вопрос «про какую предметную область
              этот код».
            </>
          )}{' '}
          <strong>Сегмент «{segment}»</strong> — {SEGMENT_HINT[segment]}.
        </p>
      </div>

      <p style={{ marginTop: 16, fontSize: 14 }}>
        📌 Попробуйте переключиться на слой <code>shared</code> — заметьте, что слайс пропадает: там
        код без бизнес-смысла, делить по предметной области нечего.
      </p>
    </div>
  )
}
