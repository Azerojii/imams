import Link from 'next/link'
import { UserCircle, Landmark, BookOpen } from 'lucide-react'
import HijabiWomanIcon from '@/components/HijabiWomanIcon'
import WikiHeader from '@/components/WikiHeader'
import WikiSidebar from '@/components/WikiSidebar'
import { getAllWikiMetadata } from '@/lib/wiki'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function getTypeIcon(type: string) {
  switch (type) {
    case 'imam': return <UserCircle size={14} className="text-accent-dark" />
    case 'mosque': return <Landmark size={14} className="text-accent-dark" />
    case 'quran_teacher': return <BookOpen size={14} className="text-accent-dark" />
    case 'mourshida': return <HijabiWomanIcon size={14} className="text-accent-dark" />
    default: return <UserCircle size={14} className="text-accent-dark" />
  }
}

function getTypeLabel(type: string) {
  switch (type) {
    case 'imam': return 'إمام'
    case 'mosque': return 'مسجد'
    case 'quran_teacher': return 'معلم قرآن'
    case 'mourshida': return 'مرشدة دينية'
    default: return type
  }
}

function getCategoryIcon(categoryName: string) {
  switch (categoryName) {
    case 'أئمة': return <UserCircle size={32} />
    case 'مساجد': return <Landmark size={32} />
    case 'معلمو القرآن': return <BookOpen size={32} />
    case 'مرشدات': return <HijabiWomanIcon size={32} />
    default: return <UserCircle size={32} />
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const categoryName = decodeURIComponent(name)
  const allArticles = await getAllWikiMetadata()
  const categoryArticles = allArticles.filter(article => article.category === categoryName)

  return (
    <div className="min-h-screen bg-bg-main">
      <WikiHeader />

      <div className="flex max-w-[1400px] mx-auto">
        <WikiSidebar />

        <main className="flex-1 px-4 md:px-6 py-4 max-w-[960px]">
          <div className="text-sm text-text-secondary mb-4 flex items-center gap-2">
            <Link href="/" className="text-primary hover:underline">الرئيسية</Link>
            <span className="text-border">‹</span>
            <span className="text-text-primary">{categoryName}</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-heading font-bold text-primary border-b-2 border-border-light pb-2 mb-2 flex items-center gap-3">
            {getCategoryIcon(categoryName)}
            {categoryName}
          </h1>
          <p className="text-text-secondary mb-6">{categoryArticles.length} مقال في هذا التصنيف</p>

          {categoryArticles.length > 0 ? (
            <div className="space-y-3">
              {categoryArticles.map(article => (
                <Link
                  key={article.slug}
                  href={`/wiki/${article.slug}`}
                  className="card-islamic block rounded-lg p-5 hover:no-underline"
                >
                  <div className="flex gap-3">
                    {article.imageSrc && (
                      <img
                        src={article.imageSrc}
                        alt={article.title}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-border-light"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {getTypeIcon(article.articleType)}
                        <span className="text-xs text-accent-dark font-semibold">
                          {getTypeLabel(article.articleType)}
                        </span>
                        {article.wilaya && (
                          <>
                            <span className="text-border">|</span>
                            <span className="text-xs text-text-secondary">{article.wilaya}</span>
                          </>
                        )}
                        <span className="text-xs text-text-secondary mr-auto sm:mr-0">
                          {article.lastUpdated}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-primary">{article.title}</h3>
                      <p className="text-sm text-text-secondary mt-1 line-clamp-2">{article.description}</p>
                      {article.authorName && (
                        <p className="text-xs text-accent-dark mt-1">بقلم: {article.authorName}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-text-secondary">
              <p>لا توجد مقالات في هذا التصنيف.</p>
            </div>
          )}

          <div className="mt-8">
            <Link href="/" className="text-primary hover:underline text-sm">
              → العودة إلى الرئيسية
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
