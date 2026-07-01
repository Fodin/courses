import { useState, useEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// Task 5.3: Effect Chains Refactor (You Might Not Need an Effect)
// A card game with game logic split across 3 useEffect hooks.
// The render counter shows +2..4 per click (Effect chain = cascading renders).
// Refactor the RIGHT version to use a single event handler → render counter shows +1.

// Game rules:
//   - 40% chance of gold card per draw
//   - every 3 gold cards → next round (reset gold count)
//   - after round 5 → game over

type Card = { id: number; isGold: boolean }

// ─── LEFT: Effect Chain version (already implemented — DO NOT change) ─────────

function CardGameWithEffects() {
  const [card, setCard] = useState<Card | null>(null)
  const [goldCardCount, setGoldCardCount] = useState(0)
  const [round, setRound] = useState(1)
  const [isGameOver, setIsGameOver] = useState(false)
  const renderCount = useRef(0)
  renderCount.current++

  // Effect chain — each setState here triggers a new render
  useEffect(() => {
    if (card !== null && card.isGold) {
      setGoldCardCount(c => c + 1)
    }
  }, [card])

  useEffect(() => {
    if (goldCardCount > 0 && goldCardCount % 3 === 0) {
      setRound(r => r + 1)
      setGoldCardCount(0)
    }
  }, [goldCardCount])

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true)
    }
  }, [round])

  function handleDraw() {
    const isGold = Math.random() < 0.4
    setCard({ id: Date.now(), isGold })
  }

  function handleReset() {
    setCard(null)
    setGoldCardCount(0)
    setRound(1)
    setIsGameOver(false)
    renderCount.current = 0
  }

  return (
    <GameUI
      title="Effect Chain"
      titleColor="#ef4444"
      subtitle="3 useEffect в цепочке"
      card={card}
      goldCardCount={goldCardCount}
      round={round}
      isGameOver={isGameOver}
      renderCount={renderCount.current}
      isCorrect={false}
      onDraw={handleDraw}
      onReset={handleReset}
    />
  )
}

// ─── RIGHT: Refactored version (TODO — implement this) ────────────────────────

function CardGameWithHandler() {
  // TODO: same state as above (card, goldCardCount, round, isGameOver, renderCount)

  // TODO: implement handleDraw — compute ALL state changes locally, then call
  //   setCard, setGoldCardCount, setRound, setIsGameOver in one function
  //   React 18 batches multiple setState calls in the same handler → 1 render

  // TODO: implement handleReset

  return (
    <GameUI
      title="Event Handler"
      titleColor="#10b981"
      subtitle="Один обработчик"
      // TODO: pass correct props
      card={null}
      goldCardCount={0}
      round={1}
      isGameOver={false}
      renderCount={0}
      isCorrect={true}
      onDraw={() => {}}
      onReset={() => {}}
    />
  )
}

// ─── Shared UI (already implemented — use as-is) ─────────────────────────────

type GameUIProps = {
  title: string
  titleColor: string
  subtitle: string
  card: Card | null
  goldCardCount: number
  round: number
  isGameOver: boolean
  renderCount: number
  isCorrect: boolean
  onDraw: () => void
  onReset: () => void
}

function GameUI({
  title,
  titleColor,
  subtitle,
  card,
  goldCardCount,
  round,
  isGameOver,
  renderCount,
  isCorrect,
  onDraw,
  onReset,
}: GameUIProps) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: '260px',
        padding: '20px',
        borderRadius: '10px',
        background: '#1f2937',
        border: `2px solid ${titleColor}44`,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div>
        <div style={{ fontWeight: 700, color: titleColor, fontSize: '15px' }}>{title}</div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>{subtitle}</div>
      </div>

      <div
        style={{
          padding: '12px',
          borderRadius: '8px',
          background: isCorrect ? '#0a1f10' : '#1a0f0f',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>Рендеров</div>
        <div
          style={{
            fontSize: '48px',
            fontWeight: 700,
            color: isCorrect ? '#4ade80' : '#f87171',
            lineHeight: 1,
          }}
        >
          {renderCount}
        </div>
        <div style={{ fontSize: '11px', color: '#4b5563', marginTop: '4px' }}>
          {isCorrect ? '+1 за клик' : '+2-4 за клик'}
        </div>
      </div>

      <div
        style={{
          height: '80px',
          borderRadius: '8px',
          background: card === null ? '#111827' : card.isGold ? '#92400e' : '#1f2937',
          border: `2px solid ${card === null ? '#374151' : card.isGold ? '#f59e0b' : '#4b5563'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
        }}
      >
        {card === null ? (
          <span style={{ color: '#4b5563', fontSize: '13px' }}>Нет карты</span>
        ) : card.isGold ? (
          '⭐ Золотая'
        ) : (
          '▢ Обычная'
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <div
          style={{ flex: 1, padding: '10px', borderRadius: '6px', background: '#111827', textAlign: 'center' }}
        >
          <div style={{ fontSize: '11px', color: '#6b7280' }}>Раунд</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#e5e7eb' }}>
            {Math.min(round, 5)}/5
          </div>
        </div>
        <div
          style={{ flex: 1, padding: '10px', borderRadius: '6px', background: '#111827', textAlign: 'center' }}
        >
          <div style={{ fontSize: '11px', color: '#6b7280' }}>Золотых</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b' }}>
            {goldCardCount}/3
          </div>
        </div>
      </div>

      {isGameOver && (
        <div
          style={{
            padding: '12px',
            borderRadius: '8px',
            background: '#1e3a5f',
            textAlign: 'center',
            color: '#60a5fa',
            fontWeight: 700,
          }}
        >
          Игра окончена!
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={onDraw}
          disabled={isGameOver}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '6px',
            border: 'none',
            background: isGameOver ? '#374151' : titleColor,
            color: '#fff',
            cursor: isGameOver ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            opacity: isGameOver ? 0.5 : 1,
          }}
        >
          Вытянуть карту
        </button>
        <button
          onClick={onReset}
          style={{
            padding: '10px 14px',
            borderRadius: '6px',
            border: 'none',
            background: '#374151',
            color: '#9ca3af',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          Сброс
        </button>
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function Task5_3() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.5.3')}</h2>

      <div
        style={{
          padding: '12px 16px',
          borderRadius: '8px',
          background: '#1e3a5f',
          border: '1px solid #1d4ed8',
          marginBottom: '20px',
          fontSize: '13px',
          color: '#93c5fd',
        }}
      >
        Реализуй правую колонку: перенеси всю логику из трёх useEffect в один handleDraw.
        Счётчик рендеров должен показывать +1 за каждый клик.
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <CardGameWithEffects />
        <CardGameWithHandler />
      </div>
    </div>
  )
}
