# Task 9.1: Environment Lifecycle

## Goal

Create an interactive visualization of three environments (dev, staging, production) with the ability to simulate deploy, rollback, and stop of each environment. Show how state and deployment history changes.

## Requirements

1. Display three environment cards: `dev`, `staging`, `production` — each with its name, URL, and current status
2. Each card shows the current version (deploy number), last deploy date, and status (`active`, `stopped`)
3. "Deploy" button on each card — increments version number, updates date, sets to `active`
4. "Stop" button — sets the environment to `stopped`, Deploy button should reactivate it
5. "Rollback" button — decrements version by 1 (minimum version 1), if environment is `active`
6. Deployment history — last 3 deploys for each environment (version + date)
7. Visual separation: dev (blue), staging (yellow/orange), production (red)

## Checklist

- [ ] Three environment cards with name, URL, and color coding
- [ ] Current version and last deploy date on each card
- [ ] Status badge: `active` (green) / `stopped` (gray)
- [ ] Deploy button — updates version and date
- [ ] Stop button — sets to stopped, disables Rollback
- [ ] Rollback button — rolls back version, unavailable when stopped or at version 1
- [ ] History of last 3 deploys below or inside the card
- [ ] Rollback and Stop buttons are disabled (disabled) in irrelevant states

## How to Verify

1. Press Deploy on staging — version should increment, date update, status become active
2. Press Stop — status should become stopped, Rollback button should be unavailable
3. Press Deploy again — environment should return to active with a new version
4. Press Rollback three times — at version 1 the button should be disabled
5. Check the history — last 3 deploys should be displayed

## Hints

- Store for each environment: `version` (number), `status` ('active' | 'stopped'), `history` (array of objects {version, date})
- `useState` with an array of 3 environment objects is more convenient than 3 separate useState
- Use `new Date().toLocaleString()` for date formatting
- `disabled` for Rollback: `env.status === 'stopped' || env.version === 1`
