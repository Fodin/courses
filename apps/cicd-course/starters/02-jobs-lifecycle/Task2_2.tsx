// ============================================
// Задание 2.2: allow_failure и when
// Task 2.2: allow_failure and when
// ============================================
//
// RU: Реализуй симулятор пайплайна с 4 джобами.
//     Каждый джоб можно настроить: allow_failure и when (on_success, on_failure, always, manual).
//     Симуляция показывает, как эти настройки влияют на поведение пайплайна при ошибках.
//
// EN: Implement a pipeline simulator with 4 jobs.
//     Each job is configurable: allow_failure and when (on_success, on_failure, always, manual).
//     Simulation shows how these settings affect pipeline behavior when jobs fail.
// ============================================

import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// TODO (RU): Определи тип WhenOption — допустимые значения для поля when:
//            'on_success' | 'on_failure' | 'always' | 'manual'
// TODO (EN): Define WhenOption type — valid values for the when field
// type WhenOption = ...

// TODO (RU): Определи тип PipelineJobStatus — состояния джоба в пайплайне:
//            'pending' | 'running' | 'success' | 'failed' | 'warning' | 'skipped' | 'manual_wait'
//            'warning' — это failed + allow_failure: true (мягкая ошибка)
// TODO (EN): Define PipelineJobStatus — job states in the pipeline.
//            'warning' = failed + allow_failure: true (soft failure)
// type PipelineJobStatus = ...

// TODO (RU): Определи интерфейс PipelineJob — конфигурация джоба:
//            { id: string, name: string, allowFailure: boolean, when: WhenOption }
// TODO (EN): Define PipelineJob interface — job configuration
// interface PipelineJob { ... }

// TODO (RU): Создай начальный список джобов INITIAL_JOBS с 4 джобами:
//            lint, test, coverage (allowFailure: true), deploy
// TODO (EN): Create INITIAL_JOBS with 4 jobs: lint, test, coverage (allowFailure: true), deploy
// const INITIAL_JOBS: PipelineJob[] = [...]

// TODO (RU): Создай объект со стилями для каждого статуса (bg, border, color, label, icon)
//            success — зелёный, failed — красный, warning — жёлтый, skipped — серый
// TODO (EN): Create style object for each status (bg, border, color, label, icon)
// const JOB_STATUS_STYLE = { ... }

export function Task2_2() {
  const { t } = useLanguage()
  // TODO (RU): Добавь состояния:
  //            - jobs: PipelineJob[] — конфигурация (начальное: INITIAL_JOBS)
  //            - jobStates: { id, status }[] — текущие статусы джобов (начальное: [])
  //            - isRunning: boolean — идёт ли симуляция
  //            - currentJobIndex: number — индекс текущего running джоба
  //            - pipelineFinished: boolean — завершён ли пайплайн
  // TODO (EN): Add state:
  //            - jobs — job configuration
  //            - jobStates — current job statuses
  //            - isRunning — is simulation running
  //            - currentJobIndex — index of currently running job
  //            - pipelineFinished — is pipeline done

  // TODO (RU): Реализуй функцию updateJob(id, update) — обновляет поля конкретного джоба в массиве jobs
  // TODO (EN): Implement updateJob(id, update) — updates specific job fields in jobs array

  // TODO (RU): Реализуй функцию computeJobStatus(job, pipelineHasHardFail) — возвращает статус джоба:
  //            - when: 'manual' → 'manual_wait'
  //            - when: 'always' → 'running'
  //            - when: 'on_failure' → 'running' если есть hard fail, иначе 'skipped'
  //            - when: 'on_success' → 'skipped' если есть hard fail, иначе 'running'
  //            Hard fail — это failed без allow_failure
  // TODO (EN): Implement computeJobStatus(job, pipelineHasHardFail) — returns job status based on when/allow_failure logic

  // TODO (RU): Реализуй async функцию runPipeline():
  //            Для каждого джоба последовательно:
  //            1. Вычисли начальный статус через computeJobStatus
  //            2. Если skipped или manual_wait — пропусти с небольшой задержкой
  //            3. Если running — покажи кнопки "Успех" / "Провал" и жди клика
  //            4. При клике: если failed && allowFailure → warning, иначе → failed (hardFail = true)
  //            Используй CustomEvent('jobResult') для передачи результата из кнопок в runPipeline
  // TODO (EN): Implement async runPipeline():
  //            For each job sequentially:
  //            1. Compute initial status via computeJobStatus
  //            2. If skipped or manual_wait — skip with short delay
  //            3. If running — show Success/Fail buttons and wait for click
  //            4. On click: if failed && allowFailure → warning, else → failed (hardFail = true)
  //            Use CustomEvent('jobResult') to pass result from buttons to runPipeline

  // TODO (RU): Реализуй функцию sendJobResult(id, result) — диспатчит CustomEvent с результатом
  // TODO (EN): Implement sendJobResult(id, result) — dispatches CustomEvent with result

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 760, margin: '0 auto', padding: '1.5rem' }}>
      <h2 style={{ marginTop: 0 }}>{t('task.2.2.title')}</h2>

      {/* TODO (RU): Отобразить список джобов. Для каждого:
                    - Текущий статус с иконкой и цветом
                    - Чекбокс allow_failure
                    - Выпадающий список when (on_success, on_failure, always, manual)
                    - Кнопки "Успех" / "Провал" — только для running джоба */}
      {/* TODO (EN): Render job list. For each:
                    - Current status with icon and color
                    - allow_failure checkbox
                    - when dropdown (on_success, on_failure, always, manual)
                    - Success/Fail buttons — only for currently running job */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ padding: '10px', border: '1px dashed #ccc', borderRadius: 8, color: '#999', textAlign: 'center' }}>
          {t('task.2.2.jobConfigPlaceholder')}
        </div>
      </div>

      {/* TODO (RU): Отобразить кнопку "Запустить пайплайн" (disabled во время выполнения)
                    и кнопку Reset.
                    После завершения — показать итоговый статус пайплайна (Pass / Fail) */}
      {/* TODO (EN): Render "Run pipeline" button (disabled during execution) and Reset button.
                    After completion — show pipeline result (Pass / Fail) */}
      <div style={{ display: 'flex', gap: 10, marginBottom: '1rem' }}>
        <button>{t('task.1.2.runPipeline')}</button>
        <button>Reset</button>
      </div>

      {/* TODO (RU): Показать подсказку для пользователя когда джоб в статусе running:
                    "Джоб X выполняется. Нажми Успех или Провал." */}
      {/* TODO (EN): Show hint when job is running: "Job X is running. Click Success or Fail." */}
    </div>
  )
}
