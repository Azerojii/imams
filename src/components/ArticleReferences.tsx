'use client'

import { useMemo } from 'react'
import MarkdownRenderer from './MarkdownRenderer'
import type { Reference } from '@/lib/wiki'

interface ArticleReferencesProps {
  content: string
  references?: Reference[] | null
}

export default function ArticleReferences({ content, references }: ArticleReferencesProps) {
  const { processedContent, orderedRefs } = useMemo(() => {
    if (!references || references.length === 0) {
      return { processedContent: content, orderedRefs: [] }
    }

    // Build ordered list by first appearance in content
    const refOrder: Reference[] = []
    const refIndexMap = new Map<string, number>()

    const markerRegex = /data-ref-id="([^"]+)"/g
    let match
    while ((match = markerRegex.exec(content)) !== null) {
      const refId = match[1]
      if (!refIndexMap.has(refId)) {
        const ref = references.find(r => r.id === refId)
        if (ref) {
          refIndexMap.set(refId, refOrder.length + 1)
          refOrder.push(ref)
        }
      }
    }

    // Add any references not cited in text at the end
    for (const ref of references) {
      if (!refIndexMap.has(ref.id)) {
        refIndexMap.set(ref.id, refOrder.length + 1)
        refOrder.push(ref)
      }
    }

    // Replace cite-ref markers with numbered links
    const processed = content.replace(
      /<sup class="cite-ref" data-ref-id="([^"]+)">\[\d+\]<\/sup>/g,
      (_, refId) => {
        const num = refIndexMap.get(refId)
        if (!num) return ''
        return `<sup class="cite-ref" id="cite-${num}"><a href="#ref-${num}" style="color: #067782; text-decoration: none;" title="${refOrder[num - 1]?.title || ''}">[${num}]</a></sup>`
      }
    )

    return { processedContent: processed, orderedRefs: refOrder }
  }, [content, references])

  return (
    <>
      <MarkdownRenderer content={processedContent} />

      {orderedRefs.length > 0 && (
        <div className="mt-10 pt-5 border-t border-border-light">
          <h2 className="text-2xl font-heading font-bold border-b border-border-light pb-1 mb-4" id="references">
            المراجع
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-text-secondary">
            {orderedRefs.map((ref, index) => {
              const num = index + 1
              return (
                <li key={ref.id} id={`ref-${num}`} className="leading-relaxed">
                  <a href={`#cite-${num}`} className="text-primary hover:underline ml-1" title="العودة إلى النص">↑</a>
                  {ref.author && <span>{ref.author}، </span>}
                  {ref.url ? (
                    <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                      {ref.title}
                    </a>
                  ) : (
                    <span className="font-medium">{ref.title}</span>
                  )}
                  {ref.publisher && <span>، {ref.publisher}</span>}
                  {ref.year && <span>، {ref.year}</span>}
                  {ref.accessDate && <span className="text-text-secondary"> (تاريخ الوصول: {ref.accessDate})</span>}
                </li>
              )
            })}
          </ol>
        </div>
      )}
    </>
  )
}
