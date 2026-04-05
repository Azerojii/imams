import Link from 'next/link'
import { Landmark, MapPin } from 'lucide-react'
import ArticleListCard from '@/components/ArticleListCard'
import WikiHeader from '@/components/WikiHeader'
import WikiSidebar from '@/components/WikiSidebar'
import { getMosques } from '@/lib/wiki'

export const dynamic = 'force-dynamic'

export default async function MosquesPage() {
  const mosques = await getMosques()

  const byWilaya = new Map<string, typeof mosques>()
  const noWilaya: typeof mosques = []

  mosques.forEach(mosque => {
    if (mosque.wilaya) {
      if (!byWilaya.has(mosque.wilaya)) byWilaya.set(mosque.wilaya, [])
      byWilaya.get(mosque.wilaya)!.push(mosque)
    } else {
      noWilaya.push(mosque)
    }
  })

  return (
    <div className="min-h-screen bg-bg-main">
      <WikiHeader />

      <div className="mx-auto flex max-w-[1400px]">
        <WikiSidebar />

        <main className="max-w-[960px] flex-1 px-4 py-4 md:px-6">
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
            <div className="space-y-8">
              {Array.from(byWilaya.entries())
                .sort(([a], [b]) => a.localeCompare(b, 'ar'))
                .map(([wilayaName, wilayaMosques]) => (
                  <section key={wilayaName}>
                    <h2 className="mb-3 flex items-center gap-2 text-xl font-heading font-bold text-primary-dark">
                      <MapPin size={18} className="text-accent" />
                      {wilayaName}
                      <span className="text-sm font-normal text-text-secondary">({wilayaMosques.length})</span>
                    </h2>
                    <div className="grid gap-3 md:grid-cols-2">
                      {wilayaMosques.map(mosque => (
                        <ArticleListCard key={mosque.slug} article={mosque} />
                      ))}
                    </div>
                  </section>
                ))}

              {noWilaya.length > 0 && (
                <section>
                  <h2 className="mb-3 text-xl font-heading font-bold text-primary-dark">بدون ولاية محددة</h2>
                  <div className="grid gap-3 md:grid-cols-2">
                    {noWilaya.map(mosque => (
                      <ArticleListCard key={mosque.slug} article={mosque} />
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
