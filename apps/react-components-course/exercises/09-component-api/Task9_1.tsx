import { useLanguage } from 'src/hooks'

// ============================================
// Задание 9.1: Полиморфный Button с `as` prop
// Task 9.1: Polymorphic Button with `as` prop
// ============================================
//
// Реализуйте компонент Button, который умеет рендериться
// как разный HTML-элемент через prop `as`.
// Implement a Button component that can render
// as different HTML elements via the `as` prop.
//
// Требования:
// Requirements:
// - `as` prop с дефолтом 'button'
// - `as` prop with default 'button'
// - `variant`: 'primary' | 'secondary' | 'ghost'
// - `size`: 'sm' | 'md' | 'lg'
// - TypeScript: при as="a" доступны href, target и т.д.
// - TypeScript: when as="a", href, target, etc. are available
// - TypeScript: при as="button" доступны onClick, disabled и т.д.
// - TypeScript: when as="button", onClick, disabled, etc. are available
// - Все нативные HTML-атрибуты пробрасываются через ...rest
// - All native HTML attributes are passed through via ...rest
//
// Подсказка: используй React.ComponentPropsWithoutRef<C>
// Hint: use React.ComponentPropsWithoutRef<C>
// и generic параметр C extends React.ElementType
// and generic parameter C extends React.ElementType

// TODO: Определите тип ButtonOwnProps<C>
// TODO: Define ButtonOwnProps<C> type
// type ButtonOwnProps<C extends React.ElementType> = {
//   as?: C
//   variant?: 'primary' | 'secondary' | 'ghost'
//   size?: 'sm' | 'md' | 'lg'
// }

// TODO: Определите тип ButtonProps<C> через Omit + ComponentPropsWithoutRef
// TODO: Define ButtonProps<C> type via Omit + ComponentPropsWithoutRef
// type ButtonProps<C extends React.ElementType = 'button'> = ...

// TODO: Реализуйте компонент Button
// TODO: Implement Button component
// function Button<C extends React.ElementType = 'button'>({
//   as,
//   variant = 'primary',
//   size = 'md',
//   ...rest
// }: ButtonProps<C>) {
//   const Component = as ?? 'button'
//   return <Component ... />
// }

export function Task9_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 9.1</h2>

      {/* TODO: Покажите Button в трёх вариантах: primary, secondary, ghost */}
      {/* TODO: Show Button in three variants: primary, secondary, ghost */}
      {/* TODO: Покажите Button в трёх размерах: sm, md, lg */}
      {/* TODO: Show Button in three sizes: sm, md, lg */}
      {/* TODO: Покажите Button как ссылку: as="a" href="https://react.dev" */}
      {/* TODO: Show Button as a link: as="a" href="https://react.dev" */}
    </div>
  )
}
