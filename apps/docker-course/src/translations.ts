import type { Translations } from '@courses/platform'

export const translations: Translations = {
  ru: {
    // Общие
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.close': 'Закрыть',

    // Навигация
    'nav.title': '📚 Уровни',
    'nav.levels': 'Уровни',
    'nav.level': 'Уровень',
    'nav.intro': 'Введение в Docker',
    'nav.images': 'Образы',
    'nav.containers': 'Контейнеры',
    'nav.dockerfile': 'Dockerfile',
    'nav.volumes': 'Тома и данные',
    'nav.networking': 'Сеть',
    'nav.composeBasics': 'Compose — основы',
    'nav.composeAdvanced': 'Compose — продвинутое',
    'nav.envConfig': 'Переменные и конфигурация',
    'nav.logging': 'Логирование и отладка',
    'nav.optimization': 'Оптимизация образов',
    'nav.security': 'Безопасность',
    'nav.cicd': 'Docker в CI/CD',

    // Уровень 0
    'task.0.1': 'Контейнеры vs виртуальные машины',
    'task.0.2': 'Архитектура Docker',

    // Уровень 1
    'task.1.1': 'docker pull и реестры',
    'task.1.2': 'Структура Dockerfile',
    'task.1.3': 'docker build',
    'task.1.4': 'Теги и версионирование',

    // Уровень 2
    'task.2.1': 'docker run',
    'task.2.2': 'Флаги запуска',
    'task.2.3': 'Жизненный цикл контейнера',
    'task.2.4': 'docker exec',

    // Уровень 3
    'task.3.1': 'WORKDIR, ENV, ARG',
    'task.3.2': 'CMD vs ENTRYPOINT',
    'task.3.3': 'COPY vs ADD, .dockerignore',
    'task.3.4': 'Multi-stage builds',

    // Уровень 4
    'task.4.1': 'Именованные тома',
    'task.4.2': 'Bind mounts',
    'task.4.3': 'tmpfs и readonly',

    // Уровень 5
    'task.5.1': 'Bridge network',
    'task.5.2': 'Связь между контейнерами',
    'task.5.3': 'Проброс портов',
    'task.5.4': 'Custom networks',

    // Уровень 6
    'task.6.1': 'Структура docker-compose.yml',
    'task.6.2': 'services, image, build',
    'task.6.3': 'ports, volumes, environment',
    'task.6.4': 'docker compose up/down/logs',

    // Уровень 7
    'task.7.1': 'depends_on и healthcheck',
    'task.7.2': 'Web + DB + Cache',
    'task.7.3': 'profiles и override',
    'task.7.4': 'Compose Watch',

    // Уровень 8
    'task.8.1': 'ENV и .env файлы',
    'task.8.2': 'Secrets и configs',
    'task.8.3': 'Шаблоны конфигурации',

    // Уровень 9
    'task.9.1': 'docker logs',
    'task.9.2': 'inspect, stats, top',
    'task.9.3': 'Отладка типичных ошибок',

    // Уровень 10
    'task.10.1': 'Слои и кэширование',
    'task.10.2': 'Alpine, slim, distroless',
    'task.10.3': 'Multi-stage для production',
    'task.10.4': 'Hadolint и линтинг',

    // Уровень 11
    'task.11.1': 'Пользователи и Capabilities',
    'task.11.2': 'Сканирование уязвимостей',
    'task.11.3': 'Чеклист безопасности',

    // Уровень 12
    'task.12.1': 'Docker в GitHub Actions',
    'task.12.2': 'Multi-platform builds',
    'task.12.3': 'Финальный проект',

    // Задания
    'task.title': 'Задание',
    'task.description': '📋 Описание задания',
    'task.yourForm': '🎯 Ваш результат:',
    'task.placeholder': 'Ваш результат появится здесь',
    'task.openFile': 'Откройте файл',
    'task.andComplete': 'и выполните задание',
    'task.formReady': 'Задание выполнено!',
    'task.markComplete': 'Отметить как выполненное',
    'task.markIncomplete': 'Отметить как не выполненное',

    // Теория и решение
    'theory.title': '📚 Теория',
    'theory.loading': 'Загрузка теории...',
    'solution.show': '💡 Показать решение',
    'solution.hide': '🙈 Скрыть решение',

    // Тема и язык
    'theme.light': 'Светлая',
    'theme.dark': 'Тёмная',
    'theme.toggle': 'Переключить тему',
    'language.select': 'Выбрать язык',
    'language.ru': 'Русский',
    'language.en': 'English',
    'scroll.top': 'Наверх',

    // Описания уровней
    'level.0.desc': 'Зачем нужен Docker, контейнеры vs ВМ, архитектура',
    'level.1.desc': 'Образы: pull, build, теги, реестры, Dockerfile',
    'level.2.desc': 'Запуск, управление, жизненный цикл контейнеров',
    'level.3.desc': 'WORKDIR, ENV, ARG, CMD/ENTRYPOINT, multi-stage',
    'level.4.desc': 'Volumes, bind mounts, tmpfs — персистентность данных',
    'level.5.desc': 'Bridge, host, overlay, проброс портов, DNS',
    'level.6.desc': 'docker-compose.yml, services, ports, volumes',
    'level.7.desc': 'depends_on, healthcheck, profiles, Compose Watch',
    'level.8.desc': 'ENV, .env, secrets, configs, шаблоны',
    'level.9.desc': 'Логи, inspect, stats, отладка проблем',
    'level.10.desc': 'Слои, кэш, alpine/slim/distroless, Hadolint',
    'level.11.desc': 'USER, capabilities, сканирование CVE, чеклист безопасности',
    'level.12.desc': 'GitHub Actions, buildx, multi-platform, CI/CD',
  },
  en: {
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.close': 'Close',

    // Navigation
    'nav.title': '📚 Levels',
    'nav.levels': 'Levels',
    'nav.level': 'Level',
    'nav.intro': 'Introduction to Docker',
    'nav.images': 'Images',
    'nav.containers': 'Containers',
    'nav.dockerfile': 'Dockerfile',
    'nav.volumes': 'Volumes & Data',
    'nav.networking': 'Networking',
    'nav.composeBasics': 'Compose — Basics',
    'nav.composeAdvanced': 'Compose — Advanced',
    'nav.envConfig': 'Env & Configuration',
    'nav.logging': 'Logging & Debugging',
    'nav.optimization': 'Image Optimization',
    'nav.security': 'Security',
    'nav.cicd': 'Docker in CI/CD',

    // Level 0
    'task.0.1': 'Containers vs Virtual Machines',
    'task.0.2': 'Docker Architecture',

    // Level 1
    'task.1.1': 'docker pull & registries',
    'task.1.2': 'Dockerfile structure',
    'task.1.3': 'docker build',
    'task.1.4': 'Tags & versioning',

    // Level 2
    'task.2.1': 'docker run',
    'task.2.2': 'Run flags',
    'task.2.3': 'Container lifecycle',
    'task.2.4': 'docker exec',

    // Level 3
    'task.3.1': 'WORKDIR, ENV, ARG',
    'task.3.2': 'CMD vs ENTRYPOINT',
    'task.3.3': 'COPY vs ADD, .dockerignore',
    'task.3.4': 'Multi-stage builds',

    // Level 4
    'task.4.1': 'Named volumes',
    'task.4.2': 'Bind mounts',
    'task.4.3': 'tmpfs & readonly',

    // Level 5
    'task.5.1': 'Bridge network',
    'task.5.2': 'Container-to-container',
    'task.5.3': 'Port mapping',
    'task.5.4': 'Custom networks',

    // Level 6
    'task.6.1': 'docker-compose.yml structure',
    'task.6.2': 'services, image, build',
    'task.6.3': 'ports, volumes, environment',
    'task.6.4': 'docker compose up/down/logs',

    // Level 7
    'task.7.1': 'depends_on & healthcheck',
    'task.7.2': 'Web + DB + Cache',
    'task.7.3': 'profiles & override',
    'task.7.4': 'Compose Watch',

    // Level 8
    'task.8.1': 'ENV and .env files',
    'task.8.2': 'Secrets & configs',
    'task.8.3': 'Configuration templates',

    // Level 9
    'task.9.1': 'docker logs',
    'task.9.2': 'inspect, stats, top',
    'task.9.3': 'Debugging common errors',

    // Level 10
    'task.10.1': 'Layers & caching',
    'task.10.2': 'Alpine, slim, distroless',
    'task.10.3': 'Multi-stage for production',
    'task.10.4': 'Hadolint & linting',

    // Level 11
    'task.11.1': 'Users & Capabilities',
    'task.11.2': 'Vulnerability scanning',
    'task.11.3': 'Security checklist',

    // Level 12
    'task.12.1': 'Docker in GitHub Actions',
    'task.12.2': 'Multi-platform builds',
    'task.12.3': 'Final Project',

    // Tasks
    'task.title': 'Task',
    'task.description': '📋 Task Description',
    'task.yourForm': '🎯 Your Result:',
    'task.placeholder': 'Your result will appear here',
    'task.openFile': 'Open file',
    'task.andComplete': 'and complete the task',
    'task.formReady': 'Task completed!',
    'task.markComplete': 'Mark as completed',
    'task.markIncomplete': 'Mark as incomplete',

    // Theory and solution
    'theory.title': '📚 Theory',
    'theory.loading': 'Loading theory...',
    'solution.show': '💡 Show Solution',
    'solution.hide': '🙈 Hide Solution',

    // Theme and language
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.toggle': 'Toggle theme',
    'language.select': 'Select language',
    'language.ru': 'Русский',
    'language.en': 'English',
    'scroll.top': 'To Top',

    // Level descriptions
    'level.0.desc': 'Why Docker, containers vs VMs, architecture',
    'level.1.desc': 'Images: pull, build, tags, registries, Dockerfile',
    'level.2.desc': 'Running, managing, container lifecycle',
    'level.3.desc': 'WORKDIR, ENV, ARG, CMD/ENTRYPOINT, multi-stage',
    'level.4.desc': 'Volumes, bind mounts, tmpfs — data persistence',
    'level.5.desc': 'Bridge, host, overlay, port mapping, DNS',
    'level.6.desc': 'docker-compose.yml, services, ports, volumes',
    'level.7.desc': 'depends_on, healthcheck, profiles, Compose Watch',
    'level.8.desc': 'ENV, .env, secrets, configs, templates',
    'level.9.desc': 'Logs, inspect, stats, debugging issues',
    'level.10.desc': 'Layers, cache, alpine/slim/distroless, Hadolint',
    'level.11.desc': 'USER, capabilities, CVE scanning, security checklist',
    'level.12.desc': 'GitHub Actions, buildx, multi-platform, CI/CD',
  },
}
