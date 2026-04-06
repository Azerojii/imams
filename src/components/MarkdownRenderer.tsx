'use client'

import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import Link from 'next/link'

interface MarkdownRendererProps {
  content: string
}

const PROSE_CLASSES = `prose prose-lg max-w-none
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
  prose-table:border-collapse prose-table:w-full prose-table:block prose-table:overflow-x-auto sm:prose-table:table
  prose-th:border prose-th:border-gray-300 prose-th:bg-gray-100 prose-th:px-3 prose-th:py-2
  prose-td:border prose-td:border-gray-300 prose-td:px-3 prose-td:py-2
  prose-img:rounded-lg prose-img:shadow-md prose-img:mx-auto prose-img:my-6 prose-img:max-w-full
  prose-em:text-center prose-em:block prose-em:text-sm prose-em:text-gray-600 prose-em:mt-2`

function isHtmlContent(content: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(content)
}

function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/&nbsp;/g, ' ')
    .replace(/[^\u0600-\u06FF\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

function stripTags(value: string): string {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

function processWikiLinks(content: string): string {
  if (isHtmlContent(content)) {
    return content.replace(/\[\[(.*?)\]\]/g, (_, articleName: string) => {
      const trimmedName = articleName.trim()
      const slug = trimmedName.replace(/\s+/g, '_')
      return `<a href="/wiki/${slug}">${trimmedName}</a>`
    })
  }

  return content.replace(/\[\[(.*?)\]\]/g, (_, articleName: string) => {
    const trimmedName = articleName.trim()
    const slug = trimmedName.replace(/\s+/g, '_')
    return `[${trimmedName}](/wiki/${slug})`
  })
}

function processHtmlContent(content: string): string {
  return processWikiLinks(content)
    .replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_, level: string, attrs: string, inner: string) => {
      if (/\sid\s*=\s*['"][^'"]+['"]/i.test(attrs)) {
        return `<h${level}${attrs}>${inner}</h${level}>`
      }

      const id = slugifyHeading(stripTags(inner))
      return `<h${level}${attrs} id="${id}">${inner}</h${level}>`
    })
    .replace(/<a([^>]*)href="(https?:\/\/[^"]+)"([^>]*)>/gi, (match: string, before: string, href: string, after: string) => {
      const attrs = `${before}${after}`
      if (/target=/i.test(attrs)) {
        return `<a${before}href="${href}"${after}>`
      }

      return `<a${before}href="${href}" target="_blank" rel="noopener noreferrer"${after}>`
    })
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const processedContent = useMemo(() => {
    if (!content) return ''
    return isHtmlContent(content) ? processHtmlContent(content) : processWikiLinks(content)
  }, [content])

  if (isHtmlContent(processedContent)) {
    return (
      <div className={`${PROSE_CLASSES} quill-content`} dangerouslySetInnerHTML={{ __html: processedContent }} />
    )
  }

  return (
    <>
      <div className={PROSE_CLASSES}>
      <ReactMarkdown
        remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
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
        {processedContent}
      </ReactMarkdown>
      </div>
      <style jsx global>{`
        .quill-content {
          direction: rtl;
        }

        .quill-content .ql-align-center {
          text-align: center;
        }

        .quill-content .ql-align-left {
          text-align: left;
        }

        .quill-content .ql-align-right {
          text-align: right;
        }

        .quill-content blockquote {
          border-right: 4px solid #d1d5db;
          border-left: none;
          padding-right: 1rem;
          padding-left: 0;
        }

        .quill-content img {
          display: block;
          max-width: 100%;
          height: auto;
          margin: 1.5rem auto;
          border-radius: 0.5rem;
          box-shadow: 0 10px 20px rgba(15, 23, 42, 0.12);
        }

        .quill-content .cite-ref a {
          color: #067782;
          text-decoration: none;
        }
      `}</style>
    </>
  )
}
