# Task 5.3: CQRS (CommandBus and QueryBus)

## Objective

Implement the CQRS pattern with type-safe CommandBus and QueryBus to separate write and read operations.

## Requirements

1. Define base interfaces:
   - `Command` with a `type: string` field
   - `Query` with a `type: string` field
   - `CommandHandler<C extends Command>` with an `execute(command: C): void` method
   - `QueryHandler<Q extends Query, R>` with an `execute(query: Q): R` method
2. Implement `CommandBus`:
   - `register<C extends Command>(type: string, handler: CommandHandler<C>): void`
   - `dispatch(command: Command): void` — finds the handler by `command.type` and invokes it
3. Implement `QueryBus`:
   - `register<Q extends Query, R>(type: string, handler: QueryHandler<Q, R>): void`
   - `dispatch<R>(query: Query): R` — finds the handler by `query.type` and returns the result
4. Implement an example: a todo task management system
   - Commands: `CreateTodoCommand`, `CompleteTodoCommand`
   - Queries: `GetAllTodosQuery`, `GetTodoByIdQuery`
5. Handlers operate on a shared `Map<string, Todo>` store

## Checklist

- [ ] `Command`, `Query`, `CommandHandler`, `QueryHandler` interfaces are defined
- [ ] `CommandBus` registers and dispatches commands by type
- [ ] `QueryBus` registers and dispatches queries by type
- [ ] `dispatch` throws an error for an unregistered type
- [ ] Handlers for CreateTodo and CompleteTodo are implemented
- [ ] Handlers for GetAllTodos and GetTodoById are implemented
- [ ] Demo shows the full cycle: create → query → update → query

## How to Verify

1. Click the run button
2. Confirm that commands create and update tasks
3. Confirm that queries return up-to-date data after commands
4. Verify that the completed status of a task changes after CompleteTodoCommand
