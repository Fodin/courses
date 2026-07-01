import { useState } from 'react'

// Task 1.1: MFE Topology Visualizer
//
// Build an interactive tool that shows how a page is divided between teams
// under different micro-frontend split strategies.
//
// Requirements:
// 1. Display a page map with 5 zones: Header, Nav/Sidebar, Content Main, Content Aside, Footer
// 2. Each zone has a dropdown to assign a team
//    Teams: Team Catalog, Team Cart, Team User, Team Search, (unassigned)
// 3. A mode switcher: "Vertical Split" and "Horizontal Split"
//    - When switched, apply a preset that illustrates the approach:
//      Vertical: one team owns multiple related zones (e.g. Catalog owns Header + Content Main)
//      Horizontal: teams divide by layer (e.g. User team owns Header + Nav + Footer)
// 4. Show a stats table: team → number of zones → list of zones
// 5. Validate the configuration and show warnings:
//    - In horizontal mode: Header and Footer owned by different teams
//    - In vertical mode: a team owns more than 2 zones
//    - No zones assigned at all
// 6. When configuration is consistent, show a green confirmation message
//
// Tips:
// - Define a Zone interface: { id, label, row, col, colSpan? }
// - Define a Team interface: { id, name, color, domain }
// - Use an assignments array: { zoneId, teamId }[]
// - Use CSS grid (gridTemplateColumns: '1fr 1.8fr 1fr') for the page map
// - Apply team color as border + light background tint to each zone
//
// Vertical preset example:
//   header → 'team-catalog', nav → 'team-search', content-main → 'team-catalog'
//   content-aside → 'team-cart', footer → 'team-user'
// Horizontal preset example:
//   header → 'team-user', nav → 'team-user', content-main → 'team-catalog'
//   content-aside → 'team-catalog', footer → 'team-user'

// TODO: Define Zone and Team interfaces

// TODO: Define ZONES array with grid positions

// TODO: Define TEAMS array with colors

// TODO: Define VERTICAL_PRESETS and HORIZONTAL_PRESETS

// TODO: Implement getTeam(id) helper

// TODO: Implement getZoneProblems(assignments, mode) → string[]

export function Task1_1() {
  // TODO: useState for mode: 'vertical' | 'horizontal'
  // TODO: useState for assignments: { zoneId, teamId }[]

  // TODO: applyPreset(newMode) — updates mode and applies preset assignments

  // TODO: assign(zoneId, teamId) — updates a single zone assignment

  return (
    <div className="exercise-container" style={{ padding: '1.5rem' }}>
      <h2>Визуализатор топологии MFE</h2>

      {/* TODO: Render mode switcher buttons */}

      {/* TODO: Render mode description */}

      {/* TODO: Render page map grid (CSS grid, 3 columns) */}
      {/* Each cell: colored border + team badge + select dropdown */}

      {/* TODO: Render stats table: team → zones count → zone names */}

      {/* TODO: Render warnings or success message */}
    </div>
  )
}
