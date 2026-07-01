// Task 6.2 — Import Map Constructor
// Build a visual tool for creating browser import maps (importmap.json).

// TODO: Implement the import map constructor with the following structure:
//
// DATA TYPES:
// - ImportEntry: { id: string, specifier: string, url: string }
// - ScopeEntry:  { id: string, scopePath: string, mappings: ImportEntry[] }
//
// STATE:
// - imports: ImportEntry[]       — global module mappings
// - scopes: ScopeEntry[]         — path-scoped mappings
// - errors: string[]             — validation error messages
// - tab: 'editor' | 'json' | 'html'
//
// PRESETS (button "Пресеты React/Router" adds these to imports if not already present):
// - react          → https://esm.sh/react@18.3.0
// - react-dom      → https://esm.sh/react-dom@18.3.0
// - react-dom/client → https://esm.sh/react-dom@18.3.0/client
// - react-router-dom → https://esm.sh/react-router-dom@6.22.0
//
// VALIDATION (run after every mutation, collect all errors into string[]):
// 1. Duplicate specifiers in global imports
// 2. Invalid URL in any import (use new URL() — if it throws, URL is invalid)
// 3. Scope path not starting with "/"
// 4. Duplicate specifiers within a single scope's mappings
// 5. Invalid URL in any scope mapping
//
// JSON GENERATION:
// - Build object: { imports?: {...}, scopes?: { "/path/": {...} } }
// - Only include imports key if imports array is non-empty
// - Only include scopes key if scopes array is non-empty
// - Use JSON.stringify(obj, null, 2) for formatting
//
// UI:
//
// TAB: Редактор
//   Section "imports":
//   - Button "Пресеты React/Router"
//   - List of existing imports (specifier, arrow, url, delete button)
//   - Form: specifier input + url input + "Добавить" button
//   - Mark invalid URL entries with ⚠ indicator
//
//   Section "scopes":
//   - Explanation text about what scopes do
//   - List of scope blocks (see below)
//   - Form: scope path input + "Добавить scope" button
//
//   Scope block:
//   - Header: scope path + "✕ удалить scope" button
//   - List of scope mappings (specifier → url, delete button each)
//   - Form: specifier input + url input + "+ маппинг" button
//
// TAB: importmap.json
//   - Show generated JSON in <pre> block
//   - Validation status: "✓ Валидный" or "✕ Есть ошибки"
//   - If no data: show comment "// Добавьте imports или scopes в редакторе"
//
// TAB: HTML тег
//   - Show: <script type="importmap">\n{json}\n</script>
//   - Information block with 4 rules about importmap usage
//   - If no data: show comment
//
// ERRORS:
//   - Show error block above tabs if errors.length > 0
//   - Red card with list of error messages
//
// All styles must be inline (no CSS files, no CSS modules)

export function Task6_2() {
  return <div>Task 6.2</div>
}
