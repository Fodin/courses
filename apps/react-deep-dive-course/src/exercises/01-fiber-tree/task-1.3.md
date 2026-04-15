# Задание 1.3: Fiber vs DOM

## Цель

Показать разницу между Fiber-деревом и DOM-деревом через side-by-side визуализацию. Реализовать функцию `flattenToDom`, которая обходит Fiber-дерево и отбирает только "видимые" узлы (HostComponent и HostText), игнорируя Fragment, ContextProvider, FunctionComponent.

## Требования

1. Определить тип `FiberNode` с полями: `name`, `tag` (`'FunctionComponent' | 'HostComponent' | 'HostText' | 'Fragment' | 'ContextProvider' | 'ContextConsumer' | 'Memo'`), `children`.
2. Реализовать функцию `flattenToDom(fiber)` — возвращает дерево только из HostComponent и HostText узлов:
   - FunctionComponent: прозрачно, берём его детей
   - Fragment: прозрачно, берём его детей
   - ContextProvider/Consumer: прозрачно, берём его детей
   - Memo: прозрачно, берём его детей
   - HostComponent: узел остаётся, его дети рекурсивно обрабатываются через flattenToDom
   - HostText: листовой узел, остаётся
3. Визуализировать два дерева рядом: левая колонка — полное Fiber-дерево (все узлы), правая — DOM-дерево (только host узлы).
4. Цветовое кодирование в Fiber-дереве: HostComponent — зелёный, HostText — жёлтый, остальные (невидимые) — серый с курсивом.
5. Добавить переключатель между несколькими предустановленными примерами дерева.

## Чеклист

- [ ] `flattenToDom` убирает Fragment, FunctionComponent, ContextProvider, Memo
- [ ] HostComponent и HostText остаются в DOM-дереве
- [ ] Дети "прозрачных" узлов поднимаются к ближайшему HostComponent-предку
- [ ] Левое дерево показывает все Fiber nodes с цветовым кодированием
- [ ] Правое дерево показывает только DOM-узлы
- [ ] Есть минимум 2 примера с Fragment и ContextProvider
- [ ] Невидимые узлы в левом дереве выделены серым

## Как проверить себя

1. Возьми дерево: `App(FC) → Provider(CP) → Fragment → [div(HC), span(HC)]`
2. `flattenToDom` должен вернуть: `[div, span]` (без App, Provider, Fragment)
3. Возьми: `Page(FC) → div(HC) → [Fragment → [h1(HC), p(HC)], footer(HC)]`
4. Результат: `div → [h1, p, footer]` (Fragment исчез, его дети поднялись)
5. Убедись, что HostText ("Hello") тоже остаётся в DOM-дереве
