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
    'nav.setup': 'Введение и setup',
    'nav.basicEditing': 'Базовое редактирование',
    'nav.starterKit': 'StarterKit и встроенные extensions',
    'nav.marksToolbar': 'Marks и Toolbar',
    'nav.nodes': 'Nodes',
    'nav.commands': 'Commands и chaining',
    'nav.contentHtmlJson': 'Работа с контентом',
    'nav.schema': 'Schema ProseMirror',
    'nav.customExtensions': 'Кастомные Extensions',
    'nav.customNodesMarks': 'Кастомные Nodes и Marks',
    'nav.nodeViewReact': 'NodeView в React',
    'nav.inputPasteRules': 'Input rules и Paste rules',
    'nav.keyboardPlugins': 'Keyboard shortcuts и ProseMirror-плагины',
    'nav.bubbleFloatingMenu': 'BubbleMenu и FloatingMenu',
    'nav.collaboration': 'Collaboration',
    'nav.advanced': 'Продвинутое',

    // Уровень 0 — Введение и setup
    'task.0.1': 'Первый редактор',
    'task.0.2': 'Мини-тулбар',

    // Уровень 1 — Базовое редактирование
    'task.1.1': 'HTML и JSON вывод',
    'task.1.2': 'Editable toggle',
    'task.1.3': 'Счётчик символов',

    // Уровень 2 — StarterKit
    'task.2.1': 'Обзор StarterKit',
    'task.2.2': 'Отключение extensions',
    'task.2.3': 'Точечная конфигурация',

    // Уровень 3 — Marks и Toolbar
    'task.3.1': 'Bold / Italic / Strike',
    'task.3.2': 'Inline code',
    'task.3.3': 'Link mark',
    'task.3.4': 'Полная панель инструментов',

    // Уровень 4 — Nodes
    'task.4.1': 'Заголовки',
    'task.4.2': 'Списки',
    'task.4.3': 'Blockquote и HorizontalRule',
    'task.4.4': 'CodeBlock',

    // Уровень 5 — Commands и chaining
    'task.5.1': 'Основы chain()',
    'task.5.2': 'Проверка can()',
    'task.5.3': 'Своя простая команда',

    // Уровень 6 — Работа с контентом
    'task.6.1': 'HTML vs JSON',
    'task.6.2': 'setContent / insertContent',
    'task.6.3': 'Контролируемый контент',

    // Уровень 7 — Schema ProseMirror
    'task.7.1': 'Инспектор схемы',
    'task.7.2': 'Content-выражения',
    'task.7.3': 'Группы inline и block',

    // Уровень 8 — Кастомные Extensions
    'task.8.1': 'Extension.create и addOptions',
    'task.8.2': 'addStorage',
    'task.8.3': 'addGlobalAttributes',

    // Уровень 9 — Кастомные Nodes и Marks
    'task.9.1': 'Кастомный Mark: Highlight',
    'task.9.2': 'Кастомный Node: Callout',
    'task.9.3': 'Настраиваемые атрибуты',
    'task.9.4': 'Atom/leaf-нода',

    // Уровень 10 — NodeView в React
    'task.10.1': 'ReactNodeViewRenderer: базовый NodeView',
    'task.10.2': 'NodeViewContent: редактируемая зона',
    'task.10.3': 'Интерактивная нода',

    // Уровень 11 — Input rules и Paste rules
    'task.11.1': 'Markdown input rules',
    'task.11.2': 'Paste rules: автоссылки',
    'task.11.3': 'Свой input rule',

    // Уровень 12 — Keyboard shortcuts и ProseMirror-плагины
    'task.12.1': 'addKeyboardShortcuts',
    'task.12.2': 'addProseMirrorPlugins и decorations',
    'task.12.3': 'Хоткей + плагин вместе',

    // Уровень 13 — BubbleMenu и FloatingMenu
    'task.13.1': 'BubbleMenu при выделении',
    'task.13.2': 'FloatingMenu на пустой строке',
    'task.13.3': 'shouldShow: кастомная логика',

    // Уровень 14 — Collaboration
    'task.14.1': 'Y.Doc и Collaboration',
    'task.14.2': 'y-webrtc: синхронизация вкладок',
    'task.14.3': 'CollaborationCaret: курсоры соавторов',

    // Уровень 15 — Продвинутое
    'task.15.1': 'Decorations',
    'task.15.2': 'Drag handle',
    'task.15.3': 'Программное управление выделением',

    // UI платформы
    'task.title': 'Задание',
    'task.description': 'Описание задания',
    'task.placeholder': 'Ваш результат появится здесь',
    'task.markComplete': 'Отметить как выполненное',
    'task.markIncomplete': 'Отметить как не выполненное',
    'theory.title': 'Теория',
    'theory.brief': 'Кратко',
    'theory.detailed': 'Развёрнуто',
    'theory.notFound': 'Теория не найдена',
    'solution.show': 'Показать решение',
    'solution.hide': 'Скрыть решение',
    'quiz.title': 'Тест по теории',
    'quiz.submit': 'Ответить',
    'quiz.correct': 'Правильно!',
    'quiz.wrong': 'Неправильно',
    'theme.light': 'Светлая',
    'theme.dark': 'Тёмная',
    'theme.toggle': 'Переключить тему',
    'language.select': 'Выбрать язык',
    'language.ru': 'Русский',
    'language.en': 'English',
    'scroll.top': 'Наверх',

    // Описания уровней
    'level.0.desc':
      'Headless-редакторы, ProseMirror под капотом, useEditor, EditorContent, первый редактор',
    'level.1.desc': 'content, getHTML()/getJSON(), editable, onUpdate, автофокус',
    'level.2.desc': 'Что входит в StarterKit, включение/выключение расширений, конфигурация',
    'level.3.desc': 'chain().focus().toggleBold().run(), isActive(), построение панели кнопок',
    'level.4.desc': 'Headings, bulletList/orderedList, blockquote, codeBlock, horizontalRule',
    'level.5.desc': 'Команды, can(), проверка доступности, транзакции, простые свои команды',
    'level.6.desc': 'HTML vs JSON, setContent, insertContent, сериализация, контролируемый контент',
    'level.7.desc': 'nodeSpec/markSpec, content-выражения, groups, inline vs block',
    'level.8.desc': 'Extension.create, addOptions, addStorage, addGlobalAttributes',
    'level.9.desc': 'Node.create/Mark.create, parseHTML, renderHTML, addAttributes, atom/leaf-ноды',
    'level.10.desc': 'ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent, интерактивные ноды',
    'level.11.desc': 'Markdown-подобный ввод: ## → heading, ** → bold, addInputRules',
    'level.12.desc': 'addKeyboardShortcuts, addProseMirrorPlugins, Plugin/PluginKey',
    'level.13.desc': 'Контекстные всплывающие меню на базе @tiptap/extension-bubble-menu',
    'level.14.desc': 'Y.js, @tiptap/extension-collaboration, курсоры соавторов, offline-first',
    'level.15.desc':
      'Decorations, кастомные ProseMirror-плагины, drag handle, программное выделение',
  },
  en: {
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.close': 'Close',

    // Navigation
    'nav.title': 'Levels',
    'nav.levels': 'Levels',
    'nav.level': 'Level',
    'nav.setup': 'Introduction & Setup',
    'nav.basicEditing': 'Basic Editing',
    'nav.starterKit': 'StarterKit & Built-in Extensions',
    'nav.marksToolbar': 'Marks & Toolbar',
    'nav.nodes': 'Nodes',
    'nav.commands': 'Commands & Chaining',
    'nav.contentHtmlJson': 'Working with Content',
    'nav.schema': 'ProseMirror Schema',
    'nav.customExtensions': 'Custom Extensions',
    'nav.customNodesMarks': 'Custom Nodes & Marks',
    'nav.nodeViewReact': 'React NodeView',
    'nav.inputPasteRules': 'Input & Paste Rules',
    'nav.keyboardPlugins': 'Keyboard Shortcuts & ProseMirror Plugins',
    'nav.bubbleFloatingMenu': 'BubbleMenu & FloatingMenu',
    'nav.collaboration': 'Collaboration',
    'nav.advanced': 'Advanced',

    // Platform UI
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
    'quiz.wrong': 'Wrong',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.toggle': 'Toggle theme',
    'language.select': 'Select language',
    'language.ru': 'Русский',
    'language.en': 'English',
    'scroll.top': 'Back to top',
  },
}
