# Task 6.2: API Version Migration Timeline

## Goal

Create an interactive timeline showing the deprecation and sunset process for an API version: from the release of a new version to the complete removal of the old one.

## Requirements

1. Show a timeline of 5 stages: v2 Release, Deprecation Notice, Sunset Date, Migration Guide, v1 Removal
2. Implement a horizontal progress bar with clickable circle stages
3. Click on a circle or button to switch to that stage
4. For each stage, show:
   - Name and icon
   - Description of what happens
   - The HTTP header the server returns at this stage
5. "Back" / "Next" buttons for sequential navigation
6. A block with an explanation of RFC 8594

## Checklist

- [ ] Horizontal timeline with a filling progress line
- [ ] Clickable circle stages
- [ ] Completed stages show an icon, uncompleted show an empty circle
- [ ] Progress color and card border change to match the current stage color
- [ ] Response header displayed in a dark code block
- [ ] "Hide/Show" button for the header
- [ ] Navigation buttons disabled on first/last step
- [ ] Information block about RFC 8594

## How to Check Yourself

- Initial step — v2 Release (green). Header: `X-API-Version: 2.0`
- Deprecation step (yellow). Header: `Deprecation: Tue, 01 Jan 2025 00:00:00 GMT`
- Sunset step (orange). Header: `Sunset: Tue, 01 Jul 2025 00:00:00 GMT`
- Migration Guide step (blue). Header: `Link: <...>; rel="successor-version"`
- Last step — v1 Removal (red). Shows `HTTP/1.1 410 Gone`
- "Next" button is disabled on the last step
