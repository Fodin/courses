import { useState } from 'react'

// ============================================
// Задание 7.1: Persistence database — Решение
// ============================================

interface PersistenceParam {
  key: string
  value: string
  description: string
  type: 'bool' | 'path' | 'number'
}

const persistenceParams: PersistenceParam[] = [
  {
    key: 'persistence',
    value: 'true',
    description:
      'Включает хранение состояния брокера на диске. Без этого параметра все данные (retained-сообщения, подписки QoS 1/2, очереди) теряются при перезапуске.',
    type: 'bool',
  },
  {
    key: 'persistence_location',
    value: '/var/lib/mosquitto/',
    description:
      'Директория для хранения базы данных. Mosquitto создаст здесь файл mosquitto.db. Директория должна существовать и быть доступна для записи процессу Mosquitto.',
    type: 'path',
  },
  {
    key: 'autosave_interval',
    value: '300',
    description:
      'Интервал автосохранения в секундах (5 минут по умолчанию). При значении 0 Mosquitto сохраняет базу только при корректном завершении. Меньшее значение — меньше потерь при сбое, но больше нагрузки на диск.',
    type: 'number',
  },
  {
    key: 'autosave_on_changes',
    value: 'false',
    description:
      'Если true — база сохраняется при каждом изменении retained-сообщения или изменении подписки. Для flash-памяти OpenWRT рекомендуется false, чтобы снизить износ.',
    type: 'bool',
  },
]

interface WhatIsSaved {
  item: string
  description: string
  retained: boolean
}

const savedItems: WhatIsSaved[] = [
  { item: 'Retained-сообщения', description: 'Последнее сообщение каждого retained-топика восстанавливается после перезапуска', retained: true },
  { item: 'Подписки QoS 1/2', description: 'Persistent-сессии клиентов с их активными подписками', retained: true },
  { item: 'Очереди QoS 1/2', description: 'Сообщения, ожидающие доставки клиентам с persistent-сессиями', retained: true },
  { item: 'QoS 0 сообщения', description: 'НЕ сохраняются — это намеренно, QoS 0 "fire and forget"', retained: false },
  { item: 'Состояние handshake', description: 'Незавершённые транзакции QoS 2 (PUBREC/PUBREL)', retained: true },
]

