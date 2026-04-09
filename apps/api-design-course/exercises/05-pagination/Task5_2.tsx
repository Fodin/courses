import { useState } from 'react'

// TODO: Define type SortOption — union of 6 values:
//   'name' | '-name' | 'createdAt' | '-createdAt' | 'price' | '-price'

// TODO: Define type StatusOption — union:
//   '' | 'active' | 'draft' | 'archived'

// TODO: Define interface FilterState with fields:
//   status: StatusOption
//   priceMin: string
//   priceMax: string
//   dateFrom: string
//   sort: SortOption
//   page: number
//   limit: number

// TODO: Define SORT_LABELS — Record<SortOption, string> mapping each option to a human label
//   e.g. 'name' → 'Название A→Z', '-createdAt' → 'Дата (новые)', etc.

// TODO: Implement buildUrl(f: FilterState): string
//   Builds query string from non-empty filter values
//   Price range → price[gte]=... and price[lte]=...
//   Date → createdAt[gte]=...
//   Always include sort, page, limit

// TODO: Implement buildMeta(f: FilterState) returning object with:
//   totalCount (hardcode 87), page, limit, totalPages, hasNextPage, hasPrevPage

export function Task5_2() {
  // TODO: filters state (default: status='', priceMin='', priceMax='',
  //   dateFrom='', sort='-createdAt', page=1, limit=10)

  // TODO: Implement set<K>(key: K, value) helper that:
  //   - Updates the field
  //   - Resets page to 1 when key !== 'page'

  // TODO: Compute url = buildUrl(filters)
  // TODO: Compute meta = buildMeta(filters)

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Конструктор query-параметров</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Настраивайте фильтры и наблюдайте, как меняется URL и мета-данные ответа.
      </p>

      {/* TODO: Render filter controls in a 2-column grid:
           Left column:
             - Status select (Любой / active / draft / archived)
             - Price range inputs (min and max, side by side)
             - Date from input (type="date")
           Right column:
             - Sort select using SORT_LABELS
             - Page input (number, min=1, max=meta.totalPages)
             - Limit select (5 / 10 / 20 / 50) */}

      {/* TODO: Render URL display (dark background, monospace, word-break)
           Optionally highlight different param types with different colors:
             - Filter params → blue
             - Operator params (gte/lte) → green
             - sort → yellow
             - page/limit → purple */}

      {/* TODO: Render meta response block (green background):
           Display JSON with: data: ['...'], meta: { totalCount, page, limit, totalPages,
           hasNextPage, hasPrevPage } */}
    </div>
  )
}
