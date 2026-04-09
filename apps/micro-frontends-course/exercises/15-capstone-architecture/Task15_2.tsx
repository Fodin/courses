// Task 15.2 — Architecture Document Wizard
// Build a 6-step wizard that generates a complete ADR (Architecture Decision Record)
// for an MFE platform, with a checklist scoring the quality of decisions made.

// TODO: Implement the wizard with the following structure:
//
// WIZARD STATE (WizardState):
//   mfes: MfeEntry[]           — { name, domain, framework, team }
//   sharedDeps: SharedDepConfig[]  — { dep, strategy, singleton }
//   contracts: CommContract[]  — { from, to, event, payload }
//   routing: RoutingEntry[]    — { mfe, path, lazy }
//   deployConfigs: DeployConfig[]  — { mfe, strategy, rollback }
//   monitoring: MonitoringConfig[] — { mfe, slo, errorBoundary, circuitBreaker }
//
// PROGRESS BAR:
//   6 segments, each shows step number + label
//   Done steps: blue #1d4ed8, current: #3b82f6, future: #1e293b
//   Done steps show checkmark (✓) instead of number
//   Labels: MFE / Shared Deps / Contracts / Routing / Deploy / Monitoring
//
// STEP 1 — MFEs:
//   List of MfeEntry cards, each with 4 inputs: name, domain, framework (select), team
//   "Удалить" button per card
//   "+ Добавить MFE" button
//   FRAMEWORK_OPTIONS: 'React 18', 'Vue 3', 'Angular 17', 'Svelte 5', 'React 18 + Next.js'
//
// STEP 2 — Shared Dependencies:
//   SHARED_DEP_OPTIONS: 'react', 'react-dom', 'vue', 'rxjs',
//     '@company/ui-kit', '@company/utils', '@company/analytics', 'zustand', 'i18next'
//   Clickable tag buttons to add/remove deps
//   For each selected dep: show name + strategy select + singleton checkbox
//   strategy options: 'module-federation', 'import-map', 'cdn'
//
// STEP 3 — Communication Contracts:
//   Add contract: from MFE (select) → to MFE (select) + event input + payload input
//   event placeholder: "cart:add", payload placeholder: "{ productId: string, qty: number }"
//   Disabled if < 2 MFEs; show warning text
//
// STEP 4 — Routing:
//   Add route: MFE (select) → path (text input, purple monospace) + lazy checkbox
//   path placeholder: "/catalog"
//
// STEP 5 — Deploy:
//   "Автозаполнить все MFE" button: adds missing MFEs with default Blue/Green + rollback:true
//   For each config: MFE name + strategy select + rollback checkbox
//   DEPLOY_STRATEGIES: 'Blue/Green', 'Canary', 'Rolling', 'Feature Flags', 'Direct'
//
// STEP 6 — Monitoring:
//   "Автозаполнить все MFE" button: adds missing MFEs with default slo:'99.5%' + errorBoundary:true
//   For each entry: MFE name + SLO select + errorBoundary checkbox + circuitBreaker checkbox
//   SLO_OPTIONS: '99%', '99.5%', '99.9%', '99.95%', '99.99%'
//
// NAVIGATION:
//   "Назад" button (disabled on step 1)
//   "Далее →" button (steps 1-5)
//   "Сгенерировать ADR" button (step 6, green #059669)
//
// ADR DOCUMENT (shown after "Сгенерировать ADR"):
//   Left panel: monospace Markdown-formatted text, scrollable
//   Right panel: CHECKLIST (10 items), each with ✓/✗ and description
//
// CHECKLIST_ITEMS (10, each has a function to evaluate WizardState):
//   1. hasMfe — мfes.length >= 2
//   2. hasDomain — all mfes have domain
//   3. hasTeam — all mfes have team
//   4. hasSharedDeps — sharedDeps.length > 0
//   5. hasContracts — contracts.length > 0
//   6. hasRouting — routing.length > 0
//   7. hasDeploy — deployConfigs.length > 0
//   8. hasRollback — at least one deployConfig has rollback: true
//   9. hasMonitoring — monitoring.length > 0
//   10. hasErrorBoundary — all monitoring entries have errorBoundary: true
//
// SCORE DISPLAY: "X/10 чеклист" (green >= 8, yellow >= 5, red < 5)
// "Скопировать ADR" button: copies the text to clipboard
//
// ADR FORMAT (Markdown-like):
//   # Architecture Decision Record
//   ## MFE Platform Design
//   **Дата:** DD.MM.YYYY  **Статус:** Draft
//   ## 1. Микрофронтенды — list of "name (domain) — framework, команда: team"
//   ## 2. Shared Dependencies — list of "dep — стратегия: X, singleton"
//   ## 3. Communication Contracts — list of "event: from → to (payload: X)"
//   ## 4. Routing — list of "path → mfe (lazy)"
//   ## 5. Deploy Strategy — list of "mfe: strategy, auto rollback"
//   ## 6. Monitoring — list of "mfe: SLO X%, ErrorBoundary, CircuitBreaker"
//
// STYLE: dark theme #0f172a, all styles inline

export function Task15_2() {
  return <div>Task 15.2</div>
}
