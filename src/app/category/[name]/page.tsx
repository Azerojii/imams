import Link from 'next/link'
import { UserCircle, Landmark } from 'lucide-react'
import WikiHeader from '@/components/WikiHeader'
import WikiSidebar from '@/components/WikiSidebar'
import { getAllWikiMetadata } from '@/lib/wiki'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const categoryName = decodeURIComponent(name)
  const allArticles = await getAllWikiMetadata()
  const categoryArticles = allArticles.filter(article => article.category === categoryName)

  const isImamCategory = categoryName === 'أئمة'

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
            {isImamCategory ? <UserCircle size={32} /> : <Landmark size={32} />}
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
                  <h3 className="text-lg font-bold text-primary">{article.title}</h3>
                  <p className="text-sm text-text-secondary mt-1">{article.description}</p>
                  {article.wilaya && (
                    <span className="text-xs text-accent-dark mt-2 inline-block">{article.wilaya}</span>
                  )}
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
