import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 1.3: Первый запуск и проверка
// ============================================

// TODO: Определи тип для категорий команд проверки
// Допустимые значения: 'status', 'publish', 'subscribe', 'debug'
// type CommandCategory = ...

// TODO: Определи интерфейс VerifyCommand с полями:
//   id (string) — уникальный идентификатор
//   title (string) — короткое название
//   command (string) — команда для выполнения
//   description (string) — что делает команда
//   expectedOutput (string) — реалистичный вывод команды
//   category (CommandCategory)
// interface VerifyCommand { ... }

// TODO: Создай массив verifyCommands из 6+ команд:
//   Категория 'status':
//   - /etc/init.d/mosquitto status → "mosquitto is running"
//   - cat /var/run/mosquitto.pid → "1847"
//   - netstat -tlnp | grep 1883 → строка с LISTEN 1883/mosquitto
//
//   Категория 'subscribe':
//   - mosquitto_sub -h 127.0.0.1 -t "test/#" -v & → сообщение о фоновом процессе
//
//   Категория 'publish':
//   - mosquitto_pub -h 127.0.0.1 -t "test/hello" -m "Hello OpenWRT!" → пояснение о доставке
//
//   Категория 'debug':
//   - mosquitto_sub -h 127.0.0.1 -t "$SYS/#" -C 5 → 5 системных топиков
//   - logread | grep mosquitto | tail -20 → строки в формате OpenWRT syslog
// const verifyCommands: VerifyCommand[] = [...]

// TODO: Создай объект categoryConfig — маппинг категории на { label, color, bg, icon }:
//   status: 🔍 синий
//   subscribe: 👂 фиолетовый
//   publish: 📤 оранжевый
//   debug: 🐛 зелёный
// const categoryConfig: Record<CommandCategory, { label: string; color: string; bg: string; icon: string }> = {...}

export function Task1_3() {
  const { t } = useLanguage()

  // TODO: Создай состояние runOutput — Record<string, string>
  // Ключ: id команды, значение: строка вывода
  const [runOutput, setRunOutput] = useState<Record<string, string>>({})

  // TODO: Создай состояние runningId — string | null
  // Хранит id команды, которая "выполняется" в данный момент
  const [runningId, setRunningId] = useState<string | null>(null)

  // TODO: Реализуй функцию runCommand(cmd: VerifyCommand):
  //   1. Установи runningId = cmd.id
  //   2. Через 400–600ms:
  //      - setRunOutput(prev => ({ ...prev, [cmd.id]: cmd.expectedOutput }))
  //      - setRunningId(null)
  //   Подсказка: используй setTimeout
  const runCommand = (_cmd: unknown) => {
    // TODO: реализовать
  }

  // TODO: Сгруппируй команды по категориям:
  // const categoryGroups = ['status', 'subscribe', 'publish', 'debug'] as const
  // Для каждой группы — список команд этой категории

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '820px' }}>
      <h2>{t('task.1.3')}</h2>
      <p style={{ color: '#555', marginBottom: '1.5rem' }}>
        Проверь работоспособность Mosquitto после установки. Нажми кнопку "Запустить" для симуляции вывода команды.
      </p>

      {/* TODO: Отрендери команды, сгруппированные по категориям:
          Для каждой категории:
          1. Заголовок с иконкой и цветом: {icon} {label}
          2. Список команд этой категории

          Для каждой команды:
          - Блок с: command (monospace), description, кнопка "Запустить"
          - Кнопка при runningId === cmd.id → '...' (disabled)
          - Кнопка после выполнения → '✓ Выполнено' с зелёным фоном
          - Если runOutput[cmd.id] существует — показать вывод в терминале
            (тёмный фон, зелёный/cyan текст, pre с white-space: pre-wrap)
      */}
      <div>
        {/* TODO: заменить заглушку на реальный рендер групп */}
        <div
          style={{
            border: '2px dashed #ddd',
            borderRadius: '8px',
            padding: '1.5rem',
            textAlign: 'center',
            color: '#aaa',
          }}
        >
          TODO: отрендерить группы команд из verifyCommands
          <br />
          runningId: {runningId ?? 'none'}
          <br />
          Выполненных команд: {Object.keys(runOutput).length}
        </div>
      </div>
    </div>
  )
}
