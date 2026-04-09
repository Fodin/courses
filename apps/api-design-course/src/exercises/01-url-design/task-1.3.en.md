# Task 1.3 — Blog Platform URL Schema

## Goal

Study a complete REST schema for a real application, analyze patterns: collections, nested resources, RPC exceptions, query params for filtering.

## Requirements

1. The component displays a reference URL schema for a blog platform.
2. Resources are grouped (users, posts, comments, tags).
3. Groups expand on click — showing an endpoints table.
4. Each endpoint: method, URL, description, a note (if there is an exception or alternative).
5. HTTP methods are highlighted with color in the table.
6. At the end — a self-check questions block (without answers, for reflection).

## Checklist

- [ ] At least 4 resource groups
- [ ] At least 15 endpoints total
- [ ] An RPC exception example with explanation is present
- [ ] The difference between a nested resource and a query param filter is shown
- [ ] Self-check questions are present
- [ ] HTTP methods are visually highlighted

## How to Check Yourself

After studying the schema, close the component and try to reproduce from memory:
- How to get a specific author's posts?
- How to add a comment to a post?
- What is the difference between PUT and PATCH for a post?
- Why is `/posts/:id/publish` an acceptable URL?
