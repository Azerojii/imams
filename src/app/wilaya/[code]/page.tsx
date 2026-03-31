import Link from 'next/link'
import { MapPin, UserCircle, Landmark } from 'lucide-react'
import WikiHeader from '@/components/WikiHeader'
import WikiSidebar from '@/components/WikiSidebar'
import { getArticlesByWilaya } from '@/lib/wiki'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const wilayaName = decodeURIComponent(code)
  return {
    title: `${wilayaName} - موسوعة أئمة ومساجد الجزائر`,
  }
}

export default async function WilayaPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const wilayaName = decodeURIComponent(code)
  const articles = await getArticlesByWilaya(wilayaName)
  const imams = articles.filter(a => a.articleType === 'imam')
  const mosques = articles.filter(a => a.articleType === 'mosque')

  return (
    <div className="min-h-screen bg-bg-main">
      <WikiHeader />

      <div className="flex max-w-[1400px] mx-auto">
        <WikiSidebar />

        <main className="flex-1 px-4 md:px-6 py-4 max-w-[960px]">
          {/* Breadcrumbs */}
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
          <p className="text-text-secondary mb-8">
            {articles.length} مقال ({imams.length} إمام و {mosques.length} مسجد)
          </p>

          {articles.length === 0 ? (
            <div className="text-center py-16 text-text-secondary">
              <MapPin size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">لا توجد مقالات لهذه الولاية بعد.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Imams */}
              {imams.length > 0 && (
                <section>
                  <h2 className="text-xl font-heading font-bold text-primary-dark mb-3 flex items-center gap-2">
                    <UserCircle size={20} />
                    الأئمة
                    <span className="text-sm text-text-secondary font-normal">({imams.length})</span>
                  </h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {imams.map(imam => (
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

              {/* Mosques */}
              {mosques.length > 0 && (
                <section>
                  <h2 className="text-xl font-heading font-bold text-primary-dark mb-3 flex items-center gap-2">
                    <Landmark size={20} />
                    المساجد
                    <span className="text-sm text-text-secondary font-normal">({mosques.length})</span>
                  </h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {mosques.map(mosque => (
                      <Link
                        key={mosque.slug}
                        href={`/wiki/${mosque.slug}`}
                        className="card-islamic rounded-lg p-4 hover:no-underline"
                      >
                        <h3 className="font-bold text-primary">{mosque.title}</h3>
                        <p className="text-sm text-text-secondary mt-1 line-clamp-2">{mosque.description}</p>
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
