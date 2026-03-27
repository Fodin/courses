# Задание 5.3: CQRS (CommandBus и QueryBus)

## Цель

Реализовать паттерн CQRS с типобезопасными CommandBus и QueryBus для разделения операций записи и чтения.

## Требования

1. Определите базовые интерфейсы:
   - `Command` с полем `type: string`
   - `Query` с полем `type: string`
   - `CommandHandler<C extends Command>` с методом `execute(command: C): void`
   - `QueryHandler<Q extends Query, R>` с методом `execute(query: Q): R`
2. Реализуйте `CommandBus`:
   - `register<C extends Command>(type: string, handler: CommandHandler<C>): void`
   - `dispatch(command: Command): void` -- находит обработчик по `command.type` и вызывает его
3. Реализуйте `QueryBus`:
   - `register<Q extends Query, R>(type: string, handler: QueryHandler<Q, R>): void`
   - `dispatch<R>(query: Query): R` -- находит обработчик по `query.type` и возвращает результат
4. Реализуйте пример: система управления задачами (todo)
   - Команды: `CreateTodoCommand`, `CompleteTodoCommand`
   - Запросы: `GetAllTodosQuery`, `GetTodoByIdQuery`
5. Обработчики работают с общим хранилищем `Map<string, Todo>`

## Чеклист

- [ ] Интерфейсы `Command`, `Query`, `CommandHandler`, `QueryHandler` определены
- [ ] `CommandBus` регистрирует и диспатчит команды по типу
- [ ] `QueryBus` регистрирует и диспатчит запросы по типу
- [ ] `dispatch` выбрасывает ошибку для незарегистрированного типа
- [ ] Реализованы обработчики для CreateTodo, CompleteTodo
- [ ] Реализованы обработчики для GetAllTodos, GetTodoById
- [ ] Демонстрация показывает полный цикл: создание -> запрос -> обновление -> запрос

## Как проверить себя

1. Нажмите кнопку запуска
2. Убедитесь, что команды создают и обновляют задачи
3. Убедитесь, что запросы возвращают актуальные данные после команд
4. Проверьте, что completed-статус задачи меняется после CompleteTodoCommand
