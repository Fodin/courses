# Task 0.3: Trade-offs Calculator

## Goal

Create an interactive calculator that, based on project criteria, dynamically
recommends an architectural approach: monolith, microservices, or modular monolith.

## Requirements

1. Display at least 5 criteria for evaluation (sliders or buttons for selecting values 1-5):
   - Team size
   - Deploy frequency
   - Failure isolation criticality
   - Scaling needs
   - Infrastructure maturity
2. For each criterion — a short description of what value 1 and value 5 mean
3. Dynamically recalculate the result when any criterion changes
4. Show two progress bars: monolith score and microservices score (in percent)
5. Based on the calculation, output one of three recommendations:
   - **Monolith** — clear monolith advantage
   - **Microservices** — clear microservices advantage
   - **Modular Monolith** — no clear winner (intermediate option)
6. Recommendation should include a brief rationale (2-3 sentences)

## Checklist

- [ ] At least 5 criteria with selectable values
- [ ] Each criterion has a description of values
- [ ] Dynamic recalculation when any criterion changes
- [ ] Two progress bars (monolith vs microservices) with animation
- [ ] Three possible results (monolith / modular monolith / microservices)
- [ ] Text rationale for the recommendation
- [ ] Component uses `useLanguage` and `t('task.0.3')` for the heading

## How to Check Yourself

1. Set all criteria to 1 — should recommend "Monolith"
2. Set all criteria to 5 — should recommend "Microservices"
3. Set mixed values — should show "Modular Monolith"
4. Progress bars should animate on every criterion change
5. Make sure the recommendation contains meaningful rationale for all three variants