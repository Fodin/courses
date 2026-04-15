# Задание 10.1: Suspense Mechanics

## Цель

Понять механизм Suspense изнутри: построить упрощённый wrapper-компонент, который имитирует поведение `<Suspense>` — ловит thrown promise, показывает fallback, при resolve перерендеривает дочерний компонент.

## Задание

Реализуйте компонент `MiniSuspense`, который воспроизводит ключевую механику React Suspense. Дочерний компонент получает resource-объект и вызывает `resource.read()` — если данные не готовы, resource бросает Promise; если готовы — возвращает данные.

Реализуйте функцию `createResource<T>(promise: Promise<T>)`, которая возвращает объект с методом `read()`:
- если Promise ещё не выполнен — бросает Promise
- если выполнен успешно — возвращает значение
- если отклонён — бросает ошибку

Реализуйте компонент `MiniSuspense`:
- Принимает `fallback` (ReactNode) и `children` (ReactNode)
- Ловит thrown Promise через class-based подход (componentDidCatch / getDerivedStateFromError)
- При поимке Promise подписывается на его resolve и перерендеривает children
- Пока Promise pending — показывает fallback

Создайте демо с двумя кнопками:
- "Быстрая загрузка (1s)" — создаёт resource с задержкой 1 секунда
- "Медленная загрузка (3s)" — создаёт resource с задержкой 3 секунды

При клике — сбрасывает предыдущий resource и показывает процесс загрузки: fallback → данные.

## Требования

1. Функция `createResource<T>(promise: Promise<T>)` возвращает объект `{ read(): T }`
2. `read()` бросает Promise если `status === 'pending'`, бросает error если `status === 'rejected'`, возвращает value если `status === 'fulfilled'`
3. `MiniSuspense` — class-компонент с `getDerivedStateFromError` который ловит thrown Promise
4. При поимке Promise — `promise.then(() => this.setState({ error: null }))` для перерендера
5. Состояние компонента хранит `{ error: unknown | null }` — если error это Promise, показываем fallback
6. Дочерний компонент `DataDisplay` вызывает `resource.read()` в теле функции
7. Два демо-сценария (1s и 3s) с кнопкой запуска каждого
8. Таймер, показывающий сколько времени прошло с начала загрузки

## Чеклист

- [ ] `createResource` правильно инструментирует Promise (устанавливает status/value/error)
- [ ] `read()` бросает тот же Promise объект (не новый) при повторных вызовах
- [ ] `MiniSuspense` — class-компонент с корректным `getDerivedStateFromError`
- [ ] Fallback показывается пока Promise pending
- [ ] После resolve Promise отображаются реальные данные
- [ ] При повторном клике resource сбрасывается и цикл начинается заново
- [ ] Таймер показывает elapsed time

## Как проверить себя

1. Нажмите "Быстрая загрузка" — должен появиться fallback (спиннер/текст), через 1 секунду — данные
2. Нажмите "Медленная загрузка" — то же самое, но ждать 3 секунды
3. Нажмите "Медленная загрузка" в середине "Быстрой" — старый resource должен быть заменён
4. Убедитесь что таймер показывает корректное время ожидания
5. В консоли не должно быть "Warning: Cannot update during an existing state transition"
