# Task 1.2: ADR Builder

## Goal

Implement a step-by-step form for creating an Architecture Decision Record (ADR) — a formal document that captures an architectural decision for a microfrontend system.

## Requirements

1. Implement a step-by-step wizard with 6 steps and Back/Next navigation:
   - **Step 1:** Composition type (client-side, server-side, edge-side, build-time) — single choice
   - **Step 2:** Split strategy (vertical, horizontal, hybrid) — single choice
   - **Step 3:** Shared libraries (React, Router, Design System, State Manager, HTTP Client) — multiple choice
   - **Step 4:** Communication (Custom Events, Shared State, URL, Props/Callbacks) — multiple choice
   - **Step 5:** Deploy (independent, coordinated, monorepo) — single choice
   - **Step 6:** Result — generated ADR
2. On each step, show a brief description of each option (pros and cons)
3. The step navigation bar at the top shows completed steps with a checkmark
4. On the result step, detect and show conflicts between choices:
   - Server-side composition + Shared State → hydration problem
   - Build-time composition + independent deploys → contradiction
   - Shared State Manager + Vertical split → store competition
   - Shared State + independent deploys → version incompatibility
   - No shared React + client-side → bundle duplication
   - Horizontal split + independent deploys → layout team blockage
5. Generate an ADR document in Markdown format with sections: Title, Status, Context, Decision, Consequences
6. "Copy ADR" button copies text to clipboard and confirms the copy

## Checklist

- [ ] Step navigation works in both directions
- [ ] Completed steps are marked with a checkmark in the navigation bar
- [ ] Each selected option is visually highlighted (border + background)
- [ ] Steps 3 and 4 support multiple selection
- [ ] On the result step, conflicts are displayed in a warning block
- [ ] ADR document contains all sections and reflects the choices made
- [ ] "Copy ADR" button works and shows confirmation

## How to Check Yourself

- Select "server-side" and "Shared State" — a hydration warning should appear on the result step
- Select "build-time" and "independent" deploy — a contradiction warning should appear
- Complete all steps with consistent choices — no warnings should appear, ADR should reflect the choices
- Click "Copy ADR" — the button should confirm the copy
