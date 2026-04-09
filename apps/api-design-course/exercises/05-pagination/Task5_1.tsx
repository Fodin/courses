import { useState } from 'react'

// TODO: Define types:
//   - PaginationMode: 'offset' | 'cursor'
//   - Item: { id: number, name: string, createdAt: string }

// TODO: Create ALL_ITEMS — array of 30 items:
//   { id: i+1, name: `Товар #${padded}`, createdAt: `2024-04-${padded}` }

// TODO: Define PAGE_SIZE = 5

// TODO: Implement getOffsetPage(page: number, items: Item[]): Item[]
//   Returns items for the given page using slice(offset, offset + PAGE_SIZE)

// TODO: Implement getCursorPage(afterId: number | null, items: Item[]): Item[]
//   Returns PAGE_SIZE items after the item with id=afterId
//   If afterId is null — return first page

export function Task5_1() {
  // TODO: mode state (default 'offset')
  // TODO: offsetPage state (default 1)
  // TODO: cursorHistory state: array of (number | null), default [null]
  // TODO: cursorStep state (default 0)
  // TODO: showInsertDemo state (default false)

  // TODO: mutatedItems — if showInsertDemo: prepend { id: 999, name: 'Новый товар (вставлен)', ... }

  // TODO: Compute derived values:
  //   totalPages = ceil(ALL_ITEMS.length / PAGE_SIZE)
  //   currentOffsetItems = getOffsetPage(offsetPage, mutatedItems)
  //   currentCursor = cursorHistory[cursorStep]
  //   currentCursorItems = getCursorPage(currentCursor, ALL_ITEMS)
  //   hasNextCursor — check if last cursor item is not the last in ALL_ITEMS

  // TODO: Compute offsetQuery (URL string) depending on mode

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '860px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Визуализатор пагинации</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Сравните offset и cursor-пагинацию в действии. Посмотрите, что происходит при вставке
        нового элемента.
      </p>

      {/* TODO: Render mode switcher buttons: 'Offset (page/limit)' and 'Cursor (after/first)' */}

      {/* TODO: Render URL string block (dark background, monospace) */}

      {/* TODO: Render insert demo toggle block (yellow background):
           - Button to toggle showInsertDemo
           - Warning text for offset mode: "Перейдите на страницу 2 — элемент #05 задублируется!"
           - Info text for cursor mode: "Cursor-пагинация не затронута..." */}

      {/* TODO: If mode === 'offset':
           - Show "Страница X из N" header
           - Render currentOffsetItems as cards
           - Highlight duplicated items in red (isDuplicated logic)
           - Prev / Next buttons with disabled state */}

      {/* TODO: If mode === 'cursor':
           - Show "Шаг X — cursor: Y" header
           - Render currentCursorItems as cards
           - Prev / Next buttons with disabled state
           - Show "hasNextPage: false" message when no next page */}
    </div>
  )
}
