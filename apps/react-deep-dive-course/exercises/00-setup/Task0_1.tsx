import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// Each phase has an id, a label, a description, and a color
type Phase = {
  id: string
  label: string
  description: string
  color: string
}

// TODO: fill in the descriptions for each phase
const PHASES: Phase[] = [
  {
    id: 'trigger',
    label: 'Trigger',
    description: '', // TODO: describe what happens during Trigger
    color: '#3b82f6',
  },
  {
    id: 'render',
    label: 'Render',
    description: '', // TODO: describe what happens during Render
    color: '#8b5cf6',
  },
  {
    id: 'commit',
    label: 'Commit',
    description: '', // TODO: describe what happens during Commit
    color: '#10b981',
  },
]

export function Task0_1() {
  const { t } = useLanguage()

  // TODO: add useState for the active phase id (default: first phase or null)
  const activeId = PHASES[0].id // replace with useState

  // TODO: find the active phase object from PHASES array
  const activePhase = PHASES[0] // replace with correct lookup

  return (
    <div className="exercise-container">
      <h2>{t('task.0.1')}</h2>

      {/* TODO: render three phase blocks in a horizontal row */}
      {/* Each block should: */}
      {/* - display the phase label */}
      {/* - be clickable (onClick sets activeId) */}
      {/* - be visually highlighted when active (use inline CSS) */}
      {/* Use activeId and activePhase.color for styling */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '24px 0' }}>
        {PHASES.map((phase, index) => (
          <div key={phase.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* TODO: render a button for each phase */}
            {/* TODO: render an arrow → between phases (not after the last one) */}
          </div>
        ))}
      </div>

      {/* TODO: display the description of the active phase below the diagram */}
      <div>
        {/* activePhase.description */}
      </div>
    </div>
  )
}
