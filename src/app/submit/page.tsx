'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import WikiHeader from '@/components/WikiHeader'
import ArticleForm from '@/components/ArticleForm'
import { Info, Loader2 } from 'lucide-react'

function SubmitContent() {
  const searchParams = useSearchParams()
  const initialTitle = searchParams.get('title') || ''
  const typeParam = searchParams.get('type')
  const allowed = ['imam', 'mosque', 'quran_teacher', 'mourshida'] as const
  const initialArticleType = (allowed as readonly string[]).includes(typeParam ?? '')
    ? (typeParam as typeof allowed[number])
    : undefined

  return (
    <div className="min-h-screen bg-bg-main">
      <WikiHeader />

      <div className="mx-auto max-w-[1500px]">
        <main className="px-4 py-4 md:px-6">
          <h1 className="text-2xl md:text-4xl font-heading font-bold text-primary border-b-2 border-border-light pb-2 mb-6">
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

          <ArticleForm mode="submit" initialTitle={initialTitle} initialArticleType={initialArticleType} />
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
