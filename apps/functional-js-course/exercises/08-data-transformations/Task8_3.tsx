import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// TODO 1: Объявите тип Either
//
// Either<L, R> = Left<L> | Right<R>
// Используйте tag-дискриминатор: { tag: 'Left'; value: L } | { tag: 'Right'; value: R }
// ============================================

// type Either<L, R> = { tag: 'Left'; value: L } | { tag: 'Right'; value: R }

// ============================================
// TODO 2: Реализуйте Either-примитивы
//
// pipeRight(value)     — создаёт Right
// pipeLeft(value)      — создаёт Left
// pipeChain(either, fn) — вызывает fn только при Right, Left проксирует
// ============================================

// function pipeRight<L, R>(value: R): Either<L, R> { ... }
// function pipeLeft<L, R>(value: L): Either<L, R> { ... }
// function pipeChain<L, A, B>(e: Either<L, A>, fn: (v: A) => Either<L, B>): Either<L, B> { ... }

// ============================================
// TODO 3: Объявите интерфейсы
//
// RawEvent: { timestamp: string; type: string; userId: string; amount?: string; category?: string }
// ValidEvent: добавляет amount: number и category: string (обязательные)
// EnrichedEvent: extends ValidEvent, добавляет date: Date, dayOfWeek: string, isWeekend: boolean
// GroupedEvents: { [category: string]: EnrichedEvent[] }
// AggregatedResult: { category, count, totalAmount, avgAmount }
// FormattedResult: { category, count: string, totalAmount: string, avgAmount: string }
// ============================================

// ============================================
// TODO 4: Реализуйте parseJSON
//
// function parseJSON(input: string): Either<string, RawEvent[]>
//
// Используйте try/catch для JSON.parse.
// Проверьте что результат — массив (Array.isArray).
// При ошибке — pipeLeft с описанием проблемы.
// ============================================

// ============================================
// TODO 5: Реализуйте validateEvents
//
// function validateEvents(events: RawEvent[]): Either<string, ValidEvent[]>
//
// Фильтруйте события у которых нет timestamp, type или userId.
// Фильтруйте события с невалидным amount (isNaN(parseFloat(...))).
// Если после фильтрации нет ни одного события — возвращайте Left.
// Иначе — Right с массивом ValidEvent.
// ============================================

// ============================================
// TODO 6: Реализуйте enrichEvents
//
// function enrichEvents(events: ValidEvent[]): Either<string, EnrichedEvent[]>
//
// Для каждого события добавьте:
//   date: new Date(e.timestamp)
//   dayOfWeek: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'][date.getDay()]
//   isWeekend: date.getDay() === 0 || date.getDay() === 6
// При любой ошибке — Left
// ============================================

// ============================================
// TODO 7: Реализуйте groupByCategory и aggregateGroups
//
// groupByCategory(events): Either<string, GroupedEvents>
//   Сгруппируйте события по полю category.
//
// aggregateGroups(groups): Either<string, AggregatedResult[]>
//   Для каждой группы посчитайте count, totalAmount, avgAmount.
//   Отсортируйте результат по убыванию totalAmount.
// ============================================

// ============================================
// TODO 8: Реализуйте formatResults
//
// function formatResults(results: AggregatedResult[]): Either<string, FormattedResult[]>
//
// Форматируйте числа через .toLocaleString('ru-RU') + ' ₽'
// count — строка вида "N событий"
// ============================================

export function Task8_3() {
  const { t } = useLanguage()
  const [jsonInput, setJsonInput] = useState('')
  void jsonInput
  void setJsonInput

  // Пример JSON для загрузки
  const EXAMPLE = JSON.stringify([
    { timestamp: '2024-01-15T10:00:00Z', type: 'purchase', userId: 'u1', amount: '1200', category: 'Electronics' },
    { timestamp: '2024-01-16T14:30:00Z', type: 'purchase', userId: 'u2', amount: '350', category: 'Books' },
  ], null, 2)
  void EXAMPLE

  return (
    <div className="exercise-container">
      <h2>{t('task.8.3')}</h2>

      {/* TODO 9: Добавьте текстовое поле для ввода JSON
          и кнопку "Загрузить пример" (setJsonInput(EXAMPLE)) */}

      {/* TODO 10: Добавьте кнопку "Запустить пайплайн"
          При клике выполните:
          pipeChain(
            pipeChain(
              pipeChain(
                pipeChain(
                  pipeChain(parseJSON(jsonInput), validateEvents),
                  enrichEvents
                ),
                groupByCategory
              ),
              aggregateGroups
            ),
            formatResults
          ) */}

      {/* TODO 11: Отобразите каждый этап пайплайна как строку:
          [название] [функция] | Вход: X | Выход: Y или Ошибка: msg
          Этапы после ошибочного — показывайте как "пропущен" */}

      {/* TODO 12: Отобразите итоговую таблицу агрегатов
          Колонки: Категория | Событий | Сумма | Среднее
          Показывайте только при успешном завершении всего пайплайна */}
    </div>
  )
}
