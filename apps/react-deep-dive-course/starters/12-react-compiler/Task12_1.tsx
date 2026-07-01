import { useState, useCallback, useMemo, useRef, memo } from 'react'
import { useLanguage } from 'src/hooks'

// Task 12.1: Manual vs Compiler
//
// You have a ProductCard component with no memoization.
// Add manual memoization, then study the "compiler version" side-by-side
// to understand what the compiler does differently.
//
// Step 1 — ManualProductCard: wrap with React.memo, add:
//   - useMemo for formattedPrice (dep: product.price)
//   - useMemo for discountLabel (dep: product.discount)
//   - useCallback for handleAddToCart (deps: onAddToCart, product.id)
//   - renderCount ref + display in UI
//
// Step 2 — CompiledProductCard: simulate useMemoCache pattern:
//   const $ref = useRef(new Array(8).fill(Symbol('cache')))
//   const $ = $ref.current
//   Implement if-check pattern for each scope manually:
//     if ($[0] !== product.price) { ... $[0] = product.price; $[1] = formattedPrice } else { ... }
//
// Step 3 — Parent Task12_1:
//   - Button "Обновить цену" — change product.price
//   - Button "Обновить скидку" — change product.discount
//   - Button "Форс-рендер родителя" — re-render parent without changing props
//   - Show both components side by side (two columns)
//
// Step 4 — CachePanel component:
//   Show status for: formattedPrice, discountLabel, handleAddToCart
//   Green dot = from cache, Orange dot = recalculated
//
// Expected observations:
//   - "Форс-рендер родителя": ManualProductCard does NOT re-render (React.memo),
//     CompiledProductCard DOES render but JSX comes from cache
//   - "Обновить цену": only formattedPrice scope recalculates
//   - Manual uses N hooks, Compiled uses one array

// ─── TODO: define Product type ────────────────────────────────────────────────
// type Product = { id: string; name: string; price: number; discount: number }

// ─── TODO: implement formatPrice ─────────────────────────────────────────────
// function formatPrice(price: number): string { ... }

// ─── TODO: implement getDiscountLabel ────────────────────────────────────────
// function getDiscountLabel(discount: number): string { ... }

// ─── TODO: implement ManualProductCard ───────────────────────────────────────
// const ManualProductCard = memo(function ManualProductCard({ product, onAddToCart, onCacheStatus }) { ... })

// ─── TODO: implement CompiledProductCard ─────────────────────────────────────
// function CompiledProductCard({ product, onAddToCart, onCacheStatus }) { ... }

// ─── TODO: implement CachePanel ──────────────────────────────────────────────
// function CachePanel({ status, label }) { ... }

// ─── Main component ───────────────────────────────────────────────────────────

export function Task12_1() {
  const { t } = useLanguage()

  // TODO: add state for product, parentRender counter, manualStatus, compiledStatus, cartCount
  // TODO: stable onAddToCart via useCallback

  return (
    <div className="exercise-container">
      <h2>{t('task.12.1')}</h2>

      {/* TODO: render control buttons (update price / update discount / force parent render) */}
      {/* TODO: render two columns: ManualProductCard | CompiledProductCard */}
      {/* TODO: render CachePanel under each column */}
      {/* TODO: render explanation note at bottom */}

      <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 10, border: '2px solid #86efac' }}>
        <p>Реализуйте ManualProductCard (React.memo + useMemo + useCallback) и CompiledProductCard
        (useMemoCache паттерн через useRef массив). Покажите их рядом с панелью статуса кэша.</p>
        <p style={{ fontSize: 13, color: '#6b7280' }}>
          Подсказка: ManualProductCard с React.memo не перерендеривается при форс-рендере родителя,
          а CompiledProductCard перерендеривается, но берёт JSX из кэша.
        </p>
      </div>
    </div>
  )
}
