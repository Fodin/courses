// ============================================
// Задание 1.1: Структура .gitlab-ci.yml
// Task 1.1: .gitlab-ci.yml structure
// ============================================
//
// ЦЕЛЬ: Собери интерактивный конструктор .gitlab-ci.yml из блоков.
// GOAL: Build an interactive .gitlab-ci.yml constructor from blocks.
//
// ТРЕБОВАНИЯ / REQUIREMENTS:
// 1. Определи интерфейс YamlBlock (id, label, content, required, description, color)
//    Define interface YamlBlock (id, label, content, required, description, color)
//
// 2. Создай массив из 6 блоков: stages, image, job-name, stage, script, after_script
//    Create an array of 6 blocks: stages, image, job-name, stage, script, after_script
//
// 3. Реализуй состояние selectedIds (массив id выбранных блоков)
//    Implement selectedIds state (array of selected block ids)
//
// 4. Отобрази два раздела: "Доступные блоки" и "Твой конфиг" (YAML-превью)
//    Render two sections: "Available blocks" and "Your config" (YAML preview)
//
// 5. Реализуй валидацию при нажатии "Проверить":
//    Implement validation on "Check" button click:
//    - есть ли job-name / is job-name present
//    - есть ли script / is script present
//    - если stage указан — есть ли stages / if stage is set — is stages present
//
// 6. Покажи результат: зелёный успех или красный список ошибок
//    Show result: green success or red error list
//
// ПОДСКАЗКИ / TIPS:
// - Используй useState для selectedIds и validationResult
//   Use useState for selectedIds and validationResult
// - YAML-превью: объедини content выбранных блоков через '\n\n'
//   YAML preview: join content of selected blocks with '\n\n'
// - Для моноширинного шрифта: fontFamily: "'Courier New', monospace"
//   For monospace font: fontFamily: "'Courier New', monospace"

import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// TODO: Define YamlBlock interface
// interface YamlBlock { ... }

// TODO: Create availableBlocks array with 6 blocks
// const availableBlocks: YamlBlock[] = [...]

export function Task1_1() {
  const { t } = useLanguage()
  // TODO: Add selectedIds state
  // const [selectedIds, setSelectedIds] = useState<string[]>([])

  // TODO: Add validation result state
  // const [validationResult, setValidationResult] = useState(...)

  // TODO: Implement toggleBlock function
  // const toggleBlock = (id: string) => { ... }

  // TODO: Implement validate function
  // const handleCheck = () => { ... }

  // TODO: Build YAML preview from selectedIds
  // const yamlPreview = buildYamlPreview(selectedIds)

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.1.1')}</h2>

      {/* TODO: Render available blocks */}
      {/* <div>{t('task.1.1.availableBlocks')}: ...</div> */}

      {/* TODO: Render YAML preview */}
      {/* <pre style={{ background: '#1e1e1e', color: '#d4d4d4', ... }}>
        {t('task.1.1.yourConfig')}
      </pre> */}

      {/* TODO: Render check and reset buttons */}
      {/* <button>{t('task.1.1.check')}</button> */}

      {/* TODO: Render validation result */}
    </div>
  )
}
