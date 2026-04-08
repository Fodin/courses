import { useLanguage } from 'src/hooks'

// ============================================
// Задание 12.4: Capstone — мини UI-библиотека
// Task 12.4: Capstone — mini UI library
// ============================================
//
// Реализуйте 4 компонента + UIKitProvider, применив все паттерны курса.
// Implement 4 components + UIKitProvider, applying all course patterns.
//
// --- UIKitProvider ---
//
// interface UIKitConfig {
//   colorScheme: 'light' | 'dark'
//   primaryColor: string
//   size: 'compact' | 'normal' | 'large'
// }
//
// const UIKitContext = createContext<UIKitConfig>(DEFAULT_CONFIG)
// function useUIKit(): UIKitConfig { return useContext(UIKitContext) }
// function UIKitProvider({ config, children }) { ... }
//
// --- LibButton (полиморфный + forwardRef) ---
// --- LibButton (polymorphic + forwardRef) ---
//
// type LibButtonOwnProps<C extends React.ElementType> = {
//   as?: C
//   variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
//   size?: UIKitConfig['size']
//   isLoading?: boolean
// }
// type LibButtonProps<C extends React.ElementType = 'button'> =
//   LibButtonOwnProps<C> & Omit<React.ComponentPropsWithoutRef<C>, keyof LibButtonOwnProps<C>>
//
// const LibButton = forwardRef(...) as <C extends React.ElementType = 'button'>(...) => ReactElement
//
// --- LibInput (forwardRef + label + error + aria-invalid) ---
//
// const LibInput = forwardRef<HTMLInputElement, LibInputProps>(...)
// useId() для связи label и input
// useId() to link label and input
// aria-invalid={!!error}, aria-describedby при наличии error
// aria-invalid={!!error}, aria-describedby when error is present
//
// --- LibModal (portal + context + ErrorBoundary) ---
//
// createPortal(children, document.body)
// LibModalContext для sub-компонентов
// LibModalContext for sub-components
// LibModal.Header, LibModal.Body (внутри ErrorBoundary), LibModal.Footer
// Закрытие по Escape (useEffect + keydown) и по клику на overlay
// Close on Escape (useEffect + keydown) and on overlay click
//
// --- LibSelect (useDropdown + controlled) ---
//
// Использует useDropdown хук из задания 12.2 (или реализует его заново)
// Uses useDropdown hook from task 12.2 (or implements it from scratch)
// Controlled: value + onChange props
// role="combobox" на trigger, role="listbox" на список
// role="combobox" on trigger, role="listbox" on list
//
// --- Демо / Demo ---
//
// - Переключатель light/dark темы
// - light/dark theme toggle
// - Выбор primaryColor (несколько цветов)
// - primaryColor selection (several colors)
// - Выбор размера (compact/normal/large)
// - Size selection (compact/normal/large)
// - Все компоненты на одном экране
// - All components on one screen
// - Лог событий
// - Event log

// TODO: Реализуйте UIKitConfig, UIKitContext, useUIKit, UIKitProvider
// TODO: Implement UIKitConfig, UIKitContext, useUIKit, UIKitProvider

// TODO: Реализуйте LibButton (полиморфный + forwardRef + isLoading)
// TODO: Implement LibButton (polymorphic + forwardRef + isLoading)

// TODO: Реализуйте LibInput (forwardRef + label + error + aria-invalid)
// TODO: Implement LibInput (forwardRef + label + error + aria-invalid)

// TODO: Реализуйте ModalErrorBoundary (class component)
// TODO: Implement ModalErrorBoundary (class component)

// TODO: Реализуйте LibModal (createPortal + context + sub-компоненты)
// TODO: Implement LibModal (createPortal + context + sub-components)

// TODO: Реализуйте LibSelect (useDropdown + controlled)
// TODO: Implement LibSelect (useDropdown + controlled)

export function Task12_4() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 12.4</h2>

      {/* TODO: Панель конфигурации (тема, цвет, размер) */}
      {/* TODO: Configuration panel (theme, color, size) */}

      {/* TODO: Обернуть демо в UIKitProvider */}
      {/* TODO: Wrap demo in UIKitProvider */}
      {/* <UIKitProvider config={{ colorScheme, primaryColor, size }}> */}
      {/*   LibButton section */}
      {/*   LibInput section */}
      {/*   LibSelect section */}
      {/*   Кнопка открытия LibModal */}
      {/*   LibModal open button */}
      {/*   Лог событий */}
      {/*   Event log */}
      {/* </UIKitProvider> */}

      {/* TODO: LibModal рендерится вне провайдера (через portal) */}
      {/* TODO: LibModal renders outside the provider (via portal) */}
    </div>
  )
}
