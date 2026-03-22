// ============================================
// ПОДСКАЗКИ — Уровень 2: use() hook
// ============================================

// ---- Task 2.1 ----
// Создайте промис ВНЕ компонента (кэшируйте!):
//
// const dataPromise = fetch('/api/data').then(r => r.json())
//
// Внутри компонента:
// const data = use(dataPromise)
//
// Оберните в Suspense:
// <Suspense fallback={<p>Загрузка...</p>}>
//   <DataComponent />
// </Suspense>

// ---- Task 2.2 ----
// use() работает как useContext, но это не хук:
//
// const ThemeContext = createContext('light')
//
// function MyComponent() {
//   const theme = use(ThemeContext)
//   return <div>{theme}</div>
// }

// ---- Task 2.3 ----
// use() можно вызывать условно:
//
// function MyComponent({ shouldUseTheme }) {
//   if (shouldUseTheme) {
//     const theme = use(ThemeContext)
//     return <div>{theme}</div>
//   }
//   return <div>Default</div>
// }

// ---- Task 2.4 ----
// Полный паттерн:
//
// class ErrorBoundary extends Component {
//   state = { error: null }
//   static getDerivedStateFromError(error) { return { error } }
//   render() {
//     if (this.state.error) return <p>Ошибка!</p>
//     return this.props.children
//   }
// }
//
// <ErrorBoundary>
//   <Suspense fallback={<p>Загрузка...</p>}>
//     <DataComponent />
//   </Suspense>
// </ErrorBoundary>

export {}
