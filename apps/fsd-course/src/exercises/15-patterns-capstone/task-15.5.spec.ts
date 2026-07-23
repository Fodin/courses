import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 15.5 (среднее) — Капстоун, шаг 2: фича поверх сущности, виджет поверх фичи.
 *
 * Сущность `entities/comment` уже закрыта корректным public API (только чтение).
 * Задача: собрать фичу `features/add-comment` — перенести логику в `model/`,
 * реэкспортировать `submitComment` и `CommentForm` через её `index.ts`, — а затем
 * подключить виджет `widgets/comments-panel` к фиче через её public API, а не
 * глубокими импортами.
 */

const commentTypes = `export interface Comment {
  id: string
  author: string
  text: string
}
`
const commentIndex = `export type { Comment } from './model/types'
`

const commentForm = `import type { Comment } from '@/entities/comment'

export function CommentForm({ onSubmit }: { onSubmit: (comment: Comment) => void }) {
  return (
    <button
      onClick={() =>
        onSubmit({ id: crypto.randomUUID(), author: 'Гость', text: 'Новый комментарий' })
      }
    >
      Отправить
    </button>
  )
}
`

const addCommentModelStart = `// TODO: реализуйте submitComment(list, comment): она должна вернуть новый массив
// комментариев с добавленным comment в конце. Тип Comment импортируйте из
// public API сущности @/entities/comment.
`

const addCommentModelSolution = `import type { Comment } from '@/entities/comment'

export function submitComment(list: Comment[], comment: Comment): Comment[] {
  return [...list, comment]
}
`

const addCommentIndexStart = `// Public API фичи features/add-comment.
// TODO: реэкспортируйте submitComment из ./model/addComment и CommentForm из
// ./ui/CommentForm.
`

const addCommentIndexSolution = `export { submitComment } from './model/addComment'
export { CommentForm } from './ui/CommentForm'
`

// НАРУШЕНИЕ: виджет тянет внутренности фичи глубокими импортами.
const commentsPanelStart = `import { submitComment } from '@/features/add-comment/model/addComment'
import { CommentForm } from '@/features/add-comment/ui/CommentForm'
import type { Comment } from '@/entities/comment'

export function CommentsPanel({ comments }: { comments: Comment[] }) {
  return (
    <section>
      {comments.map(c => (
        <p key={c.id}>{c.text}</p>
      ))}
      <CommentForm onSubmit={c => submitComment(comments, c)} />
    </section>
  )
}
`

const commentsPanelSolution = `import { submitComment, CommentForm } from '@/features/add-comment'
import type { Comment } from '@/entities/comment'

export function CommentsPanel({ comments }: { comments: Comment[] }) {
  return (
    <section>
      {comments.map(c => (
        <p key={c.id}>{c.text}</p>
      ))}
      <CommentForm onSubmit={c => submitComment(comments, c)} />
    </section>
  )
}
`

const roFiles = [
  { path: 'src/entities/comment/model/types.ts', content: commentTypes, role: 'readonly' as const },
  { path: 'src/entities/comment/index.ts', content: commentIndex, role: 'readonly' as const },
  {
    path: 'src/features/add-comment/ui/CommentForm.tsx',
    content: commentForm,
    role: 'readonly' as const,
  },
]

export const spec: FsdTaskSpec = {
  id: '15.5',
  title: 'Задание 15.5 — Фича поверх сущности, виджет поверх фичи (среднее)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    {
      path: 'src/features/add-comment/model/addComment.ts',
      content: addCommentModelStart,
      role: 'editable',
    },
    {
      path: 'src/features/add-comment/index.ts',
      content: addCommentIndexStart,
      role: 'editable',
    },
    {
      path: 'src/widgets/comments-panel/ui/CommentsPanel.tsx',
      content: commentsPanelStart,
      role: 'editable',
    },
  ],
  solution: [
    ...roFiles,
    {
      path: 'src/features/add-comment/model/addComment.ts',
      content: addCommentModelSolution,
      role: 'editable',
    },
    {
      path: 'src/features/add-comment/index.ts',
      content: addCommentIndexSolution,
      role: 'editable',
    },
    {
      path: 'src/widgets/comments-panel/ui/CommentsPanel.tsx',
      content: commentsPanelSolution,
      role: 'editable',
    },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    exportsFromPublicApi(
      'src/features/add-comment/index.ts',
      'submitComment',
      './model/addComment'
    ),
    exportsFromPublicApi(
      'src/features/add-comment/index.ts',
      'CommentForm',
      './ui/CommentForm'
    ),
    fileContains(
      'src/widgets/comments-panel/ui/CommentsPanel.tsx',
      /from\s*'@\/features\/add-comment'/,
      'Виджет импортирует фичу через её public API `@/features/add-comment`'
    ),
    fileContains(
      'src/features/add-comment/model/addComment.ts',
      /@\/entities\/comment/,
      'Фича обращается к сущности comment через её public API'
    ),
  ],
}
