import { useState } from 'react'

// Task 1.2: ADR Constructor
//
// Build a step-by-step wizard for creating an Architecture Decision Record (ADR)
// documenting micro-frontend architecture choices.
//
// Requirements:
// 1. Implement a 6-step wizard with Back/Next navigation:
//    Step 0 — Composition type (client-side, server-side, edge-side, build-time) — single choice
//    Step 1 — Split strategy (vertical, horizontal, hybrid) — single choice
//    Step 2 — Shared libraries (React, Router, Design System, State Manager, HTTP Client) — multi-choice
//    Step 3 — Communication patterns (Custom Events, Shared State, URL, Props/Callbacks) — multi-choice
//    Step 4 — Deployment strategy (independent, coordinated, monorepo) — single choice
//    Step 5 — Result: generated ADR document
// 2. Each option shows a short description (pros and cons where applicable)
// 3. Step navigation panel at the top: completed steps show a checkmark
// 4. On the result step, detect and show conflict warnings:
//    - server-side + Shared State → hydration problem
//    - build-time + independent deploy → contradiction
//    - Shared State Manager (shared lib) + vertical split → competing stores
//    - Shared State (comm) + independent deploy → version mismatch risk
//    - No shared React + client-side → bundle duplication
//    - horizontal split + independent deploy → layout team blocks others
// 5. Generate an ADR Markdown document with sections:
//    Title, Status, Date, Context, Decision, Consequences (pros + risks)
// 6. "Скопировать ADR" button copies the text to clipboard and shows confirmation
//
// Tips:
// - Use a single AdrState interface:
//   { composition, split, sharedLibs, communication, deployment }
// - Keep COMPOSITION_INFO, SPLIT_INFO, DEPLOY_INFO as lookup objects with label + desc
// - STEPS array drives the step nav: ['Тип композиции', 'Стратегия split', ...]
// - For copy: navigator.clipboard.writeText(text)
// - Highlight selected option with colored border + light background tint

// TODO: Define CompositionType, SplitStrategy, SharedLib, CommPattern, DeployStrategy types

// TODO: Define AdrState interface

// TODO: Define COMPOSITION_INFO lookup object (label, desc, pros, cons per type)

// TODO: Define SPLIT_INFO lookup object (label, desc per strategy)

// TODO: Define DEPLOY_INFO lookup object (label, desc per strategy)

// TODO: Define STEPS array (6 step names)

// TODO: Implement getConflicts(state: AdrState) → string[]

// TODO: Implement generateAdr(state: AdrState) → string (Markdown)

export function Task1_2() {
  // TODO: useState for step: number (0-5)
  // TODO: useState for state: AdrState
  // TODO: useState for copied: boolean

  // TODO: toggleLib(lib) — toggles sharedLibs array
  // TODO: toggleComm(pattern) — toggles communication array
  // TODO: copyAdr() — copies ADR to clipboard, sets copied=true for 2s

  return (
    <div className="exercise-container" style={{ padding: '1.5rem' }}>
      <h2>Конструктор ADR</h2>

      {/* TODO: Render step navigation panel */}
      {/* Completed steps: green background + checkmark; active: blue; future: grey */}

      {/* TODO: Render step 0: Composition type */}
      {/* Each option: clickable card with label, desc, pros (green), cons (red) */}

      {/* TODO: Render step 1: Split strategy */}

      {/* TODO: Render step 2: Shared libraries */}
      {/* Toggle buttons (pill style), show warning if no React selected */}

      {/* TODO: Render step 3: Communication patterns */}
      {/* Each pattern: clickable card with label + hint text */}

      {/* TODO: Render step 4: Deployment strategy */}

      {/* TODO: Render step 5: Result */}
      {/* Conflict warnings block (if any), then ADR pre block, then Copy button */}

      {/* TODO: Render Back/Next navigation buttons */}
    </div>
  )
}
