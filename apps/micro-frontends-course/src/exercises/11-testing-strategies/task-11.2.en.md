# Task 11.2: Test Plan Builder

## Goal

Create an interactive test plan builder for an MFE system: configure testing levels for each MFE, select mock strategy and CI trigger, generate test matrix in JSON format.

## Requirements

1. MFE list with ability to add new (input + button) and delete existing ("×" button)
2. For each MFE — checkboxes: Unit / Contract / Integration / E2E / Visual
3. "Mock Strategy" select: real remotes / mock remotes / hybrid
4. "CI trigger" select: Every PR / Nightly / Pre-release / Manual
5. "Generate test matrix" button starts validation and generation
6. Validation (blocks generation on `error` type):
   - `error`: each MFE must have Unit tests
   - `warning`: with 2+ MFEs, Contract testing is recommended for at least one
   - `warning`: E2E is recommended for at least one MFE
7. Generation result:
   - Pipeline: list of stages with MFE and time
   - Optimization recommendations (if pipeline > 40 min, if many MFEs with real remotes, etc.)
   - JSON with `mockStrategy`, `ciTrigger`, `pipeline`, `matrix`
8. On any parameter change — generated result resets

## Checklist

- [ ] MFE added via input (Enter or button), deleted via "×"
- [ ] Testing level checkboxes for each MFE
- [ ] Mock strategy and CI trigger selection
- [ ] Validation: error for missing Unit, warnings for contract/e2e
- [ ] Pipeline generation with stages and time
- [ ] Recommendations: at least 1 when pipeline > 40 min
- [ ] JSON output with correct structure
- [ ] Parameter changes reset the result

## How to Check Yourself

1. Uncheck Unit for "Cart" → click generate → error "Cart: Unit test required" should appear
2. Add new MFE "Payment" and enable only E2E → Unit error again
3. Restore Unit for all, uncheck Contract for all → warning about contract with 2+ MFEs
4. Enable all levels for all MFEs → pipeline should exceed 40 min, recommendation appears
5. Select "Mock remotes" + 4+ MFEs → recommendation to consider hybrid
6. Change CI trigger → JSON updates after regeneration
