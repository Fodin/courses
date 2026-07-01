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
    'nav.intro': 'Введение: менеджеры пакетов',
    'nav.packageJson': 'package.json и виды зависимостей',
    'nav.semver': 'Семантическое версионирование',
    'nav.lockfile': 'package-lock.json',
    'nav.nodeModules': 'Устройство node_modules',
    'nav.resolution': 'Алгоритм разрешения',
    'nav.installCommands': 'Команды установки и обновления',
    'nav.diagnostics': 'Диагностика дерева',
    'nav.errorResolution': 'Разрешение ошибок установки',
    'nav.overrides': 'overrides: форсирование версий',
    'nav.auditSecurity': 'Безопасность и npm audit',
    'nav.scriptsLifecycle': 'npm scripts и lifecycle',
    'nav.cacheIntegrity': 'Кэш, integrity и .npmrc',
    'nav.workspaces': 'Workspaces и монорепо',
    'nav.publishing': 'Публикация пакетов',
    'nav.pnpm': 'pnpm: устройство и отличия',
    'nav.yarn': 'Yarn: classic, berry, PnP',
    'nav.comparison': 'npm vs pnpm vs yarn',
    'nav.migrationTroubleshooting': 'Миграция и устранение неполадок',

    // Подписи заданий-квизов
    'task.0.1': 'Квиз: менеджеры пакетов и registry',
    'task.1.1': 'Квиз: виды зависимостей',
    'task.2.1': 'Квиз: semver и диапазоны',
    'task.3.1': 'Квиз: lockfile и npm ci',
    'task.4.1': 'Квиз: node_modules и hoisting',
    'task.5.1': 'Квиз: разрешение зависимостей',
    'task.6.1': 'Квиз: команды установки',
    'task.7.1': 'Квиз: диагностика дерева',
    'task.8.1': 'Квиз: ERESOLVE и peer-конфликты',
    'task.9.1': 'Квиз: overrides',
    'task.10.1': 'Квиз: npm audit и безопасность',
    'task.11.1': 'Квиз: scripts и lifecycle',
    'task.12.1': 'Квиз: кэш и integrity',
    'task.13.1': 'Квиз: workspaces',
    'task.14.1': 'Квиз: публикация пакетов',
    'task.15.1': 'Квиз: pnpm',
    'task.16.1': 'Квиз: yarn',
    'task.17.1': 'Квиз: сравнение менеджеров',
    'task.18.1': 'Квиз: миграция и неполадки',

    // Platform UI
    'task.title': 'Задание',
    'task.description': 'Описание задания',
    'task.placeholder': 'Ваш результат появится здесь',
    'task.markComplete': 'Отметить выполненным',
    'task.markIncomplete': 'Отметить невыполненным',
    'theory.title': 'Теория',
    'theory.brief': 'Кратко',
    'theory.detailed': 'Подробно',
    'theory.notFound': 'Теория не найдена',
    'solution.show': 'Показать решение',
    'solution.hide': 'Скрыть решение',
    'quiz.title': 'Квиз по теории',
    'quiz.submit': 'Проверить',
    'quiz.correct': 'Правильно!',
    'quiz.wrong': 'Неправильно',
    'theme.light': 'Светлая',
    'theme.dark': 'Тёмная',
    'theme.toggle': 'Переключить тему',
    'language.select': 'Выбрать язык',
    'language.ru': 'Русский',
    'language.en': 'English',
    'scroll.top': 'Наверх',

    // Level descriptions
    'level.0.desc':
      'Зачем нужны менеджеры пакетов, как устроен npm registry, что такое зависимости проекта',
    'level.1.desc':
      'dependencies, devDependencies, peerDependencies, optionalDependencies, bundledDependencies',
    'level.2.desc': 'Semver, диапазоны ^ и ~, точные версии, prerelease, как npm выбирает версию',
    'level.3.desc':
      'package-lock.json, форматы lockfile v1/v2/v3, чтение лок-файла, npm ci vs install',
    'level.4.desc': 'Устройство node_modules, плоская структура, hoisting, дедупликация',
    'level.5.desc':
      'Как npm строит дерево зависимостей, конфликты версий, дублирование, транзитивные зависимости',
    'level.6.desc': 'install, ci, update, outdated, prune, dedupe — что делает каждая команда',
    'level.7.desc':
      'npm ls, npm explain/why, npm doctor, npm fund — диагностика дерева зависимостей',
    'level.8.desc':
      'Коды ошибок, ERESOLVE, конфликты peer-зависимостей, --legacy-peer-deps и --force',
    'level.9.desc':
      'overrides: синтаксис, вложенные правила, форсирование версий транзитивных зависимостей, сравнение с resolutions',
    'level.10.desc': 'npm audit, классификация уязвимостей, audit fix и --force, связь с overrides',
    'level.11.desc':
      'npm scripts, pre/post-хуки, lifecycle-скрипты установки, npx, ошибки postinstall',
    'level.12.desc':
      'npm cache, контроль целостности (integrity, SRI), офлайн-режим, конфигурация через .npmrc',
    'level.13.desc':
      'npm workspaces, разрешение зависимостей внутри монорепо, hoisting в workspaces',
    'level.14.desc':
      'npm publish, scopes, dist-tags, .npmrc, приватные реестры, поле files и .npmignore',
    'level.15.desc':
      'pnpm: content-addressable store, симлинки, строгий node_modules, экономия места',
    'level.16.desc':
      'Yarn classic vs berry, yarn.lock, Plug’n’Play, отличия в hoisting и разрешении',
    'level.17.desc':
      'Сравнение npm, pnpm и yarn: скорость, диск, строгость, фантомные зависимости, выбор инструмента',
    'level.18.desc':
      'Миграция между менеджерами, частые проблемы и чек-лист диагностики зависимостей',
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
