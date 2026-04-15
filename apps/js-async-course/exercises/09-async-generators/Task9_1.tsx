import { useState, useRef, useCallback } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 9.1: Async пагинация
// Task 9.1: Async Pagination
// ============================================
// Реализуйте ленивую пагинацию через async-генератор.
// Implement lazy pagination via async generator.
//
// Принцип работы / How it works:
//   1. fetchPage(page) — симулятор HTTP-запроса (задержка 600мс)
//   2. async function* fetchAllPages() — ленивый генератор страниц
//   3. Каждый клик "Загрузить" вызывает genRef.current.next()
//   4. HTTP-запросы происходят только при вызове .next()

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

interface PageItem {
  id: number
  title: string
  value: number
}

interface PageResponse {
  items: PageItem[]
  page: number
  totalPages: number
}

// -----------------------------------------------
// Утилиты / Utilities
// -----------------------------------------------

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// TODO: Реализуйте симулятор API
// TODO: Implement API simulator
// async function fetchPage(page: number): Promise<PageResponse> {
//   await delay(600)
//   const items: PageItem[] = Array.from({ length: 5 }, (_, i) => ({
//     id: (page - 1) * 5 + i + 1,
//     title: `Элемент #${(page - 1) * 5 + i + 1}`,
//     value: Math.floor(Math.random() * 1000),
//   }))
//   return { items, page, totalPages: 6 }
// }

// -----------------------------------------------
// TODO: Объявите async-генератор fetchAllPages()
// TODO: Declare async generator fetchAllPages()
// -----------------------------------------------
// Алгоритм / Algorithm:
//   - let page = 1
//   - while (true):
//     - const response = await fetchPage(page)
//     - yield response
//     - if (page >= response.totalPages) break
//     - page++
//
// async function* fetchAllPages(): AsyncGenerator<PageResponse> {
//   ...
// }

export function Task9_1() {
  const { t } = useLanguage()

  // TODO: Состояние для списка элементов
  // TODO: State for items list
  // const [items, setItems] = useState<PageItem[]>([])

  // TODO: Состояние для текущей страницы и общего количества
  // TODO: State for current page and total pages
  // const [currentPage, setCurrentPage] = useState(0)
  // const [totalPages, setTotalPages] = useState(6)

  // TODO: Счётчик HTTP-запросов (растёт только при .next())
  // TODO: HTTP request counter (grows only on .next())
  // const [requestCount, setRequestCount] = useState(0)

  // TODO: Состояние загрузки и завершения
  // TODO: Loading and done state
  // const [loading, setLoading] = useState(false)
  // const [done, setDone] = useState(false)

  // TODO: Ref для хранения инстанса генератора
  // TODO: Ref to hold generator instance
  // Важно: useRef, не useState — иначе генератор пересоздастся при ре-рендере
  // Important: useRef, not useState — otherwise generator will recreate on re-render
  // const genRef = useRef<AsyncGenerator<PageResponse> | null>(null)

  // -----------------------------------------------
  // TODO: handleStart() — создаёт новый генератор, сбрасывает состояние
  // TODO: handleStart() — creates new generator, resets state
  // -----------------------------------------------
  // genRef.current = fetchAllPages()
  // setItems([])
  // setCurrentPage(0)
  // setRequestCount(0)
  // setDone(false)

  // -----------------------------------------------
  // TODO: handleLoadNext() — загружает следующую страницу
  // TODO: handleLoadNext() — loads next page
  // -----------------------------------------------
  // if (!genRef.current || loading || done) return
  // setLoading(true)
  // const result = await genRef.current.next()
  // setLoading(false)
  // if (result.done) { setDone(true); return }
  // const { items: newItems, page, totalPages: total } = result.value
  // setItems(prev => [...prev, ...newItems])
  // setCurrentPage(page)
  // setTotalPages(total)
  // setRequestCount(c => c + 1)
  // if (page >= total) setDone(true)

  return (
    <div className="exercise-container">
      <h2>{t('task.9.1')}</h2>

      {/* TODO: Отобразите счётчики: страница X из Y, HTTP-запросы, всего элементов */}
      {/* TODO: Display counters: page X of Y, HTTP requests, total items */}

      {/* TODO: Прогресс-бар от 0% до 100% (currentPage / totalPages * 100) */}
      {/* TODO: Progress bar from 0% to 100% (currentPage / totalPages * 100) */}

      {/* TODO: Список карточек элементов (items.map(...)) */}
      {/* TODO: List of item cards (items.map(...)) */}

      {/* TODO: Финальное сообщение при done === true */}
      {/* TODO: Final message when done === true */}

      {/* TODO: Кнопки "Создать генератор" / "Перезапустить" и "Загрузить следующую порцию" */}
      {/* TODO: Buttons "Create generator" / "Restart" and "Load next page" */}
      {/* Кнопка "Загрузить" заблокирована если: !initialized || loading || done */}
      {/* "Load" button disabled if: !initialized || loading || done */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте async-генератор для ленивой пагинации
      </div>
    </div>
  )
}
