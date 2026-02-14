import Link from 'next/link'
import { BookOpen, MapPin } from 'lucide-react'
import WikiHeader from '@/components/WikiHeader'
import WikiSidebar from '@/components/WikiSidebar'
import { getImams } from '@/lib/wiki'

export const dynamic = 'force-dynamic'

export default async function ImamsPage() {
  const imams = await getImams()

  // Group by wilaya
  const byWilaya = new Map<string, typeof imams>()
  const noWilaya: typeof imams = []
  imams.forEach(imam => {
    if (imam.wilaya) {
      if (!byWilaya.has(imam.wilaya)) byWilaya.set(imam.wilaya, [])
      byWilaya.get(imam.wilaya)!.push(imam)
    } else {
      noWilaya.push(imam)
    }
  })

  return (
    <div className="min-h-screen bg-bg-main">
      <WikiHeader />

      <div className="flex max-w-[1400px] mx-auto">
        <WikiSidebar />

        <main className="flex-1 px-6 py-4 max-w-[960px]">
          <h1 className="text-4xl font-heading font-bold text-primary border-b-2 border-border-light pb-2 mb-2 flex items-center gap-3">
            <BookOpen size={32} />
            الأئمة
          </h1>
          <p className="text-text-secondary mb-6">{imams.length} إمام في الموسوعة</p>

          {imams.length === 0 ? (
            <div className="text-center py-16 text-text-secondary">
              <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">لا توجد مقالات عن أئمة بعد.</p>
              <Link href="/submit" className="text-primary hover:underline mt-2 inline-block">
                كن أول من يضيف مقالاً
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {Array.from(byWilaya.entries())
                .sort(([a], [b]) => a.localeCompare(b, 'ar'))
                .map(([wilayaName, wilayaImams]) => (
                  <section key={wilayaName}>
                    <h2 className="text-xl font-heading font-bold text-primary-dark mb-3 flex items-center gap-2">
                      <MapPin size={18} className="text-accent" />
                      {wilayaName}
                      <span className="text-sm text-text-secondary font-normal">({wilayaImams.length})</span>
                    </h2>
                    <div className="grid md:grid-cols-2 gap-3">
                      {wilayaImams.map(imam => (
                        <Link
                          key={imam.slug}
                          href={`/wiki/${imam.slug}`}
                          className="card-islamic rounded-lg p-4 hover:no-underline"
                        >
                          <h3 className="font-bold text-primary">{imam.title}</h3>
                          <p className="text-sm text-text-secondary mt-1 line-clamp-2">{imam.description}</p>
                          {imam.commune && (
                            <span className="text-xs text-accent-dark mt-2 inline-block">{imam.commune}</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}
              {noWilaya.length > 0 && (
                <section>
                  <h2 className="text-xl font-heading font-bold text-primary-dark mb-3">بدون ولاية محددة</h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {noWilaya.map(imam => (
                      <Link
                        key={imam.slug}
                        href={`/wiki/${imam.slug}`}
                        className="card-islamic rounded-lg p-4 hover:no-underline"
                      >
                        <h3 className="font-bold text-primary">{imam.title}</h3>
                        <p className="text-sm text-text-secondary mt-1 line-clamp-2">{imam.description}</p>
                      </Link>
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
