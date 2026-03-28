# Level 7: Metadata & Stylesheets

## Introduction

React 19 allows rendering **document metadata** (`<title>`, `<meta>`, `<link>`) directly inside components. React automatically hoists them into `<head>`. APIs for **resource preloading** have also been added.

---

## Document Metadata

### title and meta

```tsx
function BlogPost({ post }) {
  return (
    <article>
      <title>{post.title} — My Blog</title>
      <meta name="description" content={post.excerpt} />
      <meta name="author" content={post.author} />
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
```

React 19 automatically:
1. Finds `<title>`, `<meta>`, `<link>` in JSX
2. Hoists them into the document `<head>`
3. Updates them when the component updates
4. Removes them when the component unmounts

### Benefits

- **Co-location** — metadata lives next to the content
- **Dynamic** — updates on navigation
- **No libraries** — no need for react-helmet or next/head

---

## Stylesheet Precedence

```tsx
function Dashboard() {
  return (
    <>
      <link rel="stylesheet" href="/base.css" precedence="default" />
      <link rel="stylesheet" href="/dashboard.css" precedence="high" />
      <div className="dashboard">...</div>
    </>
  )
}
```

### How precedence works

| Value       | Priority | Use case         |
|-------------|----------|------------------|
| `"default"` | Low      | Base styles      |
| `"high"`    | High     | Component styles |

React guarantees:
- Styles are loaded **before** the component renders
- Order matches the precedence
- Duplicate `href` values are not loaded more than once

---

## Preload API

React 19 adds functions for preloading resources:

```tsx
import { prefetchDNS, preconnect, preload, preinit } from 'react-dom'

function App() {
  // DNS resolution for a third-party API
  prefetchDNS('https://api.analytics.com')

  // Establish a connection to the CDN
  preconnect('https://cdn.example.com')

  // Preload a critical resource
  preload('/hero.jpg', { as: 'image' })

  // Load and execute a script
  preinit('/analytics.js', { as: 'script' })

  return <div>...</div>
}
```

### Function comparison

| Function            | What it does              | When to use             |
|---------------------|---------------------------|-------------------------|
| `prefetchDNS(url)`  | Resolves DNS              | Third-party domains     |
| `preconnect(url)`   | DNS + TCP + TLS           | CDN, API                |
| `preload(url, opts)`| Loads a resource          | Images, fonts           |
| `preinit(url, opts)`| Loads + executes          | Scripts                 |
| `preloadModule(url)`| Loads an ES module        | Dynamic imports         |
| `preinitModule(url)`| Loads + executes a module | Widgets                 |

### Resource types

```tsx
// Font
preload('/fonts/inter.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })

// Style
preload('/critical.css', { as: 'style' })

// Image
preload('/hero.webp', { as: 'image', imageSrcSet: '...' })
```

---

## Summary

| Feature              | API                   | Example                                      |
|----------------------|-----------------------|----------------------------------------------|
| Page title           | `<title>` in JSX      | `<title>Page</title>`                        |
| Meta tags            | `<meta>` in JSX       | `<meta name="desc" content="..."/>`          |
| Styles with priority | `precedence`          | `<link precedence="high"/>`                  |
| Preloading           | `preload()` and more  | `preload('/img.jpg', {as:'image'})`          |
