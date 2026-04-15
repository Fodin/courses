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
    'nav.languageAndParadigms': 'Язык, семантика и парадигмы',
    'nav.typeSystems': 'Система типов и дженерики',
    'nav.dataStructuresAndAdt': 'Структуры данных и ADT',
    'nav.stateAndImmutability': 'Состояние и мутабельность',
    'nav.functionsAndComposition': 'Функции и композиция',
    'nav.polymorphismAndDispatch': 'Полиморфизм и диспетчеризация',
    'nav.structuralComposition': 'Композиция и делегирование',
    'nav.modularity': 'Модульность',
    'nav.abstractionAndSoc': 'Абстракция и SoC',
    'nav.couplingCohesionBoundaries': 'Связанность и границы',
    'nav.iocAndContracts': 'IoC и контракты',
    'nav.namingAndCodeStyle': 'Именование и стиль',
    'nav.errorHandling': 'Обработка ошибок',
    'nav.concurrencyAndAsync': 'Конкурентность и async',
    'nav.metaprogrammingAndDsl': 'Метапрограммирование и DSL',
    'nav.testing': 'Тестирование',
    'nav.refactoringAndReview': 'Рефакторинг и код-ревью',
    'nav.platformAgnostic': 'Платформенная независимость',
    'nav.aiEngineering': 'AI-assisted инженерия',

    // Уровень 0 — Язык, семантика и парадигмы
    'task.0.1': 'Квиз: язык и парадигмы',

    // Уровень 1 — Система типов и дженерики
    'task.1.1': 'Квиз: система типов',

    // Уровень 2 — Структуры данных и ADT
    'task.2.1': 'Квиз: структуры данных и ADT',

    // Уровень 3 — Состояние и мутабельность
    'task.3.1': 'Квиз: состояние и иммутабельность',

    // Уровень 4 — Функции и композиция
    'task.4.1': 'Квиз: функции и композиция',

    // Уровень 5 — Полиморфизм и диспетчеризация
    'task.5.1': 'Квиз: полиморфизм',

    // Уровень 6 — Композиция и делегирование
    'task.6.1': 'Квиз: структурная композиция',

    // Уровень 7 — Модульность
    'task.7.1': 'Квиз: модульность',

    // Уровень 8 — Абстракция и SoC
    'task.8.1': 'Квиз: абстракция и SoC',

    // Уровень 9 — Связанность и границы
    'task.9.1': 'Квиз: связанность и границы',

    // Уровень 10 — IoC и контракты
    'task.10.1': 'Квиз: IoC и контракты',

    // Уровень 11 — Именование и стиль
    'task.11.1': 'Квиз: именование',

    // Уровень 12 — Обработка ошибок
    'task.12.1': 'Квиз: обработка ошибок',

    // Уровень 13 — Конкурентность и async
    'task.13.1': 'Квиз: конкурентность',

    // Уровень 14 — Метапрограммирование и DSL
    'task.14.1': 'Квиз: метапрограммирование',

    // Уровень 15 — Тестирование
    'task.15.1': 'Квиз: тестирование',

    // Уровень 16 — Рефакторинг и код-ревью
    'task.16.1': 'Квиз: рефакторинг',

    // Уровень 17 — Платформенная независимость
    'task.17.1': 'Квиз: платформенная независимость',

    // Уровень 18 — AI-assisted инженерия
    'task.18.1': 'Квиз: AI-assisted инженерия',

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
    'level.0.desc': 'Синтаксис, семантика, декларативный vs императивный стиль, мультипарадигменность',
    'level.1.desc': 'Номинальная и структурная типизация, вариантность, дженерики',
    'level.2.desc': 'Выбор структур данных, алгебраические типы (Sum, Product), паттерн-матчинг',
    'level.3.desc': 'Мутабельные vs иммутабельные данные, скрытое состояние, идемпотентность',
    'level.4.desc': 'Чистые функции, ссылочная прозрачность, ленивость, рекурсия vs циклы',
    'level.5.desc': 'Ad-hoc, подтиповой, параметрический полиморфизм, статическая и динамическая диспетчеризация',
    'level.6.desc': 'Композиция vs наследование, агрегация, делегирование, миксины',
    'level.7.desc': 'ES Modules, пакеты, пространства имён, инкапсуляция на уровне модуля',
    'level.8.desc': 'Уровни абстракции, Separation of Concerns, слоёная архитектура',
    'level.9.desc': 'Coupling/cohesion, закон Деметры, интерфейсы, архитектурные границы',
    'level.10.desc': 'Dependency Injection, Inversion of Control, контрактное программирование',
    'level.11.desc': 'Конвенции именования, самодокументирующийся код, код как коммуникация',
    'level.12.desc': 'Exceptions, Result/Either, error boundaries, стратегии восстановления',
    'level.13.desc': 'Concurrency vs parallelism, async/await, race conditions, модели конкурентности',
    'level.14.desc': 'Кодогенерация, рефлексия, proxy, DSL, интерпретаторы, AST',
    'level.15.desc': 'Unit/integration/e2e тесты, coverage, TDD, моки и стабы',
    'level.16.desc': 'Техники рефакторинга, code smells, процесс код-ревью',
    'level.17.desc': 'Разделение системного и прикладного кода, независимость от платформы и фреймворка',
    'level.18.desc': 'AI-assisted разработка, prompt engineering для кода, copilot-driven development',
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
