# Задание 6.2: Referential Equality Trap

## Задание

Компонент `Task6_2` содержит `Parent`, который передаёт `Child` (обёрнутому в `React.memo`)
два prop-а: `style` (объект) и `onClick` (функция). Оба создаются inline.

Счётчик рендеров на `Child` показывает, что `React.memo` не работает —
Child рендерится при каждом рендере Parent, несмотря на обёртку.

Твоя задача — исправить это: стабилизировать `style` через `useMemo` и `onClick` через `useCallback`.

## Цель

Понять, почему `React.memo` бесполезен без стабильных ссылок на объекты и функции.
Увидеть, как `useMemo` + `useCallback` делают мемоизацию рабочей.

## Требования

1. Компонент `ChildComponent` (внутри файла) обёрнут в `React.memo` — не меняй это
2. В плохой версии `style` создаётся как `{ color: 'steelblue', padding: '8px' }` inline в JSX
3. В плохой версии `onClick` создаётся как `() => setParentCount(c => c + 1)` inline
4. Кнопка "Trigger Parent Re-render" вызывает setState в Parent — это единственный триггер рендера Parent
5. Исправь: вынеси `style` в `useMemo` с пустым deps `[]` (стиль не зависит от state)
6. Исправь: вынеси `onClick` в `useCallback` с deps `[setParentCount]` (или пустым, если используешь функциональный updater)
7. После исправления: нажатие "Trigger Parent Re-render" рендерит Parent, но НЕ рендерит Child

## Чеклист

- [ ] `ChildComponent` обёрнут в `React.memo` (не трогай)
- [ ] `style` вычисляется через `useMemo`, не создаётся inline
- [ ] `onClick` стабилизирован через `useCallback`
- [ ] Счётчик рендеров на `Parent`: увеличивается при нажатии кнопки
- [ ] Счётчик рендеров на `Child`: **НЕ увеличивается** при нажатии кнопки
- [ ] Счётчик рендеров на `Child` увеличивается только при первом рендере (mount)

## Как проверить себя

1. В плохой версии: нажми "Trigger Parent Re-render" 3 раза — оба счётчика растут
2. Исправь код
3. Нажми "Trigger Parent Re-render" 3 раза — только счётчик Parent растёт
4. Счётчик Child остаётся на 1 (только mount)
5. Попробуй убрать только useCallback (оставив useMemo) — Child снова начнёт рендериться
