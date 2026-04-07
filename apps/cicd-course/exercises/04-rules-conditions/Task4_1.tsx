// Task 4.1: rules:if — Decision Tree Simulator
//
// Goal: build an interactive simulator that shows which GitLab CI jobs
// will run depending on the pipeline event (push, MR, tag, schedule, etc.)
//
// Read task-4.1.md for full requirements and the expected data structures.

import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------

interface CIVariables {
  CI_COMMIT_BRANCH: string
  CI_PIPELINE_SOURCE: string
  CI_COMMIT_TAG: string
  CI_MERGE_REQUEST_IID: string
}

interface CIEvent {
  id: string
  label: string
  emoji: string
  variables: CIVariables
}

interface RuleCondition {
  label: string        // human-readable condition text
  when: string         // 'on_success' | 'never' | 'manual' | 'always'
  evaluate: (v: CIVariables) => boolean
}

interface CIJob {
  name: string
  rules: RuleCondition[]
}

// ---------------------------------------------------------------------------
// TODO 1: Define 5 CI events
// Each event sets the 4 CI variables to realistic values.
// Events: push-main, push-feature, merge-request, tag-release, schedule
// See task-4.1.md → "События для симуляции" table for exact variable values.
// ---------------------------------------------------------------------------
const ciEvents: CIEvent[] = [
  // TODO: fill in the events
]

// ---------------------------------------------------------------------------
// TODO 2: Define 5 CI jobs with rules:if
// Jobs: deploy-prod, test, mr-lint, release-publish, nightly-backup
// Each job has 2-3 rules. The last rule is always { when: 'never', evaluate: () => true }
// as a fallback (see theory: always end rules with an explicit fallback).
//
// Example structure:
// {
//   name: 'deploy-prod',
//   rules: [
//     { label: '$CI_COMMIT_BRANCH == "main" && ...', when: 'manual', evaluate: v => v.CI_COMMIT_BRANCH === 'main' && ... },
//     { label: 'when: never', when: 'never', evaluate: () => true },
//   ],
// }
// ---------------------------------------------------------------------------
const ciJobs: CIJob[] = [
  // TODO: fill in the jobs
]

// ---------------------------------------------------------------------------
// TODO 3: Implement evaluateJob — returns which rule matched and whether the job runs
//
// Walk through job.rules in order. Return the first rule where evaluate(vars) is true.
// Return: { runs: boolean, when: string, matchedRuleIndex: number }
// ---------------------------------------------------------------------------
function evaluateJob(job: CIJob, vars: CIVariables): { runs: boolean; when: string; matchedRuleIndex: number } {
  // TODO: implement
  return { runs: false, when: 'never', matchedRuleIndex: -1 }
}

// ---------------------------------------------------------------------------
// TODO 4: Implement the component
//
// Layout:
//   1. Row of 5 event buttons — clicking sets activeEventId
//   2. "Текущие переменные CI" panel — shows current variable values in monospace
//   3. Grid of job cards — each shows name, run status, and matched rule
//   4. (bonus) Click on a job card → expand decision tree showing each rule check
//
// Use useState for activeEventId (default 'push-main') and selectedJobName.
// ---------------------------------------------------------------------------

export function Task4_1() {
  const { t } = useLanguage()
  // TODO: add state
  const [activeEventId] = useState<string>('push-main')

  // TODO: derive activeEvent and vars from activeEventId

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h2>{t('task.4.1')}</h2>
      <p style={{ color: '#666' }}>
        {t('task.4.1.subtitle')}
      </p>

      {/* TODO: render event buttons */}

      {/* TODO: render CI variables panel */}

      {/* TODO: render job cards */}
    </div>
  )
}
