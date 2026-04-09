# Task 6.2 — Import Map Builder

## Goal

Create a visual builder for `importmap.json` — the browser mechanism for managing module paths. The builder should support `imports` and `scopes` sections, generate ready-to-use JSON and HTML tag, and validate input data.

## Requirements

1. **Imports** section — list of global mappings (specifier → URL):
   - Add form with fields: specifier and URL
   - "React/Router Presets" button adds 4 entries: react, react-dom, react-dom/client, react-router-dom from esm.sh
   - Each entry can be deleted
2. **Scopes** section — list of scopes with local mappings:
   - Add form for scope path (e.g. `/app-cart/`)
   - Inside each scope — add form for mappings (specifier → URL)
   - Scopes and individual mappings can be deleted
3. Three tabs:
   - **Editor** — visual management of imports and scopes
   - **importmap.json** — generated JSON in real time
   - **HTML tag** — ready `<script type="importmap">` with JSON inside
4. Validation with error display:
   - URL must be valid (parses via `new URL()`)
   - Specifier must not duplicate within a single section
   - Scope path must start with `/`
5. On "HTML tag" tab — information block with importmap usage rules

## Checklist

- [ ] Can add entry to imports via form or via presets
- [ ] Can delete any entry from imports
- [ ] Can add scope with arbitrary path
- [ ] Inside scope, mappings can be added and removed
- [ ] JSON on "importmap.json" tab updates after every change
- [ ] HTML tag on "HTML tag" tab updates after every change
- [ ] Error appears on invalid URL
- [ ] Error appears on duplicate specifier
- [ ] Error appears on scope path without leading `/`
- [ ] When no data, tabs show a hint

## How to Check Yourself

1. Click "React/Router Presets" → 4 entries appear in imports, JSON on tab updates
2. Add scope `/app-legacy/` with mapping `lodash → https://esm.sh/lodash@3.10.1`
3. Switch to "importmap.json" tab → JSON should contain both `imports` and `scopes` sections
4. Switch to "HTML tag" tab → should be a valid `<script type="importmap">`
5. Add entry with invalid URL (e.g. `not-a-url`) → error message should appear
6. Add duplicate specifier `react` → duplicate error should appear
7. Delete all entries → JSON and HTML tabs show a hint

## Hints

- URL check: `try { new URL(s); return true } catch { return false }`
- Scope path without leading `/` — common mistake; warn explicitly
- Use counter for unique record IDs (`let uid = 0; const nextId = () => String(++uid)`)
- JSON generated dynamically: if imports empty — don't include `imports` key in JSON (clean output)
- `Object.fromEntries(entries.map(e => [e.specifier, e.url]))` — convenient way to convert mapping array to object
