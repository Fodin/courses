import { useState, forwardRef, useRef } from 'react'
import { useLanguage } from 'src/hooks'
import type { ReactElement } from 'react'

// ============================================
// Задание 9.4: Autocomplete<T> + forwardRef
// Task 9.4: Autocomplete<T> + forwardRef
// ============================================
//
// Реализуйте generic компонент Autocomplete<T> с поддержкой forwardRef.
// Implement a generic component Autocomplete<T> with forwardRef support.
// Ref указывает на HTMLInputElement внутри компонента.
// Ref points to the HTMLInputElement inside the component.
//
// Props компонента:
// Component props:
// - options: T[]
// - value: string
// - onChange: (value: string) => void
// - onSelect: (item: T) => void
// - getOptionLabel: (item: T) => string
// - placeholder?: string
//
// Проблема: forwardRef + generics в React 18 требует workaround.
// Problem: forwardRef + generics in React 18 requires a workaround.
//
// Workaround через type assertion:
// Workaround via type assertion:
// const AutocompleteInner = forwardRef(function AutocompleteImpl<T>(
//   props: AutocompleteProps<T>,
//   ref: React.Ref<HTMLInputElement>
// ) { ... })
//
// AutocompleteInner.displayName = 'Autocomplete'
//
// const Autocomplete = AutocompleteInner as <T>(
//   props: AutocompleteProps<T> & { ref?: React.Ref<HTMLInputElement> }
// ) => ReactElement

// TODO: Определите интерфейс AutocompleteProps<T>
// TODO: Define AutocompleteProps<T> interface
// interface AutocompleteProps<T> { ... }

// TODO: Реализуйте AutocompleteInner через forwardRef
// TODO: Implement AutocompleteInner via forwardRef
// const AutocompleteInner = forwardRef(function AutocompleteImpl<T>(...) { ... })
// AutocompleteInner.displayName = 'Autocomplete'

// TODO: Примените type assertion для сохранения generic
// TODO: Apply type assertion to preserve generic
// const Autocomplete = AutocompleteInner as <T>(...) => ReactElement

// Тестовые данные
// Test data
interface City {
  id: string
  name: string
  region: string
}

const DEMO_CITIES: City[] = [
  { id: '1', name: 'Москва', region: 'Московская область' },
  { id: '2', name: 'Санкт-Петербург', region: 'Ленинградская область' },
  { id: '3', name: 'Новосибирск', region: 'Новосибирская область' },
  { id: '4', name: 'Екатеринбург', region: 'Свердловская область' },
  { id: '5', name: 'Казань', region: 'Республика Татарстан' },
]

export function Task9_4() {
  const { t } = useLanguage()
  const [value, setValue] = useState('')
  const [selected, setSelected] = useState<City | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 9.4</h2>

      {/* TODO: Используйте Autocomplete с City[] и inputRef */}
      {/* TODO: Use Autocomplete with City[] and inputRef */}
      {/* <Autocomplete
        ref={inputRef}
        options={DEMO_CITIES}
        value={value}
        onChange={setValue}
        onSelect={city => setSelected(city)}
        getOptionLabel={city => city.name}
        placeholder="Начните вводить название..."
      /> */}

      {/* TODO: Кнопка для фокусировки через ref */}
      {/* TODO: Button for focusing via ref */}
      {/* <button onClick={() => inputRef.current?.focus()}>
        Сфокусировать через ref
      </button> */}

      {/* TODO: Показать выбранный город */}
      {/* TODO: Show selected city */}
      {selected && <div>Выбран: {selected.name}</div>}
    </div>
  )
}
