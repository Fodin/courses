import { type ReactNode, useMemo, type ReactElement, isValidElement } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx'
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'

import { useCollapsible } from '../hooks/useCollapsible'
import { useMarkdownLoader } from '../hooks/useMarkdownLoader'
import { useTheme } from '../hooks/useTheme'
import { MermaidDiagram } from './MermaidDiagram'
import oneLight from 'react-syntax-highlighter/dist/esm/styles/prism/one-light'
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark'

import styles from './CollapsibleMarkdown.module.css'

SyntaxHighlighter.registerLanguage('tsx', tsx)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('jsx', jsx)
SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('js', javascript)
SyntaxHighlighter.registerLanguage('ts', typescript)
SyntaxHighlighter.registerLanguage('text', javascript)

function extractText(node: ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (!node) return ''
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (isValidElement(node)) {
    return extractText((node as ReactElement<{ children?: ReactNode }>).props.children)
  }
  return ''
}

interface CollapsibleMarkdownProps {
  path: string
  title: string
  initialOpen?: boolean
  components?: Components
  children?: ReactNode
  headerExtra?: ReactNode
  emptyMessage?: string
}

export function CollapsibleMarkdown({
  path,
  title,
  initialOpen = true,
  components,
  children,
  headerExtra,
  emptyMessage,
}: CollapsibleMarkdownProps) {
  const { isOpen, toggle } = useCollapsible({ initialState: initialOpen })
  const { content } = useMarkdownLoader(path)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const mergedComponents = useMemo<Components>(() => {
    const codePre: Components['pre'] = ({ children: preChildren }) => {
      const childArray = Array.isArray(preChildren) ? preChildren : [preChildren]
      const firstChild = childArray[0]
      if (isValidElement(firstChild)) {
        const codeProps = (firstChild as ReactElement<{ className?: string; children?: ReactNode }>).props
        const className = codeProps.className ?? ''

        if (className.includes('language-mermaid')) {
          const chart = extractText(codeProps.children).replace(/\n$/, '')
          return <MermaidDiagram chart={chart} />
        }

        const langMatch = className.match(/language-(\w+)/)
        const lang = langMatch?.[1] ?? 'text'
        const code = extractText(codeProps.children).replace(/\n$/, '')

        return (
          <SyntaxHighlighter
            language={lang}
            style={isDark ? oneDark : oneLight}
            customStyle={{ borderRadius: '6px', fontSize: '0.875rem', margin: '1rem 0' }}
          >
            {code}
          </SyntaxHighlighter>
        )
      }
      return <pre>{preChildren}</pre>
    }

    return {
      pre: codePre,
      ...components,
    }
  }, [components, isDark])

  if (!content && !emptyMessage) {
    return null
  }

  return (
    <section className={styles.container}>
      <div
        className={`${styles.header} ${isOpen ? styles.headerOpen : styles.headerClosed}`}
        onClick={toggle}
      >
        <span className={styles.title}>{title}</span>
        {headerExtra && (
          <div className={styles.headerExtra} onClick={e => e.stopPropagation()}>
            {headerExtra}
          </div>
        )}
        <span className={styles.icon}>{isOpen ? '🔼' : '🔽'}</span>
      </div>

      {isOpen && (
        <div className={`${styles.content} theory-content`}>
          {content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={mergedComponents}
            >
              {content}
            </ReactMarkdown>
          ) : (
            <p className={styles.emptyMessage}>{emptyMessage}</p>
          )}
          {children}
        </div>
      )}
    </section>
  )
}
