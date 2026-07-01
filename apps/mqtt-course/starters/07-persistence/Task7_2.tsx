import { useState } from 'react'

// ============================================
// Задание 7.2: Хранение persistence на OpenWRT (/tmp vs /overlay vs USB)
// ============================================

// TODO: Опишите интерфейс StorageOption с полями:
//   id (string), path (string), label (string),
//   type ('ram' | 'flash' | 'external'),
//   capacity (string), volatile (boolean), wearLeveling (boolean),
//   description (string), recommendation (string),
//   pros (string[]), cons (string[])

// TODO: Создайте массив storageOptions с тремя вариантами:
//
//   1. id='tmp', path='/tmp', label='tmpfs (RAM)', type='ram'
//      volatile=true, wearLeveling=false
//      capacity: ~64 МБ (зависит от RAM)
//      description: tmpfs — виртуальная ФС в RAM, данные теряются при перезагрузке
//      recommendation: НЕ рекомендуется — persistence теряет смысл
//      pros: скорость, не изнашивает flash | cons: данные теряются, нет смысла
//
//   2. id='overlay', path='/overlay', label='/overlay (NAND/NOR Flash)', type='flash'
//      volatile=false, wearLeveling=true
//      capacity: ~4-16 МБ
//      description: JFFS2/UBIFS поверх flash, данные сохраняются, есть wear-leveling
//      recommendation: допустимо с autosave_interval >= 600
//
//   3. id='usb', path='/mnt/usb', label='USB/SD (ext4)', type='external'
//      volatile=false, wearLeveling=false
//      capacity: Гигабайты
//      description: внешний носитель, лучший вариант при наличии USB-порта
//      recommendation: оптимальный вариант

export function Task7_2() {
  // TODO: Создайте состояние selected (string) — выбранный вариант, по умолчанию 'overlay'
  const [selected, setSelected] = useState<string>('overlay')

  // TODO: Создайте состояние autosaveS (number) — autosave_interval для калькулятора, 300
  const [autosaveS, setAutosaveS] = useState(300)

  // TODO: Найдите текущий вариант: option = storageOptions.find(o => o.id === selected)

  // TODO: Для калькулятора износа (активен только при selected === 'overlay'):
  //   writesPerDay = Math.floor(86400 / autosaveS)
  //   kbPerDay = writesPerDay * 10  (считаем ~10 КБ на запись)
  //   yearsLife = (100000 * 4 * 1024) / (kbPerDay * 365)  // 4МБ flash, 100k циклов

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>Хранение persistence на OpenWRT</h2>

      {/* TODO: Отобразите три кнопки для выбора хранилища.
          Используйте разные цвета для типов:
          - ram → синий (#1976d2)
          - flash → оранжевый (#f57c00)
          - external → зелёный (#388e3c)
          Активная кнопка выделена соответствующим цветом рамки и фона. */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button style={{ flex: 1, padding: '0.6rem', border: '1px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer' }}>
          /tmp
        </button>
        <button style={{ flex: 1, padding: '0.6rem', border: '1px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer' }}>
          /overlay
        </button>
        <button style={{ flex: 1, padding: '0.6rem', border: '1px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer' }}>
          /mnt/usb
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Левая часть: описание выбранного варианта */}
        <div style={{ flex: '1', minWidth: '240px' }}>
          {/* TODO: Отобразите карточку с описанием option.
              - Заголовок: option.label
              - Бейдж: "Энергозависимо" (жёлтый) или "Энергонезависимо" (зелёный)
              - description
              - Блоки pros/cons рядом (зелёный / красный)
              - Рекомендация в синем блоке */}
          <div style={{ color: '#999', fontStyle: 'italic' }}>
            Информация о хранилище появится здесь...
          </div>
        </div>

        {/* Правая часть: калькулятор или инструкции */}
        <div style={{ flex: '1', minWidth: '240px' }}>
          {/* TODO: При selected === 'overlay':
              - Заголовок "Калькулятор износа flash"
              - Слайдер autosave_interval (60–3600, шаг 60)
              - Показывать: writesPerDay, kbPerDay, yearsLife
              - Цвет yearsLife: зелёный (>5) или красный (<=5)
              - Сообщение с оценкой: ✅ отличный / ⚠️ приемлемо / ❌ высокий износ
              - Итоговый конфиг для /overlay в <pre>

              При selected === 'usb':
              - Заголовок "Настройка USB-хранилища"
              - Команды: opkg install kmod-usb-storage ..., block detect, etc.
              - Конфиг Mosquitto для /mnt/usb

              При selected === 'tmp':
              - Предупреждение о потере данных */}
          <div style={{ color: '#999', fontStyle: 'italic' }}>
            Дополнительная информация появится здесь...
          </div>
        </div>
      </div>
    </div>
  )
}
