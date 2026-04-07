# Task 5.2: ACL — Access Control Lists

## Goal

Learn to write Mosquitto ACL files. Understand rule syntax and order of application. Practice checking user access to topics.

## Requirements

1. Study the built-in ACL file in the editor
2. Check: can `sensor_kitchen` publish to `home/kitchen/temp`? (should be allowed)
3. Check: can `sensor_kitchen` publish to `home/living/temp`? (should be denied)
4. Check: can `dashboard` subscribe to `home/#`? (should be allowed)
5. Check: can `dashboard` publish to any topic? (should be denied)
6. Add a new user `automation` with permission to read `home/#` and write to `home/+/cmd`

## Checklist

- [ ] Understood rule order: first match is applied
- [ ] Know the difference between `read`, `write`, `readwrite`, `deny`
- [ ] Understood that `topic` without `user` is a global rule
- [ ] Understood that `%c` variable in `pattern` is replaced with client_id
- [ ] Know: if no matching rule exists → access is DENIED

## How to Check Yourself

Write ACL rules for the following requirements:

1. User `esp32-01` can only write to `sensor/esp32-01/#`
2. User `reader` can only read all topics `home/#`
3. All users can read `$SYS/broker/clients/connected`
4. Nobody except `admin` can write to `system/#`

Example rules:
```
topic read $SYS/broker/clients/connected

user esp32-01
topic write sensor/esp32-01/#

user reader
topic read home/#

user admin
topic readwrite #
topic write system/#
```
