import { useState, useEffect } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 16.3: Alerting — конфигуратор алертов
// ============================================================
//
// Goal: implement an interactive alert rules configurator.
// Metrics are simulated automatically every 2 seconds.
// Users create alert rules (metric > threshold → severity),
// observe FIRING/RESOLVED states in real time.

// TODO: Declare types:
// type MetricId = 'consumer_lag' | 'queue_depth' | 'publish_rate' | 'error_rate'
// type Severity = 'warning' | 'critical'
// type AlertState = 'ok' | 'firing' | 'resolved'

// TODO: Declare the AlertRule interface.
// Fields: id: string, metric: MetricId, threshold: number,
//         severity: Severity, enabled: boolean

// TODO: Declare the AlertFiring interface.
// Fields: ruleId: string, metric: MetricId, currentValue: number,
//         threshold: number, severity: Severity, firedAt: number, state: AlertState

// TODO: Declare METRIC_META: Record<MetricId, { label: string; unit: string; defaultThreshold: number; min: number; max: number; step: number }>
// consumer_lag  → label 'Consumer Lag',  unit 'msgs',  defaultThreshold 1000, min 100,  max 10000, step 100
// queue_depth   → label 'Queue Depth',   unit 'msgs',  defaultThreshold 5000, min 100,  max 50000, step 500
// publish_rate  → label 'Publish Rate',  unit 'msg/s', defaultThreshold 1000, min 50,   max 5000,  step 50
// error_rate    → label 'Error Rate',    unit '%',     defaultThreshold 1,    min 0.1,  max 10,    step 0.1

// TODO: Declare SEVERITY_COLORS: Record<Severity, string>
// warning → '#ed8936', critical → '#e53e3e'

// TODO: Implement generateSimValue(metric: MetricId): number
// Returns a random value in a range appropriate for each metric:
//   consumer_lag → 0..2999 (integer)
//   queue_depth  → 0..14999 (integer)
//   publish_rate → 0..1199 (integer)
//   error_rate   → 0.0..4.9 (one decimal)

// Module-level counter for unique rule IDs
let ruleCounter = 1

