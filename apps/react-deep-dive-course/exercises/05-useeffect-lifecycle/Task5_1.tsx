import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// Task 5.1: Effect Timeline
// Build an interactive timeline that logs the order of render, useLayoutEffect,
// browser paint (requestAnimationFrame), and useEffect callbacks.

// The goal is to observe with your own eyes:
//   render() → useLayoutEffect callback → rAF (paint) → useEffect callback
// And cleanup order on subsequent renders:
//   useLayoutEffect cleanup → useEffect cleanup → [new callbacks]

type TimelineEvent = {
  id: number
  type: 'render' | 'layoutEffect' | 'layoutCleanup' | 'paint' | 'effect' | 'cleanup'
  label: string
  ts: number
  color: string
}

export function Task5_1() {
  const { t } = useLanguage()

  // TODO: add a tick state (number) to trigger re-renders
  // TODO: add an events state (TimelineEvent[]) to hold the log
  // TODO: add an eventsRef to accumulate events without triggering extra renders

  // TODO: inside the render body (before any hooks), log a 'render' event
  //   - use eventsRef to avoid triggering a re-render
  //   - only log when tick > 0

  // TODO: add useLayoutEffect (no deps — runs every render)
  //   - log 'layoutEffect' event
  //   - inside it, schedule requestAnimationFrame that logs 'paint' event
  //   - return cleanup that logs 'layoutCleanup'

  // TODO: add useEffect (no deps — runs every render)
  //   - log 'effect' event
  //   - return cleanup that logs 'cleanup'

  // TODO: implement handleRun — sets tick, resets eventsRef and events
  // TODO: implement handleClear — resets everything to initial state

  return (
    <div className="exercise-container">
      <h2>{t('task.5.1')}</h2>

      {/* TODO: render "Запустить" and "Очистить" buttons */}

      {/* TODO: render a legend showing colors for each event type */}

      {/* TODO: render a vertical timeline:
            - if no events: show placeholder text
            - if events exist: map over events, show numbered circles + event cards
            - each card shows: event label (colored) + timestamp in ms */}

      {/* TODO: add a note explaining the expected order */}
    </div>
  )
}
