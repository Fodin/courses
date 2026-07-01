import { useState } from 'react'

// ============================================
// Задание 3.3: Command (TextEditor с undo)
// ============================================

// TODO: Create interface Command with methods:
//   execute(): void
//   undo(): void
//   describe(): string

// TODO: Create class TextEditor with:
//   private content: string (initially empty)
//   private history: Command[]
//
//   getContent(): string
//   setContent(content: string): void
//   executeCommand(command: Command): void — execute and push to history
//   undo(): Command | undefined — pop from history and call undo
//   getHistorySize(): number

// TODO: Create class InsertTextCommand implementing Command
//   constructor(editor: TextEditor, text: string, position: number)
//   - Save previousContent before executing
//   - execute: insert text at position in editor content
//   - undo: restore previousContent
//   - describe: return 'Insert "text" at position N'

// TODO: Create class DeleteTextCommand implementing Command
//   constructor(editor: TextEditor, position: number, length: number)
//   - Save previousContent and deletedText
//   - execute: remove length chars starting at position
//   - undo: restore previousContent
//   - describe: return 'Delete N chars at position M ("deleted")'

export function Task3_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Create TextEditor
    // TODO: Execute InsertTextCommand to insert "Hello" at position 0
    // TODO: Execute InsertTextCommand to insert " World" at position 5
    // TODO: Execute InsertTextCommand to insert "!" at position 11
    // TODO: Execute DeleteTextCommand to delete 6 chars at position 5
    // TODO: Log each command description and editor content
    // TODO: Undo commands one by one, logging results

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.3: Command (TextEditor)</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
