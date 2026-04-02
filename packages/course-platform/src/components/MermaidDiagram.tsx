import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import mermaid from 'mermaid'

let mermaidInitialized = false

function getMermaidConfig(isDark: boolean) {
  return {
    startOnLoad: false,
    theme: isDark ? 'dark' as const : 'default' as const,
    securityLevel: 'loose' as const,
    fontFamily: 'inherit',
    fontSize: 12,
  }
}

function initMermaid(isDark: boolean) {
  mermaid.initialize(getMermaidConfig(isDark))
  mermaidInitialized = true
}

/** Fix dark-theme SVG: inject override styles at the end for highest specificity */
function fixDarkThemeSvg(svg: string): string {
  // Get the SVG id for scoped selectors (same specificity as mermaid's own rules)
  const idMatch = svg.match(/id="([^"]+)"/)
  const id = idMatch ? `#${idMatch[1]}` : ''

  const overrides = `
<style>
  /* Text → white */
  ${id} .messageText, ${id} .labelText, ${id} .loopText,
  ${id} .noteText, ${id} .actor-box,
  ${id} .labelText>tspan, ${id} .loopText>tspan, ${id} .noteText>tspan,
  ${id} text.actor>tspan,
  ${id} .label text, ${id} .label span,
  ${id} .cluster-label text, ${id} .nodeLabel,
  ${id} .edgeLabel { fill: #e6edf3 !important; color: #e6edf3 !important; }

  /* Lines → accent blue */
  ${id} .messageLine0, ${id} .messageLine1 { stroke: #58a6ff !important; }
  ${id} .flowchart-link { stroke: #58a6ff !important; }

  /* Arrowheads → accent blue */
  ${id} #arrowhead path, ${id} #crosshead path,
  ${id} #filled-head path, ${id} #sequencenumber circle,
  ${id} .marker path, ${id} .arrowMarkerPath,
  ${id} marker path { fill: #58a6ff !important; stroke: #58a6ff !important; }

  /* Node fills → dark surface */
  ${id} .actor { fill: #2d333b !important; stroke: #646cff !important; }
  ${id} .node rect, ${id} .node circle, ${id} .node polygon,
  ${id} .node ellipse { fill: #2d333b !important; stroke: #646cff !important; }

  /* Actor lifelines */
  ${id} .actor-line { stroke: #484f58 !important; }

  /* Loop/alt boxes */
  ${id} .loopLine { stroke: #484f58 !important; fill: transparent !important; }
  ${id} .labelBox { fill: #1c2128 !important; stroke: #484f58 !important; }

  /* Notes */
  ${id} .note { fill: #2d333b !important; stroke: #d29922 !important; }

  /* Activation bars */
  ${id} .activation0, ${id} .activation1, ${id} .activation2
    { fill: #1c2128 !important; stroke: #484f58 !important; }

  /* Edge labels background */
  ${id} .edgeLabel rect { fill: #0d1117 !important; }
</style>`

  // Replace inline attributes that CSS can't override
  svg = svg
    .replace(/fill="#eaeaea"/g, 'fill="#2d333b"')
    .replace(/stroke="#666"/g, 'stroke="#646cff"')
    .replace(/stroke="#999"/g, 'stroke="#484f58"')
    .replace(/stroke="#000000"/g, 'stroke="#58a6ff"')
    .replace(/stroke="black"/g, 'stroke="#58a6ff"')
    .replace(/stroke="none"(?=[^>]*class="messageLine)/g, 'stroke="#58a6ff"')

  // Inject overrides at end of SVG (after mermaid's own <style>)
  return svg.replace(/<\/svg>\s*$/, `${overrides}</svg>`)
}

let idCounter = 0
let offscreenContainer: HTMLDivElement | null = null

function getOffscreenContainer(): HTMLDivElement {
  if (!offscreenContainer) {
    offscreenContainer = document.createElement('div')
    offscreenContainer.style.position = 'fixed'
    offscreenContainer.style.left = '-9999px'
    offscreenContainer.style.top = '-9999px'
    offscreenContainer.style.width = '1px'
    offscreenContainer.style.height = '1px'
    offscreenContainer.style.overflow = 'hidden'
    document.body.appendChild(offscreenContainer)
  }
  return offscreenContainer
}

/** Ensure SVG has a viewBox (needed for vector scaling via width/height) */
function ensureViewBox(svg: string): string {
  if (/viewBox\s*=/.test(svg)) return svg
  const wMatch = svg.match(/<svg[^>]*?\swidth="([\d.]+)"/)
  const hMatch = svg.match(/<svg[^>]*?\sheight="([\d.]+)"/)
  if (wMatch && hMatch) {
    return svg.replace(/<svg/, `<svg viewBox="0 0 ${wMatch[1]} ${hMatch[1]}"`)
  }
  return svg
}

function parseSvgDimensions(svg: string): { width: number; height: number } | null {
  // Try explicit numeric width/height attributes
  const wMatch = svg.match(/<svg[^>]*?\swidth="([\d.]+)"/)
  const hMatch = svg.match(/<svg[^>]*?\sheight="([\d.]+)"/)
  if (wMatch && hMatch) {
    return { width: parseFloat(wMatch[1]), height: parseFloat(hMatch[1]) }
  }
  // Try viewBox (3rd and 4th values are width and height; first two can be negative)
  const vb = svg.match(/viewBox="[^"]*?(-?[\d.]+)\s+(-?[\d.]+)\s+([\d.]+)\s+([\d.]+)"/)
  if (vb) {
    return { width: parseFloat(vb[3]), height: parseFloat(vb[4]) }
  }
  return null
}

/** Replace width/height in SVG tag to render at desired pixel size (vector!) */
function setSvgSize(svg: string, w: number, h: number): string {
  let result = ensureViewBox(svg)
  result = result.replace(/(<svg[^>]*?\s)width="[^"]*"/, `$1width="${w}"`)
  result = result.replace(/(<svg[^>]*?\s)height="[^"]*"/, `$1height="${h}"`)
  // also override any inline style width/height
  result = result.replace(
    /(<svg[^>]*?\s)style="[^"]*"/,
    `$1style="width:${w}px;height:${h}px"`,
  )
  return result
}

