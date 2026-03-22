import { makeAutoObservable, comparer } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'

// ============================================
// Task 3.1: First computed — CartStore
// ============================================

interface CartItem {
  name: string
  price: number
  qty: number
}

class CartStore {
  items: CartItem[] = [
    { name: 'React Book', price: 29.99, qty: 1 },
    { name: 'TypeScript Stickers', price: 4.99, qty: 3 },
    { name: 'MobX T-Shirt', price: 19.99, qty: 2 },
  ]

  constructor() {
    makeAutoObservable(this)
  }

  get totalPrice() {
    return this.items.reduce((sum, item) => sum + item.price * item.qty, 0)
  }

  setQty(index: number, qty: number) {
    this.items[index].qty = Math.max(0, qty)
  }

  addItem(name: string, price: number) {
    this.items.push({ name, price, qty: 1 })
  }

  removeItem(index: number) {
    this.items.splice(index, 1)
  }
}

const cartStore = new CartStore()

export const Task3_1_Solution = observer(function Task3_1_Solution() {
  return (
    <div className="exercise-container">
      <h3>Cart</h3>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #ddd' }}>
              Item
            </th>
            <th style={{ textAlign: 'right', padding: '8px', borderBottom: '2px solid #ddd' }}>
              Price
            </th>
            <th style={{ textAlign: 'center', padding: '8px', borderBottom: '2px solid #ddd' }}>
              Qty
            </th>
            <th style={{ textAlign: 'right', padding: '8px', borderBottom: '2px solid #ddd' }}>
              Subtotal
            </th>
            <th style={{ padding: '8px', borderBottom: '2px solid #ddd' }} />
          </tr>
        </thead>
        <tbody>
          {cartStore.items.map((item, i) => (
            <tr key={i}>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{item.name}</td>
              <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #eee' }}>
                ${item.price.toFixed(2)}
              </td>
              <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #eee' }}>
                <button onClick={() => cartStore.setQty(i, item.qty - 1)}>-</button>
                <span style={{ margin: '0 8px' }}>{item.qty}</span>
                <button onClick={() => cartStore.setQty(i, item.qty + 1)}>+</button>
              </td>
              <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #eee' }}>
                ${(item.price * item.qty).toFixed(2)}
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                <button onClick={() => cartStore.removeItem(i)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: '16px',
          padding: '12px',
          background: 'var(--color-success-bg, #e8f5e9)',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '1.2em',
        }}
      >
        Total: ${cartStore.totalPrice.toFixed(2)}
      </div>
    </div>
  )
})

// ============================================
// Task 3.2: Computed chain — subtotal -> tax -> total
// ============================================

class InvoiceStore {
  items: CartItem[] = [
    { name: 'Laptop', price: 999.99, qty: 1 },
    { name: 'Mouse', price: 29.99, qty: 2 },
    { name: 'Keyboard', price: 79.99, qty: 1 },
  ]

  taxRate = 0.2

  constructor() {
    makeAutoObservable(this)
  }

  get subtotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.qty, 0)
  }

  get tax() {
    return this.subtotal * this.taxRate
  }

  get total() {
    return this.subtotal + this.tax
  }

  setQty(index: number, qty: number) {
    this.items[index].qty = Math.max(0, qty)
  }

  setTaxRate(rate: number) {
    this.taxRate = rate
  }
}

const invoiceStore = new InvoiceStore()

