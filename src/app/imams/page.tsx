import Link from 'next/link'
import { UserCircle } from 'lucide-react'
import ArticleListCard from '@/components/ArticleListCard'
import PaginationControls from '@/components/PaginationControls'
import WikiHeader from '@/components/WikiHeader'
import { getImams, getViewCountsBySlugs } from '@/lib/wiki'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 10

export default async function ImamsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>
}) {
  const params = (await searchParams) || {}
  const pageValue = Number.parseInt(params.page || '1', 10)

  const imams = await getImams()
  const sortedImams = [...imams].sort((a, b) => a.title.localeCompare(b.title, 'ar'))
  const viewCounts = await getViewCountsBySlugs(sortedImams.map(i => i.slug))
  const enrichedImams = sortedImams.map(i => ({ ...i, viewCount: viewCounts[i.slug] || 0 }))
  const totalPages = Math.max(1, Math.ceil(enrichedImams.length / PAGE_SIZE))
  const currentPage = Number.isFinite(pageValue)
    ? Math.min(Math.max(pageValue, 1), totalPages)
    : 1

  const startIndex = (currentPage - 1) * PAGE_SIZE
  const paginatedImams = enrichedImams.slice(startIndex, startIndex + PAGE_SIZE)

  return (
    <div className="min-h-screen bg-bg-main">
      <WikiHeader />

      <div className="mx-auto max-w-[1500px]">
        <main className="px-4 py-4 md:px-6">
          <h1 className="mb-2 flex items-center gap-3 border-b-2 border-border-light pb-2 text-2xl font-heading font-bold text-primary md:text-4xl">
            <UserCircle size={32} />
            الأئمة
          </h1>
          <p className="mb-6 text-text-secondary">{imams.length} إمام في الموسوعة</p>

          {imams.length === 0 ? (
            <div className="py-16 text-center text-text-secondary">
              <UserCircle size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">لا توجد مقالات عن أئمة بعد.</p>
              <Link href="/submit" className="mt-2 inline-block text-primary hover:underline">
                كن أول من يضيف مقالاً
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-4 text-xs text-text-secondary">
                عرض {startIndex + 1} - {Math.min(startIndex + PAGE_SIZE, enrichedImams.length)} من {enrichedImams.length}
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {paginatedImams.map(imam => (
                  <ArticleListCard key={imam.slug} article={imam} />
                ))}
              </div>
              <PaginationControls basePath="/imams" currentPage={currentPage} totalPages={totalPages} />
            </>
          )}
        </main>
      </div>
    </div>
  )
}
