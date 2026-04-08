import { useLanguage } from 'src/hooks'

// ============================================
// Задание 6.1: Корзина с useReducer + раздельные Context
// ============================================
//
// Реализуйте корзину интернет-магазина используя useReducer
// и два отдельных контекста: CartStateContext и CartDispatchContext.
//
// Ключевая идея: dispatch из useReducer стабилен — компоненты,
// использующие только dispatch, не ре-рендерятся при изменении state.

// TODO: Определите типы
// interface CartItem { id, name, price, quantity }
// interface CartState { items: CartItem[] }
// type CartAction =
//   | { type: 'ADD'; item: Omit<CartItem, 'quantity'> }
//   | { type: 'REMOVE'; id: string }
//   | { type: 'INCREMENT'; id: string }
//   | { type: 'DECREMENT'; id: string }
//   | { type: 'CLEAR' }

// TODO: Реализуйте cartReducer(state, action): CartState
// case ADD: если товар уже есть — увеличиваем quantity, иначе добавляем с quantity: 1
// case DECREMENT: уменьшаем quantity, затем фильтруем items с quantity <= 0

// TODO: Создайте два контекста
// const CartStateContext = createContext<CartState | null>(null)
// const CartDispatchContext = createContext<React.Dispatch<CartAction> | null>(null)

// TODO: Реализуйте хуки с проверкой на null
// function useCartState(): CartState { ... }
// function useCartDispatch(): React.Dispatch<CartAction> { ... }

// TODO: Реализуйте CartProvider
// function CartProvider({ children }: { children: React.ReactNode }) {
//   const [state, dispatch] = useReducer(cartReducer, { items: [] })
//   return (
//     <CartStateContext.Provider value={state}>
//       <CartDispatchContext.Provider value={dispatch}>
//         {children}
//       </CartDispatchContext.Provider>
//     </CartStateContext.Provider>
//   )
// }

// TODO: Реализуйте CartBadge
// Показывает иконку корзины + количество товаров (сумма quantity)
// Подписан только на CartStateContext

// TODO: Реализуйте AddToCartButton({ item })
// Кнопка добавления товара, меняет вид если товар уже в корзине

// TODO: Реализуйте CartDrawer({ open, onClose })
// Боковая шторка: список товаров, +/− количество, удаление, итоговая сумма

// Моковый каталог для демо
const CATALOG_ITEMS = [
  { id: 'p1', name: 'Клавиатура Keychron K2', price: 8990 },
  { id: 'p2', name: 'Мышь Logitech MX Master 3', price: 6490 },
  { id: 'p3', name: 'Коврик для мыши XL', price: 1290 },
]

export function Task6_1() {
  const { t } = useLanguage()
  // TODO: добавьте useState для управления открытием шторки
  // const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    // TODO: оберните в CartProvider
    <div className="exercise-container">
      <h2>{t('task.title')} 6.1</h2>
      <p style={{ color: '#888', fontStyle: 'italic' }}>
        Корзина с useReducer + CartStateContext / CartDispatchContext
      </p>

      {/* TODO: Header с CartBadge и кнопкой открытия шторки */}

      {/* TODO: Каталог товаров с AddToCartButton для каждого */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
        {CATALOG_ITEMS.map(item => (
          <div key={item.id} style={{ padding: '0.75rem', border: '1px solid #eee', borderRadius: '8px' }}>
            <div style={{ marginBottom: '0.25rem' }}>{item.name}</div>
            <div style={{ color: '#d32f2f', fontWeight: 'bold' }}>{item.price.toLocaleString('ru-RU')} ₽</div>
            {/* TODO: <AddToCartButton item={item} /> */}
          </div>
        ))}
      </div>

      {/* TODO: <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} /> */}
    </div>
  )
}
