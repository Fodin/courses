import { useState, useActionState } from 'react'

// ============================================
// Task 6.1 Hint: Server vs Client Components
// ============================================
// Key rules:
// - Server components: NO hooks, NO browser APIs, NO event handlers
// - Client components: use hooks (useState, useEffect), event handlers, browser APIs
// - 'use client' marks the boundary — everything below becomes client
// - Server components can import client components, but NOT vice versa
// - Default in Next.js App Router: components are server by default

// ============================================
// Task 6.2 Hint: 'use client' Directive
// ============================================
// Place 'use client' at the TOP of the file (before any imports)
// Only mark components that NEED client features:
// - Components with useState, useEffect, useRef
// - Components with onClick, onChange, onSubmit handlers
// - Components using browser APIs (window, document, localStorage)
// DO NOT mark:
// - Components that only render props/children
// - Components that only fetch data
// - Layout components that just compose other components

// ============================================
// Task 6.3 Hint: Server Actions
// ============================================
// Server Action pattern:
// 1. Define an async function with 'use server' directive (conceptual)
// 2. Pass it as form action: <form action={serverAction}>
// 3. The function receives FormData automatically
// 4. In React 19 SPA, simulate with async function + useActionState
//
// Example pattern:
// async function submitForm(prevState, formData) {
//   const name = formData.get('name')
//   // process on server...
//   return { success: true, message: 'Saved!' }
// }

export function Task6_1_Hint() {
  return (
    <div className="exercise-container">
      <h2>Hint 6.1: Server vs Client Components</h2>
      <ul>
        <li>Server: data fetching, DB access, no interactivity</li>
        <li>Client: hooks, event handlers, browser APIs</li>
        <li>Ask: &quot;Does this component need the browser?&quot;</li>
      </ul>
    </div>
  )
}

export function Task6_2_Hint() {
  return (
    <div className="exercise-container">
      <h2>Hint 6.2: use client Directive</h2>
      <ul>
        <li>Place at the very top of the file</li>
        <li>Only where interactivity is needed</li>
        <li>Push the boundary as low as possible in the tree</li>
      </ul>
    </div>
  )
}

export function Task6_3_Hint() {
  return (
    <div className="exercise-container">
      <h2>Hint 6.3: Server Actions</h2>
      <ul>
        <li>Use <code>{'<form action={fn}>'}</code> pattern</li>
        <li>The action function receives <code>FormData</code></li>
        <li>Combine with <code>useActionState</code> for state management</li>
      </ul>
    </div>
  )
}
