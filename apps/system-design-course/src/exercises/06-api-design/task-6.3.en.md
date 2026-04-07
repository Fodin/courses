# Task 6.3: Design a REST API for a Blog Platform

## Objective

Design a full REST API (Level 2) for a blog platform: define resources, endpoints, HTTP methods, pagination, filtering, and authentication.

## Requirements

1. Define the blog platform resources:
   - **Users** — authors and readers
   - **Posts** — blog articles
   - **Comments** — comments on articles
   - **Tags** — tags for categorization
2. For each resource, design endpoints:
   - CRUD operations (GET, POST, PUT/PATCH, DELETE)
   - Nested resources (GET /posts/:id/comments)
   - Filtering and search (GET /posts?tag=react&author=42)
3. For each endpoint, define:
   - HTTP method and URL
   - Pagination type (cursor or offset)
   - Whether authentication is required
   - Description and status codes
4. Interactive table grouped by resources
5. Completeness check: all CRUD operations covered, pagination on lists

## Checklist

- [ ] 4 resources: Users, Posts, Comments, Tags
- [ ] For each resource: GET (list), GET (one), POST, PATCH, DELETE
- [ ] Nested resources: /posts/:id/comments, /users/:id/posts
- [ ] Pagination on all lists (cursor for posts/comments, offset for tags)
- [ ] Filtering: by author, tag, date
- [ ] Authentication: specified where needed (POST, PATCH, DELETE), where not (GET)
- [ ] Correct HTTP status codes (200, 201, 204, 400, 401, 404)

## How to Check Yourself

1. Each resource has at least 5 endpoints (list, get, create, update, delete)
2. URLs contain nouns, not verbs (/posts, not /getPosts)
3. POST returns 201, DELETE — 204
4. Lists have pagination (cursor for public, offset for admin)
5. POST/PATCH/DELETE require authentication, GET — does not (except private endpoints)
