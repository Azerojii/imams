import Link from 'next/link'
import { MapPin } from 'lucide-react'
import HijabiWomanIcon from '@/components/HijabiWomanIcon'
import WikiHeader from '@/components/WikiHeader'
import WikiSidebar from '@/components/WikiSidebar'
import { getMourshibat } from '@/lib/wiki'

export const dynamic = 'force-dynamic'

export default async function MourshidatPage() {
  const mourshidat = await getMourshibat()

  const byWilaya = new Map<string, typeof mourshidat>()
  const noWilaya: typeof mourshidat = []
  mourshidat.forEach(m => {
    if (m.wilaya) {
      if (!byWilaya.has(m.wilaya)) byWilaya.set(m.wilaya, [])
      byWilaya.get(m.wilaya)!.push(m)
    } else {
      noWilaya.push(m)
    }
  })

  return (
    <div className="min-h-screen bg-bg-main">
      <WikiHeader />
      <div className="flex max-w-[1400px] mx-auto">
        <WikiSidebar />
        <main className="flex-1 px-4 md:px-6 py-4 max-w-[960px]">
          <h1 className="text-2xl md:text-4xl font-heading font-bold text-primary border-b-2 border-border-light pb-2 mb-2 flex items-center gap-3">
            <HijabiWomanIcon size={32} />
            المرشدات الدينيات
          </h1>
          <p className="text-text-secondary mb-6">{mourshidat.length} مرشدة دينية في الموسوعة</p>

          {mourshidat.length === 0 ? (
            <div className="text-center py-16 text-text-secondary">
              <HijabiWomanIcon size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">لا توجد مقالات عن المرشدات الدينيات بعد.</p>
              <Link href="/submit" className="text-primary hover:underline mt-2 inline-block">
                كن أول من يضيف مقالاً
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {Array.from(byWilaya.entries())
                .sort(([a], [b]) => a.localeCompare(b, 'ar'))
                .map(([wilayaName, wilayaMourshidat]) => (
                  <section key={wilayaName}>
                    <h2 className="text-xl font-heading font-bold text-primary-dark mb-3 flex items-center gap-2">
                      <MapPin size={18} className="text-accent" />
                      {wilayaName}
                      <span className="text-sm text-text-secondary font-normal">({wilayaMourshidat.length})</span>
                    </h2>
                    <div className="grid md:grid-cols-2 gap-3">
                      {wilayaMourshidat.map(m => (
                        <Link key={m.slug} href={`/wiki/${m.slug}`} className="card-islamic rounded-lg p-4 hover:no-underline">
                          <h3 className="font-bold text-primary">{m.title}</h3>
                          <p className="text-sm text-text-secondary mt-1 line-clamp-2">{m.description}</p>
                          {m.commune && <span className="text-xs text-accent-dark mt-2 inline-block">{m.commune}</span>}
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}
              {noWilaya.length > 0 && (
                <section>
                  <h2 className="text-xl font-heading font-bold text-primary-dark mb-3">بدون ولاية محددة</h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {noWilaya.map(m => (
                      <Link key={m.slug} href={`/wiki/${m.slug}`} className="card-islamic rounded-lg p-4 hover:no-underline">
                        <h3 className="font-bold text-primary">{m.title}</h3>
                        <p className="text-sm text-text-secondary mt-1 line-clamp-2">{m.description}</p>
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
