// Task 7.1 — Navigation Simulator between MFEs
// Build an interactive browser simulator showing how Shell-Router coordinates
// navigation across multiple MFEs, including pushState conflict visualization.

// TODO: Implement the navigation simulator with the following structure:
//
// DATA:
// - 4 shell routes: Home (/), Catalog (/catalog), Cart (/cart), Profile (/profile)
// - 3 MFEs with internal routes:
//   - catalog: /catalog, /catalog/search, /catalog/:id
//   - cart:    /cart, /cart/checkout, /cart/confirm
//   - profile: /profile, /profile/orders, /profile/settings
// - MFE colors: catalog=#2196f3, cart=#ff9800, profile=#9c27b0
//
// STATE:
// - currentUrl: string — current browser URL (initial: '/')
// - activeMFE: 'catalog' | 'cart' | 'profile' | null — mounted MFE
// - log: NavLogEntry[] — navigation event log
// - conflictVisible: boolean — show conflict warning block
// - deepLinkInput: string — text input for deep link URL
// - showDeepLink: boolean — show/hide the deep link form
//
// LOG ENTRY TYPES AND COLORS:
// - 'shell'    → green  (#4caf50) — Shell navigation decisions
// - 'mfe'      → blue   (#2196f3) — MFE mounted/unmounted/internal navigate
// - 'conflict' → orange (#ff9800) — race condition events
// - 'deeplink' → purple (#9c27b0) — deep link processing
// - 'error'    → red    (#f44336) — errors and conflicts result
//
// BEHAVIORS:
//
// Shell navigation click (navigateShell):
//   1. Update currentUrl to route.path
//   2. Set activeMFE to route.mfe
//   3. Log: "Shell: navigate to /path"
//   4. If previous MFE was different: log "prevMFE MFE: unmounted"
//   5. If new route has MFE: log "mfe MFE: mounted, базовый путь = /path"
//   6. Hide conflict block
//
// Internal route click (navigateInternal):
//   1. Update currentUrl to internal route path
//   2. Log: "mfe MFE: internal navigate to /path"
//
// "Конфликт!" button (simulateConflict):
//   1. Set conflictVisible = true
//   2. Log (conflict): "Cart MFE: попытка pushState → /cart/checkout"
//   3. Log (conflict): "Catalog MFE: попытка pushState → /catalog/42 (ОДНОВРЕМЕННО!)"
//   4. Log (error): explanation of race condition result
//
// "Deep link" button:
//   - Toggle showDeepLink form visibility
//   When confirmed (handleDeepLink):
//   1. Parse path from input (default: '/catalog/search')
//   2. Determine MFE from path prefix (/catalog→catalog, /cart→cart, /profile→profile)
//   3. Update currentUrl and activeMFE
//   4. Log (deeplink): "Deep link: входящий URL = /path"
//   5. Log (shell): "Shell: распознал MFE = mfe, активирует маршрут /base"
//   6. Log (mfe): "mfe MFE: mounted с initialPath = /path"
//   7. Log (mfe): "mfe MFE: internal router восстановил состояние для /path"
//
// UI LAYOUT:
//
// 1. ADDRESS BAR (top):
//    - Label "URL" + monospace text "http://app.example.com{currentUrl}"
//    - Colored badge "{activeMFE} MFE активен" (only when activeMFE !== null)
//
// 2. LEFT COLUMN (fixed ~220px wide):
//    a) Shell navigation panel (green border):
//       - Title "Shell (host)"
//       - Button for each shell route (highlighted when active)
//    b) MFE internal routes panel (appears only when activeMFE !== null):
//       - Title "{activeMFE} MFE (internal routes)"
//       - Button for each internal route showing path + label
//    c) Action buttons:
//       - "Конфликт!" (orange) — triggers simulateConflict
//       - "Deep link" (purple) — toggles showDeepLink
//    d) Deep link form (when showDeepLink):
//       - Text input for URL
//       - Quick-select buttons for example URLs
//       - "Перейти" button
//
// 3. RIGHT COLUMN (fills remaining space):
//    a) Conflict block (when conflictVisible):
//       - Orange bordered card with explanation
//       - Solution hint (green text)
//    b) Log color legend (5 small color squares + labels)
//    c) Log panel (scrollable, dark background, monospace font):
//       - Each entry: time (grey) + message (colored left border)
//       - Auto-scroll to bottom on new entry
//    d) "Очистить лог" button
//
// All styles must be inline (no CSS files, no CSS modules)

export function Task7_1() {
  return <div>Task 7.1</div>
}
