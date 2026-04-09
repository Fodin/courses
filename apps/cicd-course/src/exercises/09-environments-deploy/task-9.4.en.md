# Task 9.4: Review Apps — Dynamic Environments for Merge Requests

## Goal

Create a Review Apps system simulator: opening an MR automatically creates an environment, closing or merging — deletes it. Show the full Review App lifecycle and generate the GitLab CI config.

## Requirements

1. Display a list of branches (at least 4 predefined): `feature/user-auth`, `fix/login-bug`, `feature/dark-mode`, `refactor/api-client`
2. For each branch, buttons: "Open MR" / "Merge" / "Close without merge"
3. On MR open — automatically create a Review App with a URL based on the branch slug (show the URL)
4. On Merge or Close without merge — delete the Review App, show "stop-review triggered" in the log
5. Show a counter of active Review Apps (and resources: each Review App "costs" 1 pod)
6. Show GitLab CI YAML configuration for Review Apps (deploy-review + stop-review jobs)
7. `auto_stop_in` parameter — dropdown or buttons: `1 day`, `1 week`, `30 days`; YAML updates

## Checklist

- [ ] List of branches with action buttons (button state depends on branch status)
- [ ] On MR open — a Review App card appears with URL and "deploying" → "active" status
- [ ] URL generated from branch slug: `feature/user-auth` → `feature-user-auth.review.myapp.com`
- [ ] On Merge/Close — the card is removed, log shows "stop-review: namespace deleted"
- [ ] Counter of active environments and "consumed resources"
- [ ] "Open MR" button disabled if MR is already open
- [ ] YAML with deploy-review and stop-review jobs
- [ ] auto_stop_in selection updates YAML in real time

## How to Verify

1. Open MRs for two branches — two Review App cards with different URLs should appear
2. Merge one — its card is removed, log shows environment stop
3. Open all 4 MRs — resource counter should show 4 pods
4. Change auto_stop_in to "1 day" — YAML should update immediately
5. Close without merge — environment is deleted same as on merge

## Hints

- Store `branches` — array of objects `{name, mrOpen, reviewAppActive, slug}`
- Slug: `name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')`
- URL: `` `https://${slug}.review.myapp.com` ``
- For "deploying" animation: use a simple boolean `isDeploying` and toggle on click
- Generate YAML as a template literal, substituting `autoStopIn` from state
