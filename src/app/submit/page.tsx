'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import WikiHeader from '@/components/WikiHeader'
import WikiSidebar from '@/components/WikiSidebar'
import ArticleForm from '@/components/ArticleForm'
import { Info, Loader2 } from 'lucide-react'

function SubmitContent() {
  const searchParams = useSearchParams()
  const initialTitle = searchParams.get('title') || ''

  return (
    <div className="min-h-screen bg-bg-main">
      <WikiHeader />

      <div className="flex max-w-[1400px] mx-auto">
        <WikiSidebar />

        <main className="flex-1 px-6 py-4 max-w-[860px]">
          <h1 className="text-4xl font-heading font-bold text-primary border-b-2 border-border-light pb-2 mb-6">
            تقديم مقال
          </h1>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6 flex gap-3">
            <Info className="text-primary flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-primary-dark">
              <p className="font-semibold mb-1">تقديم عام</p>
              <p>
                سيتم مراجعة مقالك من قبل الإدارة قبل نشره على الموسوعة.
              </p>
            </div>
          </div>

          <ArticleForm mode="submit" initialTitle={initialTitle} />
        </main>
      </div>
    </div>
  )
}

export default function SubmitArticlePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-main">
        <WikiHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </div>
    }>
      <SubmitContent />
    </Suspense>
  )
}
