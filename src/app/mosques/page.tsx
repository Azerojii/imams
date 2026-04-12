import Link from 'next/link'
import { Landmark } from 'lucide-react'
import ArticleListCard from '@/components/ArticleListCard'
import PaginationControls from '@/components/PaginationControls'
import WikiHeader from '@/components/WikiHeader'
import { getMosques } from '@/lib/wiki'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 10

export default async function MosquesPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>
}) {
  const params = (await searchParams) || {}
  const pageValue = Number.parseInt(params.page || '1', 10)

  const mosques = await getMosques()
  const sortedMosques = [...mosques].sort((a, b) => a.title.localeCompare(b.title, 'ar'))
  const totalPages = Math.max(1, Math.ceil(sortedMosques.length / PAGE_SIZE))
  const currentPage = Number.isFinite(pageValue)
    ? Math.min(Math.max(pageValue, 1), totalPages)
    : 1

  const startIndex = (currentPage - 1) * PAGE_SIZE
  const paginatedMosques = sortedMosques.slice(startIndex, startIndex + PAGE_SIZE)

  return (
    <div className="min-h-screen bg-bg-main">
      <WikiHeader />

      <div className="mx-auto max-w-[1500px]">
        <main className="px-4 py-4 md:px-6">
          <h1 className="mb-2 flex items-center gap-3 border-b-2 border-border-light pb-2 text-2xl font-heading font-bold text-primary md:text-4xl">
            <Landmark size={32} />
            المساجد
          </h1>
          <p className="mb-6 text-text-secondary">{mosques.length} مسجد في الموسوعة</p>

          {mosques.length === 0 ? (
            <div className="py-16 text-center text-text-secondary">
              <Landmark size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">لا توجد مقالات عن مساجد بعد.</p>
              <Link href="/submit" className="mt-2 inline-block text-primary hover:underline">
                كن أول من يضيف مقالاً
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-4 text-xs text-text-secondary">
                عرض {startIndex + 1} - {Math.min(startIndex + PAGE_SIZE, sortedMosques.length)} من {sortedMosques.length}
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {paginatedMosques.map(mosque => (
                  <ArticleListCard key={mosque.slug} article={mosque} />
                ))}
              </div>
              <PaginationControls basePath="/mosques" currentPage={currentPage} totalPages={totalPages} />
            </>
          )}
        </main>
      </div>
    </div>
  )
}
