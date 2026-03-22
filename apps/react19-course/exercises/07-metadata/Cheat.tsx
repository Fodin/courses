// ============================================
// Task 7.1 Hint: Document Metadata
// ============================================
// React 19 allows rendering <title>, <meta>, <link> inside components
// They are automatically hoisted to <head>
//
// function MyPage() {
//   return (
//     <>
//       <title>My Page Title</title>
//       <meta name="description" content="Page description" />
//       <div>Page content...</div>
//     </>
//   )
// }

// ============================================
// Task 7.2 Hint: Stylesheet Precedence
// ============================================
// Use the `precedence` attribute on <link> tags
// React 19 deduplicates and orders stylesheets by precedence
//
// <link rel="stylesheet" href="/base.css" precedence="default" />
// <link rel="stylesheet" href="/page.css" precedence="high" />
//
// Precedence values: any string — React uses insertion order per precedence group
// Same precedence = maintains relative order
// Higher precedence = inserted later (overrides)

// ============================================
// Task 7.3 Hint: Preload API
// ============================================
// Import from 'react-dom':
// import { preload, preinit, prefetchDNS, preconnect } from 'react-dom'
//
// preinit('/styles/critical.css', { as: 'style' })  — load + apply immediately
// preload('/data.json', { as: 'fetch' })             — prefetch resource
// prefetchDNS('https://api.example.com')             — DNS prefetch
// preconnect('https://cdn.example.com')              — early connection
//
// Call these at module level or inside components

export function Task7_1_Hint() {
  return (
    <div className="exercise-container">
      <h2>Hint 7.1: Document Metadata</h2>
      <ul>
        <li>Render <code>{'<title>'}</code> anywhere in your component tree</li>
        <li>React 19 automatically hoists it to <code>{'<head>'}</code></li>
        <li>Works with <code>{'<meta>'}</code> and <code>{'<link>'}</code> too</li>
      </ul>
    </div>
  )
}

export function Task7_2_Hint() {
  return (
    <div className="exercise-container">
      <h2>Hint 7.2: Stylesheet Precedence</h2>
      <ul>
        <li>Add <code>precedence</code> attribute to <code>{'<link>'}</code> tags</li>
        <li>React deduplicates identical hrefs</li>
        <li>Stylesheets are ordered by their precedence group</li>
      </ul>
    </div>
  )
}

export function Task7_3_Hint() {
  return (
    <div className="exercise-container">
      <h2>Hint 7.3: Preload API</h2>
      <ul>
        <li><code>preinit()</code> = load + execute immediately</li>
        <li><code>preload()</code> = prefetch for later use</li>
        <li><code>prefetchDNS()</code> and <code>preconnect()</code> for network optimization</li>
      </ul>
    </div>
  )
}
