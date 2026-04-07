# Task 5.1: Password File (password_file)

## Goal

Learn to manage Mosquitto users via `password_file`. Know the `mosquitto_passwd` commands for creating, updating, and deleting users.

## Requirements

1. Study the list of existing users in the component
2. Add a new user with the `sensor` role
3. Add a user with the `dashboard` role
4. View the password file contents — verify passwords are hashed
5. View the `mosquitto.conf` configuration with `allow_anonymous false`

## Checklist

- [ ] Know the command for creating a new password file (`-c` flag)
- [ ] Know the command for adding a user without recreating the file
- [ ] Understood that passwords are stored as PBKDF2-SHA512 hashes
- [ ] Know the command for applying changes without restart (`kill -HUP`)
- [ ] Understood the difference between `allow_anonymous true` and `allow_anonymous false`

## How to Check Yourself

On a real broker:
```bash
# Create a file and add admin (will prompt for password)
mosquitto_passwd -c /etc/mosquitto/passwd admin

# Add more users
mosquitto_passwd /etc/mosquitto/passwd sensor1

# Verify connection
mosquitto_pub -u admin -P <password> -t 'test' -m 'hello'

# Verify anonymous is rejected
mosquitto_pub -t 'test' -m 'hello'
# Expected: Connection Refused
```

Answer: why is it dangerous to use `mosquitto_passwd -b user password` in production?

Answer: the password remains in shell history (`~/.bash_history`) and is visible to other system users.
