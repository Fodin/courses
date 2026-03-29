import { useState } from 'react'

// ============================================
// Задание 10.1: Multer
// ============================================

// TODO: Настройте загрузку файлов через Multer
// TODO: Используйте diskStorage с destination и filename
// TODO: Реализуйте fileFilter для проверки типа файла (только изображения)
// TODO: Ограничьте размер файла через limits: { fileSize: 5 * 1024 * 1024 }

export function Task10_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Multer File Upload ===')
    log.push('')

    // TODO: Настройте multer({ storage: diskStorage, fileFilter, limits })
    // TODO: Реализуйте upload.single("avatar") для одного файла
    // TODO: Покажите upload.array("photos", 5) для нескольких файлов
    // TODO: Обработайте ошибки: LIMIT_FILE_SIZE, LIMIT_UNEXPECTED_FILE
    log.push('Multer')
    log.push('  ... const upload = multer({ storage, fileFilter, limits })')
    log.push('  ... router.post("/avatar", upload.single("avatar"), handler)')
    log.push('  ... req.file: { fieldname, originalname, mimetype, size, path }')
    log.push('  ... fileFilter: only image/jpeg, image/png')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 10.1: Multer</h2>
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
