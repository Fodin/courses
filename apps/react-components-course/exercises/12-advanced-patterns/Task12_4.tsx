import { useLanguage } from 'src/hooks'

// ============================================
// Задание 12.4: Capstone — мини UI-библиотека
// ============================================
//
// Реализуйте 4 компонента + UIKitProvider, применив все паттерны курса.
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
// aria-invalid={!!error}, aria-describedby при наличии error
//
// --- LibModal (portal + context + ErrorBoundary) ---
//
// createPortal(children, document.body)
// LibModalContext для sub-компонентов
// LibModal.Header, LibModal.Body (внутри ErrorBoundary), LibModal.Footer
// Закрытие по Escape (useEffect + keydown) и по клику на overlay
//
// --- LibSelect (useDropdown + controlled) ---
//
// Использует useDropdown хук из задания 12.2 (или реализует его заново)
// Controlled: value + onChange props
// role="combobox" на trigger, role="listbox" на список
//
// --- Демо ---
//
// - Переключатель light/dark темы
// - Выбор primaryColor (несколько цветов)
// - Выбор размера (compact/normal/large)
// - Все компоненты на одном экране
// - Лог событий

// TODO: Реализуйте UIKitConfig, UIKitContext, useUIKit, UIKitProvider

// TODO: Реализуйте LibButton (полиморфный + forwardRef + isLoading)

// TODO: Реализуйте LibInput (forwardRef + label + error + aria-invalid)

// TODO: Реализуйте ModalErrorBoundary (class component)

// TODO: Реализуйте LibModal (createPortal + context + sub-компоненты)

// TODO: Реализуйте LibSelect (useDropdown + controlled)

export function Task12_4() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 12.4</h2>

      {/* TODO: Панель конфигурации (тема, цвет, размер) */}

      {/* TODO: Обернуть демо в UIKitProvider */}
      {/* <UIKitProvider config={{ colorScheme, primaryColor, size }}> */}
      {/*   LibButton section */}
      {/*   LibInput section */}
      {/*   LibSelect section */}
      {/*   Кнопка открытия LibModal */}
      {/*   Лог событий */}
      {/* </UIKitProvider> */}

      {/* TODO: LibModal рендерится вне провайдера (через portal) */}
    </div>
  )
}
