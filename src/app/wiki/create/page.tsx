'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import WikiHeader from '@/components/WikiHeader'
import WikiSidebar from '@/components/WikiSidebar'
import ArticleForm from '@/components/ArticleForm'
import { Loader2 } from 'lucide-react'

function CreateContent() {
  const searchParams = useSearchParams()
  const initialTitle = searchParams.get('title') || ''

  return (
    <div className="min-h-screen bg-bg-main">
      <WikiHeader />

      <div className="flex max-w-[1400px] mx-auto">
        <WikiSidebar />

        <main className="flex-1 px-4 md:px-6 py-4 max-w-[860px]">
          <h1 className="text-4xl font-heading font-bold text-primary border-b-2 border-border-light pb-2 mb-6">
            إنشاء مقال جديد
          </h1>

          <ArticleForm mode="create" initialTitle={initialTitle} />
        </main>
      </div>
    </div>
  )
}

export default function CreateArticlePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-main">
        <WikiHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </div>
    }>
      <CreateContent />
    </Suspense>
  )
}
