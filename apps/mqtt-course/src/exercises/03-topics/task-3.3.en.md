# Task 3.3: System Topics $SYS

## Goal

Study Mosquitto system topics ($SYS) for broker monitoring. Know where to find information about clients, messages, traffic, and load.

## Requirements

1. Open the $SYS topics reference in the component
2. Find topics for monitoring the number of connected clients
3. Identify topics for tracking traffic in bytes
4. Find load topics (moving average over 1/5/15 minutes)
5. Click on several topics — copy the commands and study their format

## Checklist

- [ ] Know the topic for the current number of connected clients
- [ ] Know the topic for the total number of sent messages
- [ ] Understood the difference between `messages/sent` and `publish/messages/sent`
- [ ] Found load topics and understood the meaning of 1min/5min/15min
- [ ] Understood why single quotes are needed in the shell when working with `$SYS`

## How to Check Yourself

On a real or training broker, run:
```bash
# Subscribe to all system topics
mosquitto_sub -v -t '$SYS/#'

# After 10 seconds, check the values:
# - How many clients are connected?
# - How many messages have been sent?
# - What is the load over the last minute?
```

If there's no broker, explain: what is the `sys_interval` parameter in `mosquitto.conf` for?

Answer: `sys_interval` sets the frequency of $SYS topic publication in seconds. `sys_interval 0` disables publication.
