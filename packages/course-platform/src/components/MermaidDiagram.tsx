import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

let mermaidInitialized = false

function initMermaid(isDark: boolean) {
  mermaid.initialize({
    startOnLoad: false,
    theme: isDark ? 'dark' : 'default',
    securityLevel: 'loose',
    fontFamily: 'inherit',
  })
  mermaidInitialized = true
}

let idCounter = 0

interface MermaidDiagramProps {
  chart: string
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string>('')
  const idRef = useRef(`mermaid-${++idCounter}`)

  useEffect(() => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark'

    if (!mermaidInitialized) {
      initMermaid(isDark)
    } else {
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? 'dark' : 'default',
        securityLevel: 'loose',
        fontFamily: 'inherit',
      })
    }

    const render = async () => {
      try {
        const { svg: renderedSvg } = await mermaid.render(idRef.current, chart.trim())
        setSvg(renderedSvg)
        setError('')
      } catch (e) {
        setError(String(e))
        setSvg('')
      }
    }

    render()
  }, [chart])

  if (error) {
    return (
      <pre style={{ color: 'red', whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>
        Mermaid error: {error}
      </pre>
    )
  }

  const responsiveSvg = svg.replace(
    /(<svg[^>]*?)(?:\s+style="[^"]*")/,
    '$1 style="width:100%;max-width:100%;height:auto"',
  )

  return (
    <div
      ref={containerRef}
      style={{ margin: '1rem 0', overflow: 'auto' }}
      dangerouslySetInnerHTML={{ __html: responsiveSvg }}
    />
  )
}
