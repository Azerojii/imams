'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface WikiMetadata {
  slug: string
  title: string
  description: string
  category: string
  lastUpdated?: string
}

interface AllArticlesListProps {
  articles: WikiMetadata[]
}

const INITIAL_DISPLAY = 10

export default function AllArticlesList({ articles }: AllArticlesListProps) {
  const [showAll, setShowAll] = useState(false)
  const displayedArticles = showAll ? articles : articles.slice(0, INITIAL_DISPLAY)

  if (articles.length === 0) {
    return null
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-serif font-bold mb-4">Tous les articles</h2>
      <div className="bg-wiki-bg border border-wiki-border rounded-lg p-6">
        <div className="space-y-3">
          {displayedArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/wiki/${article.slug}`}
              className="block p-4 rounded hover:bg-gray-100 transition border-b border-gray-200 last:border-b-0"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-primary hover:underline">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{article.description}</p>
                </div>
                <span className="text-xs text-gray-500 ml-4 flex-shrink-0 mt-1">
                  {article.category}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {articles.length > INITIAL_DISPLAY && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition"
            >
              {showAll ? (
                <>
                  <ChevronUp size={20} />
                  Voir moins
                </>
              ) : (
                <>
                  <ChevronDown size={20} />
                  Voir plus ({articles.length - INITIAL_DISPLAY} articles restants)
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
