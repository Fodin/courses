import { useLanguage } from 'src/hooks'

// ============================================
// Задание 12.2: Headless useDropdown + Dropdown compound
// ============================================
//
// Шаг 1: Реализуйте хук useDropdown
//
// interface UseDropdownReturn {
//   isOpen: boolean
//   selected: string | null
//   options: string[]
//   triggerProps: {
//     onClick: () => void
//     'aria-haspopup': 'listbox'
//     'aria-expanded': boolean
//   }
//   listboxProps: {
//     role: 'listbox'
//     'aria-label': string
//   }
//   getOptionProps: (option: string) => {
//     role: 'option'
//     'aria-selected': boolean
//     onClick: () => void
//   }
//   close: () => void
// }
//
// function useDropdown({ options, defaultSelected?, onSelect? }): UseDropdownReturn
//
// Шаг 2: Создайте DropdownContext + useDropdownContext (с проверкой null)
//
// Шаг 3: Реализуйте Dropdown compound component
//
// function Dropdown({ options, onSelect, children }) {
//   const dropdown = useDropdown(...)
//   // useRef + useEffect: закрытие по клику снаружи
//   return (
//     <DropdownContext.Provider value={dropdown}>
//       <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
//         {children}
//       </div>
//     </DropdownContext.Provider>
//   )
// }
//
// Dropdown.Trigger = function DropdownTrigger({ children? }) { ... }
// Dropdown.List = function DropdownList() { ... }   // рендерит только при isOpen
// Dropdown.Option = function DropdownOption({ option }) { ... }
//
// Шаг 4: Демо
// - Слева: compound API (<Dropdown> + sub-компоненты)
// - Справа: кастомный UI через useDropdown напрямую
// - Лог выборов под обоими

// TODO: Опишите интерфейс UseDropdownReturn

// TODO: Реализуйте хук useDropdown

// TODO: Создайте DropdownContext и useDropdownContext

// TODO: Реализуйте Dropdown.Trigger, Dropdown.List, Dropdown.Option

export function Task12_2() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 12.2</h2>

      {/* TODO: Слева — Dropdown через compound API */}
      {/* <Dropdown options={['A', 'B', 'C']} onSelect={...}> */}
      {/*   <Dropdown.Trigger /> */}
      {/*   <Dropdown.List /> */}
      {/* </Dropdown> */}

      {/* TODO: Справа — кастомный UI через useDropdown напрямую */}
      {/* const dd = useDropdown({ options: ['X', 'Y', 'Z'], onSelect }) */}
      {/* <button {...dd.triggerProps}>...</button> */}
      {/* {dd.isOpen && <ul {...dd.listboxProps}>...</ul>} */}

      {/* TODO: Лог выборов */}
    </div>
  )
}
