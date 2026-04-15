# Задание 1.2: createElement → Fiber

## Цель

Реализовать упрощённые `myCreateElement` и `myCreateFiber`, которые воспроизводят цепочку JSX → React Element → Fiber Node. Это не настоящий React, но структурно идентичная модель, которая покажет, как React создаёт linked list из child/sibling/return.

## Требования

1. Реализовать `myCreateElement(type, props, ...children)` — возвращает объект `{ type, props, children }`.
2. Реализовать `myCreateFiber(element, returnFiber)` — конвертирует дерево элементов в Fiber nodes:
   - Каждый Fiber: `{ type, tag, stateNode: null, child, sibling, return: returnFiber, memoizedProps }`
   - `tag` определяется по `type`: строка → `'HostComponent'`, функция → `'FunctionComponent'`, `null` → `'HostText'`
   - `child` — Fiber первого ребёнка
   - Каждый ребёнок получает `sibling` на следующего брата
   - `return` указывает на родительский Fiber
3. Визуализировать результат: показать дерево элементов слева и Fiber-дерево справа (side-by-side).
4. Кнопка "Пересоздать" — повторно создаёт и отображает дерево (симуляция рендера).
5. Показывать поля выбранного Fiber node: type, tag, child.type, sibling.type, return.type.

## Чеклист

- [ ] `myCreateElement` возвращает объект с type, props, children
- [ ] `myCreateFiber` создаёт Fiber nodes из Element дерева
- [ ] child указывает на первого ребёнка
- [ ] sibling связывает братьев в цепочку
- [ ] return указывает на родителя у каждого узла
- [ ] tag определяется по типу: строка, функция, текст
- [ ] Визуализация показывает оба дерева рядом
- [ ] Клик на Fiber показывает его поля

## Как проверить себя

1. Вызови `myCreateElement('div', null, myCreateElement('h1', null, 'Hello'), myCreateElement('p', null, 'World'))`.
2. Передай результат в `myCreateFiber` — должны получиться 3 Fiber nodes.
3. Проверь: `divFiber.child.type === 'h1'`, `divFiber.child.sibling.type === 'p'`.
4. Проверь: `h1Fiber.return.type === 'div'`, `pFiber.return.type === 'div'`.
5. Убедись что `h1Fiber.sibling === pFiber` и `pFiber.sibling === null`.
