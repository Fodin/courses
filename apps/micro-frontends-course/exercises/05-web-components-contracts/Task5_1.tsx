// Task 5.1 — Shadow DOM Isolation Visualizer
// Show how Shadow DOM isolates styles while CSS Custom Properties and CustomEvents cross the boundary.

// TODO: Implement the Shadow DOM isolation visualizer with 4 tabs:
//
// TAB 1 — "Стили" (Styles):
// - Two side-by-side blocks: "Light DOM" (no shadow) and "Shadow DOM" (with attachShadow)
// - Control panel with buttons to change: text color (3+ options), background (3+ options), font size
// - Light DOM block: reacts to global style changes via inline styles
// - Shadow DOM block: attached via useRef + attachShadow({ mode: 'open' }) on mount
//   The shadow block IGNORES global style changes — show this visually
// - DOM tree visualization for both blocks (host → shadow-root → children)
//
// TAB 2 — "CSS Custom Properties":
// - Color pickers to set --mf-primary and --mf-accent on the shadow host element
// - Shadow DOM block shows the vars are applied (via style.setProperty on host)
// - Code snippet showing the CSS contract (var(--name, default) pattern)
//
// TAB 3 — "Слоты" (Slots):
// - Text input for user to type slot content
// - Shadow DOM template has a default <slot> and a <slot name="footer">
// - Show the slot content rendered inside the Shadow DOM visually
// - Show a code example of how slot projection works
//
// TAB 4 — "События" (Events):
// - Button: "Dispatch from Shadow DOM" — dispatches CustomEvent with composed: true
// - Button: "Dispatch from Light DOM" — dispatches CustomEvent with composed: false
// - Event log (dark terminal style) showing: timestamp, source, event name, detail
// - Log auto-scrolls to bottom on new events
// - Code snippets showing dispatchEvent and addEventListener patterns
//
// Implementation notes:
// - Create the actual ShadowRoot using useRef<HTMLDivElement> + useEffect (attachShadow once on mount)
// - CSS Custom Properties: use host.style.setProperty('--mf-primary', value)
// - All styles inline (no CSS files)

export function Task5_1() {
  return <div>Task 5.1</div>
}
