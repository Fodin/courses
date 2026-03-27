import { useState } from 'react'

// ============================================
// Задание 8.3: Type-level State Machine
// ============================================

// TODO: Define state marker interfaces:
//   interface DraftState { readonly _state: 'draft' }
//   interface ReviewState { readonly _state: 'review' }
//   interface PublishedState { readonly _state: 'published' }

// TODO: Define DocumentData interface:
//   title: string
//   content: string
//   author: string

// TODO: Create class TypedDocument<S> with:
//   constructor(readonly data: DocumentData, readonly state: string)
//
//   submitForReview(this: TypedDocument<DraftState>): TypedDocument<ReviewState>
//     - Return new TypedDocument<ReviewState>(this.data, 'review')
//     - The `this` parameter means this method can ONLY be called on Draft documents
//
//   publish(this: TypedDocument<ReviewState>): TypedDocument<PublishedState>
//     - Return new TypedDocument<PublishedState>(this.data, 'published')
//
//   requestChanges(this: TypedDocument<ReviewState>): TypedDocument<DraftState>
//     - Return new TypedDocument<DraftState>(this.data, 'draft')
//
//   editContent(this: TypedDocument<DraftState>, content: string): TypedDocument<DraftState>
//     - Return new TypedDocument<DraftState>({ ...this.data, content }, 'draft')
//
//   describe(): string
//     - Return `"${this.data.title}" [${this.state}] by ${this.data.author}`
//     - Available in ANY state (no this constraint)

// TODO: Create factory function createDraft(data: DocumentData): TypedDocument<DraftState>
//   - Return new TypedDocument<DraftState>(data, 'draft')

// TODO: Define type-level transition map:
//   type TransitionMap = {
//     draft: 'review'
//     review: 'published' | 'draft'
//     published: never
//   }
//
//   type CanTransition<From extends keyof TransitionMap, To extends string> =
//     To extends TransitionMap[From] ? true : false

export function Task8_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('--- Type-level State Machine ---')
    log.push('')

    // TODO: Create draft document:
    //   createDraft({ title: 'Advanced TypeScript', content: 'Initial draft...', author: 'Alice' })
    //   Log: describe()

    // TODO: Edit content (only works in Draft state):
    //   draft.editContent('Updated content with examples')
    //   Log: describe()

    // TODO: Submit for review (Draft → Review):
    //   edited.submitForReview()
    //   Log: describe()

    // TODO: Request changes (Review → Draft):
    //   inReview.requestChanges()
    //   Log: describe()

    // TODO: Edit again and re-submit:
    //   backToDraft.editContent('Final version with fixes')
    //   reEdited.submitForReview()
    //   Log both

    // TODO: Publish (Review → Published):
    //   reSubmitted.publish()
    //   Log: describe()

    // TODO: Add comments showing invalid transitions that would NOT compile:
    //   draft.publish()            — needs Review state
    //   published.editContent()    — needs Draft state
    //   published.requestChanges() — needs Review state

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 8.3: Type-level State Machine</h2>
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
