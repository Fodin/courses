# Задание 8.5: Финальный проект — Kanban Board

## 🎯 Цель

Создать канбан-доску, объединяющую все изученные концепции MobX: observable, action, computed и гранулярный observer.

## 📋 Требования

Создайте `KanbanStore` и компоненты канбан-доски:

1. Интерфейсы `Card { id, title }` и `Column { id, title, cards }`
2. `KanbanStore` с observable `columns` — массив из 3 колонок: Todo, In Progress, Done
3. Метод `addCard(columnId, title)` — добавляет карточку в колонку
4. Метод `removeCard(columnId, cardId)` — удаляет карточку из колонки
5. Метод `moveCard(cardId, fromColId, toColId)` — перемещает карточку между колонками
6. Computed `totalCards` — общее количество карточек во всех колонках
7. Компонент `KanbanColumn` — отдельный `observer` для каждой колонки
8. Внутри колонки: список карточек, кнопки перемещения в другие колонки, поле ввода для новой карточки

```typescript
interface Card {
  id: string
  title: string
}

interface Column {
  id: string
  title: string
  cards: Card[]
}

class KanbanStore {
  columns: Column[]
  addCard(columnId: string, title: string): void
  removeCard(columnId: string, cardId: string): void
  moveCard(cardId: string, fromColId: string, toColId: string): void
  get totalCards(): number
}
```

## Чеклист

- [ ] `KanbanStore` создан с `makeAutoObservable`
- [ ] 3 колонки инициализированы с начальными карточками
- [ ] `addCard` добавляет карточку с уникальным id (`crypto.randomUUID()`)
- [ ] `removeCard` удаляет карточку из указанной колонки
- [ ] `moveCard` перемещает карточку из одной колонки в другую
- [ ] `totalCards` корректно считает общее количество карточек
- [ ] `KanbanColumn` обёрнут в `observer` для гранулярного рендеринга
- [ ] Можно добавлять новые карточки через поле ввода
- [ ] Можно удалять карточки кнопкой
- [ ] Можно перемещать карточки между колонками

## 🔍 Как проверить себя

1. Добавьте карточку в колонку «Todo» — она должна появиться, `totalCards` увеличится
2. Переместите карточку из «Todo» в «In Progress» — карточка исчезнет из первой колонки и появится во второй
3. Удалите карточку — она исчезнет, `totalCards` уменьшится
4. Убедитесь, что счётчики карточек в заголовках колонок обновляются корректно
5. Проверьте, что `totalCards` всегда соответствует сумме карточек во всех колонках
