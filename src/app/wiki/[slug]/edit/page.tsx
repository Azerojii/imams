'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import WikiHeader from '@/components/WikiHeader'
import WikiSidebar from '@/components/WikiSidebar'
import ArticleForm from '@/components/ArticleForm'
import { Loader2 } from 'lucide-react'
import type { WikiArticle } from '@/lib/wiki'

export default function EditArticlePage() {
  const params = useParams()
  const slug = params.slug as string

  const [article, setArticle] = useState<WikiArticle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/articles/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        setArticle(data)
      })
      .catch(err => setError(err.message || 'فشل في تحميل المقال'))
      .finally(() => setIsLoading(false))
  }, [slug])

  return (
    <div className="min-h-screen bg-bg-main">
      <WikiHeader />

      <div className="flex max-w-[1400px] mx-auto">
        <WikiSidebar />

        <main className="flex-1 px-4 md:px-6 py-4 max-w-[860px]">
          <h1 className="text-3xl font-heading font-bold text-primary border-b-2 border-border-light pb-2 mb-6">
            تعديل المقال
          </h1>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[40vh]">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : article ? (
            <ArticleForm mode="edit" initialData={article} slug={slug} />
          ) : null}
        </main>
      </div>
    </div>
  )
}
