// Task 15.3 — Decision Matrix: Technology Selection
// Build an interactive decision matrix with 4 real-world MFE architecture scenarios.
// For each scenario: choose a tech stack, reveal the expert recommendation, see your score.

// TODO: Implement the decision matrix with the following structure:
//
// SCENARIO type:
//   id: string
//   title: string
//   description: string
//   constraints: string[]       — list of requirements/constraints
//   expertChoice: TechChoice    — { integration, repoStructure, deployStrategy }
//   expertRationale: string     — explanation of expert choice
//   matchCriteria: (choice: TechChoice) => { score: number; feedback: string }
//
// TECH CHOICE options:
//
// INTEGRATION_OPTIONS (5):
//   'Module Federation (Webpack 5)'
//   'Single-SPA'
//   'Web Components (Custom Elements)'
//   'Module Federation + Single-SPA'
//   'Import Maps (native ESM)'
//
// REPO_OPTIONS (4):
//   'Monorepo (Nx)'
//   'Monorepo (Turborepo)'
//   'Monorepo (PNPM workspaces)'
//   'Polyrepo'
//
// DEPLOY_OPTIONS (5):
//   'Independent deploy (versioned URLs)'
//   'Canary + Feature Flags'
//   'Blue/Green'
//   'Synchronized releases'
//   'Rolling deploy'
//
// SCENARIOS (4):
//
//   1. id: 'startup' — "Стартап: быстрый рост"
//      3 команды, React-only, MVP в проде, нужен быстрый рост
//      expertChoice: { Module Federation (Webpack 5), Monorepo (Nx), Independent deploy (versioned URLs) }
//      matchCriteria: score 1 each for:
//        - MF (full 1) or MF+Single-SPA (0.5) for integration
//        - any Monorepo variant (1) for repo
//        - Independent deploy (1) or Canary (0.5) for deploy
//
//   2. id: 'bank' — "Банк: строгая безопасность"
//      10 команд, Angular + React, PCI DSS, строгая изоляция
//      expertChoice: { Web Components (Custom Elements), Polyrepo, Blue/Green }
//      matchCriteria: score 1 each for:
//        - Web Components (1) or MF+Single-SPA (0.5) for integration
//        - Polyrepo (1) for repo
//        - Blue/Green (1) or Rolling (0.5) for deploy
//
//   3. id: 'ecommerce' — "E-commerce: SEO и SSR"
//      5 команд, React, SEO критичен, SSR, CDN
//      expertChoice: { Module Federation (Webpack 5), Monorepo (Nx), Canary + Feature Flags }
//      matchCriteria: score 1 each for:
//        - MF (1) or MF+Single-SPA (0.5) for integration
//        - any Monorepo (1) for repo
//        - Canary + FF (1) or Blue/Green (0.5) for deploy
//
//   4. id: 'saas' — "SaaS: multi-tenant, white-label"
//      8 команд, React + Vue, runtime tenant customization, design tokens
//      expertChoice: { Module Federation + Single-SPA, Monorepo (Nx), Independent deploy (versioned URLs) }
//      matchCriteria: score 1 each for:
//        - MF + Single-SPA (1) or MF alone (0.5) for integration
//        - any Monorepo (1) for repo
//        - Independent deploy (1) or Canary+FF (0.5) for deploy
//
// UI LAYOUT:
//
//   SCENARIO TABS (horizontal):
//     4 buttons, active = blue, filled = green border + ✓ prefix
//
//   SCENARIO CARD (2 columns):
//     Left: description + constraints list (bullet points)
//     Right: 3 select dropdowns (integration, repoStructure, deployStrategy)
//            + "Показать экспертную рекомендацию" button (disabled until all 3 filled)
//
//   EXPERT RECOMMENDATION (shown after reveal, replaces button area or below it):
//     Background color: green (score=3), orange (score=2), red (score<=1)
//     Shows: score/3, feedback text, expert choices, rationale
//
//   TOTAL SCORE button (shown when all 4 scenarios filled):
//     Green button "Итоговый счёт"
//     Shows: X/12 total, label: "Архитектор уровня Senior" (>=10), "Хорошее понимание" (>=7), "Изучите теорию глубже" (<7)
//
// STYLE: dark theme #0f172a, all styles inline

export function Task15_3() {
  return <div>Task 15.3</div>
}
