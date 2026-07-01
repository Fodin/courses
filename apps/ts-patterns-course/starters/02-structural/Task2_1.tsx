import { useState } from 'react'

// ============================================
// Задание 2.1: Adapter
// ============================================

// These loggers have incompatible APIs.
// Your task: adapt them to a single ILogger interface.

class ConsoleLogger {
  log(message: string): string {
    return `[Console] ${message}`
  }
}

class FileLogger {
  writeLog(level: string, message: string): string {
    return `[File:${level}] ${message}`
  }
}

class ExternalLogger {
  sendLog(payload: { severity: number; text: string }): string {
    return `[External:severity=${payload.severity}] ${payload.text}`
  }
}

// TODO: Define interface ILogger with methods:
//   info(message: string): string
//   error(message: string): string
//   warn(message: string): string

// TODO: Create class ConsoleLoggerAdapter implementing ILogger
//   - Accept ConsoleLogger in constructor
//   - info: delegate to logger.log() with [INFO] prefix
//   - error: delegate to logger.log() with [ERROR] prefix
//   - warn: delegate to logger.log() with [WARN] prefix

// TODO: Create class FileLoggerAdapter implementing ILogger
//   - Accept FileLogger in constructor
//   - info: delegate to logger.writeLog('INFO', message)
//   - error: delegate to logger.writeLog('ERROR', message)
//   - warn: delegate to logger.writeLog('WARN', message)

// TODO: Create class ExternalLoggerAdapter implementing ILogger
//   - Accept ExternalLogger in constructor
//   - info: delegate to logger.sendLog({ severity: 0, text: message })
//   - error: delegate to logger.sendLog({ severity: 2, text: message })
//   - warn: delegate to logger.sendLog({ severity: 1, text: message })

// TODO: Create factory function createLogger(type: 'console' | 'file' | 'external'): ILogger
//   - Use switch to return the correct adapter wrapping a new logger instance

export function Task2_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Create an array of logger types: ['console', 'file', 'external']
    // TODO: Iterate over the array, creating loggers via createLogger factory
    // TODO: For each logger, call info('Application started'), warn('Low memory warning'),
    //       error('Connection failed') and push results to log

    // TODO: Add a summary showing all loggers use the same ILogger interface

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.1: Adapter</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
