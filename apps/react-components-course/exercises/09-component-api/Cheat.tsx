export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Level 9: Подсказки по проектированию API / API Design Hints</h2>

      <section style={{ marginBottom: '1.5rem' }}>
        {/* 9.1 — Полиморфный Button / Polymorphic Button */}
        <h3 style={{ color: '#1976d2', marginBottom: '0.5rem' }}>9.1 — Полиморфный Button / Polymorphic Button</h3>
        {/* Шаблон для полиморфного компонента: / Template for a polymorphic component: */}
        <p style={{ color: '#555', marginBottom: '0.5rem' }}>Шаблон для полиморфного компонента: / Template for a polymorphic component:</p>
        <pre style={{ background: '#f5f5f5', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem', overflow: 'auto' }}>{`type ButtonOwnProps<C extends React.ElementType> = {
  as?: C
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

type ButtonProps<C extends React.ElementType = 'button'> =
  ButtonOwnProps<C> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof ButtonOwnProps<C>>

function Button<C extends React.ElementType = 'button'>({
  as, variant = 'primary', size = 'md', ...rest
}: ButtonProps<C>) {
  const Component = as ?? 'button'
  return <Component {...rest} />
}`}</pre>
      </section>

      <section style={{ marginBottom: '1.5rem' }}>
        {/* 9.2 — Modal discriminated union */}
        <h3 style={{ color: '#1976d2', marginBottom: '0.5rem' }}>9.2 — Modal discriminated union</h3>
        {/* TypeScript сужает тип через дискриминатор: / TypeScript narrows the type via the discriminator: */}
        <p style={{ color: '#555', marginBottom: '0.5rem' }}>TypeScript сужает тип через дискриминатор: / TypeScript narrows the type via the discriminator:</p>
        <pre style={{ background: '#f5f5f5', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem', overflow: 'auto' }}>{`type ModalProps =
  | { variant: 'alert'; message: string; onClose: () => void }
  | { variant: 'confirm'; message: string; onConfirm: () => void; onCancel: () => void }
  | { variant: 'form'; title: string; children: React.ReactNode; onSubmit: () => void; onCancel: () => void }

function Modal(props: ModalProps) {
  if (props.variant === 'alert') {
    // здесь TypeScript знает: props.message и props.onClose есть
    // here TypeScript knows: props.message and props.onClose exist
    return <div>...</div>
  }
  // ...
}`}</pre>
      </section>

      <section style={{ marginBottom: '1.5rem' }}>
        {/* 9.3 — Generic SelectableList */}
        <h3 style={{ color: '#1976d2', marginBottom: '0.5rem' }}>9.3 — Generic SelectableList</h3>
        {/* Сравнение элементов через keyExtractor: / Comparing items via keyExtractor: */}
        <p style={{ color: '#555', marginBottom: '0.5rem' }}>Сравнение элементов через keyExtractor: / Comparing items via keyExtractor:</p>
        <pre style={{ background: '#f5f5f5', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem', overflow: 'auto' }}>{`function SelectableList<T>({ items, selectedItem, onSelect, renderItem, keyExtractor }) {
  return (
    <ul>
      {items.map(item => {
        const key = keyExtractor(item)
        const isSelected = selectedItem !== null
          && keyExtractor(selectedItem) === key
        return (
          <li key={key} onClick={() => onSelect(item)}>
            {renderItem(item, isSelected)}
          </li>
        )
      })}
    </ul>
  )
}`}</pre>
      </section>

      <section>
        {/* 9.4 — Generic + forwardRef workaround */}
        <h3 style={{ color: '#1976d2', marginBottom: '0.5rem' }}>9.4 — Generic + forwardRef workaround</h3>
        {/* Type assertion сохраняет generic T: / Type assertion preserves generic T: */}
        <p style={{ color: '#555', marginBottom: '0.5rem' }}>Type assertion сохраняет generic T: / Type assertion preserves generic T:</p>
        <pre style={{ background: '#f5f5f5', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem', overflow: 'auto' }}>{`const AutocompleteInner = forwardRef(
  function AutocompleteImpl<T>(
    props: AutocompleteProps<T>,
    ref: React.Ref<HTMLInputElement>
  ) {
    // реализация
    // implementation
  }
)
AutocompleteInner.displayName = 'Autocomplete'

// Type assertion: восстанавливаем generic T
// Type assertion: restore generic T
const Autocomplete = AutocompleteInner as <T>(
  props: AutocompleteProps<T> & { ref?: React.Ref<HTMLInputElement> }
) => ReactElement`}</pre>
      </section>
    </div>
  )
}
