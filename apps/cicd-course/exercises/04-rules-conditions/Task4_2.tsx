// Task 4.2: rules:changes — File Change Simulator
//
// Goal: render an interactive file tree where the user checks "changed" files
// and sees in real-time which CI jobs would be triggered by rules:changes.
//
// Read task-4.2.md for full requirements and the file structure.

import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------

interface FileNode {
  path: string    // full path used as key and for glob matching
  name: string    // display name (with trailing / for dirs)
  isDir: boolean
  depth: number   // indentation level
}

interface CIJob {
  name: string
  patterns: string[]   // glob patterns for rules:changes
}

// ---------------------------------------------------------------------------
// TODO 1: Define the file tree
// Use the structure from task-4.2.md:
//   frontend/ (depth 0) → src/ (depth 1) → App.tsx, Button.tsx (depth 2)
//                       → package.json, webpack.config.js (depth 1)
//   backend/ (depth 0) → src/ (depth 1) → server.go, api.go (depth 2)
//                      → go.mod, Dockerfile (depth 1)
//   docs/ (depth 0) → README.md, api-spec.yaml (depth 1)
//   .gitlab-ci.yml, docker-compose.yml (depth 0)
//
// Directories have isDir: true and no checkbox — only files are selectable.
// ---------------------------------------------------------------------------
const fileTree: FileNode[] = [
  // TODO: fill in the file tree
]

// ---------------------------------------------------------------------------
// TODO 2: Define 6 CI jobs with their rules:changes patterns
// See task-4.2.md → "CI-джобы и их паттерны" table.
// ---------------------------------------------------------------------------
const ciJobs: CIJob[] = [
  // TODO: fill in the jobs
]

// ---------------------------------------------------------------------------
// TODO 3: Implement matchesGlob(filePath, pattern) → boolean
//
// Support these glob features:
//   **/*  → any file recursively  (e.g. frontend/**/* matches frontend/src/App.tsx)
//   *.go  → files ending in .go in the same directory
//   exact → exact path match
//
// Hint: convert the glob to a RegExp.
// Example: 'frontend/**/*' → /^frontend\/.+$/
// ---------------------------------------------------------------------------
function matchesGlob(filePath: string, pattern: string): boolean {
  // TODO: implement
  return false
}

// ---------------------------------------------------------------------------
// TODO 4: Implement jobMatches(job, changedFiles) → string[]
// Returns the list of changed files that match any of the job's patterns.
// A non-empty result means the job will run.
// ---------------------------------------------------------------------------
function jobMatches(job: CIJob, changedFiles: Set<string>): string[] {
  // TODO: implement
  return []
}

// ---------------------------------------------------------------------------
// TODO 5: Implement the component
//
// Layout (two-column):
//   Left: file tree with checkboxes for files, folder icons for dirs
//         highlight checked files (red text or different background)
//   Right: list of CI jobs with run status and matched file names
//
// Controls:
//   "Случайные изменения" — pick 2-3 random leaf files
//   "Сбросить" — clear all checkboxes
//
// Header stat: "Изменено: X файлов | Запустится: Y джобов"
// ---------------------------------------------------------------------------

const allLeafPaths = fileTree.filter(f => !f.isDir).map(f => f.path)

export function Task4_2() {
  const { t } = useLanguage()
  const [changedFiles, setChangedFiles] = useState<Set<string>>(new Set())

  const toggleFile = (path: string) => {
    // TODO: toggle path in changedFiles set (create a new Set each time)
  }

  const randomize = () => {
    // TODO: pick 3 random paths from allLeafPaths and set changedFiles
  }

  const reset = () => {
    // TODO: clear changedFiles
  }

  // TODO: compute activeJobs — only jobs that match at least one changed file

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h2>{t('task.4.2')}</h2>
      <p style={{ color: '#666' }}>
        {t('task.4.2.subtitle')}
      </p>

      {/* TODO: stats bar + control buttons */}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* TODO: file tree column */}

        {/* TODO: jobs column */}
      </div>
    </div>
  )
}
