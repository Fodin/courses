# Task 8.1: MQTT Bridge Concept

## Goal

Understand the MQTT Bridge architecture: how Mosquitto connects two brokers, when it's needed,
and what topologies exist.

## Requirements

1. Create a component with three Bridge use-case scenarios:
   - OpenWRT local network → Cloud (AWS IoT, HiveMQ Cloud, etc.)
   - Two offices/sites via VPN or internet
   - Hierarchy: multiple edge brokers → central broker
2. For each scenario, show an ASCII data flow diagram
3. Add an explanation of "how it works under the hood" (Mosquitto as MQTT client)
4. For each scenario, list specific use cases (at least 3)

## Checklist

- [ ] Three use-case scenarios with toggle buttons
- [ ] ASCII diagram for each scenario
- [ ] Description of the mechanism (one broker as client of another)
- [ ] List of use cases (3+ for each)
- [ ] Information block explaining the concept at the top of the component

## How to verify

1. Check your understanding: can you explain why IoT devices don't know
   about the cloud when using a Bridge?
2. In which direction (in/out) should the Bridge be configured to receive commands from the cloud
   to local devices?
3. How does Bridge differ from simply opening port 1883 to the internet?
