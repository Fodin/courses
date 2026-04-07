// ============================================
// Задание 1.2: Stages и порядок выполнения
// Task 1.2: Stages and execution order
// ============================================
//
// ЦЕЛЬ: Визуализируй порядок выполнения пайплайна с параллельными job'ами внутри стадий.
// GOAL: Visualize pipeline execution order with parallel jobs within stages.
//
// ТРЕБОВАНИЯ / REQUIREMENTS:
// 1. Определи интерфейс PipelineJob (id, name, stage, status, duration)
//    Define interface PipelineJob (id, name, stage, status, duration)
//    status: 'pending' | 'running' | 'success' | 'failed'
//
// 2. Определи интерфейс PipelineStage (name, jobs)
//    Define interface PipelineStage (name, jobs)
//
// 3. Создай начальные данные: стадии build, test, deploy с 2-3 job'ами каждая
//    Create initial data: stages build, test, deploy with 2-3 jobs each
//
// 4. Визуализируй пайплайн горизонтально (стадии слева направо):
//    Visualize pipeline horizontally (stages left to right):
//    - Каждая стадия — колонка с заголовком / Each stage is a column with header
//    - Job'ы в колонке в виде карточек / Jobs as cards in the column
//    - Стрелки → между стадиями / Arrows → between stages
//
// 5. Реализуй симуляцию через кнопку "Запустить пайплайн":
//    Implement simulation via "Run pipeline" button:
//    - Job'ы одной стадии переходят в 'running' одновременно
//      Jobs in one stage become 'running' simultaneously
//    - После паузы (максимальная duration стадии) — 'success' или 'failed'
//      After pause (max stage duration) — 'success' or 'failed'
//    - Если хотя бы один job failed — следующие стадии не запускаются
//      If any job failed — subsequent stages don't run
//
// 6. Добавь форму для добавления job'а (имя + выбор стадии)
//    Add form to add a job (name + stage select)
//
// ПОДСКАЗКИ / TIPS:
// - Используй async/await + setTimeout для симуляции задержки
//   Use async/await + setTimeout to simulate delays
// - Цвета статусов: pending=#F5F5F5, running=#E3F2FD, success=#E8F5E9, failed=#FFEBEE
//   Status colors: pending, running, success, failed
// - useRef для флага "симуляция активна" чтобы остановить при сбросе
//   useRef for "simulation active" flag to stop on reset

import { useState, useRef } from 'react'
import { useLanguage } from '@courses/platform'

// TODO: Define status types
// type JobStatus = 'pending' | 'running' | 'success' | 'failed'

// TODO: Define PipelineJob interface
// interface PipelineJob { ... }

// TODO: Define PipelineStage interface
// interface PipelineStage { ... }

// TODO: Create initialStages data
// const initialStages: PipelineStage[] = [...]

export function Task1_2() {
  const { t } = useLanguage()
  // TODO: Add stages state
  // const [stages, setStages] = useState<PipelineStage[]>(...)

  // TODO: Add running state
  // const [running, setRunning] = useState(false)

  // TODO: Add form state (newJobName, newJobStage)
  // const [newJobName, setNewJobName] = useState('')
  // const [newJobStage, setNewJobStage] = useState('build')

  // TODO: Add runningRef for stopping simulation
  // const runningRef = useRef(false)

  // TODO: Implement resetPipeline
  // const resetPipeline = () => { ... }

  // TODO: Implement runPipeline (async with setTimeout)
  // const runPipeline = async () => { ... }

  // TODO: Implement addJob
  // const addJob = () => { ... }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.1.2')}</h2>

      {/* TODO: Render horizontal pipeline visualization */}
      {/* <div style={{ display: 'flex', gap: '0' }}>
        {stages.map((stage, si) => (
          <div key={stage.name} style={{ display: 'flex', alignItems: 'flex-start' }}>
            колонка стадии + стрелка
          </div>
        ))}
      </div> */}

      {/* TODO: Render run / reset buttons */}

      {/* TODO: Render add job form */}
    </div>
  )
}
