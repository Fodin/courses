import { useState } from 'react'

// Task 0.1: Monolith vs Micro-frontends Visualizer
//
// Build an interactive visualizer that compares the deploy pipeline
// and team dynamics of a monolithic frontend vs micro-frontends.
//
// Requirements:
// 1. Two tabs: "Монолит" and "Микрофронтенды"
// 2. "Добавить команду" button (up to 6 teams). Each team gets a unique color.
// 3. "Внести изменение" button — adds a random commit to a random team.
//    In monolith mode: simulate merge conflicts (probability grows with team count).
// 4. "Задеплоить" button — shows deploy time.
//    Monolith deploy time grows with team count and conflict count.
//    MFE deploy time stays ~constant (~3-5 min per team).
// 5. Display metrics: total changes, merge conflicts count, teams count.
// 6. Monolith tab: show growing CI time, block risk %, conflict warnings.
// 7. MFE tab: show independent pipelines per team, stable deploy time.
// 8. Deploy comparison bar chart: monolith vs MFE times side-by-side.
//
// Tips:
// - Use useState for teams[], changes[], deployLog[], isDeploying
// - Conflict probability formula: teams > 2 ? 0.3 + teams * 0.07 : 0.1
// - Monolith deploy: 5 + teamsCount * 4 + conflictsCount * 8 (minutes)
// - MFE deploy: 3 + random(0-2) (minutes, independent of team count)

// TODO: Define Team interface { id, name, color, feature }

// TODO: Define Change interface { id, teamId, description, timestamp, hasConflict }

// TODO: Create TEAM_COLORS array with 6 distinct colors (blues, greens, oranges, purples, reds)

// TODO: Create TEAM_NAMES array ['Team Alpha', 'Team Beta', ...]

// TODO: Create CHANGE_DESCRIPTIONS array with 8 realistic commit messages

export function Task0_1() {
  // TODO: useState for teams (start with 1 team)
  // TODO: useState for changes
  // TODO: useState for deployLog: { time, isMfe, label }[]
  // TODO: useState for isDeploying
  // TODO: useState for activeTab: 'monolith' | 'mfe'

  // TODO: Compute conflictsCount from changes

  // TODO: addTeam() — appends a new team (max 6)

  // TODO: addChange() — creates a change for a random team, with random conflict flag

  // TODO: simulateDeploy() — sets isDeploying, after 1s adds to deployLog

  // TODO: reset() — resets all state

  return (
    <div className="exercise-container" style={{ padding: '1.5rem' }}>
      <h2>Визуализатор: монолит vs микрофронтенды</h2>

      {/* TODO: Render control buttons */}

      {/* TODO: Render teams row */}

      {/* TODO: Render stats row (changes count, conflicts, teams) */}

      {/* TODO: Render tab switcher */}

      {/* TODO: Render active tab content (MonolithView or MfeView) */}

      {/* TODO: Render deploy time bar chart */}

      {/* TODO: Render changes feed */}

      {/* TODO: Render deploy log */}
    </div>
  )
}
