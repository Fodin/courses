import { useState } from 'react'

// TODO: Define an interface for an RMM level
// Each level: level (0-3), name, color, description, example (scenario + request + response), characteristics[]

// TODO: Create data for all 4 RMM levels (0, 1, 2, 3)
// Level 0: one endpoint, action in body/query
// Level 1: separate resource URLs, but still POST for everything
// Level 2: correct HTTP methods + status codes (the standard!)
// Level 3: HATEOAS — responses include _links with available actions

// TODO: Define an interface for a quiz item
// Each item: code (HTTP example), answer (0-3), hint (explanation)

// TODO: Create at least 3 quiz items — HTTP snippets to classify by RMM level

export function Task0_2() {
  // TODO: State for the currently active level (default: 2)
  const [activeLevel, setActiveLevel] = useState<number>(2)

  // TODO: State for quiz answers: Record<number, number | null>
  // Key = question index, Value = chosen level or null

  // TODO: Compute count of correct quiz answers

  return (
    <div className="exercise-container" style={{ padding: '1rem' }}>
      <h2>Richardson Maturity Model: 4 уровня зрелости REST</h2>

      {/* TODO: Render 4 level selector buttons (Level 0 – Level 3)
           Highlight the active level with a colored border/background */}

      {/* TODO: Render details for the active level only:
           - Header with level number and name
           - Description text
           - Two columns: HTTP example (request + response) and characteristics list
      */}

      {/* TODO: Render the quiz section:
           - Title and correct-answer counter
           - For each quiz item:
             - <pre> block with the HTTP code snippet
             - 4 buttons: "Level 0", "Level 1", "Level 2", "Level 3"
             - After answering: highlight correct (green) and wrong (red) choices
             - Show the hint/explanation
             - Disable buttons after answering (can't change answer)
      */}
    </div>
  )
}
