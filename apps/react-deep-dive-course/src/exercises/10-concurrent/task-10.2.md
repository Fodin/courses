# Задание 10.2: Transition vs Sync Update

## Цель

Почувствовать на практике разницу между синхронным и transition обновлением: input поиска + тяжёлый список, frame rate монитор. Без `startTransition` UI фризит. С `startTransition` input остаётся отзывчивым.

## Задание

Создайте два идентичных компонента поиска (`SyncSearch` и `TransitionSearch`) — левый и правый в одном ряду. Оба содержат:
- Input для поиска
- Список из 8 000 элементов (генерируется один раз) с фильтрацией по введённому тексту
- Счётчик найденных результатов
- Frame Rate Monitor (измеряет FPS через `requestAnimationFrame`)

В `SyncSearch` обновление списка происходит синхронно (обычный `setState`).

В `TransitionSearch` обновление списка обёрнуто в `startTransition`. Показывается `isPending` индикатор на input (например, `opacity: 0.6` и текст "обновляется...").

Frame Rate Monitor — отдельный компонент, который в `useEffect` запускает `requestAnimationFrame` цикл, измеряет время между кадрами и вычисляет текущий FPS. Показывает последние 20 значений в виде мини-гистограммы или просто числом. Цветовая индикация: >= 50 fps — зелёный, 30-50 — жёлтый, < 30 — красный.

## Требования

1. Сгенерировать массив из 8 000 строк вне компонента (один раз): `Array.from({ length: 8000 }, (_, i) => ...)` с реалистичными именами (можно комбинировать слова)
2. Фильтрация: `items.filter(item => item.toLowerCase().includes(query.toLowerCase()))` — намеренно наивная, без оптимизаций
3. `SyncSearch`: `onChange` напрямую вызывает `setQuery(e.target.value)` и `setResults(filter(items, q))` — всё синхронно
4. `TransitionSearch`: `onChange` вызывает `setQuery(e.target.value)` синхронно (чтобы input был отзывчив), а `startTransition(() => setResults(...))` для тяжёлой фильтрации
5. Frame Rate Monitor через `requestAnimationFrame` — обновляет FPS каждые ~300ms
6. `isPending` индикатор на `TransitionSearch` input
7. Обе панели рядом для сравнения

## Чеклист

- [ ] Массив из 8 000 элементов создан вне компонента (не пересоздаётся при рендере)
- [ ] `SyncSearch` — оба `setState` без `startTransition`
- [ ] `TransitionSearch` — `setQuery` синхронно, `setResults` внутри `startTransition`
- [ ] `[isPending, startTransition] = useTransition()` используется в `TransitionSearch`
- [ ] `isPending` отражается в UI input (opacity, текст "обновляется...")
- [ ] Frame Rate Monitor работает в обоих компонентах независимо
- [ ] При быстром наборе в `SyncSearch` заметен lag/freeze (fps падает)
- [ ] При быстром наборе в `TransitionSearch` input остаётся отзывчивым

## Как проверить себя

1. Откройте оба инпута и быстро напечатайте "react" символ за символом
2. В левом (`SyncSearch`): каждое нажатие вызывает freeze — FPS должен падать до 10-20
3. В правом (`TransitionSearch`): input реагирует мгновенно, FPS остаётся высоким
4. В `TransitionSearch` при наборе видна надпись "обновляется..." (isPending === true)
5. Откройте React DevTools → Profiler → запишите сессию ввода в обоих инпутах. В sync: длинные "синхронные" рендеры. В transition: прерывистые короткие кусочки