export const Task3_2_Solution = observer(function Task3_2_Solution() {
  return (
    <div className="exercise-container">
      <h3>Invoice</h3>

      <div style={{ marginBottom: '12px' }}>
        <label>
          Tax rate:{' '}
          <select
            value={invoiceStore.taxRate}
            onChange={e => invoiceStore.setTaxRate(Number(e.target.value))}
          >
            <option value={0.1}>10%</option>
            <option value={0.2}>20%</option>
            <option value={0.25}>25%</option>
          </select>
        </label>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {invoiceStore.items.map((item, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid #eee',
            }}
          >
            <span>{item.name}</span>
            <span>
              <button onClick={() => invoiceStore.setQty(i, item.qty - 1)}>-</button>
              <span style={{ margin: '0 8px' }}>{item.qty}</span>
              <button onClick={() => invoiceStore.setQty(i, item.qty + 1)}>+</button>
              <span style={{ marginLeft: '16px', minWidth: '80px', display: 'inline-block' }}>
                ${(item.price * item.qty).toFixed(2)}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '16px', padding: '12px', background: 'var(--color-bg-secondary, #f5f5f5)', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>Subtotal:</span>
          <span>${invoiceStore.subtotal.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>Tax ({(invoiceStore.taxRate * 100).toFixed(0)}%):</span>
          <span>${invoiceStore.tax.toFixed(2)}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 'bold',
            fontSize: '1.2em',
            borderTop: '2px solid #333',
            paddingTop: '8px',
            marginTop: '8px',
          }}
        >
          <span>Total:</span>
          <span>${invoiceStore.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
})

// ============================================
// Task 3.3: Computed caching — heavy filter + sort with logging
// ============================================

interface Product {
  id: number
  name: string
  price: number
  category: string
  rating: number
}

const allProducts: Product[] = [
  { id: 1, name: 'Wireless Mouse', price: 29.99, category: 'electronics', rating: 4.5 },
  { id: 2, name: 'USB Cable', price: 9.99, category: 'electronics', rating: 3.8 },
  { id: 3, name: 'Notebook', price: 5.99, category: 'stationery', rating: 4.2 },
  { id: 4, name: 'Pen Pack', price: 12.99, category: 'stationery', rating: 4.7 },
  { id: 5, name: 'Monitor Stand', price: 49.99, category: 'electronics', rating: 4.1 },
  { id: 6, name: 'Desk Lamp', price: 34.99, category: 'furniture', rating: 4.3 },
  { id: 7, name: 'Sticky Notes', price: 3.99, category: 'stationery', rating: 3.5 },
  { id: 8, name: 'Webcam', price: 59.99, category: 'electronics', rating: 4.6 },
  { id: 9, name: 'Chair Mat', price: 24.99, category: 'furniture', rating: 3.9 },
  { id: 10, name: 'Headphones', price: 89.99, category: 'electronics', rating: 4.8 },
]

class ProductFilterStore {
  products: Product[] = allProducts
  selectedCategory = 'all'
  minRating = 0
  computeCount = 0

  constructor() {
    makeAutoObservable(this)
  }

  get filteredAndSorted(): Product[] {
    this.computeCount++
    console.log(`[computed] filteredAndSorted recalculated (#${this.computeCount})`)

    let result = this.products

    if (this.selectedCategory !== 'all') {
      result = result.filter(p => p.category === this.selectedCategory)
    }

    if (this.minRating > 0) {
      result = result.filter(p => p.rating >= this.minRating)
    }

    return result.slice().sort((a, b) => b.rating - a.rating)
  }

  get categories(): string[] {
    const cats = new Set(this.products.map(p => p.category))
    return ['all', ...cats]
  }

  setCategory(category: string) {
    this.selectedCategory = category
  }

  setMinRating(rating: number) {
    this.minRating = rating
  }
}

const productStore = new ProductFilterStore()

export const Task3_3_Solution = observer(function Task3_3_Solution() {
  const [, forceRender] = useState(0)

  return (
    <div className="exercise-container">
      <h3>Product Filter (check console)</h3>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <label>
          Category:{' '}
          <select
            value={productStore.selectedCategory}
            onChange={e => productStore.setCategory(e.target.value)}
          >
            {productStore.categories.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label>
          Min rating:{' '}
          <input
            type="range"
            min={0}
            max={5}
            step={0.5}
            value={productStore.minRating}
            onChange={e => productStore.setMinRating(Number(e.target.value))}
          />
          <span style={{ marginLeft: '4px' }}>{productStore.minRating}</span>
        </label>
      </div>

      <button
        onClick={() => forceRender(n => n + 1)}
        style={{ marginBottom: '12px' }}
      >
        Force re-render (computed should NOT recalculate)
      </button>

      <p style={{ color: 'gray', fontSize: '0.9em' }}>
        Computed recalculations: <strong>{productStore.computeCount}</strong>
      </p>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {productStore.filteredAndSorted.map(p => (
          <li
            key={p.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px',
              borderBottom: '1px solid #eee',
            }}
          >
            <span>
              {p.name} <small style={{ color: 'gray' }}>({p.category})</small>
            </span>
            <span>
              {'*'.repeat(Math.round(p.rating))} ${p.price.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
})

// ============================================
// Task 3.4: keepAlive and equals — comparer.structural
// ============================================

interface Viewport {
  width: number
  height: number
}

class LayoutStore {
  screenWidth = 1024
  screenHeight = 768

  constructor() {
    makeAutoObservable(this, {
      viewport: true,
    })
  }

  get viewport(): Viewport {
    console.log('[computed] viewport recalculated')
    return {
      width: this.screenWidth,
      height: this.screenHeight,
    }
  }

  setWidth(w: number) {
    this.screenWidth = w
  }

  setHeight(h: number) {
    this.screenHeight = h
  }
}

// Using computed with comparer.structural to avoid unnecessary reactions
// when the viewport object is structurally the same
import { computed } from 'mobx'

class SmartLayoutStore {
  screenWidth = 1024
  screenHeight = 768
  renderCount = 0

  constructor() {
    makeAutoObservable(this, {
      viewport: computed({ equals: comparer.structural }),
    })
  }

  get viewport(): Viewport {
    console.log('[computed] smart viewport recalculated')
    return {
      width: this.screenWidth,
      height: this.screenHeight,
    }
  }

  setWidth(w: number) {
    this.screenWidth = w
  }

  setHeight(h: number) {
    this.screenHeight = h
  }

  incrementRenderCount() {
    this.renderCount++
  }
}

const layoutStoreBasic = new LayoutStore()
const layoutStoreSmart = new SmartLayoutStore()

const BasicViewport = observer(function BasicViewport() {
  const vp = layoutStoreBasic.viewport
  console.log('[render] BasicViewport')
  return (
    <div style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <strong>Basic computed (no equals)</strong>
      <p>
        {vp.width} x {vp.height}
      </p>
    </div>
  )
})

const SmartViewport = observer(function SmartViewport() {
  const vp = layoutStoreSmart.viewport
  console.log('[render] SmartViewport')
  return (
    <div style={{ padding: '8px', border: '1px solid #4caf50', borderRadius: '4px' }}>
      <strong>Smart computed (comparer.structural)</strong>
      <p>
        {vp.width} x {vp.height}
      </p>
    </div>
  )
})

export const Task3_4_Solution = observer(function Task3_4_Solution() {
  return (
    <div className="exercise-container">
      <h3>keepAlive & equals (check console)</h3>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label>
            Width:{' '}
            <input
              type="number"
              value={layoutStoreBasic.screenWidth}
              onChange={e => {
                const val = Number(e.target.value)
                layoutStoreBasic.setWidth(val)
                layoutStoreSmart.setWidth(val)
              }}
              style={{ width: '80px' }}
            />
          </label>
        </div>
        <div>
          <label>
            Height:{' '}
            <input
              type="number"
              value={layoutStoreBasic.screenHeight}
              onChange={e => {
                const val = Number(e.target.value)
                layoutStoreBasic.setHeight(val)
                layoutStoreSmart.setHeight(val)
              }}
              style={{ width: '80px' }}
            />
          </label>
        </div>
      </div>

      <p style={{ color: 'gray', fontSize: '0.9em', marginBottom: '16px' }}>
        Try setting the same width/height values and check the console.
        <br />
        Basic computed will trigger re-render every time (new object reference).
        <br />
        Smart computed with <code>comparer.structural</code> will skip re-renders when values are the
        same.
      </p>

      <div style={{ display: 'flex', gap: '16px' }}>
        <BasicViewport />
        <SmartViewport />
      </div>
    </div>
  )
})
