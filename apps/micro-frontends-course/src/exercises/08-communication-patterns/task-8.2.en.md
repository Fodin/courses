# Task 8.2: Event Contract Builder

## Goal

Create an interactive builder for describing typed communication contracts between MFEs: adding MFEs and their events (emit/listen), shared state slices, validation, and TypeScript code generation.

## Requirements

1. MFE list with ability to add and delete
2. For each MFE: editable name, add/delete events
3. Each event has three fields: name (mfe:action), direction (emit/listen), payload type
4. Shared State Slices section: slice name, type, owner (owner MFE), reader list
5. Real-time validation: orphan emitter (sends, nobody listens), orphan listener (listens, nobody sends)
6. Green banner "Contract valid" when no warnings
7. "Generate TypeScript" button creates code: EventMap interface, EventBus class with typed emit/on, SharedState interface
8. Generated code displayed in dark preformatted block

## Checklist

- [ ] "+ Add MFE" button adds empty MFE with name "newMFE"
- [ ] "Delete MFE" button removes MFE (right corner of card)
- [ ] Editable MFE name input field
- [ ] "+ Event" button adds empty event row in MFE
- [ ] Event row: input for name + select emit/listen + input for payload type + delete button
- [ ] emit select displayed in blue, listen — in green
- [ ] Shared State section: name | type | owner | readers (comma-separated)
- [ ] Validation: orphan emitter → orange warning
- [ ] Validation: orphan listener → orange warning
- [ ] Green banner when no warnings
- [ ] Initial state: 2 MFEs (catalog, cart) with emit/listen events
- [ ] "Generate TypeScript" button generates correct TS code
- [ ] EventMap contains only emit events
- [ ] EventBus has typed emit() and on() with unsubscribe
- [ ] SharedState interface includes all slices with owner comments
- [ ] All styles inline

## How to Check

1. Initial state: 2 MFEs, no warnings (catalog emit + cart listen for catalog:add-to-cart)
2. Add new MFE, add event with direction "emit" — warning "nobody listens" should appear
3. Add a listener for that event in another MFE — warning should disappear
4. Click "Generate TypeScript" — valid TS code should appear
5. EventMap should contain only emit events (not listen)
6. EventBus should have emit() and on() with generic types
7. If SharedState slices exist — SharedState interface should be generated
