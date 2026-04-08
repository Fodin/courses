# Задание 11.1: Базовый ErrorBoundary

## Цель

Реализовать универсальный `ErrorBoundary` как class-компонент с типизированным render prop `fallback`, принимающим `{ error, resetErrorBoundary }`. Обернуть несколько независимых секций dashboard.

## Требования

1. Создайте интерфейс `FallbackProps` с полями `error: Error` и `resetErrorBoundary: () => void`
2. Создайте интерфейс `ErrorBoundaryProps` с полями `fallback: (props: FallbackProps) => React.ReactNode` и `children: React.ReactNode`
3. Реализуйте `ErrorBoundary` как class-компонент с методами:
   - `static getDerivedStateFromError(error)` — обновляет state при ошибке
   - `componentDidCatch(error, info)` — логирует ошибку в console.error
   - `reset` — метод сброса state обратно в `{ hasError: false, error: null }`
4. В `render` вызывайте `this.props.fallback(...)` если `hasError === true`, иначе рендерите `children`
5. Создайте компонент `DashboardSection` — принимает `title: string` и `children`
6. Создайте три компонента-секции: `StatsWidget`, `ChartWidget`, `ActivityWidget`
7. У каждого виджета должна быть кнопка «Сломать» (при клике бросает `new Error(...)`)
8. Оберните каждый виджет в отдельный `ErrorBoundary` с fallback, показывающим сообщение об ошибке и кнопку «Восстановить»

## Подсказки

- `getDerivedStateFromError` — статический метод, пишется как `static getDerivedStateFromError`
- Бросить ошибку в обработчике события: `onClick={() => { throw new Error('...') }}` — внимание, это **не** поймает boundary (onClick — не render). Вместо этого сохраните ошибку в state компонента: `setError(new Error(...))`, а потом `if (error) throw error`
- Fallback получает `error.message` — выводите его пользователю
- Для сброса виджета после `resetErrorBoundary` может потребоваться `key` на ErrorBoundary

## Чеклист

- [ ] `ErrorBoundary` — class-компонент с правильными lifecycle-методами
- [ ] `FallbackProps` и `ErrorBoundaryProps` — типизированы
- [ ] `fallback` — render prop, получает `error` и `resetErrorBoundary`
- [ ] Три виджета с кнопкой «Сломать»
- [ ] Каждый виджет обёрнут в отдельный `ErrorBoundary`
- [ ] При падении одного виджета остальные продолжают работать
- [ ] Кнопка «Восстановить» возвращает виджет в рабочее состояние

## Как проверить себя

1. Нажмите «Сломать» в StatsWidget — должна появиться заглушка только для него
2. ChartWidget и ActivityWidget при этом работают нормально
3. Нажмите «Восстановить» — StatsWidget снова показывает контент
4. Нажмите «Сломать» в двух виджетах одновременно — третий продолжает работать
