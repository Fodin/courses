# Task 0.1: Monolith vs Microservices

## Goal

Create an interactive component visualizing the process of decomposing a monolith into microservices.
The student clicks on modules inside the monolith, and they "exit" as independent services.

## Requirements

1. Display a monolith as a single block with several modules inside (at least 4 modules):
   Users, Orders, Payments, Inventory, Notifications, Reports
2. On click, a module smoothly moves from the monolith to the microservices section
3. Each extracted service is displayed as a separate block with a unique color
4. A progress bar shows how many modules have been decomposed out of the total
5. When all modules are decomposed — show a congratulation message
6. A "Reset" button returns all modules back into the monolith
7. The transition must have animation (CSS transition or CSS animation)

## Checklist

- [ ] Monolith is displayed as a bordered block
- [ ] Inside the monolith: at least 4 clickable modules
- [ ] Click moves the module to the microservices section
- [ ] Transition animation works
- [ ] Progress bar updates dynamically
- [ ] Congratulation message appears upon full decomposition
- [ ] "Reset" button works correctly
- [ ] Component uses `useLanguage` and `t('task.0.1')` for the heading

## How to Check Yourself

1. Open the task in the browser
2. Click on each module in sequence — it should disappear from the monolith and appear on the right
3. The progress bar should reach 100% on the last click
4. A congratulatory message should appear
5. The "Reset" button should return the monolith to its initial state
6. Make sure the animation is smooth (no abrupt jumps)