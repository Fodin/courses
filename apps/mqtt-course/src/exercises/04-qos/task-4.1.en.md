# Task 4.1: QoS Levels (0, 1, 2)

## Goal

Understand the message delivery mechanism for each QoS level in MQTT. Learn to choose the appropriate level for different scenarios.

## Requirements

1. Open the QoS visualization and switch between levels 0, 1, 2
2. Click "Animate" for each level — watch the packet sequence
3. Study the difference in packet count: 1 → 2-4 → 4
4. Open the comparison table and study all parameters
5. Determine the correct QoS for each scenario below

## Checklist

- [ ] Viewed animations for all three QoS levels
- [ ] Understood that QoS 1 may deliver a message twice (DUP flag)
- [ ] Know that QoS 2 uses 4 packets: PUBLISH → PUBREC → PUBREL → PUBCOMP
- [ ] Read the comparison table
- [ ] Know QoS selection recommendations for OpenWRT

## How to Check Yourself

Choose QoS for each case:

| Scenario | QoS |
|---|---|
| Temperature sensor reading every 5 sec | ? |
| CO2 threshold exceeded alert | ? |
| Command to open a gas valve | ? |
| GPS tracker coordinates every second | ? |
| Financial transaction | ? |

Answers: 0, 1, 2, 0, 2
