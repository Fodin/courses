# Task 13.3: Caching Strategies in Monorepos

## Goal

Create a caching strategy builder for monorepos. The user configures cache parameters for each service and sees the resulting YAML, along with a caching efficiency assessment.

## Requirements

1. Display three services with different tech stacks: `auth` (Node.js), `payments` (Go), `notifications` (Python)
2. For each service, implement settings:
   - **Lock file** (package-lock.json / go.sum / requirements.txt) — affects the cache key
   - **Policy** (pull-push / pull / push) with a description of each
   - **Branch isolation** (add `$CI_COMMIT_REF_SLUG` to prefix or not)
3. Show the resulting cache key for each service
4. Show the YAML cache configuration for selected settings
5. Add a "key conflict" indicator — if two services have the same cache key (without prefix)
6. Show an assessment: "optimal" / "has issues" with an explanation

## Checklist

- [ ] Three service cards with tech icons (N = Node, G = Go, P = Python)
- [ ] Cache policy toggles for each service (pull-push / pull / push)
- [ ] "Isolate by branch" checkbox for each service
- [ ] Display of the final cache key as a string
- [ ] YAML block with full cache: configuration for all services
- [ ] Conflict detector: highlight red if keys match
- [ ] Final config assessment with explanation

## How to Verify

1. Remove prefix from two services and keep the same lock files → a conflict indicator should appear
2. For a build job select `pull-push`, for a test job select `pull` → assessment "optimal"
3. Enable "isolate by branch" → `$CI_COMMIT_REF_SLUG` should appear in the cache key
4. Select `push` without `pull-push` for any service → a warning should appear (who will create the cache?)
5. Verify that YAML correctly reflects all settings

## Hints

- Cache key is formed as `{prefix}-{hash(lockFile)}`. In the simulator, show a scheme: `"auth-$HASH(package-lock.json)"`
- Key conflict: compare service `prefix` values — if prefix is not set (empty), keys may collide
- For config assessment check: is there at least one `pull-push` (otherwise nobody creates cache), no prefix conflicts
- Three policy states can be cycled: `pull-push → pull → push → pull-push`
- For clarity, show the policy description under the toggle: "Reads and updates cache" / "Reads only" / "Writes only"
