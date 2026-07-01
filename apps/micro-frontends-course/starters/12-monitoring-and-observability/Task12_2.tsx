// Task 12.2 — Monitoring Config Builder
// Create an editable table for configuring monitoring parameters per MFE
// with automatic Error Budget calculation and JSON manifest generation.

// TODO: Implement the monitoring config builder with the following structure:
//
// INITIAL DATA (3 MFE configs):
//   { id: 'catalog', name: 'Catalog MFE', teamOwner: 'team-catalog', slo: 99.9,
//     alertChannel: 'PagerDuty', healthCheckUrl: 'https://cdn.example.com/catalog/health',
//     cbThreshold: 5, cbTimeoutSec: 30, cbResetTimeoutSec: 60 }
//   { id: 'cart',    name: 'Cart MFE',    teamOwner: 'team-cart',    slo: 99.95,
//     alertChannel: 'PagerDuty', healthCheckUrl: 'https://cdn.example.com/cart/health',
//     cbThreshold: 3, cbTimeoutSec: 20, cbResetTimeoutSec: 120 }
//   { id: 'profile', name: 'Profile MFE', teamOwner: 'team-profile', slo: 99.5,
//     alertChannel: 'Slack',    healthCheckUrl: 'https://cdn.example.com/profile/health',
//     cbThreshold: 10, cbTimeoutSec: 60, cbResetTimeoutSec: 300 }
//
// TABLE COLUMNS (9 columns):
//   1. MFE       — read-only, colored (#7dd3fc)
//   2. Team Owner — text input, required
//   3. SLO %     — number input, min=99, max=99.999, step=0.01
//   4. Error Budget — calculated: (100 - slo) shown as "%\nN мин/мес"
//                     formula: (100 - slo) / 100 * 43800 minutes
//                     color: red if < 0.05%, orange otherwise
//   5. Alert Channel — select: Slack / PagerDuty / Email
//   6. Health-Check URL — text input, must start with "http"
//   7. CB Threshold — number input, min=1 (errors before Open)
//   8. CB Open (сек) — number input, min=1 (seconds before Half-Open)
//   9. CB Reset (сек) — number input, min=1 (seconds in Half-Open before reset)
//
// VALIDATION RULES (highlight invalid fields with red border):
//   - teamOwner: must not be empty
//   - slo: must be >= 99
//   - healthCheckUrl: must start with "http"
//   - cbThreshold: must be > 0
//   Show validation error messages below the table for each invalid MFE
//
// GENERATE MANIFEST button:
//   Disabled when any validation error exists
//   Toggles JSON block visibility (Скрыть/Сгенерировать манифест)
//   Shows green success message when valid: "Валидация пройдена — все MFE настроены корректно"
//
// JSON MANIFEST structure:
//   {
//     "version": "1.0",
//     "generatedAt": "<ISO timestamp>",
//     "mfes": [
//       {
//         "name": "Catalog MFE",
//         "ownership": { "team": "team-catalog" },
//         "slo": {
//           "availability": 99.9,
//           "errorBudgetPercent": 0.1,
//           "errorBudgetMinPerMonth": 43.8
//         },
//         "alerting": { "channel": "PagerDuty", "threshold": "0.1% error rate" },
//         "healthCheck": { "url": "https://...", "intervalSec": 30 },
//         "circuitBreaker": { "errorThreshold": 5, "openTimeoutSec": 30, "halfOpenResetTimeoutSec": 60 }
//       },
//       ...
//     ]
//   }
//
// JSON block:
//   Header bar: "monitoring-manifest.json" label + "Копировать" / "Скопировано!" button
//   Pre block with syntax highlight color (#a5f3fc)
//   Max height 400px, scrollable
//
// STYLE: dark theme (#0f172a background), all styles inline, no CSS files

export function Task12_2() {
  return <div>Task 12.2</div>
}
