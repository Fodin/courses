# Task 1.3 — Accordion via composition

## Goal

Implement `Accordion` and `AccordionItem` components using the composition pattern — without passing a config array, with open/close state management in each item.

## Requirements

1. Implement an `AccordionItem` component with props:
   - `title: React.ReactNode` — section title (clickable)
   - `children: React.ReactNode` — expandable content
   - `defaultOpen?: boolean` — whether the item is open by default (default `false`)
2. `AccordionItem` manages its own open state via `useState`
3. Clicking the title toggles the content visibility
4. Implement an `Accordion` component — a wrapper container that accepts only `children: React.ReactNode`
5. Demonstrate usage: create a FAQ with at least 4 questions:
   - First question is open by default (`defaultOpen={true}`)
   - Rest are closed
   - One question has non-string `title` — JSX with a badge or icon
   - One answer contains a `<ul>`/`<li>` list, not just text
6. Visually: an arrow/indicator shows open/closed state (can use ▼/▲ symbol or text)

## Hints

- State is stored in `AccordionItem`, not in `Accordion`: `const [isOpen, setIsOpen] = useState(defaultOpen ?? false)`
- `Accordion` is just a styled `<div>`, it doesn't control child elements
- Content hiding: can use conditional rendering `{isOpen && <div>...</div>}` or `display: none`
- For animation, you can use transition on `maxHeight`, but it's optional
- Title button: `<button onClick={() => setIsOpen(prev => !prev)}>` — semantically correct

## Checklist

- [ ] `AccordionItem` accepts `title`, `children`, `defaultOpen?`
- [ ] Clicking title toggles content visibility
- [ ] `Accordion` is just a container without logic
- [ ] Demo contains at least 4 questions
- [ ] First question is open by default
- [ ] One `title` contains JSX (not just a string)
- [ ] One answer contains a `<ul>/<li>` list
- [ ] Indicator (arrow/symbol) reflects current state

## How to check yourself

Open several items at once — they should be independent (opening one doesn't close another). This is a key difference from the config approach, which often closes everything when opening a new item. Make sure `Accordion` contains no logic — only a visual container.
