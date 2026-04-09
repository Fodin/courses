import { useState } from 'react'

// TODO: Implement Library API Design Wizard / Мастер проектирования API библиотеки
//
// A 7-step interactive wizard for designing a REST API for a library system
// (Books, Authors, Readers, Reservations).
//
// State needed:
//   currentStep: number (0–6) — active wizard step
//   completedChecks: Record<string, boolean> — tracks checked items per step
//   showSolution: boolean — toggle solution panel visibility
//
// Each step has:
//   - id, title, description
//   - checklist: string[] — items to check off
//   - solution: object with step-specific content (items, endpoints, matrix, examples, models, code)
//
// Steps: / Шаги:
//   1. Define resources — 6 resources for a library (books, authors, readers, reservations + nested)
//   2. Design URL structure — RESTful URLs with proper naming, hierarchy, query params
//   3. Choose HTTP methods — matrix: resource × method (GET/POST/PUT/PATCH/DELETE)
//   4. Define status codes — success and error scenarios for each operation
//   5. Design request/response — data models, envelope, error format
//   6. Add pagination/filtering — page/limit params, meta in response
//   7. Final summary — checklist of 10 best practices + stats card
//
// UI layout: / Макет интерфейса:
//   - Progress bar: step buttons at top + filled line below
//   - Two-column grid: left = checklist, right = solution panel (locked/unlocked)
//   - Navigation: Prev / "Step X of 7" / Next
//
// Colors: #6366f1 (indigo) for active, #22c55e for complete, #fde68a for solution panel

export function Task12_1() {
  // TODO: useState for currentStep (0), completedChecks ({}), showSolution (false)

  // TODO: step = WIZARD_STEPS[currentStep]
  // TODO: stepKey = (itemIdx) => `${step.id}-${itemIdx}`
  // TODO: toggleCheck, goNext, goPrev handlers
  // TODO: checkedCount, allChecked computed values

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Конструктор API: Библиотека / API Builder: Library</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Пошаговый процесс проектирования REST API от ресурсов до пагинации / Step-by-step REST API design process from resources to pagination
      </p>

      {/* TODO: Progress bar (step buttons + fill line) / Прогресс-бар (кнопки шагов + линия заполнения) */}

      {/* TODO: Two-column grid: checklist (left) + solution panel (right) / Двухколоночный макет: чеклист слева + панель решения справа */}
      {/* Left: step title, description, checklist items with checkboxes */}
      {/* Right: show/hide solution button, solution content based on step type */}

      {/* TODO: Navigation (Prev / Step X of 7 / Next) / Навигация (Назад / Шаг X из 7 / Вперёд) */}
    </div>
  )
}
