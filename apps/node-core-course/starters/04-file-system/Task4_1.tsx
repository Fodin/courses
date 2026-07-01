import { useState } from 'react'

// ============================================
// Задание 4.1: Read/Write
// ============================================

// TODO: Изучите основные операции чтения/записи файлов в Node.js:
//   - fs.readFile / fs.readFileSync — чтение целого файла
//   - fs.writeFile / fs.writeFileSync — запись целого файла
//   - fs.appendFile — добавление в конец файла
//   - fs/promises — промис-версии (рекомендуемый подход)
//   - Флаги: 'r' (чтение), 'w' (запись), 'a' (добавление), 'wx' (создание, ошибка если есть)
//
// TODO: Study basic file read/write operations in Node.js:
//   - fs.readFile / fs.readFileSync — read entire file
//   - fs.writeFile / fs.writeFileSync — write entire file
//   - fs.appendFile — append to file
//   - fs/promises — promise-based API (recommended)
//   - Flags: 'r' (read), 'w' (write), 'a' (append), 'wx' (create, error if exists)

export function Task4_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== File Read/Write ===')
    log.push('')

    // TODO: Смоделируйте файловую систему в памяти (объект):
    //   const virtualFS: Map<string, string> = new Map()
    //   Реализуйте функции:
    //   - readFile(path: string): Promise<string>
    //   - writeFile(path: string, data: string): Promise<void>
    //   - appendFile(path: string, data: string): Promise<void>
    //   - readFileSync(path: string): string
    //   Эмулируйте ошибки: ENOENT (файл не найден), EEXIST (файл существует)
    // TODO: Simulate an in-memory file system:
    //   Implement readFile, writeFile, appendFile, readFileSync
    //   Emulate errors: ENOENT, EEXIST

    log.push('Write & Read:')
    log.push('  ... запишите файл и прочитайте обратно')
    log.push('')

    log.push('Append:')
    log.push('  ... добавьте данные в файл')
    log.push('')

    // TODO: Покажите обработку ошибок при чтении несуществующего файла
    // TODO: Show error handling when reading a non-existent file
    log.push('Error handling:')
    log.push('  ... обработайте ENOENT ошибку')
    log.push('')

    // TODO: Покажите 3 стиля API: callback, sync, promise
    // TODO: Show 3 API styles: callback, sync, promise
    log.push('API styles comparison:')
    log.push('  ... покажите callback vs sync vs promise')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.1: Read/Write</h2>
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
