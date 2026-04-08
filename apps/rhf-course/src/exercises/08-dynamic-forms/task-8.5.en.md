# Exercise 8.5: Nested Field Arrays (Array of Field Array)

## Goal

Learn to create nested dynamic lists using useFieldArray.

## Requirements

Build a course builder with nested structure:

1. **Course title** — text field
2. **Modules** — dynamic list (useFieldArray), each module contains:
   - Module title
   - **Lessons** — nested dynamic list (another useFieldArray), each lesson contains:
     - Lesson title
     - Duration
3. **Control buttons** at both levels: add and remove
4. **Validation**: minimum 1 module, minimum 1 lesson per module, all fields required

## Checklist

- [ ] Form with "Course title" field
- [ ] List of modules with add/remove controls
- [ ] Inside each module — list of lessons with add/remove controls
- [ ] Validation at all levels (course, modules, lessons)
- [ ] On submit all data is logged to the console
- [ ] Nested useFieldArray works independently in each module

## How to verify

1. Open the form — you see "Course title" field and one module with one lesson
2. Add a second module — a new block appears with a module field and a lesson
3. Add lessons to the first module — lessons are added only to the first module
4. Remove a lesson — it disappears only from its module
5. Click "Save" without filling — validation errors
6. Fill in and submit — nested data structure in the console
