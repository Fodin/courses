import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 2.2: createValidator — HOF
// Task 2.2: createValidator — HOF
// ============================================
// Реализуйте HOF createValidator, принимающую массив правил
// и возвращающую функцию-валидатор.
// Implement the HOF createValidator that accepts an array of rules
// and returns a validator function.

// TODO: Определите тип Rule
// TODO: Define the Rule type
// type Rule = {
//   id: string
//   label: string
//   check: (value: string) => boolean
//   message: string
// }

// TODO: Реализуйте createValidator
// TODO: Implement createValidator
// function createValidator(rules: Rule[]): (value: string) => string[] {
//   return (value) => {
//     // Верните массив сообщений об ошибках для правил, у которых check вернул false
//     // Return array of error messages for rules where check returned false
//   }
// }

// TODO: Создайте 5 предустановленных правил:
// TODO: Create 5 preset rules:
// const ALL_RULES: Rule[] = [
//   { id: 'minLength', label: 'Мин. длина 3',   check: v => v.length >= 3,     message: 'Минимум 3 символа' },
//   { id: 'maxLength', label: 'Макс. длина 20',  check: v => v.length <= 20,    message: 'Максимум 20 символов' },
//   { id: 'noSpaces',  label: 'Без пробелов',    check: v => !v.includes(' '),  message: 'Пробелы не допускаются' },
//   { id: 'hasUpper',  label: 'Есть заглавная',  check: v => /[A-Z]/.test(v),   message: 'Нужна хотя бы одна заглавная буква' },
//   { id: 'hasDigit',  label: 'Есть цифра',      check: v => /[0-9]/.test(v),   message: 'Нужна хотя бы одна цифра' },
// ]

export function Task2_2() {
  const { t } = useLanguage()

  // TODO: Состояние для значения ввода
  // TODO: State for input value
  // const [inputValue, setInputValue] = useState('hello')

  // TODO: Состояние для активных id правил (используйте Set<string>)
  // TODO: State for active rule ids (use Set<string>)
  // const [activeRuleIds, setActiveRuleIds] = useState<Set<string>>(
  //   new Set(['minLength', 'maxLength', 'noSpaces', 'hasUpper', 'hasDigit'])
  // )

  // TODO: Вычислите activeRules — отфильтрованный массив из ALL_RULES
  // TODO: Compute activeRules — filtered array from ALL_RULES

  // TODO: Вызовите createValidator с activeRules и получите validate
  // TODO: Call createValidator with activeRules and get validate
  // const validate = createValidator(activeRules)
  // const errors = validate(inputValue)

  // TODO: Функция переключения правила
  // TODO: Rule toggle function
  // const toggleRule = (id: string) => { ... }

  return (
    <div className="exercise-container">
      <h2>{t('task.2.2')}</h2>

      {/* TODO: Чекбоксы для каждого правила из ALL_RULES */}
      {/* TODO: Checkboxes for each rule from ALL_RULES */}
      {/* Каждый чекбокс включает/выключает правило */}
      {/* Each checkbox enables/disables the rule */}
      {/* Рядом показать статус check для текущего inputValue (OK / fail) */}
      {/* Show check status for current inputValue next to each (OK / fail) */}

      {/* TODO: Текстовый ввод */}
      {/* TODO: Text input */}
      {/* При изменении — немедленно обновляет errors */}
      {/* On change — immediately updates errors */}

      {/* TODO: Отобразите ошибки (красные) или сообщение об успехе (зелёное) */}
      {/* TODO: Display errors (red) or success message (green) */}

      {/* TODO: Блок кода с реализацией createValidator */}
      {/* TODO: Code block with createValidator implementation */}

      {/* TODO: Блок кода с текущей конфигурацией активных правил */}
      {/* TODO: Code block with current active rules configuration */}
    </div>
  )
}
