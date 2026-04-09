import { useState } from 'react'

// ============================================
// Задание 10.2: Streaming Uploads
// Task 10.2: Streaming Uploads
// ============================================

// TODO: Реализуйте потоковую загрузку файлов без сохранения на диск / Implement streaming file upload without saving to disk
// TODO: Используйте Busboy или multer memoryStorage для обработки потока / Use Busboy or multer memoryStorage for stream processing
// TODO: Передайте поток напрямую в S3/MinIO через stream.pipe() / Pipe the stream directly to S3/MinIO via stream.pipe()
// TODO: Покажите отслеживание прогресса загрузки / Show upload progress tracking

export function Task10_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Streaming Uploads ===')
    log.push('')

    // TODO: Используйте busboy для парсинга multipart/form-data потоком / Use busboy for streaming multipart/form-data parsing
    // TODO: Реализуйте pipe напрямую в object storage (S3) / Implement pipe directly to object storage (S3)
    // TODO: Покажите отслеживание загруженных байт через stream events / Show tracking uploaded bytes via stream events
    // TODO: Обработайте ошибки потока и cleanup (удаление частичных файлов) / Handle stream errors and cleanup (remove partial files)
    log.push('Streaming Upload')
    log.push('  ... const bb = busboy({ headers: req.headers })')
    log.push('  ... bb.on("file", (name, file, info) => file.pipe(s3Stream))')
    log.push('  ... file.on("data", chunk => uploaded += chunk.length)')
    log.push('  ... stream error -> abort upload, cleanup partial file')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 10.2: Streaming Uploads</h2>
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
