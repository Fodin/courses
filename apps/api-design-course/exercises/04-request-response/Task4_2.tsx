import { useState } from 'react'

// TODO: Define type ResponseStyle = 'envelope' | 'flat'

// TODO: Define a Scenario interface with fields:
// id, label, envelope (string), flat (string),
// envelopeComment (string), flatComment (string)

// TODO: Create an array of at least 3 scenarios:
// 1. Collection with pagination
// 2. Single resource
// 3. Error response
// Each scenario shows the same data in both envelope and flat style,
// with a comment explaining trade-offs for that specific case

// TODO: Define envelopePros, envelopeCons, flatPros, flatCons arrays

export function Task4_2() {
  // TODO: Track current style ('envelope' | 'flat'), default 'flat'
  // TODO: Track active scenario id (string), default 'collection'

  // TODO: Find current scenario from the array

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '920px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Envelope vs Flat: сравнение подходов</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Переключайте тумблер и смотрите, как выглядит один и тот же ответ в разных стилях.
      </p>

      {/* TODO: Render toggle buttons for 'envelope' and 'flat'
           Active style gets colored background (purple for envelope, blue for flat) */}

      {/* TODO: Render scenario tabs
           Active tab highlighted with current style color */}

      {/* TODO: Render code block for current scenario + style
           Header shows style name and scenario label
           Code in <pre> with dark background
           Comment below the code block */}

      {/* TODO: Render pros/cons comparison grid (2 columns)
           Envelope card (left) and Flat card (right)
           Active style gets full opacity, inactive — 0.6 */}

      {/* TODO: Render warning about not mixing styles in one API */}
    </div>
  )
}
