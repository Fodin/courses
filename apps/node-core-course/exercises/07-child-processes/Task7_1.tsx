import { useState } from 'react'

// ============================================
// Задание 7.1: exec / execFile
// ============================================

// TODO: Изучите exec и execFile из модуля child_process:
//   - exec(command) — выполняет команду через shell (/bin/sh)
//     Буферизует вывод, подходит для коротких команд
//     Уязвим к shell injection!
//   - execFile(file, args) — запускает файл напрямую (без shell)
//     Безопаснее, args передаются как массив
//   - Общее: callback(error, stdout, stderr), maxBuffer
//   - promisify(exec) — промис-версия
//
// TODO: Study exec and execFile from child_process:
//   - exec — runs through shell, buffers output, shell injection risk
//   - execFile — runs file directly, safer, args as array

export function Task7_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== exec / execFile ===')
    log.push('')

    // TODO: Смоделируйте exec и execFile:
    //   Реализуйте функции myExec(command) и myExecFile(file, args)
    //   которые "выполняют" команды из предопределённого набора
    //   myExec парсит command как shell-строку (разделяет по пробелам, поддерживает pipe |)
    //   myExecFile принимает file и args отдельно
    // TODO: Simulate exec and execFile with predefined commands

    log.push('exec simulation:')
    log.push('  ... выполните "ls -la | grep .ts" через exec')
    log.push('')

    log.push('execFile simulation:')
    log.push('  ... выполните ["node", ["--version"]] через execFile')
    log.push('')

    // TODO: Покажите уязвимость shell injection в exec:
    //   const userInput = 'file.txt; rm -rf /'
    //   exec(`cat ${userInput}`)  — ОПАСНО!
    //   execFile('cat', [userInput]) — БЕЗОПАСНО (аргумент передаётся как есть)
    // TODO: Demonstrate shell injection vulnerability in exec
    log.push('Shell injection demo:')
    log.push('  ... покажите, почему exec опасен с пользовательским вводом')
    log.push('')

    // TODO: Покажите ограничение maxBuffer и что происходит при переполнении
    // TODO: Show maxBuffer limitation and overflow behavior
    log.push('maxBuffer overflow:')
    log.push('  ... покажите ошибку при превышении буфера')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.1: exec / execFile</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
