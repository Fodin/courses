# Task 7.1: Document Metadata

## Objective

Render `<title>` and `<meta>` directly inside a component, using automatic hoisting in React 19.

## Requirements

1. Create several "pages" with different titles
2. Each page renders `<title>` and `<meta name="description">` in JSX
3. Add navigation between pages
4. The document title (browser tab) must update when switching pages

## Checklist

- [ ] `<title>` is rendered in the component's JSX
- [ ] `<meta>` is rendered in the component's JSX
- [ ] Switching pages updates the browser tab title
- [ ] At least 3 pages with different titles

## How to verify

1. Switch the page — the browser tab title changes
2. Open DevTools → Elements → `<head>` — your meta tags appear there
