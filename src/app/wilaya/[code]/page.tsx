import Link from 'next/link'
import { MapPin } from 'lucide-react'
import ArticleListCard from '@/components/ArticleListCard'
import PaginationControls from '@/components/PaginationControls'
import WikiHeader from '@/components/WikiHeader'
import WikiSidebar from '@/components/WikiSidebar'
import { getArticlesByWilaya } from '@/lib/wiki'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 10

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const wilayaName = decodeURIComponent(code)
  return {
    title: `${wilayaName} - موسوعة أئمة ومساجد الجزائر`,
  }
}

export default async function WilayaPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>
  searchParams?: Promise<{ page?: string }>
}) {
  const { code } = await params
  const query = (await searchParams) || {}
  const pageValue = Number.parseInt(query.page || '1', 10)

  const wilayaName = decodeURIComponent(code)
  const articles = await getArticlesByWilaya(wilayaName)
  const sortedArticles = [...articles].sort((a, b) => a.title.localeCompare(b.title, 'ar'))
  const totalPages = Math.max(1, Math.ceil(sortedArticles.length / PAGE_SIZE))
  const currentPage = Number.isFinite(pageValue)
    ? Math.min(Math.max(pageValue, 1), totalPages)
    : 1

  const startIndex = (currentPage - 1) * PAGE_SIZE
  const paginatedArticles = sortedArticles.slice(startIndex, startIndex + PAGE_SIZE)

  const stats = {
    imam: articles.filter(a => a.articleType === 'imam').length,
    mosque: articles.filter(a => a.articleType === 'mosque').length,
    quranTeacher: articles.filter(a => a.articleType === 'quran_teacher').length,
    mourshida: articles.filter(a => a.articleType === 'mourshida').length,
  }

  return (
    <div className="min-h-screen bg-bg-main">
      <WikiHeader />

      <div className="flex max-w-[1400px] mx-auto">
        <WikiSidebar />

        <main className="flex-1 px-4 md:px-6 py-4 max-w-[960px]">
          <div className="text-sm text-text-secondary mb-4 flex items-center gap-2">
            <Link href="/" className="text-primary hover:underline">الرئيسية</Link>
            <span className="text-border">‹</span>
            <span className="text-text-primary flex items-center gap-1">
              <MapPin size={12} />
              {wilayaName}
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-heading font-bold text-primary border-b-2 border-border-light pb-2 mb-2 flex items-center gap-3">
            <MapPin size={32} className="text-accent" />
            {wilayaName}
          </h1>

          <p className="text-text-secondary mb-4">
            {articles.length} مقال
            {` (${stats.imam} إمام، ${stats.mosque} مسجد`}
            {stats.quranTeacher > 0 ? `، ${stats.quranTeacher} معلم قرآن` : ''}
            {stats.mourshida > 0 ? `، ${stats.mourshida} مرشدة دينية` : ''}
            {')'}
          </p>

          {articles.length === 0 ? (
            <div className="text-center py-16 text-text-secondary">
              <MapPin size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">لا توجد مقالات لهذه الولاية بعد.</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-xs text-text-secondary">
                عرض {startIndex + 1} - {Math.min(startIndex + PAGE_SIZE, sortedArticles.length)} من {sortedArticles.length}
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {paginatedArticles.map(article => (
                  <ArticleListCard key={article.slug} article={article} />
                ))}
              </div>
              <PaginationControls
                basePath={`/wilaya/${encodeURIComponent(wilayaName)}`}
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
