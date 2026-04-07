# Task 8.3: Topic Filtering in a Bridge

## Goal

Master detailed message flow control through a Bridge: topic patterns, directions,
QoS, and prefix mapping for topic transformation during forwarding.

## Requirements

1. Create 4 topic rules with different directions and QoS:
   - `sensors/#` → out QoS 0 (telemetry, not critical)
   - `commands/#` ← in QoS 1 (commands, need delivery)
   - `status` ⇄ both QoS 1 (state synchronization)
   - `alerts/#` → out QoS 2 (critical events, exactly-once)
2. Add an example with prefix mapping: `sensors/#` → `home/sensors/#` on the remote
3. Create an interactive rule builder with pattern, direction, and QoS selection
4. Explain the loop risk when using `both`

## Checklist

- [ ] Four rule examples with different directions
- [ ] Explanation of each direction (in/out/both)
- [ ] Prefix mapping example with transformation visualization
- [ ] Rule builder: input fields + config line generation
- [ ] Warning about loops with `both`
- [ ] Component is clickable: clicking a rule expands its description

## How to verify

1. Verify that `sensors/#` is forwarded outward (out):
   ```bash
   mosquitto_pub -t sensors/temp -m "22.5"
   # On the remote broker: mosquitto_sub -t 'sensors/#' -C 1
   ```
2. Verify prefix mapping:
   ```bash
   # Configured: topic sensors/# out 0 "" home/
   mosquitto_pub -t sensors/temp -m "test"
   # On the remote: mosquitto_sub -t 'home/sensors/#' -C 1  → should receive "test"
   ```
3. Verify that `commands/#` arrives locally (in):
   ```bash
   # Publish on the remote:
   mosquitto_pub -h remote-broker -t commands/led -m "on"
   # Locally: mosquitto_sub -t 'commands/#' -C 1  → should receive "on"
   ```
4. Verify that topics outside the rules are NOT forwarded:
   ```bash
   mosquitto_pub -t private/data -m "secret"
   # On the remote: nothing should appear
   ```
