# Task 4.3 — Decision Matrix: Module Federation vs Single-SPA

## Goal

Create an interactive decision matrix that helps an architect choose the right tool for an MFE project based on a set of criteria. The result — an automated recommendation with trade-off explanations.

## Requirements

1. At least 8 project criteria, each with 3 answer options (radio buttons):
   - Runtime code sharing: no / partial / yes
   - Number of frameworks: one / 2-3 / many
   - Strict isolation: no / partial / yes
   - Team size: 1-3 / 3-10 / 10+
   - Independent deploy: not critical / desirable / critical
   - Legacy code: none / some / lots
   - Unified routing: no / partial / yes
   - Infrastructure budget: minimal / medium / large

   Each option has numeric scores (0-3) for three tools:
   - Module Federation
   - Single-SPA
   - Combination of both

2. Each criterion is displayed as a card with:
   - Title and brief description
   - Radio buttons with option labels
   - Highlighted selected option

3. Results panel (next to or below):
   - Horizontal progress bars for each tool (sorted by descending score)
   - Format: `Tool  X/MAX ████████░░`

4. Recommendation block — the winner with the highest score:
   - Name of the recommended tool
   - Reasoning text (why it fits this profile)
   - List of 3 trade-offs (what to watch for)

5. Reference table of key differences Module Federation vs Single-SPA:
   - Aspect / Module Federation / Single-SPA
   - Rows: Purpose, Coupling, Frameworks, Config, Legacy

6. Results update instantly when any radio button changes (no "Calculate" button).

## Checklist

- [ ] At least 8 criteria with clear descriptions
- [ ] Radio buttons work, selected option is visually highlighted
- [ ] Scores are calculated automatically on every change
- [ ] Progress bars update with animated transitions (CSS transition)
- [ ] Recommendation changes when criteria change
- [ ] Trade-offs match the recommended tool
- [ ] Reference table is displayed

## How to Check Yourself

- Select "Many frameworks + Legacy code" → Single-SPA should score higher
- Select "One framework + Lots of shared code" → Module Federation should win
- Select a mixed profile (large team + lots of code + different frameworks) → should recommend a combination

## Hint

The winner selection function should compare three values. In case of a tie (equal scores for multiple tools), preference can be given to the combination as the most flexible option. Implement the progress bar via `width: ${(value / max) * 100}%` and `transition: width 0.4s ease`.
