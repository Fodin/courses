// ============================================
// Задание 1.4: Ключевое слово image
// Task 1.4: The image keyword
// ============================================
//
// ЦЕЛЬ: Создай интерактивный каталог Docker-образов и задание на сопоставление.
// GOAL: Create an interactive Docker image catalog with a matching exercise.
//
// ТРЕБОВАНИЯ / REQUIREMENTS:
// 1. Определи интерфейс DockerImage:
//    Define interface DockerImage:
//    { name, category, sizeMb, tools, useCases, pros, cons }
//    category: 'javascript' | 'python' | 'go' | 'ruby' | 'generic'
//
// 2. Создай данные для 6 образов:
//    Create data for 6 images:
//    - node:20-alpine (~170 МБ)
//    - python:3.11-slim (~130 МБ)
//    - golang:1.21-alpine (~270 МБ)
//    - ruby:3.2-alpine (~80 МБ)
//    - alpine:3.18 (~5 МБ)
//    - ubuntu:22.04 (~70 МБ)
//
// 3. Отобрази карточки в сетке (CSS grid или flex wrap):
//    Display cards in grid (CSS grid or flex wrap):
//    - Имя образа (monospace) / Image name (monospace)
//    - Размер с цветом: зелёный ≤100, жёлтый ≤300, красный >300 МБ
//      Size with color: green ≤100, yellow ≤300, red >300 MB
//    - Первые 3 инструмента в виде тегов / First 3 tools as tags
//    - Клик раскрывает pros/cons/useCases / Click expands pros/cons/useCases
//
// 4. Задание на сопоставление (4 проекта → нужный образ):
//    Matching exercise (4 projects → correct image):
//    - React-приложение → node:20-alpine
//    - Python Data Pipeline → python:3.11-slim
//    - Go Микросервис → golang:1.21-alpine
//    - Shell CI-утилита → alpine:3.18
//
// 5. Кнопка "Проверить" показывает правильность с объяснением для каждого проекта
//    "Check" button shows correctness with explanation for each project
//
// ПОДСКАЗКИ / TIPS:
// - Состояние expandedImage: string | null для раскрытых карточек
//   expandedImage: string | null state for expanded cards
// - Состояние answers: Record<string, string> для ответов
//   answers: Record<string, string> state for answers
// - Состояние checked: boolean для показа результата
//   checked: boolean state for showing result
// - Кнопка "Проверить" активна только когда все проекты получили ответ
//   "Check" button only active when all projects have answers

import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// TODO: Define ImageCategory type
// type ImageCategory = 'javascript' | 'python' | 'go' | 'ruby' | 'generic'

// TODO: Define DockerImage interface
// interface DockerImage { name: string; category: ImageCategory; sizeMb: number; tools: string[]; useCases: string[]; pros: string[]; cons: string[] }

// TODO: Create dockerImages array with 6 images
// const dockerImages: DockerImage[] = [...]

// TODO: Define ProjectMatch interface and create projectMatches array
// interface ProjectMatch { id: string; label: string; description: string; correctImage: string; explanation: string }
// const projectMatches: ProjectMatch[] = [...]

// TODO: Helper function getSizeColor(sizeMb: number): string
// ≤100 → '#2E7D32', ≤300 → '#E65100', >300 → '#C62828'

export function Task1_4() {
  const { t } = useLanguage()
  // TODO: Add state: expandedImage, answers, checked
  // const [expandedImage, setExpandedImage] = useState<string | null>(null)
  // const [answers, setAnswers] = useState<Record<string, string>>({})
  // const [checked, setChecked] = useState(false)

  // TODO: Compute allAnswered
  // const allAnswered = projectMatches.every(p => answers[p.id])

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.1.4')}</h2>

      {/* TODO: Render image catalog section */}
      {/* <h3>{t('task.1.4.imageCatalog')}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.75rem' }}>
        {dockerImages.map(img => ( ... ))}
      </div> */}

      {/* TODO: Render matching exercise section */}
      {/* <h3>{t('task.1.4.matchingTitle')}</h3>
      {projectMatches.map(project => ( select + result ))} */}

      {/* TODO: Render "Check" button */}
      {/* <button>{t('task.1.4.check')}</button> */}

      {/* TODO: Show tip after check */}
    </div>
  )
}
