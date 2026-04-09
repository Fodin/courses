# Task 10.3: Pipeline Protection — Protected Branches, Environments, and Approval Rules

## Goal

Create an interactive deploy protection system simulator. The user configures protection layers (protected branches, environment approvals, deployment rules) and sees whether a deploy passes in different scenarios.

## Requirements

1. Implement a **protection configurator** with three independent layers:
   - Protected Branch: toggle "protect main" + select who can merge (Developers, Maintainers, Owners)
   - Environment Approvals: toggle + input for required approvals count (1, 2, 3)
   - Self-approval: toggle "disallow self-approval of own deploy"
2. Implement a **scenario simulator** — three buttons with different situations:
   - Scenario A: Developer pushes to `feature/login`, runs deploy-production
   - Scenario B: Maintainer merges MR into `main`, runs deploy-production, one approver already approved
   - Scenario C: Developer tries to approve their own deploy
3. For each scenario show a **step-by-step flow**: arrows and check blocks, each check — green "passed" or red "blocked".
4. Display a **final verdict** as a large block: "Deploy allowed" (green) or "Deploy blocked" (red) with an explanation of the reason.
5. Show a **YAML config** for the deploy-production job that updates when settings change (environment, when: manual, rules).

## Checklist

- [ ] Three configurator sections with toggles and parameters
- [ ] Three scenario buttons with descriptions
- [ ] Step-by-step check flow (at least 3 steps) with color indicators
- [ ] Large verdict block (Allowed / Blocked)
- [ ] Explanation of blocking or allowance reason
- [ ] YAML block updating on configuration change
- [ ] All three scenarios produce different results with different configurations

## How to Verify

1. Enable all three protection layers, select scenario A — should be blocked: feature branch is not protected
2. With the same settings, select scenario B, approvals = 2, already approved 1 — should be blocked: not enough approvals
3. Disable Environment Approvals, select scenario B — should be allowed (if maintainer has permission)
4. Enable Self-approval prohibition, select scenario C — should be blocked with explanation
5. Check that YAML updates when the number of approvals changes (comment in YAML)

## Hints

- Use `useState` for: `protectedBranch` (boolean), `mergeRole` ('developers'|'maintainers'|'owners'), `approvalsEnabled` (boolean), `requiredApprovals` (1|2|3), `selfApproval` (boolean), `scenario` (null|'A'|'B'|'C')
- Function `checkScenario(config, scenario)` → `{ passed: boolean, steps: CheckStep[], reason: string }`
- Check steps — array of objects: `{ name: string, passed: boolean, detail: string }`
- For scenario B: need `requiredApprovals` approvals, received 1 — if `requiredApprovals > 1` → blocked
- YAML: when `approvalsEnabled: true` add a comment `# requires ${requiredApprovals} approval(s)` to the environment section
