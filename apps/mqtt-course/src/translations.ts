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
    'nav.intro': 'Введение в MQTT',
    'nav.installation': 'Установка на OpenWRT',
    'nav.configuration': 'Базовая конфигурация',
    'nav.topics': 'Топики и сообщения',
    'nav.qos': 'QoS и доставка',
    'nav.auth': 'Аутентификация',
    'nav.tls': 'TLS/SSL шифрование',
    'nav.persistence': 'Persistence',
    'nav.bridge': 'Bridge — мосты',
    'nav.websockets': 'WebSockets',
    'nav.monitoring': 'Мониторинг',
    'nav.optimization': 'Оптимизация для OpenWRT',
    'nav.security': 'Безопасность',

    // Уровень 0
    'task.0.1': 'Протокол MQTT и модель pub/sub',
    'task.0.2': 'Архитектура: брокер, клиенты, топики',
    'task.0.3': 'MQTT vs HTTP/WebSocket/AMQP',

    // Уровень 1
    'task.1.1': 'Установка через opkg',
    'task.1.2': 'Структура файлов Mosquitto',
    'task.1.3': 'Первый запуск и проверка',

    // Уровень 2
    'task.2.1': 'mosquitto.conf — основные параметры',
    'task.2.2': 'Listeners и порты',
    'task.2.3': 'Настройка логирования',

    // Уровень 3
    'task.3.1': 'Иерархия топиков',
    'task.3.2': 'Wildcards: + и #',
    'task.3.3': 'Системные топики $SYS',

    // Уровень 4
    'task.4.1': 'Уровни QoS (0, 1, 2)',
    'task.4.2': 'Retained messages',
    'task.4.3': 'Last Will and Testament',

    // Уровень 5
    'task.5.1': 'Файл паролей (password_file)',
    'task.5.2': 'ACL — списки контроля доступа',
    'task.5.3': 'Плагины аутентификации',

    // Уровень 6
    'task.6.1': 'Генерация сертификатов',
    'task.6.2': 'Настройка TLS в Mosquitto',
    'task.6.3': 'Клиентские сертификаты (mTLS)',

    // Уровень 7
    'task.7.1': 'Persistence database',
    'task.7.2': 'Хранение на OpenWRT',
    'task.7.3': 'Бэкап и восстановление',

    // Уровень 8
    'task.8.1': 'Концепция Bridge',
    'task.8.2': 'Настройка моста',
    'task.8.3': 'Фильтрация топиков в мосте',

    // Уровень 9
    'task.9.1': 'WebSocket listener',
    'task.9.2': 'Reverse proxy (uhttpd/nginx)',
    'task.9.3': 'Веб-клиент MQTT',

    // Уровень 10
    'task.10.1': '$SYS топики брокера',
    'task.10.2': 'Скрипты мониторинга',
    'task.10.3': 'Интеграция с collectd',

    // Уровень 11
    'task.11.1': 'Ограничения встраиваемых систем',
    'task.11.2': 'Тюнинг Mosquitto',
    'task.11.3': 'Управление соединениями',

    // Уровень 12
    'task.12.1': 'Firewall правила',
    'task.12.2': 'Rate limiting и защита',
    'task.12.3': 'Чеклист безопасности MQTT',

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
    'theory.brief': 'Кратко',
    'theory.detailed': 'Развёрнуто',
    'theory.loading': 'Загрузка теории...',
    'quiz.title': '🧪 Тест по теории',
    'quiz.submit': 'Ответить',
    'quiz.correct': '✅ Правильно!',
    'quiz.wrong': '❌ Неправильно',
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
    'level.0.desc': 'Протокол MQTT, модель pub/sub, архитектура, сравнение с альтернативами',
    'level.1.desc': 'Установка Mosquitto через opkg, структура файлов, первый запуск',
    'level.2.desc': 'mosquitto.conf, listeners, порты, логирование',
    'level.3.desc': 'Иерархия топиков, wildcards (+, #), системные $SYS',
    'level.4.desc': 'QoS 0/1/2, retained messages, Last Will and Testament',
    'level.5.desc': 'password_file, ACL, плагины аутентификации',
    'level.6.desc': 'Генерация сертификатов, TLS, mTLS',
    'level.7.desc': 'Persistence database, хранение на flash, бэкап',
    'level.8.desc': 'Bridge между брокерами, фильтрация топиков',
    'level.9.desc': 'WebSocket listener, reverse proxy, веб-клиент',
    'level.10.desc': '$SYS метрики, скрипты мониторинга, collectd',
    'level.11.desc': 'Ограничения embedded, тюнинг памяти и соединений',
    'level.12.desc': 'Firewall, rate limiting, hardening, чеклист',
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
    'nav.intro': 'Introduction to MQTT',
    'nav.installation': 'Installation on OpenWRT',
    'nav.configuration': 'Basic Configuration',
    'nav.topics': 'Topics & Messages',
    'nav.qos': 'QoS & Delivery',
    'nav.auth': 'Authentication',
    'nav.tls': 'TLS/SSL Encryption',
    'nav.persistence': 'Persistence',
    'nav.bridge': 'Bridge',
    'nav.websockets': 'WebSockets',
    'nav.monitoring': 'Monitoring',
    'nav.optimization': 'OpenWRT Optimization',
    'nav.security': 'Security',

    // Level 0
    'task.0.1': 'MQTT Protocol & pub/sub Model',
    'task.0.2': 'Architecture: Broker, Clients, Topics',
    'task.0.3': 'MQTT vs HTTP/WebSocket/AMQP',

    // Level 1
    'task.1.1': 'Installation via opkg',
    'task.1.2': 'Mosquitto File Structure',
    'task.1.3': 'First Launch & Verification',

    // Level 2
    'task.2.1': 'mosquitto.conf — Main Parameters',
    'task.2.2': 'Listeners & Ports',
    'task.2.3': 'Logging Configuration',

    // Level 3
    'task.3.1': 'Topic Hierarchy',
    'task.3.2': 'Wildcards: + and #',
    'task.3.3': 'System Topics $SYS',

    // Level 4
    'task.4.1': 'QoS Levels (0, 1, 2)',
    'task.4.2': 'Retained Messages',
    'task.4.3': 'Last Will and Testament',

    // Level 5
    'task.5.1': 'Password File (password_file)',
    'task.5.2': 'ACL — Access Control Lists',
    'task.5.3': 'Authentication Plugins',

    // Level 6
    'task.6.1': 'Certificate Generation',
    'task.6.2': 'TLS Configuration in Mosquitto',
    'task.6.3': 'Client Certificates (mTLS)',

    // Level 7
    'task.7.1': 'Persistence Database',
    'task.7.2': 'Storage on OpenWRT',
    'task.7.3': 'Backup & Recovery',

    // Level 8
    'task.8.1': 'Bridge Concept',
    'task.8.2': 'Bridge Configuration',
    'task.8.3': 'Topic Filtering in Bridge',

    // Level 9
    'task.9.1': 'WebSocket Listener',
    'task.9.2': 'Reverse Proxy (uhttpd/nginx)',
    'task.9.3': 'MQTT Web Client',

    // Level 10
    'task.10.1': '$SYS Broker Topics',
    'task.10.2': 'Monitoring Scripts',
    'task.10.3': 'collectd Integration',

    // Level 11
    'task.11.1': 'Embedded System Constraints',
    'task.11.2': 'Mosquitto Tuning',
    'task.11.3': 'Connection Management',

    // Level 12
    'task.12.1': 'Firewall Rules',
    'task.12.2': 'Rate Limiting & Protection',
    'task.12.3': 'MQTT Security Checklist',

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
    'theory.brief': 'Brief',
    'theory.detailed': 'Detailed',
    'theory.loading': 'Loading theory...',
    'quiz.title': '🧪 Theory Quiz',
    'quiz.submit': 'Submit',
    'quiz.correct': '✅ Correct!',
    'quiz.wrong': '❌ Incorrect',
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
    'level.0.desc': 'MQTT protocol, pub/sub model, architecture, comparison',
    'level.1.desc': 'Installing Mosquitto via opkg, file structure, first launch',
    'level.2.desc': 'mosquitto.conf, listeners, ports, logging',
    'level.3.desc': 'Topic hierarchy, wildcards (+, #), $SYS system topics',
    'level.4.desc': 'QoS 0/1/2, retained messages, Last Will and Testament',
    'level.5.desc': 'password_file, ACL, authentication plugins',
    'level.6.desc': 'Certificate generation, TLS, mTLS',
    'level.7.desc': 'Persistence database, flash storage, backup',
    'level.8.desc': 'Broker bridging, topic filtering',
    'level.9.desc': 'WebSocket listener, reverse proxy, web client',
    'level.10.desc': '$SYS metrics, monitoring scripts, collectd',
    'level.11.desc': 'Embedded constraints, memory & connection tuning',
    'level.12.desc': 'Firewall, rate limiting, hardening, checklist',
  },
}