export function Task7_1_Solution() {
  const [selectedParam, setSelectedParam] = useState<string | null>(null)
  const [autosave, setAutosave] = useState(300)

  const param = persistenceParams.find((p) => p.key === selectedParam)

  const configText = [
    'persistence true',
    'persistence_location /var/lib/mosquitto/',
    `autosave_interval ${autosave}`,
    'autosave_on_changes false',
  ].join('\n')

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>Persistence Database в Mosquitto</h2>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '260px' }}>
          <h3 style={{ margin: '0 0 0.75rem' }}>Параметры</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            {persistenceParams.map((p) => (
              <div
                key={p.key}
                onClick={() => setSelectedParam(selectedParam === p.key ? null : p.key)}
                style={{
                  padding: '0.6rem 0.8rem',
                  border: `1px solid ${selectedParam === p.key ? '#1976d2' : '#e0e0e0'}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: selectedParam === p.key ? '#e3f2fd' : '#fafafa',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <code style={{ color: '#1976d2', fontSize: '0.87rem' }}>{p.key}</code>
                  <code style={{ color: '#555', fontSize: '0.87rem' }}>{p.key === 'autosave_interval' ? autosave : p.value}</code>
                </div>
                {selectedParam === p.key && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.83rem', color: '#333', lineHeight: 1.5 }}>
                    {p.description}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div>
            <label style={{ fontSize: '0.88rem' }}>
              autosave_interval: <strong>{autosave}с ({(autosave / 60).toFixed(1)} мин)</strong>
            </label>
            <input
              type="range"
              min={0}
              max={3600}
              step={60}
              value={autosave}
              onChange={(e) => setAutosave(Number(e.target.value))}
              style={{ width: '100%', marginTop: '0.25rem' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#888' }}>
              <span>0 (только при завершении)</span>
              <span>3600с (1 час)</span>
            </div>
          </div>
        </div>

        <div style={{ flex: '1', minWidth: '260px' }}>
          <h3 style={{ margin: '0 0 0.5rem' }}>mosquitto.conf</h3>
          <pre
            style={{
              background: '#1e1e1e',
              color: '#d4d4d4',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.83rem',
              lineHeight: 1.7,
              margin: '0 0 1rem',
            }}
          >
            {configText}
          </pre>

          <h3 style={{ margin: '0 0 0.5rem' }}>Что сохраняется в mosquitto.db</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {savedItems.map((item) => (
              <div
                key={item.item}
                style={{
                  padding: '0.5rem 0.75rem',
                  background: item.retained ? '#e8f5e9' : '#ffebee',
                  borderRadius: '6px',
                  border: `1px solid ${item.retained ? '#4caf50' : '#ef9a9a'}`,
                  fontSize: '0.85rem',
                }}
              >
                <span style={{ marginRight: '0.5rem' }}>{item.retained ? '✅' : '❌'}</span>
                <strong>{item.item}</strong>
                <div style={{ fontSize: '0.8rem', color: '#555', marginTop: '0.2rem' }}>
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 7.2: Хранение на OpenWRT — /tmp vs /overlay
// ============================================

interface StorageOption {
  id: string
  path: string
  label: string
  type: 'ram' | 'flash' | 'external'
  capacity: string
  volatile: boolean
  wearLeveling: boolean
  description: string
  recommendation: string
  pros: string[]
  cons: string[]
}

const storageOptions: StorageOption[] = [
  {
    id: 'tmp',
    path: '/tmp',
    label: 'tmpfs (RAM)',
    type: 'ram',
    capacity: '~64 МБ (зависит от RAM)',
    volatile: true,
    wearLeveling: false,
    description:
      'tmpfs — виртуальная файловая система в оперативной памяти. Данные полностью теряются при перезагрузке или отключении питания.',
    recommendation: 'НЕ рекомендуется для persistence_location. Подходит для временных файлов.',
    pros: ['Максимальная скорость чтения/записи', 'Не изнашивает flash-память', 'Нет I/O-задержек'],
    cons: ['Данные теряются при перезагрузке', 'Persistence теряет смысл', 'Ограничена объёмом RAM'],
  },
  {
    id: 'overlay',
    path: '/overlay',
    label: '/overlay (NAND/NOR Flash)',
    type: 'flash',
    capacity: '~4-16 МБ (системный раздел)',
    volatile: false,
    wearLeveling: true,
    description:
      'JFFS2/UBIFS поверх встроенной flash-памяти. Данные сохраняются между перезагрузками. Технология wear-leveling защищает от преждевременного износа.',
    recommendation: 'Допустимо с осторожностью. Уменьшите autosave_interval до 600+ секунд.',
    pros: ['Данные переживают перезагрузку', 'Wear-leveling продлевает жизнь чипа', 'Встроена в OpenWRT'],
    cons: ['Ограниченный ресурс (~100 000 циклов P/E)', 'Малый объём (~4-16 МБ)', 'Медленнее внешних носителей'],
  },
  {
    id: 'usb',
    path: '/mnt/usb',
    label: 'USB/SD (ext4)',
    type: 'external',
    capacity: 'Гигабайты (SD/USB)',
    volatile: false,
    wearLeveling: false,
    description:
      'Внешний носитель (USB-флешка, SD-карта) с файловой системой ext4. Монтируется при загрузке через /etc/fstab.',
    recommendation: 'Оптимальный вариант при наличии USB-порта. Больший объём и ресурс.',
    pros: ['Большой объём', 'Легко заменить/расширить', 'Нет ограничений на wear для типичных объёмов'],
    cons: ['Требует USB-порт и внешний носитель', 'Дополнительная точка отказа', 'Нужна настройка автомонтирования'],
  },
]

const wearLevelingData = {
  cycles: 100000,
  typical_writes_per_day: 1440, // autosave every 60s
  size_db_kb: 10,
  flash_size_mb: 4,
}

export function Task7_2_Solution() {
  const [selected, setSelected] = useState<string>('overlay')
  const [autosaveS, setAutosaveS] = useState(300)

  const option = storageOptions.find((o) => o.id === selected)!

  const writesPerDay = Math.floor(86400 / autosaveS)
  const kbPerDay = writesPerDay * wearLevelingData.size_db_kb
  const yearsLife = Math.floor(
    (wearLevelingData.cycles * wearLevelingData.flash_size_mb * 1024) /
      (kbPerDay * 365)
  )

  const colors: Record<string, string> = { ram: '#1976d2', flash: '#f57c00', external: '#388e3c' }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>Хранение persistence на OpenWRT</h2>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {storageOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            style={{
              flex: 1,
              padding: '0.6rem',
              border: `2px solid ${selected === opt.id ? colors[opt.type] : '#e0e0e0'}`,
              background: selected === opt.id ? `${colors[opt.type]}18` : '#fafafa',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.85rem',
            }}
          >
            {opt.path}
            <div style={{ fontSize: '0.75rem', fontWeight: 'normal', color: '#666', marginTop: '0.2rem' }}>
              {opt.label}
            </div>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '240px' }}>
          <div
            style={{
              padding: '1rem',
              background: option.volatile ? '#fff3e0' : '#e8f5e9',
              borderRadius: '8px',
              border: `1px solid ${option.volatile ? '#ff9800' : '#4caf50'}`,
              marginBottom: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong>{option.label}</strong>
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  background: option.volatile ? '#ff9800' : '#4caf50',
                  color: '#fff',
                }}
              >
                {option.volatile ? '⚡ Энергозависимо' : '💾 Энергонезависимо'}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>{option.description}</div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1, padding: '0.6rem', background: '#e8f5e9', borderRadius: '6px' }}>
              <strong style={{ fontSize: '0.82rem' }}>Плюсы:</strong>
              <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1.2rem' }}>
                {option.pros.map((p, i) => (
                  <li key={i} style={{ fontSize: '0.82rem', marginBottom: '0.2rem' }}>{p}</li>
                ))}
              </ul>
            </div>
            <div style={{ flex: 1, padding: '0.6rem', background: '#ffebee', borderRadius: '6px' }}>
              <strong style={{ fontSize: '0.82rem' }}>Минусы:</strong>
              <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1.2rem' }}>
                {option.cons.map((c, i) => (
                  <li key={i} style={{ fontSize: '0.82rem', marginBottom: '0.2rem' }}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          <div
            style={{
              padding: '0.75rem',
              background: '#e3f2fd',
              borderRadius: '6px',
              fontSize: '0.85rem',
            }}
          >
            <strong>Рекомендация:</strong> {option.recommendation}
          </div>
        </div>

        {/* Wear-leveling калькулятор */}
        {selected === 'overlay' && (
          <div style={{ flex: '1', minWidth: '240px' }}>
            <h3 style={{ margin: '0 0 0.75rem' }}>Калькулятор износа flash</h3>
            <label style={{ fontSize: '0.88rem' }}>
              autosave_interval: <strong>{autosaveS}с</strong>
            </label>
            <input
              type="range"
              min={60}
              max={3600}
              step={60}
              value={autosaveS}
              onChange={(e) => setAutosaveS(Number(e.target.value))}
              style={{ width: '100%', margin: '0.25rem 0 0.75rem' }}
            />
            <div style={{ fontSize: '0.85rem', lineHeight: 2 }}>
              <div>Записей в день: <strong>{writesPerDay}</strong></div>
              <div>Данных в день: <strong>{kbPerDay} КБ</strong></div>
              <div>Расчётный ресурс: <strong style={{ color: yearsLife > 5 ? '#2e7d32' : '#d32f2f' }}>{yearsLife} лет</strong></div>
            </div>
            <div
              style={{
                marginTop: '0.5rem',
                padding: '0.6rem',
                background: yearsLife > 5 ? '#e8f5e9' : '#fff3e0',
                borderRadius: '6px',
                fontSize: '0.82rem',
              }}
            >
              {yearsLife > 10
                ? '✅ Отличный ресурс — можно использовать'
                : yearsLife > 5
                  ? '⚠️ Приемлемо — рассмотрите более редкое сохранение'
                  : '❌ Высокий износ — увеличьте интервал или используйте USB'}
            </div>

            <pre
              style={{
                background: '#1e1e1e',
                color: '#d4d4d4',
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                lineHeight: 1.6,
                marginTop: '0.75rem',
              }}
            >
              {`# Оптимальная конфигурация для /overlay
persistence true
persistence_location /overlay/upper/mosquitto/
autosave_interval ${autosaveS}
autosave_on_changes false`}
            </pre>
          </div>
        )}

        {selected === 'usb' && (
          <div style={{ flex: '1', minWidth: '240px' }}>
            <h3 style={{ margin: '0 0 0.5rem' }}>Настройка USB-хранилища</h3>
            <pre
              style={{
                background: '#1e1e1e',
                color: '#d4d4d4',
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                lineHeight: 1.6,
                margin: '0 0 0.75rem',
              }}
            >
              {`# Установка поддержки USB
opkg install kmod-usb-storage block-mount e2fsprogs

# Монтирование в /etc/fstab
block detect > /etc/config/fstab
# Добавить в /etc/config/fstab:
# option target '/mnt/usb'
# option enabled '1'

# Перезагрузить и проверить
reboot
df -h /mnt/usb`}
            </pre>
            <pre
              style={{
                background: '#1e1e1e',
                color: '#d4d4d4',
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {`# mosquitto.conf для USB
persistence true
persistence_location /mnt/usb/mosquitto/
autosave_interval 300`}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// Задание 7.3: Бэкап и восстановление — Решение
// ============================================

interface BackupScript {
  id: string
  title: string
  script: string
  description: string
}

const backupScripts: BackupScript[] = [
  {
    id: 'backup',
    title: 'Скрипт бэкапа',
    description:
      'Создаёт архив базы данных и конфигурации Mosquitto с временной меткой. При исполнении через cron создаёт ежесуточный бэкап.',
    script: `#!/bin/sh
# /usr/bin/mqtt-backup.sh
BACKUP_DIR="/mnt/usb/backups/mosquitto"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/mosquitto_$DATE.tar.gz"

mkdir -p "$BACKUP_DIR"

# Отправляем SIGUSR1 — Mosquitto сохранит БД перед бэкапом
kill -USR1 $(cat /var/run/mosquitto.pid) 2>/dev/null
sleep 2

# Архивируем БД и конфиг
tar czf "$BACKUP_FILE" \\
  /var/lib/mosquitto/mosquitto.db \\
  /etc/mosquitto/mosquitto.conf \\
  /etc/mosquitto/certs/ 2>/dev/null

logger "MQTT backup: $BACKUP_FILE ($(du -h $BACKUP_FILE | cut -f1))"

# Оставляем только последние 7 бэкапов
ls -t $BACKUP_DIR/mosquitto_*.tar.gz | tail -n +8 | xargs rm -f`,
  },
  {
    id: 'restore',
    title: 'Скрипт восстановления',
    description:
      'Восстанавливает Mosquitto из архива бэкапа. Останавливает брокер, распаковывает бэкап, запускает снова.',
    script: `#!/bin/sh
# /usr/bin/mqtt-restore.sh
# Использование: mqtt-restore.sh /path/to/backup.tar.gz

BACKUP_FILE="$1"

if [ -z "$BACKUP_FILE" ] || [ ! -f "$BACKUP_FILE" ]; then
  echo "Использование: $0 <backup.tar.gz>"
  exit 1
fi

echo "Восстановление из: $BACKUP_FILE"

# Остановить Mosquitto
service mosquitto stop
sleep 2

# Создать бэкап текущего состояния (на всякий случай)
cp -r /var/lib/mosquitto/ /tmp/mosquitto_pre_restore/

# Распаковать бэкап
tar xzf "$BACKUP_FILE" -C /

# Запустить Mosquitto
service mosquitto start

echo "Готово! Проверьте: logread | grep mosquitto"`,
  },
  {
    id: 'cron',
    title: 'Настройка автоматического бэкапа (cron)',
    description:
      'Добавляет задание в cron OpenWRT для ежедневного бэкапа в 2:00 ночи, когда нагрузка минимальна.',
    script: `# Добавить в /etc/crontabs/root
# (или через: crontab -e)

# Бэкап каждый день в 02:00
0 2 * * * /usr/bin/mqtt-backup.sh

# Применить изменения
/etc/init.d/cron restart

# Проверить что cron запущен
/etc/init.d/cron status`,
  },
  {
    id: 'signal',
    title: 'Ручное сохранение через SIGUSR1',
    description:
      'Mosquitto реагирует на SIGUSR1 мгновенным сохранением базы данных. Полезно перед плановым отключением питания.',
    script: `# Отправить SIGUSR1 — принудительное сохранение БД
kill -USR1 $(cat /var/run/mosquitto.pid)

# Или через PID напрямую
mosquitto_pid=$(pgrep mosquitto)
kill -USR1 $mosquitto_pid

# Проверить в логах (Mosquitto запишет факт сохранения)
logread | grep -i mosquitto | tail -5

# Проверить дату изменения файла БД
ls -la /var/lib/mosquitto/mosquitto.db`,
  },
]

export function Task7_3_Solution() {
  const [activeScript, setActiveScript] = useState<string>('backup')

  const script = backupScripts.find((s) => s.id === activeScript)!

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>Бэкап и восстановление Mosquitto</h2>

      <div
        style={{
          padding: '0.75rem 1rem',
          background: '#fff3e0',
          borderRadius: '8px',
          border: '1px solid #ff9800',
          marginBottom: '1.5rem',
          fontSize: '0.88rem',
          lineHeight: 1.6,
        }}
      >
        <strong>Что нужно сохранять:</strong>
        <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1.2rem' }}>
          <li><code>mosquitto.db</code> — база данных (retained-сообщения, сессии)</li>
          <li><code>mosquitto.conf</code> — конфигурация брокера</li>
          <li><code>/etc/mosquitto/certs/</code> — TLS-сертификаты (если настроен TLS)</li>
          <li><code>passwd</code>, <code>acl</code> — файлы аутентификации</li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {backupScripts.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveScript(s.id)}
            style={{
              padding: '0.5rem 0.9rem',
              border: `2px solid ${activeScript === s.id ? '#1976d2' : '#e0e0e0'}`,
              background: activeScript === s.id ? '#e3f2fd' : '#fafafa',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: activeScript === s.id ? 'bold' : 'normal',
              fontSize: '0.87rem',
            }}
          >
            {s.title}
          </button>
        ))}
      </div>

      <p style={{ margin: '0 0 0.75rem', color: '#555', lineHeight: 1.6 }}>{script.description}</p>

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
        {script.script}
      </pre>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: '#e8f5e9',
          borderRadius: '8px',
          border: '1px solid #4caf50',
          fontSize: '0.85rem',
          lineHeight: 1.6,
        }}
      >
        <strong>Важно об SIGUSR1:</strong> перед созданием бэкапа всегда отправляйте Mosquitto
        сигнал SIGUSR1 — это гарантирует, что все данные из буферов памяти записаны на диск.
        Бэкап из файла, который не был сброшен, может быть неполным.
      </div>
    </div>
  )
}
