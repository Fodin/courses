# Assignment 0.2: Latency Calculator

## Goal

Build an interactive component that visualizes what stages make up HTTP request latency and shows a waterfall diagram.

## Requirements

1. Create a component with a chain of request stages: DNS Lookup, TCP Handshake, TLS Handshake, HTTP Request, Server Processing, Response Transfer
2. Add a slider or input field for each stage to configure delay (in ms)
3. Calculate and display total latency
4. Visualize a waterfall diagram: horizontal bars for each stage, arranged sequentially
5. Add scenario presets: "Local Network", "Single Continent", "Intercontinental Request"
6. Show how keep-alive and DNS caching affect repeat requests

## Checklist

- [ ] Displays a list of all request stages with configurable delays
- [ ] Total latency is automatically recalculated when any parameter changes
- [ ] Waterfall diagram visually shows the duration of each stage
- [ ] At least 3 presets with realistic delay values
- [ ] Shows the difference between first and repeat requests (DNS cache, keep-alive)
- [ ] Component uses `useState` for state management

## How to Check Yourself

1. Open the assignment in the browser
2. Switch between presets — delay values should update
3. Change one stage value — total latency and waterfall should update
4. Compare first and repeat requests — repeat should be faster
5. Verify that total latency equals the sum of all stages
