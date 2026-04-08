import { useState } from 'react'
import React from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 4.1: withLoading HOC
// ============================================
//
// Реализуйте HOC withLoading<P>, который принимает компонент
// с пропсами типа P и возвращает компонент с P & { isLoading: boolean }.
//
// Когда isLoading=true — рендерите спиннер.
// Когда isLoading=false — рендерите оригинальный компонент.
//
// Правила:
//   - P extends object (ограничение generic)
//   - isLoading не должен попасть в оригинальный компонент
//   - Установите displayName в формате: withLoading(ComponentName)
//   - HOC создавайте вне рендер-функции!

// --- Компонент Spinner (можно изменить внешний вид) ---

function Spinner() {
  return (
    <div style={{ padding: '1rem', color: '#64748b' }}>
      {/* TODO: Добавьте визуальную индикацию загрузки */}
      Загрузка...
    </div>
  )
}

// --- Реализуйте withLoading здесь ---

// TODO: Реализуйте HOC withLoading<P extends object>
// function withLoading<P extends object>(Component: React.ComponentType<P>) {
//   const WithLoading = ({ isLoading, ...props }: P & { isLoading: boolean }) => {
//     // ваш код здесь
//   }
//   WithLoading.displayName = `withLoading(${???})`
//   return WithLoading
// }

// --- Компоненты для демонстрации ---

interface UserCardProps {
  name: string
  role: string
}

// TODO: Реализуйте компонент UserCard
function UserCard({ name, role }: UserCardProps) {
  return (
    <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      {/* TODO: отобразите name и role */}
      <div>{name}</div>
      <div>{role}</div>
    </div>
  )
}

interface ProductListProps {
  products: Array<{ id: string; name: string; price: number }>
}

// TODO: Реализуйте компонент ProductList
function ProductList({ products }: ProductListProps) {
  return (
    <div>
      {/* TODO: отобразите список продуктов */}
      {products.map(p => <div key={p.id}>{p.name} — {p.price} ₽</div>)}
    </div>
  )
}

// TODO: Создайте обёрнутые компоненты ЗДЕСЬ (вне рендера!)
// const UserCardWithLoading = withLoading(UserCard)
// const ProductListWithLoading = withLoading(ProductList)

const MOCK_PRODUCTS = [
  { id: '1', name: 'Keychron K2', price: 8990 },
  { id: '2', name: 'Logitech MX Master 3', price: 6490 },
]

export function Task4_1() {
  const { t } = useLanguage()
  const [loadingUser, setLoadingUser] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(false)

  const simulateLoad = (setter: (v: boolean) => void) => {
    setter(true)
    setTimeout(() => setter(false), 1500)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 4.1 — withLoading HOC</h2>
      <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Реализуйте HOC withLoading, оберните UserCard и ProductList, добавьте кнопки симуляции загрузки.
      </p>

      {/* TODO: После реализации withLoading — замените эти заглушки */}
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <button
            onClick={() => simulateLoad(setLoadingUser)}
            style={{ marginBottom: '0.75rem', padding: '0.3rem 0.75rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Симулировать загрузку UserCard
          </button>
          {/* TODO: замените на <UserCardWithLoading isLoading={loadingUser} name="..." role="..." /> */}
          <div style={{ padding: '1rem', background: '#fef9c3', borderRadius: '8px', color: '#92400e', fontSize: '0.85rem' }}>
            TODO: здесь должен быть UserCardWithLoading (isLoading={String(loadingUser)})
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 260 }}>
          <button
            onClick={() => simulateLoad(setLoadingProducts)}
            style={{ marginBottom: '0.75rem', padding: '0.3rem 0.75rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Симулировать загрузку ProductList
          </button>
          {/* TODO: замените на <ProductListWithLoading isLoading={loadingProducts} products={MOCK_PRODUCTS} /> */}
          <div style={{ padding: '1rem', background: '#fef9c3', borderRadius: '8px', color: '#92400e', fontSize: '0.85rem' }}>
            TODO: здесь должен быть ProductListWithLoading (isLoading={String(loadingProducts)})
          </div>
        </div>
      </div>

      {/* TODO: После реализации раскомментируйте и проверьте displayName */}
      {/* <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
        displayName: {UserCardWithLoading.displayName}
      </div> */}
    </div>
  )
}
