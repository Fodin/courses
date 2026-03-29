import { type ReactNode, useMemo, type ReactElement, isValidElement } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

import { useCollapsible } from '../hooks/useCollapsible'
import { useMarkdownLoader } from '../hooks/useMarkdownLoader'
import { MermaidDiagram } from './MermaidDiagram'

import styles from './CollapsibleMarkdown.module.css'

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
}

export function CollapsibleMarkdown({
  path,
  title,
  initialOpen = true,
  components,
  children,
}: CollapsibleMarkdownProps) {
  const { isOpen, toggle } = useCollapsible({ initialState: initialOpen })
  const { content } = useMarkdownLoader(path)

  const mergedComponents = useMemo<Components>(() => {
    const mermaidPre: Components['pre'] = ({ children: preChildren, ...props }) => {
      const childArray = Array.isArray(preChildren) ? preChildren : [preChildren]
      const firstChild = childArray[0]
      if (isValidElement(firstChild)) {
        const codeProps = (firstChild as ReactElement<{ className?: string; children?: ReactNode }>).props
        if (codeProps.className?.includes('language-mermaid')) {
          const chart = extractText(codeProps.children).replace(/\n$/, '')
          return <MermaidDiagram chart={chart} />
        }
      }
      return <pre {...props}>{preChildren}</pre>
    }

    return {
      pre: mermaidPre,
      ...components,
    }
  }, [components])

  if (!content) {
    return null
  }

  return (
    <section className={styles.container}>
      <div
        className={`${styles.header} ${isOpen ? styles.headerOpen : styles.headerClosed}`}
        onClick={toggle}
      >
        <span className={styles.title}>{title}</span>
        <span className={styles.icon}>{isOpen ? '🔼' : '🔽'}</span>
      </div>

      {isOpen && (
        <div className={`${styles.content} theory-content`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
            components={mergedComponents}
          >
            {content}
          </ReactMarkdown>
          {children}
        </div>
      )}
    </section>
  )
}
