import Link from 'next/link'
import AddArticleCTA from '@/components/AddArticleCTA'
import ArticleListCard from '@/components/ArticleListCard'
import HijabiWomanIcon from '@/components/HijabiWomanIcon'
import PaginationControls from '@/components/PaginationControls'
import WikiHeader from '@/components/WikiHeader'
import WilayaFilter from '@/components/WilayaFilter'
import { getMourshibat, getViewCountsBySlugs } from '@/lib/wiki'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 10

export default async function MourshidatPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; wilaya?: string; q?: string }>
}) {
  const params = (await searchParams) || {}
  const pageValue = Number.parseInt(params.page || '1', 10)
  const selectedWilaya = params.wilaya || ''
  const searchQuery = params.q || ''

  const mourshidat = await getMourshibat()
  const sortedMourshidat = [...mourshidat].sort((a, b) => a.title.localeCompare(b.title, 'ar'))
  const viewCounts = await getViewCountsBySlugs(sortedMourshidat.map(i => i.slug))
  const enrichedMourshidat = sortedMourshidat.map(i => ({ ...i, viewCount: viewCounts[i.slug] || 0 }))

  const wilayas = Array.from(new Set(enrichedMourshidat.map(m => m.wilaya).filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b, 'ar'))
  const filtered = enrichedMourshidat
    .filter(m => !selectedWilaya || m.wilaya === selectedWilaya)
    .filter(m => !searchQuery || m.title.includes(searchQuery))

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Number.isFinite(pageValue)
    ? Math.min(Math.max(pageValue, 1), totalPages)
    : 1

  const startIndex = (currentPage - 1) * PAGE_SIZE
  const paginatedMourshidat = filtered.slice(startIndex, startIndex + PAGE_SIZE)

  return (
    <div className="min-h-screen bg-bg-main">
      <WikiHeader />

      <div className="mx-auto max-w-[1500px]">
        <main className="px-4 py-4 md:px-6">
          <h1 className="mb-2 flex items-center gap-3 border-b-2 border-border-light pb-2 text-2xl font-heading font-bold text-primary md:text-4xl">
            <HijabiWomanIcon size={32} />
            المرشدات الدينيات
          </h1>
          <p className="mb-4 text-text-secondary">{mourshidat.length} مرشدة دينية في الموسوعة</p>

          <AddArticleCTA articleType="mourshida" />

          <WilayaFilter wilayas={wilayas} selectedWilaya={selectedWilaya} searchQuery={searchQuery} />

          {filtered.length === 0 ? (
            <div className="py-16 text-center text-text-secondary">
              <HijabiWomanIcon size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">لا توجد نتائج.</p>
              {selectedWilaya && (
                <Link href="/mourshidat" className="mt-2 inline-block text-primary hover:underline">
                  عرض الكل
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="mb-4 text-xs text-text-secondary">
                عرض {startIndex + 1} - {Math.min(startIndex + PAGE_SIZE, filtered.length)} من {filtered.length}
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {paginatedMourshidat.map(article => (
                  <ArticleListCard key={article.slug} article={article} />
                ))}
              </div>
              <PaginationControls
                basePath={`/mourshidat?${new URLSearchParams({ ...(selectedWilaya && { wilaya: selectedWilaya }), ...(searchQuery && { q: searchQuery }) }).toString()}`.replace(/\?$/, '')}
                currentPage={currentPage}
                totalPages={totalPages}
              />
            </>
          )}
        </main>
      </div>
    </div>
  )
}
