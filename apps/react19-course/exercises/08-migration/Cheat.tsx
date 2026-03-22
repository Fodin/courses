// ============================================
// Task 8.1 Hint: React 18 App Audit
// ============================================
// Deprecated patterns to look for:
// 1. forwardRef() — replaced by ref as regular prop
// 2. useContext(Ctx) — replaced by use(Ctx)
// 3. React.lazy() string ref — use callback/object refs
// 4. Manual form state with useState + onSubmit — use useActionState
// 5. Manual optimistic updates — use useOptimistic
// 6. defaultProps on function components — use default parameters
// 7. propTypes — use TypeScript instead
// 8. Legacy context API — already deprecated, use createContext

// ============================================
// Task 8.2 Hint: Step-by-Step Migration
// ============================================
// Migration order:
// Step 1: Replace forwardRef with ref prop
//   Before: forwardRef((props, ref) => ...)
//   After:  function Comp({ ref, ...props }) { ... }
//
// Step 2: Replace useContext with use()
//   Before: const value = useContext(MyContext)
//   After:  const value = use(MyContext)
//
// Step 3: Replace manual form handling with useActionState
//   Before: const [state, setState] = useState(); onSubmit = (e) => { ... }
//   After:  const [state, action, pending] = useActionState(fn, initial)

// ============================================
// Task 8.3 Hint: Final Refactoring — Todo App
// ============================================
// Combine ALL React 19 features:
// 1. useActionState for form submission (add todo)
// 2. useOptimistic for instant UI feedback
// 3. use() for reading context
// 4. ref as prop for input focus
// 5. <title> for dynamic page title with todo count
// 6. Action functions with FormData

export function Task8_1_Hint() {
  return (
    <div className="exercise-container">
      <h2>Hint 8.1: React 18 Audit</h2>
      <ul>
        <li>Look for <code>forwardRef</code>, <code>useContext</code>, <code>defaultProps</code></li>
        <li>Check for manual <code>useState</code> + <code>onSubmit</code> patterns</li>
        <li>Look for legacy string refs and propTypes</li>
      </ul>
    </div>
  )
}

export function Task8_2_Hint() {
  return (
    <div className="exercise-container">
      <h2>Hint 8.2: Step-by-Step Migration</h2>
      <ul>
        <li>Start with <code>forwardRef</code> &rarr; ref prop (easiest)</li>
        <li>Then <code>useContext</code> &rarr; <code>use()</code></li>
        <li>Finally form handling &rarr; <code>useActionState</code></li>
      </ul>
    </div>
  )
}

export function Task8_3_Hint() {
  return (
    <div className="exercise-container">
      <h2>Hint 8.3: Full Migration</h2>
      <ul>
        <li>Build the Todo app incrementally</li>
        <li>Start with <code>useActionState</code> for the form</li>
        <li>Add <code>useOptimistic</code> for instant feedback</li>
        <li>Use <code>{'<title>'}</code> to show todo count in browser tab</li>
      </ul>
    </div>
  )
}