interface DiagramModalProps {
  svg: string
  dimensions: { width: number; height: number }
  onClose: () => void
}

function DiagramModal({ svg, dimensions, onClose }: DiagramModalProps) {
  const toolbarH = 38
  const margin = 40
  const pad = 60
  const winW = Math.min(dimensions.width + pad * 2, window.innerWidth - margin * 2)
  const winH = Math.min(dimensions.height + pad * 2 + toolbarH, window.innerHeight - margin * 2)
  const areaW = winW - pad * 2
  const areaH = winH - toolbarH - pad * 2

  const fitScale = Math.min(1, areaW / dimensions.width, areaH / dimensions.height)

  const [scale, setScale] = useState(fitScale)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const offsetStart = useRef({ x: 0, y: 0 })
  const areaRef = useRef<HTMLDivElement>(null)

  // Native wheel listener with { passive: false } so preventDefault() actually works
  useEffect(() => {
    const el = areaRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const factor = e.deltaY > 0 ? 0.97 : 1.03
      setScale(s => Math.min(5, Math.max(0.1, s * factor)))
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return
    e.preventDefault()
    setDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    offsetStart.current = { ...offset }
  }, [offset])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return
    setOffset({
      x: offsetStart.current.x + (e.clientX - dragStart.current.x),
      y: offsetStart.current.y + (e.clientY - dragStart.current.y),
    })
  }, [dragging])

  const handleMouseUp = useCallback(() => setDragging(false), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  // Vector-scale: change SVG width/height instead of CSS transform
  const scaledW = dimensions.width * scale
  const scaledH = dimensions.height * scale
  const scaledSvg = setSvgSize(svg, scaledW, scaledH)

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          width: winW,
          height: winH,
          maxWidth: `calc(100vw - ${margin}px)`,
          maxHeight: `calc(100vh - ${margin}px)`,
          borderRadius: 12,
          background: 'var(--clr-bg, #fff)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid var(--clr-border, #e0e0e0)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 4,
            padding: '4px 8px',
            height: toolbarH,
            borderBottom: '1px solid var(--clr-border, #e0e0e0)',
            background: 'var(--clr-bg-secondary, #f8f9fa)',
            flexShrink: 0,
          }}
        >
          <span style={{ marginRight: 'auto', fontSize: 12, color: 'var(--clr-text-muted, #999)', paddingLeft: 4 }}>
            {Math.round(scale * 100)}%
          </span>
          <button onClick={() => setScale(s => Math.min(5, s * 1.25))} style={modalBtnStyle} title="Zoom in">+</button>
          <button onClick={() => setScale(s => Math.max(0.1, s * 0.8))} style={modalBtnStyle} title="Zoom out">&minus;</button>
          <div style={{ width: 1, height: 20, background: 'var(--clr-border, #ddd)', margin: '0 2px' }} />
          <button onClick={onClose} style={{ ...modalBtnStyle, fontWeight: 700, fontSize: 16 }} title="Close">&times;</button>
        </div>

        {/* Diagram area */}
        <div
          ref={areaRef}
          style={{
            flex: 1,
            overflow: 'hidden',
            cursor: dragging ? 'grabbing' : 'grab',
            position: 'relative',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
              lineHeight: 0,
            }}
            dangerouslySetInnerHTML={{ __html: scaledSvg }}
          />
        </div>
      </div>
    </div>,
    document.body,
  )
}

const modalBtnStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 6,
  border: '1px solid var(--clr-border, #ddd)',
  background: 'var(--clr-bg, #fff)',
  color: 'var(--clr-text, #333)',
  fontSize: 14,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  lineHeight: 1,
}

interface MermaidDiagramProps {
  chart: string
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [modalOpen, setModalOpen] = useState(false)
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark-theme')

    if (!mermaidInitialized) {
      initMermaid(isDark)
    } else {
      mermaid.initialize(getMermaidConfig(isDark))
    }

    const render = async () => {
      const uniqueId = `mermaid-${Date.now()}-${++idCounter}`
      const container = getOffscreenContainer()
      try {
        let { svg: renderedSvg } = await mermaid.render(uniqueId, chart.trim(), container)
        if (isDark) {
          renderedSvg = fixDarkThemeSvg(renderedSvg)
        }
        setSvg(renderedSvg)
        setDimensions(parseSvgDimensions(renderedSvg))
        setError('')
      } catch (e) {
        // mermaid leaves broken SVG in the container after errors — clean up
        container.innerHTML = ''
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

  const inlineSvg = svg.replace(
    /(<svg[^>]*?)(?:\s+style="[^"]*")/,
    '$1 style="max-width:100%;height:auto"',
  )

  return (
    <>
      <div
        ref={containerRef}
        style={{
          margin: '1rem 0',
          overflow: 'auto',
          minHeight: svg ? undefined : 200,
          cursor: svg ? 'zoom-in' : undefined,
        }}
        onClick={() => svg && setModalOpen(true)}
        dangerouslySetInnerHTML={{ __html: inlineSvg }}
      />
      {modalOpen && dimensions && (
        <DiagramModal
          svg={svg}
          dimensions={dimensions}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}
