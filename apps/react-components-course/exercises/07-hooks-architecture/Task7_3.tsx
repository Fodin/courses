import { useLanguage } from 'src/hooks'

// ============================================
// Task 7.3: usePagination + useFilters + useSorting → useDataTable
// Задание 7.3: usePagination + useFilters + useSorting → useDataTable
// ============================================
//
// Implement three specialized hooks and compose them into useDataTable.
// The EmployeeTable component receives ready data — and only renders.
//
// Реализуйте три специализированных хука и скомпозируйте их в useDataTable.
// Компонент EmployeeTable получает готовые данные — и только рендерит.

// TODO: Implement usePagination(totalItems, pageSize)
// TODO: Реализуйте usePagination(totalItems, pageSize)
// Returns:
// Возвращает:
//   page, totalPages, offset, pageSize, hasPrev, hasNext
//   goTo(page), next(), prev()
// Important: reset to first page when totalItems changes
// Важно: при изменении totalItems сбрасываться на первую страницу
//         if current page went out of bounds
//         если текущая страница вышла за пределы
// function usePagination(totalItems: number, pageSize: number) { ... }

// TODO: Implement useSorting<T>()
// TODO: Реализуйте useSorting<T>()
// Stores: field: keyof T | null, direction: 'asc' | 'desc'
// Хранит: field: keyof T | null, direction: 'asc' | 'desc'
// toggleSort(field): if field already selected — change direction, otherwise — field='asc'
// toggleSort(field): если поле уже выбрано — меняет direction, иначе — field='asc'
// sort(items): returns a NEW sorted array (does not mutate!)
// sort(items): возвращает НОВЫЙ отсортированный массив (не мутирует!)
//   strings → localeCompare, numbers → subtraction
//   строки → localeCompare, числа → вычитание
// function useSorting<T>() { ... }

// TODO: Implement useFilters<F>(initialFilters)
// TODO: Реализуйте useFilters<F>(initialFilters)
// Stores: values: F
// Хранит: values: F
// setFilter(key, value) — updates one filter
// setFilter(key, value) — обновляет один фильтр
// resetFilters() — resets to initialFilters
// resetFilters() — сбрасывает к initialFilters
// function useFilters<F extends Record<string, unknown>>(initialFilters: F) { ... }

// TODO: Implement useDataTable<T, F>(data, options)
// TODO: Реализуйте useDataTable<T, F>(data, options)
// options: { pageSize, initialFilters, filterFn }
// Inside: sorting = useSorting(), filters = useFilters(), pagination = usePagination()
// Внутри: sorting = useSorting(), filters = useFilters(), pagination = usePagination()
// Order: filtered = data.filter → sorted = sort(filtered) → pageData = sorted.slice(offset, offset+pageSize)
// Порядок: filtered = data.filter → sorted = sort(filtered) → pageData = sorted.slice(offset, offset+pageSize)
// Important: reset to first page when filters.values change
// Важно: при изменении filters.values сбрасывать на первую страницу
// Return: { pageData, pagination, sorting, filters, totalCount }
// Верните: { pageData, pagination, sorting, filters, totalCount }
// function useDataTable<T, F extends Record<string, unknown>>(data, options) { ... }

// Employee data for demo (at least 15 records)
// Данные сотрудников для демо (не менее 15 записей)
// interface Employee { id, name, department, salary, level }
// const EMPLOYEES: Employee[] = [...]

// TODO: Implement EmployeeTable component
// TODO: Реализуйте компонент EmployeeTable
// - Filters: select by department, select by level
// - Фильтры: select по department, select по level
// - Table: columns Name, Department, Level, Salary
// - Таблица: столбцы Имя, Отдел, Уровень, Зарплата
// - Column headers are clickable — call toggleSort
// - Заголовки столбцов кликабельны — вызывают toggleSort
//   icon: ↑ for asc, ↓ for desc, ↕ for inactive
//   иконка: ↑ для asc, ↓ для desc, ↕ для неактивного
// - Pagination: Prev/Next buttons + page numbers
// - Пагинация: кнопки Назад/Вперёд + номера страниц
// - Counter: "Found X out of Y"
// - Счётчик: "Найдено X из Y"

export function Task7_3() {
  const { t } = useLanguage()

  // TODO: Use useDataTable
  // TODO: Используйте useDataTable
  // const table = useDataTable<Employee, EmployeeFilters>(EMPLOYEES, {
  //   pageSize: 5,
  //   initialFilters: { department: '', level: '' },
  //   filterFn: (item, filters) => {
  //     if (filters.department && item.department !== filters.department) return false
  //     if (filters.level && item.level !== filters.level) return false
  //     return true
  //   },
  // })

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 7.3</h2>

      {/* TODO: Filters — select by department and level */}
      {/* TODO: Фильтры — select по отделу и уровню */}

      {/* TODO: Table with clickable headers for sorting */}
      {/* TODO: Таблица с кликабельными заголовками для сортировки */}
      {/* <table>
        <thead>
          <tr>
            <th onClick={() => table.sorting.toggleSort('name')}>
              Name {sortIcon('name')}
            </th>
            ...
          </tr>
        </thead>
        <tbody>
          {table.pageData.map(emp => <tr key={emp.id}>...</tr>)}
        </tbody>
      </table> */}

      {/* TODO: Pagination */}
      {/* TODO: Пагинация */}
    </div>
  )
}
