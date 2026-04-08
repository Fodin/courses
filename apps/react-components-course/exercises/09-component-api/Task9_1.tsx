import { useLanguage } from 'src/hooks'

// ============================================
// Задание 9.1: Полиморфный Button с `as` prop
// ============================================
//
// Реализуйте компонент Button, который умеет рендериться
// как разный HTML-элемент через prop `as`.
//
// Требования:
// - `as` prop с дефолтом 'button'
// - `variant`: 'primary' | 'secondary' | 'ghost'
// - `size`: 'sm' | 'md' | 'lg'
// - TypeScript: при as="a" доступны href, target и т.д.
// - TypeScript: при as="button" доступны onClick, disabled и т.д.
// - Все нативные HTML-атрибуты пробрасываются через ...rest
//
// Подсказка: используй React.ComponentPropsWithoutRef<C>
// и generic параметр C extends React.ElementType

// TODO: Определите тип ButtonOwnProps<C>
// type ButtonOwnProps<C extends React.ElementType> = {
//   as?: C
//   variant?: 'primary' | 'secondary' | 'ghost'
//   size?: 'sm' | 'md' | 'lg'
// }

// TODO: Определите тип ButtonProps<C> через Omit + ComponentPropsWithoutRef
// type ButtonProps<C extends React.ElementType = 'button'> = ...

// TODO: Реализуйте компонент Button
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
      {/* TODO: Покажите Button в трёх размерах: sm, md, lg */}
      {/* TODO: Покажите Button как ссылку: as="a" href="https://react.dev" */}
    </div>
  )
}
