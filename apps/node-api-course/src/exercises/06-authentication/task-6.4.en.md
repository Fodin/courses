# Task 6.4: OAuth 2.0

## 🎯 Goal

Implement OAuth 2.0 Authorization Code Flow: redirect to provider, callback, code exchange for token, and user data retrieval.

## Requirements

1. Show step 1: redirect to OAuth provider with client_id, redirect_uri, scope, state
2. Show step 2: callback with authorization code and state verification (CSRF protection)
3. Show step 3: exchange code for access_token via POST to provider
4. Show step 4: retrieve user data with provider's access_token
5. Show step 5: create/find user in DB and issue own session/JWT

## Checklist

- [ ] Redirect includes: client_id, redirect_uri, scope, state (random)
- [ ] State saved in session and verified on callback
- [ ] Code exchanged with client_secret on server side (not in browser!)
- [ ] Provider's access token used for GET /user API
- [ ] Result: local session created for our application

## How to Verify

Click "Run" and verify that all 5 OAuth flow steps are shown sequentially with HTTP requests and responses.
