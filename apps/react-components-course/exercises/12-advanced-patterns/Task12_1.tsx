import { useLanguage } from 'src/hooks'

// ============================================
// Задание 12.1: DatePicker — Controlled + Uncontrolled
// ============================================
//
// Реализуйте компонент DatePicker, который работает
// в обоих режимах. TypeScript должен принудительно
// требовать onChange при передаче value.
//
// Шаг 1: Опишите типы через discriminated union
//
// type ControlledDatePickerProps = {
//   value: Date
//   onChange: (date: Date) => void
//   defaultValue?: never    // <- запрещаем смешивание
// }
//
// type UncontrolledDatePickerProps = {
//   defaultValue?: Date
//   value?: never           // <- запрещаем смешивание
//   onChange?: never
// }
//
// type DatePickerProps = (ControlledDatePickerProps | UncontrolledDatePickerProps) & {
//   placeholder?: string
// }
//
// Шаг 2: Реализуйте хук useControllableState
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
//
// Вспомогательные функции:
// - new Date(year, month + 1, 0).getDate()  — кол-во дней в месяце
// - new Date(year, month, 1).getDay()        — день недели первого числа (0=Вс..6=Сб)
// - ((day + 6) % 7)                          — конвертация в Mon-first (0=Пн..6=Вс)
//
// Шаг 4: Демо — два DatePicker рядом: controlled и uncontrolled

// TODO: Реализуйте useControllableState

// TODO: Опишите типы ControlledDatePickerProps, UncontrolledDatePickerProps, DatePickerProps

// TODO: Реализуйте функцию buildCalendarDays(year, month): (Date | null)[]

// TODO: Реализуйте компонент DatePicker с сеткой дней и навигацией по месяцам

export function Task12_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 12.1</h2>

      {/* TODO: Покажите два DatePicker — controlled (value + onChange) и uncontrolled (defaultValue) */}
      {/* TODO: Controlled: управляйте датой через useState */}
      {/* TODO: Uncontrolled: передайте только defaultValue */}
      {/* TODO: Отобразите текущее значение controlled DatePicker под ним */}
    </div>
  )
}
