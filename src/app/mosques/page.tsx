import Link from 'next/link'
import MosqueIcon from '@/components/MosqueIcon'
import AddArticleCTA from '@/components/AddArticleCTA'
import ArticleListCard from '@/components/ArticleListCard'
import PaginationControls from '@/components/PaginationControls'
import WikiHeader from '@/components/WikiHeader'
import WilayaFilter from '@/components/WilayaFilter'
import { getMosques, getViewCountsBySlugs } from '@/lib/wiki'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 10

export default async function MosquesPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; wilaya?: string; q?: string }>
}) {
  const params = (await searchParams) || {}
  const pageValue = Number.parseInt(params.page || '1', 10)
  const selectedWilaya = params.wilaya || ''
  const searchQuery = params.q || ''

  const mosques = await getMosques()
  const sortedMosques = [...mosques].sort((a, b) => a.title.localeCompare(b.title, 'ar'))
  const viewCounts = await getViewCountsBySlugs(sortedMosques.map(i => i.slug))
  const enrichedMosques = sortedMosques.map(i => ({ ...i, viewCount: viewCounts[i.slug] || 0 }))

  const wilayas = Array.from(new Set(enrichedMosques.map(m => m.wilaya).filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b, 'ar'))
  const filtered = enrichedMosques
    .filter(m => !selectedWilaya || m.wilaya === selectedWilaya)
    .filter(m => !searchQuery || m.title.includes(searchQuery))

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Number.isFinite(pageValue)
    ? Math.min(Math.max(pageValue, 1), totalPages)
    : 1

  const startIndex = (currentPage - 1) * PAGE_SIZE
  const paginatedMosques = filtered.slice(startIndex, startIndex + PAGE_SIZE)

  return (
    <div className="min-h-screen bg-bg-main">
      <WikiHeader />

      <div className="mx-auto max-w-[1500px]">
        <main className="px-4 py-4 md:px-6">
          <h1 className="mb-2 flex items-center gap-3 border-b-2 border-border-light pb-2 text-2xl font-heading font-bold text-primary md:text-4xl">
            <MosqueIcon size={32} />
            المساجد
          </h1>
          <p className="mb-4 text-text-secondary">{mosques.length} مسجد في الموسوعة</p>

          <AddArticleCTA articleType="mosque" />

          <WilayaFilter wilayas={wilayas} selectedWilaya={selectedWilaya} searchQuery={searchQuery} />

          {filtered.length === 0 ? (
            <div className="py-16 text-center text-text-secondary">
              <MosqueIcon size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">لا توجد نتائج.</p>
              {selectedWilaya && (
                <Link href="/mosques" className="mt-2 inline-block text-primary hover:underline">
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
                {paginatedMosques.map(mosque => (
                  <ArticleListCard key={mosque.slug} article={mosque} />
                ))}
              </div>
              <PaginationControls
                basePath={`/mosques?${new URLSearchParams({ ...(selectedWilaya && { wilaya: selectedWilaya }), ...(searchQuery && { q: searchQuery }) }).toString()}`.replace(/\?$/, '')}
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
