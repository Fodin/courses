import { useState, useEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

export function Task0_2() {
  const { t } = useLanguage()

  // TODO: create renderCount with useRef (not useState!)
  // Increment it directly in the function body: renderCount.current++
  // Why useRef? It doesn't cause a re-render when changed.
  const renderCount = useRef(0)

  // TODO: create commitCount with useState
  // Increment it inside useEffect with NO dependency array
  // Why? useEffect without deps runs after every commit — that's exactly what we want to count.
  const [commitCount, setCommitCount] = useState(0)

  // TODO: create a "trigger" state for the Force re-render button
  // Hint: useState(0), button onClick calls setTrigger(n => n + 1)
  const [trigger, setTrigger] = useState(0)

  // TODO: create a "sameValue" state for the Same value button
  // Button will always call setSameValue(0), so if it's already 0 — React may bail out
  const [sameValue, setSameValue] = useState(0)

  // TODO: increment renderCount.current here (in the function body, before return)

  // TODO: add useEffect that increments commitCount after every commit

  return (
    <div className="exercise-container">
      <h2>{t('task.0.2')}</h2>

      {/* TODO: display renderCount.current and commitCount side by side */}
      {/* Label the first "Render (вызовов функции)" and the second "Commit (обновлений DOM)" */}
      <div style={{ display: 'flex', gap: '24px', margin: '24px 0' }}>
        <div>
          <div>Render (вызовов функции)</div>
          <div style={{ fontSize: '48px' }}>{/* renderCount.current */}</div>
        </div>
        <div>
          <div>Commit (обновлений DOM)</div>
          <div style={{ fontSize: '48px' }}>{/* commitCount */}</div>
        </div>
      </div>

      {/* TODO: add two buttons */}
      {/* Button 1: "Force re-render" — calls setTrigger(n => n + 1) */}
      {/* Button 2: "Same value setState" — calls setSameValue(0) */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {/* buttons here */}
      </div>

      {/* TODO: add explanatory text below the buttons */}
      {/* Explain what the user should observe when clicking each button */}

      {/* Keep trigger in JSX so React sees it as a dependency */}
      <span style={{ display: 'none' }}>{trigger}{sameValue}</span>
    </div>
  )
}
