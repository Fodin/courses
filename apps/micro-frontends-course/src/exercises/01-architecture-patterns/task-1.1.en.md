# Task 1.1: MFE Topology Visualizer

## Goal

Build an interactive tool that visually shows how a page is divided between teams with different microfrontend split strategies.

## Requirements

1. Display a page map with 5 zones: Header, Nav/Sidebar, Content Main, Content Aside, Footer
2. Each zone has a dropdown to assign a team (Team Catalog, Team Cart, Team User, Team Search, Unassigned)
3. Add a mode switch: **Vertical Split** and **Horizontal Split**
4. When switching modes, apply preset assignments that illustrate the difference between approaches:
   - Vertical: one team owns multiple related zones
   - Horizontal: teams split the page by layers
5. Display a table: team → number of zones → list of zones
6. Analyze the current distribution and show warnings for problematic configurations:
   - Header and Footer assigned to different teams (horizontal split)
   - A team owns more than 2 zones (vertical split)
   - No assignments at all
7. Show a green confirmation for a consistent configuration

## Checklist

- [ ] The page map with 5 zones visually resembles a real page layout (header at top, footer at bottom)
- [ ] The dropdown in each zone changes border color and background according to the team color
- [ ] The Vertical/Horizontal switch changes the preset assignments
- [ ] The statistics table updates on every assignment change
- [ ] Warnings appear for conflicting assignments
- [ ] The component requires no props, works entirely on useState

## How to Check Yourself

- Assign different teams to Header and Footer in Horizontal mode — a warning should appear
- Assign one team to all 5 zones in Vertical mode — a warning about domain boundary violation should appear
- Switch between modes — presets should clearly show the difference between approaches
- Remove all assignments — a warning about missing assignments should appear
