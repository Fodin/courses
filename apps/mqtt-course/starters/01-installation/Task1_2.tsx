import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 1.2: Структура файлов Mosquitto
// ============================================

// TODO: Определи интерфейс FileNode с полями:
//   name (string) — отображаемое имя (например 'mosquitto.conf')
//   path (string) — полный путь ('/etc/mosquitto/mosquitto.conf')
//   type: 'file' | 'dir'
//   size? (string) — размер файла (например '~4 KB')
//   description (string) — описание назначения
//   content? (string) — пример содержимого (многострочная строка)
//   important? (boolean) — пометить как важный файл
// interface FileNode { ... }

// TODO: Создай массив fileStructure из 10+ записей:
//   Обязательно включи:
//   - /etc/mosquitto/ (dir, important)
//   - mosquitto.conf (file, important, content: минимальный конфиг)
//   - passwd (file, content: формат файла паролей)
//   - acl (file, content: пример ACL)
//   - /usr/sbin/mosquitto (file, important)
//   - /usr/bin/mosquitto_pub (file, content: примеры использования)
//   - /usr/bin/mosquitto_sub (file, content: примеры использования)
//   - /var/run/mosquitto.pid (file, content: "1847")
//   - /var/lib/mosquitto/ (dir)
//   - mosquitto.db (file)
//
//   Подсказка по отступам: файлы в /etc/mosquitto/ имеют один уровень вложенности,
//   файлы в /var/lib/mosquitto/ — тоже один уровень
// const fileStructure: FileNode[] = [...]

export function Task1_2() {
  const { t } = useLanguage()

  // TODO: Создай состояние selected — FileNode | null
  const [selected, setSelected] = useState<null>(null)

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '900px' }}>
      <h2>{t('task.1.2')}</h2>
      <p style={{ color: '#555', marginBottom: '1.5rem' }}>
        Нажми на любой файл или директорию, чтобы увидеть описание.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '1.5rem' }}>
        {/* Файловое дерево */}
        <div>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.9rem', color: '#666', textTransform: 'uppercase' }}>
            Файловая система
          </h3>

          {/* TODO: Отрендери дерево файлов из fileStructure:
              Стиль терминала: тёмный фон (#1a1a2e), padding
              Для каждого FileNode:
              - иконка: 📁 для dir, 📄 для file
              - name: monoşпространство, важные файлы — золотой (#FFD700), обычные — #ccc
              - Вложенность: paddingLeft рассчитывается по пути
                (файлы в /etc/mosquitto/ → 24px, корневые → 8px)
              - size рядом (если есть): серый цвет, margin-left auto
              - При клике: setSelected(node)
              - Активный: background #2a2a4e
          */}
          <div
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '0.75rem',
              background: '#1a1a2e',
              minHeight: '250px',
            }}
          >
            <div style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#FFD700' }}>
              📁 /etc/mosquitto/ (TODO: реализовать)
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#ccc', paddingLeft: '24px' }}>
              📄 mosquitto.conf
            </div>
          </div>
        </div>

        {/* Панель описания */}
        <div>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.9rem', color: '#666', textTransform: 'uppercase' }}>
            Описание
          </h3>

          {/* TODO: Если selected !== null — показать панель с деталями:
              1. Блок с path (monospace, фиолетовый #6A1B9A) и description
              2. Если selected.important === true — жёлтый бейдж "📌 Важный файл"
              3. Если selected.content есть — блок "Пример содержимого:"
                 + pre в стиле терминала (тёмный, зелёный текст)

              Если selected === null — заглушка с пунктиром:
              "Выберите файл слева для просмотра информации"
          */}
          {selected !== null ? (
            <div>
              {/* TODO: реализовать панель деталей */}
              <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                Выбран файл — TODO: показать детали
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: '2rem',
                border: '2px dashed #ddd',
                borderRadius: '8px',
                textAlign: 'center',
                color: '#aaa',
              }}
            >
              Выберите файл слева для просмотра информации
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
