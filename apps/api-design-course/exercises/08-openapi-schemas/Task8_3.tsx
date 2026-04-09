import { useState } from 'react'

// TODO: Define interface SchemaExample:
//   id: string, title: string, description: string,
//   color: string, category: 'base' | 'composition' | 'generic' | 'reusable', yaml: string

// TODO: Define SCHEMA_EXAMPLES array with 8 entries:
//   Base schemas (category: 'base'):
//   1. Product — color '#6366f1'
//      yaml: required [id, name, price, category], includes $ref Category, inStock boolean, images array
//   2. Category — color '#0ea5e9'
//      yaml: required [id, name], includes slug and recursive parent: $ref Category
//   3. User — color '#10b981'
//      yaml: required [id, name, email], includes phone (pattern) and addresses array ($ref Address)
//   4. Order — color '#f59e0b'
//      yaml: required [id, userId, items, total, status, createdAt], status enum, $ref OrderItem and Address
//   5. OrderItem — color '#ec4899'
//      yaml: required [productId, quantity, unitPrice], productName as snapshot
//   6. Address — color '#8b5cf6'
//      yaml: required [street, city, country], region, postalCode, country ISO
//
//   Composition (category: 'composition'):
//   7. allOf/oneOf/anyOf examples — color '#f97316'
//      yaml: ProductWithReviews (allOf), PaymentMethod (oneOf + discriminator), SearchFilter (anyOf)
//
//   Generic pattern (category: 'generic'):
//   8. PaginatedResponse<T> — color '#14b8a6'
//      yaml: PaginationMeta (base) + PaginatedProducts and PaginatedOrders (allOf + data array)

// TODO: Define CATEGORY_LABELS and CATEGORY_COLORS maps

export function Task8_3() {
  // TODO: selectedId state: string (default first schema id = 'product')

  // TODO: Find selected schema from SCHEMA_EXAMPLES

  // TODO: Get unique categories from SCHEMA_EXAMPLES using Array.from(new Set(...))

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '1000px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Проектирование схем: e-commerce API</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Эталонные переиспользуемые схемы для интернет-магазина. Изучите паттерны allOf, oneOf,
        anyOf и generic-пагинацию.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '1rem' }}>
        {/* TODO: Left column — navigation
             For each category: render category label (colored, uppercase, small)
             Then list schema buttons for that category
             Active schema: colored border and tinted background
             Each button: colored dot + schema title in monospace font */}

        {/* TODO: Right column — schema details
             Card with colored header showing schema title and category badge
             Description strip below header
             Dark code block with yaml content (maxHeight 420px, overflowY auto)
             For 'composition' category: explain allOf/oneOf/anyOf in amber info block
             For 'generic' category: explain allOf + PaginationMeta pattern in teal info block */}
      </div>
    </div>
  )
}
