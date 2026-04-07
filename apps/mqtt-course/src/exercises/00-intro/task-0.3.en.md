# Task 0.3: MQTT vs HTTP vs WebSocket vs AMQP

## Goal

Systematize knowledge of differences between protocols and solidify understanding of why MQTT is optimal for IoT. Implement an interactive comparison table with detailed description of each protocol.

---

## Requirements

1. Define the `Protocol` interface with fields: `name`, `shortName`, `color`, `bgColor`, `pattern`, `overhead`, `persistent`, `qos`, `broker`, `bidirectional`, `iot` (`'excellent' | 'good' | 'fair' | 'poor'`), `useCases: string[]`, `pros: string[]`, `cons: string[]`

2. Create a `protocols` array of 4 protocols: MQTT v5, HTTP/REST, WebSocket, AMQP 1.0. Data must be technically accurate.

3. Implement two display modes (toggle switch):
   - **Comparison table**: horizontal table, rows — criteria, columns — protocols. "IoT Suitability" row with visual rating (stars or color indicators)
   - **Detail view**: protocol selection via buttons, display of pros, cons, and typical use cases

4. In the table, at least 6 criteria rows: interaction pattern, header overhead, persistent connection, delivery guarantee, broker required, bidirectionality

5. In detail view for the selected protocol show: pros with ✅ icon, cons with ❌, use cases as tags

---

## Checklist

- [ ] Defined `Protocol` interface with all listed fields
- [ ] Array of 4 protocols with technically accurate data
- [ ] Toggle between "Table" and "Detail" modes
- [ ] At least 6 criteria rows in the table
- [ ] Column headers color-coded (each protocol has its own color)
- [ ] "IoT Suitability" row with visual rating
- [ ] Detail view: pros, cons, use cases
- [ ] Protocol selection buttons in detail view
- [ ] Correct typing (type `IoT` limited to 4 values)

---

## How to Check Yourself

1. Do you see the toggle between modes?
2. In table mode — 4 protocol columns with color coding?
3. "IoT Suitability" row — MQTT has the highest rating, AMQP the lowest?
4. Switch to "Detail" — do protocol selection buttons work?
5. Select HTTP — do you see its pros and cons?
6. Select MQTT — do use cases include IoT and smart home?
