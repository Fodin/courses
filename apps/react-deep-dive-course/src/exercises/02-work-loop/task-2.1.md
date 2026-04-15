# Задание 2.1: Упрощённый Work Loop

## Цель

Реализовать интерактивный симулятор Work Loop: шаг за шагом обходить Fiber-дерево в режиме DFS, наглядно видя, в какой ноде находится "указатель workInProgress" и какая фаза выполняется (beginWork или completeWork).

## Задание

Создай компонент `Task2_1`, который:

1. Хранит Fiber-дерево как статическую структуру с полями `id`, `name`, `child`, `sibling`, `return` (как в настоящем React)
2. Отображает дерево визуально, подсвечивая текущую ноду (workInProgress)
3. Реализует Work Loop: обход через `beginWork` (вход, спуск к child) и `completeWork` (завершение, переход к sibling или подъём через return)
4. Поддерживает два режима:
   - **Step** — один шаг по нажатию кнопки
   - **Auto** — автоматическое выполнение с задержкой 600ms между шагами

## Требования

1. Структура узла:
   ```ts
   type WorkNode = {
     id: string
     name: string
     child: WorkNode | null
     sibling: WorkNode | null
     return: WorkNode | null
     phase: 'pending' | 'begin' | 'complete'
   }
   ```
2. Состояние Work Loop:
   ```ts
   type LoopState = {
     workInProgress: WorkNode | null
     completed: string[]  // id завершённых узлов
     begun: string[]      // id узлов в фазе beginWork
     log: string[]        // лог шагов
   }
   ```
3. Алгоритм шага:
   - Если у текущего узла есть `child` и он ещё не посещён → `beginWork(child)`, `workInProgress = child`
   - Если `child` нет или уже посещены → `completeWork(current)`, переход к `sibling` или `return`
4. Визуализация: текущий узел выделен ярко, завершённые — приглушены, ещё не посещённые — обычные
5. Лог действий: последние 8 записей в формате `"→ beginWork(Main)"` или `"✓ completeWork(Header)"`
6. Кнопка **Reset** возвращает в начальное состояние

## Дерево для симуляции

```
App
├── Header
├── Main
│   ├── Article
│   └── Aside
└── Footer
```

## Чеклист

- [ ] Work Loop правильно обходит дерево (DFS: вниз → вправо → вверх)
- [ ] beginWork вызывается при первом посещении узла
- [ ] completeWork вызывается когда нет непосещённых детей
- [ ] Текущая нода подсвечена в дереве
- [ ] Лог показывает последовательность шагов
- [ ] Кнопка Auto запускает/останавливает автообход
- [ ] После завершения всего дерева кнопки Step/Auto неактивны
- [ ] Reset сбрасывает всё в начальное состояние

## Как проверить себя

Правильный порядок обхода для данного дерева:

```
beginWork(App)
beginWork(Header)
completeWork(Header)
beginWork(Main)
beginWork(Article)
completeWork(Article)
beginWork(Aside)
completeWork(Aside)
completeWork(Main)
beginWork(Footer)
completeWork(Footer)
completeWork(App)
```

Если твой лог совпадает с этим порядком — задание выполнено.
