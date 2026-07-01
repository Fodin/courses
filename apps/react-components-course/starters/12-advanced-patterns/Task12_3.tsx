import { useLanguage } from 'src/hooks'

// ============================================
// Задание 12.3: Checkout flow на state machine
// Task 12.3: Checkout flow via state machine
// ============================================
//
// Шаг 1: Опишите состояния через discriminated union
// Step 1: Describe states via discriminated union
//
// type CheckoutState =
//   | { status: 'idle' }
//   | { status: 'shipping'; data: Partial<ShippingData> }
//   | { status: 'payment'; shipping: ShippingData }
//   | { status: 'confirmation'; orderId: string; shipping: ShippingData }
//   | { status: 'error'; message: string; from: string }
//
// Шаг 2: Опишите typed actions
// Step 2: Describe typed actions
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
// Step 3: Implement checkoutReducer
// - Каждый case проверяет допустимость перехода (if state.status !== '...' return state)
// - Each case checks transition validity (if state.status !== '...' return state)
// - SUBMIT_PAYMENT -> CONFIRM_ORDER с рандомным orderId в компоненте
// - SUBMIT_PAYMENT -> CONFIRM_ORDER with random orderId in component
//
// Шаг 4: Реализуйте прогресс-бар / stepper
// Step 4: Implement progress bar / stepper
// const STEPS = ['idle', 'shipping', 'payment', 'confirmation']
// Текущий шаг = STEPS.indexOf(state.status)
// Current step = STEPS.indexOf(state.status)
//
// Шаг 5: Рендеринг по состоянию:
// Step 5: Rendering by state:
// - idle: кнопка "Оформить заказ"
// - idle: "Place order" button
// - shipping: форма с name, address, city
// - shipping: form with name, address, city
// - payment: итоговые данные + кнопка "Оплатить"
// - payment: summary data + "Pay" button
// - confirmation: успех с orderId
// - confirmation: success with orderId
// - error: сообщение + кнопки "Повторить" и "Сброс"
// - error: message + "Retry" and "Reset" buttons
//
// Шаг 6: Кнопка "Симулировать ошибку" на шагах shipping и payment
// Step 6: "Simulate error" button on shipping and payment steps
// dispatch({ type: 'SET_ERROR', message: '...' })

// TODO: Опишите interface ShippingData
// TODO: Define ShippingData interface

// TODO: Опишите type CheckoutState
// TODO: Define CheckoutState type

// TODO: Опишите type CheckoutAction
// TODO: Define CheckoutAction type

// TODO: Реализуйте checkoutReducer
// TODO: Implement checkoutReducer

// TODO: Реализуйте компонент CheckoutStepper
// TODO: Implement CheckoutStepper component

export function Task12_3() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 12.3</h2>

      {/* TODO: Добавьте useReducer(checkoutReducer, { status: 'idle' }) */}
      {/* TODO: Add useReducer(checkoutReducer, { status: 'idle' }) */}

      {/* TODO: Отрендерите CheckoutStepper с текущим состоянием */}
      {/* TODO: Render CheckoutStepper with current state */}

      {/* TODO: Рендерите UI в зависимости от state.status */}
      {/* TODO: Render UI depending on state.status */}
      {/* state.status === 'idle' -> кнопка "Оформить заказ" */}
      {/* state.status === 'idle' -> "Place order" button */}
      {/* state.status === 'shipping' -> форма доставки */}
      {/* state.status === 'shipping' -> shipping form */}
      {/* state.status === 'payment' -> форма оплаты с данными доставки */}
      {/* state.status === 'payment' -> payment form with shipping data */}
      {/* state.status === 'confirmation' -> успех с state.orderId */}
      {/* state.status === 'confirmation' -> success with state.orderId */}
      {/* state.status === 'error' -> ошибка с state.message */}
      {/* state.status === 'error' -> error with state.message */}
    </div>
  )
}
