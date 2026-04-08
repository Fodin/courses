// ============================================
// Задание 6.2: Tags и маршрутизация джобов
// Task 6.2: Tags and job routing simulator
// ============================================
//
// ЦЕЛЬ: Симулятор маршрутизации — раннеры с тегами слева, джобы с тегами справа.
//        Кнопка "Запустить маршрутизацию" показывает, кто берёт какой job.
// GOAL: Routing simulator — runners with tags on the left, jobs on the right.
//       "Run routing" button shows which runner takes which job.
//
// ТРЕБОВАНИЯ / REQUIREMENTS:
// 1. Определи интерфейс Runner:
//    { id, name, tags: string[], runUntagged: boolean, status: 'online'|'offline' }
//    Define Runner interface
//
// 2. Определи интерфейс CiJob:
//    { id, name, tags: string[], assignedRunnerId: string|null,
//      status: 'pending'|'matched'|'no-runner', missingTags?: string[] }
//    Define CiJob interface
//
// 3. Создай начальные данные:
//    Runners: docker-runner [docker,linux], shell-runner [shell,windows,legacy], prod-runner [production,docker]
//    Jobs: build (без тегов), test [docker], deploy-staging [docker,linux], deploy-prod [production,docker]
//    Create initial data
//
// 4. Реализуй функцию matchRunner(job, runner):
//    - Если job без тегов: matched = runner.runUntagged
//    - Иначе: matched = все теги job присутствуют у runner
//    - Возвращает { matched: boolean, missingTags: string[] }
//    Implement matchRunner function
//
// 5. Отобрази два столбца: Раннеры (слева) и Джобы (справа)
//    Render two columns: Runners (left) and Jobs (right)
//
// 6. Кнопка "Запустить маршрутизацию" — обновляет статусы джобов
//    "Run routing" button — updates job statuses
//
// 7. Неназначенные джобы показывают причину (какие теги не совпали)
//    Unmatched jobs show the reason (which tags were missing)
//
// 8. Можно добавить тег к раннеру и пересчитать маршрутизацию
//    Allow adding a tag to a runner and re-routing
//
// ПОДСКАЗКИ / TIPS:
// - Раннер берёт job ТОЛЬКО если у него есть ВСЕ теги job-а
//   Runner takes a job ONLY if it has ALL of the job's tags
// - run_untagged касается только джобов БЕЗ тегов
//   run_untagged only applies to jobs WITHOUT tags
// - Для цветных тегов используй простую hash-функцию
//   For colored tags use a simple hash function

import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// TODO: Define Runner interface
// interface Runner { id: string; name: string; tags: string[]; runUntagged: boolean; status: 'online'|'offline' }

// TODO: Define CiJob interface
// interface CiJob { id: string; name: string; tags: string[]; assignedRunnerId: string|null; status: ...; missingTags?: string[] }

// TODO: Create INITIAL_RUNNERS array with 3 runners
// Создай начальные данные: docker-runner [docker,linux], shell-runner [shell,windows,legacy], prod-runner [production,docker]
// const INITIAL_RUNNERS: Runner[] = [...]

// TODO: Create INITIAL_JOBS array with 4 jobs
// Создай начальные данные: build (без тегов), test [docker], deploy-staging [docker,linux], deploy-prod [production,docker]
// const INITIAL_JOBS: CiJob[] = [...]

// TODO: Implement matchRunner function
// function matchRunner(job: CiJob, runner: Runner): { matched: boolean; missingTags: string[] } { ... }

export function Task6_2() {
  const { t } = useLanguage()
  // TODO: Add runners state (initialized from INITIAL_RUNNERS)
  // const [runners, setRunners] = useState<Runner[]>(INITIAL_RUNNERS)

  // TODO: Add jobs state (initialized from INITIAL_JOBS)
  // const [jobs, setJobs] = useState<CiJob[]>(...)

  // TODO: Add routed state (boolean) — true after routing is run
  // const [routed, setRouted] = useState(false)

  // TODO: Add newTagInputs state (Record<runnerId, tagString>)
  // const [newTagInputs, setNewTagInputs] = useState<Record<string, string>>({})

  // TODO: Implement runRouting — for each job, find first matching runner
  // Реализуй runRouting — для каждого джоба найди первый подходящий раннер
  // const runRouting = () => { ... }

  // TODO: Implement addTag — add tag to runner, reset routing
  // Реализуй addTag — добавь тег к раннеру, сбрось маршрутизацию
  // const addTag = (runnerId: string) => { ... }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.6.2.title')}</h2>

      {/* TODO: Render "Run routing" and "Reset" buttons */}
      {/* TODO: Render "Запустить маршрутизацию" and "Сбросить" buttons */}

      {/* TODO: Render two-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Left column: Runners with tags, runUntagged checkbox, add tag input */}
        {/* Левая колонка: Раннеры с тегами, чекбокс runUntagged, ввод тега */}

        {/* Right column: Jobs with tags, assignment status after routing */}
        {/* Правая колонка: Джобы с тегами, статус назначения после маршрутизации */}
      </div>

      {/* TODO: Render routing rule reminder */}
      {/* "Runner takes a job if it has ALL of its tags..." */}
      {/* "Раннер берёт job если имеет ВСЕ его теги..." */}
    </div>
  )
}
