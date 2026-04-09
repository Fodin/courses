import { useState } from 'react'

// TODO: Define interface SchemaNode:
//   id: string, label: string, color: string,
//   refs: string[], yaml: string

// TODO: Create SCHEMA_NODES array with 5 entries:
//   1. User — color '#6366f1', refs: ['Address']
//      yaml: User schema with id (uuid), name, email, address ($ref Address)
//   2. Address — color '#0ea5e9', refs: []
//      yaml: Address schema with street, city, country, postalCode
//   3. Order — color '#10b981', refs: ['User', 'OrderItem']
//      yaml: Order schema with id, user ($ref User), items (array of $ref OrderItem), total, status (enum)
//   4. OrderItem — color '#f59e0b', refs: ['Product']
//      yaml: OrderItem schema with product ($ref Product), quantity, price
//   5. Product — color '#ec4899', refs: []
//      yaml: Product schema with id, name, price, inStock

export function Task8_1() {
  // TODO: selectedId state: string | null (default null)

  // TODO: Find selected node from SCHEMA_NODES

  // TODO: Compute referencedBy — nodes that have selectedId in their refs array

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Визуализатор $ref</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Кликните по схеме, чтобы увидеть её определение и связи с другими схемами.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* TODO: Left column — schema nodes list
             Container: background #f8fafc, border, borderRadius 12px, padding 1.25rem
             Header label: "SCHEMAS / components/schemas"
             For each node render a clickable card (onClick toggles selectedId):
             - Show colored dot (10px circle with node.color)
             - Show node label
             - If node.refs.length > 0: show badge "N $ref" or "1 $ref"
             Selected node: background = node.color, text = white
             Node with refs pointing to selected: background node.color + '15'
             Node referenced by selected: lighter tint */}

        {/* TODO: Below nodes list — show connection info if selectedId:
             - Which nodes the selected schema refs (node.refs list)
             - Which nodes reference the selected (referencedBy list)
             - If no connections: "Схема не ссылается на другие схемы..." */}

        {/* TODO: Right column — show selected node's YAML:
             Header with node.color background showing "#/components/schemas/{id}"
             Dark code block with yaml content
             If nothing selected: dashed placeholder "👈 Нажмите на схему слева..." */}
      </div>

      {/* TODO: Info block at bottom (background #f0f9ff, border #bae6fd):
           Explain $ref as "один источник истины" */}
    </div>
  )
}
