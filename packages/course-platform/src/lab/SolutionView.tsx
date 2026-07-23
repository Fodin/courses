import { useState } from 'react'

import { Editor } from './Editor'
import { FileTree } from './FileTree'
import type { FileLanguage, LabSpec, VirtualFile } from './types'

function langOf(file: VirtualFile): FileLanguage {
  if (file.language) return file.language
  if (file.path.endsWith('.tsx')) return 'tsx'
  if (file.path.endsWith('.ts')) return 'ts'
  if (file.path.endsWith('.css')) return 'css'
  if (file.path.endsWith('.json')) return 'json'
  if (file.path.endsWith('.md')) return 'md'
  return 'ts'
}

/** Read-only просмотр эталонного дерева файлов задания. */
export function SolutionView({ spec }: { spec: LabSpec }) {
  const files = spec.solution.filter(f => f.role !== 'hidden')
  const [activePath, setActivePath] = useState(files[0]?.path ?? '')
  const active = files.find(f => f.path === activePath) ?? files[0]

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div
        style={{
          flex: '0 0 260px',
          minWidth: 220,
          padding: 8,
          border: '1px solid var(--clr-border)',
          borderRadius: 6,
          background: 'var(--clr-bg-secondary)',
          overflowX: 'auto',
        }}
      >
        <FileTree
          entries={files.map(f => ({ path: f.path, readonly: f.role === 'readonly' }))}
          activePath={activePath}
          onSelect={setActivePath}
        />
      </div>
      <div style={{ flex: '1 1 420px', minWidth: 320 }}>
        {active && <FileView file={active} />}
      </div>
    </div>
  )
}

function FileView({ file }: { file: VirtualFile }) {
  return (
    <>
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: 12,
          marginBottom: 6,
          color: 'var(--clr-text-secondary)',
        }}
      >
        {file.path}
      </div>
      <Editor value={file.content} language={langOf(file)} readOnly fill={false} />
    </>
  )
}
