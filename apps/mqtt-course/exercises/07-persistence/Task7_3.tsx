import { useState } from 'react'

// ============================================
// Задание 7.3: Бэкап и восстановление Mosquitto
// ============================================

// TODO: Опишите интерфейс BackupScript с полями:
//   id (string), title (string), script (string), description (string)

// TODO: Создайте массив backupScripts с 4 скриптами:
//
//   1. id='backup', title='Скрипт бэкапа'
//      Скрипт должен:
//      - Задать BACKUP_DIR и DATE=$(date +%Y%m%d_%H%M%S)
//      - Отправить kill -USR1 $(cat /var/run/mosquitto.pid) && sleep 2
//      - Создать архив tar czf с mosquitto.db, /etc/mosquitto/
//      - Логировать результат через logger
//      - Оставить только последние 7 бэкапов (ls -t ... | tail -n +8 | xargs rm -f)
//
//   2. id='restore', title='Скрипт восстановления'
//      - Принять путь к архиву как $1
//      - service mosquitto stop
//      - Сохранить текущее состояние во временный файл
//      - tar xzf "$BACKUP_FILE" -C /
//      - service mosquitto start
//
//   3. id='cron', title='Настройка cron'
//      - Строка crontab: 0 2 * * * /usr/bin/mqtt-backup.sh
//      - /etc/init.d/cron restart
//
//   4. id='signal', title='Ручное сохранение SIGUSR1'
//      - kill -USR1 $(cat /var/run/mosquitto.pid)
//      - Объяснение и проверка через ls -la

export function Task7_3() {
  // TODO: Создайте состояние activeScript (string) — активный скрипт, по умолчанию 'backup'
  const [activeScript, setActiveScript] = useState<string>('backup')

  // TODO: Найдите текущий скрипт: script = backupScripts.find(s => s.id === activeScript)

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>Бэкап и восстановление Mosquitto</h2>

      {/* TODO: Добавьте информационный блок "Что нужно сохранять":
          - mosquitto.db (БД)
          - mosquitto.conf (конфигурация)
          - /etc/mosquitto/certs/ (сертификаты)
          - passwd, acl (файлы аутентификации)
          Используйте оранжевый фон (#fff3e0) */}

      {/* TODO: Отобразите 4 кнопки-вкладки для переключения между скриптами.
          Активная кнопка — синяя рамка, жирный шрифт. */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button style={{ padding: '0.5rem 0.9rem', border: '1px solid #e0e0e0', borderRadius: '6px', cursor: 'pointer' }}>
          Скрипт бэкапа
        </button>
        <button style={{ padding: '0.5rem 0.9rem', border: '1px solid #e0e0e0', borderRadius: '6px', cursor: 'pointer' }}>
          Скрипт восстановления
        </button>
        <button style={{ padding: '0.5rem 0.9rem', border: '1px solid #e0e0e0', borderRadius: '6px', cursor: 'pointer' }}>
          Настройка cron
        </button>
        <button style={{ padding: '0.5rem 0.9rem', border: '1px solid #e0e0e0', borderRadius: '6px', cursor: 'pointer' }}>
          Ручное SIGUSR1
        </button>
      </div>

      {/* TODO: Отобразите description текущего скрипта */}
      <p style={{ color: '#999', fontStyle: 'italic' }}>
        Описание скрипта появится здесь...
      </p>

      {/* TODO: Отобразите script.script в <pre> с тёмным фоном */}
      <pre
        style={{
          background: '#1e1e1e',
          color: '#d4d4d4',
          padding: '1.25rem',
          borderRadius: '8px',
          fontSize: '0.83rem',
          lineHeight: 1.7,
          overflowX: 'auto',
        }}
      >
        # Скрипт появится здесь...
      </pre>

      {/* TODO: Добавьте информационный блок об SIGUSR1 (зелёный фон #e8f5e9):
          "Важно об SIGUSR1: перед созданием бэкапа всегда отправляйте Mosquitto
          сигнал SIGUSR1 — это гарантирует, что все данные из буферов памяти записаны на диск." */}
    </div>
  )
}
