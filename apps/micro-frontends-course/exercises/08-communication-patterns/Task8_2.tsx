// Task 8.2 — Event Contract Constructor
// Build an interactive constructor for defining typed MFE communication contracts:
// events (emit/listen), shared state slices, and TypeScript code generation.

// TODO: Implement the event contract constructor with the following structure:
//
// TYPES:
//   - Direction: 'emit' | 'listen'
//   - EventEntry: { id, name, direction, payloadType }
//   - StateSlice: { id, name, sliceType, owner, readers: string[] }
//   - MFEDef: { id, name, events: EventEntry[] }
//
// INITIAL STATE:
//   MFEs:
//     - catalog: events = [
//         { name: 'catalog:add-to-cart', direction: 'emit', payloadType: '{ productId: string; qty: number }' },
//         { name: 'cart:checkout-started', direction: 'listen', payloadType: '{ total: number }' },
//       ]
//     - cart: events = [
//         { name: 'catalog:add-to-cart', direction: 'listen', payloadType: '{ productId: string; qty: number }' },
//         { name: 'cart:checkout-started', direction: 'emit', payloadType: '{ total: number; items: number }' },
//       ]
//   Slices:
//     - { name: 'cartCount', sliceType: 'number', owner: 'cart', readers: ['catalog', 'profile'] }
//
// BEHAVIORS:
//
// Add/Remove MFE:
//   - addMfe: append { name: 'newMFE', events: [] }
//   - removeMfe(id): filter out by id
//   - updateMfeName(id, name): update name field
//
// Add/Remove/Update Event:
//   - addEvent(mfeId): add empty event { name: '', direction: 'emit', payloadType: 'void' }
//   - removeEvent(mfeId, evtId): filter out event
//   - updateEvent(mfeId, evtId, field, value): update specific field
//
// Add/Remove/Update Slice:
//   - addSlice: append { name: '', sliceType: 'unknown', owner: '', readers: [] }
//   - removeSlice(id): filter out
//   - updateSlice(id, field, value): update field (readers: split by comma)
//
// Validation (real-time, always computed):
//   - Collect all emit event names
//   - Collect all listen event names
//   - orphan emitter: emitted but nobody listens → warning
//   - orphan listener: listened but nobody emits → warning
//   - Show green banner when warnings.length === 0 && mfes.length > 0
//
// Code Generation (on button click):
//   Generate TypeScript string with:
//   1. EventMap interface: each emitted event name → payload type
//   2. EventBus class with typed emit() and on() methods + unsubscribe
//   3. SharedState interface: each slice name → slice type (with owner comment)
//   Display in dark <pre> block
//
// UI LAYOUT:
//
// 1. MFE SECTION (header + "+ Добавить MFE" button):
//    Each MFE card:
//    - Input for MFE name (monospace)
//    - "+ Событие" button (green)
//    - "Удалить MFE" button (red outline, right-aligned)
//    Each event row:
//    - Input: event name (monospace)
//    - Select: emit (blue) / listen (green)
//    - Input: payload type (monospace)
//    - "✕" remove button
//
// 2. SHARED STATE SECTION (header + "+ Добавить slice" button):
//    Each slice row:
//    - Input: slice name (120px)
//    - Input: type (140px)
//    - Input: owner MFE (100px)
//    - Input: readers comma-separated (flex-grow)
//    - "✕" remove button
//    Footer hint: "name | type | owner MFE | readers (через запятую)"
//
// 3. VALIDATION BLOCK:
//    - Orange block with warnings list (when warnings exist)
//    - Green block "Контракт валиден" (when no warnings)
//
// 4. "Сгенерировать TypeScript" button (dark blue)
//
// 5. Generated code block (dark background pre, monospace)
//    (shown only after clicking generate)
//
// All styles must be inline (no CSS files, no CSS modules)

export function Task8_2() {
  return <div>Task 8.2</div>
}
