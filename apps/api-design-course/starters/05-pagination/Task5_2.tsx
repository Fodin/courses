import { useState } from 'react'

// TODO: Define type SortOption — union of 6 values: / TODO: Определить тип SortOption — объединение 6 значений:
//   'name' | '-name' | 'createdAt' | '-createdAt' | 'price' | '-price'

// TODO: Define type StatusOption — union: / TODO: Определить тип StatusOption — объединение:
//   '' | 'active' | 'draft' | 'archived'

// TODO: Define interface FilterState with fields: / TODO: Определить интерфейс FilterState с полями:
//   status: StatusOption
//   priceMin: string
//   priceMax: string
//   dateFrom: string
//   sort: SortOption
//   page: number
//   limit: number

// TODO: Define SORT_LABELS — Record<SortOption, string> mapping each option to a human label
//   e.g. 'name' → 'Название A→Z', '-createdAt' → 'Дата (новые)', etc.
// TODO: Определить SORT_LABELS — Record<SortOption, string>, сопоставляющий каждому варианту человекочитаемую метку
//   например, 'name' → 'Название A→Z', '-createdAt' → 'Дата (новые)', и т.д.

// TODO: Implement buildUrl(f: FilterState): string
//   Builds query string from non-empty filter values
//   Price range → price[gte]=... and price[lte]=...
//   Date → createdAt[gte]=...
//   Always include sort, page, limit
// TODO: Реализовать buildUrl(f: FilterState): string
//   Строит query-строку из непустых значений фильтров
//   Диапазон цен → price[gte]=... и price[lte]=...
//   Дата → createdAt[gte]=...
//   Всегда включать sort, page, limit

// TODO: Implement buildMeta(f: FilterState) returning object with:
//   totalCount (hardcode 87), page, limit, totalPages, hasNextPage, hasPrevPage
// TODO: Реализовать buildMeta(f: FilterState), возвращающий объект с:
//   totalCount (захардкодить 87), page, limit, totalPages, hasNextPage, hasPrevPage

export function Task5_2() {
  // TODO: filters state (default: status='', priceMin='', priceMax='',
  //   dateFrom='', sort='-createdAt', page=1, limit=10)
  // TODO: Состояние filters (по умолчанию: status='', priceMin='', priceMax='',
  //   dateFrom='', sort='-createdAt', page=1, limit=10)

  // TODO: Implement set<K>(key: K, value) helper that:
  //   - Updates the field
  //   - Resets page to 1 when key !== 'page'
  // TODO: Реализовать вспомогательную функцию set<K>(key: K, value), которая:
  //   - Обновляет поле
  //   - Сбрасывает page на 1, когда key !== 'page'

  // TODO: Compute derived values: / TODO: Вычислить производные значения:
  //   url = buildUrl(filters)
  //   meta = buildMeta(filters)

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
      {/* TODO: Отрисовать элементы управления фильтрами в 2-колоночной сетке:
           Левая колонка:
             - Select статуса (Любой / active / draft / archived)
             - Поля диапазона цен (min и max, рядом)
             - Поле даты (type="date")
           Правая колонка:
             - Select сортировки через SORT_LABELS
             - Поле страницы (number, min=1, max=meta.totalPages)
             - Select лимита (5 / 10 / 20 / 50) */}

      {/* TODO: Render URL display (dark background, monospace, word-break)
           Optionally highlight different param types with different colors:
             - Filter params → blue
             - Operator params (gte/lte) → green
             - sort → yellow
             - page/limit → purple */}
      {/* TODO: Отрисовать отображение URL (тёмный фон, моноширинный, word-break)
           Опционально подсветить разные типы параметров разными цветами:
             - Параметры фильтров → синий
             - Параметры операторов (gte/lte) → зелёный
             - sort → жёлтый
             - page/limit → фиолетовый */}

      {/* TODO: Render meta response block (green background):
           Display JSON with: data: ['...'], meta: { totalCount, page, limit, totalPages,
           hasNextPage, hasPrevPage } */}
      {/* TODO: Отрисовать блок ответа meta (зелёный фон):
           Отобразить JSON с: data: ['...'], meta: { totalCount, page, limit, totalPages,
           hasNextPage, hasPrevPage } */}
    </div>
  )
}
