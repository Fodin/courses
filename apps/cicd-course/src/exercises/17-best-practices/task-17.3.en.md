# Task 17.3: CI/CD Metrics — Team Health Dashboard

## Goal

Create an interactive DORA metrics dashboard that shows the "health" of the team's CI/CD processes and provides improvement recommendations.

## Requirements

1. Display 4 DORA metrics: **Deployment Frequency**, **Lead Time for Changes**, **Change Failure Rate**, **Time to Restore**
2. For each metric, implement interactive input (slider or value selection buttons)
3. Based on current values, determine the team level: **Elite**, **High**, **Medium**, **Low** — with color coding (green/blue/yellow/red)
4. Show the team's overall level (by the weakest metric, as in real DORA)
5. For each metric with Medium or Low value, show a specific recommendation (e.g., "Lead Time 3 days → adopt trunk-based development and reduce MR size")
6. Add a "Pipeline History" section — 5 recent launches with a "Simulate" button: pressing adds a new launch (random success or error), recalculates Change Failure Rate
7. Show a "How to Improve Lead Time" flowchart when clicking on that metric

## Checklist

- [ ] 4 DORA metric cards with current value and level (color + text)
- [ ] Interactive input for each metric (slider or select)
- [ ] Automatic Elite/High/Medium/Low level determination
- [ ] Team overall level with explanation
- [ ] Recommendations for Medium/Low (at least for 2 metrics)
- [ ] History of 5 launches (green/red circle + time)
- [ ] "Simulate Deploy" button adds a launch and updates CFR
- [ ] Threshold values visible next to each metric

## How to Verify

1. Set Deployment Frequency = "once a week" — the card turns yellow (Medium), a recommendation appears
2. Set all metrics to maximum — overall level "Elite", everything green
3. Press "Simulate Deploy" several times — history updates, CFR recalculates
4. At CFR > 10% a recommendation about testing or canary appears
5. Team overall level is determined by the worst metric (verify: if 3 Elite + 1 Low = overall Low)

## Hints

- DORA thresholds for Deployment Frequency: Elite = multiple times a day, High = once a day, Medium = once a week, Low = once a month
- Lead Time: Elite < 1h, High < 1 day, Medium 1-7 days, Low > week
- Change Failure Rate: Elite < 5%, High < 10%, Medium 15-45%, Low > 45%
- Time to Restore: Elite < 1h, High < 1 day, Medium < week, Low > week
- `useState` for: each metric value (4 state), `deployHistory` (array of boolean)
- For history use `Math.random() > 0.25` — 25% error probability on simulation
