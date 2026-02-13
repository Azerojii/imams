'use client'

import { TocItem } from '@/lib/wiki'

interface TableOfContentsProps {
  items: TocItem[]
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length === 0) return null

  return (
    <div className="bg-bg-sidebar border border-border-light rounded p-4 mb-4 mt-4">
      <h2 className="text-lg font-heading font-bold mb-3 pb-2 border-b border-border-light text-primary">المحتويات</h2>
      <nav>
        <ul className="space-y-1 text-sm">
          {items.map((item, index) => (
            <li key={index} className={item.level === 3 ? 'mr-4' : ''}>
              <a
                href={`#${item.slug}`}
                className="text-primary hover:underline block py-0.5"
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
