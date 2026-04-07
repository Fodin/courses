# Task 3.2: Wildcards: + and #

## Goal

Master MQTT wildcard patterns (`+` and `#`) through interactive demonstration. Understand which topics match each pattern.

## Requirements

1. Launch the component and select the `home/+/temperature` pattern
2. Verify that only topics with exactly one level between `home` and `temperature` match
3. Switch to `home/#` — all topics with the `home/` prefix should match
4. Check `home/+/light/#` — a combination of both wildcards
5. Enter your own pattern and verify the result

## Checklist

- [ ] Understood that `+` replaces exactly one hierarchy level
- [ ] Understood that `#` replaces any number of levels and must be at the end only
- [ ] Saw that `home/temperature` does NOT match `home/+/temperature`
- [ ] Entered and tested your own custom pattern
- [ ] Remembered: wildcards are for subscriptions only, not for publishing

## How to Check Yourself

Determine without running, whether the pattern and topic match:

| Pattern | Topic | Match? |
|---|---|---|
| `home/+/temperature` | `home/living_room/temperature` | ? |
| `home/+/temperature` | `home/floor1/room1/temperature` | ? |
| `home/#` | `home/kitchen/smoke_alarm` | ? |
| `+/+/temperature` | `office/room1/temperature` | ? |
| `home/+/light/#` | `home/bedroom/light/rgb/r` | ? |

Answers: ✅, ❌, ✅, ✅, ✅
