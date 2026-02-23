'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import Link from 'next/link'

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-lg max-w-none
      prose-headings:font-serif prose-headings:border-b prose-headings:border-gray-200 prose-headings:pb-1 prose-headings:mb-3
      prose-h2:text-2xl prose-h2:mt-8
      prose-h3:text-xl prose-h3:mt-6
      prose-p:mb-4 prose-p:leading-relaxed
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline visited:prose-a:text-primary
      prose-ul:my-4 prose-ol:my-4
      prose-li:my-1
      prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-gray-100 prose-pre:border prose-pre:border-gray-300
      prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic
      prose-table:border-collapse prose-table:w-full
      prose-th:border prose-th:border-gray-300 prose-th:bg-gray-100 prose-th:px-3 prose-th:py-2
      prose-td:border prose-td:border-gray-300 prose-td:px-3 prose-td:py-2
      prose-img:rounded-lg prose-img:shadow-md prose-img:mx-auto prose-img:my-6 prose-img:max-w-full
      prose-em:text-center prose-em:block prose-em:text-sm prose-em:text-gray-600 prose-em:mt-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
        img: ({ node, src, alt, ...props }) => {
          if (!src) return null
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt || 'Image'}
              className="rounded-lg shadow-md mx-auto my-6 max-w-full"
              {...props}
            />
          )
        },
        a: ({ node, href, children, ...props }) => {
          if (href?.startsWith('/wiki/')) {
            return (
              <Link href={href} className="text-primary no-underline hover:underline">
                {children}
              </Link>
            )
          }
          // Footnote back-references
          if (href?.startsWith('#')) {
            return (
              <a href={href} className="text-primary no-underline hover:underline" {...props}>
                {children}
              </a>
            )
          }
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
              {children}
            </a>
          )
        },
        h2: ({ node, children, ...props }) => {
          const text = String(children)
          const id = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
          return <h2 id={id} {...props}>{children}</h2>
        },
        h3: ({ node, children, ...props }) => {
          const text = String(children)
          const id = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
          return <h3 id={id} {...props}>{children}</h3>
        },
        // Style the footnotes section
        section: ({ node, children, ...props }) => {
          const className = (props as any).className || ''
          if (className.includes('footnotes')) {
            return (
              <section className="footnotes border-t border-border-light mt-8 pt-4 text-sm" {...props}>
                <h2 className="text-lg font-heading font-bold text-primary mb-2 border-b-0">الهوامش</h2>
                {children}
              </section>
            )
          }
          return <section {...props}>{children}</section>
        },
      }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
