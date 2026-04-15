# Задание 1.4: Fiber Detective

## Цель

Реализовать функцию `traverseFiber`, которая обходит Fiber-дерево через child/sibling/return (как это делает React) и собирает диагностику по каждому узлу. Результат — интерактивная таблица с возможностью фильтрации.

## Требования

1. Определить тип `FiberDiagnostic`:
   ```ts
   type FiberDiagnostic = {
     name: string        // имя компонента или тег ('div', 'span', ...)
     depth: number       // глубина в дереве (корень = 0)
     childCount: number  // количество прямых детей
     tag: string         // тип: 'FunctionComponent', 'HostComponent', 'HostText', 'Fragment', ...
     hasChildren: boolean
     hasSibling: boolean
     returnName: string | null  // имя родителя
   }
   ```
2. Реализовать `traverseFiber(root)` — итеративный DFS через child/sibling/return (не рекурсию!):
   - Использовать `workInProgress` переменную и цикл `while`
   - Обойти дерево в порядке: child первый, затем sibling, затем return
   - Собрать массив `FiberDiagnostic[]` в порядке обхода
3. Показывать результат в таблице с колонками: Name, Tag, Depth, Children, Has Sibling, Return.
4. Добавить фильтрацию по типу (все, только FC, только HostComponent, только Fragment).
5. Строки HostComponent — зелёный фон, FunctionComponent — синий, Fragment/Provider — серый.
6. Показывать сводную статистику: всего узлов, максимальная глубина, количество HostComponent.

## Чеклист

- [ ] `traverseFiber` использует итеративный цикл, а не рекурсию
- [ ] Порядок обхода: child (вниз) → sibling (вправо) → return (вверх, если нет sibling)
- [ ] depth вычислен правильно (увеличивается при переходе child, уменьшается при return)
- [ ] childCount считает прямых детей через sibling-цепочку
- [ ] Таблица отображает все поля FiberDiagnostic
- [ ] Фильтрация по тегу работает корректно
- [ ] Статистика: итого, макс глубина, количество host-узлов
- [ ] Строки раскрашены по типу

## Как проверить себя

1. Создай дерево: `Root(FC, depth=0) → div(HC, depth=1) → [h1(HC, depth=2), p(HC, depth=2)]`
2. `traverseFiber` должен вернуть 4 записи в порядке обхода
3. У `div` должно быть `childCount: 2`, `hasSibling: false`, `returnName: 'Root'`
4. У `h1` — `childCount: 0`, `hasSibling: true`, `returnName: 'div'`
5. Отфильтруй по HostComponent — должны остаться div, h1, p
6. Статистика: всего 4, макс глубина 2, host-узлов 3
