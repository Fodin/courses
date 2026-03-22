export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Level 0: Setup & Breaking Changes — Hints</h2>

      <h3>Task 0.1: Upgrading to React 19</h3>
      <ul>
        <li>Update <code>react</code> and <code>react-dom</code> to version 19</li>
        <li>Update <code>@types/react</code> and <code>@types/react-dom</code> to latest</li>
        <li>Run <code>npm install react@19 react-dom@19</code></li>
        <li>Check for peer dependency warnings after upgrade</li>
        <li>Show both old versions (^18.x) and new versions (^19.x)</li>
      </ul>

      <h3>Task 0.2: React Codemod</h3>
      <ul>
        <li>Run <code>npx codemod@latest react/19/migration-recipe</code></li>
        <li>Codemod handles: removing deprecated APIs, updating imports</li>
        <li>Key transforms: <code>ReactDOM.render</code> → <code>createRoot</code>, string refs → callback refs</li>
        <li>Always review codemod output before committing</li>
      </ul>

      <h3>Task 0.3: Breaking Changes</h3>
      <ul>
        <li><code>defaultProps</code> for function components → use JS default parameters</li>
        <li><code>propTypes</code> → use TypeScript</li>
        <li>String refs → <code>useRef</code> / callback refs</li>
        <li>Legacy Context (<code>contextTypes</code>) → <code>createContext</code></li>
        <li><code>ReactDOM.render</code> → <code>createRoot().render()</code></li>
        <li><code>ReactDOM.hydrate</code> → <code>hydrateRoot()</code></li>
        <li>Implicit children in props type removed</li>
      </ul>
    </div>
  )
}
