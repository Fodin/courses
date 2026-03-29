# Task 1.4: Template Engines (EJS)

## 🎯 Goal

Set up the EJS template engine in Express: rendering views, passing data, using partials, and views directory structure.

## Requirements

1. Configure EJS: `app.set('view engine', 'ejs')` and `app.set('views', ...)`
2. Show the views directory structure: layouts, partials, pages
3. Demonstrate EJS syntax: `<%= %>` (escaped output), `<%- %>` (raw), `<% %>` (code), `<%- include() %>`
4. Implement rendering a user list page via `res.render('template', data)`
5. Show the rendering result as HTML

## Checklist

- [ ] EJS configured via `app.set('view engine', 'ejs')`
- [ ] Views structure organized: layouts/, partials/, pages/
- [ ] Syntax shown: escaped output, raw, control structures, include
- [ ] `res.render()` called with template name and data object
- [ ] Rendering result contains data from context and included partials

## How to Verify

Click "Run" and verify that: EJS setup is shown correctly, syntax is described, rendering produces HTML with context data and included partials.
