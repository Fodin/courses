// ============================================
// Задание 1.3: Ключевое слово script
// Task 1.3: The script keyword
// ============================================
//
// ЦЕЛЬ: Симулируй выполнение CI job'а с before_script/script/after_script в консоли.
// GOAL: Simulate CI job execution with before_script/script/after_script in console.
//
// ТРЕБОВАНИЯ / REQUIREMENTS:
// 1. Определи интерфейс ScriptLine (command, output, exitCode, section)
//    Define interface ScriptLine (command, output, exitCode, section)
//    section: 'before_script' | 'script' | 'after_script'
//
// 2. Создай 3 сценария (ScenarioId: 'success' | 'script-fail' | 'before-fail'):
//    Create 3 scenarios:
//    - 'success': все команды exitCode 0 / all commands exitCode 0
//    - 'script-fail': одна команда в script exitCode 1 / one command in script exitCode 1
//    - 'before-fail': одна команда в before_script exitCode 1
//
// 3. Консольный вывод (тёмный фон #1e1e1e):
//    Console output (dark background):
//    - Заголовки секций разным цветом / Section headers in different colors
//    - Команды со знаком $ / Commands with $ prefix
//    - Ошибки выделены красным / Errors highlighted in red
//    - Пропущенные команды серым курсивом / Skipped commands gray italic
//
// 4. Логика выполнения:
//    Execution logic:
//    - Ошибка в before_script → script и after_script НЕ выполняются
//      Error in before_script → script and after_script do NOT run
//    - Ошибка в script → остаток script пропускается, after_script ВЫПОЛНЯЕТСЯ
//      Error in script → rest of script skipped, after_script RUNS
//    - Команды появляются с задержкой ~400мс (useState + async/await)
//
// 5. Финальный статус: "Job succeeded" (зелёный) или "Job failed" (красный)
//
// ПОДСКАЗКИ / TIPS:
// - exitCode: -1 можно использовать как маркер "пропущено" / use as "skipped" marker
// - Используй useRef для DOM-скролла консоли вниз / use useRef for console auto-scroll
// - Цвета секций: before_script=#1A237E, script=#1B5E20, after_script=#4A148C

import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@courses/platform'

// TODO: Define ScriptSection type
// type ScriptSection = 'before_script' | 'script' | 'after_script'

// TODO: Define ScenarioId type
// type ScenarioId = 'success' | 'script-fail' | 'before-fail'

// TODO: Define ScriptLine interface
// interface ScriptLine { command: string; output: string; exitCode: number; section: ScriptSection }

// TODO: Define Scenario interface and create scenarios array
// interface Scenario { id: ScenarioId; label: string; lines: ScriptLine[] }
// const scenarios: Scenario[] = [...]

// TODO: Define ConsoleEntry type for rendered lines
// interface ConsoleEntry { type: 'section-header' | 'command' | 'output' | 'skipped'; ... }

export function Task1_3() {
  const { t } = useLanguage()
  // TODO: Add state: selectedScenario, consoleLines, jobResult, isRunning
  // const [selectedScenario, setSelectedScenario] = useState<ScenarioId>('success')
  // const [consoleLines, setConsoleLines] = useState<ConsoleEntry[]>([])
  // const [jobResult, setJobResult] = useState<'success' | 'failed' | null>(null)
  // const [isRunning, setIsRunning] = useState(false)

  // TODO: Add consoleRef for auto-scroll
  // const consoleRef = useRef<HTMLDivElement>(null)

  // TODO: Auto-scroll console to bottom when lines update
  // useEffect(() => { if (consoleRef.current) consoleRef.current.scrollTop = consoleRef.current.scrollHeight }, [consoleLines])

  // TODO: Implement runScenario (async, processes lines with delays)
  // Key rules:
  // - before_script error: stop immediately, skip script and after_script
  // - script error: skip remaining script lines, but run after_script
  // const runScenario = async () => { ... }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.1.3')}</h2>

      {/* TODO: Render scenario selector buttons */}

      {/* TODO: Render "Run job" button */}
      {/* <button>{t('task.1.3.runJob')}</button> */}

      {/* TODO: Render dark console output */}
      {/* <div ref={consoleRef} style={{ background: '#1e1e1e', color: '#d4d4d4', fontFamily: 'monospace', ... }}>
        render consoleLines here
      </div> */}

      {/* TODO: After run, show insight: e.g. "after_script ran even though script failed" */}
    </div>
  )
}
