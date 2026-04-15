import { useState, useRef, type ReactNode } from 'react'
import { useLanguage } from 'src/hooks'

// Task 10.4: Concurrent Tree Walk
//
// Visualize how sync and transition updates traverse the fiber tree differently.
//
// ─── Tree structure ───────────────────────────────────────────────────────────
//
// Define TREE_NODES as an array:
//   interface TreeNode { id: string; name: string; parentId: string | null; depth: number }
//
// Tree:
//   App → Header (Logo, Nav (NavItem1, NavItem2))
//       → Main (Sidebar (Widget1, Widget2), Content (Card1, Card2, Card3))
//       → Footer (Links, Copy)
//
// DFS order: App, Header, Logo, Nav, NavItem1, NavItem2, Main, Sidebar, ...
// Implement getDfsOrder() that returns node IDs in depth-first order.
//
// ─── Node states ─────────────────────────────────────────────────────────────
//
// type NodeState = 'idle' | 'processing' | 'sync-done' | 'transition-done' | 'interrupted'
//
// Colors:
//   idle:             gray  (#f1f5f9 / #cbd5e1)
//   processing:       yellow (#fef9c3 / #fde047)
//   sync-done:        green  (#dcfce7 / #86efac)
//   transition-done:  blue   (#dbeafe / #93c5fd)
//   interrupted:      orange (#fed7aa / #fb923c)
//
// ─── Sync walk ────────────────────────────────────────────────────────────────
//
// Iterates DFS_ORDER with 80ms per node using setTimeout chains.
// If sync is already running → ignore new click (isRunningRef.current check).
// Each step: set node to 'processing', then after 60ms → set to 'sync-done'.
//
// ─── Transition walk ──────────────────────────────────────────────────────────
//
// Iterates DFS_ORDER with 150ms per node using setTimeout chains.
// If sync is triggered DURING transition walk:
//   1. clearTimeout all pending timeouts
//   2. Set isTransitionRunningRef.current = false
//   3. Mark remaining 'idle' and current 'processing' nodes as 'interrupted'
//   4. Start sync walk from beginning
//
// ─── Log ─────────────────────────────────────────────────────────────────────
//
// Keep a log of events with timestamps:
//   "[12:00:00.123] Sync update запущен (17 узлов)"
//   "[12:00:01.456] Transition прерван — sync update захватывает управление"
//   "[12:00:02.789] Sync завершён (17 узлов)"
// Show last 20 entries, newest first.

// ─── TODO: define TREE_NODES ─────────────────────────────────────────────────

// const TREE_NODES: TreeNode[] = [...]

// ─── TODO: implement getDfsOrder ─────────────────────────────────────────────

// function getDfsOrder(nodes: TreeNode[]): string[] { ... }

// ─── TODO: implement renderTree (recursive) ──────────────────────────────────

// function renderTree(nodes, nodeStates, parentId = null): ReactNode { ... }

// ─── TODO: implement TreeNodeView ────────────────────────────────────────────

// function TreeNodeView({ node, state, children }) { ... }

// ─── Main component ───────────────────────────────────────────────────────────

export function Task10_4() {
  const { t } = useLanguage()

  // TODO: nodeStates — Record<string, NodeState>, initialized to all 'idle'
  // TODO: log — array of log entries (in state)
  // TODO: isRunningRef, isTransitionRunningRef, timeoutsRef

  // TODO: implement resetAll
  // TODO: implement runSyncWalk
  // TODO: implement runTransitionWalk

  return (
    <div className="exercise-container">
      <h2>{t('task.10.4')}</h2>

      {/* TODO: legend row */}

      {/* TODO: control buttons */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button
          style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#16a34a', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
          onClick={() => {/* TODO: runSyncWalk */}}
        >
          Sync Update (80ms/узел)
        </button>
        <button
          style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#1d4ed8', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
          onClick={() => {/* TODO: runTransitionWalk */}}
        >
          Transition Update (150ms/узел)
        </button>
        <button
          style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#e5e7eb', color: '#374151', fontWeight: 700, cursor: 'pointer' }}
          onClick={() => {/* TODO: resetAll */}}
        >
          Сбросить
        </button>
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        {/* TODO: render tree */}
        <div style={{
          flex: '0 0 auto',
          padding: 16,
          background: '#f8fafc',
          borderRadius: 10,
          border: '1px solid #e2e8f0',
          minWidth: 260,
        }}>
          <p style={{ color: '#9ca3af', fontSize: 13 }}>Дерево появится здесь</p>
        </div>

        {/* TODO: render log */}
        <div style={{
          flex: 1,
          background: '#0f172a',
          borderRadius: 10,
          padding: 12,
        }}>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>Лог событий:</div>
          <div style={{ color: '#475569', fontSize: 13, fontStyle: 'italic' }}>
            — нажмите кнопку —
          </div>
        </div>
      </div>
    </div>
  )
}
