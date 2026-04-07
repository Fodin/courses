# Task 5.3: Authentication Plugins

## Goal

Get acquainted with available authentication mechanisms for Mosquitto: from the built-in Dynamic Security Plugin to third-party solutions. Learn to choose the right mechanism for OpenWRT.

## Requirements

1. Study all 4 plugin options in the component
2. Find which plugin has "Full" OpenWRT support — there should be 2 options
3. View the configuration example for each plugin
4. Determine: which plugin to choose for OpenWRT with 50 devices?
5. Determine: which plugin to choose if devices need to be added without restart?

## Checklist

- [ ] Understood the difference between `password_file` and `Dynamic Security Plugin`
- [ ] Know the Dynamic Security initialization command: `mosquitto_ctrl dynsec init`
- [ ] Understood why `mosquitto-go-auth` is problematic on OpenWRT (musl libc)
- [ ] Know the JWT authentication concept in MQTT (password = JWT token)
- [ ] Can choose an authentication mechanism for specific requirements

## How to Check Yourself

Choose the right mechanism for each scenario:

| Scenario | Mechanism |
|---|---|
| OpenWRT router, 10 sensors, static configuration | ? |
| OpenWRT router, 100 sensors, adding without restart | ? |
| Server with PostgreSQL, thousands of users | ? |
| Microservice architecture with OAuth2/JWT | ? |

Answers:
- Password File + ACL (simplicity, no dependencies)
- Dynamic Security Plugin (dynamic management, built-in)
- mosquitto-go-auth with postgres backend
- mosquitto-go-auth with jwt backend or custom HTTP API

Explain: why an administrative user is needed when using Dynamic Security Plugin and why their password is especially important to protect?

Answer: the dynamic security administrator can create/delete users via MQTT topics `$CONTROL/dynamic-security/v1`. Compromising this account gives full control over broker authentication.
