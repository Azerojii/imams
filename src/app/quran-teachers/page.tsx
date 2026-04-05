import Link from 'next/link'
import { BookOpen, MapPin } from 'lucide-react'
import ArticleListCard from '@/components/ArticleListCard'
import WikiHeader from '@/components/WikiHeader'
import WikiSidebar from '@/components/WikiSidebar'
import { getQuranTeachers } from '@/lib/wiki'

export const dynamic = 'force-dynamic'

export default async function QuranTeachersPage() {
  const teachers = await getQuranTeachers()

  const byWilaya = new Map<string, typeof teachers>()
  const noWilaya: typeof teachers = []

  teachers.forEach(article => {
    if (article.wilaya) {
      if (!byWilaya.has(article.wilaya)) byWilaya.set(article.wilaya, [])
      byWilaya.get(article.wilaya)!.push(article)
    } else {
      noWilaya.push(article)
    }
  })

  return (
    <div className="min-h-screen bg-bg-main">
      <WikiHeader />

      <div className="mx-auto flex max-w-[1400px]">
        <WikiSidebar />

        <main className="max-w-[960px] flex-1 px-4 py-4 md:px-6">
          <h1 className="mb-2 flex items-center gap-3 border-b-2 border-border-light pb-2 text-2xl font-heading font-bold text-primary md:text-4xl">
            <BookOpen size={32} />
            معلمو القرآن
          </h1>
          <p className="mb-6 text-text-secondary">{teachers.length} معلم قرآن في الموسوعة</p>

          {teachers.length === 0 ? (
            <div className="py-16 text-center text-text-secondary">
              <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">لا توجد مقالات عن معلمي القرآن بعد.</p>
              <Link href="/submit" className="mt-2 inline-block text-primary hover:underline">
                كن أول من يضيف مقالاً
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {Array.from(byWilaya.entries())
                .sort(([a], [b]) => a.localeCompare(b, 'ar'))
                .map(([wilayaName, wilayaArticles]) => (
                  <section key={wilayaName}>
                    <h2 className="mb-3 flex items-center gap-2 text-xl font-heading font-bold text-primary-dark">
                      <MapPin size={18} className="text-accent" />
                      {wilayaName}
                      <span className="text-sm font-normal text-text-secondary">({wilayaArticles.length})</span>
                    </h2>
                    <div className="grid gap-3 md:grid-cols-2">
                      {wilayaArticles.map(article => (
                        <ArticleListCard key={article.slug} article={article} />
                      ))}
                    </div>
                  </section>
                ))}

              {noWilaya.length > 0 && (
                <section>
                  <h2 className="mb-3 text-xl font-heading font-bold text-primary-dark">بدون ولاية محددة</h2>
                  <div className="grid gap-3 md:grid-cols-2">
                    {noWilaya.map(article => (
                      <ArticleListCard key={article.slug} article={article} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
