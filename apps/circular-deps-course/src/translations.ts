import type { Translations } from '@courses/platform'

export const translations: Translations = {
  ru: {
    // Общие
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.close': 'Закрыть',

    // Навигация
    'nav.title': 'Уровни',
    'nav.levels': 'Уровни',
    'nav.level': 'Уровень',
    'nav.intro': 'Введение: что такое ЦЗ',
    'nav.moduleRuntime': 'Как модули исполняют циклы',
    'nav.whyHarmful': 'Чем грозят циклы',
    'nav.typeVsRuntime': 'Типовые vs рантайм-циклы',
    'nav.barrelFiles': 'Barrel-файлы',
    'nav.detectionTools': 'Обнаружение: madge, dep-cruiser',
    'nav.eslintNoCycle': 'ESLint import/no-cycle',
    'nav.breakingTechniques': 'Приёмы разрыва циклов',
    'nav.fsdLayers': 'FSD: слои и сегменты',
    'nav.fsdSlices': 'FSD: слайсы и public API',
    'nav.fsdViolations': 'FSD: нарушения → циклы',
    'nav.boundaryLinters': 'FSD: линтеры границ',
    'nav.monorepoCycles': 'Циклы в монорепо',
    'nav.ciPrevention': 'CI-гейт и предотвращение',
    'nav.capstone': 'Капстоун: полный workflow',

    // Подписи заданий (reference-уровни — один квиз; LAB-уровни — 2 темы × 3 сложности)
    'task.0.1': 'Квиз: интуиция циклических зависимостей',
    'task.1.1': 'Квиз: ESM/CJS, hoisting, TDZ и live bindings',
    'task.2.1': 'Квиз: последствия циклических зависимостей',

    'task.3.1': 'Разорвать цикл через import type (простое)',
    'task.3.2': 'Найти типовое ребро в цикле из трёх файлов (среднее)',
    'task.3.3': 'Разорвать сразу два цикла вокруг общего файла (сложное)',
    'task.3.4': 'Вынести общий тип в отдельный файл (простое)',
    'task.3.5': 'Общий types.ts для двух модулей со взаимными типами (среднее)',
    'task.3.6': 'Распутать смешанный модуль на types и runtime (сложное)',

    'task.4.1': 'Self-import цикл через собственный barrel (простое)',
    'task.4.2': 'Два сервиса тянут утилиту через barrel (среднее)',
    'task.4.3': 'Большой barrel: чиним только внутренние импорты (сложное)',
    'task.4.4': 'Самозамыкание на общем типе через barrel (простое)',
    'task.4.5': 'Два barrel тянут друг друга (среднее)',
    'task.4.6': 'Вложенные barrel и распутывание графа (сложное)',

    'task.5.1': 'Квиз: madge и dependency-cruiser',
    'task.6.1': 'Квиз: ESLint import/no-cycle',

    'task.7.1': 'Инверсия зависимости: внедрение через параметр (простое)',
    'task.7.2': 'Инверсия зависимости в цепочке из трёх модулей (среднее)',
    'task.7.3': 'Инверсия зависимости применяется дважды (сложное)',
    'task.7.4': 'Разрыв цикла динамическим import() (простое)',
    'task.7.5': 'Динамический import() в цепочке из трёх модулей (среднее)',
    'task.7.6': 'Динамический import() применяется дважды (сложное)',
    'task.7.7': 'Вынос общего в третий модуль (простое)',
    'task.7.8': 'Вынос общего в третий модуль: цикл длиной 3 (среднее)',
    'task.7.9': 'Вынос общего в третий модуль применяется дважды (сложное)',

    'task.8.1': 'Импорт вверх рождает цикл слоёв (простое)',
    'task.8.2': 'Цепочка через три слоя, замкнутая импортом вверх (среднее)',
    'task.8.3': 'Несколько нарушений направления образуют один цикл (сложное)',
    'task.8.4': 'Cross-import слайсов одного слоя рождает цикл (простое)',
    'task.8.5': 'Кольцо из трёх слайсов одного слоя (среднее)',
    'task.8.6': 'Узел из нескольких cross-import между слайсами (сложное)',

    'task.9.1': 'Барель своего слайса замыкает цикл (простое)',
    'task.9.2': 'Слайсы тянут друг друга через public API (среднее)',
    'task.9.3': 'Несколько сегментов и барель замыкают цикл (сложное)',
    'task.9.4': 'Глубокий импорт мимо public API (простое)',
    'task.9.5': 'Несколько глубоких импортов, один замыкает цикл (среднее)',
    'task.9.6': 'Три слайса: глубокие импорты и цикл разом (сложное)',

    'task.10.1': 'Ревью: найти и убрать цикл (простое)',
    'task.10.2': 'Ревью: цикл через три файла (среднее)',
    'task.10.3': 'Ревью: два независимых цикла (сложное)',
    'task.10.4': 'Несколько нарушений: цикл + импорт вверх (простое)',
    'task.10.5': 'Несколько нарушений: цикл + глубокий импорт (среднее)',
    'task.10.6': 'Полное ревью: цикл + импорт вверх + глубокий импорт (сложное)',

    'task.11.1': 'Квиз: boundaries, feature-sliced config, Steiger',

    'task.12.1': 'Цикл между пакетами a ↔ b (простое)',
    'task.12.2': 'Кольцо из трёх пакетов a → b → c → a (среднее)',
    'task.12.3': 'Смешанные тип/значение зависимости в цикле пакетов (сложное)',
    'task.12.4': 'Выделить общий пакет shared (простое)',
    'task.12.5': 'Shared-пакет из двух модулей (среднее)',
    'task.12.6': 'Распутать граф из четырёх пакетов (сложное)',

    'task.13.1': 'Квиз: CI-гейт и фитнес-функции',

    'task.14.1': 'Распутать модульный граф: один цикл (простое)',
    'task.14.2': 'Распутать модульный граф: третий модуль (среднее)',
    'task.14.3': 'Распутать модульный граф: два переплетённых цикла (сложное)',
    'task.14.4': 'FSD-срез без циклов: направление слоёв (простое)',
    'task.14.5': 'FSD-срез без циклов: вернуть к public API (среднее)',
    'task.14.6': 'FSD-срез без циклов: собрать архитектуру целиком (сложное)',

    // Platform UI
    'task.title': 'Задание',
    'task.description': 'Описание задания',
    'task.placeholder': 'Здесь появится результат',
    'task.markComplete': 'Отметить как выполненное',
    'task.markIncomplete': 'Отметить как невыполненное',
    'theory.title': 'Теория',
    'theory.brief': 'Кратко',
    'theory.detailed': 'Подробно',
    'theory.notFound': 'Теория не найдена',
    'solution.show': 'Показать эталон',
    'solution.hide': 'Скрыть эталон',
    'quiz.title': 'Квиз по теории',
    'quiz.submit': 'Проверить',
    'quiz.correct': 'Верно!',
    'quiz.wrong': 'Неверно',
    'theme.light': 'Светлая',
    'theme.dark': 'Тёмная',
    'theme.toggle': 'Переключить тему',
    'language.select': 'Выбрать язык',
    'language.ru': 'Русский',
    'language.en': 'English',
    'scroll.top': 'Наверх',

    // Описания уровней
    'level.0.desc':
      'Что такое циклическая зависимость: A → B → A, прямые и транзитивные циклы, интуиция и аналогии.',
    'level.1.desc':
      'Как модульные системы исполняют циклы: ESM vs CommonJS, hoisting, live bindings, TDZ, частичные экспорты.',
    'level.2.desc':
      'Чем грозят циклы: TDZ-краши, undefined при инициализации, хрупкий порядок, сломанный tree-shaking, медленный HMR, тяжёлые моки.',
    'level.3.desc':
      'Типовые vs рантайм-циклы: import type, стирание типов, verbatimModuleSyntax, isolatedModules — почему type-only цикл безопасен. Практика — 6 многофайловых заданий с автопроверкой цикла (2 темы × простое/среднее/сложное).',
    'level.4.desc':
      'Barrel-файлы (index.ts / public API) как «фабрика циклов»: re-export раздувает граф, self-import слайса, barrel hell. Практика — 6 многофайловых заданий с автопроверкой цикла (2 темы × простое/среднее/сложное).',
    'level.5.desc':
      'Обнаружение циклов: madge (--circular, граф), dependency-cruiser (правило no-circular), поведение tsc и IDE.',
    'level.6.desc':
      'ESLint import/no-cycle (import-x/no-cycle): настройка, чтение сообщения, опции maxDepth и allowUnsafeDynamicCyclicDependency, как чинить.',
    'level.7.desc':
      'Каталог приёмов разрыва: третий модуль, инверсия зависимостей, внедрение зависимости, события, dynamic import, перенос типа. Практика — 9 многофайловых заданий (3 приёма × простое/среднее/сложное) с автопроверкой графа.',
    'level.8.desc':
      'FSD против циклов: слои (app → pages → widgets → features → entities → shared), правило нисходящих импортов, сегменты. Практика — 6 многофайловых заданий с автопроверкой цикла и направления слоёв.',
    'level.9.desc':
      'Изоляция слайсов (запрет cross-import на одном слое) и public API слайса — как это гасит целый класс циклов. Практика — 6 многофайловых заданий с автопроверкой цикла и public API.',
    'level.10.desc':
      'Нарушения FSD, ведущие к циклам: импорт вверх, cross-import слайсов, обход public API, «толстый» shared, @x-нотация. Практика — 6 заданий-ревью с автопроверкой цикла и границ (2 темы × простое/среднее/сложное).',
    'level.11.desc':
      'Автоматизация границ FSD: eslint-plugin-boundaries, @feature-sliced/eslint-config, Steiger — и связка с no-cycle.',
    'level.12.desc':
      'Циклы в монорепозиториях: между пакетами и воркспейсами, package.json-циклы, инструменты и граф зависимостей. Практика — 6 многофайловых заданий, пакеты эмулируются каталогами packages/*.',
    'level.13.desc':
      'CI-гейт и предотвращение: запрет новых циклов в CI, архитектурные фитнес-функции, бюджет и baseline циклов.',
    'level.14.desc':
      'Капстоун: сквозной workflow — обнаружить, классифицировать, выбрать приём, починить и закрепить результат в CI. Практика — 6 итоговых заданий: модульный граф и FSD-срез без циклов.',
  },
  en: {
    // Platform UI only
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.close': 'Close',
    'task.title': 'Task',
    'task.description': 'Task Description',
    'task.placeholder': 'Your result will appear here',
    'task.markComplete': 'Mark as complete',
    'task.markIncomplete': 'Mark as incomplete',
    'theory.title': 'Theory',
    'theory.brief': 'Brief',
    'theory.detailed': 'Detailed',
    'theory.notFound': 'Theory not found',
    'solution.show': 'Show solution',
    'solution.hide': 'Hide solution',
    'quiz.title': 'Theory Quiz',
    'quiz.submit': 'Submit',
    'quiz.correct': 'Correct!',
    'quiz.wrong': 'Incorrect',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.toggle': 'Toggle theme',
    'language.select': 'Select language',
    'language.ru': 'Русский',
    'language.en': 'English',
    'scroll.top': 'Back to top',
  },
}
