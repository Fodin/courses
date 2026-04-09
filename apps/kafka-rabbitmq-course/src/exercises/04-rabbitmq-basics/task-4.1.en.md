# Task 4.1: RabbitMQ Architecture

## Goal

Create an interactive visual map of RabbitMQ message broker architecture — a nested layered diagram with an information panel. The student will clearly understand how Erlang VM, Node, Virtual Host, Exchange, Queue, and Binding relate to each other.

## Requirements

1. Define type `ArchLayer` — a union type of six values: `'erlang' | 'node' | 'vhost' | 'exchange' | 'queue' | 'binding'`.
2. Define interface `LayerInfo` with fields: `id`, `label`, `emoji`, `color`, `bgColor`, `borderColor`, `description`, `details: string[]` (at least 4 facts), `children: ArchLayer[]`.
3. Create a `LAYERS` array with real data for all six architecture layers.
4. Implement click logic `handleClick(id: ArchLayer)`:
   - first click on a layer: `selected = id`, `zoomed = null`
   - second click on the same layer: `zoomed = id` (show all details)
   - click on an already zoomed layer: `zoomed = null`, `selected = id`
5. Display the nested structure on the left: Erlang VM → Node → VHost → (Exchange + Queue side by side) → Binding. Each block is clickable, its style changes on `selected` and `zoomed`.
6. Display an information panel on the right:
   - if a layer is selected: show emoji, label, description
   - if only `selected`: first 3 `details` items + hint "click to zoom"
   - if `zoomed`: all `details` items
   - if `children.length > 0`: show child layers as clickable badges
   - if nothing is selected: a placeholder with "👈" icon and instructions
7. Add a legend at the bottom of the panel — all six layers as small buttons with emoji and name, clickable.

## Checklist

- [ ] `ArchLayer` type declared as a union type of 6 values
- [ ] `LayerInfo` interface contains all required fields
- [ ] `LAYERS` array contains 6 objects with real information
- [ ] `handleClick` implements three-stage logic (select → zoom → reset)
- [ ] Nested diagram on the left displays all 6 layers
- [ ] Click on a block changes its visual style (border, background)
- [ ] Information panel on the right shows details of the selected layer
- [ ] In zoom mode all `details` are shown, in normal mode — only 3
- [ ] Child layers in the panel display as clickable badges
- [ ] Legend at the bottom contains all 6 layers

## How to Check Yourself

1. Launch the component and make sure clicking "Erlang VM" shows a description with 3 facts on the right.
2. Click the same block again — all 5+ facts should appear (zoom mode).
3. Click a different block (e.g., "Queue") — zoom resets, the new layer is shown.
4. Click the "Virtual Host" badge in the "Contains" section on the panel — it should navigate to that layer.
5. Click the "Binding" button in the legend at the bottom — the corresponding card should be selected.
6. Make sure the second vhost (/staging) displays as a dashed block with "isolated" label.