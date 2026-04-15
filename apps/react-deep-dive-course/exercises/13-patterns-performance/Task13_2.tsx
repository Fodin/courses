import { useRef, useState } from 'react'
import { useLanguage } from 'src/hooks'

// Task 13.2: State Colocation + Children as Props
//
// Проблема: state поднят слишком высоко. commentText хранится в PageRoot,
// но нужен только CommentInput. При каждом вводе ре-рендерятся все компоненты
// включая тяжёлый ArticleContent.
//
// Задача — применить два паттерна:
//
// 1. State Colocation: переместить commentText из PageRoot в CommentSection
//    (или прямо в CommentInput — туда, где он реально нужен)
//
// 2. Children as Props: ArticleContent передавать в CommentSection снаружи,
//    чтобы он не ре-рендерился при изменении state CommentSection
//
// Структура ДО:
//   PageRoot [state: commentText]
//     ArticleContent
//     CommentSection
//       CommentInput [props: commentText, setCommentText]
//
// Структура ПОСЛЕ:
//   PageRoot (без state)
//     CommentSection [state: commentText, children: ArticleContent]
//       {children}  ← ArticleContent из PageRoot — не ре-рендерится!
//       CommentInput  ← использует state из CommentSection

// ─── ArticleContent (не трогайте — "тяжёлый" компонент) ──────────────────────

function ArticleContent({ label }: { label: string }) {
  const renders = useRef(0)
  renders.current++

  return (
    <div style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12, marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <strong style={{ fontSize: 13, color: '#16a34a' }}>ArticleContent ({label})</strong>
        <span style={{ fontSize: 11, color: renders.current > 1 ? '#dc2626' : '#6b7280' }}>
          renders: {renders.current}
        </span>
      </div>
      <p style={{ margin: 0, fontSize: 13, color: '#374151' }}>
        React использует алгоритм reconciliation для эффективного обновления DOM.
        Fiber — внутренняя структура данных, представляющая единицу работы.
      </p>
    </div>
  )
}

// ─── Render counter helper ────────────────────────────────────────────────────

function RenderCount({ label }: { label: string }) {
  const renders = useRef(0)
  renders.current++
  return (
    <span style={{ fontSize: 11, color: renders.current > 1 ? '#dc2626' : '#6b7280' }}>
      {label} renders: {renders.current}
    </span>
  )
}

// ─── TODO: BeforeColocation ───────────────────────────────────────────────────
// state commentText находится здесь — в корне.
// При каждом вводе ре-рендерится всё дерево.
//
// function CommentInputBefore({ value, onChange }) { ... }  // с RenderCount
// function CommentSectionBefore({ text, onText }) { ... }   // с ArticleContent внутри
// function BeforeColocation() { ... }                        // держит state

// ─── TODO: AfterColocation ───────────────────────────────────────────────────
// Применить State Colocation + Children as Props.
//
// function CommentInputAfter() { ... }      // держит state сам, с RenderCount
// function CommentSectionAfter({ children }) { ... }  // принимает children
// function AfterColocation() { ... }        // передаёт ArticleContent как children

// ─── Main component ───────────────────────────────────────────────────────────

export function Task13_2() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.13.2')}</h2>

      {/* TODO: Два варианта рядом (grid 2 колонки) */}
      {/* Левый: BeforeColocation — все мигают */}
      {/* Правый: AfterColocation — только CommentSection + CommentInput */}

      <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 10, border: '2px solid #86efac' }}>
        <p>
          Реализуйте два варианта рядом. В варианте "После" ArticleContent не должен
          ре-рендериться при вводе текста.
        </p>
        <p style={{ fontSize: 13, color: '#6b7280' }}>
          Ключевой момент Children as Props: {'<ArticleContent />'}  создаётся в PageRoot,
          а не внутри CommentSection. Когда CommentSection ре-рендерится — он получает
          тот же объект children из props (bailout).
        </p>
      </div>
    </div>
  )
}
