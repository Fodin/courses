import { useLanguage } from 'src/hooks'

// ============================================
// Задание 12.3: Checkout flow на state machine
// ============================================
//
// Шаг 1: Опишите состояния через discriminated union
//
// type CheckoutState =
//   | { status: 'idle' }
//   | { status: 'shipping'; data: Partial<ShippingData> }
//   | { status: 'payment'; shipping: ShippingData }
//   | { status: 'confirmation'; orderId: string; shipping: ShippingData }
//   | { status: 'error'; message: string; from: string }
//
// Шаг 2: Опишите typed actions
//
// type CheckoutAction =
//   | { type: 'START_CHECKOUT' }
//   | { type: 'SUBMIT_SHIPPING'; payload: ShippingData }
//   | { type: 'SUBMIT_PAYMENT' }
//   | { type: 'CONFIRM_ORDER'; orderId: string }
//   | { type: 'SET_ERROR'; message: string }
//   | { type: 'RETRY' }
//   | { type: 'RESET' }
//
// Шаг 3: Реализуйте checkoutReducer
// - Каждый case проверяет допустимость перехода (if state.status !== '...' return state)
// - SUBMIT_PAYMENT -> CONFIRM_ORDER с рандомным orderId в компоненте
//
// Шаг 4: Реализуйте прогресс-бар / stepper
// const STEPS = ['idle', 'shipping', 'payment', 'confirmation']
// Текущий шаг = STEPS.indexOf(state.status)
//
// Шаг 5: Рендеринг по состоянию:
// - idle: кнопка "Оформить заказ"
// - shipping: форма с name, address, city
// - payment: итоговые данные + кнопка "Оплатить"
// - confirmation: успех с orderId
// - error: сообщение + кнопки "Повторить" и "Сброс"
//
// Шаг 6: Кнопка "Симулировать ошибку" на шагах shipping и payment
// dispatch({ type: 'SET_ERROR', message: '...' })

// TODO: Опишите interface ShippingData

// TODO: Опишите type CheckoutState

// TODO: Опишите type CheckoutAction

// TODO: Реализуйте checkoutReducer

// TODO: Реализуйте компонент CheckoutStepper

export function Task12_3() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 12.3</h2>

      {/* TODO: Добавьте useReducer(checkoutReducer, { status: 'idle' }) */}

      {/* TODO: Отрендерите CheckoutStepper с текущим состоянием */}

      {/* TODO: Рендерите UI в зависимости от state.status */}
      {/* state.status === 'idle' -> кнопка "Оформить заказ" */}
      {/* state.status === 'shipping' -> форма доставки */}
      {/* state.status === 'payment' -> форма оплаты с данными доставки */}
      {/* state.status === 'confirmation' -> успех с state.orderId */}
      {/* state.status === 'error' -> ошибка с state.message */}
    </div>
  )
}
