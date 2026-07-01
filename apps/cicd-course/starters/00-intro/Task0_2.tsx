import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 0.2: Анатомия пайплайна
// Task 0.2: Pipeline anatomy
// ============================================

// TODO: Определите тип JobStatus для четырёх состояний джоба:
//   'pending' | 'running' | 'success' | 'failed'
// TODO: Define a JobStatus type for four job states:
//   'pending' | 'running' | 'success' | 'failed'

// TODO: Определите интерфейс PipelineJob с полями:
//   id (string), name (string), duration (string), status (JobStatus)
// TODO: Define a PipelineJob interface with fields:
//   id (string), name (string), duration (string), status (JobStatus)

// TODO: Определите интерфейс PipelineStage с полями:
//   id (string), name (string), color (string), bgColor (string), jobs (PipelineJob[])
// TODO: Define a PipelineStage interface with fields:
//   id (string), name (string), color (string), bgColor (string), jobs (PipelineJob[])

// TODO: Создайте массив initialStages с четырьмя стадиями:
//   1. Source — джобы: git checkout, npm install
//   2. Build  — джобы: tsc compile, docker build
//   3. Test   — джобы: unit tests, integration tests, eslint
//   4. Deploy — джобы: deploy staging, smoke tests, deploy prod
//   Все джобы начинают со статусом 'pending'.
//   Придумайте разумное время выполнения для каждого джоба (например '~30 сек').
// TODO: Create an initialStages array with four stages:
//   1. Source — jobs: git checkout, npm install
//   2. Build  — jobs: tsc compile, docker build
//   3. Test   — jobs: unit tests, integration tests, eslint
//   4. Deploy — jobs: deploy staging, smoke tests, deploy prod
//   All jobs start with status 'pending'.
//   Use reasonable durations for each job (e.g., '~30 sec').

// TODO: Создайте словари для иконок и цветов статусов:
//   statusIcon: Record<JobStatus, string> — pending '○', running '⟳', success '✅', failed '❌'
//   statusColor: Record<JobStatus, string> — цвета для каждого статуса
// TODO: Create dictionaries for status icons and colors:
//   statusIcon: Record<JobStatus, string> — pending '○', running '⟳', success '✅', failed '❌'
//   statusColor: Record<JobStatus, string> — colors for each status

export function Task0_2() {
  const { t } = useLanguage()
  // TODO: Создайте состояние stages (массив PipelineStage), начальное значение — initialStages
  // TODO: Create stages state (PipelineStage array), initial value — initialStages
  const [selectedStage, setSelectedStage] = useState<string | null>(null)

  // TODO: Создайте состояние isRunning (boolean) — флаг анимации запуска
  // TODO: Create isRunning state (boolean) — animation running flag

  // TODO: Создайте функцию runPipeline(), которая:
  //   1. Устанавливает isRunning = true
  //   2. Сбрасывает все статусы в 'pending'
  //   3. Последовательно по стадиям с задержкой:
  //      a. Переводит все джобы стадии в 'running' (параллельно!)
  //      b. Автоматически выбирает стадию (setSelectedStage)
  //      c. После паузы переводит все джобы в 'success'
  //   4. В конце устанавливает isRunning = false
  //   Используй setTimeout для задержек.
  // TODO: Create a runPipeline() function that:
  //   1. Sets isRunning = true
  //   2. Resets all statuses to 'pending'
  //   3. Sequentially per stage with delay:
  //      a. Sets all stage jobs to 'running' (in parallel!)
  //      b. Auto-selects the stage (setSelectedStage)
  //      c. After a pause sets all jobs to 'success'
  //   4. At the end sets isRunning = false
  //   Use setTimeout for delays.

  // TODO: Создайте функцию resetPipeline() — сбрасывает stages и selectedStage
  // TODO: Create a resetPipeline() function — resets stages and selectedStage

  // TODO: Создайте вспомогательную функцию getStageOverallStatus(stage: PipelineStage): JobStatus
  //   Возвращает: 'success' если все джобы success,
  //               'failed' если есть хотя бы один failed,
  //               'running' если есть хотя бы один running,
  //               'pending' иначе
  // TODO: Create a helper function getStageOverallStatus(stage: PipelineStage): JobStatus
  //   Returns: 'success' if all jobs are success,
  //            'failed' if any job is failed,
  //            'running' if any job is running,
  //            'pending' otherwise

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.0.2')}</h2>

      {/* TODO: Отобрази стадии горизонтально (flex, слева направо).
          Между стадиями — стрелка →.
          Каждая стадия — прямоугольник с:
          - Иконкой общего статуса стадии (statusIcon[getStageOverallStatus(stage)])
          - Названием стадии цветом stage.color
          - Количеством джобов
          При клике — выбирай/снимай стадию. Выбранная стадия подсвечивается. */}
      {/* TODO: Display stages horizontally (flex, left to right).
          Between stages — an arrow →.
          Each stage is a rectangle with:
          - Overall stage status icon (statusIcon[getStageOverallStatus(stage)])
          - Stage name in stage.color
          - Number of jobs
          On click — select/deselect stage. Selected stage is highlighted. */}

      <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', marginBottom: '1.25rem' }}>
        <div style={{ border: '2px solid #ddd', borderRadius: '8px', padding: '0.75rem 1.25rem', cursor: 'pointer' }}>
          {t('task.0.2.placeholder.stages')}
        </div>
      </div>

      {/* TODO: Если стадия выбрана, покажи панель деталей.
          В ней отобрази карточки всех джобов стадии:
          - Иконка статуса джоба (statusIcon[job.status])
          - Название джоба
          - Время выполнения
          - Текущий статус цветом statusColor[job.status]
          Добавь примечание: "Джобы внутри одной стадии выполняются параллельно". */}
      {/* TODO: If a stage is selected, show the details panel.
          Display cards for all jobs in the stage:
          - Job status icon (statusIcon[job.status])
          - Job name
          - Duration
          - Current status in statusColor[job.status]
          Add a note: "Jobs within one stage run in parallel". */}

      {/* TODO: Добавь словарик ключевых понятий: Pipeline, Stage, Job, Artifact */}
      {/* TODO: Add a glossary of key terms: Pipeline, Stage, Job, Artifact */}

      {/* TODO: Добавь кнопки управления:
          - "Запустить пайплайн" — вызывает runPipeline(), disabled пока isRunning
          - "Сбросить" — вызывает resetPipeline() */}
      {/* TODO: Add control buttons:
          - "Run pipeline" — calls runPipeline(), disabled while isRunning
          - "Reset" — calls resetPipeline() */}

      <button onClick={() => setSelectedStage(null)} style={{ marginTop: '1rem' }}>
        {t('task.0.2.reset')} (заглушка)
      </button>
    </div>
  )
}
