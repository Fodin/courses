import { useState, useRef, Profiler } from 'react'
import type { ProfilerOnRenderCallback } from 'react'
import { useLanguage } from 'src/hooks'

// TODO: implement SlowComponent
// It should accept a "value" prop (number)
// Simulate a slow render with a busy-wait loop of ~2ms using performance.now()
// Display the current value in its output
function SlowComponent({ value }: { value: number }) {
  // TODO: add ~2ms busy wait here

  return (
    <div>
      {/* TODO: display value */}
    </div>
  )
}

// Type for a single render record
type RenderRecord = {
  phase: string
  actualDuration: number
  baseDuration: number
  startTime: number
  commitTime: number
}

export function Task0_3() {
  const { t } = useLanguage()

  // TODO: store render history in useRef (array of RenderRecord)
  // Why useRef? We don't want render history updates to cause cascading re-renders
  const renders = useRef<RenderRecord[]>([])

  // TODO: add a state to force table re-render when new profiler data arrives
  const [, forceUpdate] = useState(0)

  // TODO: add state for the value passed to SlowComponent
  const [value, setValue] = useState(0)

  // TODO: implement the onRender callback
  // Signature: (id, phase, actualDuration, baseDuration, startTime, commitTime) => void
  // Push a new RenderRecord to renders.current
  // Then call forceUpdate(n => n + 1) to re-render the table
  const handleRender: ProfilerOnRenderCallback = (
    _id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) => {
    // TODO: push record and force update
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.0.3')}</h2>

      {/* TODO: wrap SlowComponent with <Profiler id="slow-component" onRender={handleRender}> */}
      <SlowComponent value={value} />

      {/* TODO: add two buttons */}
      {/* Button 1: "Обновить значение" — setValue(v => v + 1) */}
      {/* Button 2: "Тот же value" — setValue(value) */}
      <div style={{ display: 'flex', gap: '12px', margin: '20px 0' }}>
        {/* buttons here */}
      </div>

      {/* TODO: render a table with columns: #, Phase, Actual (ms), Base (ms) */}
      {/* Map over renders.current to create rows */}
      {/* Round duration values with .toFixed(2) */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Phase</th>
            <th>Actual (ms)</th>
            <th>Base (ms)</th>
          </tr>
        </thead>
        <tbody>
          {/* TODO: map renders.current here */}
        </tbody>
      </table>
    </div>
  )
}
