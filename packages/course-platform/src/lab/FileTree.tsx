import { Fragment } from 'react'

export interface TreeEntry {
  path: string
  readonly?: boolean
}

interface TreeNode {
  name: string
  /** Задан только у файлов-листьев. */
  path?: string
  readonly?: boolean
  children: Map<string, TreeNode>
}

function buildTree(entries: TreeEntry[]): TreeNode {
  const root: TreeNode = { name: '', children: new Map() }
  for (const entry of entries) {
    const parts = entry.path.split('/')
    let node = root
    parts.forEach((part, i) => {
      const isLeaf = i === parts.length - 1
      let child = node.children.get(part)
      if (!child) {
        child = { name: part, children: new Map() }
        node.children.set(part, child)
      }
      if (isLeaf) {
        child.path = entry.path
        child.readonly = entry.readonly
      }
      node = child
    })
  }
  return root
}

interface FileTreeProps {
  entries: TreeEntry[]
  activePath: string
  onSelect: (path: string) => void
}

/** Вложенное дерево файлов: показывает только имя узла с отступом по глубине. */
export function FileTree({ entries, activePath, onSelect }: FileTreeProps) {
  const root = buildTree(entries)
  return (
    <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 1.5 }}>
      {renderChildren(root, 0, activePath, onSelect)}
    </div>
  )
}

function renderChildren(
  node: TreeNode,
  depth: number,
  activePath: string,
  onSelect: (path: string) => void
) {
  // Папки сверху, затем файлы; внутри — по алфавиту.
  const nodes = [...node.children.values()].sort((a, b) => {
    const aDir = a.path === undefined
    const bDir = b.path === undefined
    if (aDir !== bDir) return aDir ? -1 : 1
    return a.name.localeCompare(b.name)
  })

  return nodes.map(child => {
    const pad = 6 + depth * 14
    if (child.path === undefined) {
      // Папка
      return (
        <Fragment key={child.name + depth}>
          <div
            style={{
              padding: '2px 6px',
              paddingLeft: pad,
              color: 'var(--clr-text-secondary)',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ opacity: 0.6 }}>▸</span> {child.name}/
          </div>
          {renderChildren(child, depth + 1, activePath, onSelect)}
        </Fragment>
      )
    }
    // Файл
    const isActive = child.path === activePath
    return (
      <button
        key={child.path}
        onClick={() => onSelect(child.path!)}
        title={child.path}
        style={{
          display: 'block',
          width: '100%',
          textAlign: 'left',
          padding: '3px 6px',
          paddingLeft: pad,
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          background: isActive ? 'var(--clr-border)' : 'transparent',
          color: child.readonly ? 'var(--clr-text-muted)' : 'var(--clr-text)',
          whiteSpace: 'nowrap',
        }}
      >
        {child.name}
        {child.readonly ? ' 🔒' : ''}
      </button>
    )
  })
}
