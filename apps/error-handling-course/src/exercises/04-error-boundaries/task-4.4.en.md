# Task 4.4: Nested Boundaries

## Goal
Build an application layout with isolated sections through nested Error Boundaries.

## Requirements
1. Create a layout with 3 sections: Header, Content, Sidebar
2. Wrap each section in a separate `RecoverableErrorBoundary`
3. Make Sidebar crash immediately on render
4. Make Content crash on button click
5. Show that an error in one section doesn't break the others

## Checklist
- [ ] 3 sections in layout
- [ ] Each wrapped in Error Boundary
- [ ] Sidebar crashes — Content and Header work
- [ ] Content crashes — Header and Sidebar (error) are unaffected
- [ ] Each section recovers independently
