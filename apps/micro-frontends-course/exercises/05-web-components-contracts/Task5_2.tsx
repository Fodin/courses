// Task 5.2 — Web Component Contract Builder
// Build a step-by-step form that describes the public API of a Custom Element
// and generates a TypeScript interface + class skeleton in real time.

// TODO: Implement the Web Component contract builder with 7 steps:
//
// STEP 1 — "Имя" (Name):
// - Text input for element name (lowercase, must contain a hyphen)
// - Validation: show error if no hyphen or uppercase
// - Show derived class name: "my-catalog-card" → "MyCatalogCard" (PascalCase)
//
// STEP 2 — "Атрибуты" (Attributes):
// - List of attributes: each has name (string), type ('string'|'number'|'boolean'), defaultValue
// - Add/remove buttons
// - Note: attributes are always strings in HTML — type selection is for TypeScript interface only
//
// STEP 3 — "Свойства" (Properties):
// - List of JS properties: name, tsType (free text, e.g. "Item[]"), description
// - Add/remove buttons
// - Note: properties accept any JS type (objects, arrays) unlike attributes
//
// STEP 4 — "События" (Events):
// - List of CustomEvents: name (e.g. "catalog:item-selected"), payloadType (e.g. "{ id: string }")
// - Add/remove buttons
//
// STEP 5 — "CSS Vars":
// - List of CSS Custom Properties: name (must start with "--"), defaultValue
// - Validation: show error if name doesn't start with "--"
// - Add/remove buttons
//
// STEP 6 — "Слоты" (Slots):
// - List of slots: name (empty = default slot), description
// - Add/remove buttons
//
// STEP 7 — "Результат" (Result):
// - Summary of the contract (element name, class name, counts of each category)
// - Validation errors if any (no hyphen in name, duplicate names, CSS vars without --)
// - Button to start over
//
// LIVE PREVIEW (right column, always visible):
// - Two tabs: "TypeScript Interface" and "Class Skeleton"
// - TypeScript Interface tab: interfaces for Attributes, Properties, Events, JSDoc comments for CSS vars and slots
// - Class Skeleton tab: full class extending HTMLElement with:
//   - static observedAttributes (if attrs exist)
//   - private backing fields for properties
//   - constructor with attachShadow
//   - connectedCallback, disconnectedCallback
//   - attributeChangedCallback (if attrs exist)
//   - getter/setter pairs for each property
//   - private emit helpers for each event
//   - private render() method with :host CSS vars and <slot> elements
//   - customElements.define(...) at the bottom
// - Code display with minimal syntax highlighting (keywords in different colors)
//
// Stepper navigation: step buttons at the top, prev/next buttons in each step
// Completed steps shown in green, current step in blue, future steps in gray
//
// All styles inline (no CSS files)

export function Task5_2() {
  return <div>Task 5.2</div>
}
