import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 2.1: mosquitto.conf — основные параметры
// ============================================

// TODO: Определи тип ParamType для типов значений параметра:
// Допустимые: 'integer', 'boolean', 'string', 'path'
// type ParamType = ...

// TODO: Определи тип ParamCategory для категорий:
// Допустимые: 'general', 'network', 'logging', 'security', 'persistence'
// type ParamCategory = ...

// TODO: Определи интерфейс ConfigParam с полями:
//   key (string) — название параметра Mosquitto
//   defaultValue (string) — значение по умолчанию (пустая строка если нет)
//   type (ParamType)
//   category (ParamCategory)
//   description (string) — подробное описание
//   example (string) — пример использования (может быть многострочным)
//   note? (string) — важное примечание (опциональное)
// interface ConfigParam { ... }

// TODO: Создай массив configParams минимум из 12 параметров:
//   Категория 'network': listener, bind_address, max_connections,
//                         max_inflight_messages, max_queued_messages,
//                         keepalive_interval, message_size_limit
//   Категория 'persistence': persistence, persistence_file, persistence_location
//   Категория 'logging': log_dest, log_type, log_timestamp
//   Категория 'security': allow_anonymous, password_file, acl_file
//   Категория 'general': pid_file, user
//
//   Важно: параметры persistence_location и allow_anonymous должны иметь note!
//   Подсказка: для persistence_location note = про tmpfs и flash
// const configParams: ConfigParam[] = [...]

// TODO: Создай объект categoryConfig — маппинг категории на { label, color, bg, icon }:
//   general: ⚙️ серо-синий (#455A64, #ECEFF1)
//   network: 🌐 синий (#1565C0, #E3F2FD)
//   logging: 📝 оранжевый (#E65100, #FFF3E0)
//   security: 🔒 красный (#B71C1C, #FFEBEE)
//   persistence: 💾 фиолетовый (#6A1B9A, #F3E5F5)
// const categoryConfig: Record<ParamCategory, {...}> = {...}

export function Task2_1() {
  const { t } = useLanguage()

  // TODO: Создай состояние search — string (начальное: '')
  const [search, setSearch] = useState('')

  // TODO: Создай состояние activeCategory — ParamCategory | 'all' (начальное: 'all')
  const [activeCategory, setActiveCategory] = useState<string>('all')

  // TODO: Создай состояние selected — ConfigParam | null
  const [selected, setSelected] = useState<null>(null)

  // TODO: Реализуй фильтрацию filtered:
  //   Фильтруй configParams по:
  //   1. search: key.includes(search) || description.includes(search) (case-insensitive)
  //   2. activeCategory: 'all' пропускает всё, иначе category === activeCategory
  // const filtered = configParams.filter(...)

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2>{t('task.2.1')}</h2>
      <p style={{ color: '#555', marginBottom: '1rem' }}>
        Справочник параметров конфигурации Mosquitto 2.x. Нажми на параметр для детального описания.
      </p>

      {/* TODO: Строка фильтров:
          1. Input для поиска (placeholder "Поиск параметра...")
          2. Кнопки категорий: ['all', 'general', 'network', 'logging', 'security', 'persistence']
             - 'all' → "Все"
             - остальные → "{icon} {label}" из categoryConfig
             Активная кнопка выделяется фоном и цветом своей категории
      */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск параметра..."
          style={{
            padding: '0.5rem 0.75rem',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '0.9rem',
            minWidth: '200px',
          }}
        />
        {/* TODO: кнопки категорий */}
        <button
          onClick={() => setActiveCategory('all')}
          style={{
            padding: '0.3rem 0.75rem',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: activeCategory === 'all' ? '#555' : '#ddd',
            background: activeCategory === 'all' ? '#ECEFF1' : '#fff',
            cursor: 'pointer',
            fontSize: '0.8rem',
          }}
        >
          Все
        </button>
        {/* TODO: добавить кнопки для каждой категории */}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '1.5rem' }}>
        {/* Список параметров */}
        <div>
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>
            Найдено: 0 параметров {/* TODO: заменить 0 на filtered.length */}
          </div>

          {/* TODO: Прокручиваемый список параметров (maxHeight: 460px, overflow-y: auto):
              Для каждого параметра из filtered:
              - Иконка категории из categoryConfig
              - key (monospace, жирный)
              - defaultValue в сером бейдже справа (если есть)
              Активный параметр: синий фон (#E3F2FD)
              При клике: setSelected(param)
          */}
          <div
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden',
              maxHeight: '460px',
              overflowY: 'auto',
            }}
          >
            <div style={{ padding: '1rem', color: '#aaa', fontSize: '0.85rem', textAlign: 'center' }}>
              TODO: отрендерить список из filtered
            </div>
          </div>
        </div>

        {/* Панель деталей */}
        <div>
          {/* TODO: Если selected !== null — показать панель деталей:
              Блок с бордером цвета категории, фоном bgColor:
              1. Имя параметра (monospace, жирный) + бейдж типа
              2. Описание
              3. "Значение по умолчанию:" + значение в code-бейдже
              4. Если note — жёлтый блок с ⚠️ {note}

              Блок с примером использования (тёмный терминал)

              Если selected === null — заглушка с пунктиром
          */}
          {selected !== null ? (
            <div>
              {/* TODO: реализовать панель деталей */}
              <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                Параметр выбран — TODO: реализовать детали
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
              Выберите параметр для просмотра описания
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
