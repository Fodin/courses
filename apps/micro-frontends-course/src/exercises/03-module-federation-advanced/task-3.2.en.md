# Task 3.2 — Dynamic Remote Registry Builder

## Goal

Create a visual builder that describes a dynamic remotes registry and generates ready-to-use TypeScript code for a loader with fallback, health-check, and retry support.

## Requirements

1. Remote modules table with ability to add and delete rows. Each row contains:
   - Name (text) — remote identifier, used in code
   - Primary URL (text) — main `remoteEntry.js` URL
   - Fallback URL (text, optional) — backup URL when primary is unavailable
   - Health-check endpoint (text, optional) — URL for availability check
   - Timeout ms (number, default 5000) — load timeout
   - Priority (number 1–10) — remote priority

2. Real-time field validation:
   - Name: required, only letters/digits/_ (starts with letter), unique among all entries
   - Primary URL: required, `http://` or `https://` format
   - Fallback URL: if filled — must be a valid URL
   - Timeout: from 1000 to 30000 ms
   - Priority: from 1 to 10
   - Errors shown directly below the field

3. TypeScript code generation:
   - `RemoteConfig` interface with types for all fields
   - `remoteRegistry` object with all registered remotes
   - `loadRemote(name: string)` function with retry, fallback, health-check
   - `checkHealth(endpoint, timeout)` function

4. Live code preview:
   - Updates on every table change
   - When there are errors, code is displayed with reduced opacity
   - Hide/show code button

## Checklist

- [ ] Table supports adding and removing rows
- [ ] All fields are validated with error messages
- [ ] Duplicate names show errors in both fields
- [ ] Code generates correctly for all filled remotes
- [ ] On validation errors, code is semi-transparent
- [ ] Hide/show code button works
- [ ] Pre-populated with example data

## How to Check Yourself

- Add a remote named `my-app` → code contains `myApp:` ... no, the name is used as-is
- Enter `primaryUrl: "not-a-url"` → error below the field
- Enter `timeout: 500` → error (less than 1000)
- Add two rows with the same name → error in both
- Delete all rows → code shows a hint comment
- Fill all fields correctly → generated code contains loadRemote function with fallback and retry

## Hint

Note that `checkHealth` uses `AbortController` for timeout. In the `loadRemote` function, URLs are tried sequentially: first `primaryUrl` is checked, on failure — `fallbackUrl`.
