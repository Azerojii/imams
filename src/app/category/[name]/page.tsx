import Link from 'next/link'
import { BookOpen, Landmark, UserCircle } from 'lucide-react'
import ArticleListCard from '@/components/ArticleListCard'
import HijabiWomanIcon from '@/components/HijabiWomanIcon'
import WikiHeader from '@/components/WikiHeader'
import { getAllWikiMetadata } from '@/lib/wiki'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function getCategoryIcon(categoryName: string) {
  switch (categoryName) {
    case 'أئمة':
      return <UserCircle size={32} />
    case 'مساجد':
      return <Landmark size={32} />
    case 'معلمو القرآن':
      return <BookOpen size={32} />
    case 'مرشدات':
      return <HijabiWomanIcon size={32} />
    default:
      return <UserCircle size={32} />
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

      <div className="mx-auto max-w-[1500px]">
        <main className="px-4 py-4 md:px-6">
          <div className="mb-4 flex items-center gap-2 text-sm text-text-secondary">
            <Link href="/" className="text-primary hover:underline">
              الرئيسية
            </Link>
            <span className="text-border">‹</span>
            <span className="text-text-primary">{categoryName}</span>
          </div>

          <h1 className="mb-2 flex items-center gap-3 border-b-2 border-border-light pb-2 text-2xl font-heading font-bold text-primary md:text-4xl">
            {getCategoryIcon(categoryName)}
            {categoryName}
          </h1>
          <p className="mb-6 text-text-secondary">{categoryArticles.length} مقال في هذا التصنيف</p>

          {categoryArticles.length > 0 ? (
            <div className="space-y-3">
              {categoryArticles.map(article => (
                <ArticleListCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-text-secondary">
              <p>لا توجد مقالات في هذا التصنيف.</p>
            </div>
          )}

          <div className="mt-8">
            <Link href="/" className="text-sm text-primary hover:underline">
              ← العودة إلى الرئيسية
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
