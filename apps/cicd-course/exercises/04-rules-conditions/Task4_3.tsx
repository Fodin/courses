// Task 4.3: workflow:rules — Pipeline Deduplication Simulator
//
// Goal: visualise the duplicate-pipeline problem (branch + MR events both
// create pipelines) and show how workflow:rules eliminates the duplicate.
//
// Read task-4.3.md for full requirements and the simulation scenario.

import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------

type PipelineStatus = 'created' | 'blocked'
type PipelineType = 'branch' | 'mr'

interface PipelineEntry {
  id: number
  type: PipelineType
  source: string        // CI_PIPELINE_SOURCE value shown in the card
  status: PipelineStatus
  reason?: string       // shown when status === 'blocked'
  minutes: number       // 5 for created, 0 for blocked
  event: string         // human-readable event description
}

// ---------------------------------------------------------------------------
// TODO 1: Implement doPush
//
// When the user clicks "git push feature/auth":
//   - Always create a branch pipeline (status: 'created', source: 'push', minutes: 5)
//   - Append it to sim.pipelines
//   - Set sim.hasPushed = true
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// TODO 2: Implement doOpenMR
//
// When the user clicks "Открыть MR":
//   Mode "without workflow:rules":
//     - Create an MR pipeline (source: 'merge_request_event', minutes: 5)
//     - Also create a duplicate branch pipeline (source: 'push (дубль)', minutes: 5)
//       because without rules both events fire
//
//   Mode "with workflow:rules":
//     - Create an MR pipeline (source: 'merge_request_event', minutes: 5)
//     - Create a BLOCKED branch pipeline (status: 'blocked', minutes: 0)
//       reason: '$CI_COMMIT_BRANCH && $CI_OPEN_MERGE_REQUESTS → when: never'
//
//   Set sim.hasMR = true
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// TODO 3: Implement the component
//
// Layout:
//   1. Mode toggle buttons: "Без workflow:rules" / "С workflow:rules"
//      Switching mode resets the simulation.
//   2. Left column: action buttons
//      - "git push feature/auth" (always enabled)
//      - "Открыть MR → main" (enabled only after push)
//      - "Сбросить" button
//      - Stats box: total runner-minutes, active pipeline count
//        Warn when minutes > 5 (duplication detected)
//   3. Right column: pipeline cards
//      - Each card shows: #id, type label, CI_PIPELINE_SOURCE, status badge
//      - Blocked cards are greyed out with the block reason
//   4. (only in "С workflow:rules" mode) Show the workflow:rules YAML block
//
// Use useState for: mode ('without' | 'with'), pipeline list, hasPushed, hasMR, nextId
// ---------------------------------------------------------------------------

interface SimState {
  hasPushed: boolean
  hasMR: boolean
  pipelines: PipelineEntry[]
  nextId: number
}

const RUNNER_MINUTES = 5

const workflowYaml = `workflow:
  rules:
    # MR-пайплайн — если есть MR
    - if: $CI_MERGE_REQUEST_IID

    # Блокировать branch, если уже создастся MR-пайплайн
    - if: $CI_COMMIT_BRANCH && $CI_OPEN_MERGE_REQUESTS
      when: never

    # Branch-пайплайн без MR
    - if: $CI_COMMIT_BRANCH`

export function Task4_3() {
  const { t } = useLanguage()
  const [mode, setMode] = useState<'without' | 'with'>('without')
  const [sim, setSim] = useState<SimState>({ hasPushed: false, hasMR: false, pipelines: [], nextId: 1 })

  const reset = () => setSim({ hasPushed: false, hasMR: false, pipelines: [], nextId: 1 })

  const doPush = () => {
    // TODO: implement — see TODO 1 above
  }

  const doOpenMR = () => {
    // TODO: implement — see TODO 2 above
    // Access `mode` to decide which pipelines to create
    void mode           // remove this line when you implement the function
    void RUNNER_MINUTES // remove this line when you implement the function
  }

  // TODO: compute totalMinutes and activePipelines from sim.pipelines

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h2>{t('task.4.3')}</h2>
      <p style={{ color: '#666' }}>
        {t('task.4.3.subtitle')}
      </p>

      {/* TODO: mode toggle */}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* TODO: actions column */}

        {/* TODO: pipelines column */}
      </div>

      {/* TODO: show workflow:rules YAML only in "with" mode */}
      {/* workflowYaml is available above */}
      {void workflowYaml}
    </div>
  )
}
