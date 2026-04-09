// Task 13.2 — Migration Plan Constructor
// Build an interactive tool: input domain characteristics, get automatic priority ranking,
// generate a visual migration roadmap with phases, risks and recommendations.

// TODO: Implement the migration plan constructor with the following structure:
//
// DATA — 6 pre-defined domains (PlanDomain type):
//   { id, name, size: 'S'|'M'|'L'|'XL', apiDeps: number (0-20),
//     sharedState: number (0-10), criticality: 'low'|'medium'|'high'|'critical',
//     changeFreq: 'rare'|'monthly'|'weekly'|'daily' }
//
//   Аналитика: S, apiDeps 1, sharedState 0, criticality low,    changeFreq rare
//   Профиль:   S, apiDeps 2, sharedState 1, criticality low,    changeFreq monthly
//   Каталог:   L, apiDeps 5, sharedState 2, criticality high,   changeFreq daily
//   Корзина:   M, apiDeps 4, sharedState 3, criticality high,   changeFreq weekly
//   Оформление:L, apiDeps 8, sharedState 4, criticality critical, changeFreq weekly
//   Админка:   XL,apiDeps 12,sharedState 6, criticality medium, changeFreq monthly
//
// SIZE labels: S → "~5K LOC", M → "~15K LOC", L → "~40K LOC", XL → "~100K LOC"
//
// PRIORITY SCORE formula (higher = extract earlier):
//   freqScore:  daily→40, weekly→30, monthly→15, rare→5
//   critScore:  low→30, medium→20, high→10, critical→0
//   sizeScore:  S→20, M→15, L→5, XL→0
//   penalty:    (apiDeps + sharedState) * 2
//   total:      freqScore + critScore + sizeScore - penalty
//
// DOMAIN TABLE (sorted by score descending):
//   Columns: Домен | Размер (select) | API-зав. (number input 0-20) | Shared state (number 0-10) |
//            Критичность (select) | Изменения (select) | Приоритет (bar + score) | × (remove)
//   - First row (highest score): show 🥇 icon next to name, bold font
//   - Priority bar: width = score/maxScore * 100%, color: >66% → #22c55e, >33% → #fbbf24, else #ef4444
//   - Row background for top domain: rgba(34,197,94,0.05)
//   - Any change to inputs: clear roadmap (set to null)
//
// ADD DOMAIN:
//   - Text input + "Добавить" button, Enter key also works
//   - New domain defaults: size M, apiDeps 2, sharedState 1, criticality medium, changeFreq monthly
//
// GENERATE BUTTON:
//   - "Сгенерировать Migration Roadmap"
//   - Disabled if domains list is empty
//
// ROADMAP GENERATION (split sorted domains into 3 phases):
//   phase 1: first ceil(n/3) domains (highest priority)
//   phase 2: next batch
//   phase 3: remaining
//
//   For each phase determine complexity:
//     'высокая' if any domain has (criticality critical OR high) AND (apiDeps > 6 OR sharedState > 3)
//     'средняя' if any domain has criticality critical/high OR apiDeps > 6 OR sharedState > 3 OR size XL/L
//     'низкая' otherwise
//
//   Risks (add if applicable):
//     - Critical/high criticality in phase 1 → "Критичный домен в первой фазе — высокий риск"
//     - apiDeps > 6 OR sharedState > 3 → "Высокое число зависимостей — сложная декуплинг-работа"
//     - size XL or L → "Крупный домен — длительная миграция"
//     - No risks → "Риски минимальны"
//
//   Recommendations:
//     - Critical/high in phase 1 → "Рассмотрите перенос в более позднюю фазу"
//     - High deps → "Выделите shared-сервисы до начала фазы"
//     - Large size → "Разбейте домен на поддомены перед извлечением"
//     - No crit+deps → "Идеальный кандидат для пилотного MFE"
//     - Phase 1 always → "Начните с настройки shell и Module Federation инфраструктуры"
//
//   Weeks estimate: S→2, M→4, L→8, XL→14 (sum for all domains in phase)
//
// TIMELINE:
//   Horizontal flex row, each phase block flex: phase.weeks (proportional width)
//   Colors: низкая → #052e16 bg / #22c55e border, средняя → #422006 / #fbbf24, высокая → #450a0a / #ef4444
//
// PHASE CARDS (below timeline):
//   - Phase title + complexity badge + weeks estimate
//   - Domain name tags
//   - Risks section (⚠️ label, red)
//   - Recommendations section (💡 label, green)
//   - Left border color = complexity color
//
// TOTAL WEEKS: shown as badge next to "Migration Roadmap" heading
//
// FORMULA NOTE: small text below roadmap explaining the scoring formula
//
// STYLE: dark theme #0f172a background, all styles inline, no CSS files

export function Task13_2() {
  return <div>Task 13.2</div>
}
