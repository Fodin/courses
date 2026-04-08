# Задание 11.3: useErrorHandler для async-ошибок

## Цель

Реализовать хук `useErrorHandler`, который позволяет пробрасывать async-ошибки (из fetch, setTimeout, обработчиков событий) в ближайший Error Boundary.

## Требования

1. Реализуйте хук `useErrorHandler()`:
   - Внутри использует `useState<null>(null)`
   - Возвращает функцию `(error: Error) => void`
   - При вызове делает `setState(() => { throw error })` — это пробрасывает ошибку в фазу рендеринга
2. Создайте компонент `AsyncDataWidget` — симулирует загрузку данных:
   - State: `loading`, `data`, вызов `useErrorHandler`
   - Кнопка «Загрузить данные» запускает `setTimeout(1500ms)` и затем либо возвращает данные, либо вызывает `handleError(new Error(...))`
   - Переключатель (checkbox или select) «Режим: успех / ошибка» определяет, что произойдёт
3. Создайте компонент `EventErrorWidget` — симулирует ошибку в обработчике события:
   - Кнопка «Выполнить действие» в `onClick` вызывает `handleError(new Error(...))`
   - Демонстрирует: без `useErrorHandler` ошибка в onClick не поймалась бы boundary
4. Оберните оба виджета в отдельные `ErrorBoundary` с кнопкой «Восстановить»
5. Добавьте раздел с объяснением: почему `setState(() => { throw error })` работает (текстовый блок в UI)

## Подсказки

- Ключевой паттерн: `const [, setState] = useState<null>(null)` — нас интересует только `setState`, не значение
- `setState(() => { throw error })` — функция-обновитель вызывается React во время reconciliation, ошибка попадает в render-фазу
- `useCallback` для стабильной ссылки на возвращаемую функцию
- Для симуляции async: `await new Promise(resolve => setTimeout(resolve, 1500))`
- После `handleError` компонент не должен продолжать работу — добавьте ранний return или проверку isMounted

## Чеклист

- [ ] `useErrorHandler` реализован с паттерном `setState(() => { throw error })`
- [ ] `AsyncDataWidget` показывает состояние загрузки (спиннер или текст)
- [ ] Переключатель режима «успех/ошибка» работает
- [ ] При ошибке срабатывает `ErrorBoundary`, а не просто console.error
- [ ] `EventErrorWidget` демонстрирует проброс ошибки из onClick
- [ ] Оба виджета восстанавливаются через `resetErrorBoundary`
- [ ] В UI есть пояснение механизма работы хука

## Как проверить себя

1. Выберите режим «ошибка», нажмите «Загрузить данные» — через 1.5 сек появляется fallback boundary
2. Нажмите «Восстановить», переключите в «успех», нажмите «Загрузить данные» — показываются данные
3. В EventErrorWidget нажмите «Выполнить действие» — boundary перехватывает ошибку из onClick
4. Откройте DevTools: в console.error видно сообщение из componentDidCatch
5. Убедитесь, что без ErrorBoundary тест не проходит — ошибка должна идти именно через boundary