export function Task16_3() {
  const { t } = useLanguage()

  // TODO: Declare state:
  // rules: AlertRule[] — initial 3 rules:
  //   { id: 'r1', metric: 'consumer_lag', threshold: 1000, severity: 'warning',  enabled: true }
  //   { id: 'r2', metric: 'consumer_lag', threshold: 5000, severity: 'critical', enabled: true }
  //   { id: 'r3', metric: 'error_rate',   threshold: 1,    severity: 'critical', enabled: true }
  // firing: AlertFiring[] (initial: [])
  // simValues: Record<MetricId, number> — initial values:
  //   { consumer_lag: 450, queue_depth: 2200, publish_rate: 380, error_rate: 0.3 }
  // newMetric: MetricId (initial: 'consumer_lag')
  // newThreshold: number (initial: 1000)
  // newSeverity: Severity (initial: 'warning')
  const [rules, setRules] = useState<any[]>([])
  const [firing, setFiring] = useState<any[]>([])
  const [simValues, setSimValues] = useState<any>({})
  const [newMetric, setNewMetric] = useState<any>('consumer_lag')
  const [newThreshold, setNewThreshold] = useState(1000)
  const [newSeverity, setNewSeverity] = useState<any>('warning')

  // TODO: Implement useEffect with setInterval(2000ms):
  // Each tick:
  //   1. Generate newVals for all 4 metrics via generateSimValue
  //   2. setSimValues(newVals)
  //   3. setFiring(prev => { ... }):
  //      For each enabled rule:
  //        val = newVals[rule.metric]
  //        isViolating = val > rule.threshold
  //        existing = prev.find(f => f.ruleId === rule.id && f.state === 'firing')
  //        if isViolating && !existing → push new AlertFiring { state: 'firing', firedAt: Date.now() }
  //        if !isViolating && existing → set existing.state = 'resolved', update currentValue
  //        if isViolating && existing  → update existing.currentValue
  //      Filter out resolved alerts older than 5000ms (Date.now() - firedAt > 5000)
  //      Return filtered next array
  // Cleanup: clearInterval
  useEffect(() => {
    // TODO: implement
    return () => {}
  }, [rules])

  // TODO: Implement addRule:
  // ruleCounter++
  // Append { id: `r${ruleCounter}`, metric: newMetric, threshold: newThreshold, severity: newSeverity, enabled: true }
  // Reset newThreshold to METRIC_META[newMetric].defaultThreshold
  const addRule = () => {
    // TODO: implement
  }

  // TODO: Implement removeRule(id: string):
  // Remove rule from rules where r.id === id
  // Remove related alerts from firing where f.ruleId === id
  const removeRule = (_id: string) => {
    // TODO: implement
  }

  // TODO: Implement toggleRule(id: string):
  // Toggle enabled for the rule with matching id
  const toggleRule = (_id: string) => {
    // TODO: implement
  }

  // TODO: Compute criticalCount = firing.filter(f => f.severity === 'critical' && f.state === 'firing').length
  // TODO: Compute warningCount  = firing.filter(f => f.severity === 'warning'  && f.state === 'firing').length

  return (
    <div className="exercise-container">
      <h2>{t('task.16.3')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Настройте правила алертинга. Метрики симулируются автоматически — наблюдайте срабатывания
        в реальном времени.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* ===== LEFT COLUMN: Alert Rules ===== */}
        <div>
          {/* TODO: heading "Правила алертинга ({rules.length})" */}

          {/* TODO: Add rule form (dashed border card, background #fafbfc):
              - Title "Новое правило" (uppercase, small)
              - select for newMetric: options from Object.keys(METRIC_META), labels from METRIC_META[m].label
                onChange: setNewMetric + reset newThreshold to defaultThreshold
              - number input for newThreshold: min/max/step from METRIC_META[newMetric]
                with unit label beside it
              - Two severity toggle buttons: 'warning' and 'critical'
                Active button: filled with SEVERITY_COLORS[sev], white text
                Inactive button: white bg, colored border and text
              - "+ Добавить правило" button (blue) — calls addRule
          */}
          <div style={{ padding: '0.75rem', border: '2px dashed #d0d7de', borderRadius: '8px', marginBottom: '0.75rem', background: '#fafbfc' }}>
            {/* TODO: form */}
          </div>

          {/* TODO: Rules list */}
          {/* For each rule:
              - Card with border SEVERITY_COLORS[rule.severity] if (isFiring && rule.enabled), else '#e2e8f0'
              - Background: faint severity color if firing, else white
              - Checkbox (checked = rule.enabled, onChange → toggleRule)
              - Metric name (bold) + threshold line: "> {threshold} {unit} → SEVERITY"
              - Current value: "сейчас: {simValues[rule.metric]}"
              - Badge "FIRING" (pulse animation) if isFiring && rule.enabled
              - "×" delete button → removeRule(rule.id)
              - Transition: 'all 0.3s ease'
          */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {rules.map(rule => (
              <div key={rule.id}>
                {/* TODO: rule card */}
              </div>
            ))}
          </div>
        </div>

        {/* ===== RIGHT COLUMN: Active Alerts Dashboard ===== */}
        <div>
          {/* TODO: heading "Active Alerts" */}

          {/* TODO: Summary cards — two side-by-side cards:
              Critical: count = criticalCount
                bg '#fff5f5' + border '#e53e3e' if count > 0, else '#f0fff4' + '#68d391'
                large number in matching color, label "CRITICAL"
              Warning: count = warningCount
                bg '#fffaf0' + border '#ed8936' if count > 0, else '#f0fff4' + '#68d391'
                large number in matching color, label "WARNING"
          */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            {/* TODO: summary cards */}
          </div>

          {/* TODO: Current metrics section with label "Текущие метрики":
              For each MetricId:
                - Row: metric label (left) | value + unit (right, colored)
                - Progress bar: width = Math.min((val / maxThreshold) * 100, 100)%
                  maxThreshold = max threshold among enabled rules for this metric (fallback to meta.max)
                  color: red if critical rule violated, orange if warning rule violated, green if ok
                  transition: 'width 0.4s ease, background 0.4s ease'
          */}
          <div style={{ marginBottom: '1rem' }}>
            {/* TODO: metrics bars */}
          </div>

          {/* TODO: Alerts list with label "Алерты":
              If firing.length === 0:
                Green "Все метрики в норме" placeholder
              Else for each alert in firing:
                Card with left border accent (SEVERITY_COLORS[alert.severity])
                Background: resolved → '#f9f9f9', firing → faint severity color
                Opacity: resolved → 0.6, firing → 1
                Title row: "[SEVERITY] MetricLabel" (left) | FIRING/RESOLVED badge (right)
                Sub-row: "{currentValue} {unit} > порог {threshold} {unit}"
          */}
          <div>
            {/* TODO: alerts list */}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: '#999' }}>
        Метрики симулируются каждые 2 секунды. Добавьте правила и наблюдайте срабатывания.
      </div>

      {/* TODO: Add CSS keyframe animation for the FIRING badge pulse effect */}
      {/* @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } } */}
      <style>{``}</style>
    </div>
  )
}
