import { useLanguage } from 'src/hooks'

// ============================================
// Задание 7.3: usePagination + useFilters + useSorting → useDataTable
// ============================================
//
// Реализуйте три специализированных хука и скомпозируйте их в useDataTable.
// Компонент EmployeeTable получает готовые данные — и только рендерит.

// TODO: Реализуйте usePagination(totalItems, pageSize)
// Возвращает:
//   page, totalPages, offset, pageSize, hasPrev, hasNext
//   goTo(page), next(), prev()
// Важно: при изменении totalItems сбрасываться на первую страницу
//         если текущая страница вышла за пределы
// function usePagination(totalItems: number, pageSize: number) { ... }

// TODO: Реализуйте useSorting<T>()
// Хранит: field: keyof T | null, direction: 'asc' | 'desc'
// toggleSort(field): если поле уже выбрано — меняет direction, иначе — field='asc'
// sort(items): возвращает НОВЫЙ отсортированный массив (не мутирует!)
//   строки → localeCompare, числа → вычитание
// function useSorting<T>() { ... }

// TODO: Реализуйте useFilters<F>(initialFilters)
// Хранит: values: F
// setFilter(key, value) — обновляет один фильтр
// resetFilters() — сбрасывает к initialFilters
// function useFilters<F extends Record<string, unknown>>(initialFilters: F) { ... }

// TODO: Реализуйте useDataTable<T, F>(data, options)
// options: { pageSize, initialFilters, filterFn }
// Внутри: sorting = useSorting(), filters = useFilters(), pagination = usePagination()
// Порядок: filtered = data.filter → sorted = sort(filtered) → pageData = sorted.slice(offset, offset+pageSize)
// Важно: при изменении filters.values сбрасывать на первую страницу
// Верните: { pageData, pagination, sorting, filters, totalCount }
// function useDataTable<T, F extends Record<string, unknown>>(data, options) { ... }

// Данные сотрудников для демо (не менее 15 записей)
// interface Employee { id, name, department, salary, level }
// const EMPLOYEES: Employee[] = [...]

// TODO: Реализуйте компонент EmployeeTable
// - Фильтры: select по department, select по level
// - Таблица: столбцы Имя, Отдел, Уровень, Зарплата
// - Заголовки столбцов кликабельны — вызывают toggleSort
//   иконка: ↑ для asc, ↓ для desc, ↕ для неактивного
// - Пагинация: кнопки Назад/Вперёд + номера страниц
// - Счётчик: "Найдено X из Y"

export function Task7_3() {
  const { t } = useLanguage()

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

      {/* TODO: Фильтры — select по отделу и уровню */}

      {/* TODO: Таблица с кликабельными заголовками для сортировки */}
      {/* <table>
        <thead>
          <tr>
            <th onClick={() => table.sorting.toggleSort('name')}>
              Имя {sortIcon('name')}
            </th>
            ...
          </tr>
        </thead>
        <tbody>
          {table.pageData.map(emp => <tr key={emp.id}>...</tr>)}
        </tbody>
      </table> */}

      {/* TODO: Пагинация */}
    </div>
  )
}
