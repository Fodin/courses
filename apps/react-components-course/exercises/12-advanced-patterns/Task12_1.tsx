import { useLanguage } from 'src/hooks'

// ============================================
// Задание 12.1: DatePicker — Controlled + Uncontrolled
// Task 12.1: DatePicker — Controlled + Uncontrolled
// ============================================
//
// Реализуйте компонент DatePicker, который работает
// Implement a DatePicker component that works
// в обоих режимах. TypeScript должен принудительно
// in both modes. TypeScript must strictly
// требовать onChange при передаче value.
// require onChange when value is passed.
//
// Шаг 1: Опишите типы через discriminated union
// Step 1: Describe types via discriminated union
//
// type ControlledDatePickerProps = {
//   value: Date
//   onChange: (date: Date) => void
//   defaultValue?: never    // <- запрещаем смешивание
//   defaultValue?: never    // <- prevent mixing
// }
//
// type UncontrolledDatePickerProps = {
//   defaultValue?: Date
//   value?: never           // <- запрещаем смешивание
//   value?: never           // <- prevent mixing
//   onChange?: never
// }
//
// type DatePickerProps = (ControlledDatePickerProps | UncontrolledDatePickerProps) & {
//   placeholder?: string
// }
//
// Шаг 2: Реализуйте хук useControllableState
// Step 2: Implement useControllableState hook
//
// function useControllableState<T>(
//   controlledValue: T | undefined,
//   defaultValue: T,
//   onChange?: (value: T) => void
// ): [T, (value: T) => void] {
//   // ...
// }
//
// Шаг 3: Реализуйте UI календаря
// Step 3: Implement calendar UI
//
// Вспомогательные функции:
// Helper functions:
// - new Date(year, month + 1, 0).getDate()  — кол-во дней в месяце
// - new Date(year, month + 1, 0).getDate()  — number of days in month
// - new Date(year, month, 1).getDay()        — день недели первого числа (0=Вс..6=Сб)
// - new Date(year, month, 1).getDay()        — weekday of the 1st (0=Sun..6=Sat)
// - ((day + 6) % 7)                          — конвертация в Mon-first (0=Пн..6=Вс)
// - ((day + 6) % 7)                          — convert to Mon-first (0=Mon..6=Sun)
//
// Шаг 4: Демо — два DatePicker рядом: controlled и uncontrolled
// Step 4: Demo — two DatePickers side by side: controlled and uncontrolled

// TODO: Реализуйте useControllableState
// TODO: Implement useControllableState

// TODO: Опишите типы ControlledDatePickerProps, UncontrolledDatePickerProps, DatePickerProps
// TODO: Define ControlledDatePickerProps, UncontrolledDatePickerProps, DatePickerProps types

// TODO: Реализуйте функцию buildCalendarDays(year, month): (Date | null)[]
// TODO: Implement buildCalendarDays(year, month): (Date | null)[] function

// TODO: Реализуйте компонент DatePicker с сеткой дней и навигацией по месяцам
// TODO: Implement DatePicker component with day grid and month navigation

export function Task12_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 12.1</h2>

      {/* TODO: Покажите два DatePicker — controlled (value + onChange) и uncontrolled (defaultValue) */}
      {/* TODO: Show two DatePickers — controlled (value + onChange) and uncontrolled (defaultValue) */}
      {/* TODO: Controlled: управляйте датой через useState */}
      {/* TODO: Controlled: manage date via useState */}
      {/* TODO: Uncontrolled: передайте только defaultValue */}
      {/* TODO: Uncontrolled: pass only defaultValue */}
      {/* TODO: Отобразите текущее значение controlled DatePicker под ним */}
      {/* TODO: Display current value of controlled DatePicker below it */}
    </div>
  )
}
