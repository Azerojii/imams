'use client'

import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Fuse from 'fuse.js'

interface Article {
  slug: string
  title: string
  description: string
  category: string
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Article[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [fuse, setFuse] = useState<Fuse<Article> | null>(null)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/search')
      .then((res) => res.json())
      .then((data) => {
        const articleData: Article[] = data.results || data
        setArticles(articleData)

        const fuseInstance = new Fuse<Article>(articleData, {
          keys: ['title', 'description', 'category'],
          threshold: 0.4,
          includeScore: true,
        })
        setFuse(fuseInstance)
      })
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.trim() === '') {
      setResults([])
      setIsOpen(false)
      return
    }

    if (fuse) {
      const searchResults = fuse.search(query).slice(0, 5)
      setResults(searchResults.map((result) => result.item))
      setIsOpen(true)
    }
  }, [query, fuse])

  const handleSelect = (slug: string) => {
    router.push(`/wiki/${slug}`)
    setQuery('')
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && results.length > 0) {
      handleSelect(results[0].slug)
    }
  }

  const categoryLabel = (cat: string) => {
    return cat === 'أئمة' ? 'إمام' : cat === 'مساجد' ? 'مسجد' : cat
  }

  return (
    <div ref={searchRef} className="relative w-full md:w-64">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ابحث عن إمام أو مسجد..."
          className="w-full px-4 py-2.5 pl-10 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:bg-white/20 focus:border-accent text-base sm:text-sm"
        />
        <Search className="absolute left-3 top-3 sm:top-2.5 text-white/50" size={18} />
      </div>

      {isOpen && query.trim() !== '' && (
        <div className="absolute top-full mt-1 w-full bg-white border border-border-light rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            results.map((article) => (
              <button
                key={article.slug}
                onClick={() => handleSelect(article.slug)}
                className="w-full text-right px-4 py-3 hover:bg-bg-main border-b border-border-light last:border-0 transition-colors"
              >
                <div className="font-semibold text-primary">{article.title}</div>
                <div className="text-sm text-text-secondary line-clamp-1">{article.description}</div>
                <div className="text-xs text-accent-dark mt-1">{categoryLabel(article.category)}</div>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-text-secondary text-center">
              <div>لا توجد نتائج لـ &quot;{query}&quot;</div>
              <button
                onClick={() => {
                  router.push(`/submit?title=${encodeURIComponent(query)}`)
                  setQuery('')
                  setIsOpen(false)
                }}
                className="mt-2 text-primary hover:underline font-medium"
              >
                أضف مقالاً جديداً
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
