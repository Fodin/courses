import { useState } from 'react'

// ============================================
// Задание 6.5: RBAC
// ============================================

// TODO: Реализуйте Role-Based Access Control (RBAC)
// TODO: Определите роли: admin, editor, viewer
// TODO: Создайте permissions map: { admin: ["*"], editor: ["read", "write"] }
// TODO: Реализуйте authorize("articles:write") middleware

export function Task6_5() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== RBAC ===')
    log.push('')

    // TODO: Определите иерархию ролей с наследованием разрешений
    // TODO: Реализуйте checkPermission(userRole, requiredPermission)
    // TODO: Создайте authorize(...permissions) middleware
    // TODO: Покажите комбинацию: authMiddleware -> authorize("admin") -> handler
    log.push('RBAC')
    log.push('  ... roles: { admin: ["*"], editor: ["read", "write"], viewer: ["read"] }')
    log.push('  ... authorize("articles:write") middleware')
    log.push('  ... router.delete("/users/:id", authorize("users:delete"), handler)')
    log.push('  ... 403 Forbidden: "Insufficient permissions"')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.5: RBAC</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
