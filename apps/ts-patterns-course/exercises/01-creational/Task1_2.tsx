import { useState } from 'react'

// ============================================
// Задание 1.2: Abstract Factory
// ============================================

// TODO: Create interface UIComponent with method render(): string

// TODO: Create Light theme classes implementing UIComponent:
//   LightButton(label: string) — render returns Light theme button description
//   LightInput(placeholder: string) — render returns Light theme input description
//   LightCard(title: string, content: string) — render returns Light theme card description

// TODO: Create Dark theme classes implementing UIComponent:
//   DarkButton(label: string) — render returns Dark theme button description
//   DarkInput(placeholder: string) — render returns Dark theme input description
//   DarkCard(title: string, content: string) — render returns Dark theme card description

// TODO: Create interface UIFactory with methods:
//   createButton(label: string): UIComponent
//   createInput(placeholder: string): UIComponent
//   createCard(title: string, content: string): UIComponent

// TODO: Create LightThemeFactory implementing UIFactory

// TODO: Create DarkThemeFactory implementing UIFactory

// TODO: Create function getFactory(theme: 'light' | 'dark'): UIFactory

export function Task1_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Iterate over ['light', 'dark'] themes
    // TODO: For each theme, get factory and create button, input, card
    // TODO: Call render() on each component and push to log
    // TODO: Show consistency guarantee message

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.2: Abstract Factory</h2>
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
