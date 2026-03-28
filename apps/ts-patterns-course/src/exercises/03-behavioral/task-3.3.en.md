# Task 3.3: Command (TextEditor with undo)

## Objective

Implement the Command pattern for a text editor with support for undoing operations.

## Requirements

1. Create a `Command` interface with methods:
   - `execute(): void`
   - `undo(): void`
   - `describe(): string` — a text description of the command
2. Create a `TextEditor` class with methods:
   - `getContent(): string` and `setContent(content: string): void`
   - `executeCommand(command: Command): void` — execute and save to history
   - `undo(): Command | undefined` — undo the last command
   - `getHistorySize(): number`
3. Implement `InsertTextCommand(editor, text, position)`:
   - `execute` — inserts text at the given position
   - `undo` — restores the previous content
4. Implement `DeleteTextCommand(editor, position, length)`:
   - `execute` — deletes `length` characters from the position
   - `undo` — restores the previous content
5. Demonstrate a series of commands followed by sequential undo

## Checklist

- [ ] Interface `Command` has `execute`, `undo`, `describe`
- [ ] `TextEditor` maintains a history of executed commands
- [ ] `InsertTextCommand` correctly inserts text
- [ ] `DeleteTextCommand` correctly deletes text
- [ ] `undo` restores the state to before the command was executed
- [ ] Each command saves state for undo

## How to verify

1. Click the run button
2. Follow how the editor's content changes after each command
3. Verify that undo returns the text to its previous state
