# Task 1.1: Factory Method

## Objective

Implement the Factory Method pattern to create different notification types through a single interface.

## Requirements

1. Create a `Notification` interface with methods:
   - `send(message: string): string` — send the notification
   - `format(message: string): string` — format the message
2. Implement three classes that implement `Notification`:
   - `EmailNotification` — formats as HTML (`<html><body>...</body></html>`)
   - `SMSNotification` — trims to 160 characters
   - `PushNotification` — adds an emoji prefix
3. Create a union type `NotificationType = 'email' | 'sms' | 'push'`
4. Create a factory function `createNotification(type: NotificationType): Notification`
5. Demonstrate the creation and use of all notification types

## Checklist

- [ ] Interface `Notification` is defined with `send` and `format`
- [ ] Three classes implement the interface
- [ ] Union type `NotificationType` restricts valid values
- [ ] Factory function returns the interface, not a concrete class
- [ ] Demonstration — the button outputs send and format results

## How to verify

1. Click the run button
2. Verify that each notification type formats the message differently
3. Verify that `createNotification('email')` returns `Notification`, not `EmailNotification`
4. Try passing an invalid type — TypeScript should show an error
