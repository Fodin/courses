import { useLanguage } from 'src/hooks'

// ============================================
// Task 6.3: Generic createStore — Provider + Hooks Factory
// Задание 6.3: Generic createStore — фабрика Provider + хуков
// ============================================
//
// Implement a factory function createStore<S, A> that
// creates a Provider, useStore (with selector) and useDispatch.
//
// Реализуйте фабричную функцию createStore<S, A>, которая
// создаёт Provider, useStore (с селектором) и useDispatch.
//
// Key idea: each component subscribes only to the needed
// slice of state via selector and re-renders only when it changes.
//
// Ключевая идея: каждый компонент подписывается только на нужный
// срез состояния через селектор и ре-рендерится только при его изменении.

// TODO: Implement createStore<S, A>(reducer, initialState)
// TODO: Реализуйте createStore<S, A>(reducer, initialState)
// Returns: { Provider, useStore, useDispatch }
// Возвращает: { Provider, useStore, useDispatch }
//
// function createStore<S, A>(
//   reducer: (state: S, action: A) => S,
//   initialState: S
// ) {
//   const StateCtx = createContext<S>(initialState)
//   const DispatchCtx = createContext<React.Dispatch<A>>(() => {})
//
//   const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const [state, dispatch] = useReducer(reducer, initialState)
//     return (
//       <StateCtx.Provider value={state}>
//         <DispatchCtx.Provider value={dispatch}>{children}</DispatchCtx.Provider>
//       </StateCtx.Provider>
//     )
//   }
//
//   function useStore<R>(selector: (state: S) => R): R {
//     return selector(useContext(StateCtx))
//   }
//
//   function useDispatch(): React.Dispatch<A> {
//     return useContext(DispatchCtx)
//   }
//
//   return { Provider, useStore, useDispatch }
// }

// TODO: Define types for Todo
// TODO: Определите типы для Todo
// interface Todo { id: string; text: string; done: boolean }
// interface TodoState { todos: Todo[]; filter: 'all' | 'active' | 'done' }
// type TodoAction = ADD | TOGGLE | REMOVE | SET_FILTER

// TODO: Implement todoReducer and initialTodoState (2-3 test tasks)
// TODO: Реализуйте todoReducer и initialTodoState (2-3 тестовые задачи)

// TODO: Create store via factory
// TODO: Создайте стор через фабрику
// const { Provider: TodoProvider, useStore: useTodoStore, useDispatch: useTodoDispatch }
//   = createStore(todoReducer, initialTodoState)

// TODO: Implement components with different selectors:
// TODO: Реализуйте компоненты с разными селекторами:
//
// TodoStats — subscribed to counters:
//   const total = useTodoStore(s => s.todos.length)
//   const done = useTodoStore(s => s.todos.filter(t => t.done).length)
//
// TodoStats — подписан на счётчики:
//   const total = useTodoStore(s => s.todos.length)
//   const done = useTodoStore(s => s.todos.filter(t => t.done).length)
//
// TodoFilters — subscribed only to filter:
//   const filter = useTodoStore(s => s.filter)
//
// TodoFilters — подписан только на filter:
//   const filter = useTodoStore(s => s.filter)
//
// TodoList — subscribed to filtered list:
//   const visible = useTodoStore(s => {
//     if (s.filter === 'active') return s.todos.filter(t => !t.done)
//     ...
//   })
//
// TodoList — подписан на отфильтрованный список:
//   const visible = useTodoStore(s => {
//     if (s.filter === 'active') return s.todos.filter(t => !t.done)
//     ...
//   })
//
// TodoAddForm — uses only dispatch (doesn't read state)
//
// TodoAddForm — использует только dispatch (не читает state)

export function Task6_3() {
  const { t } = useLanguage()
  return (
    // TODO: wrap in TodoProvider
    // TODO: оберните в TodoProvider
    <div className="exercise-container">
      <h2>{t('task.title')} 6.3</h2>
      <p style={{ color: '#888', fontStyle: 'italic' }}>
        Generic createStore: Provider + useStore + useDispatch factory
      </p>

      {/* TODO: place Todo app components */}
      {/* TODO: разместите компоненты Todo-приложения */}
      {/* Order: TodoStats, TodoFilters, TodoAddForm, TodoList */}
      {/* Порядок: TodoStats, TodoFilters, TodoAddForm, TodoList */}

      <div style={{ padding: '2rem', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center', color: '#999' }}>
        Here will be a Todo app based on createStore
      </div>
    </div>
  )
}
