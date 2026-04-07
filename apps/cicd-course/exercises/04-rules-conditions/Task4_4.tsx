// Task 4.4: Rules Builder — combining if / changes / when conditions
//
// Goal: interactive constructor for complex rules configurations.
// The user adds rules (if + changes + when), sees the AND/OR logic visualised,
// runs a simulation to find the first matching rule, and gets a YAML preview.
//
// Read task-4.4.md for full requirements and the three preset configurations.

import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------

type WhenValue = 'on_success' | 'never' | 'manual' | 'always'

interface RuleEntry {
  id: number
  ifCondition: string   // e.g. '$CI_COMMIT_BRANCH == "main"'
  changes: string       // e.g. 'src/**/*'  (empty string = no changes filter)
  when: WhenValue
}

interface PresetConfig {
  name: string
  description: string
  rules: Omit<RuleEntry, 'id'>[]
}

// ---------------------------------------------------------------------------
// TODO 1: Define 3 preset configurations
// See task-4.4.md → "Готовые примеры конфигураций"
// Preset names: 'MR + изменения', 'Деплой на прод', 'Нагрузочные тесты'
// ---------------------------------------------------------------------------
const presets: PresetConfig[] = [
  // TODO: fill in the presets
]

// ---------------------------------------------------------------------------
// TODO 2: Define test events for the simulator
// At minimum: push-main, push-feature, mr-src (MR with src changes), tag, schedule
// Each event has an id, label, and a vars object (same shape as in Task 4.1).
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// TODO 3: Implement evaluateRuleIf(ifCondition, vars) → boolean
//
// Evaluate common condition strings against a vars object.
// You don't need a full expression parser — match the known strings used in presets.
// Return true when ifCondition is empty (no condition = always matches).
//
// Known conditions to support:
//   '$CI_COMMIT_BRANCH == "main"'
//   '$CI_PIPELINE_SOURCE == "merge_request_event"'
//   '$CI_PIPELINE_SOURCE == "schedule"'
//   '$CI_COMMIT_TAG =~ /^v\\d+\\.\\d+\\.\\d+$/'
//   '$CI_COMMIT_BRANCH == "main" && $CI_PIPELINE_SOURCE == "push"'
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// TODO 4: Implement findMatchedRule(rules, eventId) → number
//
// Walk through rules in order. Return the index of the first rule where:
//   evaluateRuleIf(rule.ifCondition, vars) is true
//   AND if rule.changes is set, the event implies those files changed
//     (simplification: only event 'mr-src' has changes in src/)
//
// Return -1 if no rule matches.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// TODO 5: Implement generateYaml(rules) → string
//
// Convert the rule list to a YAML string in GitLab CI format:
//
// rules:
//   - if: $CI_COMMIT_BRANCH == "main"
//     when: on_success
//   - if: $CI_PIPELINE_SOURCE == "merge_request_event"
//     changes:
//       - src/**/*
//     when: on_success
//   - when: never
//
// Rules without an ifCondition should omit the `if:` line.
// Rules without changes should omit the `changes:` block.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// TODO 6: Implement the component
//
// Layout:
//   1. "Готовые примеры" row — 3 buttons that load presets (replace current rules)
//   2. "Добавить правило" form:
//      - text input for `if` condition
//      - text input for `changes` pattern
//      - <select> for `when`
//      - "Добавить" button
//   3. Two-column section (visible only when rules.length > 0):
//      Left: rules list with AND/OR visualization + test simulator
//        - Between rules, show "OR" label
//        - Inside each rule, show IF / AND / CHANGES / WHEN badges
//        - "×" button to remove a rule
//        - Simulator: <select> with events + "Проверить" button
//          → highlight the first matched rule in green
//      Right: YAML preview (dark code block, updates reactively)
//
// State: rules[], nextId, newIf, newChanges, newWhen, testEventId, simResult (index | null)
// ---------------------------------------------------------------------------

export function Task4_4() {
  const { t } = useLanguage()
  const [rules, setRules] = useState<RuleEntry[]>([])
  const [nextId, setNextId] = useState(1)
  const [newIf, setNewIf] = useState('')
  const [newChanges, setNewChanges] = useState('')
  const [newWhen, setNewWhen] = useState<WhenValue>('on_success')
  const [simResult, setSimResult] = useState<number | null>(null)

  const addRule = () => {
    // TODO: append a new RuleEntry to rules using newIf, newChanges, newWhen
    // then reset the form fields and clear simResult
    void newIf; void newChanges; void newWhen // remove these when implemented
    setNextId(n => n + 1)
  }

  const removeRule = (id: number) => {
    // TODO: filter out the rule with this id and clear simResult
    void id // remove when implemented
  }

  const loadPreset = (preset: PresetConfig) => {
    // TODO: replace rules with preset.rules (each gets a new id from nextId)
    // update nextId accordingly and clear simResult
    void preset // remove when implemented
  }

  const runSimulation = () => {
    // TODO: call findMatchedRule and store result in simResult
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h2>{t('task.4.4')}</h2>
      <p style={{ color: '#666' }}>
        {t('task.4.4.subtitle')}
      </p>

      {/* TODO: preset buttons */}

      {/* TODO: add rule form */}

      {rules.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* TODO: rules list + simulator */}

          {/* TODO: YAML preview */}
        </div>
      )}

      {rules.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#bbb', border: '1px dashed #e0e0e0', borderRadius: '8px' }}>
          {t('task.4.4.emptyState')}
        </div>
      )}

      {/* Keep these to avoid unused variable warnings until implemented */}
      {void addRule}{void removeRule}{void loadPreset}{void runSimulation}
    </div>
  )
}
