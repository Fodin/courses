import { useLanguage } from 'src/hooks'

// ============================================
// Задание 6.3: Generic createStore — фабрика Provider + хуков
// ============================================
//
// Реализуйте фабричную функцию createStore<S, A>, которая
// создаёт Provider, useStore (с селектором) и useDispatch.
//
// Ключевая идея: каждый компонент подписывается только на нужный
// срез состояния через селектор и ре-рендерится только при его изменении.

// TODO: Реализуйте createStore<S, A>(reducer, initialState)
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

// TODO: Определите типы для Todo
// interface Todo { id: string; text: string; done: boolean }
// interface TodoState { todos: Todo[]; filter: 'all' | 'active' | 'done' }
// type TodoAction = ADD | TOGGLE | REMOVE | SET_FILTER

// TODO: Реализуйте todoReducer и initialTodoState (2-3 тестовые задачи)

// TODO: Создайте стор через фабрику
// const { Provider: TodoProvider, useStore: useTodoStore, useDispatch: useTodoDispatch }
//   = createStore(todoReducer, initialTodoState)

// TODO: Реализуйте компоненты с разными селекторами:
//
// TodoStats — подписан на счётчики:
//   const total = useTodoStore(s => s.todos.length)
//   const done = useTodoStore(s => s.todos.filter(t => t.done).length)
//
// TodoFilters — подписан только на filter:
//   const filter = useTodoStore(s => s.filter)
//
// TodoList — подписан на отфильтрованный список:
//   const visible = useTodoStore(s => {
//     if (s.filter === 'active') return s.todos.filter(t => !t.done)
//     ...
//   })
//
// TodoAddForm — использует только dispatch (не читает state)

export function Task6_3() {
  const { t } = useLanguage()
  return (
    // TODO: оберните в TodoProvider
    <div className="exercise-container">
      <h2>{t('task.title')} 6.3</h2>
      <p style={{ color: '#888', fontStyle: 'italic' }}>
        Generic createStore: фабрика Provider + useStore + useDispatch
      </p>

      {/* TODO: разместите компоненты Todo-приложения */}
      {/* Порядок: TodoStats, TodoFilters, TodoAddForm, TodoList */}

      <div style={{ padding: '2rem', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center', color: '#999' }}>
        Здесь будет Todo-приложение на основе createStore
      </div>
    </div>
  )
}
