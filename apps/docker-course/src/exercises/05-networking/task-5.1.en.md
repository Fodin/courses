# Task 5.1: Bridge Network

## Objective

Understand the Docker networking model: network driver types, differences between the default bridge and user-defined bridge networks, and architecture visualization.

## Requirements

1. Create an interactive component with three sections: "Network Drivers", "Bridge Architecture", "Default vs Custom"
2. "Network Drivers" section — a list of all 5 Docker drivers (bridge, host, none, overlay, macvlan) with a description and use cases. Highlight bridge as the default driver
3. "Bridge Architecture" section — a text diagram (ASCII in a `<pre>` block) showing: the host machine, the virtual bridge, containers with IP addresses, NAT/iptables, and the connection to the outside world. Add an explanation below the diagram
4. "Default vs Custom" section — a comparison table with at least 5 rows: DNS by name, isolation, hot connect, subnet configuration, recommendation. Add a summary recommendation
5. Use tabs to switch between sections

## Hints

- For the driver list: an array of objects `{ driver, desc, use }`
- For the table: an array `{ feature, default, custom }`
- Use `useState<'drivers' | 'diagram' | 'comparison'>` for tab switching
- ASCII diagram in a `<pre>` block with a monospace font

## Checklist

- [ ] Three sections switchable via tabs/buttons
- [ ] All 5 network drivers listed with descriptions
- [ ] Bridge highlighted as the default driver
- [ ] ASCII architecture diagram with an explanation
- [ ] Comparison table with at least 5 rows
- [ ] Summary recommendation on using user-defined networks

## How to Verify

1. Switch between sections — each should display its own content
2. In the driver list, bridge should be visually highlighted
3. The diagram should be readable and show the traffic flow
4. The comparison table should convincingly show the advantages of a custom bridge
