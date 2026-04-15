import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// Task 11.1: RSC Payload Parser
//
// Build an interactive RSC payload visualizer that parses Flight protocol lines
// and renders a visual component tree: server elements (blue), client components
// (orange), Suspense boundaries (dashed border), pending chunks (grey, pulsing).
//
// Step 1 — parsePayloadLine(line: string): PayloadRow | null
//   Each line has format: "<id>:<type><data>"
//   Types:
//     I — client import: I{"chunk":"...", "name":"..."}
//     J — JSON React element: J{"type":"div","props":{},"children":...}
//     S — string token: S"react.suspense"
//     P — pending placeholder: P (no data)
//   Return null for unrecognised lines (never throw).
//
// Step 2 — Build visual tree from parsed rows:
//   J rows → blue server cards (show element type + className if present)
//   I rows → orange client cards (show component name + chunk)
//   S rows (react.suspense) → dashed border wrapper
//   J rows with type "$0" (suspense ref) → same dashed wrapper
//   P rows → grey card with CSS pulse animation
//
// Step 3 — Step-by-step mode:
//   Button "Следующий чанк" reveals one row at a time.
//   Counter: "Получено X/Y чанков".
//   Button "Сброс" resets visible count to 0.
//
// Step 4 — Editable textarea:
//   Pre-filled with example payload (see below).
//   Button "Парсить" re-parses the textarea content and resets step counter.
//
// Example payload for the textarea:
//   0:S"react.suspense"
//   1:I{"chunk":"client-abc.js","name":"LikeButton"}
//   2:I{"chunk":"client-def.js","name":"CommentForm"}
//   3:J{"type":"div","props":{"className":"page"},"children":["$4","$5"]}
//   4:J{"type":"header","props":{},"children":"$6"}
//   5:J{"type":"$0","props":{"fallback":"Loading..."},"children":"$P7"}
//   6:J{"type":"h1","props":{},"children":"Статья о React"}
//   7:P
//   8:J{"type":"div","props":{"className":"comments"},"children":["$9","$L2"]}
//   9:J{"type":"p","props":{},"children":"Первый комментарий"}

// ─── TODO: define PayloadRow type ────────────────────────────────────────────
// type PayloadRow = ...

// ─── TODO: implement parsePayloadLine ────────────────────────────────────────
// function parsePayloadLine(line: string): PayloadRow | null { ... }

// ─── TODO: implement RowNode component ───────────────────────────────────────
// function RowNode({ row }: { row: PayloadRow }) { ... }

// ─── Main component ───────────────────────────────────────────────────────────

export function Task11_1() {
  const { t } = useLanguage()

  // TODO: add state for payloadText, parsedRows, visibleCount, isParsed

  return (
    <div className="exercise-container">
      <h2>{t('task.11.1')}</h2>

      {/* TODO: render layout with textarea (left) and visual tree (right) */}
      {/* Left: editable textarea + buttons (Парсить / Следующий чанк / Сброс) */}
      {/* Right: visual tree from parsed rows (only visibleCount rows) */}
      {/* Bottom: legend (blue=server, orange=client, dashed=suspense, grey=pending) */}

      <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 10, border: '2px solid #86efac' }}>
        <p>Реализуйте parsePayloadLine и визуальное дерево RSC payload</p>
        <p style={{ fontSize: 13, color: '#6b7280' }}>
          Подсказка: формат строки — "id:typeData", где type это I, J, S или P
        </p>
      </div>
    </div>
  )
}
