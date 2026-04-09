# Level 0: Introduction to API Design

## What is an API and Why Design It

API (Application Programming Interface) is a contract between two programs. When the frontend requests data from the backend, they communicate through an API. But what matters is not the mere existence of an API — it's how well it is designed.

Imagine an API as a coffee machine interface. A good machine: an "espresso" button, a "cappuccino" button, a clear display. A bad one: a single lever, where the mode depends on how many times and in which direction you turned it. Does it work? Yes. Is it convenient? No.

A poorly designed API is technical debt that everyone pays for: frontend developers spend hours "guessing" behavior, tests are brittle, and changes break clients.

## Signs of a Good API

| Sign | What it means |
|---------|-----------|
| **Predictability** | Knowing one part of the API lets you guess the structure of another |
| **Consistency** | The same style everywhere: naming, formats, errors |
| **Simplicity** | Complexity is discovered gradually, not dumped all at once |
| **Documentation** | Up-to-date examples, description of every field |
| **Correct HTTP semantics** | GET — safe, POST — creates, DELETE — deletes |

## REST as the Dominant Style

Most public APIs today are REST (Representational State Transfer). It is not a protocol or a standard, but an architectural style built on top of HTTP, proposed by Roy Fielding in 2000.

Key ideas of REST:
- Resources (nouns) in URLs: `/users/42`, `/orders/5/items`
- HTTP methods (verbs) for actions: GET, POST, PUT, PATCH, DELETE
- Stateless — the server does not store state between requests
- Cacheability — GET requests can be cached

The Richardson Maturity Model divides REST APIs into 4 maturity levels: from Level 0 (a single endpoint, everything via POST) to Level 3 (HATEOAS, self-describing API). Most "good" APIs today are Level 2.
