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
    'nav.agentParadigm': 'Агентская парадигма',
    'nav.claudeMd': 'CLAUDE.md',
    'nav.rulesContext': 'Правила и контекст',
    'nav.settingsPermissions': 'Настройки и разрешения',
    'nav.skills': 'Навыки (Skills)',
    'nav.hooks': 'Хуки',
    'nav.mcpServers': 'MCP-серверы',
    'nav.subagents': 'Субагенты',
    'nav.agentTeams': 'Agent Teams',
    'nav.agentSdk': 'Agent SDK',
    'nav.repoDesign': 'Дизайн репозитория',
    'nav.securitySandbox': 'Безопасность',
    'nav.teamEnterprise': 'Команда и Enterprise',
    'nav.patternsCases': 'Паттерны и кейсы',

    // Задания (по одному фиктивному на уровень)
    'task.0.1': 'Теория',
    'task.1.1': 'Теория',
    'task.2.1': 'Теория',
    'task.3.1': 'Теория',
    'task.4.1': 'Теория',
    'task.5.1': 'Теория',
    'task.6.1': 'Теория',
    'task.7.1': 'Теория',
    'task.8.1': 'Теория',
    'task.9.1': 'Теория',
    'task.10.1': 'Теория',
    'task.11.1': 'Теория',
    'task.12.1': 'Теория',
    'task.13.1': 'Теория',

    // Задания (UI)
    'task.title': 'Задание',
    'task.description': 'Описание задания',
    'task.yourForm': 'Ваш компонент:',
    'task.placeholder': 'Ваш компонент появится здесь',
    'task.openFile': 'Откройте файл',
    'task.andComplete': 'и выполните задание',
    'task.formReady': 'Компонент реализован!',
    'task.markComplete': 'Отметить как выполненное',
    'task.markIncomplete': 'Отметить как не выполненное',
    'task.stats.fields': 'Количество полей',
    'task.stats.field': 'поле',
    'task.stats.buttons': 'кнопок',
    'task.stats.button': 'кнопка',
    'task.stats.submitButton': 'Кнопка отправки',
    'task.stats.validation': 'Валидация',
    'task.stats.hasValidation': 'Форма имеет валидацию',

    // Теория
    'theory.title': 'Теория',
    'theory.brief': 'Кратко',
    'theory.detailed': 'Развёрнуто',
    'theory.loading': 'Загрузка теории...',
    'theory.notFound': '',

    // Тест
    'quiz.title': 'Тест по теории',
    'quiz.submit': 'Ответить',
    'quiz.correct': 'Правильно!',
    'quiz.wrong': 'Неправильно',

    // Решение
    'solution.show': 'Показать решение',
    'solution.hide': 'Скрыть решение',

    // Тема
    'theme.light': 'Светлая',
    'theme.dark': 'Тёмная',
    'theme.toggle': 'Переключить тему',

    // Язык
    'language.select': 'Выбрать язык',
    'language.ru': 'Русский',
    'language.en': 'English',

    // Прокрутка
    'scroll.top': 'Наверх',

    // Уровни (описания)
    'level.0.desc': 'Что такое агентская разработка, модель «человек-агент-код»',
    'level.1.desc': 'Инструкции проекта, скоупы, импорты, антипаттерны',
    'level.2.desc': '.claude/rules/, бюджет контекста, /compact, /clear',
    'level.3.desc': 'Иерархия настроек, режимы разрешений, allow/deny',
    'level.4.desc': 'SKILL.md, слэш-команды, переменные, supporting files',
    'level.5.desc': 'События жизненного цикла, command/http/prompt/agent хуки',
    'level.6.desc': 'Model Context Protocol, транспорты, аутентификация',
    'level.7.desc': '.claude/agents/, делегирование, foreground/background',
    'level.8.desc': 'Lead + teammates, параллельная работа, координация',
    'level.9.desc': 'Python/TS SDK, custom tools, сессии, CI/CD',
    'level.10.desc': 'Структура проекта, naming, тесты, verification-driven dev',
    'level.11.desc': 'Prompt injection, sandboxing, секреты, аудит',
    'level.12.desc': 'Managed settings, plugins, онбординг, стандартизация',
    'level.13.desc': 'Legacy-миграция, greenfield, микросервисы, CI/CD',
  },
  en: {
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.close': 'Close',

    // Navigation
    'nav.title': 'Levels',
    'nav.level': 'Level',
    'nav.agentParadigm': 'Agent Paradigm',
    'nav.claudeMd': 'CLAUDE.md',
    'nav.rulesContext': 'Rules & Context',
    'nav.settingsPermissions': 'Settings & Permissions',
    'nav.skills': 'Skills',
    'nav.hooks': 'Hooks',
    'nav.mcpServers': 'MCP Servers',
    'nav.subagents': 'Subagents',
    'nav.agentTeams': 'Agent Teams',
    'nav.agentSdk': 'Agent SDK',
    'nav.repoDesign': 'Repo Design',
    'nav.securitySandbox': 'Security',
    'nav.teamEnterprise': 'Team & Enterprise',
    'nav.patternsCases': 'Patterns & Cases',

    // Tasks
    'task.0.1': 'Theory',
    'task.1.1': 'Theory',
    'task.2.1': 'Theory',
    'task.3.1': 'Theory',
    'task.4.1': 'Theory',
    'task.5.1': 'Theory',
    'task.6.1': 'Theory',
    'task.7.1': 'Theory',
    'task.8.1': 'Theory',
    'task.9.1': 'Theory',
    'task.10.1': 'Theory',
    'task.11.1': 'Theory',
    'task.12.1': 'Theory',
    'task.13.1': 'Theory',

    // Tasks (UI)
    'task.title': 'Task',
    'task.description': 'Task Description',
    'task.yourForm': 'Your Component:',
    'task.placeholder': 'Your component will appear here',
    'task.openFile': 'Open file',
    'task.andComplete': 'and complete the task',
    'task.formReady': 'Component implemented!',
    'task.markComplete': 'Mark as completed',
    'task.markIncomplete': 'Mark as not completed',
    'task.stats.fields': 'Number of fields',
    'task.stats.field': 'field',
    'task.stats.buttons': 'buttons',
    'task.stats.button': 'button',
    'task.stats.submitButton': 'Submit button',
    'task.stats.validation': 'Validation',
    'task.stats.hasValidation': 'Form has validation',

    // Theory
    'theory.title': 'Theory',
    'theory.brief': 'Brief',
    'theory.detailed': 'Detailed',
    'theory.loading': 'Loading theory...',
    'theory.notFound': '',

    // Quiz
    'quiz.title': 'Theory Quiz',
    'quiz.submit': 'Submit',
    'quiz.correct': 'Correct!',
    'quiz.wrong': 'Incorrect',

    // Solution
    'solution.show': 'Show Solution',
    'solution.hide': 'Hide Solution',

    // Theme
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.toggle': 'Toggle theme',

    // Language
    'language.select': 'Select language',
    'language.ru': 'Русский',
    'language.en': 'English',

    // Scroll
    'scroll.top': 'To Top',

    // Levels (descriptions)
    'level.0.desc': 'What is agent-based development, human-agent-code model',
    'level.1.desc': 'Project instructions, scopes, imports, anti-patterns',
    'level.2.desc': '.claude/rules/, context budget, /compact, /clear',
    'level.3.desc': 'Settings hierarchy, permission modes, allow/deny',
    'level.4.desc': 'SKILL.md, slash commands, variables, supporting files',
    'level.5.desc': 'Lifecycle events, command/http/prompt/agent hooks',
    'level.6.desc': 'Model Context Protocol, transports, authentication',
    'level.7.desc': '.claude/agents/, delegation, foreground/background',
    'level.8.desc': 'Lead + teammates, parallel work, coordination',
    'level.9.desc': 'Python/TS SDK, custom tools, sessions, CI/CD',
    'level.10.desc': 'Project structure, naming, tests, verification-driven dev',
    'level.11.desc': 'Prompt injection, sandboxing, secrets, audit',
    'level.12.desc': 'Managed settings, plugins, onboarding, standardization',
    'level.13.desc': 'Legacy migration, greenfield, microservices, CI/CD',
  },
}
