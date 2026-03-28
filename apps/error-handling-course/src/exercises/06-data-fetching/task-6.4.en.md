# Task 6.4: Fetch Recovery

## Goal
Implement data fetching with automatic retry attempts and progress visualization.

## Requirements
1. Create a fetch function that succeeds only on the 3rd attempt
2. Implement retry logic with maximum 3 attempts and 1 second delay
3. Show progress: each attempt is displayed in real-time
4. On success — show data
5. On exhausted attempts — show error + "Retry" button

## Checklist
- [ ] Function with controlled errors
- [ ] Retry logic with 3 attempts
- [ ] Real-time progress display
- [ ] Successful result after retry
- [ ] Restart button on complete failure
