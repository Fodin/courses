# Task 7.3: SLO / Error Budget Calculator

## Objective

Create an interactive calculator that shows allowed downtime and error budget for different SLO levels and periods.

## Requirements

1. **SLO selection:**
   - 99% (two nines)
   - 99.9% (three nines)
   - 99.99% (four nines)
   - 99.999% (five nines)
2. **Period selection:**
   - Day (24 hours)
   - Month (30 days)
   - Quarter (90 days)
   - Year (365 days)
3. **Calculation and display:**
   - Allowed downtime (in minutes/hours/days — depending on scale)
   - Error budget in requests (given a specified RPS)
   - RPS (requests per second) input for error budget calculation
4. **Burn rate visualization:**
   - Current error rate input (e.g., 0.05%)
   - Burn rate calculation = (current error rate) / (allowed error rate)
   - Visual indicator: green (burn rate < 1), yellow (1–5), red (> 5)
   - Time remaining until budget exhaustion at current burn rate
5. **Comparison table** of all SLOs with downtime for the selected period

## Checklist

- [ ] SLO selection: 99%, 99.9%, 99.99%, 99.999%
- [ ] Period selection: day, month, quarter, year
- [ ] Allowed downtime calculation with correct units
- [ ] RPS input and error budget calculation in requests
- [ ] Burn rate: current error rate input
- [ ] Burn rate visualization (color scale)
- [ ] Remaining time until budget exhaustion calculation
- [ ] SLO comparison table

## How to Check Yourself

1. SLO 99.9%, period — month: allowed downtime ≈ 43.2 minutes
2. SLO 99.99%, period — year: allowed downtime ≈ 52.6 minutes
3. SLO 99.9%, RPS = 1000: error budget = 1000 * 0.001 * (seconds in period) requests
4. Burn rate 1.0 at SLO 99.9%: budget is consumed exactly over the selected period
5. Burn rate 10.0: budget is exhausted in 1/10 of the period
