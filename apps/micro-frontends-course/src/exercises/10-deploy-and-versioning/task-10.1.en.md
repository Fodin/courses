# Task 10.1: Deploy Pipeline Simulator

## Goal

Implement an interactive deploy simulator for four MFEs with step-by-step canary rollout and rollback support.

## Requirements

1. Display four MFE cards: Shell (v2.3.1 → v2.4.0), Catalog (v1.5.2 → v1.6.0), Cart (v3.0.0 → v3.1.0), Profile (v1.2.0 → v1.3.0)
2. "Deploy" button on each card starts a three-stage pipeline with progress bar:
   - Build (2 sec), Test (1.5 sec), Publish (1 sec)
3. After Publish, canary automatically enables at 5% traffic
4. In canary mode, show current percentage and "Promote" / "Rollback" buttons:
   - Promote increases percentage in stages: 5% → 25% → 50% → 100%
   - At 100%, deploy is considered complete
   - Rollback returns MFE to initial state (idle)
5. Version registry: table with columns MFE, Current Version, Previous, Status, Deployed
6. Event log: chronological list of last 30 events (Build started, Publish complete, Canary promoted, Rollback, etc.)
7. "Reset" button after completed deploy or rollback

## Checklist

- [ ] Four MFE cards with color identification
- [ ] Pipeline starts on "Deploy" click, button disabled during pipeline
- [ ] Progress bar smoothly fills during each stage
- [ ] Automatic stage transitions Build → Test → Publish
- [ ] Canary block with current percentage visualization (4 steps: 5/25/50/100%)
- [ ] Promote button disabled at 100%
- [ ] Rollback changes status to "Rolled back" and returns to idle after 2 seconds
- [ ] Version registry updates on deploy completion
- [ ] Event log with timestamps and color coding (info/success/error/warning)
- [ ] Multiple MFEs can deploy simultaneously (independent pipelines)
- [ ] Inline styles only, no CSS files

## How to Check Yourself

1. Click "Deploy Cart v3.1.0" — progress bar should animate through Build → Test → Publish
2. After Publish, canary appears at 5% — click Promote three times to reach 100%
3. After 100%, status changes to "Deployed", registry updates current version
4. Start Shell deploy and click Rollback at canary 5% — log should show "Rollback v2.4.0 → v2.3.1"
5. Start Catalog and Profile deploys simultaneously — they should run in parallel
