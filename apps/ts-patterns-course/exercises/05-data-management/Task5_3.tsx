import { useState } from 'react'

// ============================================
// Задание 5.3: CQRS (CommandBus и QueryBus)
// ============================================

// TODO: Define interface Command with field: type: string
// TODO: Define interface Query with field: type: string

// TODO: Define interface CommandHandler<C extends Command> with:
//   execute(command: C): void

// TODO: Define interface QueryHandler<Q extends Query, R> with:
//   execute(query: Q): R

// TODO: Create class CommandBus
//   - private handlers = new Map<string, CommandHandler<Command>>()
//   - register<C extends Command>(type: string, handler: CommandHandler<C>): void
//   - dispatch(command: Command): void
//     Find handler by command.type, throw Error if not found

// TODO: Create class QueryBus
//   - private handlers = new Map<string, QueryHandler<Query, unknown>>()
//   - register<Q extends Query, R>(type: string, handler: QueryHandler<Q, R>): void
//   - dispatch<R>(query: Query): R
//     Find handler by query.type, throw Error if not found

interface Todo {
  id: string
  title: string
  completed: boolean
}

// TODO: Define CreateTodoCommand extends Command
//   type: 'CreateTodo', id: string, title: string

// TODO: Define CompleteTodoCommand extends Command
//   type: 'CompleteTodo', id: string

// TODO: Define GetAllTodosQuery extends Query
//   type: 'GetAllTodos'

// TODO: Define GetTodoByIdQuery extends Query
//   type: 'GetTodoById', id: string

// TODO: Implement CreateTodoHandler (CommandHandler<CreateTodoCommand>)
//   constructor(store: Map<string, Todo>)
//   execute: create Todo { id, title, completed: false } in store

// TODO: Implement CompleteTodoHandler (CommandHandler<CompleteTodoCommand>)
//   constructor(store: Map<string, Todo>)
//   execute: find todo by id, set completed = true

// TODO: Implement GetAllTodosHandler (QueryHandler<GetAllTodosQuery, Todo[]>)
//   constructor(store: Map<string, Todo>)
//   execute: return Array.from(store.values())

// TODO: Implement GetTodoByIdHandler (QueryHandler<GetTodoByIdQuery, Todo | undefined>)
//   constructor(store: Map<string, Todo>)
//   execute: return store.get(query.id)

export function Task5_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Create todoStore = new Map<string, Todo>()

    // TODO: Create commandBus and queryBus
    // TODO: Register all 4 handlers

    // TODO: Dispatch CreateTodoCommand for 3 todos:
    //   t1: "Learn TypeScript"
    //   t2: "Learn CQRS"
    //   t3: "Build a project"
    // Log each dispatch

    // TODO: Query all todos via GetAllTodos, log each [x] or [ ] with title

    // TODO: Dispatch CompleteTodoCommand for "t1"

    // TODO: Query todo "t1" via GetTodoById, log its completed status

    // TODO: Query all todos again, log updated state

    // TODO: Try dispatching unknown command type, catch and log error

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.3: CQRS</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
