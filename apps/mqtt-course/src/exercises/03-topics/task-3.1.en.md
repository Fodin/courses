# Task 3.1: Topic Hierarchy

## Goal

Visualize and study the MQTT topic tree structure using a smart home IoT example. Understand topic hierarchy design principles.

## Requirements

1. Study the ready-made smart home topic tree in the component
2. Click on each tree node and view the full topic path
3. Pay attention to the number of hierarchy levels
4. Try entering your own topic in the input field and analyze it
5. Study the wildcard subscription examples in the right column

## Checklist

- [ ] Viewed the full topic path for `home/living_room/light/state` (4 levels)
- [ ] Understood the difference between a leaf node (with value) and an intermediate node (with children)
- [ ] Clicked wildcard patterns in examples and understood their role
- [ ] Entered your own topic in the validation field
- [ ] Understood why topics should not start with `/`

## How to Check Yourself

Answer the questions:
- How many levels are in the topic `home/living_room/light/brightness`?
- What's the difference between `home/temperature` and `home/living_room/temperature`?
- Why don't identical names (`temperature`) in different branches conflict?

Correct answers: 4 levels; different hierarchy levels; because the full path (topic) is unique.
